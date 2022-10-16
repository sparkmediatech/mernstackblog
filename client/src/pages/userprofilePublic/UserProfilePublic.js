import React , {useContext, useEffect, useState} from 'react';
import './userProfilePublic.css';
import { useLocation } from 'react-router';
import axios from 'axios';
import  BASE_URL from '../../hooks/Base_URL';
import {MdReportGmailerrorred} from 'react-icons/md';
import { Link } from 'react-router-dom';
import {AuthContext} from '../../context/AuthProvide';


function UserProfilePublic() {
      
     const location = useLocation()
     const path = location.pathname.split("/")[2];
    const [user,  setUser] = useState({});
    const [isFetch, setIsFetch] = useState(false);
     const {setgeneralFetchError} = useContext(AuthContext);


    //error states
    const [userNotFoundError, setUserNotFoundError] = useState(false);

//fetch user
useEffect(()=>{
 const ourRequest = axios.CancelToken.source() 
  
  const fetchSingleUser = async () =>{
       try{
           const response = await axios.get(`/users/singleUser/${path}`, {cancelToken: ourRequest.token})
          
      
            setUser(response.data);
       }catch(err){
        if(err.response.data == 'user not found with this ID'){
          setUserNotFoundError(true)
        }
      if(err.response.data == 'something went wrong with finding user'){
        return setgeneralFetchError(true)
       }
    
       }
      
   
    }

    
    fetchSingleUser()

       return () => {
    ourRequest.cancel() // <-- 3rd step
  }
      
    
}, [])









  return (
    <div className='userProfile-custom-div '>
        {userNotFoundError && <div className='custom-no-user-found-div flex-2 center-flex-justify-display center-flex-align-display'>
          <MdReportGmailerrorred className='custom-no-user-found-icon'/>
          
          <p className='paragraph-text red-text center-text'>No user found</p>
          <button className='button-general-2'><Link to={'/'} className='link'></Link> Home</button>
          
          </div>
          }
        
        {!userNotFoundError &&
          <div className='mainContainer custom-main-userProfile-div flex-3'>
        
           
            <div className='user-profile-pics-div topMargin-Extral-Large'>
                <img className='custom-user-profile-pics' src={user.profilePicture} alt="" />
            </div>

            <div className='flex-2 custom-user-detail-wrapper topMargin'>
                 <p className='text-general-Medium color3 marginLeft-sm margin-small custom-userProfile-titleText'>User Profile</p>
                   <div className='custom-user-details-div margin-small'>
                        <p className='text-general-small color1 margin-small marginLeft-sm'>NAME: {user?.username?.toUpperCase()}</p>
                        <p className='text-general-small color1 margin-small-small marginLeft-sm'>JOINED:  {new Date(user?.createdAt).toDateString().toUpperCase()}</p>
                        <p className='text-general-small color1 margin-small-small marginLeft-sm'>POST COUNT: {user?.userPosts?.length}</p>
                        <p className='text-general-small color1 margin-small-small marginLeft-sm'>COMMENT COUNT: {user?.usercomments?.length}</p>
                        <p className='text-general-small color1 margin-small-small marginLeft-sm'>USER LIKED: {user?.userLikes?.length} POSTS</p>
                        <p className='text-general-small color1 margin-small-small marginLeft-sm'>USER FOLLOWERS: {user?.following?.length}</p>

                         <p className='color1 text-general-small topMargin-medium marginLeft-sm '>ABOUT {user?.username?.toUpperCase()}</p>
                          <p className='margin-small color1 text-general-small marginLeft-sm custom-aboutUser-text'>{user?.aboutUser}</p>
                   </div>

                  
                </div>

        </div>
        }
    
    </div>
  )
}

export default UserProfilePublic