import React, {useMemo, useState, useCallback, Component, useContext, useEffect} from 'react';
import {BsCode, BsCardImage, BsFillCameraVideoFill, BsTypeUnderline, BsChatRightQuoteFill, BsTextParagraph, BsLink, } from 'react-icons/bs';
import {BiBold, BiItalic, BiDownArrow} from 'react-icons/bi';
import {MdOutlineFormatListBulleted, MdFormatListNumbered} from 'react-icons/md';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import './texteditor.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {AuthContext} from '../../context/AuthProvide';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import BASE_URL from '../../hooks/Base_URL';
import axios from "axios";
import { useMediaQuery } from '../../hooks/CustomMediaQuery';
//import { convertFromRaw } from 'draft-js';


function Texteditor() {
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );
   

  const [file, setFile] = useState('')
  const {auth, logUser, dispatch, setPathNameMount, pathNameMount} = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(editorState);
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const axiosPrivate = useAxiosPrivate();
  const [imageDetails, setImageDetails] = useState()
  const [arrayImagePublicId, setArrayImagePublicID] = useState([]);
  const [arrayImagePhotoURL, setArrayImagePhotoURL] = useState([]);
  const [catName, setCatName] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  //error handling states
  const [postTitleMaxError, setPostTitleMaxError] = useState(false);
  const [categorySetError, setCategorySetError] = useState(false);
  const [verifiedUserError, setVerifiedUserError] = useState(false);
  const [blockedUserError, setBlockedUserError] = useState(false);
  const [userNotFoundError, setUserNotFounderError] = useState(false);
  const [imgeUploadText, setImageUploadText] = useState(false)
  const [duplicatePostTitleError, setDubplicateTitleError] = useState(false);
  const [postTitleEmptyError, setPostTitleEmptyError] = useState(false);
  const [postTitleMinError, setPostTitleMinError] = useState(false);


  
  //fetch caetgories
   useEffect(()=>{
        const fetchCategory = async () =>{
            try{
                const response = await axios.get(`${BASE_URL}/category/`);
                 return setCatName(response.data);
            }catch(err){

            }
        }
        fetchCategory()
   }, []) 

  
  //upload image to cloudinary server
  const uploadImageCallBack = async (file) =>{
        const data = new FormData();
        const filename = Date.now() + file.name;
        data.append("name", filename);
        data.append("file", file);
    try{
      const response = await axiosPrivate.post(`${BASE_URL}/posts/uploadImage`,  data,{ withCredentials: true,
            headers:{authorization: `Bearer ${auth.token}`}
           
        },)

          //set image into file state to check if image is present before a post request is made
          setFile(file)
          //set image details to a state
          setImageDetails(response.data)
          //push selected post Ids into an array
          setArrayImagePhotoURL(prevArray => [...prevArray, response.data.url]);
          setArrayImagePublicID(prevArray => [...prevArray, response.data.publicId]);
          
         
           return new Promise(
            (resolve, reject) => {
              resolve({ data: { link: response.data.url } });
              }
              );
    }catch(err){

    }     
  }
 
  
    const onEditorStateChange = async (editorState) => {
    setEditorState(editorState);
    const convertedData = convertToRaw(editorState.getCurrentContent());
    setDescription(JSON.stringify(convertedData))
  }

  //handle select category
   const handleSelectCategory = (catId) =>{
        setSelectedCategoryId(catId)
   }

  //handle show category

const handleShowCategory = () =>{
    setShowCategories(!showCategories)
};

//handle posting of blog post
  const handleSubmit = async (e) =>{
     dispatch({type:"CURSOR_NOT_ALLOWED_START"});
      e.preventDefault();

       if(file){

        const data = new FormData();
        data.append("username", logUser.userId);
        data.append("role", logUser.role);
        data.append("title", title);
        data.append("description",  description);
        data.append('postPhoto', imageDetails.url)
        data.append("categories", selectedCategoryId);
        data.append('photoPublicId', JSON.stringify(arrayImagePublicId));
        data.append('postPhotoArray', JSON.stringify(arrayImagePhotoURL));

       
        
        try{
             const response = await axiosPrivate.post(`${BASE_URL}/posts`,  data,{ withCredentials: true,
            headers:{authorization: `Bearer ${auth.token}`}
           
        },)
        console.log(arrayImagePhotoURL, arrayImagePublicId);
        setPathNameMount(!pathNameMount)
        window.location = "/post/" + response.data._id;
        
        }catch(err){
           dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            if(err.response.data === 'Sorry, you can not make a post at this moment'){
            return setBlockedUserError(true)
        };
        if(err.response.data === 'Only verified users can perform this action'){
             return setVerifiedUserError(true)
        }
        if(err.response.data === "Post category should not be empty"){
            setCategorySetError(true)
        }
        if(err.response.data === 'Post title already exist'){
            setDubplicateTitleError(true)
        };
        if(err.response.data === "post title should not be more than 60 characters"){
            setPostTitleMaxError(true)
        };
        if(err.response.data === "post title should not be empty"){
            setPostTitleEmptyError(true)
        };
        if(err.response.data === "post title should not be less than 10 characters"){
            setPostTitleMinError(true)
        } 
         if(err.response.data == 'User not found'){
          return setUserNotFounderError(true)
        }
        }
       
       }else{
         dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
         setImageUploadText(true)
       }
        
  }

