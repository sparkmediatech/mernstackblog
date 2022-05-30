//creating the user models for the database

const mongoose = require("mongoose"); //import mongoose
const Schema = mongoose.Schema;


const FrontendSchema = new mongoose.Schema(
    {
        websiteName:{
            type: String,
            required: true,           
        },
        siteImagePublicId:{
            type: String,
        },
        headerColor:{
            type: String,
            default: "#FDFEFE"
        },
        navColor:{
            type: String,
            default: "#C0392B"
        },
        headerImg:{
            type: String,
            default: ""
        },

         aboutWebsite:{
            type: String,
        }
       
},

);

//exporting this schema
module.exports = mongoose.model("Frontend", FrontendSchema); //the module name is "Post"