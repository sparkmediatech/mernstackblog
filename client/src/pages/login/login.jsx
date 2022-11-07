import './login.css'
import { Link } from 'react-router-dom';
import React, {useRef, useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {AuthContext} from '../../context/AuthProvide';
import '../../CSS files/utilities.css';
import  BASE_URL from '../../hooks/Base_URL'



export default function Login() {
    const {setAuth} = useContext(AuthContext);
    const userRef = useRef();
    const passwordRef = useRef();
    const [wrongCredentialError, setWrongCredentialError] = useState(false);
    const [unauthorizedError, setUnauthorizedError] = useState(false);
    const [unverifiedError, setUnverifiedError] = useState(false);
    const [somethingWentWrongError, setSomethingWentWrongError] = useState(false);
    const [noUserFoundError, setNoUserFoundError] = useState(false)
    
   
    const handleSubmit = async (e) =>{
        e.preventDefault();

        try{
            const response = await axios.post(`${BASE_URL}/auth/login`, {
                username: userRef.current.value,
                password: passwordRef.current.value
            }, {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            });
           
             localStorage.removeItem('ogB');
            setAuth(response.data);
            //window.location = '/'
                   
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

            if(err.response.data == 'no user found'){
                return setNoUserFoundError(true)
            }
           
        }

    }
 
useEffect(() =>{

  if(wrongCredentialError){
      setTimeout(() => {
          setWrongCredentialError(false)
      }, 3000);
  };
  if(unauthorizedError){
          setTimeout(() => {
          setUnauthorizedError(false)
      }, 3000);
  }
if(unverifiedError){
    setTimeout(() => {
         setUnverifiedError(false)
      }, 3000);
}
    
if(somethingWentWrongError){
    setTimeout(() => {
        setSomethingWentWrongError(false)
      }, 3000);
  
}

if(noUserFoundError){
    setTimeout(() => {
        setNoUserFoundError(false)
    }, 3000);
}
   
}, [wrongCredentialError, unauthorizedError, somethingWentWrongError, unverifiedError, noUserFoundError])




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
                   
                  
                   
                    <button className="loginButton" type="submit" >{/* enabled me to disble the cursor when isFething is true */}
                        Login
                        </button>
                </form>
           
                    {unverifiedError &&  <p className='paragraph-text red-text center-text'>Your account is yet to be verified. Check your email to verify your account</p>}
                    {wrongCredentialError &&  <p className='paragraph-text red-text center-text'>Wrong credentials</p>}
                    {unauthorizedError && <p className='paragraph-text red-text center-text'>You're not authorized to use this channel</p>}
                    {somethingWentWrongError &&  <p className='paragraph-text red-text center-text'>Something went wrong</p>}
                    {noUserFoundError &&  <p className='paragraph-text red-text center-text'>No such user found in our database</p>}

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
