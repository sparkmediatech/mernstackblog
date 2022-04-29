import React, {useContext, useEffect, useState} from "react"
import './settings.css';
import Sidebar from '../../components/sidebar/sidebar';
import axios from 'axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {AuthContext} from '../../context/AuthProvide';
import BASE_URL from '../../hooks/Base_URL'

export default function Settings() {
    
     const PF = "http://localhost:5000/images/" // making the image folder publicly visible
     const [file, setFile] = useState(null);
     const [username, setUsername] = useState("");
     const [updated, setUpdated] = useState(false);
     const [userUpdateMode, setUserUpdateMode] = useState(false)
     const {auth, logUser, dispatch, setAuth} = useContext(AuthContext);
     const axiosPrivate = useAxiosPrivate();
    


 
//handle updating user
const handleUpdate = async (e) =>{
      e.preventDefault();

   dispatch({type: "UPDATE_START"})
    const setUser = {
        userId: logUser.userId,
        role: logUser.role,
        username,
    };
    //logic behind uploading image and the image name
    if(file){                    
        const data = new FormData();
        const filename = Date.now() + file.name;
        data.append("name", filename);
        data.append("file", file);
      

      
        try{
        const imageResponse =await axios.post(`${BASE_URL}/upload`, data,);
        const imgUrl = imageResponse.data;
        setUser.profilepicture =imgUrl.url;
        setUpdated(true)
        }catch(err){
            console.log(err)
            dispatch({type: "UPDATE_FAILURE"})
        }
    }

    try{
        
       const response = await axiosPrivate.patch("/v1/users/" + logUser.userId, setUser, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
           })  
           setAuth(response.data)
           window.location.reload()
         setUpdated(true)
    }catch(err){
       console.log(err)
    }
}
//this controls the success notification to timeout after 1 seconds
  useEffect(() => {
      const updatedTimer = setTimeout(() => {
          setUpdated(false)
      }, 1500);
      return () => {
          clearTimeout(updatedTimer)
      }
  }, [updated])

  //handle user delete. This deletes the user's account and all posts associated with the user
const handleDelete = async () =>{

    try{
         
        await axiosPrivate.delete(`/v1/users/${logUser.userId}`, {data: {userId: logUser.userId, role: logUser.role}},  { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}})
            setAuth(null);
            localStorage.removeItem('buf');
            window.location.reload()
    }catch(err){
        console.log(err)
    }
   
}
//handle toggling of userUpdateMode true or false
const handleUserUpdate = () =>{
    setUserUpdateMode(!userUpdateMode)
}

    return (
        <div className='settings'>
            <div className="settingsWrapper">
                <div className="settingsTitle">
                    <span className='text-general-Medium'>Update Your Account</span>
                    <span className='settingsUpdateDelete'onClick={handleDelete}>Delete Your Account</span>
                </div>

              {userUpdateMode ? <button className="button-general" onClick={handleUserUpdate} >Cancel</button> : 
              <button className="button-general user-btn" onClick={handleUserUpdate} >Edit Details</button> }

           

              {userUpdateMode ? 
              
                 <form className={updated ? "settingsform2 settingsform" : "settingsform"} onSubmit={handleUpdate}>
                    <label className="label-general">Profile Picture</label>

                    <div className="settingsProfilePic">
                        <img src={file? URL.createObjectURL(file): logUser.profilepicture} //this line says if there is file loaded into the upload input box, display the file using url.createobjecturl and pass the data.append name used
                        alt="" />

                        <label htmlFor="fileInput">
                            <i className="settingsProfilePicicon far fa-user-circle"></i>
                        </label>
                        <input className='fileUpload2' type="file" id="fileInput" 
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </div>
                    
                    <label className="label-general">Username</label>
                    <input type="text" placeholder={logUser.username} 
                        onChange={(e) => setUsername(e.target.value)}
                    
                    required/>
                   
                    <button className={ updated ? "settingsSubmit2 button-general": "button-general"} type="submit">
                        Update
                        </button>
                         {updated && <h2 className="updated-sucessfully">
                   Updated Succeesfully
               </h2>}
                </form>:

                 <div className="user-details-div">
                     <div className="settingsProfilePic">
                          <label>Profile Picture</label>
                        <img src={logUser.profilepicture} //this line says if there is file loaded into the upload input box, display the file using url.createobjecturl and pass the data.append name used
                        alt="" /></div>

                        <div className="user-detail-container-username"><label className="user">Username</label>
                        <h4>{logUser.username}</h4></div>

            </div>
              
              }
               
            </div>
                
            <Sidebar/>
        </div>
    )
}
