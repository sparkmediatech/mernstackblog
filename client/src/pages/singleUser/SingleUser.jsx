import React, {useContext, useState, useEffect, useRef} from 'react'
import './singleuser.css';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {AuthContext} from '../../context/AuthProvide';
import AdminSidebar from '../Admindashboard/AdminSidebar';
import { useLocation } from 'react-router';



function SingleUser(props ) {
    const location = useLocation()
    const path = location.pathname.split("/")[2];
    const [singleUser, setSingleUser] = useState();
    const PF = "http://localhost:5000/images/";
    const axiosPrivate = useAxiosPrivate();
    const {logUser, auth, dispatch} = useContext(AuthContext);
    const [userBlocked, setuserBlocked] = useState(false);
    const [unblockUser, setUnblockUser] = useState(false);
    const [blockDateSetting, setBlockDateSetting] = useState(false);
    const expDateRef = useRef();
    


//get user
useEffect(()=>{
        const getSingleUser = async () =>{
            try{
               const res = await axiosPrivate.get(`/v1/users/${path}`, { withCredentials: true,
                headers:{authorization: `Bearer ${auth.token}`}})
                setSingleUser(res.data)
                console.log(res.data)
            }catch(err){

            }
        }
       return getSingleUser()
    
}, [path, userBlocked,unblockUser])


//turns on the blocking date settting
const turOnBlockingDateSetting = () =>{
    setBlockDateSetting(true)
}

//turns blocking user off
const turnOffBlockingDateSetting = () =>{
    setBlockDateSetting(false)
}
console.log(singleUser)

//handle blockin user
const handleBlockingUser = async() =>{
      dispatch({type:"CURSOR_NOT_ALLOWED_START"});
      const expdate = {
          expDate: expDateRef.current.value,
      }
    try{
            const res = await axiosPrivate.patch(`/v1/users/${singleUser._id}/block`, expdate, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}}) 
            setuserBlocked(true);
            setUnblockUser(false);
            setBlockDateSetting(false)
            console.log(res.data)
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            
         
    }catch(err){
          dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
    }
};

//handle unblocking user

const handleUnblockUser = async() =>{
      dispatch({type:"CURSOR_NOT_ALLOWED_START"});
    try{
            const res = await axiosPrivate.patch(`/v1/users/${singleUser._id}/unblock`, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}}) 
            setuserBlocked(false);
            setUnblockUser(true)
            setBlockDateSetting(false)
            console.log(res.data)
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            
         
    }catch(err){
          dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
    }
};


//handle clearing of block state alert

useEffect(()=>{
    setTimeout(() => {
        setuserBlocked(false)
    }, 2000);

    setTimeout(() => {
        setUnblockUser(false)
    }, 2000);
}, [userBlocked, unblockUser])

   
  return (

<>
   <article className='users-manager-custom-div '>
        <div className=" admin-dashboard-custom-container flex-3">
     
            < AdminSidebar/>

                <div className='other-pages '>
                    {

                    }
                    <div className=' flex-2 center-flex-align-display display-single-user-custom-div '>
                        <div className='flex-2 center-flex-align-display single-user-custom-div'>
           
                            <div className='user-profile-pics-div flex-2 center-flex-align-display topMargin-medium '>
                                 <img className='user-profile-pics' src={singleUser && `${singleUser.profilePicture}`} alt="" />
                 
                            </div>

                            <div className='user-details-custom-div flex-2 center-flex-align-display'>
                                <p className='topMargin-medium text-general-Medium '>{singleUser && singleUser.username}</p>

                                <p className='margin-small paragraph-text '>ROLE: {singleUser && singleUser.role}</p>
                                        <div className='user-custom-btn-div flex-3 center-flex-justify-display'>
                                            <button className='button-general-2 follow-btn'>Follow</button>
                                            <button className='button-general-2 message-btn'>Message</button>

                                        </div>
                            </div>
             
                        {
                            blockDateSetting && 
                            singleUser && singleUser.isBlocked !== true &&
                                < div className='blockDate-custom-setting-div flex-2 '>
                                    <p className='paragraph-text'>Choose Expiry Date</p>
                                        <div className='block-custom-selection-div flex-3 center-flex-justify-display topMargin-medium'>
                                            <input className='input-general date-time-custom-input' type="datetime-local" 
                                                 ref={expDateRef}
                                            />             
                                        </div>
                                        <button onClick={handleBlockingUser} className='button-general'>Block User</button>
                                </div>            
                        }
                               

                           {!blockDateSetting &&  
                           <div className=' flex-2 user-activity-div topMargin-medium user-details-custom-div center-flex-align-display'>
                                <p className='text-general-Medium'>Recent Activities</p>
                                <div className='post-custom-div flex-2 center-flex-align-display'>
                                        {singleUser && singleUser.userPosts.slice(0,3).map((singlePost) =>{
                                            const {_id, title} = singlePost
                                            console.log(title)
                                            return(
                                                <>
                                                    <div className='flex-3 margin-small paragraph-custom-div center-flex-justify-display'>
                                                        <p className='text-general-small color2 '>{singleUser.username} posted</p> 
                                                        <Link className='link' to={`/post/${_id}`}><p className='text-general-small color1 marginLeft-sm custom-post-title'>{title}</p></Link> 
                                                    </div>
                            
                                                </>
                                                )
                                        })}
                                </div>
                                         
                             </div>
                            }
                                   
                                        {userBlocked && <p className='paragraph-text'>User has been blocked</p>}
                                        {unblockUser && <p className='paragraph-text'>User has been unblocked</p>}
                                        {singleUser && !blockDateSetting && singleUser.isBlocked === false &&  <button onClick={turOnBlockingDateSetting}  className='button-general-2 block-user-custom-btn '>Block User</button> }
                                        {singleUser && singleUser.isBlocked === true && <button onClick={handleUnblockUser} className='button-general-2 block-user-custom-btn '>Unblock User</button>}
                                        {blockDateSetting && singleUser && singleUser.isBlocked !== true && <button onClick={turnOffBlockingDateSetting} className='button-general-2 block-user-custom-btn '>Cancel</button>}
                                        {singleUser && console.log(singleUser.isBlocked)}
                        </div>
                    </div>
                </div>

 
        </div>
   </article>  
   </>
 
  )
}

export default SingleUser