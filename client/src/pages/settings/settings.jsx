import React, {useContext, useEffect, useState} from "react"
import './settings.css';
import Sidebar from '../../components/sidebar/sidebar';
import axios from 'axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {AuthContext} from '../../context/AuthProvide';
import BASE_URL from '../../hooks/Base_URL';
import {MdCancel} from 'react-icons/md';
import {FiEdit,} from 'react-icons/fi';
import {AiFillDelete} from 'react-icons/ai';
import {MdOutlineManageAccounts} from 'react-icons/md';
import Settingsidebar from "../../components/SettingSidebar/Settingsidebar";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";


export default function Settings() {
    
     const PF = "http://localhost:5000/images/" // making the image folder publicly visible
     const [file, setFile] = useState("");
     const [username, setUsername] = useState("");
     const [updated, setUpdated] = useState(false);
     const [userUpdateMode, setUserUpdateMode] = useState(false)
     const {auth, logUser, dispatch, setAuth} = useContext(AuthContext);
     const axiosPrivate = useAxiosPrivate();
     const [editImageMode, setEditImageMode] = useState(false);
     const [aboutUser, setAboutUser] = useState('');
     const [aboutUserState, setAboutUserState] = useState(false);
     //error states start here
     const [aboutUserUpdateMaxError, setAboutUserUpdateMaxError] = useState(false);
     const [usernameEmptyError, setUsernameEmptyError] = useState(false);
     const [aboutUserUpdateMinError, setAboutUserUpdateMinError] = useState(false);
     const [unAuthorizedUserError, setUnAuthorizedUserError] = useState(false);
     const [somethingWentWrongError, setSomethingWentWrongError] = useState(false);
     const [aboutUserSectionEmptyError, setAboutUserSectionEmptyError] = useState(false);
     const [userNotVerifiedError, setUserNotVerifiedError] = useState(false);
     const [noUserFoundError, setNoUserFoundError] = useState(false)
    


 
//handle updating user
const handleUpdate = async (e) =>{
      e.preventDefault();
    dispatch({type:"CURSOR_NOT_ALLOWED_START"});         
        const data = new FormData();
        const filename = Date.now() + file.name;
        data.append("name", filename);
        data.append("file", file);
        data.append("userId", logUser.userId);
        data.append('role', logUser.role);
        data.append('username', username);
        data.append("aboutUser", aboutUser);

    try{
            const response = await axiosPrivate.patch(`${BASE_URL}/users/${logUser.userId}`, data, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
           })  
           setAuth(response.data)
           window.location.reload()
            
    }catch(err){
        dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
       if(err.response.data === "about section must not be more than 1000 words"){
            setAboutUserUpdateMaxError(true);
        }
        if(err.response.data == 'username can not be empty'){
            setUsernameEmptyError(true)
        }
        if(err.response.data == 'about user section must not be less than 45 words'){
            return setAboutUserUpdateMinError(true)
        }
        if(err.response.data == "You can only update your account!"){
            return setUnAuthorizedUserError(true)
        }
        if(err.response.data == "Something went wrong, try again"){
            return setSomethingWentWrongError(true)
        }
        if(err.response.data == 'about user section must not be empty'){
            return setAboutUserSectionEmptyError(true)
        }
        if(err.response.data == 'You are not authorized from updating your profile'){
            return setUserNotVerifiedError(true)
        }
        if(err.response.data == 'No user found'){
            return setNoUserFoundError(true)
        }
    }
}

useEffect(()=>{
    setAboutUser(logUser.aboutUser)
}, [aboutUserState])


