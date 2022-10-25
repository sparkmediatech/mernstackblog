const User = require("../models/User"); //the user model imported to be used
const Subscribers = require("../models/Subscribers");
const Headervalues = require("../models/headervalues");
const EmailBody = require("../models/EmailBody")
const {subscribeEmailConfirmation, sendEmailSubscriber, contactus} = require('../services/Emailservice');
const { getSubscribersPagination} = require('../services/query');
const { findById } = require("../models/User");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const customParseFormat = require('dayjs/plugin/customParseFormat');
const dayJsUTC = dayjs.extend(utc)
const dayJsDate = dayJsUTC.extend(customParseFormat)








//user subcribe to email services
const subscribeEmail = async (req, res)=>{
   
    try{
        const subscriberName = req.body.subscriberName;
        const subscriberEmail = req.body.subscriberEmail;

   if(!subscribeEmail){
    return res.status(404).json('subscriber email must not be empty')
   }

   
   if(!subscriberName){
    return res.status(404).json('subscriber name must not be empty')
   }

   const checkNameDuplicate = await Subscribers.exists({subscriberName: subscriberName});
   if(checkNameDuplicate){
    return res.status(500).json('subcriber name already exist')
   }
   const checkEmailDuplicate = await Subscribers.exists({subscriberEmail: subscriberEmail});
   if(checkEmailDuplicate){
    return res.status(500).json('subcriber email already exist')
   }
    if(!isNaN(subscriberEmail)){
    return res.status(500).json('subscriber email should not be a number')
    }

    if(!isNaN(subscriberName)){
    return res.status(500).json('subscriber name should not be a number')
    }
    
    if(/\s/.test(subscriberName)){
                return res.status(500).json('subscriberName must not contain empty space')
    }

    if(/\s/.test(subscriberEmail)){
                return res.status(500).json('subscriber email must not contain empty space')
    }

   const newSubsciber = new Subscribers({
        subscriberName: subscriberName,
        subscriberEmail: subscriberEmail
   })

    const savedSubscriber = await newSubsciber.save()

    const emailToken = await subscribeEmailConfirmation(savedSubscriber, res);

    return res.status(200).json({Id:savedSubscriber._id, emailToken})
    }catch(err){
        console.log(err)
        return res.status(500).json('something went wrong')
    }
}

//get all subscribers

const getAllSubscribers = async (req, res) =>{
    console.log('I am admin')
     const {skip, limit} = getSubscribersPagination(req.query);
   
    try{
        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(404).json('no user found')
        }
        if(user.role !== 'admin'){
            return res.status(401).json('you are not permitted')
        }
        const subscribers = await Subscribers.find({}, {createdAt: 0, __v: 0, updatedAt: 0}).sort({createdAt:-1})
           .skip(skip)
           .limit(limit);
        
        if(!subscribers){
            return res.status(404).json('subscribers not found')
        }
        return res.status(200).json(subscribers)
    }catch(err){
         return res.status(500).json('something went wrong')
    }
}

//get single subcriber
const handleGetSingleSubscriber = async (req, res) =>{
    try{
        const adminUser = await User.findById(req.user.userId);
        if(!adminUser){
            return res.status(404).json('no user found')
        }
        if(adminUser.role !== 'admin'){
            return res.status(401).json('you are not permitted ')
        }
        const getSingleSubscriber = await Subscribers.findById(req.params.subscriberId);
        if(!getSingleSubscriber){
            return res.status(404).json('no subscriber found')
        }

        const response = {
            _id: getSingleSubscriber._id,
            isVerified: getSingleSubscriber.isVerified,
            subscriberName: getSingleSubscriber.subscriberName,
            subscriberEmail: getSingleSubscriber.subscriberEmail
        }

        return res.status(200).json(response)
    }catch(err){
         return res.status(500).json('something went wrong')
    }   
}

//delete sub

