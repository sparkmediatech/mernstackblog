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

    const url = `${process.env.API_URL}/confirm/${user._id}/${emailToken}`

    //console.log(emailToken)
    transport.sendMail({
    from: 'kingzanimation19@gmail.com',
    to: `${user.username} <${user.email}>`,
    subject: 'Account verication',
    html:  `<div style=" margin: 0 auto;  width: 30%; height:auto; border-radius: 5px; padding: 10px; padding-bottom:20px; background: #FBFCFC;"> <h4 style="text-align: center; font-family:Lato; font-size:12px;">Hello ${user?.username}, 
    confirm your Email by clicking the button below or click on the link below if you can't see the button</h4> <br>  <button style="cursor: pointer; background: #FF661F; padding-left: 25px; padding-right:25px; padding-top:10px; padding-bottom:10px; 
    border:none; border-radius:3px; display: block; margin: 0 auto; color:#F8F9F9; "><a href=${url} style="text-decoration:none; color:#F8F9F9;">VERIFY </a></button> <br>  <a href=${url}> ${url}</a></div>`
}).then(() =>{
    return emailToken 
}).catch((err)=>{
   return
    
})

return emailToken
};


//to send email verification link to email subscriber user
const subscribeEmailConfirmation = async (user, res) => {
    const emailToken = jwt.sign({userId: user._id, username: user.username}, process.env.EMAIL_JWT_SECRET,  {
            expiresIn: process.env.EMAIL_JWT_DURATION})

    const url = `${process.env.API_URL}/subverify/${user._id}/${emailToken}`

    //console.log(emailToken)
    transport.sendMail({
    from: 'kingzanimation19@gmail.com',
    to: `${user.subscriberName} <${user.subscriberEmail}>`,
    subject: 'Account verication',
    html:  `<div style=" margin: 0 auto;  width: 30%; height:auto; border-radius: 5px; padding: 10px; padding-bottom:20px; background: #FBFCFC;"> <h4 style="text-align: center; font-family:Lato; font-size:12px;">Hello ${user?.subscriberName}, 
    confirm your Email by clicking the button below or click on the link if you can't see the button</h4> <br>  <button style="cursor: pointer; background: #FF661F; padding-left: 25px; padding-right:25px; padding-top:10px; padding-bottom:10px; 
    border:none; border-radius:3px; display: block; margin: 0 auto; color:#F8F9F9; "><a href=${url} style="text-decoration:none; color:#F8F9F9;">VERIFY </a></button> <br>  <a href=${url}> ${url}</a></div> <br> 
   `
   
}).then(() =>{
    console.log("Emails was sent")
    return emailToken
}).catch((err)=>{
    console.log(err)
    return res.status(500).json(("Email was not sent, please try and resend by clicking the resend button"))
})


};

//to send email to subscribers
const sendEmailSubscriber = async (subscriberemail, res, emailSubject, emailBody, sentEmailId) => {
  
    const sendEmail = transport.sendMail({
    from: 'kingzanimation19@gmail.com',
    to: [subscriberemail],
    subject: `${emailSubject}`,
    html:  `<div style="  width: 50%; height:auto; border-radius: 5px; padding: 10px; padding-bottom:20px; background: #FBFCFC;"> <p style=" font-family:Lato; font-size:12px;">${emailBody}</p> </div>`
}).then(async() =>{
    //update email and change the delivery status
    await EmailBody.findByIdAndUpdate({_id: sentEmailId}, {
        deliveryStatus:"delivered",
        deliveryDate: null
    })
    return res.status(200).json('email sent')
}).catch((err)=>{
   
    return res.status(500).json(("Email was not sent, please try and resend by clicking the resend button"))
})

return sendEmail
};

//function to generate password reset link to user's email using jwt
const resetPasswordLink = async (user) =>{
    const passwordToken = jwt.sign({userId: user._id, username: user.username}, process.env.PASSWORD_RESET_SECRET,  {
            expiresIn: process.env.PASSWORD_JWT_DURATION}); 

    const url = `${process.env.API_URL}/updatepassword/${passwordToken}/${user._id}`

    transport.sendMail({
    from: 'kingzanimation19@gmail.com',
    to: `${user.username} <${user.email}>`,
    subject: 'Reset Password',
    html:  `<div style=" margin: 0 auto;  width: 30%; height:auto; border-radius: 5px; padding: 10px; padding-bottom:20px; background: #FBFCFC;"> <h4 style="text-align: center; font-family:Lato; font-size:12px;">Hello ${user?.username}, 
    click the button below to begin the process of reseting your password or click the link if you can't see the button</h4> <br>  <button style="cursor: pointer; background: #FF661F; padding-left: 25px; padding-right:25px; padding-top:10px; padding-bottom:10px; 
    border:none; border-radius:3px; display: block; margin: 0 auto; color:#F8F9F9; "><a href=${url} style="text-decoration:none; color:#F8F9F9;">RESET PASSWORD</a></button><br>  <a href=${url}> ${url}</a></div>`

}).then(() =>{
    
    console.log('email sent')
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