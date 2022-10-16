const User = require('../models/User');
const Category = require('../models/Categories');
const Post = require('../models/Post')





//create category
const createCategory = async (req, res)=>{
    const letters = /^[A-Za-z]+$/;
    const getCatNameString = req.body.catName;
    //convert first letter to capital letter
    const catName = getCatNameString.charAt(0).toUpperCase() + getCatNameString.slice(1)
   
    try{
        const checkDataBase = await Category.find({});
        if(checkDataBase.length > 7){
            return res.status(500).json('There are already 8 categories, you can not create more than 8')
        }
    
    //check if the category already exist on the database
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

        if(/\s/.test(catName)){
                return res.status(500).json('catName must not contain empty space')
            }


        
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
       //find category
       const category = await Category.findById(req.params.categoryId);
       if(!category){
           return res.status(404).json('no category found')
       };
       //check if this category already has posts with the name
       const post = await Post.find({categories: category.catName})
       if(post){
           return res.status(500).json('You can not delete a category that has been assigned a post. Please, consider changing the name')
       }
        await Category.findByIdAndDelete(req.params.categoryId);
        return res.status(200).json('Category deleted')

    }catch(err){
        return res.status(500).json('Something went wrong')
    }

}

//update category 

const updateCategory = async (req, res)=>{
    
    const getCatNameString = req.body.catName;
    //convert first letter to capital letter
    const catName = getCatNameString.charAt(0).toUpperCase() + getCatNameString.slice(1)
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

        if(catName == ''){
            return res.status(500).json('Category name must not be empty')
        }

        if(catName.length <= 3){
            return res.status(500).json('category name should be more than 4 letters')
        };

        if(catName.length >= 16){
            return res.status(500).json('category name should not be more than 16 letters')
        };
        
        if(/\s/.test(catName)){
                return res.status(500).json('catName must not contain empty space')
            }



        if(!isNaN(catName)){
                return res.status(500).json('catName should not be a number')
            }
     
            const updatedCategory = await Category.findByIdAndUpdate(req.params.categoryId, {
                 $set: req.body
            }, {new: true, runValidators: true});

        //find posts with this category name and update
        
        await Post.updateMany({categories: findCategory.catName}, {categories: updatedCategory.catName})
            return res.status(200).json('Category updated')
      
    }catch(err){
        console.log(err)
        return res.status(500).json('something went wrong')
    }
};


//get single category

const getSingleCategory = async (req, res)=>{
    try{
        const getSingleCategory = await Category.findById(req.params.categoryId).populate('postCategories');
        if(!getSingleCategory){
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