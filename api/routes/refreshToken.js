const refreshTokenverify = require('../middleware/refreshTokenVerify');


const express = require('express');
const router = express.Router();

router.post('/refresh', refreshTokenverify);

module.exports = router



