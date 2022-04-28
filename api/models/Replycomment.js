const mongoose = require("mongoose"); //import mongoose to be used
const Schema = mongoose.Schema;
const Post = require('./Post')

const ReplycommentSchema = new mongoose.Schema(
    {
        replycomment:{
            type: String,
            required: true,
            unique: true 
        },
       author:{
            type: Schema.Types.ObjectId, 
            ref: 'User',
            
        },
       
}, {timestamps: true}
);




//exporting this schema
module.exports = mongoose.model("Replycomment", ReplycommentSchema); //the module name is "Post"