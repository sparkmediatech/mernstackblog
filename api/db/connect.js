const mongoose = require('mongoose')

const connectDB = (url) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    keepAlive: true,
    autoReconnect: true,
    useCreateIndex: true,
    reconnectTries:Number.MAX_VALUE, 
    reconnectInterval: 5000,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
}

module.exports = connectDB
