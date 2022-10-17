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





export default function ConfirmEmail() {
const {temp, regUser, dispatch} = useContext(AuthContext)
const location = useLocation();
const userId = location.pathname.split("/")[2];
const tokenId = location.pathname.split("/")[3];
const [resDate, setResData] = useState({});
const [loading, setIsloading] = useState(false);
const [error, setError] = useState(false);
const [verifyError, setVerifyError] = useState(false);
const [brokenLinkError, setBrokenLinkError] = useState(false);
const [expiredError, setExpiredError] = useState(false);
const [parameterError, setParameterError] = useState(false);
const [resendLink, setResendLink] = useState(false);
const [noToken, setNoToken] = useState(false);
const [alreadyVerified, setAlreadyVerified] = useState(false)



const handleVerifyEmailLink = async ()=>{
    setIsloading(true)
    
    try{
        const response = await axios.get(`${BASE_URL}/confirm/${userId}/${tokenId}`);
        setIsloading(false)
        setResData(response)
    }catch(err){
        if(err.response.data == 'Verification Token not found' ){
            setIsloading(false);
            setAlreadyVerified(false)
           setNoToken(true);
           
            
        };
        if(err.response.data === 'Account has been verified already'){
             setIsloading(false);
            setVerifyError(true);
        }
        if(err.response.data === 'Unable to verify expired token, please resend token'){
            setExpiredError(true);
            setIsloading(false);
        };
        if(err.response.data === 'One or all required parameters not valid'){
            setParameterError(true)
            setIsloading(false);
        } 
            
    };

   

};


useEffect(() => {
   handleVerifyEmailLink()
           
    }, [userId, tokenId]);
    
  
return(
    <>
    <article className='mainWrapper'>
     <div className='mainContainer flex custom-main-confim-email-wrapper'>
    {loading && <div className='loading-div'> <h2 className='loading-title custom-confirm-email-text'>Loading...</h2> </div>}
   
   {resDate.data === 'Account has been verified' && !loading && !verifyError &&
  
        <div className='mainContainer box-div flex-2 center-flex-align-display already-verified-custom-div'>
            <MdMarkEmailRead className='Icon'/>
            <h2 className='text-general-small2 color1 center-text custom-confirm-email-text' >Dear {regUser.username}, Your email address has been verified</h2> 
            <p className='paragraph-text'>Thank you. You can click the login button to login into the web application</p>
            <Link to={'/login'}>
                <button className="button-general-2 custom-confirm-btn">Login</button>
            </Link>
            
        </div>   
}
{noToken && !loading &&
<div className='mainContainer box-div flex-2 center-flex-align-display already-verified-custom-div custom-confirm-email-box-div'>
    <FaSadCry className='Icon custom-confirm-icon'/>
   <h2 className='text-general-small2 color1 center-text custom-confirm-email-text'>Required access not found. You may try to resend the verification link</h2>
  <Link to={'/resendemaillink'}>
            <button className='button-general-2 custom-confirm-btn'>Resend Link</button>
        </Link>
</div> 
}
{expiredError && !loading &&
    <div  className='mainContainer box-div custom-confirm-email-box-div flex-2 center-flex-align-display already-verified-custom-div'>
         <FaSadCry className='Icon custom-confirm-icon' />
        <h2 className='text-general-small2 color1 center-text custom-confirm-email-text'> Dear {regUser.username}, activation link has expired, kindly resend your activation link</h2>
           <Link to={'/resendemaillink'}>
            <button className='button-general-2 custom-confirm-btn'>Resend Link</button>
        </Link>
    </div> 

}

{parameterError && !loading &&
    <div className='mainContainer box-div flex-2 center-flex-align-display already-verified-custom-div'>
        <FcBrokenLink className='Icon custom-confirm-icon'/>
        <h2  className=' text-general-small2 color1 center-text custom-confirm-email-text' >One or more needed paramter is missing, please resend the verification link</h2>
        <Link to={'/resendemaillink'}>
            <button className='button-general-2 custom-confirm-btn'>Resend Link</button>
        </Link>
        
    </div>
}
{
    alreadyVerified && !loading && !brokenLinkError &&
    <div className='mainContainer box-div  flex-2 center-flex-align-display already-verified-custom-div '>
            <MdMarkEmailRead className='Icon custom-confirm-icon'/>
            <p className='text-general-Medium custom-email-already-verified-text'>Dear {regUser.username}, Your email address has been verified already</p> 
            <p className='paragraph-text custom-confirm-email-text'>Thank you. You can click the login button to login into the web application</p>
            <Link to={'/login'}>
                <button className="button-general-2 custom-confirm-btn">Login</button>
            </Link>
            
        </div>   
}
{
    verifyError && !loading && !brokenLinkError &&
    <div className='mainContainer box-div flex-2 center-flex-align-display already-verified-custom-div'>
            <MdMarkEmailRead className='Icon custom-confirm-icon'/>
            <p className='text-general-Medium color1 center-text custom-email-already-verified-text'>Dear {regUser.username}, Your email address has been verified already</p> 
            <p className='paragraph-text custom-confirm-email-text'>Thank you. You can click the login button to login into the web application</p>
            <Link to={'/login'}>
                <button className="button-general-2 custom-confirm-btn">Login</button>
            </Link>
            
        </div>   
}
   </div>

   </article>
  
    </>
)


}

