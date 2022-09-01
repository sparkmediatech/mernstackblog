const express = require('express');
const router = express.Router();
const {verify} = require('../middleware/tokenVerify')

const {updateUser, deleteUser, getSingleUser, getAllUsers, handleBlocking, handleUnblock, singleUser, singleUserOwner, deleteSingleUser, deleteSelectedUsers,  handleDeleteAllUsers,} = require('../controller/users');
const {upload} = require('../middleware/multer');


router.patch("/:id", verify,  upload.single("file"), updateUser);
router.delete("/:id", verify, deleteUser);
router.get("/:id", verify, getSingleUser);
router.patch("/:userId/block", verify, handleBlocking);
router.patch("/:userId/unblock", verify, handleUnblock);
router.post("/allusers", verify, getAllUsers);
router.get('/singleUser/:singleUserId', singleUser);
router.get('/userOwner/:userOwnerId', singleUserOwner);
router.delete('/deleteUser/:delId', verify, deleteSingleUser);
router.post('/deleteSelected', verify, deleteSelectedUsers);
router.post('/deletallusers', verify,  handleDeleteAllUsers,)




module.exports = router;