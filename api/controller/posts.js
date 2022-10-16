const User = require("../models/User"); //the user model imported to be used
const Post = require("../models/Post");
const {getPagination} = require("../services/query");
const Category = require("../models/Categories");
const {deleteCloudinary, uploadCloudinary, deleteAllFiles} = require('../middleware/CloudinaryFunctions')
const fs = require('fs');
const {upload} = require('../middleware/multer');






//create new post
const createNewPost =  async (req, res) =>{
    const postTitle = req.body.title
    const uppercaseTitle = postTitle.toUpperCase() 
  try{  
    const user = await User.findById(req.user.userId);
    if(!user){
       if(req.file){
                 fs.unlinkSync(req.file.path);
           }
        return res.status(404).json('User not found'); 
    };
    
    if(user.isBlocked === true){
        if(req.file){
                 fs.unlinkSync(req.file.path);
           }
        return res.status(500).json('Sorry, you can not make a post at this moment');
    };
    if(user.isVerified === false){
       if(req.file){
                 fs.unlinkSync(req.file.path);
           }
        return res.status(500).json('Only verified users can perform this action');
    };
    
    if(req.body.categories === ""){
       if(req.file){
                 fs.unlinkSync(req.file.path);
           }
        return res.status(500).json('Post category should not be empty')

    }
    //check duplicate post
    const duplicatePost = await Post.exists({title: req.body.title});
    if(duplicatePost){
       if(req.file){
                 fs.unlinkSync(req.file.path);
           }
        return res.status(500).json('Post title already exist')
    }
    if(uppercaseTitle.length > 61){
         if(req.file){
                 fs.unlinkSync(req.file.path);
           }
        return res.status(500).json('post title should not be more than 60 characters')
    }
    if(uppercaseTitle.length < 10){
        if(req.file){
                 fs.unlinkSync(req.file.path);
           }
        return res.status(500).json('post title should not be less than 10 characters')
    }
     if(uppercaseTitle === " "){
         if(req.file){
                 fs.unlinkSync(req.file.path);
           }
        return res.status(500).json('post title should not be empty')
    }
     const newPost = new Post({
         _id: req.body._id,
         username: req.body.username,
         postPhoto: req.body.postPhoto,
         photoPublicId: JSON.parse(req.body.photoPublicId),
         postPhotoArray: JSON.parse(req.body.postPhotoArray),
         title: uppercaseTitle,
         description: req.body.description,
         categories: req.body.categories 
     });

     //push post to userPost array to create user-post relationship
        user.userPosts.push(newPost);
        //save new post and user
        const createdPost = await newPost.save();
       
        //save user model
        await user.save();

        
        return res.status(200).json(createdPost)

   
  }catch(err){
       if(req.file){
                 fs.unlinkSync(req.file.path);
           }
      res.status(500).json({message: 'Something went wrong with user or post', err: err});
  }
  
};

