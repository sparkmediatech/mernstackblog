import axios from 'axios';
import React, {useEffect, useContext, useState} from 'react';
import './categorypages.css';
import  BASE_URL from '../../hooks/Base_URL';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../../hooks/CustomMediaQuery';

function Page3() {
  const [page3, setPage3] = useState([]);
  const [pageTitle, setPageTitle] = useState('');
  const [selectedId, setSelectedId] = useState('')
  const [postSelectedPostTitle, setSelectedPostTitle] = useState('')
  const [screenMode, setScreenMode] = useState();
  let   tabletMode = useMediaQuery('(max-width: 768px)');
  let   mobileMode = useMediaQuery('(max-width: 576px)');
  let   biggerScreen1 = useMediaQuery('(max-width: 1200px)');  
  //let   biggerScreen2 = useMediaQuery('(max-width: 1200px)');     

  //fetch page1 based on category index[0]
useEffect(()=>{
    const fetchPage3 = async ()=>{
      const indexNumber = {
        categoryIndex:4
      }
      try{
          const response = await axios.post(`${BASE_URL}/posts/page-0`, indexNumber);
          console.log(response.data.pageTitle)
          setPageTitle(response.data.pageTitle)
          setPage3(response.data.posts);
      }catch(err){
        console.log(err)
      }
        
    }
    fetchPage3();
}, [])

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


//This fucntion gets the window's size and passes number based on the winodow size. This number is called to be used to slice method for rendering posts number
useEffect(()=>{
   if(!biggerScreen1 && !tabletMode && !mobileMode){
        return setScreenMode(3)
    }

 
    else if(biggerScreen1 && !tabletMode && !mobileMode){
      return setScreenMode(2)
    }

    else if(tabletMode && !mobileMode){
       return setScreenMode(2)
    }
   
    
    else if(mobileMode){
      return setScreenMode(1)
    }
}, [ tabletMode, screenMode, mobileMode, biggerScreen1, ]);
  return (
      <>
        <div className='page1-main-custom-div page3-main-custom-div custom-page3-main-div'>
            <div className='page-title-custom-div page3-title-custom-div  '>
              <h3 className='page-title-text'>{pageTitle}</h3>
              <div className='flex-3 page-line '>
                     <div className='page-line1'></div>
                     <hr className='page-line2 '/>
              
                </div>

            </div>
            <div className='homePage-post-div homePage3-post-div  '>
                {page3.slice(0, screenMode).map((singlePagePost)=>{
                 const {title, _id, postPhoto, username,createdAt} = singlePagePost
                  return(
                    <>
                   
                    <div className='singlePost-page3-div margin-small ' onMouseEnter={()=> {setSelectedId(_id); setSelectedPostTitle(title)}} onMouseLeave={()=> {setSelectedId(''); setSelectedPostTitle('')}}>
                         {postPhoto &&(
                          <img className='page3-custom-image'src={postPhoto} alt="" />)}

                          <div className='page-post-title-custom-div'>
                      <Link to={`/post/${_id}`} className="link">
                        <h4 className={selectedId == _id ? 'transitionText text-general-small margin-small  color2': 'text-general-small margin-small transitionText'}>{title}</h4>
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

export default Page3