import React, {useEffect, useContext, useState} from 'react';
import axios from 'axios';
import './categorypages.css';
import  BASE_URL from '../../hooks/Base_URL';
import { Link } from 'react-router-dom';

function Page2() {
    const [page2, setPage2] = useState([]);
    const [pageTitle, setPageTitle] = useState('');
    const [selectedId, setSelectedId] = useState('')
    const [postSelectedPostTitle, setSelectedPostTitle] = useState('')
  //fetch page1 based on category index[0]
useEffect(()=>{
    const fetchPage1 = async ()=>{
      const indexNumber = {
        categoryIndex:1
      }
      try{
          const response = await axios.post(`${BASE_URL}/posts/page-0`, indexNumber);
          setPageTitle(response.data.pageTitle)
          setPage2(response.data.posts);
      }catch(err){
        console.log(err)
      }
        
    }
    fetchPage1();
}, []);

//this controls the line animation under each post title
useEffect(()=>{

  if(selectedId && postSelectedPostTitle){
      //check the random post title length
       const postTitle = postSelectedPostTitle.split('');
       const randomPostTitleCount = postTitle.filter(word => word !== '').length *1.3;
       
      document.documentElement.style.setProperty('--postTitleLine', `${randomPostTitleCount}%`);
      //const nextSlide = (getComputedStyle(document.documentElement).getPropertyValue('--postTitleLine'))
     
  }
}, [selectedId, setSelectedId]);

  return (
    <>
        <div className='page1-main-custom-div page2-custom-main-div flex-3'>
            <div className='page-title-custom-div  '>
              <h3 className='page-title-text'>{pageTitle}</h3>
              <div className='flex-3 page-line '>
                     <div className='page-line1'></div>
                     <hr className='page-line2 '/>
              
                </div>

            </div>
            <div className='homePage-post-div page2-homePage-custom-div  '>
                {page2.slice(0, 2).map((singlePagePost)=>{
                 const {title, _id, postPhoto, username, createdAt} = singlePagePost
                  return(
                    <>
                   
                    <div className='singlePost-div page2-singlePost-custom-div margin-small ' onMouseEnter={()=> {setSelectedId(_id); setSelectedPostTitle(title)}} onMouseLeave={()=> {setSelectedId(''); setSelectedPostTitle('')}} >
                         {postPhoto &&(
                          <img className='postImg page2-custom-image'src={postPhoto} alt="" />)}

                          <div className='page-post-title-custom-div'>
                      <Link to={`/post/${_id}`} className="link">
                        <h4 className={selectedId == _id ? 'text-general-small margin-small color2 transitionText' : 'text-general-small margin-small'}>{title}</h4>
                      </Link>
                     <div className={selectedId == _id ? 'page3-post-line-div animated-page3-post-line-div' : 'transitionText page3-post-line-div'}></div>
                    <div className='flex-3 post-name-date-div'>
                      <p className='text-general-small color1'>{username.username}</p><p className='text-general-small color1 postDate'> {new Date(createdAt).toDateString()}</p>
                    </div>
                    </div>
                    </div>

                    
                    </> 
                  )
                })}
            </div>
        </div>
      </>
    
  )
}

export default Page2