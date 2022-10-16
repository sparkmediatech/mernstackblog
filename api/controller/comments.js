const Comment = require("../models/Comment")
const Post = require("../models/Post");
const User = require('../models/User')

//creating comment logic

const createNewComment = async (req, res) =>{
    try{
    const user = await User.findById(req.user.userId);

    if(!user){
         return res.status(500).json('No user found');
    };
    if(user.isBlocked === true){
         return res.status(401).json('Sorry, are banned from making comment at this time');
    };
    if(user.isVerified === false){
        return res.status(401).json('your account is not verified yet');
    };
    if(!req.body.commentdescription){
        return res.status(500).json('comment must not be empty')
    }
    if(!isNaN(req.body.commentdescription)){
        return res.status(500).json('comment should not be a number')
    }
    const newComment = new Comment(req.body);
        
            const currentPost = await Post.findById(req.params.id)
            const currentUser = await User.findById(req.body.author);

            if(!currentPost || !currentUser){
                return res.status(500).json('No post or user found');
            }

            currentPost.comments.unshift(newComment);//we need to push the comment into the post
            currentUser.usercomments.unshift(newComment);

            const saveNewComment = await newComment.save();
            await currentPost.save()
            await currentUser.save();
            
       return res.status(200).json(saveNewComment);
    }catch(err){

        return res.status(500).json("Something went wrong");
    };

}

//get comment
const getSingleComment = async (req, res) =>{
     try{
        const comments = await Comment.findById(req.params.id).populate('author', 'profilePicture username').populate("postId").populate({
      path: "replies",
      populate: {
         path: "author",
         select: 'profilePicture username'
         
      }
   });
        return res.status(200).json(comments)
    }catch(err){
       
        res.status(500).json('something went wrong')
    }
}


//comment edit/update
const updateComment = async (req, res) =>{
    try{
    const user = await User.findById(req.user.userId);

    if(!user){
         return res.status(500).json('No user, found');
    };
    if(user.isBlocked === true){
         return res.status(401).json('Sorry, you are banned from performing this action at the moment');
    };
    if(user.isVerified === false){
         return res.status(401).json('Sorry, only verified users can update their comment');
    }
    
         const comment = await Comment.findById(req.params.commentId);
         
         if(!comment){
             return res.status(401).json(`No comment with the id found`)
         }

        if(!req.body.commentdescription){
            return res.status(500).json('comment must not be empty')
            }
        if(!isNaN(req.body.commentdescription)){
            return res.status(500).json('comment should not be a number')
            }
        if(comment.author.toString() == req.body.author){
          
                 const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, {//inbuilt method used to find by id and update
                        
                        $set: req.body
                        
                    }, {new: true})//this makes it possible to see the updated comment
                    return res.status(200).json(updatedComment)
          
            
        }
        else{
                return res.status(401).json("you can only update your comment")
            }

}catch(err){
 return res.status(500).json("Something went wrong")
}
}

//comment delete
const deleteComment = async (req, res) =>{
     try{
        const comment = await Comment.findById(req.params.commentId);
        const adminUser = await User.findById(req.user.userId)
        const {id} = req.params;
        const user = await User.findById(comment.author);
        const userId = user._id;

        if(!comment || !id || !user){
            return res.status(200).json("User or Post or comment not found")

        };
        if(comment.author == req.body.author || adminUser.role === 'admin'){
           
                await User.findByIdAndUpdate(userId, { $pull: {usercomments: comment._id } });
                await Post.findByIdAndUpdate(id, { $pull: { comments: comment._id } });
                await Comment.findByIdAndDelete(comment._id);
                return res.status(200).json("Comment has been deleted");
            
        }
        else{
            return res.status(401).json("you can only delete your posts");
        };
    }catch(err){
        console.log(err);
         return res.status(500).json("Something went wrong");
    };

};


module.exports = {
    createNewComment,
    updateComment,
    getSingleComment,
    deleteComment
}