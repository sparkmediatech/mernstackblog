const express = require('express');
const router = express.Router();
const {verify} = require('../middleware/tokenVerify');

const {createNewPost, updatePost, deletePost, getPost, getAllPosts,} = require('../controller/posts');



router.post('/', verify, createNewPost);
router.patch('/:id', verify, updatePost);
router.delete('/:id', verify, deletePost);
router.get('/:id', getPost);
router.get('/', getAllPosts);










module.exports = router;