const handleDeleteSingleSubscriber = async (req, res)=>{
    try{
        const adminUser = await User.findById(req.user.userId);
            if(!adminUser){
                return res.status(404).json('no user found')
        }
            if(adminUser.role !== 'admin'){
                return res.status(401).json('you are not permitted ')
        } 
        const getSingleSubscriber = await Subscribers.findById(req.params.subscriberId);
            if(!getSingleSubscriber){
                return res.status(404).json('no subscriber found')
        }

        await Subscribers.findByIdAndDelete(req.params.subscriberId);
        return res.status(200).json('subscriber deleted')
    }catch(err){
        return res.status(500).json('something went wrong')
    }
}
//send email by admin
const handleSendEmailSubscribers = async (req, res) =>{
    try{
         //const utcDate = dayjs().extend(utc)
        const adminUser = await User.findById(req.user.userId);
        if(!adminUser){
            return res.status(404).json('no user found')
        }
        if(adminUser.role !== 'admin'){
            return res.status(401).json('you are not permitted')
        }

      
        
        const deliveryMode = req.body.deliveryMode;
        const emailTitle = req.body.emailTitle;
        const emailBody = req.body.emailBody;
        const deliveryDate = req.body.deliveryDate;
        const emailReciever = req.body.emailReciever;
        
        
        
     
        if(deliveryDate){
            console.log(deliveryDate)
            console.log(dayjs(deliveryDate).isValid())
            if(!dayJsDate(deliveryDate, "YYYY-MM-DD", true).isValid()){
                return res.status(500).json('invalid date')
            }
        }
        if(!emailBody){
             return res.status(500).json('email body must be provided')
        }
        if(emailReciever.length < 1){
            return res.status(500).json('email reciever must be provided')
        }
        if(!emailTitle){
            return res.status(500).json('email subject must be provided')
        }

         if(!isNaN(emailTitle)){
                return res.status(500).json('Email subject should not be all numbers')
            }

         if(!isNaN(emailBody)){
                return res.status(500).json('Email body should not be all numbers')
            }
       
      
        
        const newEmail = new EmailBody({
            emailTitle: emailTitle,
            emailBody: emailBody,
            deliveryMode: deliveryMode,
            deliveryDate: deliveryDate,
            emailReciever: emailReciever,
        })
        const savedEmail = await newEmail.save();

        const emailSubject = savedEmail.emailTitle;
        const emailMessage = savedEmail.emailBody;
        const recievers = savedEmail.emailReciever


    if(savedEmail.deliveryMode === 'instant' && savedEmail.deliveryStatus == 'pending'){
       //find the receiver via id and check filter out those yet to be verified
       const getRecievers = await Subscribers.find({subscriberEmail: recievers})
       if(getRecievers.length < 1){
        return res.status(500).json('no reciever found')
       }

       const filteredReciever = getRecievers.filter((singleSub)=> singleSub.isVerified == true)
      console.log(filteredReciever)
       if(filteredReciever.length < 1){
        return res.status(500).json('email reciever must be verified')
       }

      const recieverEmail = filteredReciever.map((singleSub) => singleSub.subscriberEmail)
      
     
      
             
           return await sendEmailSubscriber(recieverEmail, res, emailSubject, emailMessage, savedEmail._id);  
        }
        
        if(!deliveryDate){
            return res.status(500).json('date must be provided for deliver mode of later')
        }

        
        
        return res.status(200).json(savedEmail)

    }catch(err){
        console.log(err)
        return res.status(500).json('something went wrong')
    }
}


//get delivered email

const getDeliveredEmails = async(req, res)=>{
     const {skip, limit} = getSubscribersPagination(req.query);
    try{

        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(404).json('no user found')
        }
        if(user.role !== 'admin'){
            return res.status(401).json('you are not permitted')
        }

        let deliveredEmail = await EmailBody.find({deliveryStatus: 'delivered'}, { __v: 0, updatedAt: 0}).sort({createdAt:-1}).skip(skip)
           .limit(limit);

        if(!deliveredEmail){
            return res.status(404).json('no email found')
        }

        return res.status(200).json(deliveredEmail)
    }catch(err){
       return res.status(500).json('something went wrong')
    }
}


//delete single delivered email

const deleteSingleDeliveredEmail = async(req, res)=>{
    try{
            const user = await User.findById(req.user.userId);
                if(!user){
                    return res.status(404).json('no user found')
                }
                if(user.role !== 'admin'){
                    return res.status(401).json('you are not permitted')
                }
            const email = await EmailBody.findById(req.params.emailId);
                if(!email){
                    return res.status(404).json('email not found')
                }
            await EmailBody.findByIdAndDelete({_id: req.params.emailId})
            return res.status(200).json('deleted')
    }catch(err){
       return res.status(500).json('something went wrong') 
    }
}

//get pending emails

const getAllPendingEmails = async(req, res)=>{
    const {skip, limit} = getSubscribersPagination(req.query);
    try{
       const user = await User.findById(req.user.userId);
            if(!user){
                    return res.status(404).json('no user found')
            }
            if(user.role !== 'admin'){
                    return res.status(401).json('you are not permitted')
            } 
        let pendingEmail = await EmailBody.find({deliveryStatus: 'pending'}, { __v: 0, updatedAt: 0}).sort({createdAt:-1}).skip(skip)
           .limit(limit);

            if(!pendingEmail){
            return res.status(404).json('no email found')
            }

        return res.status(200).json(pendingEmail)
    }catch(err){
       
         return res.status(500).json('something went wrong') 
    }
}

//update pending email

