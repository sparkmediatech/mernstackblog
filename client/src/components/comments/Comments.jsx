import { useLocation } from 'react-router';
import React, {useEffect, useState, useContext, useRef} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./comment.css"
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {AuthContext} from '../../context/AuthProvide';
import BASE_URL from '../../hooks/Base_URL';
import {MdCancel, MdTrendingUp} from 'react-icons/md'


export default function Comments() {
     const PF = "http://localhost:5000/images/";
     const location = useLocation()
     const path = location.pathname.split("/")[2];
     const [comments, setComments] = useState([]);
     const [updateComment, setUpdateComment] = useState(false);
     const [commentdescription2, setCommentDescription2] = useState();
     const [showReply, setShowReply] = useState(false);
     const [replyMode, setReplyMode] = useState(false);
     const [editReplyMode, setEditReplyMode] = useState(false);
     const [currentReply, setCurrentReply] = useState();
     const axiosPrivate = useAxiosPrivate();
     const {auth, logUser, dispatch} = useContext(AuthContext);
     const commentdescription = useRef(null);
     const replycomment = useRef(null);
     const [commentState, setCommentState] = useState(true);
     const [selectedCommentId, setSelectedCommentId] = useState('')


    //error states
    const [noUserFound,setNoUserFoundError] = useState(false);
    const [bannedUserError, setBannedUserError] = useState(false);
    const [userUnverifiedError,setUserUnverifiedError] = useState(false);
    const [emptyCommentError,setEmptyCommentError] = useState(false);
    const [commentNumberError, setCommentNumberError] = useState(false);
    const [somethingWentWrongError, setSomethingWentWrongError] = useState(false);
    const [noUserPostFoundError,setNoUserPostFoundError] = useState(false);
    const [noUserFoundUpdateError,setNoUserFoundUpdateError] = useState(false);
    const [bannedUserUpdateError, setBannedUserUpdateError] = useState(false);
    const [userVerifiedUpdateError, setUserVerifiedUpdateError] = useState(false);
    const [noCommentFoundUpdateError, setNoCommentFoundUpdateError] = useState(false);
    const [commentEmptyUpdateError, setCommentEmptyUpdateError] = useState(false);
    const [commentNumberUpdateError, setCommentNumberUpdateError] = useState(false);
    const [notOwnerUpdateError, setNotOwnerUpdateError] = useState(false);
    const [somethingWentWrongUpdateError, setSomethingWentWrongUpdateError] = useState(false);
    const [contentNotFoundComment, setContentNotFoundComment] = useState(false);
    const [somethingWentWrongCommentError, setSomethingWentWrongCommentError] = useState(false);
    const [noUserFoundReplyError, setNoUserFoundReplyError] = useState(false);
    const [blockedUserReplyError, setBlockedUserReplyError] = useState(false);
    const [userUnverifiedReplyError, setUserUnverifiedReplyError] = useState(false);
    const [somethingWentWrongReplyError, SetSomethingWentWrongReplyError] = useState(false);
    const [notFoundReplyError, setNotFoundReplyError] = useState(false);
    const [emptyCommentReplyError, setEmptyCommentReplyError] = useState(false);
    const [commentNumberReplyError, setCommentNumberReplyError] = useState(false);
    const [noUserFoundReplyUpdate, setNoUserFoundReplyUpdate] = useState(false);
    const [userBlockedReplyUpdateError, setUserBlockedReplyUpdateError] = useState(false);
    const [userUnverifiedReplyUpdateError, setUserUnverifiedReplyUpdateError] = useState(false);
    const [commentUpdateEmptyError, setCommentUpdateEmptyError] = useState(false);
    const [commentNumberUpdateReplyError, setCommentNumberUpdateReplyError] = useState(false);
    const [replyCommentNotFoundUpdateError, setReplyCommentNotFoundUpdateError] = useState(false);
    const [replyUpdateNotUnauthorizedError, setReplyUpdateNotUnauthorizedError] = useState(false);
    const [somethingWentWrongReplyUpdateError, setSomethingWentWrongReplyUpdateError] = useState(false);
    const [missingValuesReplyError, setMissingValuesReplyError] = useState(false);
    const [unverifiedUserReplyError, setUnverifiedUserReplyError] = useState(false);
    const [userBannedReplyError, setUserBannedReplyError] = useState(false);
    const [userAccessDeniedReplyError, setUserAccessDeniedReplyError] = useState(false);
    const [somethingWentWrongDelReply, setSomethingWentWrongDelReply] = useState(false)
   

//fetched comment from database here
    useEffect(() => {
        const ourRequest = axios.CancelToken.source() 
        const getPost = async () =>{
             dispatch({type:"CURSOR_NOT_ALLOWED_START"}); 
            try{
                 const response = await axios.get(`${BASE_URL}/posts/`+path, {cancelToken: ourRequest.token})
                 setComments(response.data.comments);
                 dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
              
            }catch(err){
                console.log(err)
                dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            }
        }
       getPost()
    return () => {
    ourRequest.cancel() // <-- 3rd step
  }
    }, [commentState])


//handled making comment
const handleComment = async ()=>{
     const ourRequest = axios.CancelToken.source() 
   
    const newComment = {
        author: logUser.userId,
        role: logUser.role,
        commentdescription: commentdescription.current.value,
        
    };
         dispatch({type:"CURSOR_NOT_ALLOWED_START"}); 
    try{
        await axiosPrivate.post(`${BASE_URL}/comments/posts/${path}/comment`, newComment, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
            });
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            commentdescription.current.value = null;
            setCommentState(!commentState)
            
           
           //setCommentDescription('')
          
    }catch(err){
         dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
        if(err.response.data === 'No user found'){
            setNoUserFoundError(true)
        }
       if(err.response.data == 'Sorry, are banned from making comment at this time'){
        return setBannedUserError(true)
       }
       
     if(err.response.data == 'your account is not verified yet'){
        return setUserUnverifiedError(true)
     }
     if(err.response.data == 'comment must not be empty'){
        return setEmptyCommentError(true)
     }
    if(err.response.data == 'comment should not be a number'){
        return setCommentNumberError(true)
    }
    if(err.response.data == "Something went wrong"){
        return setSomethingWentWrongError(true)
    }
    if(err.response.data == 'No post or user found'){
        return setNoUserPostFoundError(true)
    }
    }



    return () => {
    ourRequest.cancel() // <-- 3rd step
  }
};

