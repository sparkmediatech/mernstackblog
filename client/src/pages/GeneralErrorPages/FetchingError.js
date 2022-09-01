import React, {useContext} from 'react';
import './errorpage.css';
import {BiError} from 'react-icons/bi';
import { Link } from 'react-router-dom';
import {AuthContext} from '../../context/AuthProvide';

function FetchingError() {
   const { setgeneralFetchError} = useContext(AuthContext);

   const handlePageReload = () =>{
    setgeneralFetchError(false);
    window.location.replace('/')
   }
  return (
    <div className='fetchError-custom-div flex-2 center-flex-justify-display center-flex-align-display'>
      
        <BiError className='Icon'/>
     
      <h5 className='color1 text-general-small2'>Something went wrong with fetching resources. 
    Visit home page or contact admin</h5>
   
      <button className='button-general-2' onClick={handlePageReload}>Home</button>
   
    
    </div>
  )
}

export default FetchingError