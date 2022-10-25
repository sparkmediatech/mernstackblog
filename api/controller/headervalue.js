const Frontend = require("../models/headervalues");
const User = require("../models/User");
const {deleteCloudinary, uploadCloudinary, deleteAllFiles} = require('../middleware/CloudinaryFunctions')
const fs = require('fs');

//create new frontend paramters into database
const createNewHeaderValues = async (req, res) =>{
    const aboutWebsite = req.body.aboutWebsite;

    const siteName = req.body.websiteName;
    const websiteName = siteName.toUpperCase();


try{
    //check duplicate content 
    const checkduplicateDoc = await Frontend.exists({});
    console.log(checkduplicateDoc)
    if(checkduplicateDoc){
        if(req.file){
                 fs.unlinkSync(req.file.path);
           }
        return res.status(500).json('You can not create more than one document for this model')
    }

   
    if(aboutWebsite === " " || null){
         if(req.file){
                 fs.unlinkSync(req.file.path);
           }
        return res.status(500).json('website about section must not be empty')
    }
    if( websiteName.length > 13){
        if(req.file){
                 fs.unlinkSync(req.file.path);
           }
        return res.status(500).json('website name should not be more than 13 words')
    }
    
    if(websiteName.length < 4){
          if(req.file){
                 fs.unlinkSync(req.file.path);
           }
        return res.status(500).json('website name must not be less than 4 words')
    }
   
    //check the user about string count
     const string =  aboutWebsite.split('');
     const aboutWebsiteWordCount = string.filter(word => word !== '').length;
    
     if(aboutWebsiteWordCount  >=  1200){
         if(req.file){
                 fs.unlinkSync(req.file.path);
           }
         return res.status(500).json('about website section should not be more than 400 words')
     }
     if(aboutWebsiteWordCount <= 100){
         if(req.file){
                 fs.unlinkSync(req.file.path);
           }
          return res.status(500).json('about website section should not be less than 100 words')
     }
     
    const user = await User.findById(req.user.userId);

    if(!user){
        if(req.file){
                 fs.unlinkSync(req.file.path);
           }
         res.status(404).json('User not found')
    };
    if(user.role !== 'admin'){
        if(req.file){
                 fs.unlinkSync(req.file.path);
           }
         res.status(404).json('Not authorized for this feature')
    };
    

    const newFrontendValues = new Frontend({
        _id: req.body._id,
        headerColor: req.body.headerColor,
        navColor: req.body.navColor,
        headerImg:req.body.headerImg,
        websiteName: websiteName,
        siteImagePublicId: req.body.siteImagePublicId,
        aboutWebsite: aboutWebsite
    });
    const savedFrontendValues = await newFrontendValues.save()

try{
    //upload image to cloudinary
    const fileStr = req.file.path
    if(!fileStr){
        if(req.file){
                 fs.unlinkSync(req.file.path);
           }
            return res.status(500).json( 'No image found');
        }else{
        //calling the cloudinary function for upload
        const uploadResponse = await uploadCloudinary(fileStr)
            
        const result = {
        url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id
        }
        const updatedHeaderValues = await Frontend.findByIdAndUpdate(savedFrontendValues._id, {
        headerImg: result.url,
        siteImagePublicId: result.publicId

        }, {new: true})
    //values to be sent to frontend
        const response = {
            _id: updatedHeaderValues._id,
            headerColor: updatedHeaderValues.headerColor,
            navColor: updatedHeaderValues.navColor,
            headerImg:updatedHeaderValues.headerImg,
            websiteName: updatedHeaderValues.websiteName,
            siteImagePublicId: updatedHeaderValues.siteImagePublicId,
            aboutWebsite: updatedHeaderValues.aboutWebsite

        };
         return res.status(200).json(response)
        }
}catch(err){
    if(req.file){
        fs.unlinkSync(req.file.path);
        }
        return res.status(500).json('something with wrong with image')
    }
    
   
}catch(err){
    if(req.file){
        fs.unlinkSync(req.file.path);
    }
    console.log(err)
res.status(500).json("Something went wrong")
}
    
}

