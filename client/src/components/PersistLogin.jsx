import {React, useContext, useEffect, useState} from 'react';
import {AuthContext} from '../context/AuthProvide';
import axios from 'axios';
import {Context} from "../context/Context";
import AutoRefreshToken from '../hooks/AutoRefreshToken'

const PersistLogin =() => {
    const token = AutoRefreshToken()
    const {setAuth, auth} = useContext(AuthContext);



    const refresh = async () =>{
       useEffect =( async ()=>{
            await token()
       }, [])
       
    }
  return refresh
}

export default PersistLogin