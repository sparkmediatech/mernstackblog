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
     //const [replycomment, setReplyComment] = useState("");
     const [editReplyMode, setEditReplyMode] = useState(false);
     const [currentReply, setCurrentReply] = useState();
     const axiosPrivate = useAxiosPrivate();
     const {auth, logUser, dispatch} = useContext(AuthContext);
    //const [commentdescription, setCommentDescription] = useState('');
     const commentdescription = useRef(null);
     const replycomment = useRef(null);
     const [commentState, setCommentState] = useState(true)
     
   

//fetched comment from database here
    useEffect(() => {
        const getPost = async () =>{
             dispatch({type:"CURSOR_NOT_ALLOWED_START"}); 
            try{
                 const response = await axios.get(`${BASE_URL}/posts/`+path )
                 setComments(response.data.comments);
                 dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
              
            }catch(err){
                console.log(err)
                dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            }
        }
       getPost()
    }, [commentState])


//handled making comment
const handleComment = async ()=>{
    dispatch({type:"CURSOR_NOT_ALLOWED_START"}); 
    const newComment = {
        author: logUser.userId,
        role: logUser.role,
        commentdescription: commentdescription.current.value,
        
    };

    try{
        await axiosPrivate.post("/v1/comments/posts/"+ path + "/comment", newComment, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
            });
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            commentdescription.current.value = null;
            setCommentState(!commentState)
            
           
           //setCommentDescription('')
          
    }catch(err){
         dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
        console.log(err)
    }
};

//handle comment update
const handleCommentUpdate = async (id) =>{
    
    try{
          dispatch({type:"CURSOR_NOT_ALLOWED_START"});  
            await axiosPrivate.patch("/v1/comments/posts/"+ path + "/comment/" + id, {
             author: logUser.userId,
             role: logUser.role, 
             commentdescription:  commentdescription2,
            }, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
           })
           dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            setCommentState(!commentState);
            
           
    }catch(err){
        console.log(err);
        dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
    }
}

//handled the deletion of comment by the owner of the comment here
const  handleCommentDelete = async (id) =>{
   
    try{
         dispatch({type:"CURSOR_NOT_ALLOWED_START"}); 
        
        await axiosPrivate.delete(`/v1/comments/posts/${path}/comment/${id}`, {data: {author: logUser.userId, role: logUser.role}}, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
           })
           dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
           setCommentState(!commentState);
        
    }catch(err){
        dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
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
       await axiosPrivate.post(`/v1/reply/posts/${path}/comments/${id}/reply`, newReply, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}});
            dispatch({type:"CURSOR_NOT_ALLOWED_START"}); 
            setShowReply(false)
            replycomment.current.value = null
            setCommentState(!commentState)
    }catch(err){
        console.log(err);
        dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
    }
}

