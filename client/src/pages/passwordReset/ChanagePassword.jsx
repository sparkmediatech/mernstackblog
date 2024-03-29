import React, {useContext, useEffect, useState, useRef} from 'react';
import {AuthContext} from '../../context/AuthProvide';
import axios from 'axios';
import {AiFillCheckCircle} from 'react-icons/ai';
import {FaSadCry} from 'react-icons/fa';
import {MdGppBad} from 'react-icons/md'
import { Link, useLocation } from 'react-router-dom';
import  BASE_URL from '../../hooks/Base_URL';


function ChanagePassword() {
    const location = useLocation()
    const path = location.pathname.split("/")[2];
    const pathId = location.pathname.split("/")[3];
    const {temp} = useContext(AuthContext);
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const [alreadyVerified, setAlreadyVerified] = useState(false);
    const[isLoading, setIsLoading] = useState(false);
    const [regData, setRegData] = useState();
    const [update, setUpdate] = useState(true);
    const [noToken, setNoToken] = useState(false);
    const [notMatchError, setNotMatchError] = useState(false);
    const [notUpdatedError, setNotUpdatedError] = useState(false);
    const [userNotFoundError, setUserNotFoundError] = useState(false);
    const [somethingWentWrongError, setSomethingWentWrongError] = useState(false);
    const [passWordPresentError, setPassWordPresentError] = useState(false);
    const [passWordMinError, setPassWordMinError] = useState(false);
    const [passWordInvalidError, setPassWordInvalidError] = useState(false)

console.log(path, 'path')

    const handleChangePassword = async ()=>{
            const userDetails ={
                    userId: pathId,
                    password: passwordRef.current.value,
                    confirmPassword: confirmPasswordRef.current.value,        
            }
            console.log(userDetails.password === userDetails.confirmPassword)
            try{
                const response = await axios.patch(`${BASE_URL}/updatepassword/${path}`, userDetails, {
                     withCredentials: true,
                     headers:{authorization: `Bearer ${path}`}  
                });
                 setRegData(response);
                 setUpdate(false);
               
            }catch(err){
               if(err.response.data === 'Unable to verify expired token, please resend token'){

                setAlreadyVerified(true);

                setUpdate(false);
                setIsLoading(false);
                } 
              if(err.response.data === 'You are not authorized, reset token not found'){
                setUpdate(false);
                setNoToken(true)
              };
              if(err.response.data === 'Confirm password does not match password'){
                setNotMatchError(true)
              };
              if(err.response.data === 'Not updated'){
                setNotUpdatedError(true)
              };
              if(err.response.data === 'User not found'){
                  setUserNotFoundError(true)
              };
              if(err.response.data === 'Something went wrong'){
                setSomethingWentWrongError(true)
              }

              if(err.response.data == 'password must be present'){
                return setPassWordPresentError(true)
              }

            if(err.response.data == 'password must not be less than 8 characters'){
              return setPassWordMinError(true)
            }

            if(err.response.data == 'password must contain at least 1 upper case, lower case, number and special characters'){
              return setPassWordInvalidError(true)
            }
            }
    } 

useEffect(() =>{
  
  if(notMatchError){
     setTimeout(() => {
    setNotMatchError(false)
  }, 5000);
  };
  if(notUpdatedError){
     setTimeout(() => {
   setNotUpdatedError(false)
  }, 5000);
  };
  if(userNotFoundError){
    setTimeout(() => {
    setUserNotFoundError(true)
  }, 5000);
  }
  if(passWordPresentError){
    setTimeout(() => {
      setPassWordPresentError(false)
    }, 3000);
  }


if(passWordMinError){
  setTimeout(() => {
    setPassWordMinError(false)
  }, 3000);
}

if(passWordInvalidError){
  setTimeout(() => {
    setPassWordInvalidError(false)
  }, 3000);
}
}, [notMatchError, notUpdatedError, userNotFoundError, passWordPresentError, passWordMinError, passWordInvalidError])







return (
  <>
      <article className='mainWrapper'>
          <div className='mainContainer center-flex-justify-display topMargin-Extral-Large custom-change-pass-main-div'>
        {
         update &&
          <div className={passWordInvalidError || notMatchError || notUpdatedError || userNotFoundError || passWordPresentError || passWordMinError? 'custom-change-password-wrapper-2 box-div flex-2 padding-left-right topMargin custom-change-password-wrapper ': 'box-div flex-2 padding-left-right topMargin custom-change-password-wrapper '}>
       
                <h4 className='text-general-small2 color1 center-text topMargin-medium resetTitle'>Reset Password</h4>
              <label className='label-general color1 margin-small'>password</label>
                <input className='input-general margin-small' type="password" ref={passwordRef} />

                <label className='label-general margin-small color1'>confirmpassword</label>
                <input className='input-general margin-small' type="password"  ref={confirmPasswordRef}/>

                {notMatchError && <h4 className='paragraph-text notMatchCustomText  '>Password does not match</h4>}
                {notUpdatedError && <h4 className='paragraph-text notMatchCustomText '>Password not updated, please ensure that you provide all required details</h4>}
                {userNotFoundError && <h4 className='paragraph-text notMatchCustomText '>User not found in our database</h4>}
                {passWordPresentError && <h4 className='paragraph-text notMatchCustomText '>Password must not be empty</h4>}
  
                {passWordMinError && <h4 className='paragraph-text notMatchCustomText '>Password must not be less than 8 characters</h4>}

                {passWordInvalidError && <h4 className='paragraph-text notMatchCustomText '>Password must contain atleast 1 uppercase, 1 lowercase, 1 number and 1 special character</h4>}
                
                <div className='custom-pass-reset-div flex'><button onClick={handleChangePassword } className='button-general custom-reset-password-BTN'>Reset</button></div>

                <p className='support-team-text center-text topMargin-medium '>Nodejs and Reactjs Blog application team</p>
                
            </div>
            
        }
           {
            regData?.status == 200 &&
             <div className='box-div flex-2 center-flex-align-display topMargin resetPassCustom-Div '>
                <h3 className='text-general-small2 color1 center-text topMargin-medium custom-change-pass-title-text'>Password Reset Successfull</h3>
                <AiFillCheckCircle className='Icon custom-change-pass-icon'/>
                <p className='paragraph-text center-text topMargin-medium custom-change-pass-text'>Reset was successful, kindly click on Login button to login</p>
                
                <div className='flex custom-pass-reset-div'>
                <Link to={'/login'} className='link'>
                   <button className='button-general button-general-2  flex custom-change-pass-word-BTN'>Login</button>
                </Link>
                </div>
                

                <p className='support-team-text center-text topMargin-medium '>Nodejs and Reactjs Blog application team</p>
                
            </div>
           } 

           {
             alreadyVerified &&
             <div className='box-div flex-2 center-flex-align-display topMargin resetPassCustom-Div '>
                <h3 className='text-general-small2 color1 center-text topMargin-medium custom-change-pass-title-text'>Password Reset Link Expired</h3>
                <FaSadCry className='Icon custom-change-pass-icon'/>
                <p className='paragraph-text center-text topMargin-medium custom-change-pass-text'>Reset has expired, kindly resend the reset link</p>
                
                <div className='flex custom-pass-reset-div'>
                <Link to={'/passrest'} className='link'>
                   <button className='button-general button-general-2 flex flex custom-change-pass-word-BTN'>Resend</button>
                </Link>
                </div>
                

                <p className='support-team-text center-text topMargin-medium '>Nodejs and Reactjs Blog application team</p>
                
            </div>
           }
         {
           noToken &&
            <div className='box-div flex-2 center-flex-align-display topMargin resetPassCustom-Div '>
                <h3 className='text-general-small2 color1 center-text topMargin-medium custom-change-pass-title-text'>Access Denied</h3>
                <MdGppBad className='Icon custom-change-pass-icon'/>
                <p className='paragraph-text center-text topMargin-medium custom-change-pass-text'>A required parameter not found, kindly resend the reset link</p>
                <div className='flex custom-pass-reset-div'>
                <Link to={'/passrest'}>
                   <button className='button-general button-general-2  flex custom-change-pass-word-BTN'>Resend</button>
                </Link>
                </div>
                <p className='support-team-text center-text topMargin-medium '>Nodejs and Reactjs Blog application team</p>
                
            </div>
         }

          {
           somethingWentWrongError &&
            <div className='box-div flex-2 center-flex-align-display topMargin resetPassCustom-Div '>
                <h3 className='text-general-small2 color1 center-text topMargin-medium custom-change-pass-title-text'>Something Went wrong</h3>
                <MdGppBad className='Icon'/>
                <p className='paragraph-text center-text topMargin-medium custom-change-pass-text'>There is something wrong somewhere, do resend the link</p>
                
                <div className='flex custom-pass-reset-div'>
                <Link to={'/passrest'}>
                   <button className='button-general button-general-2 custom-reset-password-BTN flex custom-change-pass-word-BTN'>Resend</button>
                </Link>
                </div>
                <p className='support-team-text center-text topMargin-medium '>Nodejs and Reactjs Blog application team</p>
                
            </div>
         }
         
          </div>
      </article>
   
  </>
  )
}

export default ChanagePassword