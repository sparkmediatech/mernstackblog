const Post = require('../models/Post');





const searchPost = async (req, res)=>{
   try{
       
        key = req.body.title;
        if(key){
            const post = await Post.find({title: {$regex: key.toString(), "$options": "i"}})
                return res.status(200).json({post})
        }
        if(key == ""){
             return res.status(404).json("provide your search key words")
        }
        
   }catch(err){
       console.log(err);
       return res.status(404).json("Not found")
   }
   
};



module.exports = searchPost 