const express = require('express');
const router = express.Router();
const {verify} = require('../middleware/tokenVerify');

const {createNewPost, updatePost, deletePost, deletAllUsersPost, handleDeleteSelectedPosts, getPost, getAllPosts,getPostCategory_1, likePost, getRandomPostS, uploadImage,  handleImageDelete,
 getPostSearchResults,} = require('../controller/posts');
const {upload} = require('../middleware/multer');



router.post('/', verify, upload.single("file"), createNewPost, );
router.patch('/:id', verify, upload.single("file"), updatePost);
router.patch('/:id/like', verify, likePost);
router.delete('/:id', verify, deletePost);
router.post('/deleteall', verify, deletAllUsersPost);
router.post('/deleteSelected', verify, handleDeleteSelectedPosts)
router.get('/:id', getPost);
router.get('/', getAllPosts);
router.post('/searches',  getPostSearchResults,)
router.post('/page-0', getPostCategory_1);
router.post('/randomPosts', getRandomPostS);
router.post('/uploadimage', verify, upload.single("file"), uploadImage);
router.post('/:id/deleteImage', verify,  handleImageDelete)













module.exports = router;
