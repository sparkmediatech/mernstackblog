import React, {useState, useContext, useEffect} from 'react';
import { Link } from 'react-router-dom'
import './usermanager.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {AuthContext} from '../../context/AuthProvide';
import SingleUser from '../singleUser/SingleUser';
import axios from 'axios'
import AdminSidebar from './AdminSidebar';

function Usersmanager(props,) {
    const axiosPrivate = useAxiosPrivate();
    //const {allUsers} = props;
    const setWebsiteDetailPage = props.setWebsiteDetailPage;
    const websiteDetailPage = props.websiteDetailPage;
    const [singleUserStateMode, setSingleUserStateMode] = useState(false)
    const [allUsersState, setAllUsersState] = useState(true);
    const [allUsers, setAllUsers] = useState([]);
    console.log(allUsers)
  
    const {logUser, auth} = useContext(AuthContext);
    const PF = "http://localhost:5000/images/";
   //useEffect to fetch all users

  useEffect(()=>{
 const fetchAllUsers = async () =>{
  
      try{
          const response = await axiosPrivate.post('/v1/users/allusers', { withCredentials: true,
            headers:{authorization: `Bearer ${auth.token}`}});
            console.log(response.data)
          setAllUsers(response.data)
         
      }catch(err){

      }
 }
 return fetchAllUsers()
}, [])

  


 return (
     <>
        <article className='users-manager-custom-div '>

            <div className=" admin-dashboard-custom-container flex-3">

                < AdminSidebar/>

                <div className='other-pages '>
                    {allUsersState && <h2 className='text-general-Medium topMargin-medium'>Users</h2>
            } 
                         {
        allUsersState &&
          <div className='flex-2 center-flex-align-display custom-users-dashboard-div ' >
               
            
               
                <div className='flex-3 users-title-container '>
                 <div className='name-div'><h4 className='text-general-small color1'>NAME</h4></div>
                <div className='role-div'><h4 className='text-general-small color1'>ROLE</h4></div>
                <div className='verified-div'><h4 className='text-general-small color1'>VERIFIED</h4></div>
                <div className='blocked-div'><h4 className='text-general-small color1'>BLOCKED</h4></div>
            </div>
               

            
            { allUsers.map((singleUser, index)=>{
                const {username, profilePicture, isBlocked, isVerified, email, role, _id: userId} = singleUser
                console.log(singleUser)
                return(
                    <>
                       <div className='displayUser-div-container flex-3' key={index}>

                           <div className='flex-3 users-custom-name-container  '>
                               <div className='userImg-div'>
                                   <img className='users-img' src={profilePicture} alt="" />

                               </div>
                                    <div className='users-detail-container '>
                                        
                                        <Link className='text-general-small color1 custom-paragrap-text link' to={`/users/${userId}`}>
                                             {username}
                                        </Link>
                                           
                                            <p className='text-general-small color1'>{email}</p>
                                        
                                            
                                    </div>
                               
                              
                            </div>

                            <div className='users-role-custom-div center-flex-align-display'>
                                <p  className='text-general-small color1'>{role}</p>
                            </div>

                          <div className='users-verified-custom-div center-flex-align-display'>
                               {isVerified == true ? <p className='text-general-small color1'>YES</p >: <p className='text-general-small color1'>NO</p>} 
                            </div>

                            <div className='users-isBlocked-custom-div center-flex-align-display'>
                                {isBlocked == false ? <p className='text-general-small color1'>NO</p>: <p className='text-general-small color1'>YES</p>}
                            </div>
                       </div>
                    
                    </>
                )
                })}
            
        
        </div>
      }
   
       

                 </div>    
           </div>
         
          
    
     
     </article>
     </>
     
  
 )
}

export default Usersmanager
