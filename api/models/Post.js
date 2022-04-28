//creating the user models for the database

const mongoose = require("mongoose"); //import mongoose
const Schema = mongoose.Schema;
const Comment = require("./Comment");
const ReplyComments = require('./Replycomment');

const PostSchema = new mongoose.Schema(
    {
       
        title:{
            type: String,
            //required: true,
            index: { unique: true, sparse: true}
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
        },
       username:{
            type: Schema.Types.ObjectId, 
            ref: 'User'
        },
        categories:{
           type: Array,
        },
       comments: [{
             type: mongoose.Schema.Types.ObjectId,
             ref: 'Comment',
           }],
        postReplyComments: [{
             type: mongoose.Schema.Types.ObjectId,
             ref: 'Replycomments',
           }]
       
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


//exporting this schema
PostSchema.index({title: 'text'});
module.exports = mongoose.model("Post", PostSchema); //the module name is "Post"