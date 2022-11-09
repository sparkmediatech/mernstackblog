const ClientComponents = require('../models/ClientsideComponents');
const User = require('../models/User');
const cron = require('node-cron');



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



//This cron runs to check if there is any component name yet to be created, it creates it automatically. The component name is extremely7 important for the menu on the frontside
//This is automatic and cant be worked except you are good with changiing the component names in reactjs
const autoUpdateDatabase = async () =>{
    cron.schedule('* * * * *', async ()=>{
    
        const componentNameAbout = 'ABOUT'; 
        const componentNameBLOG = 'BLOG'
        const componentNameWRITE = 'WRITE'
        const componentNameHOME = 'HOME'
        const componentNameCONTACT = 'CONTACT'

        const checkDublicateComponentAbout = await ClientComponents.exists({componentName:componentNameAbout});
        const checkDublicateComponentBlog = await ClientComponents.exists({componentName:componentNameBLOG});
        const checkDublicateComponentWRITE = await ClientComponents.exists({componentName:componentNameWRITE});
        const checkDublicateComponentHOME = await ClientComponents.exists({componentName:componentNameHOME});
        const checkDublicateComponentCONTACT = await ClientComponents.exists({componentName:componentNameCONTACT});



        if(!checkDublicateComponentAbout){
            const newClientComponent = new ClientComponents({
            
                componentName: componentNameAbout,
                
       
            });
            await newClientComponent.save();
            console.log(`component name of ${componentNameAbout}  created`)
        }

       if(!checkDublicateComponentBlog){
        const newClientComponent = new ClientComponents({
            
            componentName: componentNameBLOG,
            
   
        });
        await newClientComponent.save();
        console.log(`component name of ${componentNameBLOG}  created`)
       }

    
    if(!checkDublicateComponentWRITE){
        const newClientComponent = new ClientComponents({
            
            componentName: componentNameWRITE,
            
   
        });
        await newClientComponent.save();
        console.log(`component name of ${componentNameWRITE}  created`)
    }
     

    if(!checkDublicateComponentHOME){
        const newClientComponent = new ClientComponents({
            
            componentName: componentNameHOME,
            
   
        });
        await newClientComponent.save();
        console.log(`component name of ${componentNameHOME}  created`)
    }


    if(!checkDublicateComponentCONTACT){
        const newClientComponent = new ClientComponents({
            
            componentName: componentNameCONTACT,
            
   
        });
        await newClientComponent.save();
        console.log(`component name of ${componentNameCONTACT}  created`)
    }



    });
   
};



autoUpdateDatabase()


module.exports = {
    createClientComponent,
    getAllClientComponent,
}