const jwt = require("jsonwebtoken");
const client = require('../reditConnect');
const User = require('../models/User');
const Subscribers = require('../models/Subscribers');
const {sendConfirmationEmail, resetPasswordLink, subscribeEmailConfirmation } = require('../services/Emailservice');
const bcrypt = require("bcrypt")



//to verify the jwt email verification token sent to user
const Emailverify = async (req, res, next) =>{
    console.log('verify this acct')
    
    try{
        const tokenId = req.params.tokenId;
        const user = await User.findById(req.params.userId);
        console.log(user.username)
        if(user.isVerified === true){
             return res.status(500).json('Account has been verified already');
        };

        const getRedis = await client.GET(user._id.toString());
        
        if(!getRedis){
            return res.status(401).json('Verification Token not found');
        };
        if(!user){
            return res.status(404).json('User not found');
        };
        if(!tokenId){
            return res.status(404).json('Token not found');
        }
        if(getRedis !== tokenId ){
           
            return res.status(401).json('Invalid link. Link address is broken. Check and try again');
           
        };
        jwt.verify(tokenId, process.env.EMAIL_JWT_SECRET, async (err, user)=>{
            if(err){
                console.log(err)
                return res.status(403).json("Unable to verify expired token, please resend token");
            };
            

            await User.findByIdAndUpdate(user.userId, {
                    isVerified:true
                }, {new: true});
            await client.DEL(user.userId.toString());
                
            return res.status(200).json("Account has been verified") 

        });

             
    }catch(err){
       
        return res.status(401).json("One or all required parameters not valid")
    };     
};

//function to resend email verification link for a user who is yet to be verified
const resendVerificationLink = async (req, res) =>{
    try{
        const email = req.body.email;

        const user = await User.findOne({email: email});
        console.log(user)

        if(user.isVerified === false){
            
            const emailToken = await sendConfirmationEmail(user, res);
            await  client.SET(user._id.toString(), emailToken)

            return res.status(200).json({Id:user._id, emailToken})
        }else{
             return res.status(500).json("User has already been verified")
        };
        
    }catch(err){
        console.log(err)
        return res.status(401).json('Something went wrong')
    };

};

//function to generate link to user's email for password reset
const resetPassword = async (req, res) =>{
    try{
        email = req.body.email;

        const findEmail = await User.findOne({email: email});
        if(!findEmail){
            return res.status(500).json("User not found")
        }
            const emailToken = await resetPasswordLink(findEmail);
            await  client.SET(findEmail._id.toString(), emailToken)
            return res.status(200).json({Id:findEmail._id, emailToken})

    }catch(err){
        console.log(err)
        return res.status(500).json("Something went wrong")
    }
};

//function to verify the jwt token sent to user's email for password reset
const verifyPasswordResetLink = async (req, res, next) =>{
    try{
         const tokenId = req.params.passwordId;
         if(!tokenId){
             return res.status(404).json('Token not found');
         }
            jwt.verify(tokenId, process.env.PASSWORD_RESET_SECRET, (err, user)=>{
                if(err){
                   return res.status(403).json("Unable to verify expired token, please resend token"); 
                }
                 req.user = user;
            
                next()  
            });
                 
    }catch(err){
        console.log(err);
        return res.status(500).json('Something went wrong')
            
    };
};


//function to give user permission to change their password. This is only valid if the jwt token is verified
const changePassword = async (req, res) =>{
    
    try{
       const _id = req.user.userId
        const user = await User.findById(_id);
        const paramId = req.params.passwordId;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        
        const getRedis = await client.GET(user._id.toString())
        if(!getRedis){
            return res.status(401).json('You are not authorized, reset token not found') 
        };
       
        if(!user){
             return res.status(404).json('User not found') 
        };
        console.log(password == confirmPassword)
        if(password != confirmPassword){
             return res.status(401).json('Confirm password does not match password') 
        }
         if(password && user._id.toString() === req.body.userId){
                const salt = await bcrypt.genSalt(10);
                hashedPassword = await bcrypt.hash(password, salt);

                //values that should be updated
                    await User.findByIdAndUpdate(_id,{
                    password: hashedPassword,
                   
               }, {new: true}); 
               //Delete user's key from redis database
                await client.DEL(user._id.toString())
                return res.status(200).json('updated') 
                     
            }else{
               return res.status(500).json('Not updated')    
            }; 
         
    }catch(err){
        console.log(err);
        return res.status(500).json('Something went wrong')
    }
};

//function to verify subscriber email

const verifySubscriberEmail = async (req, res)=>{
    console.log('verify email')
    try{
         const tokenId = req.params.emailtokenId;
        const userId = req.params.emailuserId;
        console.log(tokenId, userId, 'check id and token')
         if(!tokenId){
            return res.status(404).json('verification id must be present')
         }
         if(!userId){
            return res.status(404).json('user id must be present')
         }
        
         const user = await Subscribers.findById({_id: userId});
         console.log(user)
          if(!user){
            return res.status(404).json('user not found')
          }

          if(user.isVerified == true){
            return res.status(500).json('user email has been verified already')
          }
          jwt.verify(tokenId, process.env.EMAIL_JWT_SECRET, async (err, user)=>{
            if(err){
                console.log(err)
                return res.status(403).json("Unable to verify expired token, please resend token");
            };
            

            await Subscribers.findByIdAndUpdate({_id: userId,}, {
                    isVerified:true
                }, {new: true});
                
            return res.status(200).json("Email has been verified") 

        });

        

    }catch(err){
        return res.status(500).json('something went wrong')
    }
}

//function to resend email verification link for a user who is yet to be verified
const resendSubscriberEmailVerification = async (req, res) =>{
    try{
        const subscriberEmail = req.params.userId;
        console.log(subscriberEmail)

        const user = await Subscribers.findById({_id:subscriberEmail});
        if(!user){
            return res.status(404).json('subscriber not found')
        }

        if(user.isVerified === false){
            
            const emailToken = await subscribeEmailConfirmation(user, res);

            return res.status(200).json({Id:user._id, emailToken})
        }else{
             return res.status(500).json("User has already been verified")
        };
        
    }catch(err){
        console.log(err)
        return res.status(401).json('Something went wrong')
    };

};

module.exports = {Emailverify,
resendVerificationLink,
 resetPassword,
 verifyPasswordResetLink,
 changePassword,
 verifySubscriberEmail,
 resendSubscriberEmailVerification,

}