const express = require('express');
const router = express.Router();
const {verify} = require('../middleware/tokenVerify');
const {createClientComponent, getAllClientComponent,} = require('../controller/ClientSideComponent');



router.post('/', verify, createClientComponent);
router.get('/', getAllClientComponent)




module.exports = router;