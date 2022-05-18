import './login.css'
import { Link } from 'react-router-dom';
import React, {useRef, useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {AuthContext} from '../../context/AuthProvide';
import '../../CSS files/utilities.css';
import {LogContext} from '../../context/LogContext'
import  BASE_URL from '../../hooks/Base_URL'



export default function Login() {
    const {setAuth} = useContext(AuthContext);
    const {logdispatch} = useContext(LogContext);
    const userRef = useRef();
    const passwordRef = useRef();
    const [wrongCredentialError, setWrongCredentialError] = useState(false);
    const [unauthorizedError, setUnauthorizedError] = useState(false);
    const [unverifiedError, setUnverifiedError] = useState(false);
    const [somethingWentWrongError, setSomethingWentWrongError] = useState(false)
    
   
    const handleSubmit = async (e) =>{
        e.preventDefault();

        try{
            const response = await axios.post(`/auth/login`, {
                username: userRef.current.value,
                password: passwordRef.current.value
            }, {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            });
            logdispatch({type:"LOG_SESSION", payload: response.data.sessionId});
             localStorage.removeItem('ogB');
            setAuth(response.data);
            window.location.replace('/')
                   
        }catch(err){
            if(err.response.data === "Wrong credentials"){
                setWrongCredentialError(true)
            };
            if(err.response.data === "You're not authorized to access this page"){
                setUnauthorizedError(true);
                 
            };
            if(err.response.data === "Your account is yet to be verified"){
                setUnverifiedError(true);
                
            };

            if(err.response.data === "'Something went wrong'"){
               setSomethingWentWrongError(true)
               
            }
           
        }

    }
 
useEffect(() =>{
  if(wrongCredentialError){
      setTimeout(() => {
          setWrongCredentialError(false)
      }, 5000);
  };
  if(unauthorizedError){
          setTimeout(() => {
          setUnauthorizedError(false)
      }, 5000);
  }
  
  
}, [wrongCredentialError, unauthorizedError])
    return (
        <>

        <div className='login'>
            <div className="loginContainer">
                <span className="loginTitle">Login</span>
                <form className="loginform" onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input className='loginInput' type="text" placeholder='Enter your username'
                        ref={userRef}
                    />

                    <label>Passowrd</label>
                    <input className='loginInput' type="password" placeholder='Enter your password' 
                        ref={passwordRef}
                    />
                    {wrongCredentialError && <h4 className='paragraph-text red-text'>Wrong credentials</h4>}
                    {unauthorizedError && <h4 className='paragraph-text red-text'>You're not authorized to use this channel</h4>}
                     {somethingWentWrongError && <h4 className='paragraph-text red-text'>Something went wrong</h4>}
                    <button className="loginButton" type="submit" >{/* enabled me to disble the cursor when isFething is true */}
                        Login
                        </button>
                </form>
                
                <button className="loginRegisterButton">
                    <Link className='link' to='/register'>Register</Link>
                </button>

                 <label>Forgot password?</label>
            <button className="passResetBTN">
                    <Link className='link' to='/passrest'>Reset Password</Link>
                </button>   
            {unverifiedError && <Link to={'/resendemaillink'}>
                <button className='button-general-2'>Resend Verification Email</button>
            </Link> }    
            </div> 
           
        </div>
    

     </>   
    )
}
