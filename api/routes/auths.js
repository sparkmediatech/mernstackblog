const express = require('express');
const router = express.Router();

const {register, login, admin, logOut,} = require('../controller/auth');
const {verify} = require('../middleware/tokenVerify')



router.post('/register', register);
router.post('/login', login);
router.post('/admin', admin);
router.post('/logout', verify, logOut);





module.exports = router;