const express = require('express');
const router = express.Router();


const  {Emailverify, resendVerificationLink, resetPassword, verifyPasswordResetLink, changePassword, verifySubscriberEmail, resendSubscriberEmailVerification} = require('../middleware/VerifyEmailJWT');
const {verifyPasswordResetToken} = require('../middleware/tokenVerify')



router.get('/confirm/:userId/:tokenId', Emailverify);
router.post('/resendlink', resendVerificationLink);//resends email verification link route
router.post('/resetPassword', resetPassword);//reset password to get password reset link route
//router.post('/reset/:passwordId', verifyPasswordResetLink)//verify the link for password reset route
router.patch('/updatepassword/:passwordId',verifyPasswordResetLink, changePassword);//update password
router.get('/emailconfirm/:emailuserId/:emailtokenId', verifySubscriberEmail);
router.get('/resendConfirm/:userId', resendSubscriberEmailVerification)


module.exports = router;