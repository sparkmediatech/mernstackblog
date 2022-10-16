const cron = require('node-cron');
const User = require('../models/User');
const Subscribers = require('../models/Subscribers');
const EmailBody = require('../models/EmailBody');
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const customParseFormat = require('dayjs/plugin/customParseFormat');
const dayJsUTC = dayjs.extend(utc)
const {subscribeEmailConfirmation, sendEmailSubscriber} = require('../services/Emailservice');
//const dayJsDate = dayJsUTC.extend(customParseFormat)



const autoUpdateDatabase = async () =>{
    cron.schedule('0 0 */1 * * *', async ()=>{
         
        userToUpate = await User.find({isBlocked: true});  
            try{
                 userToUpate.map(async (single)  =>{
                         await User.updateMany({_id: single._id}, { $currentDate: {currentDate: true}}, {new: true});
                         console.log('Current date updated')
                    
                    if(single.expDate <= single.currentDate && single.isBlocked === true){
                        await User.updateMany({_id: single._id}, {
                            isBlocked: false,
                            expDate: null
                        }, {new: true});
                        return console.log('Update carried out');
                    }
                    
                });
            
            }catch(err){
                console.log(err);
            };
        return console.log('Nothing to update');
    });
   
};

const autoUpdateEmailSubscribers = async (req, res) =>{

    const todayDate = dayjs().format()
    const utcDate = dayJsUTC(todayDate).format()
    
    console.log(utcDate, 'check me')
    cron.schedule('0 10 * * *', async ()=>{
        const emails = await EmailBody.find({deliveryMode: 'later'})
        console.log(emails.length)
        if(emails.length > 0){
             
            
             let dataEmail = await Promise.all(emails.map(async(singleEmail)=>{
                const getUTCModelDate = dayJsUTC(singleEmail.deliveryDate).format();
                if(utcDate > getUTCModelDate && singleEmail.deliveryStatus == 'pending' && deliveryDate !== null){
                     return await sendEmailSubscriber(singleEmail.emailReciever, res, singleEmail.emailTitle, singleEmail.emailBody, singleEmail._id);
                }
               
             }))
           
        }
    })
}


autoUpdateDatabase();
autoUpdateEmailSubscribers();


module.exports = autoUpdateDatabase

