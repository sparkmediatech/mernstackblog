import React, {useContext, useEffect, useState, useRef} from 'react';
import { useLocation } from 'react-router';
import Sidebar from '../../components/sidebar/sidebar';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {AuthContext} from '../../context/AuthProvide';
import BASE_URL from '../../hooks/Base_URL';
import {MdCancel} from 'react-icons/md';
import axios from 'axios'
import './usersposts.css';
import {AiFillDelete} from 'react-icons/ai';
import axiosPrivate from '../../hooks/AxiosPrivate';
import { useHistory, useParams } from 'react-router-dom';
import {MdNavigateNext, MdNavigateBefore} from 'react-icons/md'

function UsersPosts() {
    const location = useLocation()
    const path = location.pathname.split("/")[2];
    const pageNumber = Number(location.pathname.split("/")[3]);
    const {auth, logUser, dispatch, setAuth} = useContext(AuthContext);
    const [usersPosts, setUsersPosts] = useState([]);
    const [selectedPosts, setSelectedPosts] = useState([])
    const [isLoaded, setIsLoaded] = useState(false);
    const history = useHistory();  
   
   //error states
   const [notAuthorizedError, setNotAuthorizedError] = useState(false);
   const [userNotFoundError, setUserNotFoundError] = useState(false);
   const [noPostFoundError, setNoPostFoundError] = useState(false);
   const [somethingWentWrongError, setSomeThingWentWrongError] = useState(false);
   const [userBlockedError, setUserBlockedError] = useState(false);
   const [verifiedUserError, setVerifiedUserError] = useState(false)
   
   //I needed to create a new array that equals to the size of the userPost array and  fill it up with default false bolean value. This would be used to control the check input value
   //first, I created a variable for the userPost length.
   //I created a variable that holds the false bolean value for all the array items based on the userPost length
   //This new array variable is passed to a state and this state can be passed to the input check boxes based on their index value
   //a useEffect is used to set the checked state only when the userPost array is changed.
   const totalPosts = usersPosts.length
   const fillArray = new Array(totalPosts).fill(false)
   const [checkedState, setCheckedState] = useState();

 

//useEffecct to set the check state
useEffect(()=>{
    setCheckedState(fillArray)
}, [usersPosts])

console.log(logUser.username)
//console.log(fillArray)


    //fetch the users posts
    useEffect(() =>{

        const fetchAllUsersPosts = async ()=>{
            const userPosts = {
                username: logUser.userId
            }

            if(logUser?.userId){
                try{
                const response = await axios.post(`/posts/searches?page=${pageNumber}`,  userPosts)
                     setUsersPosts(response.data)
                     console.log(response.data)
            }catch(err){

            }
            }
            
        }
        fetchAllUsersPosts()
    }, [isLoaded, pageNumber, path, logUser]);

    console.log(logUser)
   
    //push selected post Ids into an array and handles the toggling of checked state for selected input box
   const arrayOfSelectedPostId = (postId, indexPosition) =>{
      
       setSelectedPosts(prevArray => [...prevArray, postId]);
       const updatedCheckedState = checkedState.map((item, index) =>
            index === indexPosition ? !item : item
        );

        setCheckedState(updatedCheckedState);
    }

    //handle deselecting of a selected postid
   const handleChangeState = (postId)=>{
       selectedPosts.map((item)=>{
           console.log(item === postId)
           if(item === postId){
               const newArray = selectedPosts.filter((item) => item !==postId)
               setSelectedPosts(newArray);
               
           }
       })
   };

  
   //handle deleting selected posts

   const handleSelectedPosts = async ()=>{
        dispatch({type:"CURSOR_NOT_ALLOWED_START"});
       const ids = {
           ids: selectedPosts
       }
      
       try{
            const res = await axiosPrivate.post(`/v1/posts/deleteSelected`, ids, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
           })
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
          
           setIsLoaded(!isLoaded)
           
       }catch(err){
             dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
             if(err.response.data == 'You can not perform this action'){
                return setNotAuthorizedError(true)
             }
             if(err.response.data == 'user not found'){
                return setUserNotFoundError(true)
             }
             if(err.response.data === 'no post found'){
                return setNoPostFoundError(true)
             }
             if(err.response.data === 'something went wrong'){
                return setSomeThingWentWrongError(true)
             }
             if(err.response.data === 'you are blocked'){
                return setUserBlockedError(true)
             }
            if(err.response.data === 'you are not verified yet'){
                return setVerifiedUserError(true)
             }
       }
   }

  //handle delete single post

  const handleSinglePost = async (postId) =>{
       dispatch({type:"CURSOR_NOT_ALLOWED_START"});
      try{
        const res = await axiosPrivate.delete(`/v1/posts/${postId}`, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
           });
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
           console.log(res.data)
           setIsLoaded(true)

      }catch(err){
         dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
         if(err.response.data === 'Sorry, you can not make a post at this moment'){
            return setUserBlockedError(true)
         }
         if(err.response.data === 'Sorry, only verified users can delete their posts'){
            return setVerifiedUserError(true)
         }
         if(err.response.data === "Post not found"){
            setNoPostFoundError(true)
         }
         if(err.response.data === "you can only delete your posts"){
            return setNotAuthorizedError(true)
         }
         if(err.response.data === "Something went wrong"){
            return setSomeThingWentWrongError(true)
         }
      }
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
         if(err.response.data === 'No user found'){
            return setUserNotFoundError(true)
         }
         if(err.response.data === 'Sorry, only verified users can delete their posts'){
            return setVerifiedUserError(true)
         }
         if(err.response.data === 'Sorry, you are blocked, you can not perform any action until you are unblocked'){
            return setUserBlockedError(true)
         }
         if(err.response.data === 'posts not found'){
            return setNoPostFoundError(true)
         }
         if(err.response.data === 'You can not perform this action'){
            return setNotAuthorizedError(true)
         }
         if(err.response.data === 'something went wrong with finding user'){
            return setSomeThingWentWrongError(true)
         }
    }
};
  //handle prev
