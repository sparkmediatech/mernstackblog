import React, {useState, useEffect, useContext, useRef} from 'react';
import './contactus.css';
import Footer from '../../components/Footer/Footer';
import  BASE_URL from '../../hooks/Base_URL'
import axiosPrivate from '../../hooks/AxiosPrivate';
import {AuthContext} from '../../context/AuthProvide';








function Contactus() {
     const {dispatch} = useContext(AuthContext);
     const [userName, setUserName] = useState('');
     const [emailSubject, setEmailSubject] = useState('');
     const [emailBody, setEmailBody] = useState('');
     const [userEmail, setUserEmail] = useState('');
     const [loadingEmail, setLoadingEmail] = useState(false);
     

     //error states
     const [missingParamterError, setMissingParamterError] = useState(false);
     const [invalidEmailError, setInvalidEmailError] = useState(false);
     const [valueAllNumberError, setValueAllNumberError] = useState(false);
     const [somethingWentWrongError, setSomethingWentWrongError] = useState(false)
    

const handleContactUS = async() =>{
    dispatch({type:"CURSOR_NOT_ALLOWED_START"});
    const email = {
        userName : userName,
        emailSubject: emailSubject,
        emailBody : emailBody,
        userEmail : userEmail
    }


    try{
        
        const response = await axiosPrivate.post(`${BASE_URL}/emailsub/contactus/`, email )
            setLoadingEmail(true)
             dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
    }catch(err){
        setLoadingEmail(false)
         dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
         if(err.response.data == 'one of the required parameter missing'){
            return setMissingParamterError(true)
         }
        if(err.response.data == 'None of the required parameter should be all numbers'){
            return setValueAllNumberError(true)
        }
       
       if(err.response.data == 'your email is not valid'){
        return setInvalidEmailError(true)
       }
      if(err.response.data == 'something went wrong'){
        return setSomethingWentWrongError(true)
      }
    }
}





//handles error notification time out
useEffect(()=>{
    if(loadingEmail){
        setTimeout(() => {
            setLoadingEmail(false)
        }, 3000);
    }

    if(missingParamterError){
        setTimeout(() => {
            setMissingParamterError(false)
        }, 3000);
    }

    if(valueAllNumberError){
        setTimeout(() => {
            setValueAllNumberError(false)
        }, 3000);
    }

   if(invalidEmailError){
    setTimeout(() => {
        setInvalidEmailError(false)
    }, 3000);
   }

 if(somethingWentWrongError){
    setTimeout(() => {
        setSomethingWentWrongError(false)
    }, 3000);
 }


}, [loadingEmail, missingParamterError, valueAllNumberError, invalidEmailError, somethingWentWrongError])










  return (
    <>
        <article>
             <div className='mainContainer custom-contact-us-main-div flex-2 center-flex-align-display'>
                <div className='contact-us-content-box-div flex-2 margin-small'>
                     <div className='flex-2 center-flex-align-display margin-small'>
                        { loadingEmail && <h3 className='color4 text-general-small' >Message Sent</h3>}
                        <h4 className='color3 text-general-small '>Contact-us</h4>
                        <p className='text-general-small margin-small-small color1'>For all inquiries, fill the below form</p>
                    </div>
                    <div className='flex-2 custom-contact-us-context-div'>
                        <p className='text-general-small color3'>Name</p>
                        <input className='margin-small-small color1 custom-contact-us-imput' type="text"   onChange={(e)=> setUserName(e.target.value)} />

                        <p className='text-general-small color3 margin-small-small'>Email</p>
                        <input className='custom-contact-us-imput color1' type="text"  onChange={(e)=> setUserEmail(e.target.value)}/>

                        <p className='text-general-small color3 margin-small-small'>Subject</p>
                        <input className='custom-contact-us-imput color1 margin-small-small' type="text"  onChange={(e)=> setEmailSubject(e.target.value)}/>

                        <p className='text-general-small color3 margin-small-small'>Message</p>
                        <textarea className='custom-contact-us-imput color1 custom-contact-us-textarea margin-small-small'  onChange={(e)=> setEmailBody(e.target.value)}>

                        </textarea>

                        {/*error texts starts here    */}
                        {missingParamterError && <p className='text-general-extral-small red-text center-text margin-extra-small-Top'>One of the required values is missing</p>}

                        {valueAllNumberError && <p className='text-general-extral-small red-text center-text margin-extra-small-Top'>Required paramters must not be all numbers</p>}

                        {invalidEmailError && <p className='text-general-extral-small red-text center-text margin-extra-small-Top'>Invalid Email address</p>}

                        {somethingWentWrongError && <p className='text-general-extral-small red-text center-text margin-extra-small-Top'>Something went wrong, refresh page</p>}


                         {/*error texts ends here    */}
                        <div className='margin-small flex'><button className='flex button-general custom-contact-us-BTN' onClick={handleContactUS}>Submit</button></div>
                    </div>
                </div>

               

            </div>

        <Footer/>
        </article>
    </>
   
  )
}

export default Contactus