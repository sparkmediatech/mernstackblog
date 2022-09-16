import React, {useState, useContext, useEffect} from 'react';
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios';
import './comfirmemail.css';
import '../../CSS files/utilities.css'
import {MdMarkEmailRead} from 'react-icons/md';
import{FcBrokenLink} from 'react-icons/fc';
import {FaSadCry} from 'react-icons/fa';
import {BiUnlink} from 'react-icons/bi'
import {AuthContext} from '../../context/AuthProvide';
import ActivationLinkSent from '../Email Activation/ActivationLinkSent'
import '../../CSS files/utilities.css'
import  BASE_URL from '../../hooks/Base_URL'
import {BiErrorCircle} from 'react-icons/bi'
import {BsCheckLg} from 'react-icons/bs'

function SubscriberConfirmation() {
    const {dispatch} = useContext(AuthContext);
    const location = useLocation()
    const userId = location.pathname.split("/")[2];
    const tokenId = location.pathname.split("/")[3];
    const [verifiedState, setVerifiedState] = useState(false);
    const [expiredTokenError, setExpiredTokenError] = useState(false);
    const [alreadyExpiredError, setAlreadyVerifiedError] = useState(true);
    const [somethingWentWrongError, setSomethingWentWrongError] = useState(false);
    const [resendVerifyState, setResendVerifyState] = useState(false);
    const [subNotFound, setSubNotFound] = useState(false);
 


    useEffect(()=>{
        const verifySubEmail = async()=>{

            try{
                 dispatch({type:"CURSOR_NOT_ALLOWED_START"});
                const response = await axios.get(`${BASE_URL}/confirm/${userId}/${tokenId}`);
                dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
                setVerifiedState(true);
                console.log(response.data)
            }catch(err){
                dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
                if(err.response.data === "Unable to verify expired token, please resend token"){
                    setExpiredTokenError(true)
                }

                if(err.response.data === "user email has been verified already"){
                    return setAlreadyVerifiedError(true)
                }

                if(err.response.data === 'something went wrong'){
                    return setSomethingWentWrongError(true)
                }
            }
        }
        verifySubEmail()
    }, [userId, tokenId]);


//handle verification resend

const handleResendVerification = async()=>{
    try{
        dispatch({type:"CURSOR_NOT_ALLOWED_START"});
        const response = await axios.get(`${BASE_URL}/resendConfirm/${userId}`);
        dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
        return setResendVerifyState(true)
    }catch(err){
         dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
        if(err.response.data === "User has already been verified"){
            return setAlreadyVerifiedError(true)
        }
        
        if(err.response.data === 'subscriber not found'){
            return setSubNotFound(true)
        }
    if(err.response.data === 'Something went wrong'){
        return setSomethingWentWrongError(true)
    }
    }
}




  return (
    <div>
        <div className='mainContainer custom-subVerify-div flex-2 center-flex-align-display center-flex-justify-display'>

        {
            verifiedState && !expiredTokenError && !resendVerifyState && !somethingWentWrongError &&
           <div className='custom-sub-expiry-div flex-2 center-flex-align-display'>
             <h3 className='color1 text-general-small'>Email verified</h3>
             <BsCheckLg className='Icon color4'/>
            <p className='text-general-extral-small color1'>Email verification successful</p>

             <Link to={'/'} className='link'><button className='topMargin-medium general-cursor-pointer button-general-2 custom-sub-resend-BTN'>Home</button></Link>
           </div>
        }
        {expiredTokenError && !verifiedState && !resendVerifyState && !somethingWentWrongError &&
        
        <>
           <div className='custom-sub-expiry-div flex-2 center-flex-align-display'>
             <h3 className='color1 text-general-small'>Expired verification code</h3>
             <BiErrorCircle className='Icon'/>
            <p className='text-general-extral-small color1'>Verification code has expired, kindly resend verification code</p>

            <button onClick={handleResendVerification} className='topMargin-medium general-cursor-pointer button-general-2 custom-sub-resend-BTN'>Resend</button>
           </div>
        </>
            
        }

        {
            !expiredTokenError && !verifiedState && !alreadyExpiredError && !somethingWentWrongError && !resendVerifyState &&

            <div className='custom-sub-expiry-div flex-2 center-flex-align-display'>
             <h3 className='color1 text-general-small'>Broken verification code</h3>
             <BiErrorCircle className='Icon'/>
            <p className='text-general-extral-small color1'>Verification code broken, kindly resend verification code</p>

            <button onClick={handleResendVerification} className='topMargin-medium general-cursor-pointer button-general-2 custom-sub-resend-BTN'>Resend</button>
           </div>
        }

        {
            alreadyExpiredError && !expiredTokenError && !verifiedState && !resendVerifyState &&

            <div className='custom-sub-expiry-div flex-2 center-flex-align-display'>
             <h3 className='color1 text-general-small'>Email already verified</h3>
             <BsCheckLg className='Icon'/>
            <p className='text-general-extral-small color1'>Your email has been verified before</p>

            <Link to={'/'} className='link'><button className='topMargin-medium general-cursor-pointer button-general-2 custom-sub-resend-BTN'>Home</button></Link>
           </div>

        }

        {somethingWentWrongError &&  !alreadyExpiredError && !expiredTokenError && !verifiedState &&
            
            <div className='custom-sub-expiry-div flex-2 center-flex-align-display'>
             <h3 className='color1 text-general-small'>Something went wrong</h3>
             <BiErrorCircle className='Icon'/>
            <p className='text-general-extral-small color1'>Something went wrong, resend verification link</p>

            <button onClick={handleResendVerification} className='topMargin-medium general-cursor-pointer button-general-2 custom-sub-resend-BTN'>Resend</button>
           </div>
        }


        {
            resendVerifyState && 
             <div className='custom-sub-expiry-div flex-2 center-flex-align-display'>
             <h3 className='color1 text-general-small'>Verification sent</h3>
             <BsCheckLg className='Icon'/>
            <p className='text-general-extral-small color1'>We have sent the verification link, check your email and click the link</p>

            <button onClick={handleResendVerification} className='topMargin-medium general-cursor-pointer button-general-2 custom-sub-resend-BTN'>Resend</button>
           </div>
        }

        {
            subNotFound && 
             <div className='custom-sub-expiry-div flex-2 center-flex-align-display'>
             <h3 className='color1 text-general-small'>Subscriber not found!</h3>
             <BiErrorCircle className='Icon'/>
            <p className='text-general-extral-small color1'>Subscriber not found, contact admin or refresh</p>
           </div>
        }

        </div>
    </div>
  )
}

export default SubscriberConfirmation