const handlePrev = () =>{
 if(!pageNumber == Number(1)){
     history.push(`/usersposts/${logUser?.userId}/${pageNumber - 1}`);
 }
  //setPage(page - 1)
}

//handle next
const handleNext = ()=>{
  if(pageNumber < usersPosts.length && pageNumber !== usersPosts.length -1 ){
    history.push(`/usersposts/${logUser?.userId}/${pageNumber + 1}`);
    //setPage(page + 1)
  }
  
    
}

//handle clear selected. This is for clearing multiple selected checked box without unchecking one by one

const handleClearSelected = () =>{
     const updatedCheckedState = checkedState.map((item, index) =>
            item === true ? !item : item
        );

    setCheckedState( updatedCheckedState)
}

  //handle turning off notifications
  useEffect(()=>{
    setTimeout(() => {
        setNotAuthorizedError(false)
    }, 3000);


    setTimeout(() => {
        setUserNotFoundError(false)
    }, 3000);

     setTimeout(() => {
        setNoPostFoundError(false)
    }, 3000);

     setTimeout(() => {
        setSomeThingWentWrongError(false)
    }, 3000);

     setTimeout(() => {
        setUserBlockedError(false)
    }, 3000);
    setTimeout(() => {
       setVerifiedUserError(false)
    }, 3000);
  }, [notAuthorizedError, userNotFoundError, noPostFoundError, somethingWentWrongError, userBlockedError,
    verifiedUserError,
    ])

