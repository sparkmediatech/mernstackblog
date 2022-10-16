import React, {useContext, useEffect, useState, useRef} from 'react';
import {AuthContext} from '../../context/AuthProvide';
import axios from 'axios';
import {AiFillCheckCircle} from 'react-icons/ai';
import {FaSadCry} from 'react-icons/fa';
import {MdGppBad} from 'react-icons/md'
import { Link, useLocation } from 'react-router-dom';
import  BASE_URL from '../../hooks/Base_URL'

function ChanagePassword() {
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
    const [somethingWentWrongError, setSomethingWentWrongError] = useState(false)


    const handleChangePassword = async ()=>{
            const userDetails ={
                    userId: temp.Id,
                    password: passwordRef.current.value,
                    confirmPassword: confirmPasswordRef.current.value,        
            }
            console.log(userDetails.password === userDetails.confirmPassword)
            try{
                const response = await axios.patch(`${BASE_URL}/updatepassword/${temp.emailToken}`, userDetails, {
                     withCredentials: true,
                    headers:{authorization: `Bearer ${temp.emailToken}`}  
                });
                 setRegData(response);
                 setUpdate(false);
                console.log(response);
            }catch(err){
               if(err.response.data === 'Unable to verify expired token, please resend token'){

                setAlreadyVerified(true);
                console.log('I am here')
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
  
}, [notMatchError, notUpdatedError, userNotFoundError])
return (
  <>
      <article className='mainWrapper'>
          <div className='mainContainer center-flex-justify-display topMargin-Extral-Large'>
        {
         update &&
          <div className='box-div flex-2 padding-left-right topMargin  '>
       
                <h4 className='text-general-small2 color1 center-text topMargin-medium'>Reset Your Password</h4>
              <label className='label-general color1 '>password</label>
                <input className='input-general margin-small' type="password" ref={passwordRef} />

                <label className='label-general margin-small color1'>confirmpassword</label>
                <input className='input-general margin-small' type="password"  ref={confirmPasswordRef}/>

                {notMatchError && <h4 className='paragraph-text notMatchCustomText  '>Password does not match</h4>}
                {notUpdatedError && <h4 className='paragraph-text notMatchCustomText '>Password not updated, please ensure that you provide all required details</h4>}
                 {userNotFoundError && <h4 className='paragraph-text notMatchCustomText '>User not found in our database</h4>}
                <button onClick={handleChangePassword } className='button-general'>Reset</button>

                <p className='support-team-text center-text topMargin-medium '>Nodejs and Reactjs Blog application team</p>
                
            </div>
            
        }
           {
            regData?.status == 200 &&
             <div className='box-div flex-2 center-flex-align-display topMargin resetPassCustom-Div '>
                <h3 className='text-general-small2 color1 center-text topMargin-medium'>Password Reset Successfull</h3>
                <AiFillCheckCircle className='Icon'/>
                <p className='paragraph-text center-text topMargin-medium '>Reset was successful, kindly click on Login button to login</p>
                <Link to={'/login'}>
                   <button className='button-general button-general-2'>Login</button>
                </Link>
                

                <p className='support-team-text center-text topMargin-medium '>Nodejs and Reactjs Blog application team</p>
                
            </div>
           } 

           {
             alreadyVerified &&
             <div className='box-div flex-2 center-flex-align-display topMargin resetPassCustom-Div '>
                <h3 className='text-general-small2 color1 center-text topMargin-medium'>Password Reset Link Expired</h3>
                <FaSadCry className='Icon'/>
                <p className='paragraph-text center-text topMargin-medium '>Reset has expired, kindly resend the reset link</p>
                <Link to={'/passrest'}>
                   <button className='button-general button-general-2'>Resend</button>
                </Link>
                

                <p className='support-team-text center-text topMargin-medium '>Nodejs and Reactjs Blog application team</p>
                
            </div>
           }
         {
           noToken &&
            <div className='box-div flex-2 center-flex-align-display topMargin resetPassCustom-Div '>
                <h3 className='text-general-small2 color1 center-text topMargin-medium'>Access Denied</h3>
                <MdGppBad className='Icon'/>
                <p className='paragraph-text center-text topMargin-medium '>A required parameter not found, kindly resend the reset link</p>
                <Link to={'/passrest'}>
                   <button className='button-general button-general-2'>Resend</button>
                </Link>
                <p className='support-team-text center-text topMargin-medium '>Nodejs and Reactjs Blog application team</p>
                
            </div>
         }

          {
           somethingWentWrongError &&
            <div className='box-div flex-2 center-flex-align-display topMargin resetPassCustom-Div '>
                <h3 className='text-general-small2 color1 center-text topMargin-medium'>Something Went wrong</h3>
                <MdGppBad className='Icon'/>
                <p className='paragraph-text center-text topMargin-medium '>There is something wrong somewhere, do resend the link</p>
                <Link to={'/passrest'}>
                   <button className='button-general button-general-2'>Resend</button>
                </Link>
                <p className='support-team-text center-text topMargin-medium '>Nodejs and Reactjs Blog application team</p>
                
            </div>
         }
         
          </div>
      </article>
   
  </>
  )
}

export default ChanagePassword