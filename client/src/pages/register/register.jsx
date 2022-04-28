import './register.css';
import { Link } from 'react-router-dom';
import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import {AuthContext} from '../../context/AuthProvide';

export default function Register() {
    const [username, setUsername] = useState(""); //here, I declared the usestate and should match with the registeration model object variable coming from your api
    const [email, setUserEmail] = useState("");
    const [password, setUserPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(false);
    const [isfectching, setIsFetching] = useState(false);
    const {dispatch, cursorState} = useContext(AuthContext);
    const [emailAlreadyExist, setEmailAlreadyExis] = useState(false);
    const [passwordNotMatchError, setPasswordNotMatchError] = useState(false)
   

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError(false);
        dispatch({type:"CURSOR_NOT_ALLOWED_START"});
     
        try{
               setIsFetching(true)
                
            const response = await axios.post("/auth/register", {
                username,
                email,
                password,
                confirmPassword 
        });
         
        dispatch({type:"REG_SUCCESS", payload: response.data});
        localStorage.removeItem('buf');
        window.location.replace("/linksent");
        
        } catch(err){
            if(err.response.data === 'Email already exist'){
                setEmailAlreadyExis(true)
            }
            if(err.response.data === "Password does not match"){
                setPasswordNotMatchError(true)
            }
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});

            console.log(err)
        }        
    }

//useEffect to clear off error messages after some seconds
useEffect(()=>{
    setTimeout(() => {
        setEmailAlreadyExis(false)
    }, 2000);

     setTimeout(() => {
        setPasswordNotMatchError(false)
    }, 2000);

}, [emailAlreadyExist, passwordNotMatchError])

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

                     {emailAlreadyExist && <p className='paragraph-text red-text '>Email already exist, you can login</p>}
                     {passwordNotMatchError && <p className='paragraph-text red-text '>Password does not match</p>}

                    <button type='submit' className="button-general">Register</button>
                </form>
                <button className="button-general-2">
                <Link className='link' to='/login'>Login</Link>
                
                </button>
               
            </div>    
        </div>
    )
}
