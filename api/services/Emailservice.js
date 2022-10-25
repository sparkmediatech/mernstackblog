const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid');
const jwt = require('jsonwebtoken');
const EmailBody = require('../models/EmailBody');
const ejs = require("ejs");
const fs = require("fs");



const transport = nodemailer.createTransport(
    sendgridTransport({
    apiKey:process.env.EMAIL_KEY
})

);


//to send email verification link to user using jwt token as the source token
const sendConfirmationEmail = async (user, res) => {
    const emailToken = jwt.sign({userId: user._id, username: user.username}, process.env.EMAIL_JWT_SECRET,  {
            expiresIn: process.env.EMAIL_JWT_DURATION})

    const url = `http://localhost:3000/confirm/${user._id}/${emailToken}`

    //console.log(emailToken)
    transport.sendMail({
    from: 'kingzanimation19@gmail.com',
    to: `${user.username} <${user.email}>`,
    subject: 'Account verication',
    html: `Hello ${user.username}, please, confirm your Email by clicking this link <a href=${url}> ${url}</a>`
}).then(() =>{
    console.log("Emails was sent")
}).catch((err)=>{
    console.log(err)
    return res.status(500).json(("Email was not sent, please try and resend by clicking the resend button"))
})

return emailToken
};


//to send email verification link to email subscriber user
const subscribeEmailConfirmation = async (user, res) => {
    const emailToken = jwt.sign({userId: user._id, username: user.username}, process.env.EMAIL_JWT_SECRET,  {
            expiresIn: process.env.EMAIL_JWT_DURATION})

    const url = `http://localhost:3000/subverify/${user._id}/${emailToken}`

    //console.log(emailToken)
    transport.sendMail({
    from: 'kingzanimation19@gmail.com',
    to: `${user.subscriberName} <${user.subscriberEmail}>`,
    subject: 'Account verication',
    html: `Hello ${user.subscriberName}, please, confirm your Email by clicking this link <a href=${url}> ${url}</a>`
}).then(() =>{
    console.log("Emails was sent")
}).catch((err)=>{
    console.log(err)
    return res.status(500).json(("Email was not sent, please try and resend by clicking the resend button"))
})

return emailToken
};

//to send email to subscribers
const sendEmailSubscriber = async (subscriberemail, res, emailSubject, emailBody, sentEmailId) => {
  
    const sendEmail = transport.sendMail({
    from: 'kingzanimation19@gmail.com',
    to: [subscriberemail],
    subject: `${emailSubject}`,
    html: `<p> ${emailBody} </p>`
}).then(async() =>{
    //update email and change the delivery status
    await EmailBody.findByIdAndUpdate({_id: sentEmailId}, {
        deliveryStatus:"delivered",
        deliveryDate: null
    })
    return res.status(200).json('email sent')
}).catch((err)=>{
    console.log(err.response.body)
    return res.status(500).json(("Email was not sent, please try and resend by clicking the resend button"))
})

return sendEmail
};

//function to generate password reset link to user's email using jwt
const resetPasswordLink = async (user) =>{
    const passwordToken = jwt.sign({userId: user._id, username: user.username}, process.env.PASSWORD_RESET_SECRET,  {
            expiresIn: process.env.PASSWORD_JWT_DURATION}); 

    const url = `http://localhost:5000/updatepassword/${passwordToken}`

    //console.log(emailToken)
    transport.sendMail({
    from: 'kingzanimation19@gmail.com',
    to: `${user.username} <${user.email}>`,
    subject: 'Reset Password',
    html: `Hello ${user.username}, please reset your password by clicking this link <a href=${url}> ${url}</a>`
}).then(() =>{
    console.log("Emails was sent")
}).catch((err)=>{
    console.log(err)
    console.log("Email was not sent, please try and resend by clicking the resend button")
})

return passwordToken;
};


//send email to admin by users



const contactus = async (username, emailSubject, emailBody, userEmail, res)=>{
    ejs.renderFile(__dirname + "/CustomHTML.ejs", {username: username, emailSubject: emailSubject, emailBody: emailBody, userEmail: userEmail}, function (err, data){
        if(err){
            return err
        }

        const contactAdmin = transport.sendMail({
            from: 'kingzanimation19@gmail.com',
            to: 'kingzanimation19@gmail.com',
            subject: `${emailSubject}`,
            html: data

}).then(async() =>{
   
    return res.status(200).json('email sent')
}).catch((err)=>{
    
    return res.status(500).json(("Email was not sent, please try and resend by clicking the resend button"))
})

return contactAdmin
    }
    )
    
}

module.exports = {
     sendConfirmationEmail,
     resetPasswordLink,
     subscribeEmailConfirmation,
     sendEmailSubscriber,
     contactus
}