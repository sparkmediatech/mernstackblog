const mongoose = require("mongoose"); 
const Schema = mongoose.Schema;



const FollowSchema = new mongoose.Schema(
    {

        follow:{
            type: Boolean,
            default: false
        },

        user:{
            type: Schema.Types.ObjectId, 
            ref: 'User'
        },

}, {timestamps: true})


module.exports = mongoose.model("Follow",  FollowSchema); 