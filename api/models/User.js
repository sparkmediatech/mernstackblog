//creating the user models for the database
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Replycomments = require('../models/Replycomment');
const jwt = require('jsonwebtoken')

const mongoose = require("mongoose"); //import mongoose

const UserSchema = new mongoose.Schema({

        username:{
            type: String,
            required: true,
            unique: true
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true
        },
        profilePicture:{
            type: String,
            default: "",
        },
         photoPublicId:{
            type: String,
            default: ""
        },
        role:{
            type: String,
            default: 'user',
            enum: ['admin', 'user']
        },
        aboutUser:{
            type: String,
        },
        userPosts: [{
             type: mongoose.Schema.Types.ObjectId,
             ref: 'Post',
           }],
        usercomments: [{
             type: mongoose.Schema.Types.ObjectId,
             ref: 'Comment',
           }],
        userReplyComments: [{
             type: mongoose.Schema.Types.ObjectId,
             ref: 'Replycomments',
           }],
         userLikes: [{
             type: mongoose.Schema.Types.ObjectId,
             ref: 'Likes',
           }],
        following: [{
             type: mongoose.Schema.Types.ObjectId,
             ref: 'Follow',
           }],
        isBlocked: {
        type: Boolean,
        default: false
         },
        blockedDate:{
         type: Date,
        },
        expDate:{
         type: Date,
        },
        currentDate:{
         type: Date,
        },
        isVerified:{
         type: Boolean,
         default: false
     },
   
}, {timestamps: true}
);

//delete all posts and comments associated with a deleted user
UserSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Post.deleteMany({
            _id: {
                $in: doc.userPosts
            }
        }),
        await Comment.deleteMany({
            _id: {
                $in: doc.usercomments
            }
        }),
        await Replycomments.deleteMany({
            _id: {
                $in: doc.userReplyCOmments
            }
        })
    }
});
//creating the jwt token using the mongoose instance method
UserSchema.methods.JWTAccessToken = function (){
    return jwt.sign({userId: this._id, username:this.username, role: this.role,  profilepicture: this.profilePicture,  photoPublicId: this.photoPublicId, isVerified: this.isVerified,
    aboutUser: this.aboutUser
    },  
        process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME})
};
//creating the jwt refreshToken using the mongoose instance method
UserSchema.methods.JWTRefreshToken = function (){
    return jwt.sign({userId: this._id, },  
        process.env.Refresh_Secret, {
        expiresIn: process.env.Refresh_Duration})
};

//exporting this schema
module.exports = mongoose.model("User", UserSchema); //the module name is "User"