const http = require('http');
require('dotenv').config();;//declaring the envy file

const app = require('./app');
//mongoDb
const connectDB = require('./db/connect');


//connect to mongodb server
const port = process.env.PORT || 5000;


const server = http.createServer(app);


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    server.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();


