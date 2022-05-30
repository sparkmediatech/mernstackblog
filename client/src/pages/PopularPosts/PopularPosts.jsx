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
        <div className='margin-small homePage-post-div'>
           {popularPosts.slice(0, 3).map((singlePopularPost) =>{
             return(
               <div className='popular-posts'>
                 {singlePopularPost.postPhoto &&(
            <img 
            className='postImg'
            src={singlePopularPost.postPhoto} alt="" />
            )}

             <div className='postInfo'>
                
                
                <Link to={`/post/${singlePopularPost._id}`} className="link">
                    <span className='postTitle'>{singlePopularPost.title}</span>
                </Link>
                  <div className='flex-3 post-name-date-div'>
                      <p className='text-general-small color1'>{singlePopularPost.username.username}</p><p className='text-general-small color1 postDate'> {new Date(singlePopularPost.createdAt).toDateString()}</p>
                  </div>
                
            </div>
               </div>
             )
           })}
        </div>
      </>
   
  )
}

export default PopularPosts