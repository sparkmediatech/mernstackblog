const mongoose = require("mongoose"); 
const Schema = mongoose.Schema;

const ClientPathNameSchema = new mongoose.Schema({
   pathName:{
       type: String, 
    },
   menuName:{
      type: String, 
   },
   aliasName:{
    type: String,
     required: true,
   }
},  {timestamps: true})




module.exports = mongoose.model("ClientPathName", ClientPathNameSchema); 