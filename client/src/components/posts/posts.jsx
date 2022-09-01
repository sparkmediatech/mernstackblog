import React, {useState, useEffect, useContext} from 'react';
import './posts.css'
import '../../pages/responsive.css'
import {Link} from "react-router-dom"
import  BASE_URL from '../../hooks/Base_URL'
import {AuthContext} from '../../context/AuthProvide';
import {useLocation} from "react-router-dom";
import axios from 'axios';
import Editor from '@draft-js-plugins/editor';
import {EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import createImagePlugin from '@draft-js-plugins/image';


export default function Posts() {//we picked the posts props and declared it
    const {auth, isLoading, dispatch, posts, setPosts} = useContext(AuthContext);      
    const [loading, setLoading] = useState(false);
    const location = useLocation();// called the useLocation here under a variable called location
    const search = location.search;
    const [selectedId, setSelectedId] = useState('');
    const [postSelectedPostTitle, setSelectedPostTitle] = useState('')
    const imagePlugin = createImagePlugin();

     useEffect( () => {
        
        setLoading(true)
        dispatch({ type: "ISLOADING_START" });
        const fetchPosts = async ()=>{

            try{
                const res = await axios.get(`${BASE_URL}/posts/`)
                setPosts(res.data)
                setLoading(false)
                dispatch({ type: "ISLOADING_END" });
            }catch(err){
                
            }            
                }
        fetchPosts()
         
    }, [])

//this controls the line animation under each post title
useEffect(()=>{

  if(selectedId && postSelectedPostTitle){
      //check the random post title length
       const postTitle = postSelectedPostTitle.split('');
       const randomPostTitleCount = postTitle.filter(word => word !== '').length * 1.2;
       
      document.documentElement.style.setProperty('--postTitleLine', `${randomPostTitleCount}%`);
    const nextSlide = (getComputedStyle(document.documentElement).getPropertyValue('--postTitleLine'))
     console.log(nextSlide, 'here here her')
  }
}, [selectedId])

    console.log(selectedId)
    return (
        <div className='posts margin-small '>
           
           {posts.slice(0,3).map((post, index)=>{
                const contentState = convertFromRaw(JSON.parse(post.description));
                const editorState = EditorState.createWithContent(contentState); 
               
               return <div className='post' onMouseEnter={()=> {setSelectedId(post._id); setSelectedPostTitle(post.title)}} onMouseLeave={()=> {setSelectedId(''); setSelectedPostTitle('')}}>
            {post.postPhoto &&(
            <img 
            className='postImg'
            src={post.postPhoto} alt="" />
            )}

            <div className='postInfo'>
                <div className='postCats'>
                   
                </div>
                
               <div className='latest-post-title-div'>
                 <Link to={`/post/${post._id}`} className="link">
                    <h4 className={selectedId == post._id ?'transitionText text-general-small margin-small color2': 'transitionText text-general-small margin-small'}>{post.title}</h4>
                </Link>
               </div>
                  <div className={selectedId == post._id ? 'animated-post-titlte-line latest-post-line-div transitionText' : 'transitionText latest-post-line-div'}></div>
                <div className='flex-3 post-name-date-div'>
                      <p className='text-general-small color1'>{post.username.username}</p><p className='text-general-small color1 postDate'> {new Date(post.createdAt).toDateString()}</p>
                  </div>
              
            </div>

          
            
           
        </div>
  
           })}
                
                     
           
           
        
        </div>
    )
}
