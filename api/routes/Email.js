const express = require('express');
const router = express.Router();

const { subscribeEmail, handleSendEmailSubscribers, getAllSubscribers,  handleGetSingleSubscriber, handleDeleteSingleSubscriber, getDeliveredEmails, deleteSingleDeliveredEmail,
getAllPendingEmails, updatePendingEmail, deleteSceduledEmail, resendSubcriberEmailVerification, contactAdminEmail} = require('../controller/Emails');
const {verify} = require('../middleware/tokenVerify')



router.post('/subscribe', subscribeEmail);
router.post('/sendEmail', verify, handleSendEmailSubscribers);
router.get('/subscribers', verify, getAllSubscribers);
router.get('/singleSub/:subscriberId', verify,  handleGetSingleSubscriber);
router.delete('/deleteSub/:subscriberId', verify, handleDeleteSingleSubscriber);
router.get('/deliveredEmail', verify, getDeliveredEmails);
router.delete('/deleteDelivered/:emailId', verify, deleteSingleDeliveredEmail);
router.get('/pendingEmails', verify, getAllPendingEmails);
router.patch('/updateEmail/:emailId', verify, updatePendingEmail);
router.delete('/deleteScheduleEmail/:emailId', verify, deleteSceduledEmail);
router.post('/resendSubVerifcation', verify, resendSubcriberEmailVerification);
router.post('/contactus', contactAdminEmail)





module.exports = router;