const updatePendingEmail = async(req, res)=>{
    
    try{
       const user = await User.findById(req.user.userId);
            if(!user){
                    return res.status(404).json('no user found')
            }
            if(user.role !== 'admin'){
                    return res.status(401).json('you are not permitted')
            }
        const deliveryMode = req.body.deliveryMode;
        const emailTitle = req.body.emailTitle;
        const emailBody = req.body.emailBody;
        const deliveryDate = req.body.deliveryDate;
        const emailReciever = req.body.emailReciever;
        
     
        if(deliveryDate){
            
            
            if(!dayJsDate(deliveryDate, "YYYY-MM-DD", true).isValid()){
                return res.status(500).json('invalid date')
            }
        }
        if(!emailBody){
             return res.status(500).json('email body must be provided')``
        }
        if(emailReciever.length < 1){
            return res.status(500).json('email reciever must be provided')
        }
        if(!emailTitle){
            return res.status(500).json('email subject must be provided')
        }

         if(!isNaN(emailTitle)){
                return res.status(500).json('Email subject should not be all numbers')
            }

         if(!isNaN(emailBody)){
                return res.status(500).json('Email body should not be all numbers')
            }
       
        const email = await EmailBody.findById(req.params.emailId);
        if(!email){
            return res.status(404).json('email not found')
        } 

    const updatedEmail = await EmailBody.findByIdAndUpdate(req.params.emailId, {
            emailTitle: emailTitle,
            emailBody: emailBody,
            deliveryMode: deliveryMode,
            deliveryDate: deliveryDate,
            emailReciever: emailReciever,
    }, {new: true, runValidators: true})

    const emailSubject = updatedEmail.emailTitle;
    const emailMessage = updatedEmail.emailBody;
    const recievers = updatedEmail.emailReciever

if(updatedEmail.deliveryMode === 'instant' && updatedEmail.deliveryStatus == 'pending'){
       //find the receiver via id and check filter out those yet to be verified
       const getRecievers = await Subscribers.find({subscriberEmail: recievers})
       if(getRecievers.length < 1){
        return res.status(500).json('no reciever found')
       }

       const filteredReciever = getRecievers.filter((singleSub)=> singleSub.isVerified == true)
      console.log(filteredReciever)
       if(filteredReciever.length < 1){
        return res.status(500).json('email reciever must be verified')
       }

      const recieverEmail = filteredReciever.map((singleSub) => singleSub.subscriberEmail)
             
           return await sendEmailSubscriber(recieverEmail, res, emailSubject, emailMessage, updatedEmail._id);  
        }
        
        if(!deliveryDate){
            return res.status(500).json('date must be provided for deliver mode of later')
        }

        
        
        return res.status(200).json(updatedEmail)


    }catch(err){
        console.log(err)
        return res.status(500).json('something went wrong')  
    }
}


//handle delete scheduled email

const deleteSceduledEmail = async(req, res)=>{
    try{
        const user = await User.findById(req.user.userId);
            if(!user){
                    return res.status(404).json('no user found')
            }
            if(user.role !== 'admin'){
                    return res.status(401).json('you are not permitted')
            }
        const email = await EmailBody.findById(req.params.emailId);
        if(!email){
            return res.status(404).json('no email found')
        }
        await EmailBody.findByIdAndDelete(req.params.emailId);

        return res.status(200).json('deleted')
    }catch(err){
       return res.status(500).json('something went wrong')  
    }
}

//resend reminder email for subscribers yet to verify their email
const resendSubcriberEmailVerification = async(req, res)=>{
    try{
         const user = await User.findById(req.user.userId);
            if(!user){
                return res.status(404).json('no user found')
            }
            if(user.role !== 'admin'){
                return res.status(401).json('you are not permitted')
            }
        const userId = req.body.subscriberId;
            if(!userId){
                return res.status(404).json('userId must be provided')
            }
        const subscriber = await Subscribers.findById({_id: userId});
            if(!subscriber){
                return res.status(404).json('no subscriber found')
            }

        
         await subscribeEmailConfirmation(subscriber, res);

         return res.status(200).json('email verification sent')
    }catch(err){
         return res.status(500).json('something went wrong')
    }
}



//contact admin
const contactAdminEmail = async(req, res) =>{
    try {
         const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const emailBody = req.body.emailBody;
        const emailSubject = req.body.emailSubject;
        const userName = req.body.userName
        const userEmail = req.body.userEmail;
        console.log(emailBody, emailSubject, userName, userEmail)

        if(!emailBody || !emailSubject || !userName || !userEmail){
            return res.status(500).json('one of the required parameter missing')
        }

        if(!isNaN(emailSubject) || !isNaN(userName) || !isNaN( userEmail) || !isNaN( emailBody)){
            return res.status(500).json('None of the required parameter should be all numbers')
        }

        if(!userEmail.match(validRegex)){
            return res.status(500).json('your email is not valid')
        }

        return await contactus(userName, emailSubject, emailBody, userEmail, res)
    } catch (error) {
        return res.status(500).json('something went wrong')
        
    }
}


module.exports ={
    subscribeEmail,
    handleSendEmailSubscribers,
    getAllSubscribers,
    handleGetSingleSubscriber,
    handleDeleteSingleSubscriber,
    getDeliveredEmails,
    deleteSingleDeliveredEmail,
    getAllPendingEmails,
    updatePendingEmail,
    deleteSceduledEmail,
    resendSubcriberEmailVerification,
    contactAdminEmail,
}