//handle reply update
const handleReplyUpdate = async (id) =>{
    try{
         dispatch({type:"CURSOR_NOT_ALLOWED_START"});
        await axiosPrivate.patch(`/v1/reply/${id}`, {
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
    }
}

//handle delete reply commmet

const handleDeleteComment = async (id, replyId)=>{
     try{
            dispatch({type:"CURSOR_NOT_ALLOWED_START"});
                await axiosPrivate.delete(`/v1/reply/posts/${path}/comments/${id}/reply/${replyId}`, {data: {author: logUser.userId, role: logUser.role}},
                { withCredentials: true,
                headers:{authorization: `Bearer ${auth}`}}
                );
                //window.location.reload()
                 dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
                 setCommentState(!commentState)
        }catch(err){
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});

        }
    
};




    return (
        <>
        <div className='comment-div'>
            <textarea className='comment-wrapper' type='text' placeholder='Share your comment' 
                ref={commentdescription} ></textarea>
            <button className="button-general comment-btn"onClick={handleComment}>Post Comment</button>
            </div>
        <div className="comment">

            <h5 className='users-comment'>Users' comments</h5>
                {comments.map((singleComment, index)=>{
                    const {author, commentdescription, _id, createdAt, replies} = singleComment
                    
                    return(
                        <>
                            {updateComment == _id ? 
                             <div className='comment-div' key={_id} >
            
                        <div className='flex-3'>
                            <textarea className='comment-wrapper' type='text' 
                                onChange={(e) => setCommentDescription2(e.target.value)} value={commentdescription2}>

                            </textarea>
                            <MdCancel className='cancel-comment-update-icon' onClick={()=>setUpdateComment()} />
                       </div>
                        <div className='custom-reply-btn-div'><button className="button-general-2 reply-custom-btn" onClick={() => handleCommentUpdate(_id)}>Update</button></div>
                        
                        </div>
                            :
                             <div className='displayed-comments'key={_id} >
                                 
                                
                                <div className="commentPic">
                                    
                                    <img className="user-pics" src={singleComment.author.profilePicture} alt="" />
                                      
                                </div>
                                <div className="comment-info">
                                    <div className="comment-author-div">
                                        <div className='comment-author-date-info'>
                                            <h4 className="comment-author">{singleComment.author.username}</h4>
                                             <p className="comment-date">{new Date(singleComment.createdAt).toDateString()}
                                                </p>
                                        </div>
                                       {
                                           singleComment.author.username == logUser?.username &&  //we hide the edit and delete buttons from non owner
                                           <div className="comment-edit-delete-div">
                                             <i className="singlePostIcon fas fa-edit" onClick={() => {setUpdateComment(_id); setCommentDescription2(commentdescription)}}  ></i>
                                                <i className="singlePostIcon far fa-trash-alt" onClick={() => handleCommentDelete(_id)}  ></i>

                                            </div>
                                       }
                                       
                                    </div>
                                    <p className="comment-content">{singleComment.commentdescription}</p>
                                    <div>
                                     {/* Reply text button   */}
                                    <h5 className="reply-comment" onClick={() => {setReplyMode(_id); setShowReply(!showReply)}}>Reply</h5>

                                {/* Reply comment text box container*/}

                                    {replyMode == _id ? showReply && <div className='reply-div'>
                                        <textarea className='comment-wrapper ' placeholder='Reply comment' ref={replycomment}>
                                        </textarea>
                                        <div className='custom-reply-btn-div'><button className='button-general-2 reply-custom-btn' onClick={()=> handleReply(_id)}>Reply</button></div>
                                    </div> : null}

                                        {/* comment replies section */}

                                        {replies.map((singleReply) =>{

                                            //console.log(singleReply)
                                            const {_id: replyId, author, createdAt, replycomment} = singleReply
                                            return(
                                                <>
                                                {
                                                    editReplyMode == replyId ?
                                                     <div className='comment-div' key={replyId} >
            
                                                        <textarea className='comment-wrapper' type='text' 
                                                            onChange={(e) => setCurrentReply(e.target.value)} value={currentReply}>

                                                        </textarea>
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
                                                                author.username == logUser ?.username && //hide the reply comment edit and delete buttons for non owners
                                                                <div className="comment-edit-delete-div">
                                                                <i className="singlePostIcon fas fa-edit" onClick={() => {setEditReplyMode(replyId); setCurrentReply(replycomment)}}></i>
                                                                <i className="singlePostIcon far fa-trash-alt"    
                                                                     onClick={()=> handleDeleteComment(_id, replyId)}//passed two id here. One for the comment and the other for the reply
                                                                     ></i>

                                                            </div>
                                                            }
                                                             
                                                            
                                                        </div>
                                                       <p className="comment-content">{replycomment}</p>      

                                                    </div>

                                                    </div>
                                                }
                                                    
                                                </>
                                            )
                                        })}
                                        
                                    </div>
                    
                                    
                                    
                                  
                                    
                                </div>
                                
                                
                            </div>
                        
                            }
                             
                             </>
                    )
              
                })}
 
        </div>

        </>
    )
}
