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
     const [posts, setPosts] = useState([])
      const [loading, setLoading] = useState(false);
     const location = useLocation();// called the useLocation here under a variable called location

    const search = location.search

     useEffect( () => {
        
        setLoading(true)
        dispatch({ type: "ISLOADING_START" });
        const fetchPosts = async ()=>{
       
       const res = await axios.get(`${BASE_URL}/posts/`)//all we are saying is that fetch the posts with the query search entered. This could be author's name, category, etc
        setPosts(res.data)
        setLoading(false)
        dispatch({ type: "ISLOADING_END" });
        }
        fetchPosts()
         
    }, [])
    return (
        <div className='posts topMargin-medium '>
           
           {posts.slice(0,3).map((post, index)=>{
               
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

                
                <hr />
                <span className='postDate'> {new Date(post.createdAt).toDateString()}</span>
            </div>

            <p className='postDescription'>
                {post.description}
            </p>

        </div>
  
           })}
                
                     
           
           
        
        </div>
    )
}
