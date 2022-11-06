const request = require('supertest')
const http = require('http');
//const connectDB = require('../db/connect')
const mongoose = require('mongoose');
const app = require('../app');
const connectDB = require('../db/connect');
const { response } = require('../app');
require('dotenv').config();//declaring the envy file
const fs = require('fs');
const cloudinary = require('../services/Cloudinary');
const { json } = require('express');
const Post = require('../models/Post');




let userToken;
let userId;
let photoPublicId;
let postPhotoArray
let postPhoto;

describe('POST Test', ()=>{
   beforeAll(async() => {
        await connectDB(process.env.MONGO_URL)
    });   

afterAll(async () => {
        await mongoose.disconnect();
      });


//test getting posts
describe('Test GET /api/v1/posts', ()=>{
    
    
    //afterAll(async () => { await connectDB.disconnect(); });
    
    test('It should respond with 200 success', async ()=>{
        const response = await request(app).get('/api/v1/posts/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        
        //expect(response.statusCode).toBe(200);
        
        
    }, 30000);
    
})



describe('Test POST /api/v1/auth/login', ()=>{
    const demoUser = {
        username: "prince",
        password: "123"
    }
    
    test('It should respond with 200 OK', async ()=>{
        const response = await request(app).post('/api/v1/auth/login')
        .send(demoUser)
        .expect('Content-Type', /json/)
        .expect(200)
        userToken = response.body.token
        userId = response.body.userId


    }, 30000)
    
})


/*test upload image
describe('Test POST /api/v1/posts/uploadImage', ()=>{
    const name = (__dirname + '/../images/demo.png')

    if (fs.existsSync(name)) {
        console.log('Directory exists!')
      } else {
        console.log('Directory not found.')
      }
    
    console.log(name, 'image')
    test('It should respond with 200 success', async ()=>{
        console.log(userToken, 'user token')
       return response = await request(app).post('/api/v1/posts/uploadImage')
        .set('Authorization', 'bearer ' + userToken, )
        .attach("file", (__dirname + '/../images/demo.png'))      
        //expect(response.statusCode).toBe(200);
        .expect(200)
        
    }, 40000);
    
    //console.log(response)
})
*/




//test making posts
describe('Test POST /api/v1/posts', ()=>{

    const newPost = {
        username: "628cf9594aea9c5450a6f4a5",
        postPhoto: "https://res.cloudinary.com/blognodeapi/image/upload/v1658836053/nodeblog/egubupgnodtokscugb33.jpg",
        title: "Where does it come from? I am testing a post from test",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        categories: "Life",
        photoPublicId: JSON.stringify(["nodeblog/cominppdn220lterbnt5"]),
        postPhotoArray:JSON.stringify(["https://res.cloudinary.com/blognodeapi/image/upload/v1658836053/nodeblog/egubupgnodtokscugb33.jpg"]),
    }
    
    
    //afterAll(async () => { await connectDB.disconnect(); });
    
    test('It should respond with 200 success', async ()=>{
        console.log(userToken, 'user token')
        const response = await request(app).post('/api/v1/posts/')
        .set('Authorization', 'Bearer ' + userToken)
        .send(newPost)
        .expect('Content-Type', /json/)
        .expect(200)
        
        //expect(response.statusCode).toBe(200);
        
        await Post.findOneAndDelete({title: newPost.title})
    }, 40000);
    
})

})

