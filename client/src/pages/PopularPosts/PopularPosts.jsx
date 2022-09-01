import React, {useEffect, useContext, useState} from 'react'
import './popularpost.css';
import axios from 'axios';
import  BASE_URL from '../../hooks/Base_URL'
import {Link} from "react-router-dom"

function PopularPosts() {
  const [popularPosts, setPopularPosts] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [postSelectedPostTitle, setSelectedPostTitle] = useState('')

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

//this controls the line animation under each post title
useEffect(()=>{

  if(selectedId && postSelectedPostTitle){
      //check the random post title length
       const postTitle = postSelectedPostTitle.split('');
       const randomPostTitleCount = postTitle.filter(word => word !== '').length *1.3;
       
      document.documentElement.style.setProperty('--postTitleLine', `${randomPostTitleCount}%`);
      //const nextSlide = (getComputedStyle(document.documentElement).getPropertyValue('--postTitleLine'))
     
  }
}, [selectedId, setSelectedId])
  return (
      <>
        <div className='margin-small homePage-post-div'>
           {popularPosts.slice(0, 3).map((singlePopularPost) =>{
             return(
               <div className='popular-posts' onMouseEnter={()=> {setSelectedId(singlePopularPost._id); setSelectedPostTitle(singlePopularPost.title)}} onMouseLeave={()=> {setSelectedId(''); setSelectedPostTitle('')}}>
                 {singlePopularPost.postPhoto &&(
            <img 
            className='postImg'
            src={singlePopularPost.postPhoto} alt="" />
            )}

             <div className='postInfo'>
                
                
                <Link to={`/post/${singlePopularPost._id}`} className="link">
                    <h4 className={selectedId == singlePopularPost._id ? 'text-general-small margin-small transitionText color2': "text-general-small margin-small" }>{singlePopularPost.title}</h4>
                </Link>
                 <div className={selectedId == singlePopularPost._id ? 'animated-popular-post-title-line popular-post-title-line transitionText' : 'transitionText latest-post-line-div'}></div>
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