import React, {useContext, useState, useEffect, useRef} from 'react'
import './singleuser.css';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {AuthContext} from '../../context/AuthProvide';
import AdminSidebar from '../Admindashboard/AdminSidebar';
import { useLocation } from 'react-router';
import { FiTrendingUp } from 'react-icons/fi';
import { useMediaQuery } from '../../hooks/CustomMediaQuery';
import {FiMenu} from 'react-icons/fi'
import BASE_URL from '../../hooks/Base_URL';


function SingleUser(props ) {
    const location = useLocation()
    const path = location.pathname.split("/")[2];
    const [singleUser, setSingleUser] = useState();
    const PF = "http://localhost:5000/images/";
    const axiosPrivate = useAxiosPrivate();
    const {logUser, auth, dispatch,  openAdminSideBar, setOpenAdminSideBar,} = useContext(AuthContext);
    const [userBlocked, setuserBlocked] = useState(false);
    const [unblockUser, setUnblockUser] = useState(false);
    const [blockDateSetting, setBlockDateSetting] = useState(false);
    const expDateRef = useRef();
    const expTime = useRef();
    const dateTime = expDateRef?.current?.value + '-' + expTime?.current?.value;
    let   tabletMode = useMediaQuery('(max-width: 1200px)');
    let   mobileMode = useMediaQuery('(max-width: 500px)');
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
               const res = await axiosPrivate.get(`${BASE_URL}/users/${path}`, { withCredentials: true,
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
            const res = await axiosPrivate.patch(`${BASE_URL}/users/${singleUser._id}/block`, expdate, { withCredentials: true,
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
            const res = await axiosPrivate.patch(`${BASE_URL}/users/${singleUser._id}/unblock`, { withCredentials: true,
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
if(userBlocked){
    setTimeout(() => {
        setuserBlocked(false)
    }, 2000);
}
    
if(unblockUser){
 setTimeout(() => {
        setUnblockUser(false)
    }, 2000);
}
   

    
}, [userBlocked, unblockUser])



//handle notification
useEffect(() =>{
if(userNotFoundError){
     setTimeout(() => {
        setUserNotFoundError(false)
    }, 2000);
}
if(somethingWentWrongError){
 setTimeout(() => {
    setSomethingWentWrongError(false)
    }, 2000);
}   
if(dateExpError){
 setTimeout(() => {
    setDateExpError(false)
    }, 2000);
}  

if(notAuthorizedError){
 setTimeout(() => {
    setNotAuthorizedError(false)
    }, 2000);
}

if(actionNotCompletedError){
 setTimeout(() => {
    setActionNotCompletedError(false)
    }, 2000);
}
if(userAlreadyUnblockedError){
 setTimeout(() => {
    setUserAlreadyUblockedError(false)
    }, 2000);
}    


if(invalidDateError){
setTimeout(() => {
setInvalidDateError(false)
    }, 2000);
}

    
}, [userNotFoundError, somethingWentWrongError, dateExpError, notAuthorizedError, userAlreadyBlockedError, actionNotCompletedError, userAlreadyUnblockedError, invalidDateError])

//this brings the admin sidebar out in a screen mode that is not desktop screen mode
const handleOpenSidebarMenu = ()=>{
  if(openAdminSideBar == 'admin-sidebar-slideOut'){
      setOpenAdminSideBar('admin-sidebar-slideIn')
  }
 
    
}

//this useEffect helps to remove the blur effect that was called when the admin side bar is toggle in during the tablet or mobile device screen mode. 
useEffect(()=>{
  if(openAdminSideBar == 'admin-sidebar-slideIn'){
      setOpenAdminSideBar('admin-sidebar-slideOut')
  }
}, [tabletMode]);





   
  return (

<>
   <article className='users-manager-custom-div '>
        <div className=" admin-dashboard-custom-container flex-3">
     
            < AdminSidebar/>
        <FiMenu onClick={handleOpenSidebarMenu}  className={openAdminSideBar == 'admin-sidebar-slideOut' && ! blockDateSetting  ?  'custom-sidebar-menuOpen' :  'custom-sidebar-menuOpen customMenuOpenOff' }/>
                <div className={openAdminSideBar == 'admin-sidebar-slideIn' ? 'other-pages topMargin-medium custom-singleUser-otherPage bg-blur2 curson-not-allowed-2 pointer-events-none' : 'other-pages topMargin-medium custom-singleUser-otherPage'}>
                    {

                    }
                    <div className=' flex-2 center-flex-align-display display-single-user-custom-div '>
                        <div className='flex-2 center-flex-align-display single-user-custom-div'>
           
                            <div className={blockDateSetting ? 'custom-user-profile-pics-div-wrapper flex-2 center-flex-align-display topMargin-medium custom-user-profile-pics-div-wrapper-date-setting' :'custom-user-profile-pics-div-wrapper flex-2 center-flex-align-display topMargin-medium '}>
                                 <img className='custom-user-main-profile-pics' src={singleUser && `${singleUser.profilePicture}`} alt="" />
                 
                            </div>

                            <div className='user-details-custom-div flex-2 center-flex-align-display'>
                                <p className='topMargin-medium text-general-Medium custom-single-user-name-text '>{singleUser && singleUser?.username}</p>

                                <p className='margin-small paragraph-text custom-single-user-role-text'>Role: {singleUser && singleUser?.role}</p>
                                        <div className='user-custom-btn-div flex-3 center-flex-justify-display'>
                                            <button className='button-general-2 follow-btn'>Follow</button>
                                            <button className='button-general-2 message-btn'>Message</button>

                                        </div>
                            </div>
             
                        {
                            blockDateSetting && 
                            singleUser && singleUser?.isBlocked !== true &&
                                < div className='blockDate-custom-setting-div flex-2 topMargin-medium'>
                                    <p className='paragraph-text custom-block-user-expiry-date'>Choose Expiry Date</p>
                                        <div className='block-custom-selection-div flex-3  margin-small '>

                                           <div className='flex-2 custom-date-time-inner-div flex-3 center-flex-justify-display'>
                                             <p className='color1 text-general-small center-text'>Date</p>
                                            <input className='input-general date-time-custom-input margin-small-small custom-single-user-date-input' type="date" 
                                                 ref={expDateRef}
                                            />  
                                           </div>
                                           
                                           <div className='flex-2 custom-date-time-inner-div marginRight-sm flex-3 center-flex-justify-display custom-single-user-time-div'>
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
                           <div className=' flex-2 user-activity-div  user-details-custom-div center-flex-align-display'>
                           
                                <p className='text-general-Medium custom-recent-activities-text'>Recent Activities</p>
                                 {singleUser?.userPosts?.length < 1 && <div className='single-user-no-post-div'><p className='color1 text-general-small2'>No activity</p></div>}
                                <div className='post-custom-div flex-2 center-flex-align-display'>
                                        {singleUser && singleUser.userPosts.slice(0,3).map((singlePost) =>{
                                            const {_id, title} = singlePost
                                            console.log(title)
                                            return(
                                                <>
                                                    <div className='flex-3 margin-small paragraph-custom-div center-flex-justify-display'>
                                                        <p className='text-general-small color2 '>{singleUser?.username} posted</p> 
                                                        <p className='text-general-small color1 marginLeft-sm custom-post-title'><Link className='link' to={`/post/${_id}`}>{title}</Link> </p>
                                                    </div>
                            
                                                </>
                                                )
                                        })}
                                </div>
                                         
                             </div>
                            }
                                   <div className='custom-BTN-div  flex-2 center-flex-align-display'>
                                    
                                       
                                        {(singleUser && !blockDateSetting && singleUser?.isBlocked === false && openAdminSideBar ==  'admin-sidebar-slideOut' || (mobileMode && !blockDateSetting && singleUser?.isBlocked === false && singleUser))  && <button onClick={turOnBlockingDateSetting}  className='button-general-2 block-user-custom-btn flex '>Block User</button> }
                                        {singleUser && singleUser?.isBlocked === true && openAdminSideBar ==  'admin-sidebar-slideOut' || (mobileMode && !blockDateSetting && singleUser?.isBlocked === true && singleUser) && <button onClick={handleUnblockUser} className='button-general-2 block-user-custom-btn flex '>Unblock User</button>}
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