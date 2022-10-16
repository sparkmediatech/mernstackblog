const express = require("express");
const app = express(); 
const multer = require("multer");
const {uploadCloudinary} = require("./middleware/CloudinaryFunctions")
const path = require("path")
//import middleware
const notFoundMiddleware = require('./middleware/not-found');
const cookieParser = require('cookie-parser');
const checkDB = require('./middleware/scheduleTask');
const cors = require('cors');
const fs = require('fs');




//import routes
const authRoute = require("./routes/auths")
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const commentRoute = require("./routes/comment")
const replycommentRoute = require("./routes/replycomment");
const headervalues = require("./routes/headervalue");
const refreshToken = require('./routes/refreshToken');
const verifyEmailRoute = require('./routes/EmailVerifyRoute');
const searchRout = require('./routes/searchroute');
const PopularPosts = require('./routes/popularPost');
const Categories = require('./routes/Categories');
const ClientComponent = require('./routes/ClientComponent');
const ClientPathName = require('./routes/ClientPathName');
const EmailSubscribers = require('./routes/Email');
const SliderState = require('./routes/SliderState')






app.use(cors({credentials: true,
    origin: 'http://localhost:3000'
}));


app.use(express.json());





//cookie-parser
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/build')))

app.use("images", express.static(path.join(__dirname, "/images") ))
//allowed image formats





//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users",userRoute);
app.use("/api/v1/posts",postRoute);
app.use("/api/v1/popular", PopularPosts)
app.use("/api/v1/comments", commentRoute);
app.use("/api/v1/reply", replycommentRoute)
app.use("/api/v1/headervalue", headervalues);
app.use("/api/v1/", refreshToken);
app.use("/api/v1/", verifyEmailRoute);
app.use("/api/v1/", searchRout);
app.use("/api/v1/category", Categories);
app.use("/api/v1/component", ClientComponent);
app.use("/api/v1/pathname", ClientPathName );
app.use("/api/v1/emailsub", EmailSubscribers);
app.use("/api/v1/sliderstate", SliderState);






app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})
//app.use(notFoundMiddleware);
//app.use("/api", (req, res, next) => {console.log(req.originalUrl); next()}, verifyEmailRoute);
app.use(checkDB);


module.exports = app;