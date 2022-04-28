const express = require('express');
const router = express.Router();
const {verify} = require('../middleware/tokenVerify');
const {createNewHeaderValues, getSingleHeaderValue, editHeaderValue, getAllHeaderValues} = require('../controller/headervalue')


router.post("/", verify, createNewHeaderValues);
router.get("/:id", verify, getSingleHeaderValue);
router.patch("/:id", verify, editHeaderValue);
router.get("/", getAllHeaderValues);





module.exports = router;