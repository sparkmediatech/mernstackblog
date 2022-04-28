import React, {useContext, useState, useRef, useEffect} from 'react';
import axios from 'axios';
import {AuthContext} from '../../context/AuthProvide';
import ActivationLinkSent from './ActivationLinkSent';
import {MdMarkEmailRead} from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom'

function ResendVerifyLink() {
    const {temp, regUser, dispatch, isLoading} = useContext(AuthContext);
    const emailRef = useRef();
    const [verified, setVerified] = useState(false);
    const [alreadyVerifiedError, setAlreadyVerifiedError] = useState(false);
    const [somethingWentWrongError, setSomethingWentWrong] = useState(false)


    const handleResendVerifyLink = async () =>{
       
    
    try{
        //setIsloading(true)
       const response = await axios.post(`/resendlink`, {email: emailRef.current.value});
        dispatch({type:"REG_SUCCESS", payload: response.data});        
        window.location.replace('/linksent')
         
      
        /*setExpiredError(false);
        setBrokenLinkError(false);
        setResendLink(true);
        setNoToken(false);
        setIsloading(false);*/

    }catch(err){
          dispatch({ type: "ISLOADING_END" });
         if(err.response.data === 'User has already been verified'){
             setAlreadyVerifiedError(true);
              setVerified(true);
        };
        if(err.response.data === 'Something went wrong'){
           setSomethingWentWrong(true)
  
        }

    }
   
    
};

//useEffect to turn off error message after some seconds
useEffect(()=>{
    setTimeout(() => {
        setSomethingWentWrong(false)
    }, 1000);
}, [somethingWentWrongError])



  return (
      
    <article className='mainWrapper '>
        <div className='mainContainer custom-email-verification-container center-flex-justify-display topMargin-Extral-Large '>
        {
            !verified &&
             <div className={somethingWentWrongError ?'resend-Email-div resend-Email-div2': 'resend-Email-div' }>
                <h2 className='text-general-BIG resetTitle'>Rend Email Verification Link</h2>
                 <label className='label-general reset-lebel '>Email</label>
                 <input className='input-general' type="text"  ref={emailRef} />
                {somethingWentWrongError && <h4 className='paragraph-text red-text'>Something went wrong. Enure you are using correct email address</h4>}
                 <button onClick={handleResendVerifyLink} className='button-general'>Send</button>
                    <p className='support-team-text center-text topMargin-medium'>Nodejs and Reactjs Blog application team</p>

            </div>

        }    
       
        {
          alreadyVerifiedError && 
            <div className='mainContainer box-div flex-2 center-flex-align-display already-verified-custom-div'>
            <MdMarkEmailRead className='Icon '/>
            <h2 className='text-general-small color1 center-text'>Dear {regUser.username}, Your email address has been verified already</h2> 
            <p className='text-general-small color1'>Thank you. You can click the login button to login into the web application</p>
            <Link to={'/login'}>
                <button className="button-general-2">Login</button>
            </Link>
            
        </div>   
        }
        </div>

    </article>
  )
}

export default ResendVerifyLink