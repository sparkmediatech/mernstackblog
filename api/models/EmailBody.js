const mongoose = require("mongoose"); 
const Schema = mongoose.Schema;

const EmailBodySchema = new mongoose.Schema({
    emailTitle:{
       type: String,
       required: true, 
    },
   emailBody:{
       type: String,
       required: true, 
    },
    deliveryMode:{
        type: String,
        default: 'instant',
        enum: ['instant', 'later'] 
    },

    deliveryDate:{
         type: Date,
        },
   emailReciever:{
    type: Array,
    required: true
   },
   deliveryStatus:{
    type: String,
    default: 'pending',
    enum: ['delivered', 'pending'] 
   }
},  {timestamps: true})




module.exports = mongoose.model("EmailBody", EmailBodySchema); 