//this controls notification to timeout after some seconds
useEffect(() => {
if(updated){
         setTimeout(() => {
        setUpdated(false)
    }, 2000);
    }
     
if(aboutUserUpdateMaxError){
    setTimeout(() => {
        setAboutUserUpdateMaxError(false)
    }, 2000);

}

if(usernameEmptyError){
 setTimeout(() => {
        setUsernameEmptyError(false)
    }, 2000);
}
   
if(aboutUserUpdateMinError){
 setTimeout(() => {
        setAboutUserUpdateMinError(false)
    }, 2000);

}

if(unAuthorizedUserError){
setTimeout(() => {
    setUnAuthorizedUserError(false)
}, 2000);
}

if(somethingWentWrongError){
 setTimeout(() => {
    setSomethingWentWrongError(false)
}, 2000);
}

if(aboutUserSectionEmptyError){
setTimeout(() => {
    setAboutUserSectionEmptyError(false)
}, 2000);
}   

if(userNotVerifiedError){
 setTimeout(() => {
    setUserNotVerifiedError(false)
}, 2000);
}    

if(noUserFoundError){
 setTimeout(() => {
      setNoUserFoundError(false)
    }, 2000);
}    

    
  }, [updated, aboutUserUpdateMaxError, usernameEmptyError, aboutUserUpdateMinError, unAuthorizedUserError,
    somethingWentWrongError, aboutUserSectionEmptyError, userNotVerifiedError, noUserFoundError
    ])

  //handle user delete. This deletes the user's account and all posts associated with the user
const handleDelete = async () =>{
    dispatch({type:"CURSOR_NOT_ALLOWED_START"}); 
    try{
         
        await axiosPrivate.delete(`${BASE_URL}/users/${logUser.userId}`, {data: {userId: logUser.userId, role: logUser.role}},  { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}})
            setAuth(null);
            localStorage.removeItem('buf');
            window.location.reload()
             dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
    }catch(err){
         dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
       
    }
   
}
//handle toggling of userUpdateMode true or false
const handleUserUpdate = () =>{
    setUserUpdateMode(!userUpdateMode)
    setAboutUserState(false)
    setEditImageMode(false)
}


