const express = require('express');
const router = express.Router();
const {verify} = require('../middleware/tokenVerify');


const {createNewComment, getSingleComment, updateComment, deleteComment} = require('../controller/comments');

router.post("/posts/:id/comment", verify, createNewComment);
router.get("/posts/:id/comment/:id",  getSingleComment);
router.patch("/posts/:id/comment/:commentId", verify, updateComment);
router.delete("/posts/:id/comment/:commentId", verify, deleteComment)



module.exports = router;

