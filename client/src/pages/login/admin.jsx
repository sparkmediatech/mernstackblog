import './login.css'
import { Link } from 'react-router-dom';
import React, {useRef, useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {AuthContext} from '../../context/AuthProvide';
import {LogContext} from '../../context/LogContext';
import  BASE_URL from '../../hooks/Base_URL'




export default function AdminLogin() {
    const [adminUser, setAdminUser] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const {setAuth, auth, temp, logUser} = useContext(AuthContext);
    const [isFetching, setIsFetching] = useState(false);
    const [notPermittedError, setNotPermittedError] = useState(false);
    const [notVerifiedError, setNotVerifiedError] = useState(false);
    const [wrongCredentialError, setWrongCredetialError] = useState(false);
    const [noUserError, setNoUser] = useState(false);
    const [somethingWentWrongError, setSomethingwentWrongError] = useState(false)

  
   
    
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            const response = await axios.post("/auth/admin", {
                 username: adminUser,
                 password: adminPassword
            });           
            setAuth(response.data)
           
                window.location.replace('/websitesettings') 
        }catch(err){
           if(err.response.data === 'You do not have permission'){
               setNotPermittedError(true)
           };
           if(err.response.data === "Your account is not verified yet"){
                setNotVerifiedError(true)
           };
           if(err.response.data == "Wrong credentials"){
               setWrongCredetialError(true)
           }
           if(err.response.data === 'No user found'){
               setNoUser(true)
           };
           if(err.response.data === 'something went wrong'){
               setSomethingwentWrongError(true)
           }
        }

    }
//useEffect to clear off error messages after some seconds
useEffect(()=>{
    setTimeout(() => {
        setNotPermittedError(false)
    }, 2000);

     setTimeout(() => {
        setNotVerifiedError(false)
    }, 2000);

     setTimeout(() => {
        setWrongCredetialError(false)
    }, 2000);

    setTimeout(() => {
        setNoUser(false)
    }, 2000);

    setTimeout(() => {
        setSomethingwentWrongError(false)
    }, 2000);
}, [notPermittedError, notVerifiedError, wrongCredentialError, noUserError, somethingWentWrongError])


    return (
    <article className='mainWrapper custom-main-wrapper'>
         <div className='mainContainer center-flex-justify-display admin-main-custom-div '>
            <div className={notPermittedError || notVerifiedError || wrongCredentialError || noUserError || somethingWentWrongError ? 'box-div admin-login-custom-div admin-login-custom-div2  ': "box-div admin-login-custom-div"}>
                <h2 className=" text-general-Medium center-text admin-custom-text color1 ">Admin Login</h2>
                <form className="admininform" onSubmit={handleSubmit}>
                    <label className='label'>Username</label>
                    <input className='input-general custom-admin-input' type="text" placeholder='Enter your username'
                       onChange={(e)=> setAdminUser(e.target.value)}
                    />

                    <label className='label custom-admin-input'>Passowrd</label>
                    <input className='input-general custom-admin-input' type="password" placeholder='Enter your password' 
                       onChange={(e)=> setAdminPassword(e.target.value)}  
                    />
                    {notPermittedError && <p className='paragraph-text red-text'>You do not have permission</p>}

                     {notVerifiedError && <p className='paragraph-text red-text'>Your account is not verified yet</p>}

                     {wrongCredentialError && <p className='paragraph-text red-text'>Wrong credentials</p>}

                     {noUserError && <p className='paragraph-text red-text'>No user found</p>}

                     {somethingWentWrongError && <p className='paragraph-text red-text'>Something went wrong</p>}

                    <button className="loginButton" type="submit" disabled={isFetching}>{/* enabled me to disble the cursor when isFething is true */}
                        Login
                        </button>
                </form>
                
            </div>    
        </div>
    </article>
       
    )
}
