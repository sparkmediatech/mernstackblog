import React, {useContext, useState, useEffect, useRef} from 'react'
import './singleuser.css';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {AuthContext} from '../../context/AuthProvide';
import AdminSidebar from '../Admindashboard/AdminSidebar';
import { useLocation } from 'react-router';
import { FiTrendingUp } from 'react-icons/fi';



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
    const expTime = useRef();
    const dateTime = expDateRef?.current?.value + '-' + expTime?.current?.value
    //error states
    const [userNotFoundError, setUserNotFoundError] = useState(false);
    const [somethingWentWrongError, setSomethingWentWrongError] = useState(false);
    const [dateExpError, setDateExpError] = useState(false);
    const [notAuthorizedError, setNotAuthorizedError] = useState(false);
    const [userAlreadyBlockedError, setUserAlreadyBlockedError] = useState(false);
    const [actionNotCompletedError, setActionNotCompletedError] = useState(false);
    const [userAlreadyUnblockedError,  setUserAlreadyUblockedError] = useState(false);
    const [invalidDateError, setInvalidDateError] = useState(false)
    


//get user
useEffect(()=>{
        const getSingleUser = async () =>{
            try{
               const res = await axiosPrivate.get(`/v1/users/${path}`, { withCredentials: true,
                headers:{authorization: `Bearer ${auth.token}`}})
                setSingleUser(res.data)
               
            }catch(err){
                if(err.response.data == 'user not found with this ID'){
                    return setUserNotFoundError(true)
                }

            if(err.response.data ==='something went wrong with finding user'){
                return setSomethingWentWrongError(false)
            }
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
          expTime: expTime.current.value
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
          if(err.response.data == "You must provide expiry date"){
            return setDateExpError(true);
          }
          if(err.response.data ==="User not found"){
            return setUserNotFoundError(true)
          }
          if(err.response.data === "You are not authorized to carry it this feature"){
            return setNotAuthorizedError(true)
          }
        if(err.response.data === "User has already been blocked"){
            return setUserAlreadyBlockedError(true)
        }
        if(err.response.data === 'Action can not be completed'){
            return setActionNotCompletedError(true)
        }
        if(err.response.data === 'something went wrong'){
            return setSomethingWentWrongError(true)
        }
        if(err.response.data === 'invalid date'){
            return setInvalidDateError(true)
        }
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
          if(err.response.data === "User not found"){
            return setUserNotFoundError(true)
          }
          if(err.response.data === 'admin'){
            return setNotAuthorizedError(true)
          }
        if(err.response.data === "User is has already been unblocked"){
            return setUserAlreadyUblockedError(true)
        }
        if(err.response.data === 'Action can not be completed due to unathourized access or user not found'){
            return setActionNotCompletedError(true)
        }
        if(err.response.data === 'something went wrong'){
            return setSomethingWentWrongError(true)
        }
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



//handle notification
useEffect(() =>{
    setTimeout(() => {
        setUserNotFoundError(false)
    }, 2000);
    setTimeout(() => {
        setSomethingWentWrongError(false)
    }, 2000);

    setTimeout(() => {
        setDateExpError(false)
    }, 2000);

     setTimeout(() => {
        setNotAuthorizedError(false)
    }, 2000);

     setTimeout(() => {
        setActionNotCompletedError(false)
    }, 2000);

     setTimeout(() => {
        setUserAlreadyUblockedError(false)
    }, 2000);

    setTimeout(() => {
        setInvalidDateError(false)
    }, 2000);
}, [userNotFoundError, somethingWentWrongError, dateExpError, notAuthorizedError, userAlreadyBlockedError, actionNotCompletedError, userAlreadyUnblockedError, invalidDateError])




console.log(dateTime)
   
  return (

<>
   <article className='users-manager-custom-div '>
        <div className=" admin-dashboard-custom-container flex-3">
     
            < AdminSidebar/>

                <div className='other-pages topMargin-medium'>
                    {

                    }
                    <div className=' flex-2 center-flex-align-display display-single-user-custom-div '>
                        <div className='flex-2 center-flex-align-display single-user-custom-div'>
           
                            <div className='custom-user-profile-pics-div-wrapper flex-2 center-flex-align-display topMargin-medium '>
                                 <img className='custom-user-main-profile-pics' src={singleUser && `${singleUser.profilePicture}`} alt="" />
                 
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
                                < div className='blockDate-custom-setting-div flex-2 topMargin-medium'>
                                    <p className='paragraph-text'>Choose Expiry Date</p>
                                        <div className='block-custom-selection-div flex-3  margin-small '>

                                           <div className='flex-2 custom-date-time-inner-div '>
                                             <p className='color1 text-general-small center-text'>Date</p>
                                            <input className='input-general date-time-custom-input margin-small-small' type="date" 
                                                 ref={expDateRef}
                                            />  
                                           </div>
                                           
                                           <div className='flex-2 custom-date-time-inner-div marginRight-sm'>
                                             <p className='color1 text-general-small center-text'>Time</p>          
                                            <input className='input-general date-time-custom-input margin-small-small' type="time" 
                                                 ref={expTime}
                                            />             
                                           </div>
                                        </div>
                                        
                                        <div className='custom-block-BTN-div flex-2 center-flex-align-display'>
                                              <button onClick={handleBlockingUser} className='button-general custom-block-user-BTN flex'>Block User</button>
                                                {blockDateSetting && singleUser && singleUser.isBlocked !== true && <button onClick={turnOffBlockingDateSetting} className='button-general-2 block-user-custom-btn custom-block-user-BTN flex '>Cancel</button>}
                                        </div>

                                            {dateExpError && <p className='paragraph-text red-text'>You must provide block expiry date</p>}
                                            {invalidDateError && <p className='paragraph-text red-text'>Invalid date format</p>}
                                            {userAlreadyBlockedError && <p className='paragraph-text red-text'>User already blocked</p>}
                                            {actionNotCompletedError && <p className='paragraph-text red-text'>Action can not be completed, user not found</p>}
                                            {userAlreadyUnblockedError && <p className='paragraph-text red-text'>User already unblocked</p>}
                                </div>            
                        }
                               

                           {!blockDateSetting &&  
                           <div className=' flex-2 user-activity-div topMargin user-details-custom-div center-flex-align-display'>
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
                                   <div className='custom-BTN-div topMargin flex-2 center-flex-align-display'>
                                    
                                       
                                        {singleUser && !blockDateSetting && singleUser.isBlocked === false &&  <button onClick={turOnBlockingDateSetting}  className='button-general-2 block-user-custom-btn '>Block User</button> }
                                        {singleUser && singleUser.isBlocked === true && <button onClick={handleUnblockUser} className='button-general-2 block-user-custom-btn '>Unblock User</button>}
                                         {userBlocked && <p className='paragraph-text'>User has been blocked</p>}
                                        {unblockUser && <p className='paragraph-text'>User has been unblocked</p>}
                                        {singleUser && console.log(singleUser.isBlocked)}
                                       
                                     {userNotFoundError && <p className='paragraph-text red-text'>User not found</p>}
                                    {somethingWentWrongError && <p className='paragraph-text red-text'>Something went wrong</p>}
                                    {notAuthorizedError && <p className='paragraph-text red-text'>You are not authorized</p>}
                                    
                                   
                                   </div>
                        </div>
                         
                    </div>
                </div>
            

        </div>
    
   </article>  
   </>
 
  )
}

export default SingleUser