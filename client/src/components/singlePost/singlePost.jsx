import { useLocation } from 'react-router';
import React, {useEffect, useState, useContext} from 'react';
import './singlePost.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Comments from "../comments/Comments";
import Share from '../socialshare/share';
import HelmetMetaData from '../socialshare/Helmet';
import {AuthContext} from '../../context/AuthProvide';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import PageLoader from '../pageLoader/PageLoader';
import  BASE_URL from '../../hooks/Base_URL';
import {AiOutlineLike} from 'react-icons/ai';
import {MdCancel} from 'react-icons/md'


//import Helmet from '../socialshare/Helmet';

export default function SinglePost() {
    
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation()
    const path = location.pathname.split("/")[2];
    const [post, setPost] = useState([]);
    const PF = "http://localhost:5000/images/" // making the image folder publicly visible
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("");
    const [updateMode, setUpdateMode] = useState(false)
    const [categories, setCategories] = useState([]);
    const [username, setUsername] = useState();
    const [isLoading, setIsLoading] = useState(false);   
    let currentUrl = `http://www.localhost:3000/post/${path}`;
    const {auth, logUser, dispatch} = useContext(AuthContext);
    const [liked, setLiked] = useState();
    const [file, setFile] = useState(null);
    const [editImageMode, setEditImageMode] = useState(false);
    const [updatePostError, setUpdatePostError] = useState(false)
   


    
   
    

//anytime the path changes, trigger the useeffects by fetching the posts with that path
    useEffect(() => {
        
       const getPost = async () => {
      
           try{
              setIsLoading(true)
            const response = await axios.get(`${BASE_URL}/posts/${path}`)
            console.log(response.data)
            setUsername(response.data.username)
            setPost([response.data]);
            setTitle(response.data.title);
            setDescription(response.data.description);
            setCategories(response.data.categories);
            setLiked(response.data.postLikes)
            
            setIsLoading(false)
            
           }catch(err){

           }
       
       };
        
     return getPost()
    }, [path]);


//handles deleting post
    const handleDelete = async () =>{
        try{
                await axiosPrivate.delete(`/v1/posts/${path}`, {data: {username: logUser.userId, role: logUser.role}}, { withCredentials: true,
                    headers:{authorization: `Bearer ${auth}`}
                    });
                  window.location.replace("/")
        }catch(err){

        }
       

    }
//this function handles the update of the post by the user
const handleUpdate = async () =>{
     dispatch({type:"CURSOR_NOT_ALLOWED_START"});
     
     //if user didnt edit the post image, run this code
     if(!file){
        const data = new FormData();
        data.append("username", logUser.userId);
        data.append("role", logUser.role);
        data.append('title', title);
        data.append('description', description)

        try{
                await axiosPrivate.patch(`/v1/posts/${path}`, data, { withCredentials: true,headers:{authorization: `Bearer ${auth}`}
                    });
                 // window.location.reload("/")
                  dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
                 setUpdateMode(false)
        }catch(err){
                dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
                 
        }
//if user changed the post image, run this code
     }else{

        const data = new FormData();
        const filename = Date.now() + file.name;
        data.append("name", filename);
        data.append("file", file);
        data.append("username", logUser.userId);
        data.append("role", logUser.role);
        data.append('title', title);
        data.append('description', description)

        try{
                await axiosPrivate.patch(`/v1/posts/${path}`, data, { withCredentials: true,headers:{authorization: `Bearer ${auth}`}
                    });
                 // window.location.reload("/")
                  dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
                 setUpdateMode(false)
        }catch(err){
             dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            console.log(err)
        }

     }
     
                
}


//handle like and unlike
console.log(file)
const handleLike = async ()=>{
    try{
        const response = await axiosPrivate.patch(`/v1/posts/${path}/like`, 
            { withCredentials: true,headers:{authorization: `Bearer ${auth}`}}
        )
        console.log(response.data)
            setPost([response.data]);
    }catch(err){

    }
}

    return (
        <>                
       {
           isLoading ? <div className='loading-div'><h1 className='loading-title'>Loading...</h1></div>:
            
           <div className='main-container'>
        {post.map((singleItem, index)=>{
            const {_id: postId} = singleItem
            
            return(
                <>
        <div className='singlePost' key={postId}>
           <div className="singlePostWrapper" >
               
               {singleItem.postPhoto && !editImageMode &&  (
                <img className='singlePostImg' 
                src={singleItem.postPhoto} alt="" />
                )}
               
                {file && editImageMode &&  
                    <div className='edit-image-div'><img 
                        className='edit-writeImg'
                        src={URL.createObjectURL(file)} 
                         alt="" />
                    </div>
                }

               { updateMode && editImageMode &&
                    <div className="writeFormGroup">
                    <label htmlFor="fileInput">
                    <i className="writeIcon fas fa-plus"></i>
                    </label>
                    <input type="file" className='fileUpload' id='fileInput'  
                        onChange={e=> setFile(e.target.files[0])} 
                    />  
                                                             
                </div>
                }
                {updateMode && !editImageMode && <button onClick={() => setEditImageMode(true)} className='button-general-2 edit-imageBTN'>Edit Image</button>}
                 {updateMode && editImageMode && <button onClick={() => {setEditImageMode(false); }} className='button-general-2 edit-imageBTN'>Cancel</button>}
                
                {updateMode && <div><MdCancel className='cancel-edit-mode-btn' onClick={() => {setUpdateMode(false); setEditImageMode(false)}}/></div>}
                {updateMode ? <input type="text" value={title} className="singlePostTitleInput"

                     onChange={(e)=> setTitle(e.target.value)}

                 autoFocus/> : (
                    <h1 className='singlePostTitle'>
                        {title}
                        
                        {username.username === logUser?.username && 
                        <div className="singlePostEdit">
                        <i className="singlePostIcon fas fa-edit" onClick={(id)=> setUpdateMode(true)}></i>
                        <i className="singlePostIcon far fa-trash-alt" onClick={handleDelete}></i>
                        </div>//this makes the edit button only available for logged in user who owns the post
                    }
                    
                    </h1>
                 ) }

                <div className="singlePostInfo">
                    
                    <span 
                        className='singlePostAuthor'>
                            Author:  
                            <Link to={`/usersposts`} className="link">
                                  
                                <p className='text-general-small post-title-custom-text'><b>{ username.username}</b></p>
                          
                            
                            </Link>
                        
                    </span>
                    <p  className='singlePostDate text-general-small'> 
                       {new Date(singleItem.createdAt).toDateString()}
                         
                    </p>
                </div>
                {/*If updatemode is true, show textarea for user to write context, if not, show p tag */}
                {updateMode ? <textarea  className='singlePostDescInput' value={description} 
                    onChange={(e)=> setDescription(e.target.value)}
                
                    autoFocus/> : 
                    <div><p className='singlePostDesc'>
                   {description}
                </p>
                


                <div className='single-category-div'><h5>Category</h5><h5 className='cat-Text'>{categories}</h5></div>
                </div>
                }
               
                 {updatePostError && <p className='paragraph-text topMargin-medium red-text'>Post Image must not be empty</p>}
                {updateMode && <div className='category-div'><h5 className='text-general-small color1'>Category</h5>  <input className='category-box color3' type='text' value={categories}
                        onChange={(e)=>setCategories(e.target.value)}
                      /> </div>}
               
           {updateMode && <button className="button-general singlePostButton" onClick={handleUpdate}>Update</button>} 
          
           </div>
           
            </div>
               
               {/*  Like button */}

               {post.postLikes}

               {!updateMode && <div className='like-icon-div padding-bottom'>
                    <AiOutlineLike className={singleItem.postLikes.includes(logUser?.userId)?'like-icon like-icon-liked':  'like-icon' }onClick={handleLike}/>
                    {singleItem.postLikes.length < 1?<p className='paragraph-text color1'>0 person liked this post</p>: singleItem.postLikes.length == 1 ? <p className='paragraph-text color3'>1 person liked this post</p>: 
                    <p className='paragraph-text color1'>{singleItem.postLikes.length} People liked this post</p>}
               </div> }

               
                
                {!updateMode && <div className="social-media-display-div social-media-text">
            
            <h4 className='text-general-small color2 share-text'>Please share this post with your friends</h4>
             <HelmetMetaData title={singleItem.title} description={singleItem.description.substring(0, 250)}
                    image={PF + singleItem.postPhoto}
                />
            <Share link={currentUrl}/>
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
