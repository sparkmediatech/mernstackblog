const {cloudinary} = require('../services/Cloudinary');
const fs = require('fs')



const uploadCloudinary = async (fileToUpload)=>{
    const uploadResponse = await cloudinary.uploader.upload(fileToUpload, {
            upload_preset: 'nodeblog',
        }, function(result, err){
            if(err){
               //delete file from local server storage
                return console.log('failed to upload')
            }
            //delete file from local server storage
                fs.unlinkSync(fileToUpload);
                return result 
        });
        fs.unlinkSync(fileToUpload);  
        return uploadResponse
};

const deleteCloudinary = async (fileToDelete) =>{
    const deleteResponse = await cloudinary.uploader.destroy(fileToDelete, function(result, err){
        if(err){
                //delete file from local server storage
               return console.log(error)
        }
        //delete file from local server storage
                fs.unlinkSync(fileToDelete);
                return console.log(result, 'file deleted')
    })
    fs.unlinkSync(fileToUpload);
    return deleteResponse
}


module.exports = { uploadCloudinary, deleteCloudinary}