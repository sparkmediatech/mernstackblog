import React, {useEffect, useContext, useState, useRef} from 'react';
import './emailsubscribers.css';
import {AuthContext} from '../../context/AuthProvide';
import  BASE_URL from '../../hooks/Base_URL';
import axiosPrivate from '../../hooks/AxiosPrivate';
import {MdOutlineCancel, MdNavigateNext, MdNavigateBefore} from 'react-icons/md';
import {BsCheckLg} from 'react-icons/bs'
import { useMediaQuery } from '../../hooks/CustomMediaQuery';

function WriteEmail(emailProp) {
  
  const {auth, dispatch,  allSubscribersState, setAllsubscribersState, allSubscribers, pageNumber, setPageNumber,  emailUpdateMode, setEmailUpdateMode, } = useContext(AuthContext);
  const [deliveryModeText, setDeliveryModeText] = useState(emailProp.deliveryMode || 'instant');
  const deliveryModeArray = ['instant', 'later'];
  const [deliveryModeState, setDeliveryModeState] = useState(false);
  const [callSubscribersState, setCallSubscribersState] = useState(false);
  const [selectedSubscriberId, setSelectedSubscriberId] = useState(emailProp.emailReciever || []);
  const [ checkMode, setCheckMode] = useState(false);
  const emailSubject = useRef();
  const emailBody = useRef();
  const [dataDate, setDataDate] = useState(emailProp.deliveryDate || null)
  const [emailDeliveryUpdate, setEmailDeliverUpdate] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  let   mobileScreenMode = useMediaQuery('(max-width: 576px)');

  //error states
  const [noUserFoundError, setNoUserFoundError] = useState(false);
  const [notAuthorizedError, setNotAuthorizedError] = useState(false);
  const [emailBodyEmptyError, setEmailBodyEmptyError] = useState(false);
  const [emailRecieverEmptyError, setEmailRecieverEmptyError] = useState(false);
  const [emailTitleEmptyError, setEmailTitleEmptyError] = useState(false);
  const [emailSubjectNumberError, setEmailSubjectNumberError] = useState(false);
  const [emailBodyNumberError, setEmailBodyNumberError] = useState(false);
  const [emailVerifiedError, setEmailVerifiedError] = useState(false);
  const [dateEmptyError, setDateEmptyError] = useState(false);
  const [somethingWentWrongError, setSomethingWentWrongError] = useState(false);
  const [invalidDateError, setInvalidDateError] = useState(false);
  const [emailNotFoundError, setEmailNotFoundError] = useState(false);

 
 

//send email
const handleSendEmail = async ()=>{
   
  let serverData = {}
    if(dataDate){
        const data = {
        emailReciever: selectedSubscriberId,
        deliveryMode: deliveryModeText,
        emailTitle: emailSubject.current.value,
        emailBody: emailBody.current.value,
        deliveryDate:dataDate
       }
       
       serverData = data
    }
      
     if(!dataDate){
       const data = {
        emailReciever: selectedSubscriberId,
        deliveryMode: deliveryModeText,
        emailTitle: emailSubject.current.value,
        emailBody: emailBody.current.value,
       
       }
       
       serverData = data
     } 
     
        
   try{
        dispatch({type:"CURSOR_NOT_ALLOWED_START"});
         setEmailLoading(true)
            const response = await axiosPrivate.post(`${BASE_URL}/emailsub/sendEmail`, serverData, { withCredentials: true,
              headers:{authorization: `Bearer ${auth}`}
            })
             dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            emailBody.current.value = null
            emailSubject.current.value = null
            setDataDate(null)
            setSelectedSubscriberId([])
            setDeliveryModeText('instant')
            
            setEmailDeliverUpdate(true)
            setEmailUpdateMode(false)
             
      }catch(err){
        dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
         setEmailLoading(false)
         if(err.response.data == 'no user found'){
          return setNoUserFoundError(true)
         }
        if(err.response.data === 'you are not permitted'){
          return setNotAuthorizedError(true)
        }
      if(err.response.data === 'email body must be provided'){
        return setEmailBodyEmptyError(true)
      }
      if(err.response.data === 'email reciever must be provided'){
        return setEmailRecieverEmptyError(true)
      }

      if(err.response.data === 'email subject must be provided'){
        return setEmailTitleEmptyError(true)
      }
      if(err.response.data == 'Email subject should not be all numbers'){
        return setEmailSubjectNumberError(true)
      }

      if(err.response.data === 'Email body should not be all numbers'){
        return setEmailBodyNumberError(true)
      }

      if(err.response.data === 'no reciever found'){
       return setEmailRecieverEmptyError(true)
      }
    if(err.response.data === 'email reciever must be verified'){
      return setEmailVerifiedError(true)
    }

    if(err.response.data === 'date must be provided for deliver mode of later'){
      return setDateEmptyError(true)
    }

    if(err.response.data === 'something went wrong'){
      return setSomethingWentWrongError(true)
    }

    if(err.response.data === 'invalid date'){
      return setInvalidDateError(true)
    }

      }
}

//handle update email

const handleUpdateEmail = async()=>{
  console.log(emailProp.emailId)
   let serverData = {}
    if(dataDate){
        const data = {
        emailReciever: selectedSubscriberId,
        deliveryMode: deliveryModeText,
        emailTitle: emailSubject.current.value,
        emailBody: emailBody.current.value,
        deliveryDate:dataDate
       }
       
       serverData = data
    }
      
     if(!dataDate){
       const data = {
        emailReciever: selectedSubscriberId,
        deliveryMode: deliveryModeText,
        emailTitle: emailSubject.current.value,
        emailBody: emailBody.current.value,
       
       }
       
       serverData = data
     } 
  try{
     dispatch({type:"CURSOR_NOT_ALLOWED_START"});
        setEmailLoading(true)
        const response = await axiosPrivate.patch(`${BASE_URL}/emailsub/updateEmail/${emailProp.emailId}`, serverData, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
            })
        dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
        
        emailBody.current.value = null
        emailSubject.current.value = null
        setSelectedSubscriberId([])
        setDeliveryModeText('instant')
        
        setEmailDeliverUpdate(true)
        setEmailUpdateMode(false);

  }catch(err){
     dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
     setEmailLoading(false)
     if(err.response.data === 'no user found'){
        return setNoUserFoundError(true)
     }

    if(err.response.data === 'you are not permitted'){
      return setNotAuthorizedError(true)
    }

    if(err.response.data === 'invalid date'){
      return setInvalidDateError(true)
    }

    if(err.response.data === 'email body must be provided'){
      return setEmailBodyEmptyError(true)
    }

    if(err.response.data === 'email reciever must be provided'){
      return setEmailRecieverEmptyError(true)
    }

  if(err.response.data === 'email subject must be provided'){
    return setEmailTitleEmptyError(true)
  }

  if(err.response.data === 'Email subject should not be all numbers'){
    return setEmailSubjectNumberError(true)
  }

  if(err.response.data === 'Email body should not be all numbers'){
    return setEmailBodyNumberError(true)
  }
  if(err.response.data === 'email not found'){
    return setEmailNotFoundError(true)
  }

  if(err.response.data === 'no reciever found'){
    return setEmailRecieverEmptyError(true)
  }

  if(err.response.data === 'email reciever must be verified'){
    return setEmailVerifiedError(true)
  }

  if(err.response.data === 'date must be provided for deliver mode of later'){
    return setDateEmptyError(true)
  }

  if(err.response.data === 'something went wrong'){
    return setSomethingWentWrongError(true)
  }
  }

}

  

