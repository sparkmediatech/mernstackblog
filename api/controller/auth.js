const User = require("../models/User"); 
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const client = require('../reditConnect');
const {sendConfirmationEmail, emailToken} = require('../services/Emailservice');
const crypto = require('crypto');

//function to register a user
const register = async (req, res) =>{
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(req.body.password, salt);
        const confirmPassword = await bcrypt.hash(req.body.confirmPassword, salt);
        const email = req.body.email;
        if(hashedPass !== confirmPassword){
            return res.status(404).json("Password does not match")
        }

       checkEmail = await User.findOne({email: email})
       if(checkEmail){
            return res.status(401).json("Email already exist")
       }
        const newUser = new User({
          
            username: req.body.username,
            email: req.body.email,
            password: hashedPass 
        })
        const user = await newUser.save();
        const emailToken = await sendConfirmationEmail(user, res);
       
       
        await  client.SET(user._id.toString(), emailToken);
        
        return res.status(200).json({Id:user._id, emailToken})

    } catch(err){
        res.status(500).json(err);
        console.log(err) 
    }
}


//login

const login = async (req, res) =>{
    try {
        const resUser = await User.findOne({username: req.body.username});
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
               
            //generate access token
            const token = resUser.JWTAccessToken()
            //generate refresh token
            const refreshToken = resUser.JWTRefreshToken()
              //set refresh token in redis database

              await client.set(user._id.toString(), (refreshToken));

              const key = await client.get(user._id.toString())
              console.log(key, user._id, 'checking redis key')

                res.cookie('refreshJWT', refreshToken, {
                httpOnly: true,
                maxAge: 604800000,
            } )
            return res.status(200).json({token, sessionId})
        } 
    } catch(err) {
        console.log(err)
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
      return res.status(400).json("You do not have permission")
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
    console.log(err)
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
