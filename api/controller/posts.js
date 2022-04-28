const User = require("../models/User"); //the user model imported to be used
const Post = require("../models/Post");
const {getPagination} = require("../services/query");





//create new post
const createNewPost = async (req, res) =>{
  try{  
    const user = await User.findById(req.user.userId);
    if(!user){
        return res.status(404).json('User not found'); 
    };
    
    if(user.isBlocked === true){
        return res.status(500).json('Sorry, you can not make a post at this moment');
    };
    if(user.isVerified === false){
        return res.status(500).json('Only verified users can perform this action');
    };
     const newPost = new Post(req.body );
   try{
        //push post to userPost array to create user-post relationship
        const currentUser = await User.findById(req.user.userId);
        currentUser.userPosts.push(newPost);
        //save new post and user
        const savedPost = await newPost.save();
        await currentUser.save();
      
        res.status(200).json(savedPost);
    }catch(err){
       res.status(500).json({message: 'Something went wrong', err: err});
   };
  }catch(err){
      res.status(500).json({message: 'Something went wrong', err: err});
  }
};


//Update post
const updatePost = async (req, res)=>{
    try{
    const user = await User.findById(req.user.userId);
    if(!user){
         return res.status(404).json("User not found");
    }
    if(user.isBlocked === true){
        return res.status(401).json("Sorry, you're banned from making posts");
    };
    if(user.isVerified === false){
         return res.status(401).json("Sorry, only verified users can update their posts");
    };

    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(401).json("No post with this Id found");
            };
                if(post.username.toString() == user._id.toString() ){
                    const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
                        
                        $set: req.body
                    }, {new: true, runValidators: true});
                         
                   return res.status(200).json(updatedPost);

         } else{
             return res.status(401).json("you can only update your posts");

         }  
    }catch(err){
       return res.status(500).json(err);
    };
}catch(err){
    return res.status(500).json("Something went wrong");
}
};


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


//GET ALL Posts logic
const getAllPosts = async (req, res) =>{
    const {skip, limit} = getPagination(req.query);
    const username = req.query.user;
    const catName = req.query.cat;

    try{
       let posts;
       if(username){
           posts = await Post.find({username: username})
           .skip(skip)
           .limit(limit)  
       }
       else if(catName){
            posts = await Post.find({categories: catName})
            .skip(skip)
           .limit(limit)  
       }

       else{
           posts = await Post.find({})
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
    deletePost,
    getPost,
    getAllPosts,
    
}