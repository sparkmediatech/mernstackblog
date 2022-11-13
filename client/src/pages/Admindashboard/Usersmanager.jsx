import React, {useState, useContext, useEffect} from 'react';
import { Link } from 'react-router-dom'
import './usermanager.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {AuthContext} from '../../context/AuthProvide';
import SingleUser from '../singleUser/SingleUser';
import axios from 'axios'
import AdminSidebar from './AdminSidebar';
import { useLocation } from 'react-router';
import { useHistory, useParams } from 'react-router-dom';
import {MdNavigateNext, MdNavigateBefore} from 'react-icons/md';
import {AiFillDelete} from 'react-icons/ai';
import {FiMenu} from 'react-icons/fi';
import { useMediaQuery } from '../../hooks/CustomMediaQuery';
import BASE_URL from '../../hooks/Base_URL';

function Usersmanager(props,) {
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation()
    const path = Number(location.pathname.split("/")[3]);
    const [allUsersState, setAllUsersState] = useState(true);
    const [allUsers, setAllUsers] = useState([]);
    const history = useHistory(); 
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [deleteUserState, setDeleteUserState] = useState(false)

    const totalUsers = allUsers?.length
    const fillArray = new Array(totalUsers).fill(false);
    const [checkedState, setCheckedState] = useState();

    //error states
    const [noUserFoundError, setNoUserFoundError] = useState(false)
    const [notAuthorizedError,  setNotAuthorizedError] = useState(false);
    const [usersNotFoundError, setUsersNotFoundError] = useState(false);
    const [somethingWentWrongError, setSomethingWentWrongError] = useState(false);
    const [noUserSelectedError, setNoUserSelectedError] = useState(false)
  
    const {logUser, auth, dispatch, openAdminSideBar, setOpenAdminSideBar, isLoading, cursorState} = useContext(AuthContext);
    const PF = "http://localhost:5000/images/";
     let   tabletMode = useMediaQuery('(max-width: 1200px)');
     



   //useEffect to fetch all users
  useEffect(()=>{
 const fetchAllUsers = async () =>{
  
      try{
           dispatch({type:"CURSOR_NOT_ALLOWED_START"});
          const response = await axiosPrivate.post(`${BASE_URL}/users/allusers?page=${path}`, { withCredentials: true,
            headers:{authorization: `Bearer ${auth.token}`}});
            
            setAllUsers(response.data);
             dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
         
      }catch(err){
        dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
        
        if(err.response.data === 'No user found'){
            return setNoUserFoundError(true)
        }
        if(err.response.data === 'You are not authorized to access this page'){
            return setNotAuthorizedError(true)
        }
        if(err.response.data === 'users not found'){
            return setUsersNotFoundError(true)
        }
    if(err.response.data === 'Something went wrong'){
        return setSomethingWentWrongError(true)
    }
      }
 }
 return fetchAllUsers()
}, [path, deleteUserState])

//useEffecct to set the check state
useEffect(()=>{
    setCheckedState(fillArray)
}, [allUsers])



//handle prev
const handlePrev = () =>{
    if(path > 1){
         history.push(`/users/page/${path - 1}`);
    }
 
  //setPage(page - 1)
}

//handle next
const handleNext = ()=>{
  if(allUsers.length > 4){
    history.push(`/users/page/${path + 1}`);
    //setPage(page + 1)
  }
  
    
}

//push selected post Ids into an array and handles the toggling of checked state for selected input box
   const arrayOfSelectedUserId = (userId, indexPosition) =>{
      
       setSelectedUsers(prevArray => [...prevArray, userId]);
       const updatedCheckedState = checkedState.map((item, index) =>
            index === indexPosition ? !item : item
        );

        setCheckedState(updatedCheckedState);
    }

//handle deselecting of a selected postid
   const handleChangeState = (userId)=>{
       selectedUsers.map((item)=>{
           console.log(item === userId)
           if(item === userId){
               const newArray = selectedUsers.filter((item) => item !==userId)
               setSelectedUsers(newArray);
               
           }
       })
   };

   //hanndle deleting single user
   const handleDeleteSingleUser = async (selectedId)=>{
         try{
              dispatch({type:"CURSOR_NOT_ALLOWED_START"});
        const response = await axiosPrivate.delete(`${BASE_URL}/users/deleteUser/${selectedId}`, { withCredentials: true,
            headers:{authorization: `Bearer ${auth.token}`}})
              dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            setDeleteUserState(!deleteUserState)
    }catch(err){
  
         dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
         if(err.response.data == 'user not found'){
            return setNoUserFoundError(true)
         }
         if(err.response.data == 'No user found'){
            return setNoUserFoundError(true)
         }
         if(err.response.data == 'you are not authorized'){
            return setNotAuthorizedError(true)
         }
         
         if(err.response.data == 'something went wrong'){
            return setSomethingWentWrongError(true)
         }
    }
   }
//handle deleting selected users
const handleDeleteSelectedUsers = async ()=>{
        const selectedIds = {
            selectedIds: selectedUsers
        }
    try{
         dispatch({type:"CURSOR_NOT_ALLOWED_START"});
        const response = await axiosPrivate.post(`${BASE_URL}/users/deleteSelected`, selectedIds, { withCredentials: true,
            headers:{authorization: `Bearer ${auth.token}`}})
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            setDeleteUserState(!deleteUserState)
    }catch(err){
        dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});

       if(err.response.data == 'no user selected'){
            return setNoUserSelectedError(true)
         }
         if(err.response.data === 'Users not found'){
            return setUsersNotFoundError(true)
         }
         if(err.response.data == 'user not found'){
            return setNoUserFoundError(true)
         }
        if(err.response.data == 'you are not authorized'){
            return setNotAuthorizedError(true)
        }
        if(err.response.data == 'something went wrong'){
            return setSomethingWentWrongError(true)
        }
    }
} 

