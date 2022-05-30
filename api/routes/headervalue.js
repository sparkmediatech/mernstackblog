const express = require('express');
const router = express.Router();
const {verify} = require('../middleware/tokenVerify');
const {createNewHeaderValues, getSingleHeaderValue, editHeaderValue, getAllHeaderValues} = require('../controller/headervalue');
const {upload} = require('../middleware/multer');



router.post("/", verify, upload.single("file"), createNewHeaderValues);
router.get("/:id", verify, getSingleHeaderValue);
router.patch("/:id", verify, upload.single("file"), editHeaderValue);
router.get("/", getAllHeaderValues);





module.exports = router;