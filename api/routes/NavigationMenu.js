const express = require('express');
const router = express.Router();
const {verify} = require('../middleware/tokenVerify');


const {createNavigationMenu, getSingleNavigationMenu, getAllNavigationMenu} = require('../controller/NavigationMenu');

router.post('/', verify, createNavigationMenu);
router.get('/:menuId',  getSingleNavigationMenu);
router.get('/',  getAllNavigationMenu)





module.exports = router;