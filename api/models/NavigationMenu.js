const mongoose = require("mongoose"); //import mongoose
const Schema = mongoose.Schema;


const NavigationMenuSchema = new mongoose.Schema(
    {
        naviMenuName:{
            type: String,
            required: true,           
        },
        primaryColor:{
            type: String,
            default: " "
        },
        selctionColor:{
            type: String,
            default: ""
        },
        secondaryColor:{
            type: String,
            default: ""
        },       
},

);

//exporting this schema
module.exports = mongoose.model("NavigationMenuSchema", NavigationMenuSchema); 