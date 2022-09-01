const User = require('../models/User');
const ClientPathName = require('../models/ClientPathName');




const createClientPathName = async (req, res) =>{
        const clientmenuName = req.body.menuName;
       
        const aliasName = req.body.aliasName;
       
        const pathName = req.body.pathName
       
    try{
        
         const user = await User.findById(req.user.userId);
            if(!user){
                return res.status(404).json('no user found');   
                }
            if(user.role !== 'admin'){
                return res.status(401).json('you do not have permission');
            }

            if(!clientmenuName){
                return res.status(404).json('Menu name must be present')
            }

            if(clientmenuName == ''){
                return res.status(500).json('menu name can not be empty');
            }
            if(!aliasName){
                return res.status.json('alias name must be provided')
            }

            if(aliasName == ''){
                return res.status(404).json('alias name must not be empty')
            }

            if(!pathName){
                return res.status(500).json('path name must be provided')
            }

            if(pathName == ''){
                return res.status(404).json('pathName must not be empty')
            }
            if(/\s/.test(pathName)){
                return res.status(500).json('pathname must not contain empty space')
            }
            
            if(!isNaN(pathName)){
                return res.status(500).json('pathname should not be a number')
            }

            if(!isNaN(clientmenuName)){
                return res.status(500).json('menu name should not be a number')
            }
            if(pathName === pathName.toUpperCase()){
                return res.status(500).json('path name should not be all capital letters');
            }
          
        const clienMenuNameAllCaps = clientmenuName.toUpperCase();
        const aliasNameUppercase = aliasName.toUpperCase()

        //check if the navigation menu already exist on the database

        const checkDublicateMenuName = await ClientPathName.exists({menuName: clienMenuNameAllCaps});
            if(checkDublicateMenuName){
                return res.status(500).json('client menu name already exist')
            }
        const checkDublicatePathName = await ClientPathName.exists({pathName: pathName});
            if(checkDublicatePathName){
                return res.status(500).json('client path name already exist')
            }

        const newClientPathName = new ClientPathName({
                 _id: req.body._id,
                 pathName: pathName,
                 menuName:clienMenuNameAllCaps,
                 aliasName: aliasNameUppercase
        
             });


        const savedClientPathName = await  newClientPathName.save();
            //response for frontend
        const responseClientPathName = {
                  _id:savedClientPathName._id,
                 pathName: savedClientPathName.pathName,
                 aliasName: savedClientPathName.aliasName,
                 menuName: savedClientPathName.menuName
             };
        return res.status(200).json(responseClientPathName)
    }catch(err){
        console.log(err)
        return res.status(500).json('something went wrong')
    }
}


//update pathName
const updateClientPathName = async (req, res) =>{
        const menuName = req.body.menuName;
        const pathName = req.body.pathName;
        
        if(!menuName){
            return res.status(404).json('menu name must be present')
        }

        if(!pathName){
            return res.status(500).json('pathName must be present')
        }

        if(/\s/.test(pathName)){
                return res.status(500).json('pathname must not contain empty space')
            }

        if(pathName == ''){
                return res.status(404).json('pathName must not be empty')
            }
             
        if(!isNaN(pathName)){
                return res.status(500).json('pathname should not be a number')
            }
       
        if(!isNaN(menuName)){
                return res.status(500).json('menu name should not be a number')
            }
         if(pathName === pathName.toUpperCase()){
                return res.status(500).json('path name should not be all capital letters');
            }

        if(menuName == ''){
                return res.status(404).json('menu name must not be empty')
            }

            const menuNameAllCaps = menuName.toUpperCase();
    try{
            const user = await User.findById(req.user.userId);
         if(!user){
                return res.status(404).json('no user found');   
                }
            if(user.role !== 'admin'){
                return res.status(401).json('you do not have permission');
            }

    const pathNameToUpdate = ClientPathName.findById(req.params.pathNameId);
        if(!pathNameToUpdate){
            return res.status(404).json('no pathname found')
        }

    //update the ClientPathName
    const updatedClientPathName = await ClientPathName.findByIdAndUpdate(req.params.pathNameId, {
        menuName: menuNameAllCaps,
        pathName:pathName
    }, {new: true});
    return res.status(200).json('client pathName updated');


    }catch(err){
        return res.status(500).json('something went wrong')
    }

}
//get all pathnames

const getAllClientPathName = async (req, res)=>{
    console.log('I am testing menu')
    try{
         //I excluded some fields 
        const allClientPathName = await ClientPathName.find({}, {createdAt: 0, __v: 0, updatedAt: 0});
            if(!allClientPathName){
                return res.status(404).json('No pathname found');
            };
         return res.status(200).json(allClientPathName);
    }catch(err){
        console.log(err)
         return res.status(500).json('something went wrong');
    }
}

//get single pathname
const getSinglePathName = async (req, res) =>{
    try{
        const singlePathName = await ClientPathName.findById(req.params.pathNameId);
        if(!singlePathName){
             return res.status(404).json('No pathname found')
        }

        return res.status(200).json(singlePathName);
    }catch(err){
         return res.status(500).json('something went wrong')
    }
}

//delete single pathName
const deleteSinglePathName = async(req, res) =>{
    try{
        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(404).json('user not found')
         }
        if(user.role !== 'admin'){
           return res.status(401).json('You are not authourized to perform this action')
        }
    //find pathname
    const pathName = await ClientPathName.findById(req.params.pathNameId);
    if(!pathName){
        return res.status(404).json('no pathName found')
    }
     await ClientPathName.findByIdAndDelete(req.params.pathNameId);
        return res.status(200).json(pathName)
    }catch(err){
         return res.status(500).json('Something went wrong')
    }
}

module.exports ={
    createClientPathName,
    getAllClientPathName,
    getSinglePathName,
    deleteSinglePathName,
    updateClientPathName,
}