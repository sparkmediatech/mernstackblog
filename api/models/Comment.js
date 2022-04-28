const mongoose = require("mongoose"); //import mongoose to be used
const Schema = mongoose.Schema;
const Post = require('./Post');
const Replies = require("./Replycomment")

const CommentSchema = new mongoose.Schema(
    {
        commentdescription:{
            type: String,
            required: true,
            unique: true
        
        },
       author:{
            type: Schema.Types.ObjectId, 
            ref: 'User',
            
        },
         replies:[{
            type: Schema.Types.ObjectId, 
            ref: 'Replycomment',
        }],
       
}, {timestamps: true}
);
//delets references of replies once a post is deleted.
CommentSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Replies.deleteMany({
            _id: {
                $in: doc.replies
            }
        })
    }
})


//exporting this schema
module.exports = mongoose.model("Comment", CommentSchema); //the module name is "Post"