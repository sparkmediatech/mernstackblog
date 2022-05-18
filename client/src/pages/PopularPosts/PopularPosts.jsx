import React, {useEffect, useContext, useState} from 'react'
import './popularpost.css';
import axios from 'axios';
import  BASE_URL from '../../hooks/Base_URL'
import {Link} from "react-router-dom"

function PopularPosts() {
  const [popularPosts, setPopularPosts] = useState([])

    useEffect(()=>{
        const getPopularPost = async ()=>{
          try{
              const res = await axios.get(`${BASE_URL}/popular`)
              console.log(res.data)
              setPopularPosts(res.data)
          }catch(err){

          }
         
        }
         getPopularPost()
    }, [])
    console.log(popularPosts)
  return (
      <>
        <div className='topMargin-medium popular-post-div'>
           {popularPosts.map((singlePopularPost) =>{
             return(
               <div className='popular-posts'>
                 {singlePopularPost.postPhoto &&(
            <img 
            className='postImg'
            src={singlePopularPost.postPhoto} alt="" />
            )}

             <div className='postInfo'>
                <div className='postCats'>
                   {console.log(singlePopularPost.categories)}
                </div>
                
                <Link to={`/post/${singlePopularPost._id}`} className="link">
                    <span className='postTitle'>{singlePopularPost.title}</span>
                </Link>

                
                <hr />
                <span className='postDate'> {new Date(singlePopularPost.createdAt).toDateString()}</span>
            </div>
               </div>
             )
           })}
        </div>
      </>
   
  )
}

export default PopularPosts