const isChecked = (subscriberEmail)=>{
  if(!selectedSubscriberId) return false;
  return selectedSubscriberId.includes(subscriberEmail)
}

const handleCheckedClick = (subscriberEmail) =>{
  const indexItem = selectedSubscriberId.indexOf(subscriberEmail);
  if(selectedSubscriberId.includes(subscriberEmail)) {
        selectedSubscriberId.splice(indexItem, 1);
      } else {
        selectedSubscriberId.push(subscriberEmail);
      }

    setSelectedSubscriberId([...selectedSubscriberId])
}

//makes it possible for the delivery mode texts to be visible or not
const handleChangeModeTogggle = ()=>{
    setDeliveryModeState(!deliveryModeState)
}

//this set the deliverymode text
const handleSelectDeliveryText = (selectedText) =>{
    setDeliveryModeText(selectedText)
}
//this calls the Allsubscriber state which is a usecontext that calls the all subscriber useEffect found in the Subscribers components
//this also calls the callsubscribe state to allow for the pop of the container of the list of subscribers
const handleDisplaySubscribers = ()=>{
  //setAllsubscribersState(!allSubscribersState);
  setCallSubscribersState(true);
  setCheckMode(!checkMode)
}

//this turns off the callSubscribers state which stops the display of the subscribers list
const handleCancelDisplaySubscribers = ()=>{
  setCallSubscribersState(false)
   setCheckMode(!checkMode)
}

//handle next page navigation

const handleNextPage = () =>{
    if(allSubscribers.length == 9){
        setAllsubscribersState(!allSubscribersState);
        setPageNumber(Number(pageNumber) + 1)   
    }
    
}

