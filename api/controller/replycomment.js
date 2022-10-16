const router = require("express").Router()
const Comment = require("../models/Comment")
const Replycomment = require("../models/Replycomment");
const User = require('../models/User');
const Post = require('../models/Post');


//creating comment logic
const createNewCommentReply = async (req, res) =>{
try{
    const user = await User.findById(req.user.userId);

    if(!user){
         return res.status(500).json('No user found');
    };
    if(user.isBlocked){
         return res.status(500).json('Sorry, you are banned from creating comment at this time');
    };
    if(user.isVerified === false){
        return res.status(401).json('Only verified users can create comment');
    }
    
    if(!req.body.replycomment){
            return res.status(500).json('comment must not be empty')
        }

    if(!isNaN(req.body.replycomment)){
            return res.status(500).json('comment should not be a number')
            }
    const newReply = new Replycomment(req.body);
        
            const currentComment = await Comment.findById(req.params.commentId)
            const currentUser = await User.findById(req.body.author);
            const currentPost = await Post.findById(req.params.id);

            if(!currentComment || !currentUser || ! currentPost){
                return res.status(404).json("Not found")
            }

             //pushed into their respective models
            currentComment.replies.push(newReply)
            currentPost.postReplyComments.push(newReply);
            currentUser.userReplyComments.push(newReply);

            //saved the reply comment, post, user and comment
            const savedNewReply = await newReply.save();
            await currentComment.save()
            await currentPost.save();
            await currentUser.save();
            
        return res.status(200).json(savedNewReply)
   
}catch(err){
 return res.status(500).json('Something went wrong');
}
}

//get comment
const getSingleReplyComment = async (req, res) =>{
    
     try{
        const replies = await Replycomment.findById(req.params.replyId).populate('author', 'profilePicture username')
        res.status(200).json(replies)
    }catch(err){
        console.log(err)
         return res.status(404).json("Not found")
    }
}


//edit reply
const updateReplyComment = async (req, res) =>{
try{
    const user = await User.findById(req.user.userId);
    if(!user){
         return res.status(500).json('No user found');
    };
    if(user.isBlocked === true){
         return res.status(500).json('Sorry, you are banned from performing this action at the moment');
    };
    if(user.isVerified === false){
        return res.status(401).json('Only verified users can edit their comment');
    }

     if(!req.body.replycomment){
            return res.status(500).json('comment must not be empty')
        }

    if(!isNaN(req.body.replycomment)){
            return res.status(500).json('comment should not be a number')
            }
         const replyComment = await Replycomment.findById(req.params.replyId);

         if(!replyComment){
              return res.status(404).json("Reply comment not found")
         }
          
        if(replyComment.author == req.body.author){
                 const updatedReply = await Replycomment.findByIdAndUpdate(req.params.replyId, {      
                        $set: req.body
                    }, {new: true})
                    return res.status(200).json(updatedReply);            
        }
        else{
                return res.status(401).json("you can only update your comment");
            }

    
}catch(err){
   return res.status(500).json("Something went wrong") ; 
}   
};

//delete reply logic
const deleteReplyComment = async (req, res) =>{
    try{
        const replycomment = await Replycomment.findById(req.params.replyId);
        const {commentId} = req.params;
        const user = await User.findById(req.user.userId);
        const post = await Post.findById(req.params.id);
        const userId = user._id;

        if(!replycomment || !commentId || !user || !post){
            return res.status(200).json("Required content is missing");
        };
        if(user.isVerified === false){
            return res.status(401).json("Only verified users can delete their comment");
        }

        if(user.isBlocked === true){
                return res.status(500).json('Sorry, you are banned from performing this action at the moment');
            };

        if(replycomment.author == req.body.author || user.role === "admin"){
            
           
                await Comment.findByIdAndUpdate(commentId, { $pull: {replies: replycomment._id } });
                await User.findByIdAndUpdate(userId, { $pull: {userReplyComments: replycomment._id } });
                await Post.findByIdAndUpdate(post, {$pull: {postReplyComments: replycomment._id}});
                await Replycomment.findByIdAndDelete(replycomment);
               return res.status(200).json("Comment has been deleted");
            
        }
        else{
             res.status(401).json("you can only delete your posts")
        }
    }catch(err){
       
        return res.status(401).json("something went wrong")
    }
};


module.exports = {
    createNewCommentReply,
    updateReplyComment,
    getSingleReplyComment,
    deleteReplyComment
}