//handle comment update
const handleCommentUpdate = async (id) =>{
    
    try{
          dispatch({type:"CURSOR_NOT_ALLOWED_START"});  
            await axiosPrivate.patch(`${BASE_URL}/comments/posts/${path}/comment/` + id, {
             author: logUser.userId,
             role: logUser.role, 
             commentdescription:  commentdescription2,
            }, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
           })
           dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            setCommentState(!commentState);
            setUpdateComment(false)
            
           
    }catch(err){
        console.log(err);
        dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
        if(err.response.data == 'No user, found'){
            return setNoUserFoundUpdateError(true)
        }
    if(err.response.data == 'Sorry, you are banned from performing this action at the moment'){
        return setBannedUserUpdateError(true)
    }

    if(err.response.data == 'Sorry, only verified users can update their comment'){
        return setUserVerifiedUpdateError(true)
    }

    if(err.response.data == `No comment with the id found`){
        return setNoCommentFoundUpdateError(true)
    }
    if(err.response.data == 'comment must not be empty'){
        return setCommentEmptyUpdateError(true)
    }
    if(err.response.data == 'comment should not be a number'){
        return setCommentNumberUpdateError(true)
    }
    if(err.response.data == "you can only update your comment"){
        return setNotOwnerUpdateError(true)
    }
    if(err.response.data == "Something went wrong"){
        return setSomethingWentWrongUpdateError(true)
    }
    }
}

//handled the deletion of comment by the owner of the comment here
const  handleCommentDelete = async (id) =>{
   
    try{
         dispatch({type:"CURSOR_NOT_ALLOWED_START"}); 
        
        await axiosPrivate.delete(`${BASE_URL}/comments/posts/${path}/comment/${id}`, {data: {author: logUser.userId, role: logUser.role}}, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
           })
           dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
           setCommentState(!commentState);
           setSelectedCommentId('')
        
    }catch(err){
        dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
        if(err.response.data == "User or Post or comment not found"){
            return setContentNotFoundComment(true)
        }
      if(err.response.data == "Something went wrong"){
        return setSomethingWentWrongCommentError(true)
      }  
    }
}

