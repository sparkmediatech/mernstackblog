const User = require("../models/User"); 
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const client = require('../reditConnect');
const {sendConfirmationEmail, emailToken} = require('../services/Emailservice');
const crypto = require('crypto');

//function to register a user
const register = async (req, res) =>{
    try{
        const salt = await bcrypt.genSalt(10);
        const password = req.body.password;
        const validRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validPassword = /^([^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/
       
        
        const checkUser = await User.exists({username: req.body.username});
        if(checkUser){
             return res.status(401).json("User already exist")
        }

        if(!password){
            return res.status(500).json('password must be present')
        }

        if(password.length < 8){
            return res.status(500).json('password must not be less than 8 characters')
        }
        const hashedPass = await bcrypt.hash(password, salt);
        const confirmPassword = await bcrypt.hash(req.body.confirmPassword, salt);
        const email = req.body.email;
        
        if(!email){
            return res.status(500).json('email must be present')
        }

        if(!email.match(validRegex)){
            return res.status(500).json('your email is not valid')
        }

        if(password.match(validPassword)){
            return res.status(500).json('password must contain at least 1 upper case, lower case, number and special characters')
        }
       
        if(hashedPass !== confirmPassword){
            return res.status(500).json("Password does not match")
        }
        if(!req.body.username){
            return res.status(500).json('username must be present')
        }
        const checkEmail = await User.exists({email: email});
       if(checkEmail){
            return res.status(500).json("Email already exist")
       }
        const newUser = new User({
          
            username: req.body.username,
            email: req.body.email,
            password: hashedPass 
        })
        const user = await newUser.save();
        
        const emailToken = await sendConfirmationEmail(user, res);
        if(emailToken){
            await  client.SET(user._id.toString(), emailToken);
        
            return res.status(200).json('email sent')
        }else{
         
            return res.status(500).json('something went wrong with email')
        }
       
       
        

    } catch(err){
        console.log(err)
        res.status(500).json('something went wrong');
        
    }
}


//login

const login = async (req, res) =>{
    try {
        const resUser = await User.findOne({username: req.body.username});
        
        if(!resUser){
            return res.status(404).json('no user found')
        }
        let passValidate
        if(resUser) {
            passValidate = await bcrypt.compare(req.body.password, resUser.password)
        }
       
        if(!resUser || !passValidate) {
           return res.status(401).json("Wrong credentials");
        };
         if(resUser.role === 'admin'){
            return res.status(401).json("You're not authorized to access this page");
        }
        if(resUser.isVerified === false){
            return res.status(401).json("Your account is yet to be verified");
        }else {
            const user ={
                _id: resUser._id,
                username: resUser.username,
                profilepicture:resUser.profilePicture,
                role: resUser.role,
            }
           //generate random strings
            const sessionId = crypto.randomBytes(12).toString('hex');  
            const userId = user._id
               
            //generate access token
            const token = resUser.JWTAccessToken()
            //generate refresh token
            const refreshToken = resUser.JWTRefreshToken()
              //set refresh token in redis database

              await client.set(user._id.toString(), (refreshToken));

              const key = await client.get(user._id.toString())

              console.log(key,' key')

                res.cookie('refreshJWT', refreshToken, {
                httpOnly: true,
                maxAge: 604800000,
            } )
            return res.status(200).json({token, userId})
        } 
    } catch(err) {
        
        return res.status(500).json('Something went wrong');
    }
}


//admin logic
const admin = async (req, res) =>{
try{const user = await User.findOne({username: req.body.username})
    if(!user){
        return res.status(404).json('No user found'); 
    }
   let passValidate
   if(user) {
       passValidate = await bcrypt.compare(req.body.password, user.password)    
   }
   if(!passValidate){
       return res.status(401).json('Wrong credentials'); 
   }
   if(user.isVerified === false){
        return res.status(401).json('Your account is not verified yet'); 
   }
   if(user.role !== "admin"){
      return res.status(401).json("You do not have permission")
   }else{
        //generate access token
         const token = user.JWTAccessToken()
        //generate refresh token
         const refreshToken = user.JWTRefreshToken()
        //generate random strings
        const sessionId = crypto.randomBytes(12).toString('hex');     
        //save in redis db
         await client.set(user._id.toString(), (refreshToken));

                res.cookie('refreshJWT',  refreshToken, {
                httpOnly: true,
                maxAge: 604800000,
            } )

               return res.status(200).json({token, sessionId})
       
   }
}catch(err){
    
   return res.status(500).json('something went wrong');
    
}
};


const logOut = async (req, res) =>{
    //On the client side also delete accessToken
try{
     const cookies = req.cookies;
    if(!cookies?.refreshJWT){
        return res.status(200).json("No content found");
    };
    console.log(req.user)
    const user = await User.findById(req.user.userId);
    //console.log(user)
    const refreshToken = cookies.refreshJWT; 
    if(!user){
        res.clearCookie('refreshJWT', {httpOnly: true});
        return res.status(200).json({message:"No user found, cleared"});
    };
    //check for user and refreshToken in redis db 
    const key = await client.get(user._id.toString());
    if(key !== refreshToken){
        res.clearCookie('refreshJWT', {httpOnly: true});//add secure true in production
        return res.status(200).json({message : "unmatched key, cleared"});
    }
    //delete from redis db and clear cookie
    await client.DEL(user._id.toString());
    res.clearCookie('refreshJWT', {httpOnly: true});//add secure true in production
    return res.status(200).json({message : "Logged Out successfully"});
}catch(err){
    console.log(err)
     return res.status(500).json('Something went wrong');
}
   
}



module.exports = {
    register,
    login,
    admin,
    logOut,
}
