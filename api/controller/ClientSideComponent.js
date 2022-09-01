const ClientComponents = require('../models/ClientsideComponents');
const User = require('../models/User')



const createClientComponent = async (req, res) =>{
    const componentName = req.body.componentName;
    const componentAllCamps = componentName.toUpperCase()
    try{
        const user = await User.findById(req.user.userId);
            if(!user){
                return res.status(404).json('no user found');   
                }
            if(user.role !== 'admin'){
                return res.status(401).json('you do not have permission');
            }

        const checkDublicateComponent = await ClientComponents.exists({componentName:componentAllCamps});
            if(checkDublicateComponent){
                return res.status(500).json('component name already exist')
            }

            if(!componentAllCamps){
                return res.status(500).json('component name must be present')
            }

            if(componentAllCamps === ''){
                return res.status(500).json('component name must not be empty')
            }


        const newClientComponent = new ClientComponents({
                 _id: req.body._id,
                 componentName: componentAllCamps,
        
             });


        const savedClientComponent = await newClientComponent.save();
            //response for frontend
        const responseClientComponent = {
                  _id:savedClientComponent._id,
                 componentName: savedClientComponent.componentName,
             };
        return res.status(200).json(responseClientComponent)
    }catch(err){

    }
}

const getAllClientComponent = async (req, res) =>{
     try{
         //I excluded some fields 
        const allClientComponent = await ClientComponents.find({}, {createdAt: 0, __v: 0, updatedAt: 0});
            if(!allClientComponent){
                return res.status(404).json('No client component found');
            };
         return res.status(200).json(allClientComponent);
    }catch(err){
        console.log(err)
         return res.status(500).json('something went wrong');
    }
}


module.exports = {
    createClientComponent,
    getAllClientComponent,
}