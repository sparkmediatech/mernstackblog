import React, {useContext, useEffect, useState, useRef} from 'react';
import Sidebar from '../../components/sidebar/sidebar';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {AuthContext} from '../../context/AuthProvide';
import BASE_URL from '../../hooks/Base_URL';
import {MdCancel} from 'react-icons/md';
import axios from 'axios'
import './usersposts.css';
import {AiFillDelete} from 'react-icons/ai';
import axiosPrivate from '../../hooks/AxiosPrivate';

function UsersPosts() {
    const {auth, logUser, dispatch, setAuth} = useContext(AuthContext);
    const [usersPosts, setUsersPosts] = useState([]);
    const [selectedPosts, setSelectedPosts] = useState([])
    const [isChecked, setIsChecked] = useState(false)
   const [isLoaded, setIsLoaded] = useState(false)
   
   
   
   
    //push selected post Ids into an array
   const arrayOfSelectedPostId = (postId) =>{
      
       setSelectedPosts(prevArray => [...prevArray, postId])

    }

    //handle delecting of a selected postid
   const handleChangeState = (postId)=>{
       selectedPosts.map((item)=>{
           console.log(item === postId)
           if(item === postId){
               const newArray = selectedPosts.filter((item) => item !==postId)
               setSelectedPosts(newArray) 
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
           console.log(res.data)
           setIsLoaded(true)
           
       }catch(err){
             dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
       }
   }
  //handle single post

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
      }
  }
    //fetch the users posts
    useEffect(() =>{

        const fetchAllUsersPosts = async ()=>{
            try{
                const response = await axios.get(`/posts/?user=${logUser.userId}`)
                     setUsersPosts(response.data)
                     console.log(response.data)
            }catch(err){

            }
        }
        fetchAllUsersPosts()
    }, [isLoaded]);

    console.log(selectedPosts)
  return (
      <>

       <div className='flex-3 usersposts-main-wrapper'>

          

           <div className='usersPosts-custom-main-div'>
                <h5 className='text-general-small2 center-text color1 topMargin-medium'>Manage Posts</h5>
                <div className='clear-selected-btn-div'>
                    <p  className=' clear-btn marginRight-sm text-general-small color2'>Clear Selected</p>
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
                                     <input className='marginRight-sm check-box' type="checkbox" name='' id={index} checked={isChecked[index]}   onChange={()=>{arrayOfSelectedPostId(postId); handleChangeState(postId)}} />
                                    <AiFillDelete onClick={()=> handleSinglePost(postId)}  className='delete-post marginRight-sm red-text'/>

                                 </div>

                                
                            </div>
                           
                            
                        </div>
                        
                      </>

                    
                  )
              })}

              <div className='delete-BTN-div flex topMargin-medium'>
                    <button onClick={handleSelectedPosts} className={selectedPosts.length > 1 ? 'button-general-2 ' : "delet-selected-custom button-general-2 delet-selected-custom"}>Delete Selected Posts</button>
              </div>
              
           </div>
        < Sidebar/>

        </div>
      </>
   
  )
}

export default UsersPosts