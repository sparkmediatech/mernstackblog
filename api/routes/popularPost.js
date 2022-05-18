const express = require('express');
const router = express.Router();


const {getPopularPosts}  = require('../controller/popularpost');



router.get('/', getPopularPosts);



module.exports = router;