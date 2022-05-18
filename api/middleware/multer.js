const multer = require("multer");




//allowed image formats
        const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];

        //login to upload images using libery called multer
        const storage = multer.diskStorage({//choosing destination of the file
        destination:(req, file, cb) =>{
        if(ALLOWED_FORMATS.includes(file.mimetype)){
             cb(null, "./images")
        }else{
            cb(new Error('Not supported file type!'), false)
        }
       
    }, filename:(req, file,cb)=> {//choosing file name
       cb(null, req.body.name) 
    }
});

const upload = multer({storage:storage});//uploading file to the file storage variabe that we created above
console.log(upload)


module.exports = {upload}