//function to handle reply comment

const handleReply = async (id) =>{
    console.log(id)
    const newReply ={
        author: logUser.userId,
        role: logUser.role,
        replycomment: replycomment.current.value,
    };

    try{
        dispatch({type:"CURSOR_NOT_ALLOWED_START"}); 
       await axiosPrivate.post(`${BASE_URL}/reply/posts/${path}/comments/${id}/reply`, newReply, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}});
            dispatch({type:"CURSOR_NOT_ALLOWED_START"}); 
            setCommentState(!commentState)
            setShowReply(false)
            replycomment.current.value = null
            
    }catch(err){
        console.log(err);
        dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
        if(err.response.data == 'No user found'){
            return setNoUserFoundReplyError(true)
        }
    if(err.response.data == 'Sorry, you are banned from creating comment at this time'){
        return setBlockedUserReplyError(true)
    }
    if(err.response.data == 'Only verified users can create comment'){
        return setUserUnverifiedReplyError(true)
    }
    if(err.response.data == 'Something went wrong'){
        return SetSomethingWentWrongReplyError(true)
    }
    if(err.response.data == "Not found"){
        return setNotFoundReplyError(true)
    }
    if(err.response.data = 'comment must not be empty'){
        return setEmptyCommentReplyError(true)
    }

    if(err.response.data == 'comment should not be a number'){
        return setCommentNumberReplyError(true)
    }
    }
}

//handle reply update
const handleReplyUpdate = async (id) =>{
    try{
         dispatch({type:"CURSOR_NOT_ALLOWED_START"});
        await axiosPrivate.patch(`${BASE_URL}/reply/${id}`, {
             author: logUser.userId,
             role: logUser.role, 
             replycomment: currentReply,},
             { withCredentials: true,
                headers:{authorization: `Bearer ${auth}`}}
             )
           //window.location.reload()
          dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            setReplyMode(true);
            setEditReplyMode(false);
            setCommentState(!commentState)
    }catch(err){
        console.log(err);
        dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});

        if(err.response.data == 'No user found'){
            return setNoUserFoundReplyUpdate(true)
        }
    if(err.response.data == 'Sorry, you are banned from performing this action at the moment'){
        return setUserBlockedReplyUpdateError(true)
    }
    if(err.response.data == 'Only verified users can edit their comment'){
        return setUserUnverifiedReplyUpdateError(true)
    }

    if(err.response.data == 'comment must not be empty'){
        return setCommentUpdateEmptyError(true)
    }

    if(err.response.data == 'comment should not be a number'){
        return setCommentNumberUpdateReplyError(true)
    }

    if(err.response.data == "Reply comment not found"){
        return setReplyCommentNotFoundUpdateError(true)
    }

    if(err.response.data == "you can only update your comment"){
        return setReplyUpdateNotUnauthorizedError(true)
    }

    if(err.response.data == "Something went wrong"){
        return setSomethingWentWrongReplyUpdateError(true)
    }
    }
}

//handle delete reply commmet

const handleDeleteComment = async (id, replyId)=>{
     try{
            dispatch({type:"CURSOR_NOT_ALLOWED_START"});
                await axiosPrivate.delete(`${BASE_URL}/reply/posts/${path}/comments/${id}/reply/${replyId}`, {data: {author: logUser.userId, role: logUser.role}},
                { withCredentials: true,
                headers:{authorization: `Bearer ${auth}`}}
                );
                //window.location.reload()
                 dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
                 setCommentState(!commentState)
        }catch(err){
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});

            if(err.response.data == "Required content is missing"){
                return setMissingValuesReplyError(true)
            }

            if(err.response.data == "Only verified users can delete their comment"){
                return setUnverifiedUserReplyError(true)
            }

            if(err.response.data == 'Sorry, you are banned from performing this action at the moment'){
                return setUserBannedReplyError(true)
            }

            if(err.response.data == "you can only delete your posts"){
                return setUserAccessDeniedReplyError(true)
            }

        if(err.response.data == "something went wrong"){
            return setSomethingWentWrongDelReply(true)
        }

        }
    
};


//error notification timer

