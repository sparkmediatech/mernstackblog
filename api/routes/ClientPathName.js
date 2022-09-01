const express = require('express');
const router = express.Router();
const {verify} = require('../middleware/tokenVerify');


const {createClientPathName, getAllClientPathName, getSinglePathName, deleteSinglePathName, updateClientPathName} = require('../controller/ClientPathName');

router.post('/', verify, createClientPathName);
router.get('/', getAllClientPathName);
router.get('/:pathNameId', getSinglePathName);
router.delete('/:pathNameId', verify, deleteSinglePathName );
router.patch('/:pathNameId', verify, updateClientPathName);





module.exports = router;