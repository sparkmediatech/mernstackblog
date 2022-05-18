const mongoose = require("mongoose"); 
const Schema = mongoose.Schema;
const Comment = require("./Comment");
const ReplyComments = require('./Replycomment');

const PostSchema = new mongoose.Schema(
    {
       
        title:{
            type: String,
            //required: true,
           
        },
        description:{
            type: String,
            required: true, 
        },
        postPhoto:{
            type: String,
            required:false,
        },
        photoPublicId:{
            type: String,
            default: " "
        },
       username:{
            type: Schema.Types.ObjectId, 
            ref: 'User'
        },
        categories:{
           type: String,
        },
       comments: [{
             type: mongoose.Schema.Types.ObjectId,
             ref: 'Comment',
           }],
        postReplyComments: [{
             type: mongoose.Schema.Types.ObjectId,
             ref: 'Replycomments',
           }],
      postLikes:{
             type: Array,
             default: []
           }  
}, {timestamps: true},

);
PostSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        }),
        await ReplyComments.deleteMany({
            _id: {
                $in: doc.postReplyComments
            }
        })
    }
});


//enables the mongose default search via post title
PostSchema.index({title: 'text'});
//exporting this schema
module.exports = mongoose.model("Post", PostSchema); 