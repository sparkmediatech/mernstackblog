const express = require('express');
const router = express.Router();


const  {Emailverify, resendVerificationLink, resetPassword, verifyPasswordResetLink, changePassword,pass} = require('../middleware/VerifyEmailJWT');
const {verifyPasswordResetToken} = require('../middleware/tokenVerify')



router.post('/confirm/:tokenId', Emailverify);
router.post('/resendlink', resendVerificationLink);//resends email verification link route
router.post('/resetPassword', resetPassword);//reset password to get password reset link route
//router.post('/reset/:passwordId', verifyPasswordResetLink)//verify the link for password reset route
router.patch('/updatepassword/:passwordId',verifyPasswordResetLink, changePassword);


module.exports = router;