//handle prev page 
const handlePrevPage = () =>{
    if(pageNumber > 1){
         setAllsubscribersState(!allSubscribersState);
        setPageNumber(Number(pageNumber) - 1)
    }
   
}

//handles the notification of the email sent update

useEffect(()=>{
    setTimeout(() => {
      setEmailDeliverUpdate(false)
       setEmailLoading(false)
    }, 3000);

    setTimeout(() => {
      setNoUserFoundError(false)
    }, 3000);

    setTimeout(() => {
      setNotAuthorizedError(false)
    }, 3000);

    setTimeout(() => {
      setEmailBodyEmptyError(false)
    }, 3000);

    setTimeout(() => {
      setEmailRecieverEmptyError(false)
    }, 3000);

    setTimeout(() => {
      setEmailTitleEmptyError(false)
    }, 3000);

    setTimeout(() => {
      setEmailSubjectNumberError(false)
    }, 3000);

    setTimeout(() => {
      setEmailBodyNumberError(false)
    }, 3000);

    setTimeout(() => {
      setEmailVerifiedError(false)
    }, 3000);

    setTimeout(() => {
      setDateEmptyError(false)
    }, 3000);

    setTimeout(() => {
      setSomethingWentWrongError(false)
    }, 3000);

    setTimeout(() => {
      setInvalidDateError(false)
    }, 3000);

    setTimeout(() => {
      setEmailNotFoundError(false)
    }, 3000);

}, [emailDeliveryUpdate, noUserFoundError, notAuthorizedError, emailBodyEmptyError, emailRecieverEmptyError, emailTitleEmptyError, emailSubjectNumberError,

emailBodyNumberError, emailVerifiedError, dateEmptyError, somethingWentWrongError, invalidDateError, emailNotFoundError])


