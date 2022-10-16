import axios from 'axios';
import {React, useState, useEffect, useContext } from 'react';
import "./Dashboard.css";
import { Link } from 'react-router-dom';
import {AuthContext} from '../../context/AuthProvide';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {FaHome, FaUserAlt} from 'react-icons/fa';
import {AiOutlineSetting} from 'react-icons/ai';
import {FiActivity} from 'react-icons/fi';
import Usersmanager from './Usersmanager';
import SingleUser from '../singleUser/SingleUser';
import WebsiteSettings from './WebsiteSettings';
import AdminSidebar from './AdminSidebar';




export default function Dashboard() {
  const axiosPrivate = useAxiosPrivate();
  const {logUser, auth, websiteSettingsState} = useContext(AuthContext)
  const PF = "http://localhost:5000/images/";
  const [updating, setUpdating] = useState(false)
  const [textUpdate, setTextUpdate] = useState(false);
 

 
  
  const [singleUserState, setSingleUserState] = useState(false);
 


  

  



  





//useEffect to cancel textupdate state
 useEffect(() => {
      const updatedTimer = setTimeout(() => {
          setTextUpdate(false)
      }, 2000);
      return () => {
          clearTimeout(updatedTimer)
      }
  }, [textUpdate])



 //sidebar page
 return (
   <>
   <article className='dashboard-container'>
       <div className=" admin-dashboard-custom-container flex-3">
       
      <div className='custom-admin-sidebar-main-div'>< AdminSidebar /></div>

   <div className='other-pages '>
      <WebsiteSettings/>

 </div>    
  </div>
   </article>
 
  
  
   </>
 )
}
