import { useLocation } from 'react-router';
import React, {useEffect, useState, useContext} from 'react';
import './singlePost.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Comments from "../comments/Comments";
import Share from '../socialshare/share';
//import HelmetMetaData from '../socialshare/Helmet';
import {AuthContext} from '../../context/AuthProvide';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import PageLoader from '../pageLoader/PageLoader';
import  BASE_URL from '../../hooks/Base_URL';
import {AiOutlineLike} from 'react-icons/ai';
import {MdCancel} from 'react-icons/md';
import {EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { Editor as EditEditor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Editor from '@draft-js-plugins/editor';
import createImagePlugin from '@draft-js-plugins/image';
import  '../../../node_modules/@draft-js-plugins/image/lib/plugin.css';
import UploadImage from '../../hooks/UploadImage'

//import Helmet from '../socialshare/Helmet';

export default function SinglePost() {
    const imageUploader = UploadImage()
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation()
    const path = location.pathname.split("/")[2];
    const [post, setPost] = useState([]);
    const PF = "http://localhost:5000/images/" // making the image folder publicly visible
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("");
    const [updateMode, setUpdateMode] = useState(false)
    const [categories, setCategories] = useState();
    const [username, setUsername] = useState();
    const [isLoading, setIsLoading] = useState(false);   
    let currentUrl = `http://www.localhost:3000/post/${path}`;
    const {auth, logUser, dispatch, authorDetails, setAuthorDetails, imageDetails, tokenError, generalFetchError, setgeneralFetchError} = useContext(AuthContext);
    const [liked, setLiked] = useState();
    //const [showCategories, setShowCategories] = useState(false);
    const imagePlugin = createImagePlugin();
    const [editEditorState, setEditEditorState] = useState();
    const [maineditorState, setMainEditorState] = useState();
    const [reload, setReload] = useState(false);
    const [postLikeError, setPostLikeError] = useState(false)
    const [deletePostErrorState, setDeletePostErrorState] = useState(false)
    //error states start here
    const [userNotFoundError, setUserNotFounderError] = useState(false);
    const [userbannedError, setUserBannedError] = useState(false);
    const [notVerifiedError, setNotVerifiedError] = useState(false);
    const [postNotFoundError, setNoPostFoundError] = useState(false);
    const [notAuthorizedError, setNotAuthorizedError] = useState(false);
    const [somethingWentWrongError, setSomeThingWentWrongError] = useState(false);
    const [duplicatePostTitleError, setDubplicateTitleError] = useState(false);
    const [postTitleMaxError, setPostTitleMaxError] = useState(false);
    const [postTitleEmptyError, setPostTitleEmptyError] = useState(false);
    const [postTitleMinError, setPostTitleMinError] = useState(false);
    const [isFetching, setIsFetching] = useState(true)
    

   


    
   
    

//anytime the path changes, trigger the useeffects by fetching the posts with that path
    useEffect(() => {
        const ourRequest = axios.CancelToken.source() 
         
        const getPost = async () => {
       

         
             try{
              setIsLoading(true)
            const response = await axios.get(`${BASE_URL}/posts/${path}`,{cancelToken: ourRequest.token})
           
                 setUsername(response.data.username)
                setPost([response.data]);
                setTitle(response.data.title);
                setDescription(response.data.description);
                setCategories(response.data.categories);
                setLiked(response.data.postLikes)
                //set author's details globally
                setAuthorDetails(response.data.username)
                setIsLoading(false)
               
           
           
            
           }catch(err){
            console.log(err, 'err name')
                if(err.response){
                    return console.log('request canceled')
                }
              setIsLoading(false)
            if(err.response.data === 'no post found'){
                return setgeneralFetchError(true)
            }
            if(err.response.data === 'something went wrong'){
                return setgeneralFetchError(true)
            }
           }
          }
           
          
      

       
      getPost()
          console.log('i fire once');
       return () => {
       
    ourRequest.cancel() 
  }
       
     
    }, []);
   
    //handle the convertion of the the server content to editor content
    useEffect(()=>{
        if(updateMode){
             post.map((singlePost) =>{
                const contentState = convertFromRaw(JSON.parse(singlePost.description));
                const editorState = EditorState.createWithContent(contentState);  
                setEditEditorState(editorState)
            })
        }
           
        
    }, [updateMode])

//handle the onChange state of the edit editor text editor
 const onEditorStateChange = async (editorState) => {
    setEditEditorState(editorState);
    const convertedData = convertToRaw(editorState.getCurrentContent());
    setDescription(JSON.stringify(convertedData))
  }

//handles deleting post
    const handleDelete = async () =>{
         dispatch({type:"CURSOR_NOT_ALLOWED_START"});
        try{
                await axiosPrivate.delete(`${BASE_URL}/posts/${path}`, {data: {username: logUser.userId, role: logUser.role}}, { withCredentials: true,
                    headers:{authorization: `Bearer ${auth}`}
                    });
                  window.location.replace("/")
        }catch(err){
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            if(err.response.data == 'Sorry, you can not make a post at this moment'){
                 setDeletePostErrorState(true)
                return setUserBannedError(true)
            }
            if(err.response.data == 'Sorry, only verified users can delete their posts'){
                setDeletePostErrorState(true)
                return setNotVerifiedError(true)
            }
            if(err.response.data == "Post not found"){
                setDeletePostErrorState(true);
                return setNoPostFoundError(true)
            }
            if(err.response.data == "you can only delete your posts"){
                setDeletePostErrorState(true);
                return setNotAuthorizedError(true)
            }

            if(err.response.data == "Something went wrong"){
                setDeletePostErrorState(true);
                return setSomeThingWentWrongError(true)
            }
        }
       

    }

 
 
//this function handles the update of the post by the user
const handleUpdate = async () =>{
     dispatch({type:"CURSOR_NOT_ALLOWED_START"});
     
     //if imageDetails is present, that means user has uploaded an image while editing the post.
     if(imageDetails){
        const data = new FormData();
        data.append("username", logUser.userId);
        data.append("role", logUser.role);
        data.append('title', title);
        data.append('description', description)
        data.append('photoPublicId', imageDetails.publicId)
        data.append('postPhoto', imageDetails.url)
        

        try{
                await axiosPrivate.patch(`${BASE_URL}/posts/${path}`, data, { withCredentials: true,headers:{authorization: `Bearer ${auth}`}
                    });
                
                    dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
                    setUpdateMode(false);
                    //setShowCategories(false);
                    setReload(!reload)
                    //window.location.reload("/")
        }catch(err){
             dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
             if(err.response.data == "User not found"){
                return setUserNotFounderError(true)
             }
             if(err.response.data == "Sorry, you're banned from making posts"){
                return setUserBannedError(true)
             }
             if(err.response.data == "Sorry, only verified users can update their posts"){
                return setNotVerifiedError(true)
             }
            if(err.response.data == "No post with this Id found"){
                return setNoPostFoundError(true)
            }
            if(err.response.data == "you can only update your posts"){
                return setNotAuthorizedError(true)
            }
            if(err.response.data == "Something went wrong"){
                return setSomeThingWentWrongError(true)
            }
            if(err.response.data == "post title can not be empty"){
                return setPostTitleEmptyError(true)
            }

            if(err.response.data == 'post title should not be more than 60 characters'){
                return setPostTitleMaxError(true)
            }
            if(err.response.data == 'post title should not be less than 10 characters'){
                return setPostTitleMinError(true)
            }
        }     
                
     }else{
        const data = new FormData();
        data.append("username", logUser.userId);
        data.append("role", logUser.role);
        data.append('title', title);
        data.append('description', description);

        try{
                await axiosPrivate.patch(`${BASE_URL}/posts/${path}`, data, { withCredentials: true,headers:{authorization: `Bearer ${auth}`}
                    });
                
                    dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
                    setUpdateMode(false);
                    //setShowCategories(false);
                    setReload(!reload)
                    //window.location.reload("/")
        }catch(err){
             dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
             if(err.response.data == "User not found"){
                return setUserNotFounderError(true)
             }
             if(err.response.data == "Sorry, you're banned from making posts"){
                return setUserBannedError(true)
             }
             if(err.response.data == "Sorry, only verified users can update their posts"){
                return setNotVerifiedError(true)
             }
            if(err.response.data == "No post with this Id found"){
                return setNoPostFoundError(true)
            }
            if(err.response.data == "you can only update your posts"){
                return setNotAuthorizedError(true)
            }
            if(err.response.data == "Something went wrong"){
                return setSomeThingWentWrongError(true)
            }
             if(err.response.data == "post title can not be empty"){
                return setPostTitleEmptyError(true)
            }

            if(err.response.data == 'post title should not be more than 60 characters'){
                return setPostTitleMaxError(true)
            }
            if(err.response.data == 'post title should not be less than 10 characters'){
                return setPostTitleMinError(true)
            }
        }     
     }
       
}


//handle like and unlike
const handleLike = async ()=>{
    try{
        const response = await axiosPrivate.patch(`${BASE_URL}/posts/${path}/like`, 
            { withCredentials: true,headers:{authorization: `Bearer ${auth}`}}
        )
        
            setPost([response.data]);
    }catch(err){
        if(err.response.data == 'No user found'){
            setPostLikeError(true);
            return setUserNotFounderError(true)
        }
        if(err.response.data == 'no post found'){
            setPostLikeError(true);
            return setNoPostFoundError(true)
        }
        if(err.response.data === 'you are not athourized'){
            return setUserBannedError(true)
        }
        if(err.response.data == 'something went wrong'){
            setPostLikeError(true);
            return setSomeThingWentWrongError(true)
        }
        if(err.response.data === 'you are not verified yet'){
            return setNotVerifiedError(true)
        }
       
    }
}



//handle error states display
    
useEffect(()=>{
   

   if(userNotFoundError){
        setTimeout(() => {
        setUserNotFounderError(false)
    }, 2000);
   }
       
if(userbannedError){
    setTimeout(() => {
    setUserBannedError(false)
    }, 2000);
}
    
if(notVerifiedError){
    setTimeout(() => {
    setNotVerifiedError(false)
    }, 2000);
}
    
if(postNotFoundError){
setTimeout(() => {
setNoPostFoundError(false)
    }, 2000);
}

if(notAuthorizedError){
 setTimeout(() => {
    setNotAuthorizedError(false)
    }, 2000);
}

   
if(somethingWentWrongError){
 setTimeout(() => {
    setSomeThingWentWrongError(false)
    }, 2000);
}
   
if(postTitleEmptyError){
 setTimeout(() => {
    setPostTitleEmptyError(false)
    }, 2000);
}

if(postTitleMaxError){
 setTimeout(() => {
    setPostTitleMaxError(false)
    }, 2000);
}

if(postTitleMinError){
 setTimeout(() => {
    setPostTitleMinError(false)
}, 2000);
}    
if(deletePostErrorState){
 setTimeout(() => {
    setDeletePostErrorState(false)
    }, 2000);
}   

if(postLikeError){
 setTimeout(() => {
       setPostLikeError(false)
    }, 2000);
}   

    


   
   
}, [userNotFoundError, userbannedError, notVerifiedError, postNotFoundError, notAuthorizedError, somethingWentWrongError,
 postTitleMaxError, postTitleMinError, postTitleEmptyError, deletePostErrorState, postLikeError, 
])
    






    return (
        <>                
       {
           isLoading ? <div className='loading-div'><h1 className='loading-title'>Loading...</h1></div>:
            
           <div className='main-container'>
        {post.map((singleItem, index)=>{
            const {_id: postId} = singleItem
           console.log(singleItem, 'this is single item')
           
            const contentState = convertFromRaw(JSON.parse(singleItem.description));

            const editorState = EditorState.createWithContent(contentState); 
            
           
            
        return(
                <>
               
            <div className='singlePost ' key={postId}>
                <div className="singlePostWrapper" >
                
                {updateMode && <div><MdCancel className='cancel-edit-mode-btn' onClick={() => {setUpdateMode(false); setTitle(singleItem.title)}}/></div>}
                {updateMode ? <input type="text" value={title} className="singlePostTitleInput color1 center-text"

                     onChange={(e)=> setTitle(e.target.value)}

                 autoFocus/> : (
                    <h1 className='postTitle color3 center-text'>
                        {title}
                        
                        {username.username === logUser?.username && 
                        <div className="singlePostEdit">
                        <i className="singlePostIcon fas fa-edit" onClick={(id)=> setUpdateMode(true)}></i>
                        <i className="singlePostIcon far fa-trash-alt" onClick={handleDelete}></i>
                        </div>//this makes the edit button only available for logged in user who owns the post
                    }
                    
                    </h1>
                 ) }

               {
                !updateMode &&  <div className="singlePostInfo">
                    
                    <span 
                        className='singlePostAuthor'>
                            Author:  
                            <Link to={`/userProfile/${username._id}`} className="link">
                                  
                                <p className='text-general-small post-title-custom-text custom-authorname-text'><b>{ username.username}</b></p>
                          
                            
                            </Link>
                        
                    </span>
                    <p  className='singlePostDate text-general-small'> 
                       {new Date(singleItem.createdAt).toDateString()}
                         
                    </p>
                </div>
               }


                {/*If updatemode is true, show textarea for user to write context, if not, show p tag */}
                {updateMode ? <div className='edit-post-div editor '>
                    <EditEditor editorState={editEditorState}  
                     wrapperClassName=" custom-Editor-wrapper"
                      onEditorStateChange={onEditorStateChange}
                      
                      toolbar={{
                        textAlign: { inDropdown: true },
                        image: {uploadEnabled: true, uploadCallback: imageUploader,  previewImage: true, alt: { present: true }, defaultSize: {width: '700px', height: '400px'}},
                        fontSize: {
                        className: 'custom-fontzie',
                    
                    },
                    }}
                    />

                   
                </div> : 
                    <div className='paragraph-text editor custom-editor-div'> <Editor  readOnly={true}  editorState={ editorState} toolbarHidden 
                            plugins={[imagePlugin]}
                            
                    />
                    
                   
               
                {!updateMode && <div className='single-category-div'><h5>Category</h5><h5 className='cat-Text'>{categories}</h5></div>}
                
                 {/* delete post error texts start here */}


                {userbannedError && deletePostErrorState && <p className='paragraph-text red-text'>You are blocked from performing this action</p>}
                {notVerifiedError &&  deletePostErrorState && <p className='paragraph-text red-text'>Only verified user can delete their posts</p>}
                {postNotFoundError &&  deletePostErrorState && <p className='paragraph-text red-text'>Post not found</p>}
                {notAuthorizedError && deletePostErrorState && <p className='paragraph-text red-text'>You are not authorized to update this post</p>}
                {somethingWentWrongError && deletePostErrorState && <p className='paragraph-text red-text'>Something went wrong, contact support</p>}
                  {/* delete post error texts ends here */}

                {/* like post error start */}
                
                {userbannedError && <p className='paragraph-text red-text'>You are blocked from performing this action</p>}
                {notVerifiedError  && <p className='paragraph-text red-text'>Only verified user can can like posts</p>}
                {tokenError  && <p className='paragraph-text red-text'>Invalid validation</p>}
              
                {/*like post error ends */}
                </div>
                }
                 {/* error messages start */}
                    {userbannedError && updateMode && <p className='paragraph-text red-text'>You are blocked from performing this action</p>}
                    {userNotFoundError && updateMode &&<p className='paragraph-text red-text'>User not found</p>}
                    {notVerifiedError &&  updateMode && <p className='paragraph-text red-text'>Only verified user can update their posts</p>}
                    {postTitleMaxError &&  updateMode && <p className='paragraph-text red-text'>Post title should not be more than 60 characters</p>}
                    {postTitleEmptyError &&  updateMode && <p className='paragraph-text red-text'>Post title should not be empty</p>}
                    {postTitleMinError &&  updateMode && <p className='paragraph-text red-text'>Post title should not be less than 10 characters</p>}
                    {postNotFoundError &&  updateMode && <p className='paragraph-text red-text'>Post not found</p>}
                    {somethingWentWrongError &&  updateMode && <p className='paragraph-text red-text'>Something went wrong, contact support</p>}
                    {notAuthorizedError &&  updateMode && <p className='paragraph-text red-text'>You are not authorized to update this post</p>}
                    {/* Error messages end */}
                  
               
               
              
               
           {updateMode && <div className='flex custom-update-BTN-div'><button className="button-general singlePostButton" onClick={handleUpdate}>Update</button></div>} 
          
           </div>
           
            </div>
               
               {/*  Like button */}

               {post.postLikes}
                {/* post like error starts  */}
                {userNotFoundError && postLikeError &&<p className='paragraph-text red-text'>User not found</p>}
                {postNotFoundError &&  postLikeError && <p className='paragraph-text red-text'>Post not found</p>}
                {somethingWentWrongError && postLikeError && <p className='paragraph-text red-text'>Something went wrong, contact support</p>}


               {!updateMode && <div className='like-icon-div padding-bottom'>
                    <AiOutlineLike className={singleItem.postLikes.includes(logUser?.userId)?'like-icon like-icon-liked':  'like-icon' }onClick={handleLike}/>
                    {singleItem.postLikes.length < 1?<p className='paragraph-text color1'>0 person liked this post</p>: singleItem.postLikes.length == 1 ? <p className='paragraph-text color3'>1 person liked this post</p>: 
                    <p className='paragraph-text color1'>{singleItem.postLikes.length} People liked this post</p>}
               </div> }

               
                
                {!updateMode && <div className="social-media-display-div social-media-text">
            
            <h4 className='text-general-small color2 share-text'>Please share this post with your friends</h4>
            {/*  <HelmetMetaData title={singleItem.title} description={singleItem.description.substring(0, 250)}
                    image={PF + singleItem.postPhoto}
                />  
            <Share link={currentUrl}/>*/}
        </div> }
            </>
            )
        })}
       
       
            
        
       {!updateMode && <Comments/>}
        
     
     </div>
       
       }
      
        </>

       
    )
    
}
