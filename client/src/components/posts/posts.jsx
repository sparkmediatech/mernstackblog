import React, {useState, useEffect, useContext} from 'react';

import './posts.css'
import '../../pages/responsive.css'
import {Link} from "react-router-dom"
import  BASE_URL from '../../hooks/Base_URL'
import {AuthContext} from '../../context/AuthProvide';
import {useLocation} from "react-router-dom";
import axios from 'axios';


export default function Posts() {//we picked the posts props and declared it
    const {auth, isLoading, dispatch} = useContext(AuthContext);
     const [posts, setPosts] = useState([]);
     
      const [loading, setLoading] = useState(false);
     const location = useLocation();// called the useLocation here under a variable called location

    const search = location.search

     useEffect( () => {
        
        setLoading(true)
        dispatch({ type: "ISLOADING_START" });
        const fetchPosts = async ()=>{
       
       const res = await axios.get(`${BASE_URL}/posts/`)
        setPosts(res.data)
        setLoading(false)
        dispatch({ type: "ISLOADING_END" });
        }
        fetchPosts()
         
    }, [])
    return (
        <div className='posts margin-small '>
           
           {posts.slice(0,3).map((post, index)=>{
               console.log(post)
               
               return <div className='post'>
            {post.postPhoto &&(
            <img 
            className='postImg'
            src={post.postPhoto} alt="" />
            )}

            <div className='postInfo'>
                <div className='postCats'>
                   
                </div>
                
                <Link to={`/post/${post._id}`} className="link">
                    <span className='postTitle'>{post.title}</span>
                </Link>

                <div className='flex-3 post-name-date-div'>
                      <p className='text-general-small color1'>{post.username.username}</p><p className='text-general-small color1 postDate'> {new Date(post.createdAt).toDateString()}</p>
                  </div>
                
            </div>

            <p className='postDescription'>
                {post.description}
            </p>

        </div>
  
           })}
                
                     
           
           
        
        </div>
    )
}
