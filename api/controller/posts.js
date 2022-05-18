const User = require("../models/User"); //the user model imported to be used
const Post = require("../models/Post");
const {getPagination} = require("../services/query");
const Category = require("../models/Categories");
const {deleteCloudinary, uploadCloudinary, deleteAllFiles} = require('../middleware/CloudinaryFunctions')
const fs = require('fs')





//create new post
const createNewPost =  async (req, res) =>{
    const postTitle = req.body.title
    const uppercaseTitle = postTitle.toUpperCase() 
  try{  
    const user = await User.findById(req.user.userId);
    if(!user){
        fs.unlinkSync(req.file.path);
        return res.status(404).json('User not found'); 
    };
    
    if(user.isBlocked === true){
        fs.unlinkSync(req.file.path);
        return res.status(500).json('Sorry, you can not make a post at this moment');
    };
    if(user.isVerified === false){
        fs.unlinkSync(req.file.path);
        return res.status(500).json('Only verified users can perform this action');
    };
    
    if(req.body.categories === ""){
        fs.unlinkSync(req.file.path);
        return res.status(500).json('Post category should not be empty')

    }
    //check duplicate post
    const duplicatePost = await Post.exists({title: req.body.title});
    if(duplicatePost){
        fs.unlinkSync(req.file.path);
        return res.status(500).json('Post title already exist')
    }
    if(uppercaseTitle.length > 61){
         fs.unlinkSync(req.file.path);
        return res.status(500).json('post title should not be more than 60 characters')
    }
    if(uppercaseTitle.length < 10){
         fs.unlinkSync(req.file.path);
        return res.status(500).json('post title should not be less than 10 characters')
    }
     if(uppercaseTitle === " "){
          fs.unlinkSync(req.file.path);
        return res.status(500).json('post title should not be empty')
    }
     const newPost = new Post({
         _id: req.body._id,
         username: req.body.username,
         postPhoto: req.body.postPhoto,
         title: uppercaseTitle,
         description: req.body.description 
     });

     //push post to userPost array to create user-post relationship
        user.userPosts.push(newPost);
        //save new post and user
        const createdPost = await newPost.save();
        //save user model
        await user.save();
   try{ 
        //find the selected category
        const category = await Category.findOne({catName: req.body.categories});
        //push post into category post array
        category.postCategories.push(createdPost);
        //save category
        await category.save()
        
        //upload image to cloudinary
        try {
        const fileStr = req.file.path
        console.log(fileStr)
        
        if(!fileStr){
            fs.unlinkSync(req.file.path);
            return res.status(500).json( 'No image found');
        }else{
        //calling the cloudinary function for upload
        const uploadResponse = await uploadCloudinary(fileStr)
            
        const result = {
        url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id
        }
        const savedPost = await Post.findByIdAndUpdate(createdPost._id, {
        photoPublicId: result.publicId,
        postPhoto: result.url

        }, {new: true})
            
            return res.status(200).json(savedPost)
        }
        
    
    } catch (err) {
        fs.unlinkSync(req.file.path);
        return res.status(500).json({ err: 'Something went wrong with image' });
       
    }
    }catch(err){
         fs.unlinkSync(req.file.path);
       res.status(500).json({message: 'Something went wrong category', err: err});
   };
  }catch(err){
       fs.unlinkSync(req.file.path);
      res.status(500).json({message: 'Something went wrong with user or post', err: err});
  }
  
};


//Update post
const updatePost = async (req, res)=>{
    try{
    const user = await User.findById(req.user.userId);
    if(!user){
        fs.unlinkSync(req.file.path);
         return res.status(404).json("User not found");
    }
    if(user.isBlocked === true){
        fs.unlinkSync(req.file.path);
        return res.status(401).json("Sorry, you're banned from making posts");
    };
    if(user.isVerified === false){
        fs.unlinkSync(req.file.path);
         return res.status(401).json("Sorry, only verified users can update their posts");
    };

    try{
        const post = await Post.findById(req.params.id);
        //get the current user profile pics public id for cloudinary delete operations
        const currentPostPhotoPublicId = post.photoPublicId
        
        console.log(post.photoPublicId,'current ID')
        if(!post){
            fs.unlinkSync(req.file.path);
            return res.status(401).json("No post with this Id found");
            };
                if(post.username.toString() == user._id.toString() ){
                    const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
                        
                        $set: req.body
                    }, {new: true, runValidators: true});

                    //update image
                     if(req.file){
                        const fileStr = req.file.path;

                         //calling the cloudinary function for upload
                        const uploadResponse = await uploadCloudinary(fileStr);
                        const result = {
                            url: uploadResponse.secure_url,
                            publicId: uploadResponse.public_id
                            };

                        //push image to upated user
                        const updatePostImage = await Post.findByIdAndUpdate(updatedPost._id, {
                            photoPublicId  : result.publicId,
                            postPhoto: result.url
                        }, {new: true});

                         //get the updated post image public id for cloudinary delete operations
                        const updatedPostImagePublicId = updatePostImage.photoPublicId;
                        //compare the two public ids. If they are not same and the value is not an empty string, the cloudinary delete method would run
                       if(currentPostPhotoPublicId !== "" && currentPostPhotoPublicId !== updatedPostImagePublicId && updatePostImage.photoPublicId !== "" ){
                            await deleteCloudinary(post.photoPublicId)
                       }  

                    }
     
                   return res.status(200).json(updatedPost);

         } else{
             
             return res.status(401).json("you can only update your posts");

         }  
    }catch(err){
        fs.unlinkSync(req.file.path);
       return res.status(500).json(err);
    };
}catch(err){
    fs.unlinkSync(req.file.path);
    return res.status(500).json("Something went wrong");
}
};

//like post

