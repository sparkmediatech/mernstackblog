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
import {AiFillDelete} from 'react-icons/ai'

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
  
    const {logUser, auth, dispatch} = useContext(AuthContext);
    const PF = "http://localhost:5000/images/";



   //useEffect to fetch all users
  useEffect(()=>{
 const fetchAllUsers = async () =>{
  
      try{
          const response = await axiosPrivate.post(`/v1/users/allusers?page=${path}`, { withCredentials: true,
            headers:{authorization: `Bearer ${auth.token}`}});
            setAllUsers(response.data);
         
      }catch(err){
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


console.log(checkedState)
//handle prev
const handlePrev = () =>{
    if(path > 1){
         history.push(`/usersdashboard/page/${path - 1}`);
    }
 
  //setPage(page - 1)
}

//handle next
const handleNext = ()=>{
  if(path < allUsers.length && path !== allUsers.length){
    history.push(`/usersdashboard/page/${path + 1}`);
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
console.log(selectedUsers)
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
        const response = await axiosPrivate.delete(`/v1/users/deleteUser/${selectedId}`, { withCredentials: true,
            headers:{authorization: `Bearer ${auth.token}`}})
              dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            setDeleteUserState(!deleteUserState)
    }catch(err){
        console.log(err)
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
        const response = await axiosPrivate.post(`/v1/users/deleteSelected`, selectedIds, { withCredentials: true,
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
        const response = await axiosPrivate.post(`/v1/users/deletallusers`, { withCredentials: true,
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
console.log(selectedUsers)
//handles notification timeOut
useEffect(() =>{
   setTimeout(() => {
       setNoUserFoundError(false)    
    }, 3000);

    setTimeout(() => {
       setNotAuthorizedError(false)    
    }, 3000);

    setTimeout(() => {
       setUsersNotFoundError(false)    
    }, 3000);

    setTimeout(() => {
       setSomethingWentWrongError(false)    
    }, 3000);

    setTimeout(() => {
       setNoUserSelectedError(false)    
    }, 3000);
}, [noUserFoundError, notAuthorizedError, usersNotFoundError, somethingWentWrongError, noUserSelectedError])


 return (
     <>
        <article className='users-manager-custom-div '>

            <div className=" admin-dashboard-custom-container flex-3">

                < AdminSidebar/>

    <div className='other-pages topMargin-Extral-Large'>
        
    <div className='flex-3 custom-usermanger-title-div'>
        <h2 className='text-general-Medium topMargin-medium'>Users</h2>
       
       
             <p onClick={handleDeleteAllUsers} className={selectedUsers.length == 1 || selectedUsers.length > 1 ? 'topMargin-medium red-text text-general-extral-small curson-not-allowed-2': 'topMargin-medium red-text text-general-extral-small general-cursor-pointer'}>DELETE ALL USERS</p>
              <p onClick={handleDeleteSelectedUsers} className={selectedUsers.length > 1 ? 'margin-small red-text text-general-extral-small general-cursor-pointer': 'margin-small red-text text-general-extral-small curson-not-allowed-2'}>DELETE selected USERS</p>
           
            
      
    </div>

    
        {
            allUsersState && allUsers.length !== 0 &&
          <div className='flex-2 center-flex-align-display custom-users-dashboard-div ' >
               
            
               
                <div className='flex-3 users-title-container '>
                 <div className='name-div'><h4 className='text-general-small color1'>NAME</h4></div>
                <div className='role-div'><h4 className='text-general-small color1'>ROLE</h4></div>
                <div className='verified-div'><h4 className='text-general-small color1'>VERIFIED</h4></div>
                <div className='blocked-div'><h4 className='text-general-small color1'>BLOCKED</h4></div>
            </div>
               

            
            { allUsers.map((singleUser, index)=>{
                const {username, profilePicture, isBlocked, isVerified, email, role, _id: userId} = singleUser
                console.log(singleUser)
                return(
                    <>
                       <div className='displayUser-div-container flex-3' key={index}>

                           <div className='flex-3 users-custom-name-container  '>
                               <div className='userImg-div'>
                                   <img className='users-img' src={profilePicture} alt="" />

                               </div>
                                    <div className='users-detail-container '>
                                        
                                        <Link className='text-general-small color1 custom-paragrap-text link' to={`/users/${userId}`}>
                                             {username}
                                        </Link>
                                           
                                            <p className='text-general-small color1'>{email}</p>
                                        
                                            
                                    </div>
                               
                              
                            </div>

                            <div className='users-role-custom-div center-flex-align-display'>
                                <p  className='text-general-small color1'>{role}</p>
                            </div>

                          <div className='users-verified-custom-div center-flex-align-display'>
                               {isVerified == true ? <p className='text-general-small color1'>YES</p >: <p className='text-general-small color1'>NO</p>} 
                            </div>

                            <div className='users-isBlocked-custom-div center-flex-align-display flex-3'>
                                {isBlocked == false ? <p className='text-general-small color1'>NO</p>: <p className='text-general-small color1'>YES</p>}
                                  <AiFillDelete onClick={()=> handleDeleteSingleUser(userId)} className='general-cursor-pointer color2'/>
                                  <input type="checkbox" checked={checkedState[index]}  onChange={()=>{arrayOfSelectedUserId(userId, index); handleChangeState(userId)}}/>
                            </div>

                          
                       </div>
                   
                    </>
                )
                })}
            
        {noUserFoundError &&  <p className='paragraph-text red-text'>No user found</p>}
        {notAuthorizedError &&  <p className='paragraph-text red-text'>You are not authorized to perform this action</p>}
        {usersNotFoundError &&  <p className='paragraph-text red-text'>Users not found</p>}
        {somethingWentWrongError &&  <p className='paragraph-text red-text'>Something went wrong</p>}
        {noUserSelectedError &&  <p className='paragraph-text red-text'>Make sure you select a user</p>}
        
        
        
         <div className='custom-userdashboard-navigation-div flex-3 margin-small center-flex-align-display'>
            <div>
                <MdNavigateBefore  onClick={handlePrev} className={path > 1  ? 'custom-next-prev-userdashboard-icon marginRight-extraSmall flex-2' :'custom-next-prev-userdashboard-icon marginRight-extraSmall flex-2 curson-not-allowed-2' }/>
              <p className='margin-extra-small-Top color1 text-general-extral-small general-cursor-pointer'>PREV</p>
            </div>

            <p className='text-general-small color1'>Page {path}</p>

            <div className='flex-2 center-flex-align-display center-flex-justify-display'>
                <MdNavigateNext  onClick={handleNext} className={path < allUsers.length && path !== allUsers.length  ? 'custom-next-prev-userdashboard-icon marginLeft-extraSmall flex-2 ' : 'custom-next-prev-userdashboard-icon marginLeft-extraSmall flex-2 curson-not-allowed-2'}/>
               <p className='margin-extra-small-Top color1 text-general-extral-small general-cursor-pointer'>NEXT</p>
            </div>

         </div>
        </div>
      }
   
     

                 </div>    
           </div>
         
          
    
     
     </article>
     </>
     
  
 )
}

export default Usersmanager
