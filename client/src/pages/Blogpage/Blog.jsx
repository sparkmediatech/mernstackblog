import React, {useEffect, useState, useContext} from 'react';
import { useLocation } from 'react-router';
import './blog.css';
import axios from 'axios';
import {MdNavigateNext, MdNavigateBefore} from 'react-icons/md'
import {FcNext, FcPrevious} from 'react-icons/fc'
import {GrPrevious} from 'react-icons/gr';
import {AuthContext} from '../../context/AuthProvide';
import { useHistory, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import BASE_URL from '../../hooks/Base_URL';
import axiosPrivate from '../../hooks/AxiosPrivate';

function Blog() {
  const [allPosts, setAllPosts] = useState([]);
  const location = useLocation()
  const path = Number(location.pathname.split("/")[3]);
  const history = useHistory();  
  const { dispatch, query, searchState, setQuery, blogPageName, setgeneralFetchError,categoryName, setCategoryName, searchRef } = useContext(AuthContext);

 

  
 



  //get all posts based on the value of data. We could get posts based on user search term or category name or simply fetch all posts

  useEffect(() =>{
   console.log(searchRef?.current?.value, 'search ref')
    const ourRequest = axios.CancelToken.source() 
    const fetchAllPosts = async () =>{
      
    const search = {
        search: searchRef?.current?.value
       }

    const catName = {
        catName: categoryName
      }

    let data;

    if(searchRef?.current?.value && !categoryName){
      console.log('I tested ref search')
      data = search
    }
  
  
    if(categoryName && !searchRef?.current?.value){
      console.log('I tested ref cat')
      data = catName
    }
    
    if(!searchRef?.current?.value && !categoryName){
      console.log('I tested ref all')
      data = data
    }
     
      try{
          dispatch({type:"CURSOR_NOT_ALLOWED_START"});
          const response = await axiosPrivate.post(`${BASE_URL}/posts/searches?page=${path}`, data, {cancelToken: ourRequest.token})
          dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
          setAllPosts(response.data)
          //setQuery('')
          searchRef.current.value = ''
        }catch(err){
          setQuery('')
          dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
          if(err.response.data == 'something went wrong'){
            return setgeneralFetchError(true)
          }
        }       
         
    }
    
    fetchAllPosts()

    return () => {
      ourRequest.cancel() // <-- 3rd step
    }
  }, [path, searchState, categoryName,])






/*call this API route when category is set as search term by the user
  useEffect(() =>{
    const ourRequest = axios.CancelToken.source() 
   
      const fetchCategoryPosts = async () =>{
        const catName = {
          catName: categoryName
        }
      
      }
      
      fetchCategoryPosts()
      return () => {
        ourRequest.cancel() // <-- 3rd step
     
    }
  }, [categoryName, path])*/



//handle prev
const handlePrev = () =>{
  history.push(`/${blogPageName}/page/${path - 1}`);
  //setPage(page - 1)
}

//handle next
const handleNext = ()=>{
  if(allPosts.length > 11){
    history.push(`/${blogPageName}/page/${path + 1}`);
    //setPage(page + 1)
  }
  
    
}

//this function takes care of assigning category name to the category state which is pushed to the request body

const handleCategorySearch = (categories)=>{
  setCategoryName(categories);
 
}


console.log(allPosts.length, 'lenghth post')
  return (
    <div className='custom-all-posts-wrapper flex-2 center-flex-align-display'>
      <div className=' blog-page-custom-div'><h4 className='text-general-BIG custom-blog-text'>Blog</h4></div>
       
      
      <div className='custom-allPosts-main-div margin-small mainContainer center-flex-justify-display '>
      
         {allPosts.map((singlePosts, key) =>{
          //console.log(singlePosts)

          const {postPhoto, title, _id, createdAt, username, categories} = singlePosts || {}
          return(
            <>
              <div key={key} className='single-post-custom-div marginLeft-sm  margin-small flex-2'>
                  <div className='custom-allPosts-img-div'><img src={postPhoto} alt="" /></div>
                  <div className='custom-general-allposts-div '><Link to={`/post/${_id}`} className='link'><p className='text-general-small2 color3 custom-blog-post-title-text'>{title}</p></Link></div>
                  <div className='custom-general-allposts-div'><p className='text-general-small color1'>{username?.username}</p></div>
                   <div className='custom-general-allposts-div custom-category-allPost-div colorBG'><p onClick={() => handleCategorySearch(categories)} className='text-general-small white-text general-cursor-pointer'>{categories}</p></div>
                  <div className='custom-general-allposts-div'><p className='text-general-small color1'>{new Date(createdAt).toDateString()}</p></div>
              </div>
            
            </>
          )
        })}
     
      </div>
     
    <div className='flex-3 next-prev-div  center-flex-justify-display center-flex-align-display'>
      <div className='flex-2 prev-next-custom-wrapper-div center-flex-align-display'>{path > 1 && path !== allPosts.length &&
      <>
      <MdNavigateBefore className='custom-next-prev-icon' onClick={handlePrev}/>
      <p className='margin-extra-small-Top color1 text-general-extral-small general-cursor-pointer'>PREV</p>
      </>
      
      }
      </div>
      {allPosts.length !== 0 &&  <p className='color1 text-general-small general'>PAGE {path}</p>}
      <div className='flex-2 margin-left-sm1 prev-next-custom-wrapper-div  center-flex-align-display'>
       
          {
            
          allPosts.length > 0 &&
            <>
             <MdNavigateNext onClick={handleNext} className={allPosts.length > 11 ? 'custom-next-prev-icon' : 'custom-next-prev-icon diplayNavBTNNone'}/>
             <p className={allPosts.length > 11 ? 'margin-extra-small-Top color1 text-general-extral-small general-cursor-pointer': 'margin-extra-small-Top color1 text-general-extral-small general-cursor-pointer diplayNavBTNNone'}>NEXT</p>
            </>
          }
        
       
        </div>
    </div>
    </div>
  )
}

export default Blog