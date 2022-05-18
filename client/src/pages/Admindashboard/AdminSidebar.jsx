import {React, useState, useEffect, useContext } from 'react';
import "./Dashboard.css";
import { Link } from 'react-router-dom';
import {AuthContext} from '../../context/AuthProvide';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {FaHome, FaUserAlt} from 'react-icons/fa';
import {AiOutlineSetting} from 'react-icons/ai';
import {FiActivity} from 'react-icons/fi';
import {RiPagesLine} from 'react-icons/ri'


function AdminSidebar() {
const {logUser, auth, dispatch} = useContext(AuthContext);
const PF = "http://localhost:5000/images/";
const [file, setFile] = useState(null);
const [setDashboardEditMode] = useState(false);
 


  return (
    <div className='admin-sidebar flex-2'>
        <div className='admin-sdiebar-user-details flex-2 center-flex-align-display'>
           <label className='custom-label topMargin-medium'>{logUser.username}</label>
          <div className='admin-profeile-pic topMargin-medium'>
           <img className='profile-pics' src={ logUser.profilepicture}></img>
          </div>
           <h3 className='paragraph-text'>Role: {logUser.role}</h3>
        </div>

        <div className='admin-sidebar-component topMargin-medium'>
          <div className='flex-3 admin-custom-icon-div '>
            <FaHome className='admin-custom-icon-div-icons'/>
             <div >
                <Link className='link' to={'/'}>
                  <p className='settingText'>Home</p>
                </Link>
             </div>
          </div>
          
            <div className='flex-3 admin-custom-icon-div'>
            <AiOutlineSetting className='admin-custom-icon-div-icons'/>
             <div >
               
               <Link className='link' to={'/websitesettings'}>
                     <p className='settingText' >Settings</p>
               </Link>
                  
              
              
             </div>
          </div>
           
            <div className='flex-3 admin-custom-icon-div'>
            <FaUserAlt className='admin-custom-icon-div-icons'/>
             <div >
               <Link className='link' to={'/usersdashboard'}>
                  <p  className='settingText' >Users</p>
               </Link>
                
             </div>
          </div>
          
          <div className='flex-3 admin-custom-icon-div'>
            <FiActivity className='admin-custom-icon-div-icons'/>
             <div >
                 <p className='settingText' >Activities</p>
             </div>
          </div>

           <div className='flex-3 admin-custom-icon-div'>
            <RiPagesLine className='admin-custom-icon-div-icons'/>
             <div >
               <Link className='link' to={'/pagesettings'}>
                  <p className='settingText' >Pages</p>
               </Link>
                 
             </div>
          </div>
          
        </div>
       
        
      </div>
  )
}

export default AdminSidebar