console.log(emailUpdateMode)



  return (
    <>
      {
        /* the call subscribersState is a state that manages the listing of subscribers. When set to true, it shows the subscribers and the option to select the users u would want to send the email to   
        It is controled by the reciever button and done button. The reciver button toggles it to true while the done button toggles it to false
        */
        callSubscribersState && 

        <div className='flex-2 custom-list-email-sendEmail-div'>
    <button onClick={handleCancelDisplaySubscribers} className='custom-done-sendEmail-BTN flex'>Done</button>
    {allSubscribers.map((singleSub, index)=>{
      const {_id: subscriberId, isVerified, subscriberName, subscriberEmail} = singleSub
      return(
        <>
          <div className='flex-3 custom-subscribers-list-item-div margin-small-small center-flex-align-display' key={index}>
             {!mobileScreenMode && <div className='flex-3 custom-email-list-general-div margin-left-sm1 custom-email-list-name-div'><p className='color1 text-general-small'>{subscriberName}</p> </div>}
              <div  className='flex-3 custom-email-list-general-div custom-subscriber-email-div'><p className='color1 text-general-small'>{subscriberEmail}</p></div>
              { !mobileScreenMode && <div  className='flex-3 custom-email-list-general-div custom-subscriber-verify-status-div'>{isVerified == false ? <p className='color1 text-general-small'>Verifed : No</p> : <p className='color1 text-general-small'> Verified: Yes</p>}</div>}
              <input className='marginRight-extraSmall' type="checkbox"  id={index} checked={isChecked(subscriberEmail)} onChange={()=> handleCheckedClick(subscriberEmail)}/>
          </div>
        </>
      )
    })}

   
    <div className='flex  margin-small-small'>
          <div>
          <MdNavigateBefore onClick={handlePrevPage} className='custom-navigation-sendEmail-icon marginRight-extraSmall general-cursor-pointer'/>
        </div>
        <div><p className='color3 text-general-small general'>Page: {pageNumber}</p></div>
        <div>
          <MdNavigateNext onClick={handleNextPage} className='custom-navigation-sendEmail-icon marginLeft-extraSmall general-cursor-pointer'/>
    </div>
    </div>
   </div>
      }
    
    <div className={callSubscribersState ? 'custom-createEmail-div flex-2 curson-not-allowed-2 pointer-events-none bg-blur' : 'custom-createEmail-div flex-2'}>
      <div className='flex'><h4 className='center-text text-general-small color1'>Compose Email</h4></div>
    <p className='color1 text-general-extral-small margin-extra-small-Top'>Email Subject</p>
        <input className='margin-extra-small-Top custom-email-subject-input color1' placeholder='Email Subject...' type="text" defaultValue={emailProp.emailTitle} ref={emailSubject}/>
       <div className='flex-3 center-flex-align-display'> 
          <p className='color1 text-general-extral-small margin-extra-small-Top'>Email Reciever(s)</p> 
            <button onClick={handleDisplaySubscribers} className='custom-email-recivers-BTN marginLeft-extraSmall margin-extra-small-Top '>Select Receivers</button>
            <p className='color2 text-general-extral-small margin-extra-small-Top marginLeft-extraSmall'>{selectedSubscriberId.length} Subcribers selected</p>
       </div>

       {
        //handles the notification for email delivery
        emailLoading && 
          <div className='custom-email-delivery-text-div  flex-2 center-flex-justify-display center-flex-align-display'>
             {emailDeliveryUpdate &&
              <>
              
                 <BsCheckLg className='custom-sent-email-icon'/>
                <p className='color1 text-general-small margin-extra-small-Top'>Email sent</p>
              </>
             }
          </div>
       }

        <p className='margin-extra-small-Top color1 text-general-extral-small'>Email Body</p>
        <textarea className='custom-email-textArea margin-extra-small-Top color1' placeholder='Compose email...' defaultValue={emailProp.emailBody} ref={emailBody}></textarea>

       {/*  error messages start here  */}

        {noUserFoundError &&  <p className='color2 text-general-extral-small center-text margin-small'>No user found</p>}

        {notAuthorizedError &&  <p className='color2 text-general-extral-small center-text margin-small'>You are not authorized</p>}

        {emailBodyEmptyError &&  <p className='color2 text-general-extral-small center-text margin-small'>Email messsage must be provided</p>}

        {emailRecieverEmptyError &&  <p className='color2 text-general-extral-small center-text margin-small'>Email reciever must be provided</p>}

        {emailTitleEmptyError &&  <p className='color2 text-general-extral-small center-text margin-small'>Email title must be provided</p>}

        {emailSubjectNumberError &&  <p className='color2 text-general-extral-small center-text margin-small'>Email title must not be all number</p>}

        {emailBodyNumberError &&  <p className='color2 text-general-extral-small center-text margin-small'>Email message must not be all number</p>}

        {emailVerifiedError &&  <p className='color2 text-general-extral-small center-text margin-small'>Only verified email can recieve emails</p>}

        {dateEmptyError &&  <p className='color2 text-general-extral-small center-text margin-small'>Date must be provided for delivery mode of later</p>}

        {somethingWentWrongError &&  <p className='color2 text-general-extral-small center-text margin-small'>Something went wrong</p>}

        {invalidDateError  &&  <p className='color2 text-general-extral-small center-text margin-small'>Invalid date, check your date format</p>}

        {emailNotFoundError  &&  <p className='color2 text-general-extral-small center-text margin-small'>Email selected not found</p>}



       {/*  error messsages end here */}

        <div className='margin-extra-small-Top flex-3'>
          <p className='color1 text-general-extral-small'>Delivery Mode</p> <p className='marginLeft-extraSmall text-general-extral-small color2'>{deliveryModeText}</p> 
        </div>
        <div className='margin-extra-small-Top flex-3'>
          <button onClick={handleChangeModeTogggle} className='custom-delivery-mode-BTN'>Change Delivery Mode</button>
           {deliveryModeState && 
           
           <div className='flex-2 marginLeft-extraSmall'>
               {deliveryModeArray.map((singleMode, key)=>{
           
                  return(
                    <>
                      <div key={key} className='custom-delivery-mode-div margin-small-small flex'>
                        <p onClick={()=> handleSelectDeliveryText(singleMode)} className={deliveryModeText == singleMode ? 'color2 text-general-small general-cursor-pointer': "color3 text-general-small general-cursor-pointer"}>{singleMode}</p>
                      </div>
                    </>
                    )
                  })}
            </div>
         
           
           }
         
         {
          deliveryModeText == 'later' && 
           <input className='marginLeft-extraSmall custom-write-email-date' type="date" defaultValue={dataDate}  onChange={e=>setDataDate(e.target.value)}/>
         }
        </div>
        {!emailUpdateMode ? <div className='flex'>
            <button onClick={handleSendEmail} className={emailLoading ? 'margin-small  custom-email-send-BTN curson-not-allowed-2' : 'margin-small  custom-email-send-BTN general-cursor-pointer' }>Send</button>
          :
  
          </div> :
          
          <div className='flex'>
            <button onClick={handleUpdateEmail} className={emailLoading ? 'margin-small  custom-email-send-BTN curson-not-allowed-2' : 'margin-small  custom-email-send-BTN general-cursor-pointer' }>Update</button>
          :
          
          </div> }
    </div>
   </>
  )

}

export default WriteEmail