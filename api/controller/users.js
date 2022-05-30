const User = require("../models/User"); 
const Post = require("../models/Post")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const client = require('../reditConnect');
const {deleteCloudinary, uploadCloudinary, deleteAllFiles} = require('../middleware/CloudinaryFunctions');
const fs = require('fs')






//update
const updateUser = async (req, res) =>{
    const aboutUserString = req.body.aboutUser;
    //convert first letter to capital letter
    const aboutUserCaps = aboutUserString.charAt(0).toUpperCase() + aboutUserString.slice(1)
try{ 
   
    const resUser = await User.findById(req.user.userId);
     
    if(!resUser){
         if(req.file){
                 fs.unlinkSync(req.file.path);
           }
       return res.status(404).json('No user found'); 
    };
    if(resUser.isBlocked === true){
        if(req.file){
                 fs.unlinkSync(req.file.path);
           }
        return res.status(401).json('You are banned from updating your profile'); 
    };
    if(resUser.isVerified === false){
        if(req.file){
                 fs.unlinkSync(req.file.path);
           }
        return res.status(401).json('You are not authorized from updating your profile'); 
    };
   
    if(resUser._id.toString() === req.params.id){
        
       if(aboutUserCaps === '' ||  aboutUserCaps === null ||  !aboutUserCaps){
           if(req.file){
                 fs.unlinkSync(req.file.path);
           }
          
           return res.status(500).json('about user section must not be empty')
            
       }
       //check the user about string count
       const string = aboutUserCaps.split('');
       const aboutUserWordCount = string.filter(word => word !== '').length;
       console.log(aboutUserWordCount)
       if( aboutUserWordCount >= 400){
           if(req.file){
                 fs.unlinkSync(req.file.path);
           }
           return res.status(500).json('about section must not be more than 400 words')
            
       }
       if(aboutUserWordCount <= 45){
          if(req.file){
                 fs.unlinkSync(req.file.path);
           }
           return res.status(500).json('about user section must not be less than 45 words')
            
       }
                //values that should be updated
           const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                    username: req.body.username,
                    aboutUser: aboutUserCaps               
               }, {new: true}); 

               //get the current user profile pics public id for cloudinary delete operations
                const currentUserPhotoPublicId = updatedUser.photoPublicId
                
            //upload image to cloudnary if user uploaded an image
            
            if(req.file){
                const fileStr = req.file.path
                //calling the cloudinary function for upload
                const uploadResponse = await uploadCloudinary(fileStr);
                const result = {
                    url: uploadResponse.secure_url,
                    publicId: uploadResponse.public_id
                    }
                //push image to upated user
                const updateUserProfilePics = await User.findByIdAndUpdate(updatedUser._id, {
                         photoPublicId: result.publicId,
                         profilePicture: result.url
                    }, {new: true}) 
                //get the updated user profile pics public id for cloudinary delete operations
                const updatedUserPhotoPublicId = updateUserProfilePics.photoPublicId;

                 //compare the two public ids. If they are not same and the value is not an empty string, the cloudinary delete method would run
                if(currentUserPhotoPublicId !== "" && currentUserPhotoPublicId !== updatedUserPhotoPublicId && updateUserProfilePics.photoPublicId !== " "){
                    console.log('I ran here')
                    await deleteCloudinary(resUser.photoPublicId)
                }
                
            }
            
           //generate new access and refresh tokens since user updated their profile.
           const token = resUser.JWTAccessToken();
           const refreshToken = resUser.JWTRefreshToken()
           
            //set the new refresh token in redis database
             await client.set(updatedUser._id.toString(), (refreshToken));
                //set a new cookie with the new refresh token
                res.cookie('refreshJWT',  refreshToken, {
                httpOnly: true,
                maxAge: 604800000,
            } )
             
            return res.status(200).json({token});
            
   } else{
        if(req.file){
                 fs.unlinkSync(req.file.path);
           }
       return res.status(401).json("You can only update your account!")
   };
}catch(err){
    if(req.file){
                 fs.unlinkSync(req.file.path);
           }
    return res.status(500).json("Something went wrong, try again");
};
  
};


