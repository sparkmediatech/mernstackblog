import React, {useRef, useContext, useState, useEffect} from 'react';
import '../../CSS files/utilities.css'
import './passwordReset.css';
import axios from 'axios';
import {AuthContext} from '../../context/AuthProvide';
import {MdOutlineMail} from 'react-icons/md';
import  BASE_URL from '../../hooks/Base_URL'






function PasswordResetEmail() {
    const emailRef = useRef();
    const {dispatch, temp} = useContext(AuthContext);
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userNotFoundError, setUserNotFoundEror] = useState(false);
    const [somethingWentWrongError, setSomethingWentWrongError] = useState(false)


    console.log(temp)
    const handleSendResetPasswordEmailLink = async () =>{
        try{
            setLoading(true)
            const response = await axios.post(`${BASE_URL}/resetPassword`, {
                 email: emailRef.current.value,
            })
            dispatch({type:"REG_SUCCESS", payload: response.data});
            setSent(true);
            setLoading(false)
            console.log(response.data)
        }catch(err){
            if(err.response.data === "User not found"){
                setUserNotFoundEror(true)
            }
            if(err.response.data === "Something went wrong"){
                setSomethingWentWrongError(true)
            }
            console.log(err)
        }
    };

//useeffect to clear off error message after some seconds
useEffect(()=>{
    setTimeout(() => {
        setUserNotFoundEror(false)
    }, 2000);
}, [userNotFoundError])

  return (
      <article className='mainWrapper'>
           <div className='mainContainer flex-2 center-flex-align-display topMargin-Extral-Large '>
            { !sent ?
               <div className={userNotFoundError ? 'passwordreset-custom-div2 box-div flex-2 center-flex-justify-display passwordreset-custom-div topMargin-Extral-Large': ' box-div flex-2 center-flex-justify-display passwordreset-custom-div topMargin-Extral-Large'}>
                   <h2 className='text-general-BIG resetTitle'>Reset Password</h2>
                   <label className='label-general reset-lebel '>Email</label>
                    <input className='input-general' type="text"  ref={emailRef} required/>

                    {userNotFoundError && <p className='paragraph-text red-text topMargin-Extral-Large'>There is no user with such email</p>}
                    {somethingWentWrongError && <p className='paragraph-text red-text'>Something Went Wrong, ensure you are using valid email</p>}
                    <button onClick={handleSendResetPasswordEmailLink} className='button-general'>Reset</button>
                    <p className='support-team-text center-text'>Nodejs and Reactjs Blog application team</p>
               </div>
               :
              <div className='box-div flex-2 flex passwordreset-custom-div passwordreset-custom-div2 topMargin-Extral-Large'>
                   <h2 className='text-general-BIG resetTitle'>Reset Password Sent</h2>
                    <MdOutlineMail className='Icon password-reset-custom-email-icon'/>
                    <p className='center-text paragraph-text'>Kindly check your email inbox or spam box for your password reset link. Click on the link to reset your password</p>
                    <p className='support-team-text center-text  padding-bottom margin-small'>Nodejs and Reactjs Blog application team</p>
               </div> 
            }
           </div>
      </article>
   
  )
}

export default PasswordResetEmail