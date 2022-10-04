const User = require("../models/User"); 
const Post = require("../models/Post")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const client = require('../reditConnect');
const {deleteCloudinary, uploadCloudinary, deleteAllFiles} = require('../middleware/CloudinaryFunctions');
const fs = require('fs');
const {getPagination, getUserPagination} = require("../services/query");
const { findByIdAndUpdate } = require("../models/Post");
const { ConnectionStates } = require("mongoose");
const { updatePost } = require("./posts");
const util = require('util');
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const customParseFormat = require('dayjs/plugin/customParseFormat');
const dayJsUTC = dayjs.extend(utc)
const dayJsDate = dayJsUTC.extend(customParseFormat)






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
       if(!req.body.username){
        if(req.file){
                 fs.unlinkSync(req.file.path);
           }
          
           return res.status(500).json('username can not be empty')
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
                        let arrayOfPostsImagePublicId = userPosts.map((singleImagePublicId)=>{
                            return singleImagePublicId.photoPublicId
                        })
                        //the public ids came out as an arrray in an array. The cloudinary multiple file delete method requires a flattened array containing the ids
                        //break up the array into a string
                        arrayOfPostsImagePublicId = arrayOfPostsImagePublicId + ""
                        //using the split method, convert each into a string in array with coma.
                        arrayOfPostsImagePublicId = arrayOfPostsImagePublicId.split(',')
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


//Get User for admin
const getSingleUser = async (req, res)=>{
   
    try{
        const getUser = await User.findById(req.user.userId);
        if(!getUser){
             return res.status(404).json("No user found");
        }
        const user = await User.findById(req.params.id).populate('userPosts', 'title');
        if(!user){
            return res.status(401),json('user not found with this ID')
        }
        if(getUser.role !== 'admin' ){
            return res.status(404).json("You are not permitted");
        }
        
        const {password,updatedAt,__v, ...others} = user._doc;
        return res.status(200).json(others);
       
    }catch(err){
        console.log(err)
       return res.status(500).json(err);
    };

};

//get single user by everyone
const singleUser = async (req, res)=>{
   
    try{
        console.log('I am a single user')
        const user = await User.findById(req.params.singleUserId).populate('userPosts', 'title');
        if(!user){
            return res.status(401).json('user not found with this ID')
        }
        
        const {password,updatedAt,__v, role,userReplyComment,isBlocked,isVerified, email,expDate, currentDate, ...others} = user._doc;
        return res.status(200).json(others);
       
    }catch(err){
        console.log(err)
       return res.status(500).json('something went wrong with finding user');
    };

};

//get singleUser for owner
const singleUserOwner = async (req, res)=>{
   
    try{
        console.log('I am a owner user')
        const user = await User.findById(req.params.userOwnerId).populate('userPosts', 'title');
        if(!user){
            return res.status(401),json('user not found with this ID')
        }
        
        const {password,updatedAt,__v, role,userReplyComment, currentDate, ...others} = user._doc;
        return res.status(200).json(others);
       
    }catch(err){
        console.log(err)
       return res.status(500).json('something went wrong with finding user');
    };

};


//Get all users

const getAllUsers = async (req, res) =>{
     const {skip, limit} = getUserPagination(req.query);
    try{
        
        const adminUser = await User.findById(req.user.userId);
        if(!adminUser){
             return res.status(404).json('No user found');
        }
        if(adminUser.role !== 'admin'){
            return res.status(401).json('You are not authorized to access this page');
        }
       
      
           const allUsers = await User.find({role: 'user'}).sort({createdAt:-1}).skip(skip).limit(limit);
           if(!allUsers){
            return res.status(404).json('users not found')
           }
           return res.status(200).json(allUsers);
    
    }catch(err){
         return res.status(500).json('Something went wrong');
    }
}

//blocking user
const handleBlocking = async (req, res) =>{
    try{
        const userToBlock = await User.findById(req.params.userId);
        const adminUser = await User.findOne({username: req.user.username});
        const expDate = req.body.expDate;
        const expTime = req.body.expTime;
        const calDate = expDate + 'T' + expTime

       
       
        console.log(calDate, 'check cal')
        if(!expDate){
            return res.status(401).json("You must provide expiry date")
        }
        
        if(!dayJsDate(calDate, "YYYY-MM-DDTHH:mm", true).isValid()){
                console.log(calDate)
                return res.status(500).json('invalid date')
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
    if(userToBlock._id.toString() === req.params.userId){
          const user = await User.findByIdAndUpdate(req.params.userId,{
                    isBlocked: true, 
                    expDate: calDate
               }, {new: true}); 
         return res.status(200).json( user);
    }else{
         return res.status(401).json('Action can not be completed');
    };

    }catch(err){
        console.log(err)
        return res.status(500).json('something went wrong')
    }
        
    
};

//unblock user
const handleUnblock = async (req, res) =>{
    const userToUnblock = await User.findById(req.params.userId);
    try{
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
    if(userToUnblock._id.toString() === req.params.userId){
           const user = await User.findByIdAndUpdate(req.params.userId,{
                    isBlocked: false,
                    expDate: null 
               }, {new: true}); 
         return res.status(200).json(user);
    }else{
         return res.status(401).json('Action can not be completed due to unathourized access or user not found');
    };
    }catch(err){
        return res.status(500).json('something went wrong')
    }
};

//admin deletes single user
const deleteSingleUser = async (req, res) =>{
    
    try{
        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(404).json('user not found');
        }
        if(user.role !== 'admin'){
            return res.status(401).json('you are not authorized');
        }
        const delUser = await User.findById(req.params.delId);
           
        if(!delUser){
            return res.status(404).json('No user found')
        }
                       
            //delete all post images associated with this user from cloudinary
            //first find all posts this user has created
            //then, get the public id object and return as a single array of publicIds
            const userPosts = await Post.find({username: delUser._id});
            if(userPosts){
                 let arrayOfPostsImagePublicId = userPosts.map((singleImagePublicId)=>{
                    return singleImagePublicId.photoPublicId
                    })
            //the public ids came out as an arrray in an array. The cloudinary multiple file delete method requires a flattened array containing the ids
            //break up the array into a string
                arrayOfPostsImagePublicId = arrayOfPostsImagePublicId + ""
                //using the split method, convert each into a string in array with coma.
                arrayOfPostsImagePublicId = arrayOfPostsImagePublicId.split(',')
                //pass the array of public image ids to the cloudinary deleteall method
                if(!arrayOfPostsImagePublicId.includes(" ")){
                    await deleteAllFiles(arrayOfPostsImagePublicId)
                }
                
            }
                           
            //delete user's pics from cloudinary
            if(delUser.publicId){
                 await deleteCloudinary(delUser.photoPublicId);
            }
            //get refresh token of user saved in redis
            const key = await client.get(delUser._id.toString());
                if(key){
                        await client.DEL(delUser._id.toString());
                };                       

                await User.findByIdAndDelete(req.params.delId)
                        
                return res.status(200).json("User has been deleted");    
            
    }catch(err){
        console.log(err)
        return res.status(500).json('something went wrong')
    }
}

//admin delete selected users

const deleteSelectedUsers = async (req, res)=>{
    try{
        const user = await User.findById(req.user.userId);
       if(!user){
            return res.status(404).json('user not found');
        }
        if(user.role !== 'admin'){
            return res.status(401).json('you are not authorized');
        }
        const {selectedIds} = req.body;

        if(selectedIds.length < 1 || selectedIds.length == 1){
            return res.status(404).json('no user selected')
        }
       
        //find the selected users
         const selectedUsers = await User.find({_id: selectedIds});
        if(!selectedUsers){
            return res.status(404).json('Users not found')
        }
        //find the selected Users posts. We need this to delete the users' posts images from cloudinary
        const selectedUsersPosts = await Post.find({username: selectedIds});

        if(selectedUsersPosts){
            //we needed to ensure that only posts without empty photoPublicId are returned
            let postPublicId = selectedUsersPosts.map((singlePostId) => singlePostId.photoPublicId);
            //return only the photoAraay of these posts into an array
           
                postPublicId =  postPublicId + "";
          //using the split method, convert each into a string in array with coma.
                postPublicId = postPublicId.split(',');
          //pass the flattened array containing string of public ids to the cloudinary delete method
            if(!postPublicId.includes('')){
                
                await deleteAllFiles( postPublicId)
            }  
        }

       
        //find all posts becus selected users might have liked many posts
        const posts = await Post.find();
        if(posts){
             //filter out posts without likes
        const filteredPost = posts.filter((singleFilter) => singleFilter.postLikes.length !== 0);

        //if there are posts with likes, go ahed and perform this actions
        if(filteredPost){
            //get their ids in a single array
        const newPost = filteredPost.map((singleMap) => singleMap._id);
       //remove the ids from the filtered posts postLikes array
        await Post.updateMany({ _id: {$in:  newPost} }, { $pull: { postLikes: { $in: selectedIds } } })
        }
        }
       
        
        //remove selected users posts if there is any
        if(selectedUsersPosts ){
             await Post.deleteMany({username: selectedIds})
        }
       

        //remove selected users profile pics
        const filteredUserPostPhotoId = selectedUsers.filter((singleUserPublicId) => singleUserPublicId.photoPublicId !== '');
        //check if the filtered variable contains an item. I would like to call these logics only if the variable is more than zero
         if(filteredUserPostPhotoId.length > 0){
                let usersPublicPhotoId = filteredUserPostPhotoId.map((singleUser) => singleUser.photoPublicId);
                usersPublicPhotoId =  usersPublicPhotoId + "";
                  //using the split method, convert each into a string in array with coma.
                usersPublicPhotoId = usersPublicPhotoId.split(',');
                     
                 //pass the flattened array containing string of public ids to the cloudinary delete method
                await deleteAllFiles( usersPublicPhotoId)
         }
         
       //now delete selected users id from redis. This will make their refresh token broken and cant perform any further action on the app
       
       selectedIds.forEach( async(i)=>{
               const userRedisKey =  await client.get(i)
              if(userRedisKey){
                 await client.DEL(selectedIds)
              }
               
        })
        
      //delete users
      await User.deleteMany({_id: selectedIds})
      return res.status(200).json('users deleted')
    }catch(err){
        
        return res.status(500).json('something went wrong')
    }
}

//delete all users

const handleDeleteAllUsers = async(req, res)=>{
    try{
        const adminUser = await User.findById(req.user.userId)
       if( !adminUser){
            return res.status(404).json('user not found');
        }
        if( adminUser.role !== 'admin'){
            return res.status(401).json('you are not authorized');
        }
        //find users to delete. admin would like to delete all users who are not admin. Ideally, there is only one admin
        const users = await User.find({role: 'user'});
        if(!users){
            return res.status(404).json('users not found')
        }
        //get all users name as array to find their posts. Since username on posts is users' id, we would return the user's id
        const userName = users.map((singleUsers)=> singleUsers._id)
       if(userName.length > 0){
            //find all posts written by all users
        const posts = await Post.find({username: userName});
        if(posts){
             //we needed to ensure that only posts without empty photoPublicId are returned
            let postPublicId = posts.map((singlePostId) => singlePostId.photoPublicId);
            //return only the photoAraay of these posts into an array
           
                postPublicId =  postPublicId + "";
          //using the split method, convert each into a string in array with coma.
                postPublicId = postPublicId.split(',');
          //pass the flattened array containing string of public ids to the cloudinary delete method
            if(!postPublicId.includes('')){ 
                await deleteAllFiles( postPublicId)
            }  
            //delete their posts
            await Post.deleteMany({username:userName})
        }
       }
        
        //find the users' photoId and delete from cloudinary
         const filteredUserPostPhotoId = users.filter((singleUserPublicId) => singleUserPublicId.photoPublicId !== '');
         
        //check if the filtered variable contains an item. I would like to call these logics only if the variable is more than zero
         if(filteredUserPostPhotoId.length > 0){
                let usersPublicPhotoId = filteredUserPostPhotoId.map((singleUser) => singleUser.photoPublicId);
                usersPublicPhotoId =  usersPublicPhotoId + "";
                  //using the split method, convert each into a string in array with coma.
                usersPublicPhotoId = usersPublicPhotoId.split(',');
                     
                 //pass the flattened array containing string of public ids to the cloudinary delete method
                await deleteAllFiles( usersPublicPhotoId)
         }
        
        //now delete selected users id from redis. This will make their refresh token broken and cant perform any further action on the app
       
        if(userName.length > 0){
            userName.forEach( async(i)=>{
               const userRedisKey =  await client.get(i)
              if(userRedisKey){
                console.log(userRedisKey)
                 await client.DEL(selectedIds)
              }
               
        })
        }
              
      //delete users
      await User.deleteMany({_id: selectedIds})
      return res.status(200).json('users deleted')
    }catch(err){
        console.log(err)
        return res.status(500).json('something went wrong')
    }
}
module.exports = {
    updateUser,
    deleteUser,
    getSingleUser,
    getAllUsers,
    handleBlocking,
    handleUnblock,
    singleUser,
    singleUserOwner,
    deleteSingleUser,
    deleteSelectedUsers,
    handleDeleteAllUsers,
}