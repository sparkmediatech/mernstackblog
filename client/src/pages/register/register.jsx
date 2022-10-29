import './register.css';
import { Link } from 'react-router-dom';
import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import {AuthContext} from '../../context/AuthProvide';
import BASE_URL from '../../hooks/Base_URL'

export default function Register() {
    const [username, setUsername] = useState(""); //here, I declared the usestate and should match with the registeration model object variable coming from your api
    const [email, setUserEmail] = useState("");
    const [password, setUserPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(false);
    const [isfectching, setIsFetching] = useState(false);
    const {dispatch, cursorState} = useContext(AuthContext);

    //error state starts
    const [emailAlreadyExist, setEmailAlreadyExis] = useState(false);
    const [passwordNotMatchError, setPasswordNotMatchError] = useState(false);
    const [passwordPresentError, setPasswordPresentError] = useState(false);
    const [passwordMinError, setPasswordMinError] = useState(false);
    const [emailPresentError, setEmailPresentError] = useState(false);
    const [emailInvalidError, setEmailInvalidError] = useState(false);
    const [passwordInvalidError, setPasswordInvalidError] = useState(false);
    const [somethingWentWrongError, setSomethingWentWrongError] = useState(false);
    const [userNamePresentError,  setUserNamePresentError] = useState(false)
   

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError(false);
        dispatch({type:"CURSOR_NOT_ALLOWED_START"});
     
        try{
               setIsFetching(true)
                
            const response = await axios.post(`${BASE_URL}/auth/register`, {
                username,
                email,
                password,
                confirmPassword 
        });
         
        window.location.replace("/linksent");
        
        } catch(err){
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            if(err.response.data === 'Email already exist'){
                return setEmailAlreadyExis(true)
            }
            if(err.response.data === "Password does not match"){
                return setPasswordNotMatchError(true)
            }
           
        if(err.response.data == 'password must be present'){
            return setPasswordPresentError(true)
        }
        
        if(err.response.data == 'password must not be less than 8 characters'){
            return setPasswordMinError(true)
        }

        if(err.response.data == 'email must be present'){
            return setEmailPresentError(true)
        }

        if(err.response.data == 'your email is not valid'){
            return setEmailInvalidError(true)
        }

        if(err.response.data == 'password must contain at least 1 upper case, lower case, number and special characters'){
            return setPasswordInvalidError(true)
        }

        if(err.response.data == 'something went wrong'){
            return setSomethingWentWrongError(true)
        }

        if(err.response.data == 'username must be present'){
            return setUserNamePresentError(true)
        }
        }        
    }

//useEffect to clear off error messages after some seconds
useEffect(()=>{
if(emailAlreadyExist){
          setTimeout(() => {
        setEmailAlreadyExis(false)
    }, 2000);
    }
  
if(passwordNotMatchError){
     setTimeout(() => {
        setPasswordNotMatchError(false)
    }, 2000);
}

if(passwordPresentError){
    setTimeout(() => {
        setPasswordPresentError(false)
    }, 3000);
}


if(passwordMinError){
    setTimeout(() => {
        setPasswordMinError(false)
    }, 3000);
}

if(emailPresentError){
    setTimeout(() => {
        setEmailPresentError(false)
    }, 3000);
}

if(emailInvalidError){
    setTimeout(() => {
        setEmailInvalidError(false)
    }, 3000);
}

if(passwordInvalidError){
    setTimeout(() => {
        setPasswordInvalidError(false)
    }, 4000);
}

if(somethingWentWrongError){
    setTimeout(() => {
        setSomethingWentWrongError(false)
    }, 3000);
}

if(userNamePresentError){
    setTimeout(() => {
        setUserNamePresentError(false)
    }, 3000);
}
}, [emailAlreadyExist, passwordNotMatchError, passwordPresentError, passwordMinError, emailPresentError, emailInvalidError, passwordInvalidError, somethingWentWrongError, userNamePresentError]);




    return (
        <div className='register'>
            <div className="registerContainer" >
                <span className="text-general-BIG margin-small">Register</span>
                <form className="registerform" onSubmit={handleSubmit}>{/* function to handle submit */}
                    <label className='label-general'>Username</label>
                    <input className='input-general registerInput' type="text" placeholder='Enter your username'
                        onChange={e=>setUsername(e.target.value)}
                    />

                    <label className='label-general'>Email</label>
                    <input className='input-general registerInput' type="email" placeholder='Enter your email' 
                        onChange={e=>setUserEmail(e.target.value)}
                    />

                    <label className='label-general'>Passowrd</label>
                    <input className='input-general registerInput' type="password" placeholder='Enter your password' 
                        onChange={e=>setUserPassword(e.target.value)}
                    />

                     <label className='label-general'>ConfirmPassword</label>
                    <input className='input-general registerInput' type="password" placeholder='Enter your password' 
                        onChange={e=>setConfirmPassword(e.target.value)}
                    />

                     <div className='custom-error-text-div'>
                     {emailAlreadyExist && <p className='paragraph-text red-text custom-error-text'>Email already exist, you can login</p>}
                     {passwordNotMatchError && <p className='paragraph-text red-text custom-error-text '>Password does not match</p>}

                     {passwordPresentError && <p className='paragraph-text red-text custom-error-text'>Password must be present</p>}

                     {passwordMinError && <p className='paragraph-text red-text custom-error-text'>Password must not be less than 8 characters</p>}

                     {emailPresentError && <p className='paragraph-text red-text custom-error-text'>Email must be present</p>}

                     {emailInvalidError && <p className='paragraph-text red-text custom-error-text'>Email is invalid, use a valid email address</p>}

                     {passwordInvalidError && <p className='paragraph-text red-text custom-error-text'>Password must contain at least 1 lower, upper case letters, speacial character and number</p>}

                     {somethingWentWrongError && <p className='paragraph-text red-text custom-error-text'>Something went wrong, refresh page</p>}

                     {userNamePresentError && <p className='paragraph-text red-text custom-error-text'>Username must be provided</p>}
                     </div>

                    <div className='flex'><button type='submit' className="button-general custom-reg-BTN">Register</button></div>
                </form>
                <button className="button-general-2">
                <Link className='link' to='/login'>Login</Link>
                
                </button>
               
            </div>    
        </div>
    )
}
