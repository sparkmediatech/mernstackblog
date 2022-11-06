const request = require('supertest')
const http = require('http');
//const connectDB = require('../db/connect')
const mongoose = require('mongoose');
const app = require('../app');
const connectDB = require('../db/connect');
const { set } = require('../app');
require('dotenv').config();//declaring the envy file
const { mock } = require('nodemailer');
const User = require('../models/User');



describe('USER Test', ()=>{
    beforeAll(async() => {
        await connectDB(process.env.MONGO_URL)
    }); 

afterAll(async () => {
        await mongoose.disconnect();
      });


const sentEmails = mock.getSentMail();
//test user reg
describe('Test POST /api/v1/auth/register', ()=>{
    
//variables
    const signup = {
        username: "Mide",
        email: "servicetessy@gmail.com",
        password: "Xyz1990got@",
        confirmPassword: "Xyz1990got@"
      } 


    const noPasswordError = {
        username: "Mide1",
        email: "daracoder20@gmail1.com",
    }

    const passwordLessThan8 = {
        username: "Mide2",
        email: "daracoder20@gmail2.com",
        password: "1234567",
        confirmPassword: "1234567"
    }


    const emptyEmailError = {
        username: "Mide3",
        password: "Xyz1990got@",
        confirmPassword: "Xyz1990got@"
    }


    const invalidEmail = {
        username: "Mide4",
        email: "daracoder20@gmail",
        password: "Xyz1990got@",
        confirmPassword: "Xyz1990got@"
    }


    const passwordCondition = {
        username: "Mide5",
        email: "daracoder20@gmail5.com",
        password: "Xyz1990got",
        confirmPassword: "Xyz1990got"
    }
    

    const passwordMatchError = {
        username: "Mide6",
        email: "daracoder20@gmail6.com",
        password: "Xyz1990got@6",
        confirmPassword: "Xyz1990got@7"
    }


    const userNamePresent = {
        email: "daracoder20@gmail7.com",
        password: "Xyz1990got@6",
        confirmPassword: "Xyz1990got@7"
    }


    const userExistError = {
        username: "prince",
        email: "thatkingz19@gmail1.com",
        password: "Xyz1990got@",
        confirmPassword: "Xyz1990got@"
    }

    const emailAlreadyExist = {
        username: "Mide9",
        email: "dara@gmail.com",
        password: "Xyz1990got@",
        confirmPassword: "Xyz1990got@" 
    }



    test('It should respond with 200 success', async ()=>{
        const response = await request(app).post('/api/v1/auth/register')
        .send(signup)
        
        .expect('Content-Type', /json/)
        .expect(200)
        expect(sentEmails.length).toBe(1)

        
        //expect(response.statusCode).toBe(200);
        
        //delete the reg user

        await User.findOneAndDelete({username: signup.username})
    }, 30000);

    //test errors on reg
    test('It should respond with 500 password must be present', async ()=>{
        const response = await request(app).post('/api/v1/auth/register')
        .send(noPasswordError)
        .expect('Content-Type', /json/)
        .expect(500)
    }, 30000)


    test('It should respond with 500 password must not be less than 8 characters', async ()=>{
        const response = await request(app).post('/api/v1/auth/register')
        .send(passwordLessThan8)
        .expect('Content-Type', /json/)
        .expect(500)
    }, 30000)


    test('It should respond with 500 email must be present', async ()=>{
        const response = await request(app).post('/api/v1/auth/register')
        .send(emptyEmailError)
        .expect('Content-Type', /json/)
        .expect(500)
    }, 30000)



    test('It should respond with 500 your email is not valid', async ()=>{
        const response = await request(app).post('/api/v1/auth/register')
        .send(invalidEmail)
        .expect('Content-Type', /json/)
        .expect(500)
    }, 30000)



    test('It should respond with 500 password must contain at least 1 upper case, lower case, number and special characters', async ()=>{
        const response = await request(app).post('/api/v1/auth/register')
        .send(passwordCondition)
        .expect('Content-Type', /json/)
        .expect(500)
    }, 30000)



    test('It should respond with 500 Password does not match', async ()=>{
        const response = await request(app).post('/api/v1/auth/register')
        .send(passwordMatchError)
        .expect('Content-Type', /json/)
        .expect(500)
    }, 30000)




    test('It should respond with 500 username must be present', async ()=>{
        const response = await request(app).post('/api/v1/auth/register')
        .send(userNamePresent)
        .expect('Content-Type', /json/)
        .expect(500)
    }, 30000)


    test('It should respond with 401 User already exist', async ()=>{
        const response = await request(app).post('/api/v1/auth/register')
        .send(userExistError)
        .expect(401)
    }, 30000)



    test('It should respond with 500 Email already exist', async ()=>{
        const response = await request(app).post('/api/v1/auth/register')
        .send(emailAlreadyExist)
        .expect('Content-Type', /json/)
        .expect(500)
    }, 30000)
    
    
})


let userToken;
let userId;
let adminToken;


describe('Test POST /api/v1/auth/login', ()=>{
    //test user login


const demoUser = {
    username: "prince",
    password: "123"
}


const adminUser = {
    username: "Dave",
    password: "123",
    role: "admin"

}

const unverifiedUser = {
    username: "Dara",
    password: "123",
    isVerified: false
}

    test('It should respond with 200 OK', async ()=>{
        const response = await request(app).post('/api/v1/auth/login')
        .send(demoUser)
        .expect('Content-Type', /json/)
        .expect(200)
        userToken = response.body.token
        userId = response.body.userId
    }, 30000)
    
    
    test('It should respond with 401 you are not authorized to access this page', async ()=>{
        const response = await request(app).post('/api/v1/auth/login')
        .send(adminUser)
        .expect('Content-Type', /json/)
        .expect(401)
    }, 30000)


    test('It should respond with 401 Your account is yet to be verified', async ()=>{
        const response = await request(app).post('/api/v1/auth/login')
        .send(unverifiedUser)
        .expect('Content-Type', /json/)
        .expect(401)
    }, 30000)
})






describe('Test POST /api/v1/auth/admin', ()=>{
    const adminUser = {
        username: "Dave",
        password: "123",
        role: "admin"
    
    }
    

    const user = {
        username: "prince",
        password: "123"
    }





    test('It should respond with 200 OK', async ()=>{
        const response = await request(app).post('/api/v1/auth/admin')
        .send(adminUser)
        .expect('Content-Type', /json/)
        .expect(200)
        adminToken = response.body.token
    }, 30000)
    

    test('It should respond with 401 You do not have permission', async ()=>{
        const response = await request(app).post('/api/v1/auth/admin')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(401)
        adminToken = response.body.token
    }, 30000)

})





})