//delete logic
const deleteUser = async (req, res) =>{
try{
      const user = await User.findById(req.user.userId);
      if(!user){
          return res.status(401).json('No user found')
      }
    if(user._id.toString() === req.params.id){

                //get refresh token of user saved in redis
                const key = await client.get(user._id.toString());
                if(!key){
                        await User.findByIdAndDelete(req.params.id);
                        return res.status(200).json("Key not found in database, User has been deleted");    
                };
                       
                //check for user's cookie
                const cookies = req.cookies;
                    if(!cookies?.refreshJWT){
                        await User.findByIdAndDelete(req.params.id)
                        return res.status(200).json("No cookie found, user has been deleted");
                    };
                       //clear cookie and redis database of deleted user                         
                        res.clearCookie('refreshJWT', {httpOnly: true});
                        //delete all post images associated with this user from cloudinary
                        //first find all posts this user has created
                        //then, get the public id object and return as a single array of publicIds
                        const userPosts = await Post.find({username: req.user.userId})
                        const arrayOfPostsImagePublicId = userPosts.map((singleImagePublicId)=>{
                            return singleImagePublicId.photoPublicId
                        })
                        //pass the array of public image ids to the cloudinary deleteall method
                        await deleteAllFiles(arrayOfPostsImagePublicId)
                        await User.findByIdAndDelete(req.params.id)
                        await client.DEL(user._id.toString());
                        //delete user's pics from cloudinary
                        await deleteCloudinary(user.photoPublicId)
                        
                        return res.status(200).json("User has been deleted");                                 
   } else{
      return res.status(401).json("You can only delete your account!");
   };
}catch(err){
    return res.status(500).json(err);
}
};


//Get User
const getSingleUser = async (req, res)=>{
    try{
        
        const getUser = await User.findById(req.user.userId);
        if(!getUser){
             return res.status(404).json("No user found");
        }
        if(getUser.role !== 'admin'){
            return res.status(404).json("You are not permitted");
        }
        const user = await User.findById(req.params.id).populate('userPosts', 'title');
        const {password,createdAt,updatedAt,__v, ...others} = user._doc;
        res.status(200).json(others);
       
    }catch(err){
       return res.status(500).json(err);
    };

};


//Get all users

const getAllUsers = async (req, res) =>{
    
    try{
        
        const adminUser = await User.findById(req.user.userId);
        if(!adminUser){
             return res.status(404).json('No user found');
        }
        if(adminUser.role !== 'admin'){
            return res.status(401).json('You are not authorized to access this page');
        }
       
        try{
           const allUsers = await User.find({role: 'user'});
           return res.status(200).json(allUsers);
        }catch(err){
            return res.status(404).json('No users found');
        }
    }catch(err){
         return res.status(500).json('Something went wrong');
    }
}

//blocking user
const handleBlocking = async (req, res) =>{
    try{
        const userToBlock = await User.findById(req.params.userId);
        const adminUser = await User.findOne({username: req.user.username});
        const expDate = req.body.expDate
        
        if(!expDate){
            return res.status(401).json("You must provide expiry date")
        }
    
        if(!userToBlock || !adminUser){
            return res.status(404).json("User not found")
        };

        if(adminUser.role !== 'admin'){
              return res.status(401).json("You are not authorized to carry it this feature")
        };
        if(userToBlock.isBlocked == true){
            return res.status(500).json("User has already been blocked")
        };
    if(adminUser.role === 'admin' && userToBlock._id.toString() === req.params.userId){
          const user = await User.findByIdAndUpdate(req.params.userId,{
                    isBlocked: true, 
                    expDate: expDate
               }, {new: true}); 
         return res.status(200).json( user);
    }else{
         return res.status(401).json('Action can not be completed due to unathourized access or user not found');
    };

    }catch(err){

    }
        
    
};

//unblock user
const handleUnblock = async (req, res) =>{
    const userToUnblock = await User.findById(req.params.userId);
    const adminUser = await User.findOne({username: req.user.username});

    if(!userToUnblock || !adminUser){
        return res.status(404).json("User not found");
            
    };

    if(adminUser.role != 'admin'){
        return res.status(401).json("You are not authorized to carry out this feature");
    };
    if( userToUnblock.isBlocked == false){
         return res.status(500).json("User is has already been unblocked");
    }
    if(adminUser.role === 'admin' && userToUnblock._id.toString() === req.params.userId){
           const user = await User.findByIdAndUpdate(req.params.userId,{
                    isBlocked: false,
                    expDate: null 
               }, {new: true}); 
         return res.status(200).json(user);
    }else{
         return res.status(401).json('Action can not be completed due to unathourized access or user not found');
    };
};


module.exports = {
    updateUser,
    deleteUser,
    getSingleUser,
    getAllUsers,
    handleBlocking,
    handleUnblock
}