useEffect(()=>{
    if(noUserFound){
        setTimeout(() => {
            setNoUserFoundError(false)
        }, 3000);
    }
  if(bannedUserError){
    setTimeout(() => {
        setBannedUserError(false)
    }, 3000);
  }

  if(userUnverifiedError){
     setTimeout(() => {
       setUserUnverifiedError(false)
    }, 3000);
  }
if(emptyCommentError){
    setTimeout(() => {
        setEmptyCommentError(false)
    }, 3000);
}


if(commentNumberError){
    setTimeout(() => {
        setCommentNumberError(false)
    }, 3000);
}

if(somethingWentWrongError){
    setTimeout(() => {
        setSomethingWentWrongError(false)
    }, 3000);
}

if(noUserPostFoundError){
    setTimeout(() => {
        setNoUserFoundError(false)
    }, 3000);
}


if(bannedUserUpdateError){
    setTimeout(() => {
       setBannedUserUpdateError(false)
    }, 3000);
}

if(noUserFoundUpdateError){
    setTimeout(() => {
       setNoUserFoundUpdateError(false)
    }, 3000);
}

if(userVerifiedUpdateError){
    setTimeout(() => {
       setUserVerifiedUpdateError(false)
    }, 3000);
}

if(noCommentFoundUpdateError){
    setTimeout(() => {
       setNoCommentFoundUpdateError(false)
    }, 3000);
}

if(commentEmptyUpdateError){
    setTimeout(() => {
        setCommentEmptyUpdateError(false)
    }, 3000);
}

if(commentNumberUpdateError){
   setTimeout(() => {
       setCommentNumberUpdateError(false)
    }, 3000);  
}

if(notOwnerUpdateError){
    setTimeout(() => {
        setNotOwnerUpdateError(false)
    }, 3000);
}

if(somethingWentWrongUpdateError){
    setTimeout(() => {
        setSomethingWentWrongUpdateError(false)
    }, 3000);
}

if(contentNotFoundComment){
    setTimeout(() => {
        setContentNotFoundComment(false)
    }, 3000);
}

if(somethingWentWrongCommentError){
    setTimeout(() => {
        setSomethingWentWrongCommentError(false)
    }, 3000);
}


if(noUserFoundReplyError){
    setTimeout(() => {
        setNoUserFoundReplyError(false)
    }, 3000);
}

if(blockedUserReplyError){
    setTimeout(() => {
    setBlockedUserReplyError(false)
    }, 3000);
}


if(userUnverifiedReplyError){
    setTimeout(() => {
    setUserUnverifiedReplyError(false)
    }, 3000);
}

if(somethingWentWrongReplyError){
    setTimeout(() => {
    SetSomethingWentWrongReplyError(false)
    }, 3000);
}


if(notFoundReplyError){
    setTimeout(() => {
    setNotFoundReplyError(false)
    }, 3000);
}

if(emptyCommentReplyError){
    setTimeout(() => {
    setEmptyCommentReplyError(false)
    }, 3000);
}

if(commentNumberReplyError){
    setTimeout(() => {
    setCommentNumberReplyError(false)
    }, 3000);
}

if(noUserFoundReplyUpdate){
    setTimeout(() => {
    setNoUserFoundReplyUpdate(false)
    }, 3000);
}

if(userBlockedReplyUpdateError){
    setTimeout(() => {
        setUserBlockedReplyUpdateError(false)
    }, 3000);
}


if(userUnverifiedReplyUpdateError){
    setTimeout(() => {
        setUserUnverifiedReplyUpdateError(false)
    }, 3000);
}

if(commentUpdateEmptyError){
    setTimeout(() => {
        setCommentUpdateEmptyError(false)
    }, 3000);
}

if(commentNumberUpdateReplyError){
    setTimeout(() => {
        setCommentNumberUpdateReplyError(false)
    }, 3000);
}
if(replyCommentNotFoundUpdateError){
  setTimeout(() => {
        setReplyCommentNotFoundUpdateError(false)
    }, 3000);  
}

if(replyUpdateNotUnauthorizedError){
   setTimeout(() => {
        setReplyUpdateNotUnauthorizedError(false)
    }, 3000);  
}

if(missingValuesReplyError){
    setTimeout(() => {
        setMissingValuesReplyError(false)
    }, 3000);
}


if(unverifiedUserReplyError){
    setTimeout(() => {
        setUnverifiedUserReplyError(false)
    }, 3000);
}

if(userBannedReplyError){
    setTimeout(() => {
        setUserBannedReplyError(false)
    }, 3000);
}


if(userAccessDeniedReplyError){
    setTimeout(() => {
        setUserAccessDeniedReplyError(false)
    }, 3000);
}

if(somethingWentWrongDelReply){
    setTimeout(() => {
        setSomethingWentWrongDelReply(false)
    }, 3000);
}


}, [noUserFound, bannedUserError, userUnverifiedError, emptyCommentError, commentNumberError, somethingWentWrongError, noUserPostFoundError, bannedUserUpdateError, noUserFoundUpdateError, 
userVerifiedUpdateError, noCommentFoundUpdateError, commentEmptyUpdateError, commentNumberUpdateError, notOwnerUpdateError, somethingWentWrongUpdateError, contentNotFoundComment, somethingWentWrongCommentError,
noUserFoundReplyError, blockedUserReplyError, userUnverifiedReplyError, somethingWentWrongReplyError, notFoundReplyError, emptyCommentReplyError, commentNumberReplyError, noUserFoundReplyUpdate, userBlockedReplyUpdateError,
userUnverifiedReplyUpdateError, commentUpdateEmptyError, commentNumberUpdateReplyError, replyCommentNotFoundUpdateError, replyUpdateNotUnauthorizedError, missingValuesReplyError, unverifiedUserReplyError,
userBannedReplyError, userAccessDeniedReplyError, somethingWentWrongDelReply

])





    return (
        <>
        <div className='comment-div'>
            <textarea className='comment-wrapper' type='text' placeholder='Share your comment' 
                ref={commentdescription} ></textarea>

            {/* error display starts here  */}
           
            {noUserFound &&<h6 className='red-text text-general-extral-small margin-small-small'>No user found</h6>}

            {bannedUserError &&<h6 className='red-text text-general-extral-small margin-small-small'>You are banned from making comment</h6>}

            {userUnverifiedError &&<h6 className='red-text text-general-extral-small margin-small-small'>You have not verified your account</h6>}

            {emptyCommentError &&<h6 className='red-text text-general-extral-small margin-small-small'>Comment can not be empty</h6>}

            {commentNumberError &&<h6 className='red-text text-general-extral-small margin-small-small'>Comment can not be all number</h6>}
            {somethingWentWrongError &&<h6 className='red-text text-general-extral-small margin-small-small'>Something went wrong, refresh page</h6>}
            {noUserPostFoundError &&<h6 className='red-text text-general-extral-small margin-small-small'>No user of post found, refresh</h6>}
           


            {/* error display ends here  */}

            <button className="button-general comment-btn"onClick={handleComment}>Post Comment</button>
            </div>
        <div className="comment">

            <h5 className='users-comment'>Users' comments</h5>
                {comments?.map((singleComment, index)=>{
                    const {author, commentdescription, _id, createdAt, replies} = singleComment || {}
                    
                    return(
                        <>
                            {updateComment == _id ? 
                             <div className='comment-div' key={_id} >
            
                        <div className='flex-3' >
                            <textarea className='comment-wrapper' type='text' 
                                onChange={(e) => setCommentDescription2(e.target.value)} value={commentdescription2}>

                            </textarea>
                 

                            <MdCancel className='cancel-comment-update-icon' onClick={()=>setUpdateComment()} />

                       </div>
                 {/* user comment update error starts here  */}

                    {noUserFoundUpdateError &&<h6 className='red-text text-general-extral-small margin-small-small'>No user found</h6>}

                    {bannedUserUpdateError &&<h6 className='red-text text-general-extral-small margin-small-small'>You are banned from making comment</h6>}

                    {userVerifiedUpdateError &&<h6 className='red-text text-general-extral-small margin-small-small'>You are yet to verify your account</h6>}

                    {noCommentFoundUpdateError &&<h6 className='red-text text-general-extral-small margin-small-small'>Comment not found</h6>}

                    {commentEmptyUpdateError &&<h6 className='red-text text-general-extral-small margin-small-small'>Comment must not be empty</h6>}

                    {commentNumberUpdateError &&<h6 className='red-text text-general-extral-small margin-small-small'>Comment must not be all numbers</h6>}

                    {notOwnerUpdateError &&<h6 className='red-text text-general-extral-small margin-small-small'>You can only update your own comment</h6>}

                    {somethingWentWrongUpdateError &&<h6 className='red-text text-general-extral-small margin-small-small'>Something went wrong, refresh</h6>}

                 {/* user comment update ends here  */}


                        <div className='custom-reply-btn-div'><button className="button-general-2 reply-custom-btn" onClick={() => handleCommentUpdate(_id)}>Update</button></div>
                        
                        </div>
                            :
                             <div className='displayed-comments'key={_id} >
                                 
                                
                                <div className="commentPic">
                                    
                                    <img className="user-pics" src={singleComment?.author?.profilePicture} alt="" />
                                      
                                </div>
                                <div className="comment-info">
                                    <div className="comment-author-div">
                                        <div className='comment-author-date-info'>
                                            {console.log(singleComment?.author?.username)}
                                            <h4 className="comment-author">{singleComment?.author?.username}</h4>
                                             <p className="comment-date">{new Date(singleComment?.createdAt)?.toDateString()}
                                                </p>
                                        </div>
                                       {
                                           singleComment.author.username == logUser?.username &&  //we hide the edit and delete buttons from non owner
                                           <div className="comment-edit-delete-div">
                                             <i className="singlePostIcon fas fa-edit" onClick={() => {setUpdateComment(_id); setCommentDescription2(commentdescription)}}  ></i>
                                                <i className="singlePostIcon far fa-trash-alt" onClick={() => {handleCommentDelete(_id); setSelectedCommentId(_id)} }  ></i>

                                            </div>
                                       }
                                       
                                    </div>
                                    <p className="comment-content">{singleComment?.commentdescription}</p>
                                    
                                    <div>
                                     {/* Reply text button   */}
                                    <h5 className="reply-comment" onClick={() => {setReplyMode(_id); setShowReply(!showReply)}}>Reply</h5>
                                       
                                    

                                {/* Reply comment text box container*/}

                                    {replyMode == _id ? showReply && <div className='reply-div'>
                                        <textarea className='comment-wrapper ' placeholder='Reply comment' ref={replycomment}>
                                        </textarea>



                                        {noUserFoundReplyError&&<h6 className='red-text text-general-extral-small margin-small-small'>No user found</h6>}

                                        {blockedUserReplyError &&<h6 className='red-text text-general-extral-small margin-small-small'>You are blocked from commenting</h6>}

                                        {userUnverifiedReplyError &&<h6 className='red-text text-general-extral-small margin-small-small'>You are not verified yet</h6>}

                                        {somethingWentWrongReplyError &&<h6 className='red-text text-general-extral-small margin-small-small'>You are not verified yet</h6>}

                                        {notFoundReplyError &&<h6 className='red-text text-general-extral-small margin-small-small'>Missing paramters, refresh</h6>}

                                        {emptyCommentReplyError &&<h6 className='red-text text-general-extral-small margin-small-small'>Comment can not be empty</h6>}

                                        {commentNumberReplyError &&<h6 className='red-text text-general-extral-small margin-small-small'>Comment can not be all numbers</h6>}

                                        




                                        <div className='custom-reply-btn-div'><button className='button-general-2 reply-custom-btn' onClick={()=> handleReply(_id)}>Reply</button></div>
                                        
                                    </div> 
                                    
                                    : null}

                                        {/* comment replies section */}

                                        {replies.map((singleReply, index) =>{

                                            //console.log(singleReply)
                                            const {_id: replyId, author, createdAt, replycomment} = singleReply
                                            return(
                                                <>
                                                {
                                                    editReplyMode == replyId ?
                                                     <div className='comment-div' key={_id} >

                                                        <div className='flex-3'>
                                                            <textarea className='comment-wrapper' type='text' 
                                                            onChange={(e) => setCurrentReply(e.target.value)} value={currentReply}>

                                                        </textarea>
                                                        <MdCancel className='general-cursor-pointer' onClick={()=> setEditReplyMode(false)}/>
                                                        </div>


                                                        {noUserFoundReplyUpdate &&<h6 className='red-text text-general-extral-small margin-small-small'>No user found</h6>}

                                                        {userBlockedReplyUpdateError &&<h6 className='red-text text-general-extral-small margin-small-small'>You are blocked from commenting</h6>}

                                                        {userUnverifiedReplyUpdateError &&<h6 className='red-text text-general-extral-small margin-small-small'>You are not verified yet</h6>}

                                                        { commentUpdateEmptyError &&<h6 className='red-text text-general-extral-small margin-small-small'>Comment can not be empty</h6>}

                                                        {commentNumberUpdateReplyError &&<h6 className='red-text text-general-extral-small margin-small-small'>Comment can not be all numbers</h6>}

                                                        {replyCommentNotFoundUpdateError &&<h6 className='red-text text-general-extral-small margin-small-small'>Comment not found</h6>}

                                                        {replyUpdateNotUnauthorizedError &&<h6 className='red-text text-general-extral-small margin-small-small'>Access denied</h6>}

                                                        {somethingWentWrongReplyUpdateError &&<h6 className='red-text text-general-extral-small margin-small-small'>Something went wrong, refresh</h6>}



                                                        <button className='comment-btn' onClick={() => handleReplyUpdate(replyId)}>Update Reply</button>
                                                          
                                                     </div>:

                                                    <div className='display-reply-comment' key={replyId}>
                                                    <div className='commentPic'>
                                                            <img className='user-pics' src={author.profilePicture} alt="" />
                                                    </div>

                                                    <div className='comment-info'>
                                                        <div className="comment-author-div">
                                                            <div className='comment-author-date-info'>
                                                                <h4 className="comment-author">{author.username}</h4>
                                                                <p className="comment-date">{new Date(createdAt).toDateString()}</p>

                                                            </div>
                                                            
                                                            {
                                                                author.username == logUser?.username && //hide the reply comment edit and delete buttons for non owners
                                                                <div className="comment-edit-delete-div">
                                                                <i className="singlePostIcon fas fa-edit" onClick={() => {setEditReplyMode(replyId); setCurrentReply(replycomment)}}></i>
                                                                <i className="singlePostIcon far fa-trash-alt"    
                                                                     onClick={()=> {handleDeleteComment(_id, replyId); setSelectedCommentId(replyId)}}//passed two id here. One for the comment and the other for the reply
                                                                     ></i>

                                                            </div>
                                                            }
                                                             
                                                            
                                                        </div>
                                                       <p className="comment-content">{replycomment}</p>      

                                                    </div>
                                                   
                                                    </div>
                                                    
                                                }
                                                {selectedCommentId == replyId &&  
                                                missingValuesReplyError &&<h6 className='red-text text-general-extral-small margin-small-small'>Missing required value</h6>}

                                                 {selectedCommentId == replyId &&  
                                                unverifiedUserReplyError &&<h6 className='red-text text-general-extral-small margin-small-small'>You are not verified yet</h6>}

                                                 {selectedCommentId == replyId &&  
                                                    userBannedReplyError  &&<h6 className='red-text text-general-extral-small margin-small-small'>Your account is blocked</h6>}
                                                
                                                {selectedCommentId == replyId &&  
                                                    userAccessDeniedReplyError  &&<h6 className='red-text text-general-extral-small margin-small-small'>Access denied </h6>}

                                                 {selectedCommentId == replyId &&  
                                                    somethingWentWrongDelReply  &&<h6 className='red-text text-general-extral-small margin-small-small'>Something went wrong </h6>}

                                               
                                                </>
                                            )
                                        })}
                                        
                                    </div>
                    
                                    
                                    
                                  
                                    
                                </div>
                               
                               
                            </div>
                        
                            }

                               
                                {contentNotFoundComment && _id == selectedCommentId &&<h6 className='red-text text-general-extral-small margin-small-small marginLeft-extraSmall'>One of the required values not found</h6>}
                                {somethingWentWrongCommentError && _id == selectedCommentId &&<h6 className='red-text text-general-extral-small margin-small-small marginLeft-extraSmall'>Something went wrong</h6>} 
                             </>
                    )
              
                })}
 
        </div>

        </>
    )
}
