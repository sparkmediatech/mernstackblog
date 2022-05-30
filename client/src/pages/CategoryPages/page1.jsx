import axios from 'axios';
import React, {useEffect, useContext, useState} from 'react';
import './categorypages.css';
import  BASE_URL from '../../hooks/Base_URL';
import { Link } from 'react-router-dom';




function Page1() {
  const [page1, setPage1] = useState([]);
  const [pageTitle, setPageTitle] = useState('')
  //fetch page1 based on category index[0]
useEffect(()=>{
    const fetchPage1 = async ()=>{
      const indexNumber = {
        categoryIndex:0
      }
      try{
          const response = await axios.post(`${BASE_URL}/posts/page-0`, indexNumber);
          console.log(response.data.pageTitle)
          setPageTitle(response.data.pageTitle)
          setPage1(response.data.posts);
      }catch(err){
        console.log(err)
      }
        
    }
    fetchPage1();
}, [])

  return (
      <>
        <div className='page1-main-custom-div'>
            <div className='page-title-custom-div  '>
              <h3 className='page-title-text'>{pageTitle}</h3>
              <div className='flex-3 page-line '>
                     <div className='page-line1'></div>
                     <hr className='page-line2 '/>
              
                </div>

            </div>
            <div className='homePage-post-div  '>
                {page1.slice(0, 3).map((singlePagePost)=>{
                 const {title, _id, postPhoto, username,createdAt} = singlePagePost
                  return(
                    <>
                   
                    <div className='singlePost-div margin-small '>
                         {postPhoto &&(
                          <img className='postImg'src={postPhoto} alt="" />)}

                          <div className='page-post-title-custom-div'>
                      <Link to={`/post/${_id}`} className="link">
                        <h4 className='text-general-small margin-small page1-custom-title'>{title}</h4>
                      </Link>

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

export default Page1