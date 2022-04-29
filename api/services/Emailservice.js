const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid');
const jwt = require('jsonwebtoken');



const transport = nodemailer.createTransport(
    sendgridTransport({
    apiKey:process.env.EMAIL_KEY
})

);


//to send email verification link to user using jwt token as the source token
const sendConfirmationEmail = async (user, res) => {
    const emailToken = jwt.sign({userId: user._id, username: user.username}, process.env.EMAIL_JWT_SECRET,  {
            expiresIn: process.env.EMAIL_JWT_DURATION})

    const url = `http://localhost:5000/confirm/${emailToken}`

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


module.exports = {
     sendConfirmationEmail,
     resetPasswordLink,
}