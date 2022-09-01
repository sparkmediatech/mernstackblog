import React from 'react'
import react, { useState, useEffect, useContext } from 'react';
import './settingsidebar.css';
import { Link } from 'react-router-dom';
import {AuthContext} from '../../context/AuthProvide';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';




function Settingsidebar() {
    const {auth, logUser, dispatch, setAuth, authorDetails} = useContext(AuthContext);
    const [singleUser, setSingleUser] = useState();
    const axiosPrivate = useAxiosPrivate();
   
  
   console.log(logUser)

   //get this user through user login Id

   useEffect(()=>{
        const getSingleUser = async () =>{
            const userId = logUser.userId

           
                 try{
               const res = await axiosPrivate.get(`/v1/users/userOwner/${userId}`,{ withCredentials: true,
                headers:{authorization: `Bearer ${auth.token}`}})
                setSingleUser(res.data);
                
                console.log(res.data)
            }catch(err){

            }
       
           
           
        }
       return getSingleUser()
    
}, [logUser?.userId])

 
console.log(singleUser)

  return (
    
         <div className='sidebar topMargin-Extral-Large'>
            <div className='sidebarItem custom-sidebar-item'>
                <p className='sidebarTitle text-general-small color1'>USER LOG DETAILS</p>
               
                <p className='text-general-small color1 margin-small'>Name: {singleUser?.username.toUpperCase()}</p>
                <p className='text-general-small  color1'>JOINED : {new Date(singleUser?.createdAt).toDateString().toUpperCase()}</p>
                 <p className='text-general-small color1 '>POST COUNT : {singleUser?.userPosts.length}</p>
                <div className='flex-3'><p className='text-general-small color1 '>BLOCKED :</p>{singleUser?.isBlocked === true ?  <p className='text-general-small color1 '>TRUE</p>:  <p className='text-general-small color1 '>FALSE</p>}</div>
                <p className='text-general-small color1 '>POST LIKES : {singleUser?.userLikes.length}</p>
                 <p className='text-general-small color1 '>COMMENT COUNT : {singleUser?.usercomments.length}</p>
                 {singleUser?.isBlocked == true && <p>{new Date(singleUser?.expDate).toString().toUpperCase()}</p>}
                <p className='text-general-small color1 '>FOLLOWING : {singleUser?.following.length}</p>
                
            </div>

           

            <div className='sidebarItem margin-small'>
                <p className='sidebarTitle text-general-small color1'>SOCIAL PLATFORMS</p>
                <div className='sidebarSocial'>
                    <i className="sidebaricon fab fa-facebook-square"></i>
                    <i className="sidebaricon fab fa-twitter-square"></i>
                    <i className="sidebaricon fab fa-pinterest-square"></i>
                    <i className="sidebaricon fab fa-instagram-square"></i>
                </div>
            </div>

        </div>
    
  )
}

export default Settingsidebar