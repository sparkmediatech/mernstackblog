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
const fs = require('fs')



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




app.use(cors({credentials: true,
    origin: 'http://localhost:3000'
}));


app.use(express.json());

//cookie-parser
app.use(cookieParser());



app.use("/images", express.static(path.join(__dirname, "/images") ))
//allowed image formats
const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];

//login to upload images using libery called multer
const storage = multer.diskStorage({//choosing destination of the file
    destination:(req, file, cb) =>{
        if(ALLOWED_FORMATS.includes(file.mimetype)){
             cb(null, "images")
        }else{
            cb(new Error('Not supported file type!'), false)
        }
       
    }, filename:(req, file,cb)=> {//choosing file name
       cb(null, req.body.name) 
    }
})

const upload = multer({storage:storage});//uploading file to the file storage variabe that we created above

//image upload endpoint
app.post("/api/v1/upload", upload.single("file"), async (req, res) =>{
   
    try {
        const fileStr = req.file.path
        console.log(fileStr)
        if(!fileStr){
              return res.status(500).json( 'No image found');
        }else{
            //calling the cloudinary function for upload
             const uploadResponse = await uploadCloudinary(fileStr)
            console.log(uploadResponse)
            
            const result = {
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id
        }
            return res.status(200).json(result)
        }
        
    
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err: 'Something went wrong' });
       
    }
   
  
}); 





//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users",userRoute);
app.use("/api/v1/posts",postRoute);
app.use("/api/v1/comments", commentRoute);
app.use("/api/v1/reply", replycommentRoute)
app.use("/api/v1/headervalue", headervalues);
app.use("/api/v1/", refreshToken);
app.use("/api/v1/", verifyEmailRoute);
app.use("/api/v1/", searchRout)
app.use(notFoundMiddleware);

//app.use("/api", (req, res, next) => {console.log(req.originalUrl); next()}, verifyEmailRoute);
app.use(checkDB);

module.exports = app;