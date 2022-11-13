import {React, useContext, useState} from 'react';
import {AuthContext} from '../context/AuthProvide';
import axios from 'axios';
import {Context} from "../context/Context";
import BASE_URL from '../hooks/Base_URL'

const AutoRefreshToken =() => {
    const {token, setToken, auth, setAuth} = useContext(AuthContext);
   


    const refresh = async () =>{

        try{
                
            const response = await axios.post(`/refresh`, {
                 withCredentials: true
             });
                setAuth(response.data);
                return response.data
             
        }catch(err){
            console.log(err)
        }
       
    }
  return refresh
}

export default AutoRefreshToken