//useEffect to clear error messages after some seconds

useEffect(()=>{
  if(userNotFoundError){
    setTimeout(() => {
        setUserNotFounderError(false)
    }, 2000);

  }
  
  if(blockedUserError){
     setTimeout(() => {
        setBlockedUserError(false)
    }, 2000);
  }
   
if(blockedUserError){
   setTimeout(() => {
        setBlockedUserError(false)
    }, 2000);

}
if(verifiedUserError){
 setTimeout(() => {
        setVerifiedUserError(false)
    }, 2000);
}   
  
if(imgeUploadText){
   setTimeout(() => {
        setImageUploadText(false)
    }, 2000);
}

   
if(categorySetError){
  setTimeout(() => {
        setCategorySetError(false)
    }, 2000);
}
     
if(duplicatePostTitleError){
   setTimeout(() => {
        setDubplicateTitleError(false)
    }, 2000);
}
    
if(postTitleMaxError){
 setTimeout(() => {
      setPostTitleMaxError(false)
    }, 2000);
}
   
if(postTitleEmptyError){
  setTimeout(() => {
        setPostTitleEmptyError(false)
    }, 2000);
}
    
if(postTitleMinError){
 setTimeout(() => {
        setPostTitleMinError(false)
    }, 2000);
}
   

}, [userNotFoundError, blockedUserError, verifiedUserError, 
    imgeUploadText, categorySetError, duplicatePostTitleError,
    postTitleMaxError, postTitleEmptyError, postTitleMinError
    ]);



   return(
    <div className='formating-bar '>
      <form onSubmit={handleSubmit} className='submit-form'>
        <div className='editor-div'>
          <input type="text" placeholder='Write your post title here' className='custom-post-title-input'  onChange={e=> setTitle(e.target.value)}/>
          <Editor  editorState={editorState} 
          wrapperClassName="custom-editor-wrapper"
          editorClassName="custom-editor-className"
          toolbarClassName="toolbar-class"
          onEditorStateChange={onEditorStateChange}
          toolbar={{
             options: ['inline', 'image', 'blockType',  'list', 'textAlign',  'history', ],
                      inline: { inDropdown: true, className: 'custom-toolbox no-display', },
                      list: { inDropdown: true, className: 'custom-toolbox no-display', },
                      textAlign: { inDropdown: true, className: 'custom-toolbox ', },
                      link: { inDropdown: true, className: 'custom-toolbox',},
                      history: { inDropdown: true, className: 'custom-toolbox no-display',},
                      image: {uploadEnabled: true, className: 'custom-toolbox custom-img', uploadCallback: uploadImageCallBack,  previewImage: true, alt: { present: true }, defaultSize: {width: '700px', height: '400px'}},
                      
                      
                      
           
            
            
          }}
        />

         {/* error messages start */}
              {blockedUserError && <p className='paragraph-text red-text'>You are blocked from making this post</p>}
              {userNotFoundError && <p className='paragraph-text red-text'>User not found</p>}
              {verifiedUserError && <p className='paragraph-text red-text'>Only verified user can make post</p>}
              {imgeUploadText && <p className='paragraph-text red-text'>A post must have an image</p>}
              {categorySetError && <p className='paragraph-text red-text'>Post category must not be empty</p>}
              {duplicatePostTitleError && <p className='paragraph-text red-text'>A post with this title already exist, please change your post title</p>}
              {postTitleMaxError && <p className='paragraph-text red-text'>Post title should not be more than 60 characters</p>}
              {postTitleEmptyError && <p className='paragraph-text red-text'>Post title should not be empty</p>}
              {postTitleMinError && <p className='paragraph-text red-text'>Post title should not be less than 10 characters</p>}
          {/* Error messages end */}
        </div>
        <div className='category-div'><p className='text-general-small color3 custom-category-text-title '>Category</p>  <input className='input-general category-box margin-small  color3' type='text' placeholder='category here...'
                            value={selectedCategoryId}
                            
                           readOnly
                            /> 
          <div>
            <button onClick={handleShowCategory} className=' select-category-custom-BTN button-general ' type='button'>Select Category</button>

              <div className={showCategories ? ' margin-small category-display-main-div category-display-main-div-animated ': 'category-display-main-div'}>
                {catName.map((singleCat)=>{
                  const {catName, _id: catId} = singleCat;
                    {console.log(catName)}
                      return (
                              <>
                                <div className={showCategories ? 'custom-single-category-div' : 'no-display-cat'}>
                                  <p onClick={()=> handleSelectCategory(catName)} className='text-general-small category-name-text color3'>{catName}</p>
                                </div>
                              </>   
                            )
                          })}

              </div> 
          </div>
        </div> 
         <div className='submit-btn-div'><button type="submit" className="button-general custom-submit-btn"> Submit  </button></div>
      </form>
       
    </div>
    
    
   )
 
    
    
}

export default Texteditor