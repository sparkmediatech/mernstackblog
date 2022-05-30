import React, {useContext, useEffect, useState} from "react"
import './settings.css';
import Sidebar from '../../components/sidebar/sidebar';
import axios from 'axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {AuthContext} from '../../context/AuthProvide';
import BASE_URL from '../../hooks/Base_URL';
import {MdCancel} from 'react-icons/md';
import {FiEdit} from 'react-icons/fi'

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
     const [aboutUserUpdateError1, setAboutUserUpdateError1] = useState(false)
    


 
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
            const response = await axiosPrivate.patch("/v1/users/" + logUser.userId, data, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
           })  
           setAuth(response.data)
           window.location.reload()
            
    }catch(err){
        dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
       if(err.response.data === "about section must not be more than 400 words"){
            setAboutUserUpdateError1(true) 
        }
    }
}

//this controls notification to timeout after some seconds
  useEffect(() => {
      setTimeout(() => {
        setUpdated(false)
    }, 2000);

       setTimeout(() => {
        setAboutUserUpdateError1(false)
    }, 2000);
  }, [updated, aboutUserUpdateError1])

  //handle user delete. This deletes the user's account and all posts associated with the user
const handleDelete = async () =>{
    dispatch({type:"CURSOR_NOT_ALLOWED_START"}); 
    try{
         
        await axiosPrivate.delete(`/v1/users/${logUser.userId}`, {data: {userId: logUser.userId, role: logUser.role}},  { withCredentials: true,
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
}
//handle delete all posts by the owner

const handleDeleteAllPosts = async ()=>{
    const username = {
        username: logUser.userId
    }
    try{
        dispatch({type:"CURSOR_NOT_ALLOWED_START"}); 
        await axiosPrivate.post(`/v1/posts/deleteall`,   { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}});
             dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
    }catch(err){
         dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
    }
};

//handle user about state
const handleUserAboutUpdateState = ()=> {
    setAboutUserState(!aboutUserState)
}
    return (

        <>
        
    <div className='settings'>
        <div className="settingsWrapper">
                <div className="settingsTitle">
                    <span className='text-general-Medium'>Update Your Account</span>
                    <div className="delete-div flex flex-2">
                        <span className='settingsUpdateDelete'onClick={handleDelete}>Delete Your Account</span>
                        <p onClick={handleDeleteAllPosts} className="delete-All-Posts margin-small text-general-small red-text">Delete All Your Posts</p>
                        <button className="button-general margin-small">Manage Your Posts</button>
                    </div>
                    
                </div>
                

              {userUpdateMode ? <MdCancel  className="cancel-custom-btn" onClick={handleUserUpdate}/>: 
              <button className="button-general-2 user-btn" onClick={handleUserUpdate} >Edit Details</button> }

           

              
             <form className='writeForm' onSubmit={handleUpdate}>   
               {userUpdateMode && <label className="label-general">Profile Picture</label>} 

                        <div className="flex-3">
                           {userUpdateMode &&
                                <div className="settingsProfilePic">
                               <img src={file && editImageMode ? URL.createObjectURL(file): logUser.profilepicture}
                                alt="" />  
                            </div>
                           }
                       
                           {editImageMode &&
                                <div className="edit-image-input-custom-div">
                                <label htmlFor="fileInput">
                                
                                <i className="settingsProfilePicicon far fa-user-circle"></i>
                                </label>
                                    <input className='fileUpload2' type="file" id="fileInput" 
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                            </div>
                           }
                        </div>
                           
                {!editImageMode && userUpdateMode && <button onClick={() => setEditImageMode(true)} className="button-general-2 custom-edit-image-BTN">Change Image</button>}
                {editImageMode && userUpdateMode && <button onClick={() => setEditImageMode(false)} className="button-general-2 custom-edit-image-BTN">Cancel</button>}
                {userUpdateMode &&
                <div className={updated ? "settingsform2 settingsform" : "settingsform"} >
                        
                    
                    <label className="label-general">Username</label>
                    <input type="text" placeholder={logUser.username} 
                        onChange={(e) => setUsername(e.target.value)}
                    
                    required/>
                     <div className="margin-small"><label className="label-general about-user-custom-label">About User</label></div>
                  
                          {!aboutUserState &&
                              <div className="about-user-div custom-about-user-text-div margin-small ">
                               <p className="text-general-small color1 custom-about-user-text">{logUser.aboutUser}</p>
                           </div>
                          }
                           
                        
                    
                         <div className="flex-2">
                              {aboutUserState &&
                                <textarea 
                                    placeholder='About you...' 
                                    type='text' 
                                    className='custom-about-user-textbox'
                                    onChange={e => setAboutUser(e.target.value)}
                                >


                                </textarea>
                                }

                                {aboutUserUpdateError1 && <p>About user section should not be more than 400 words</p>}
                             {!aboutUserState?
                                 <button type="button" onClick={handleUserAboutUpdateState} className="button-general-2 about-user-custom-BTN">Edit About User</button>:
                                <button type="button" onClick={handleUserAboutUpdateState} className="button-general-2 about-user-custom-BTN">Cancel Edit</button>
                            }
                         </div>
                        
                       
                    
                   
                    <button className={ updated ? "settingsSubmit2 button-general": "button-general"} type="submit">
                        Update
                        </button>
                         {updated && 
                            <h2 className="updated-sucessfully">
                                Updated Succeesfully
                            </h2>}
                        </div>
                }
            </form> 
                   { !userUpdateMode &&

                       <div className="user-details-div">
                        <div className="settingsProfilePic">
                          <label>Profile Picture</label>
                        <img src={logUser.profilepicture} //this line says if there is file loaded into the upload input box, display the file using url.createobjecturl and pass the data.append name used
                        alt="" /></div>

                        <div className="user-detail-container-username"><label className="user">Username</label>
                        <h4>{logUser.username}</h4></div>

                         <div className="margin-small"><label className="label-general about-user-custom-label">About User</label></div>
                         <div className="about-user-div custom-about-user-text-div margin-small">
                               <p className="text-general-small color1 custom-about-user-text">{logUser.aboutUser}</p>
                           </div>
                    </div>
                   } 
              
              
               
        </div>
                
            <Sidebar/>
    </div>
</>
    )
}
