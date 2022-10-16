const User = require('../models/User');
const SliderState = require('../models/SliderState')





const createSliderState = async(req, res) =>{

try{
    const user = await User.findById(req.user.userId);
    const sliderState = req.body.sliderState
    if(!user){
        return res.status(404).json('user not found')
    }

    if(user.role !== 'admin'){
        return res.status(401).json('Not permitted')
    }

    //check if there is already a slider state
    const checkDuplicate = await SliderState.find();
    console.log(checkDuplicate)
    if(checkDuplicate.length > 0){
        return res.status(500).json('Not more than 1 slider state is allowed')
    }

    const newSliderState = new SliderState(req.body);
    
    const savedSliderState = await newSliderState.save();

    return res.status(200).json(savedSliderState)
        }catch(err){
             return res.status(500).json('something went wrong')
        }
    
}

const updateSliderState = async(req, res)=>{
    try{
        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(404).json('no user found');

        }

        if(user.role != 'admin'){
            return res.status(401).json('not permitted')
        }

        const sliderState = await SliderState.findById(req.params.sliderStateId);
        if(!sliderState){
            return res.status(404).json('no file found')
        }
        if(req.body.sliderState === sliderState.sliderState){
            return res.status(500).json('You can not choose previous state to update')
        }

      
        await SliderState.findByIdAndUpdate(req.params.sliderStateId, {
                 $set: req.body
            }, {new: true, runValidators: true});

        return res.status(200).json('slider state updated')
    }catch(err){
        console.log(err)
         return res.status(500).json('something went wrong')
    }
}



const getSliderState = async (req, res)=>{
    try{
        const sliderState = await SliderState.find();
        if(sliderState.length < 1){
            return res.status(404).json('no file found')
        }

        return res.status(200).json(sliderState)
    }catch(err){
        return res.status(500).json('something went wrong')
    }
}


module.exports = {
    createSliderState,
    updateSliderState,
    getSliderState,
}