//get frontend parameters
const getSingleHeaderValue = async (req, res) =>{

     try{
        const frontend = await Frontend.findById(req.params.id);
        if(!frontend){
            return res.status(401).json('no value found')
        }
        res.status(200).json(frontend)
    }catch(err){
        res.status(500).json('something went wrong')
    }

}

//edit frontend paramters
const editHeaderValue = async (req, res) =>{
    const aboutWebsite = req.body.aboutWebsite;
    const siteName = req.body.websiteName

     if(siteName.length > 13){
        
        if(req.file){
                 fs.unlinkSync(req.file.path);
           }
        return res.status(500).json('website name should not be more than 13 words')
    };

    if(siteName.length < 4){
          if(req.file){
                 fs.unlinkSync(req.file.path);
           }
        return res.status(500).json('website name must not be less than 4 words')
    }
    const websiteName = siteName.toUpperCase()
    console.log(websiteName)
try{
    //find admin user
    const user = await User.findById(req.user.userId);
     if(!user){
        if(req.file){
            fs.unlinkSync(req.file.path);
           }
        return res.status(404).json('no user found')
    };

    if(user.role !== 'admin'){
         if(req.file){
            fs.unlinkSync(req.file.path);
           }
        res.status(500).json("You do not have permission")
    };
   if(aboutWebsite){
        //check the user about string count
     const string =  aboutWebsite.split('');
     const aboutWebsiteWordCount = string.filter(word => word !== '').length;
     console.log(aboutWebsiteWordCount)
     if(aboutWebsiteWordCount  >= 1200){
         if(req.file){
                 fs.unlinkSync(req.file.path);
           }
         return res.status(500).json('about website section should not be more than 400 words')
     }
     if(aboutWebsiteWordCount <= 100){
         if(req.file){
                 fs.unlinkSync(req.file.path);
           }
          return res.status(500).json('about website section should not be less than 100 words')
     }
   }

   
    try{
        //find the frontend value to edit
        const getHeaderValue = await Frontend.findById(req.params.id);

         if(!getHeaderValue){
            if(req.file){
                 fs.unlinkSync(req.file.path);
                }
            return res.status(401).json("No value with this Id found");
            };

        //get the current user profile pics public id for cloudinary delete operations
        const currentsiteImagePublicId = getHeaderValue.siteImagePublicId;
        //update the frontEnd values
        const frontendValue = await Frontend.findByIdAndUpdate(req.params.id, {
             $set: req.body,
             websiteName: websiteName
            
          }, {new: true})

         //update image if user changed image
        if(req.file){

        const fileStr = req.file.path;
        //calling the cloudinary function for upload
        const uploadResponse = await uploadCloudinary(fileStr);
        const result = {
                url: uploadResponse.secure_url,
                publicId: uploadResponse.public_id
            };

        //push image to upated header value model
         const updatedHeaderValueImage = await Frontend.findByIdAndUpdate(frontendValue._id, {
            siteImagePublicId :result.publicId,
            headerImg:result.url
            }, {new: true});

        //get the updated header image public id for cloudinary delete operations
        const updatedHeaderImagePublicId = updatedHeaderValueImage.siteImagePublicId;

        //compare the two public ids. If they are not same and the value is not an empty string, that means the user changed the image, the cloudinary delete method would run
        if(currentsiteImagePublicId !== "" && currentsiteImagePublicId !== updatedHeaderImagePublicId && updatedHeaderValueImage.siteImagePublicId !== "" ){
                await deleteCloudinary(getHeaderValue.siteImagePublicId)
            };
        };

        return res.status(200).json(frontendValue); 
    }catch(err){
         if(req.file){
            fs.unlinkSync(req.file.path);
           }
           console.log(err)
        return res.status(500).json('something went wrong with image')
    }

}catch(err){
    console.log(err)
    return res.status(500).json('something went wrong with user')
}

}

//getAll header values
const getAllHeaderValues = async (req, res) =>{
    try{
      allFrontendValues = await Frontend.find()
      if(!allFrontendValues){
        return res.status(401).json('no value found')
      }
      res.status(200).json(allFrontendValues)
   }catch(err){
      res.status(500).json('something went wrong')
     
   }

}

module.exports = {
    createNewHeaderValues,
    getSingleHeaderValue,
    editHeaderValue,
    getAllHeaderValues
}