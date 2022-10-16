const mongoose = require("mongoose"); 
const Schema = mongoose.Schema;

const SliderStateSchema = new mongoose.Schema({
    sliderState:{
       type: String,
       default: 'sliderON',
        enum: ['sliderON', 'sliderOFF', 'headerOFF'] 
    },
   
},  {timestamps: true})




module.exports = mongoose.model("SliderState", SliderStateSchema); 