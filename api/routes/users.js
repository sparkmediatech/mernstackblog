const express = require('express');
const router = express.Router();
const {verify} = require('../middleware/tokenVerify')

const {updateUser, deleteUser, getSingleUser, getAllUsers, handleBlocking, handleUnblock} = require('../controller/users');


router.patch("/:id", verify, updateUser);
router.delete("/:id", verify, deleteUser);
router.get("/:id", verify, getSingleUser);
router.patch("/:userId/block", verify, handleBlocking);
router.patch("/:userId/unblock", verify, handleUnblock);
router.post("/allusers", verify, getAllUsers)




module.exports = router;