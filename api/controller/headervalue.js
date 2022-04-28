const Frontend = require("../models/headervalues");
const User = require("../models/User")


//create new frontend paramters into database
const createNewHeaderValues = async (req, res) =>{
try{
    const user = await User.findById(req.user.userId);

    if(!user){
         res.status(404).json('User not found')
    };
    if(user.role !== 'admin'){
         res.status(404).json('Not authorized for this feature')
    }
       const newFrontendValues = new Frontend(req.body);//we called the frontend model we created and we used req.body

   try{
        const savedFrontendValues = await newFrontendValues.save()//we tried to save the frontend values created
        res.status(200).json(savedFrontendValues)
    }catch(err){
       res.status(500).json('Could not save')
   }
   
}catch(err){
res.status(500).json("Something went wrong")
}
    
}

//get frontend parameters
const getSingleHeaderValue = async (req, res) =>{

     try{
        const frontend = await Frontend.findById(req.params.id)
        res.status(200).json(frontend)
    }catch(err){
        res.status(500).json('something went wrong')
    }

}

//edit frontend paramters
const editHeaderValue = async (req, res) =>{
try{
    const user = await User.findById(req.user.userId);
    if(user && user.role === "admin"){
      try{
         
          const frontendValue = await Frontend.findByIdAndUpdate(req.params.id, {
             $set: req.body
          }, {new: true})
               res.status(200).json(frontendValue)

    }catch(err){
        res.status(500).json(err)
        console.log(err)
    }
    }else{
        res.status(500).json("You do not have permission")
    }
}catch(err){
     res.status(500).json("something went wrong")
}
    

}

//getAll header values
const getAllHeaderValues = async (req, res) =>{
    try{
      allFrontendValues = await Frontend.find()
      res.status(200).json(allFrontendValues)
   }catch(err){
      res.status(500).json(err);
      console.log(err)
   }

}

module.exports = {
    createNewHeaderValues,
    getSingleHeaderValue,
    editHeaderValue,
    getAllHeaderValues
}