//handle deleting all users
const handleDeleteAllUsers = async ()=>{
    try{
          dispatch({type:"CURSOR_NOT_ALLOWED_START"});
        const response = await axiosPrivate.post(`${BASE_URL}/users/deletallusers`, { withCredentials: true,
            headers:{authorization: `Bearer ${auth.token}`}})
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
             setDeleteUserState(!deleteUserState)
    }catch(err){
         dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
         if(err.response.data == 'user not found'){
            return setNoUserFoundError(true)
         }
         if(err.response.data == 'you are not authorized'){
            return setNotAuthorizedError(true)
         }
         if(err.response.data == 'users not found'){
            return setUsersNotFoundError(true)
         }
         if(err.response.data == 'something went wrong'){
            return setSomethingWentWrongError(true)
         }
    }
}

//handles notification timeOut
useEffect(() =>{
    if(noUserFoundError){
        setTimeout(() => {
        setNoUserFoundError(false)    
    }, 3000);
    }
   
    if(notAuthorizedError){
         setTimeout(() => {
            setNotAuthorizedError(false)    
    }, 3000);
    }
   
    if(usersNotFoundError){
        setTimeout(() => {
       setUsersNotFoundError(false)    
    }, 3000);
    }
    
    if(somethingWentWrongError){
         setTimeout(() => {
        setSomethingWentWrongError(false)    
    }, 3000);
    }
   
    if(noUserSelectedError){
        setTimeout(() => {
        setNoUserSelectedError(false)    
    }, 3000);
    }
    
}, [noUserFoundError, notAuthorizedError, usersNotFoundError, somethingWentWrongError, noUserSelectedError])


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
}, [tabletMode])





 return (
     <>
    
    
        <article className='users-manager-custom-div '>
            {
        
            isLoading && 
            <div className='custom-noUser-found-div'>
            <img className='page-loader' src={require('../../assets/page-loader.gif')} alt="loading..." />
            <h3 className='text-general-small color1'>Loading...</h3>
            </div>
        }
           


{

            !isLoading &&

             <div className=" admin-dashboard-custom-container flex-3">

                < AdminSidebar/>
   
            <FiMenu onClick={handleOpenSidebarMenu}  className={openAdminSideBar == 'admin-sidebar-slideOut' ?  'custom-sidebar-menuOpen' :  'custom-sidebar-menuOpen customMenuOpenOff' }/>
    <div className={openAdminSideBar == 'admin-sidebar-slideIn' ?  'other-pages custom-user-manager-main-div bg-blur2 curson-not-allowed-2 pointer-events-none' : "other-pages custom-user-manager-main-div"}>
     
   
    <div className='flex-3 custom-usermanger-title-div'>
        <h2 className='text-general-Medium topMargin-medium custom-user-manager-title-text'>Users</h2>
       
       
             <p onClick={handleDeleteAllUsers} className={selectedUsers.length == 1 || selectedUsers.length > 1 || allUsers.length < 1 ? 'displayNoneText topMargin-medium red-text text-general-extral-small curson-not-allowed-2 custom-user-manager-title-text pointer-events-none': 'topMargin-medium red-text text-general-extral-small general-cursor-pointer custom-user-manager-title-text'}>Delete All</p>
              <p onClick={handleDeleteSelectedUsers} className={selectedUsers.length > 1 ? 'topMargin-medium red-text text-general-extral-small general-cursor-pointer custom-user-manager-title-text': 'topMargin-medium red-text text-general-extral-small curson-not-allowed-2 custom-user-manager-title-text pointer-events-none displayNoneText'}>Delete Selected</p>
           
            
      
    </div>
    
    {allUsers.length < 1 &&
         <div className='flex noUser-custom-div'>
         <h5 className='color1  topMargin-Extral-Large text-general-extral-small'>No users yet</h5>
     </div>
    }
    
        {
            allUsersState && allUsers.length !== 0 &&
          <div className='flex-2 center-flex-align-display custom-users-dashboard-div ' >
               
            
               
                <div className='flex-3 users-title-container '>
                 <div className='name-div'><h4 className='text-general-small color1 custom-userdashboard-title-text'>NAME</h4></div>
                <div className='role-div'><h4 className='text-general-small color1 custom-userdashboard-title-text'>ROLE</h4></div>
                <div className='verified-div'><h4 className='text-general-small color1 custom-userdashboard-title-text'>VERIFIED</h4></div>
                <div className='blocked-div'><h4 className='text-general-small color1 custom-userdashboard-title-text'>BLOCKED</h4></div>
            </div>
               
           
            
            { allUsers.map((singleUser, index)=>{
                const {username, profilePicture, isBlocked, isVerified, email, role, _id: userId} = singleUser
               


                return(
                    <>
                   
                       
                  
                       {
                        allUsers.length > 0 && <div className='displayUser-div-container flex-3' key={index}>

                        <div className='flex-3 users-custom-name-container  '>
                            <div className='userImg-div'>
                                <img className='users-img' src={profilePicture} alt="" />

                            </div>
                                 <div className='users-detail-container flex-2'>

                                     <p className='text-general-small color1 custom-paragrap-text '>
                                          <Link className='link'  to={`/users/${userId}`}>
                                              {username}
                                         </Link>
                                     </p>
                                     
                                    
                                        
                                         <p className='text-general-small color1 custom-email-text'>{email}</p>
                                     
                                         
                                 </div>
                            
                           
                         </div>

                         <div className='users-role-custom-div center-flex-align-display'>
                             <p  className='text-general-small color1'>{role?.toUpperCase()}</p>
                         </div>

                       <div className='users-verified-custom-div center-flex-align-display'>
                            {isVerified == true ? <p className='text-general-small color1'>YES</p >: <p className='text-general-small color1'>NO</p>} 
                         </div>

                         <div className='users-isBlocked-custom-div center-flex-align-display flex-3'>
                             {isBlocked == false ? <p className='text-general-small color1'>NO</p>: <p className='text-general-small color1'>YES</p>}
                               <AiFillDelete onClick={()=> handleDeleteSingleUser(userId)} className='general-cursor-pointer color2 custom-userdashboard-delete-icon'/>
                               <input type="checkbox" checked={checkedState[index]}  onChange={()=>{arrayOfSelectedUserId(userId, index); handleChangeState(userId)}}/>
                         </div>

                       
                    </div>
                       }
                   
                    </>
                )
                })}
            
        {noUserFoundError &&  <p className='paragraph-text red-text'>No user found</p>}
        {notAuthorizedError &&  <p className='paragraph-text red-text'>You are not authorized to perform this action</p>}
        {usersNotFoundError &&  <p className='paragraph-text red-text'>Users not found</p>}
        {somethingWentWrongError &&  <p className='paragraph-text red-text'>Something went wrong</p>}
        {noUserSelectedError &&  <p className='paragraph-text red-text'>Make sure you select a user</p>}
        
        
        
        
        </div>
      }
       
      {
        !cursorState && openAdminSideBar !== 'admin-sidebar-slideIn' && 
        <div className='custom-userdashboard-navigation-div flex-3  center-flex-align-display'>
            <div className='custom-userDashboard-Pre-div'>
                <MdNavigateBefore  onClick={handlePrev} className={path > 1  ? 'custom-next-prev-userdashboard-icon marginRight-extraSmall flex-2' :'custom-next-prev-userdashboard-icon marginRight-extraSmall flex-2 curson-not-allowed-2' }/>
              <p className='margin-extra-small-Top color1 text-general-extral-small general-cursor-pointer'>PREV</p>
            </div>

            <p className='text-general-small color1'>Page {path}</p>

            <div className={allUsers.length > 4 ? 'flex-2 center-flex-align-display center-flex-justify-display': 'flex-2 center-flex-align-display center-flex-justify-display display-page-nav-none' }>
                <MdNavigateNext  onClick={handleNext} className='custom-next-prev-userdashboard-icon marginLeft-extraSmall flex-2 '/>
               <p className='margin-extra-small-Top color1 text-general-extral-small general-cursor-pointer'>NEXT</p>
            </div>

         </div>
      }

                 </div>    
           </div>
         
          
    

           }
     
     </article>
     </>
     
  
 )
}

export default Usersmanager
