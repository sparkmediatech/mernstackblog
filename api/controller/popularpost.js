const User = require("../models/User"); 
const Post = require("../models/Post");



//get popular posts


const getPopularPosts = async(req,res) =>{
    try{
        popularPosts = await Post.find({}).sort({createdAt: -1}).limit(3);
        const highest = popularPosts.sort((a, b) => b.postLikes.length - a.postLikes.length)
       
        return res.status(200).json(highest)
    }catch(err){
        console.log(err)
    }
}


module.exports = {getPopularPosts}