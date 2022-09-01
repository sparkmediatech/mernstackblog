const mongoose = require("mongoose"); 
const Schema = mongoose.Schema;

const ClientComponentSchema = new mongoose.Schema({
    componentName:{
       type: String,
       required: true,
    },
   
},  {timestamps: true})




module.exports = mongoose.model("ClientComponent", ClientComponentSchema); 