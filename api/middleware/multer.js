const multer = require("multer");




//allowed image formats
        const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];

        const storage = multer.diskStorage({//choosing destination of the file
        destination:(req, file, cb) =>{
        if(ALLOWED_FORMATS.includes(file.mimetype)){
             //cb(null, "./images")
              cb(null, true)
        }else{
            cb(new Error('Not supported file type!'), false)
        }
       
    }, filename:(req, file,cb)=> {//choosing file name
       cb(null, req.body.name) 
    }
});

const upload = multer({storage:storage});



module.exports = {upload}