const likePost = async (req, res)=>{
    try{
        //find user
        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(404).json('No user found')
        };
        //find post
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json('no post found')
        }
        
        if(!post.postLikes.includes(user._id.toString())){
            //push user id to post like array
            post.postLikes.push(user._id);
            console.log('I ran here')
            const updatedPost = await post.save()
            const totalLikes = updatedPost.postLikes.length
            console.log( totalLikes)
            return res.status(200).json(updatedPost)
        }else{
            const userIdIndex = post.postLikes.indexOf(user._id);
            //remove user id from post likes array
            post.postLikes.splice(userIdIndex, 1);
            const updatedPost = await post.save()
            const totalLikes = updatedPost.postLikes.length
             console.log(totalLikes)
            return res.status(200).json(updatedPost)
        }
    }catch(err){
        return res.status(500).json('something went wrong')
    }
}

//Delete post
const deletePost = async (req, res)=>{
    try{
    const user = await User.findById(req.user.userId);
    if(user.isBlocked === true){
         return res.status(500).json('Sorry, you can not make a post at this moment');
    }; 
    if(user.isVerified === false){
        return res.status(500).json('Sorry, only verified users can delete their posts');
    }   
     try{
        const post = await Post.findById(req.params.id);
         if(!post){
            return res.status(401).json("Post not found");
         }
         if(post.username.toString() == user._id.toString()){
                await Post.findByIdAndDelete(post._id); 
               //delete post image from cloudinary
                await deleteCloudinary(post.photoPublicId)
                                     
                    res.status(200).json("Post has been deleted");
         } else{
             res.status(401).json("you can only delete your posts");
         };

       
    }catch(err){
        res.status(500).json(err)
    };
  }catch(err){
       res.status(500).json("Something went wrong");
  }
};

//delete all user's posts at once
const deletAllUsersPost = async (req, res)=>{
try{
    const user = await User.findById(req.user.userId);
    console.log(user)
    if(!user){
        return res.json(401).json('No user found')
    };
    if(user.isVerified === false){
        return res.status(500).json('Sorry, only verified users can delete their posts');
    };
    if(user.isBlocked === true){
         return res.status(500).json('Sorry, you are blocked, you can not perform any action until you are unblocked');
    }; 
    const userId = user._id
    try{
       const posts = await Post.find({username:  userId});
       if(!posts){
           return res.status(404).json('posts not found')
       }
        //delete all post images associated with this user from cloudinary
        //get the public id object and return as a single array of publicIds
        const arrayOfPostsImagePublicId = posts.map((singleImagePublicId)=>{
            //console.log(singleImagePublicId)
            return singleImagePublicId.photoPublicId
        })
        //pass the array of public image ids to the cloudinary deleteall method
        
        await deleteAllFiles(arrayOfPostsImagePublicId, function(result, err){
            if(err){
                return res.status(500).json('deleting image, failed. Contact admin')
            }
            return result
        })
        //delete all the current user's posts
        await Post.deleteMany({username: user._id}, function(err, result){
            if(err){
                return err
            }
            return result
        });
        return res.status(200).json('All your posts deleted')

    }catch(err){
        return res.status(500).json('something went wrong with finding posts')
    }
}catch(err){
    return res.status(500).json('something went wrong with finding user')
}
    
}
//Get Post
const getPost = async (req, res) =>{
    try{
        const post = await Post.findById(req.params.id).populate('username', 'username').populate({
      path: "comments",
      populate: [{
         path: "author",
          
      }, {
          path: "replies",
          populate: "author"
      }],
   }) 
       return res.status(200).json(post);

    }catch(err){
      return  res.status(500).json(err);
    }
}

//delete selected posts
const handleDeleteSelectedPosts = async (req, res) =>{
    try{
        const user = await User.findById(req.user.userId);
        const {ids} = req.body
        if(!user){
            return res.status(404).json('user not found');

        };
        //find posts with the ids
        const posts = await Post.find({_id: ids});
        //find the public ids of the found posts
        const arrayOfPostsImagePublicId = posts.map((singleImagePublicId)=>{
            //console.log(singleImagePublicId)
            return singleImagePublicId.photoPublicId
        })

        await deleteAllFiles(arrayOfPostsImagePublicId, function(result, err){
            if(err){
                return res.status(500).json('deleting image, failed. Contact admin')
            }
            return result
        })
            //delete selected posts
                await Post.deleteMany({_id: ids})
                return res.status(200).json('Selected posts deleted')
      
    }catch(err){
        return res.status(500).json('something went wrong with finding user')
    }
}

//GET ALL Posts logic
const getAllPosts = async (req, res) =>{
    const {skip, limit} = getPagination(req.query);
    const username = req.query.user;
    const catName = req.query.cat;
    const {searches} = req.query;
    const keys = [req.body.title]
   

    try{
       let posts;
       if(username){
           posts = await Post.find({username: username}).sort({createdAt:-1})
           .skip(skip)
           .limit(limit)  
       }
       else if(catName){
            posts = await Post.find({categories: catName}).sort({createdAt:-1})
            .skip(skip)
           .limit(limit)  
       }

       else if(searches){
           posts = await Post.find({title: {$regex: searches.toString(), "$options": "i"}}).sort({createdAt:-1})
           .skip(skip)
           .limit(limit)  
               
       }

       else{
           posts = await Post.find().sort({createdAt:-1})
           .skip(skip)
           .limit(limit)  
       }

    res.status(200).json(posts)
    }catch(err){
        res.status(500).json(err)
    };
};



module.exports = {
    createNewPost,
    updatePost,
    likePost,
    deletePost,
    deletAllUsersPost,
    getPost,
    handleDeleteSelectedPosts,
    getAllPosts,
   
    
}