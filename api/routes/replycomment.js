const express = require('express');
const router = express.Router();
const {verify} = require('../middleware/tokenVerify')
const {createNewCommentReply, getSingleReplyComment, updateReplyComment, deleteReplyComment} = require('../controller/replycomment');


router.post("/posts/:id/comments/:commentId/reply",verify, createNewCommentReply);
router.get("/:replyId", getSingleReplyComment);
router.patch("/:replyId", verify, updateReplyComment);
router.delete("/posts/:id/comments/:commentId/reply/:replyId", verify, deleteReplyComment)



module.exports = router;