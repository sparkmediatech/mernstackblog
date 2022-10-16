import axios from 'axios';
import React, {useEffect, useContext, useState} from 'react';
import './categorypages.css';
import  BASE_URL from '../../hooks/Base_URL';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../../hooks/CustomMediaQuery';




function Page1() {
  const [page1, setPage1] = useState([]);
  const [pageTitle, setPageTitle] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [postSelectedPostTitle, setSelectedPostTitle] = useState('');
  const [screenMode, setScreenMode] = useState();
  let   tabletMode = useMediaQuery('(max-width: 768px)');
  let   mobileMode = useMediaQuery('(max-width: 576px)');
  let   biggerScreen1 = useMediaQuery('(max-width: 992px)');  
  
  
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
        
      }
        
    }
    fetchPage1();
}, [])

//this controls the line animation under each post title
useEffect(()=>{

  if(selectedId && postSelectedPostTitle){
      //check the random post title length
       const postTitle = postSelectedPostTitle.split('');
       const randomPostTitleCount = postTitle.filter(word => word !== '').length * 1.3;
       
      document.documentElement.style.setProperty('--postTitleLine', `${randomPostTitleCount}%`);
      //const nextSlide = (getComputedStyle(document.documentElement).getPropertyValue('--postTitleLine'))
     
  }
}, [selectedId, setSelectedId]);



//This fucntion gets the window's size and passes number based on the winodow size. This number is called to be used to slice method for rendering posts number
useEffect(()=>{
    if(tabletMode && !mobileMode){
       return setScreenMode(2)
    }
    else if(!biggerScreen1 && !tabletMode && !mobileMode){
        return setScreenMode(3)
    }

    else if(biggerScreen1 && !tabletMode && !mobileMode){
      return setScreenMode(2)
    }
    else if(mobileMode){
      return setScreenMode(1)
    }
}, [ tabletMode, screenMode, mobileMode]);



console.log(page1)
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
                {page1.slice(0, screenMode).map((singlePagePost)=>{
                 const {title, _id, postPhoto, username,createdAt} = singlePagePost
                  return(
                    <>
                   
                    <div className='singlePost-div margin-small ' onMouseEnter={()=> {setSelectedId(_id); setSelectedPostTitle(title)}} onMouseLeave={()=> {setSelectedId(''); setSelectedPostTitle('')}}>
                         {postPhoto &&(
                          <img className='postImg'src={postPhoto} alt="" />)}

                          <div className='page-post-title-custom-div'>
                      <Link to={`/post/${_id}`} className="link">
                        <h4 className={selectedId == _id ? 'text-general-small margin-small color2 transitionText': 'text-general-small margin-small'}>{title}</h4>
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

export default Page1