//Update post
const updatePost = async (req, res)=>{
    try{
    const postTitle = req.body.title;
    const title = postTitle.toUpperCase()
    const user = await User.findById(req.user.userId);
    if(!user){
       if(req.file){
                 fs.unlinkSync(req.file.path);
           }
         return res.status(404).json("User not found");
    }
    if(user.isBlocked === true){
       if(req.file){
                 fs.unlinkSync(req.file.path);
           }
        return res.status(401).json("Sorry, you're banned from making posts");
    };
    if(user.isVerified === false){
       if(req.file){
                 fs.unlinkSync(req.file.path);
           }
         return res.status(401).json("Sorry, only verified users can update their posts");
    };

    if(!title){
        return res.status(500).json('post title can not be empty')
    }

    if(title.length > 61){
         if(req.file){
                 fs.unlinkSync(req.file.path);
           }
        return res.status(500).json('post title should not be more than 60 characters')
    }
    if(title.length < 10){
        if(req.file){
                 fs.unlinkSync(req.file.path);
           }
        return res.status(500).json('post title should not be less than 10 characters')
    }
    
    try{
        const post = await Post.findById(req.params.id);

         if(!post){
            if(req.file){
                 fs.unlinkSync(req.file.path);
           }
            return res.status(401).json("No post with this Id found");
            };
        //check if user is the owner of the post
       
                if(post.username.toString() == user._id.toString() ){
                    const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
                        
                        $set: req.body,
                        title: title
                    }, {new: true, runValidators: true});
     
                   return res.status(200).json(updatedPost);

         } else{
             if(req.file){
                 fs.unlinkSync(req.file.path);
           }
             return res.status(401).json("you can only update your posts");

         }  
    }catch(err){
        console.log(err)
       if(req.file){
                 fs.unlinkSync(req.file.path);
           }
       return res.status(500).json(err);
    };
}catch(err){
    console.log(err)
    if(req.file){
                 fs.unlinkSync(req.file.path);
           }
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
        if(user.isBlocked == true){
            return res.status(401).json('you are not athourized')
        }
        if(user.isVerified == false){
            return res.status(401).json('you are not verified yet')
        }
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

            //delete image from cloudinary 
            await deleteAllFiles(post.photoPublicId)
            //delete post from mongodb
            await Post.findByIdAndDelete(post._id);                  
            
            return res.status(200).json("Post has been deleted");      
                
         } else{
             res.status(401).json("you can only delete your posts");
         };

       
    }catch(err){
        console.log(err)
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

       const posts = await Post.find({username: userId});
       console.log(posts,'these are posts')
       if(!posts){
           return res.status(404).json('posts not found')
       }
        //check if the user has the permission to delete all the posts. Only owners can delete all their posts
        //this checks the array of posts and return true if any of the post(s)  does not match with post.username and user.username
        const postUserName = posts.map((singlePostUsername) =>{
            return singlePostUsername.username.toString() !== user._id.toString();
        })
        //if the postUsername variable which is an array has true bolean value, pls reject this operation. This means the user is not the owner of one or all the selected posts
        if(postUserName.includes(true)){
            return res.status(401).json('You can not perform this action')
        }
        //delete all post images associated with this user from cloudinary
        //get the public id object and return as a single array of publicIds
        let arrayOfPostsImagePublicId = posts.map((singleImagePublicId)=>{
            //console.log(singleImagePublicId, 'single image id')
            return singleImagePublicId.photoPublicId
        })
        
            //the public ids came out as an arrray in an array. The cloudinary multiple file delete method requires a flattened array containing the ids
            //break up the array into a string
            arrayOfPostsImagePublicId = arrayOfPostsImagePublicId + ""
            //using the split method, convert each into a string in array with coma.
            arrayOfPostsImagePublicId = arrayOfPostsImagePublicId.split(',')
            //console.log(arrayOfPostsImagePublicId, 'it is arrray of image')
            //pass the array of public image ids to the cloudinary deleteall method
        
            await deleteAllFiles(arrayOfPostsImagePublicId)
            //delete all the current user's posts
            await Post.deleteMany({username: user._id}, function(err, result){
                if(err){
                return err
                }
                return result
            });
            return res.status(200).json('All your posts deleted')

   
}catch(err){
    return res.status(500).json('something went wrong with finding user')
}
    
}


//Get Post
const getPost = async (req, res) =>{
    try{
        const post = await Post.findById(req.params.id).populate('username', 'username profilePicture aboutUser').populate({
      path: "comments",
      populate: [{
         path: "author",
          
      }, {
          path: "replies",
          populate: "author"
      }],
   }) 

   if(!post){
    return res.status(404).json('no post found')
   }
       return res.status(200).json(post);

    }catch(err){
      return  res.status(500).json('something went wrong');
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
        if(!ids.length < 0){
            return res.status(500).json('no selected post')
        }
        if(user.isBlocked === true){
            return res.status(401).json('you are blocked')
        }
        if(user.isVerified === false){
            return res.status(401).json('you are not verified yet')
        }
        //find posts with the ids
        const posts = await Post.find({_id: ids});

        if(!posts){
            return res.status(404).json('no post found')
        }

        //check if the user has the permission to delete the selected posts. Only owner of post can delete selected posts
        //this checks the array of posts and return true if any of the post(s) selected by the user does not match with post.username and user.username
        const postUserName = posts.map((singlePostUsername) =>{
            return singlePostUsername.username.toString() !== user._id.toString();
        })
        //if the postUsername variable which is an array has true bolean value, pls reject this operation. This means the user is not the owner of one or all the selected posts
        if(postUserName.includes(true)){
            return res.status(401).json('You can not perform this action')
        }
       
        //find the public ids of the found posts
        let arrayOfPostsImagePublicId = posts.map((singleImagePublicId)=>{
            console.log(singleImagePublicId)
            return singleImagePublicId.photoPublicId
        })
        //the public ids came out as an arrray in an array. The cloudinary multiple file delete method requires a flattened array containing the ids
        //break up the array into a string
         arrayOfPostsImagePublicId = arrayOfPostsImagePublicId + ""
         //using the split method, convert each into a string in array with coma.
         arrayOfPostsImagePublicId = arrayOfPostsImagePublicId.split(',')
            //pass the flattened array containing string of public ids to the cloudinary delete method
            await deleteAllFiles(arrayOfPostsImagePublicId)
            //delete selected posts
                await Post.deleteMany({_id: ids})
                return res.status(200).json('Selected posts deleted')
      
    }catch(err){
        return res.status(500).json('something went wrong')
    }
}

//GET ALL Posts logic
const getAllPosts = async (req, res) =>{
    const {skip, limit} = getPagination(req.query);
    const username = req.query.user;

    try{
       let posts;
       if(username){
           posts = await Post.find({username: username}).populate('username', 'username').sort({createdAt:-1})
           .skip(skip)
           .limit(limit)  
       }

       else{
           posts = await Post.find().populate('username', 'username').sort({createdAt:-1})
           .skip(skip)
           .limit(limit)  
       }

        return res.status(200).json(posts)
    }catch(err){
        return res.status(500).json('something went wrong')
    };
};

