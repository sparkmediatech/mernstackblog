const NavigationMenuSchema = require('../models/NavigationMenu');
const User = require("../models/User"); //the user model imported to be used

const createNavigationMenu = async (req, res) =>{
    const naviMenuName= req.body.naviMenuName;
    const naviMenuAllCaps = naviMenuName.toUpperCase()
    try{
        const user = await User.findById(req.user.userId);
            if(!user){
                return res.status(404).json('no user found');   
                }
            if(user.role !== 'admin'){
                return res.status(401).json('you do not have permission');
            }
            
            //check database
        const checkDataBase = await NavigationMenuSchema.find();

            if(checkDataBase.length > 7){
                return res.status(500).json('navigation menu should not be more than 7')
            }
            //check if the navigation menu already exist on the database

        const checkDublicateNaviMen = await NavigationMenuSchema.exists({naviMenuName: naviMenuAllCaps});
            if(checkDublicateNaviMen){
                return res.status(500).json('navigation menu already exist')
            }

            
            if(naviMenuAllCaps == ''){
                return res.status(500).json('navigation menu can not be empty');
            }

            if(!naviMenuAllCaps){
                return res.status(500).json('navigation menu must be provided');
            }
            if(naviMenuAllCaps.length < 2){
               return res.status(500).json('navigation menu must not be less than 2 words'); 
            }
        const checkWhiteSpace = () =>{
                return /\s/.test(naviMenuAllCaps)
            }
            if(checkWhiteSpace == true){
                return res.status(500).json('navigation menu name must not contain empty space')
            }

        const newNaviMenu = new NavigationMenuSchema({
                 _id: req.body._id,
                 naviMenuName: naviMenuAllCaps,
                 primaryColor: req.body.primaryColor,
                 selctionColor: req.body.selctionColor,
                 secondaryColor: req.body.secondaryColor,

             });
        const savedNaviMenu = await newNaviMenu.save();
            //response for frontend
        const responseNaviMenu = {
                  _id:savedNaviMenu._id,
                 naviMenuName: savedNaviMenu.naviMenuName,
                 primaryColor:savedNaviMenu.primaryColor,
                 selctionColor:savedNaviMenu.selctionColor,
                 secondaryColor: savedNaviMenu.secondaryColor,
             };
        return res.status(200).json(responseNaviMenu)

    }catch(err){   
        console.log(err) 
        return res.status(500).json('something went wrong')
    }

}

//get naviMenu

const getSingleNavigationMenu = async (req, res)=>{
    try{
        const user = await User.findById(req.user.userId);
            if(!user){
              return res.status(404).json('no user found');   
                }
            if(user.role !== 'admin'){
                return res.status(401).json('you do not have permission');
            }
        const navigationMenu = await NavigationMenuSchema.findById(req.params.menuId);

            if(!navigationMenu){
            return res.status(404).json('no navigation with the Id found')
            }
    
        const {createdAt,updatedAt,__v, ...othernNavigationMenuValues } =navigationMenu._doc;
        return res.status(200).json(othernNavigationMenuValues)
    }catch(err){
        console.log(err)
        return res.status(500).json('something went wrong')
    }
} 

//get all naviMenu

const getAllNavigationMenu = async (req, res)=>{
    console.log('I am testing menu')
    try{
         //I excluded some fields 
        const allNevigationMenu = await NavigationMenuSchema.find({}, {createdAt: 0, __v: 0, updatedAt: 0});
            if(!allNevigationMenu){
                return res.status(404).json('No navigation menu found');
            };
         return res.status(200).json(allNevigationMenu);
    }catch(err){
        console.log(err)
         return res.status(500).json('something went wrong');
    }
}


module.exports = {
    createNavigationMenu,
    getSingleNavigationMenu,
    getAllNavigationMenu,
} 