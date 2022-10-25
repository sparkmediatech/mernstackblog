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
  const { dispatch, query, searchState, setQuery, blogPageName, setgeneralFetchError} = useContext(AuthContext);
  const [categoryName, setCategoryName] = useState('')
 

  
 

console.log(query)

  //get all posts

  useEffect(() =>{
    const fetchAllPosts = async () =>{
      const search = {
            search: query
           }
     
           if(query && !categoryName){
              try{
          dispatch({type:"CURSOR_NOT_ALLOWED_START"});
          const response = await axiosPrivate.post(`${BASE_URL}/posts/searches?page=${path}`, search)
          dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
          setAllPosts(response.data)
        }catch(err){
          dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
          if(err.response.data == 'something went wrong'){
            return setgeneralFetchError(true)
          }
        }

           }        
    }
    
    fetchAllPosts()
  }, [path, searchState])


//call this API route when category is set as search term by the user
  useEffect(() =>{
     const fetchCategoryPosts = async () =>{
      const catName = {
        catName: categoryName
      }
      
         try{
          dispatch({type:"CURSOR_NOT_ALLOWED_START"});
          const response = await axiosPrivate.post(`${BASE_URL}/posts/searches?page=${path}`, catName)
          dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
          setAllPosts(response.data)
        }catch(err){
          dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            if(err.response.data == 'something went wrong'){
            return setgeneralFetchError(true)
          }
        }
      }
     
    fetchCategoryPosts()
  }, [categoryName, path])

  console.log(categoryName, 'I am cat')

//handle prev
const handlePrev = () =>{
  history.push(`/${blogPageName}/page/${path - 1}`);
  //setPage(page - 1)
}

//handle next
const handleNext = ()=>{
  if(path < allPosts.length && path !== allPosts.length -1 ){
    history.push(`/${blogPageName}/page/${path + 1}`);
    //setPage(page + 1)
  }
  
    
}

//this function takes care of assigning category name to the category state which is pushed to the request body

const handleCategorySearch = (categories)=>{
  setCategoryName(categories);
  setQuery('')
}



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
            
            path < allPosts.length && path !== allPosts.length -1 && allPosts &&
            <>
             <MdNavigateNext onClick={handleNext} className='custom-next-prev-icon'/>
             <p className='margin-extra-small-Top color1 text-general-extral-small general-cursor-pointer'>NEXT</p>
            </>
          }
        
       
        </div>
    </div>
    </div>
  )
}

export default Blog