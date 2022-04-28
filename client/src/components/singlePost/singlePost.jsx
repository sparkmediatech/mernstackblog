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
//import Helmet from '../socialshare/Helmet';

export default function SinglePost() {
    const location = useLocation()
    const path = location.pathname.split("/")[2];
    const [post, setPost] = useState([]);
    const PF = "http://localhost:5000/images/" // making the image folder publicly visible
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("");
    const [updateMode, setUpdateMode] = useState(false)
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false);   
    let currentUrl = `http://www.localhost:3000/post/${path}`;
    const {auth, logUser} = useContext(AuthContext);
    const axiosPrivate = useAxiosPrivate();


    
   
    

//anytime the path changes, trigger the useeffects by fetching the posts with that path
    useEffect(() => {
        
       const getPost = async () => {
      
           try{
              setIsLoading(true)
            const response = await axios.get("/posts/"+path )
            setPost([response.data]);
            setTitle(response.data.title);
            setDescription(response.data.description);
            setCategories(response.data.categories);
            
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
    try{
                await axiosPrivate.patch(`/v1/posts/${path}`, {
                    username: logUser.userId,
                    role: logUser.role, 
                    title:title, 
                    description: description
                    },{ withCredentials: true,headers:{authorization: `Bearer ${auth}`}
                    });
                 // window.location.reload("/")
                 setUpdateMode(false)
        }catch(err){
            console.log(err)
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
               {singleItem.postPhoto && (
                <img className='singlePostImg' 
                src={singleItem.postPhoto} alt="" />
                )}

                {/* if updatemode usestate is true, display input box to allow user write the title, if it is not true, display the H1 title   */}
                {/* the input box got the value of the current post title using the value attribute which I made to be post.title */}
                {updateMode ? <input type="text" value={title} className="singlePostTitleInput"

                     onChange={(e)=> setTitle(e.target.value)}

                 autoFocus/> : (
                    <h1 className='singlePostTitle'>
                        {title}
                        
                        { singleItem.username.username === logUser?.username && 
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
                            <Link to={`/?user=${singleItem.username._id}`} className="link">{/* this enabled us to access the posts made by individual users on homepage */}
                                                            {/*what we simply said when you click on the author's name, it should direct the path to homepage, using */}
                                                           {/*query for ?user, access the author's name. We have written codes on home page to fetch the author's post via query search  */}
                           
                                <b>{ singleItem.username.username}</b>
                          
                            
                            </Link>
                        
                    </span>
                    <span 
                        className='singlePostDate'>{new Date(singleItem.createdAt).toDateString()}
                         
                    </span>
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
               

                {updateMode && <div className='category-div'><h5>Category</h5>  <input className='category-box' type='text' value={categories}
                        onChange={(e)=>setCategories(e.target.value)}
                      /> </div>}
               
           {updateMode && <button className="singlePostButton" onClick={handleUpdate}>Update</button>} 
           </div>
            </div>
               
               
           
                <div className="social-media-display-div">
            
            <h4>Please share this post with your friends</h4>
             <HelmetMetaData title={singleItem.title} description={singleItem.description.substring(0, 250)}
                    image={PF + singleItem.postPhoto}
                />
            <Share link={currentUrl}/>
        </div> 
            </>
            )
        })}
       
       
            
        
        <Comments/>
        
           
     </div>
       
       }
        </>

       
    )
    
}