//get posts for search results and blog section

const getPostSearchResults = async (req, res)=>{
    const {skip, limit} = getPagination(req.query);
    const search = req.body.search;
    const catName = req.body.catName;
    const username = req.body.username
    console.log(username, 'iam search')

    try{
        let posts;
        if(search){
        posts = await Post.find({title: {$regex: search.toString(), "$options": "i"}}).populate('username', 'username').sort({createdAt:-1})
           .skip(skip)
           .limit(limit)  
    }
    else if(catName){
            posts = await Post.find({categories: catName}).populate('username', 'username').sort({createdAt:-1})
            .skip(skip)
           .limit(limit)  
       }

    else if(username){
            posts = await Post.find({username: username}).populate('username', 'username').sort({createdAt:-1})
           .skip(skip)
           .limit(limit)  
    }

    else{
           posts = await Post.find().populate('username', 'username').sort({createdAt:-1})
           .skip(skip)
           .limit(limit)  
       }
       return res.status(200).json(posts)
    }catch(err){
        console.log(err)
    }
}
//get post based on category model indexes.  
const getPostCategory_1 = async (req, res)=>{
        try{
            //get all categories
            const category = await Category.find();

            if(!category){
                return res.status(404).json('no category found, create a category first')
            }

            const indexNumber = Number(req.body.categoryIndex) 
            //get category name based on index number coming from the frontend
            const getCategoryIndex = category[indexNumber].catName;
            //find all post based on category index
            const posts = await Post.find({categories: getCategoryIndex}).populate('username', 'username').sort({createdAt:-1});
            //get Page title
            const pageTitle = getCategoryIndex;
            
            if(!posts){
                return res.status(404).json('no post for this category yet')
            }
            return res.status(200).json({posts, pageTitle})
        }catch(err){
            console.log(err)
            return res.status(500).json('something went wrong')
        }
}

//posts that would be displayed as slider
//This is based on randomly generated numbers and these numbers are used to generate array of posts. These posts would be displayed in frontend

const getRandomPostS = async (req, res)=>{

    try{
    //find all the posts in the posts model but exclude certain fields such as description, username, etc. I will be needing only few fields in the post model
   //the exclusion is called using .select and I listed out the fields to exclude
    const posts = await Post.find().select("-description -username -photoPublicId -comments -postReplyComments -postLikes -updatedAt   -__v");
   //check if there are no post then return this error
    if(!posts){
        return res.status(404).json('no post found')
    };
    //get the length of the posts found
    const postTotalLenght = posts.length;
    
   //create a new array that is empty
    const newArrayPost = []
    if(postTotalLenght > 9){
        //using while loop method, I need just 5 posts from the post model for the frontend, I simply asked the loop to stop at 5 starting from 1
    while(newArrayPost.length < 7){
    //using the math.floor(math.random()) methods, I multiplied this with the total post length to generate random numbers. This would run 5 times
         const newPosts = Math.floor(Math.random() * postTotalLenght);
    //each time a number is randomly generated, push that number into the newArrayPost array variable
        if(!newArrayPost.includes(newPosts)){
            newArrayPost.push(newPosts)
        }   
    }
     
    //the newArrayPost vairable now contains randomly generated numbers
    //using the map method, the newArrayPost method was used to fetch posts based on their index that match the randomly generated numbers found in the newArrayPost
    const currentPost = newArrayPost.map(singlePost => posts[singlePost])
    return res.status(200).json(currentPost)
    }
   
    }catch(err){
        return res.status(500).json('something went wrong with post')
    }
   
}
//handle upload post image. This is needed since the react application is using a text editor that requres the image to be sent to server first before previewing inside the post. 
const uploadImage = async(req, res) =>{
        try {
       
        const fileStr = req.file.path
        console.log(fileStr, 'check filestr')
        
        if(!fileStr){
           if(req.file){
                 fs.unlinkSync(req.file.path);
           }
            return res.status(500).json( 'No image found');
        }else{
        //calling the cloudinary function for upload
        const uploadResponse = await uploadCloudinary(fileStr)
            
        const result = {
        url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id
        }
            
            return res.status(200).json( result)
        }
        
    
    } catch (err) {
        if(req.file.path){
                 fs.unlinkSync(req.file.path);
           }
           console.log(err)
        return res.status(500).json({ err: 'Something went wrong with image' });
       
    }
}

//handle deletion of image from cloudinary and database. 

const handleImageDelete = async (req, res) =>{
    //find the post with the image
    const post = await Post.findById(req.params.id);
    //find the image to delete using cloudinary public id of the image
    
    console.log(post)
}

module.exports = {
    createNewPost,
    updatePost,
    likePost,
    deletePost,
    deletAllUsersPost,
    getPost,
    handleDeleteSelectedPosts,
    getAllPosts, 
    getPostCategory_1,
    getRandomPostS,
    uploadImage,
    handleImageDelete,
    getPostSearchResults,
   
}