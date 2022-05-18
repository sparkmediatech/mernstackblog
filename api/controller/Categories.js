const User = require('../models/User');
const Category = require('../models/Categories');





//create category
const createCategory = async (req, res)=>{
    const letters = /^[A-Za-z]+$/;
    const getCatNameString = req.body.catName;
    //convert first letter to capital letter
    const catName = getCatNameString.charAt(0).toUpperCase() + getCatNameString.slice(1)
    console.log(catName)
   
    try{
        const checkDataBase = await Category.find({});
        if(checkDataBase.length > 7){
            return res.status(500).json('There are already 8 categories, you can not create more than 8')
        }

      const checkDublicate = await Category.exists({catName: catName});
      if(checkDublicate){
          return res.status(500).json('Category already exist')
      }
       if(!catName.match(letters)){
             return res.status(500).json('check your category name, category name must be letters')
        }

        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(404).json('No user found')
        }
        if(user.role !== 'admin'){
            return res.status(401).json('You are not authourized to perform this action')
        }
        if(catName == ''){
            return res.status(500).json('Category name must not be empty')
        }
        if(catName.length <= 3){
            return res.status(500).json('category name should be more than 4 letters')
        };
        if(catName.length >= 16){
            return res.status(500).json('category name should not be more than 16 letters')
        };
             const newCategory = new Category({
                 _id: req.body._id,
                 catName: catName
             });
            
            
             const savedCategory = await newCategory.save();
             //response for frontend
             const category = {
                 _id:savedCategory._id,
                 catName: savedCategory.catName
             };
            return res.status(200).json(category)
            
    }catch(err){
        console.log(err)
        return res.status(500).json('Something went wrong')
    }
};

//delete category

const deleteCategory = async (req, res) =>{
    try{
        
       const user = await User.findById(req.user.userId)
       if(!user){
           return res.status(404).json('User not found')
       };
       if(user.role !== 'admin'){
           return res.status(401).json('You are not authourized to perform this action')
       }
        await Category.findByIdAndDelete(req.params.categoryId);
        return res.status(200).json('Category deleted')

    }catch(err){
        return res.status(500).json('Something went wrong')
    }

}

//update category 

const updateCategory = async (req, res)=>{
    try{
        const findCategory = await Category.findById(req.params.categoryId);
        if(!findCategory){
            return res.status(404).json('No category with the id found')
        }
        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(404).json("No user found")
        };
        if(user.role !== 'admin'){
            return res.status(401).json('You are not authorized to perform this action')
        };
        try{
            await Category.findByIdAndUpdate(req.params.categoryId, {
                 $set: req.body
            }, {new: true, runValidators: true});
            return res.status(200).json('Category updated')
        }catch(err){
            return res.status(404).json('No category found')
        }
    }catch(err){
        return res.status(500).json('something went wrong')
    }
};


//get single category

const getSingleCategory = async (req, res)=>{
    try{
        const getSingleCategory = await Category.findById(req.params.categoryId).populate('postCategories');
        if(!singleCategory){
            return res.status(404).json('No category found')
        };
        const {createdAt,updatedAt,__v, ...singleCategory } = getSingleCategory._doc;
        return res.status(200).json(singleCategory)
    }catch(err){
        return res.status(500).json('Something went wrong')
    }
}

//get all categories

const getAllCategories = async (req, res) =>{
    try{
        //I excluded some fields 
        const allCategories = await Category.find({}, {createdAt: 0, __v: 0, updatedAt: 0});
        if(!allCategories){
            return res.status(404).json('No categories found');
        };
     
        return res.status(200).json(allCategories);
    }catch(err){
        return res.status(500).json('something went wrong')
    }
}

module.exports = {createCategory,  deleteCategory, updateCategory, getSingleCategory, getAllCategories}