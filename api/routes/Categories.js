const express = require('express');
const router = express.Router();
const {verify} = require('../middleware/tokenVerify');

const {createCategory, deleteCategory, updateCategory, getSingleCategory, getAllCategories} = require('../controller/Categories');


router.post('/', verify, createCategory);
router.delete('/:categoryId', verify, deleteCategory);
router.patch('/:categoryId', verify, updateCategory);
router.get('/:categoryId', getSingleCategory)
router.get('/', getAllCategories)





module.exports = router;




