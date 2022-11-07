const mongoose = require('mongoose');
require('dotenv').config();;//declaring the envy file


//replace this with your own mongo cloud username and password inside your env file
const MONGO_URL = process.env.MONGO_URL

const connectDB = async(url) => {
    mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    keepAlive: true,
    autoReconnect: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
}

module.exports = connectDB