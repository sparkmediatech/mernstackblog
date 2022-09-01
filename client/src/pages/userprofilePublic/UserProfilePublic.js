import React , {useContext, useEffect, useState} from 'react';
import './userProfilePublic.css';
import { useLocation } from 'react-router';
import axios from 'axios';
import  BASE_URL from '../../hooks/Base_URL';


function UserProfilePublic() {
     const location = useLocation()
     const path = location.pathname.split("/")[2];
    const [user,  setUser] = useState({})

//fetch user
useEffect(()=>{
    const fetchSingleUser = async () =>{
        const response = await axios.get(`/users/singleUser/${path}`)
        setUser(response.data)
    }

    fetchSingleUser()
}, [path])

console.log(user)

  return (
    <div className='userProfile-custom-div topMargin-Extral-Large'>
        <div className='mainContainer custom-main-userProfile-div flex-3'>
           
            <div className='user-profile-pics-div topMargin-Extral-Large'>
                <img className='custom-user-profile-pics' src={user.profilePicture} alt="" />
            </div>

            <div className='flex-2 custom-user-detail-div topMargin'>
                 <p className='text-general-Medium color3 marginLeft-sm margin-small'>User Profile</p>
                   <div className='custom-user-details-div'>
                        <p className='text-general-small color1 topMargin marginLeft-sm'>NAME: {user?.username?.toUpperCase()}</p>
                        <p className='text-general-small color1 margin-small-small marginLeft-sm'>JOINED:  {new Date(user?.createdAt).toDateString().toUpperCase()}</p>
                        <p className='text-general-small color1 margin-small-small marginLeft-sm'>POST COUNT: {user?.userPosts?.length}</p>
                        <p className='text-general-small color1 margin-small-small marginLeft-sm'>COMMENT COUNT: {user?.usercomments?.length}</p>
                        <p className='text-general-small color1 margin-small-small marginLeft-sm'>USER LIKED: {user?.userLikes?.length} POSTS</p>
                        <p className='text-general-small color1 margin-small-small marginLeft-sm'>USER FOLLOWERS: {user?.following?.length}</p>

                         <p className='color3 text-general-small topMargin-medium marginLeft-sm'>ABOUT USER</p>
                          <p className='margin-small color1 text-general-small marginLeft-sm'>{user?.aboutUser}</p>
                   </div>

                  
                </div>

        </div>
    
    </div>
  )
}

export default UserProfilePublic