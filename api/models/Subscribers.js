const mongoose = require("mongoose"); 
const Schema = mongoose.Schema;

const SubscribersSchema = new mongoose.Schema({
    subscriberName:{
       type: String,
       required: true, 
    },
    subscriberEmail:{
       type: String,
       required: true, 
    },
   isVerified:{
         type: Boolean,
         default: false
     },
},  {timestamps: true})




module.exports = mongoose.model("Subscribers", SubscribersSchema); 