import {React, useState, useEffect, useContext } from 'react';
import "./Dashboard.css";
import { Link } from 'react-router-dom';
import {AuthContext} from '../../context/AuthProvide';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {FaHome, FaUserAlt} from 'react-icons/fa';
import {AiOutlineSetting, AiOutlineMenu, AiOutlineMail} from 'react-icons/ai';
import {FiActivity} from 'react-icons/fi';
import {RiPagesLine} from 'react-icons/ri';
import {MdOutlineCancel} from 'react-icons/md';
import { useMediaQuery } from '../../hooks/CustomMediaQuery';
import { useLocation } from 'react-router';


function AdminSidebar() {
const {logUser, auth, dispatch, openAdminSideBar, setOpenAdminSideBar, updateImageState, setUpdateImageState} = useContext(AuthContext);
const PF = "http://localhost:5000/images/";
const [file, setFile] = useState(null);
const [setDashboardEditMode] = useState(false);
let   smallestScreenMode = useMediaQuery('(max-width: 399px)');
const location = useLocation()
const path = location.pathname.split("/")[1];
 



//this closes the admin sidebar
const handleCloseSideBar = ()=>{
  if(openAdminSideBar == 'admin-sidebar-slideIn'){
    return setOpenAdminSideBar('admin-sidebar-slideOut')
  }
}




  return (
    <div className={!updateImageState ? `admin-sidebar flex-2 ${openAdminSideBar}`  : `admin-sidebar admin-sidebar-maxLength  ${openAdminSideBar}`}>
     <div className='custom-sidebar-close-div'><MdOutlineCancel onClick={handleCloseSideBar} className='custom-sidebar-menuClose'/></div>
        <div className='admin-sdiebar-user-details flex-2 center-flex-align-display topMargin-medium'>
          
           <label className='custom-admin-name-custom-label topMargin-medium'>{logUser.username}</label>
          <div className='admin-profeile-pic topMargin-medium'>
           <img className='profile-pics' src={ logUser.profilepicture}></img>
          </div>
           <h3 className='paragraph-text custom-admin-role-text'>Role: {logUser.role}</h3>
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
               
               <Link className='link' to={'/settings'}>
                     <p className={path == 'settings' ? 'settingText color2 settingText-line' : 'settingText'  }>Settings</p>
               </Link>
                  
              
              
             </div>
          </div>
           
            <div className='flex-3 admin-custom-icon-div'>
            <FaUserAlt className='admin-custom-icon-div-icons'/>
             <div >
               <Link className='link' to={`/users/page/${Number(1)}`}>
                  <p  className={path == 'users'? 'settingText color2 settingText-line' : 'settingText' } >Users</p>
               </Link>
                
             </div>
          </div>
          
          

           <div className='flex-3 admin-custom-icon-div'>
            <RiPagesLine className='admin-custom-icon-div-icons'/>
             <div >
               <Link className='link' to={'/pages'}>
                  <p className={path == 'pages' ? 'settingText color2 settingText-line' : 'settingText'} >Pages</p>
               </Link>
              
             </div>
          </div>
          

          <div className='flex-3 admin-custom-icon-div'>
            <AiOutlineMenu className='admin-custom-icon-div-icons'/>
             <div >
               <Link className='link' to={'/menu'}>
                  <p className={path == 'menu' ? 'settingText color2 settingText-line' : 'settingText'} >Menu</p>
               </Link>
              
             </div>
          </div>

       
           <div className='flex-3 admin-custom-icon-div'>
            <AiOutlineMail className='admin-custom-icon-div-icons'/>
             <div >
               <Link className='link' to={'/email-demon'}>
                  <p className={path == 'email-demon' ? 'settingText color2 settingText-line' : 'settingText'} >Email-Demon</p>
               </Link>
              
             </div>
          </div>
        
        </div>
       
       
        
      </div>
  )
}

export default AdminSidebar