//handle user about state
const handleUserAboutUpdateState = ()=> {
    setAboutUserState(!aboutUserState)
}




    return (

        <>
        <div className="mainWrapper custom-setting-wrapper flex-3 ">
            <div className="custom-setting-container flex-3 ">
                
                <div className="settingsProfilePic  flex-3 topMargin-Extral-Large">
                   
                   <div className="flex-2 custom-user-image-sub-div">
                     {editImageMode &&
                                <div className="edit-image-input-custom-div">
                                    <label htmlFor="fileInput">
                                
                                    <i className="settingsProfilePicicon far fa-user-circle "></i>
                                    </label>
                                        <input className='fileUpload2 ' type="file" id="fileInput" 
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                </div>
                           }
                            <img src={file && editImageMode ? URL.createObjectURL(file): logUser.profilepicture} 
                        alt="" />
                   </div>
                     
                 
                {!editImageMode && userUpdateMode && <FiEdit className="custom-edit-icon mousePointer-click-general custom-edit-icon-2 "   onClick={() => setEditImageMode(true)}/>}
                {editImageMode && userUpdateMode &&  <MdCancel className="custom-edit-icon mousePointer-click-general custom-edit-icon-2" onClick={() => setEditImageMode(false)}/>}
                </div>

                <div className="custom-user-data-div topMargin flex-2 flex-2">
                    <h4 className="text-general-Medium custom-update-acct-text">Update Your Account</h4>

                       
                        <div className="topMargin-medium flex-2"><label className="text-general-small2 custom-update-titleText">Username</label>
                            {!userUpdateMode ? <label className="text-general-small2 margin-small custom-update-titleText ">{logUser.username}</label>:

                             <input className="margin-small input-general custom-username-input color1 " type="text" placeholder={logUser.username} 
                            onChange={(e) => setUsername(e.target.value)}
                            required/>
                          }
                        </div>
                       {usernameEmptyError && <p className='paragraph-text red-text custom-error-text'>User name can not be empty</p> }
                    
                   
                      
                    
                    {!userUpdateMode && 
                    <>
                            <div className="margin-small "><label className="text-general-small2 custom-update-titleText">About User</label></div>
                                <div className="about-user-div ">
                               <p className="text-general-small color1 margin-small custom-update-about-text">{logUser.aboutUser}</p>
                            </div>
                      </> 
                    }
                       
                     {!aboutUserState && userUpdateMode && 
                        <>
                            <div className="topMargin-medium "><label className="text-general-small2 custom-update-titleText">About User</label></div>
                                <div className="about-user-div edit-user-details-custom-icon flex-3">
                                <div className="custom-edit-paragraph-tag"><p className="text-general-small color1 margin-small">{logUser.aboutUser}</p></div>
                                <FiEdit className="custom-edit-icon mousePointer-click-general"  onClick={handleUserAboutUpdateState}/>
                            </div>
                      </> 
                    }
                           
                        
                    {
                        userUpdateMode &&

                             <div className="flex-3 topMargin-medium ">
                               
                              {aboutUserState &&
                                <>
                                    <label className="text-general-small2 custom-update-titleText">About User</label>
                                    <div className="custom-edit-textbox-tag-div">
                                            <textarea 
                                            placeholder='About you...' 
                                            type='text' 
                                            className='custom-edit-about-user-textbox color1'
                                            onChange={e => setAboutUser(e.target.value)}
                                            value={aboutUser}
                                        >
                                        </textarea>
                                </div>
                                </>
                                }
                                 {aboutUserState &&

                             <div >
                                 <MdCancel className="custom-edit-icon mousePointer-click-general margin-left-sm1" onClick={handleUserAboutUpdateState}/>
                             </div>

                            
                               
                            }
                                {aboutUserUpdateMaxError && <p className='paragraph-text red-text custom-error-text'>About user section should not be more than 1000 words</p>}
                                {aboutUserUpdateMinError && <p className='paragraph-text red-text custom-error-text'>About user section should not be less than 45 words</p>}
                                {unAuthorizedUserError && <p className='paragraph-text red-text custom-error-text'>You're not permitted to carry out this action</p>}
                                {somethingWentWrongError && <p className='paragraph-text red-text custom-error-text'>something went wrong, contact support</p>}
                                {aboutUserSectionEmptyError && <p className='paragraph-text red-text custom-error-text'>About user section must not be empty</p>}
                                {aboutUserSectionEmptyError && <p className='paragraph-text red-text custom-error-text'>You need to verify your account</p>}
                                {noUserFoundError && <p className='paragraph-text red-text custom-error-text'>No user found</p>}
                            
                         </div>
                        }
                        
                        
                    
                        

                        <div className="topMargin-medium  "><label className="text-general-small2 custom-update-titleText">Settings</label></div>

                        {
                            !userUpdateMode ? 
                            <div className="topMargin-medium flex-3 center-flex-align-display" onClick={handleUserUpdate}> 
                            
                            <FiEdit className="custom-edit-icon mousePointer-click-general"/><label className="text-general-small2 margin-left-sm1 mousePointer-click-general custom-update-titleText">Edit User Details</label>
                            
                        </div> :
                        <div className="topMargin-medium flex-3 center-flex-align-display" onClick={handleUserUpdate}>
                            <MdCancel  className="custom-edit-icon mousePointer-click-general"/><label className="text-general-small2 margin-left-sm1 mousePointer-click-general custom-update-titleText">Cancel Edit</label>
                        </div>
                        }
                        
                      {
                        !userUpdateMode && 
                        <div >
                            <div className="flex-3 center-flex-align-display margin-small"><AiFillDelete  className="custom-edit-icon"/><label onClick={handleDelete} className="text-general-small2 margin-left-sm1 mousePointer-click-general custom-update-titleText">Delete Account</label></div>
                            <Link to={`/usersposts/${logUser?.userId}/${Number(1)}`} className='link'>
                                 <div className="flex-3 center-flex-align-display margin-small"><MdOutlineManageAccounts  className="custom-edit-icon"/><label className="text-general-small2 margin-left-sm1 mousePointer-click-general custom-update-titleText">Manage Posts</label></div>
                            </Link>
                           
                        </div>
                      }
                   {userUpdateMode && <div className="custom-updateBTN-div flex"><button className={ updated ? "settingsSubmit2 button-general custom-update-BTN": "button-general custom-update-BTN"} type="button" onClick={handleUpdate}>
                        Update
                        </button></div> }
                </div>
                
            </div>
             <Settingsidebar/>
        </div>
  
</>
    )
}