console.log(usersPosts.length)



  return (
      <>

       <div className=' usersposts-main-wrapper'>

          

           <div className='mainContainer usersPosts-custom-main-div  margin-small '>
                <h5 className='text-general-small2 center-text color1 topMargin-medium custom-managePosts-title'>Manage Posts</h5>
                <div className='clear-selected-btn-div'>
                    <div className='custom-userPosts-delete-BTN-div'> {usersPosts.length > 1 &&<p onClick={handleDeleteAllPosts} className=' clear-btn marginRight-sm text-general-small color2'>Delete All Posts</p>}</div>
                    <div className='custom-userPosts-clear-BTN-div'> {usersPosts.length > 1 && <p onClick={handleClearSelected} className=' clear-btn marginRight-sm text-general-small color2'>Clear Selected</p>}</div>
                    </div>
              {usersPosts.map((singlePost, index) =>{
               
                  const {title, _id: postId} = singlePost
                  return(
                      <>
                        <div className='posts-div topMargin-medium ' key={index}>
                            <div className='flex-3 center-flex-align-display single-post-div'>
                                <div className='marginLeft-sm post-title-div'>
                                    <h4 className='text-general-small post-title-custom-text color1'>{title}</h4>
                                </div>

                                
                                    

                                     <div className='post-item-custom-div flex-3 center-flex-align-display'>
                                     <input className='marginRight-sm check-box' type="checkbox" name='' id={index} checked={checkedState[index]}   onChange={()=>{arrayOfSelectedPostId(postId, index); handleChangeState(postId)}} />
                                    <AiFillDelete onClick={()=> handleSinglePost(postId)}  className='delete-post marginRight-sm red-text'/>

                                 </div>
                                
                                 
                                   
                                
                            </div>
                           
                            
                        </div>
                        
                      </>

                    
                  )

              })}
            
            {/* error messages  */}

            {notAuthorizedError && <p className='paragraph-text red-text'>You are not permittted to perform this action</p>}
            {userNotFoundError && <p className='paragraph-text red-text'>User not found</p>}
            {noPostFoundError && <p className='paragraph-text red-text'>No post found</p>}
            {somethingWentWrongError && <p className='paragraph-text red-text'>Something went wrong, contact support</p>}
            {userBlockedError && <p className='paragraph-text red-text'>Your account is restricted and can not perform this action now</p>}
            {verifiedUserError && <p className='paragraph-text red-text'>You are yet to verify your account. You can not perform this action</p>}

              <div className='flex-3 custom-page-navigation-div center-flex-justify-display margin-small'>

               
                   
                   {
                    usersPosts.length > 0 && <div className='flex-2 marginRight-extraSmall '>
                    <MdNavigateBefore onClick={handlePrev} className={pageNumber > 1 && pageNumber !== usersPosts.length ? 'custom-page-navigation-icon': 'custom-page-navigation-icon unclickMouse' }/>
                    <p className='margin-extra-small-Top color1 text-general-extral-small general-cursor-pointer'>PREV</p>
                </div>
                   }
            
                

                {
                    usersPosts.length < 1 ? <p className='color1 text-general-small '>You do not have any post yet</p>:
                    <p className='color1 text-general-small '>Page {pageNumber}</p>
                }
                
               
                    
                {
                    usersPosts.length > 0 && 
                     <div className='flex-2 margin-left-sm1'>
                    <MdNavigateNext onClick={handleNext} className={ pageNumber < usersPosts.length && pageNumber !== usersPosts.length -1 && usersPosts && usersPosts.length == 12 ? 'custom-page-navigation-icon' :  'custom-page-navigation-icon unclickMouse'}/>
                    <p className='margin-extra-small-Top color1 text-general-extral-small general-cursor-pointer'>NEXT</p>
                </div>
                }
                
              </div>
              
              {
                selectedPosts.length > 1 && <div className='delete-BTN-div flex topMargin-medium'>
                   <button onClick={handleSelectedPosts} className={selectedPosts.length > 1 ? 'button-general-2 ' : "delet-selected-custom button-general-2 delet-selected-custom"}>Delete Selected Posts</button>
                   
              </div>
              }
              
           </div>
        

        </div>
      </>
   
  )
}

export default UsersPosts