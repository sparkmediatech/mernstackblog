import './write.css';
import React,{useContext, useState, useEffect} from 'react';
import axios from "axios";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {AuthContext} from '../../context/AuthProvide';
import PageLoader from '../../components/pageLoader/PageLoader';
import BASE_URL from '../../hooks/Base_URL';






//console.log(AutoRefreshToken())
export default function Write() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const {auth, logUser, dispatch} = useContext(AuthContext);
    const [userNotFoundError, setUserNotFounderError] = useState(false);
    const [blockedUserError, setBlockedUserError] = useState(false);
    const [verifiedUserError, setVerifiedUserError] = useState(false);
    const [catName, setCatName] = useState([]);
    const [showCategories, setShowCategories] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState('')
    const [imgeUploadText, setImageUploadText] = useState(false)
    const [categorySetError, setCategorySetError] = useState(false);
    const [duplicatePostTitleError, setDubplicateTitleError] = useState(false);
    const [postTitleMaxError, setPostTitleMaxError] = useState(false);
    const [postTitleEmptyError, setPostTitleEmptyError] = useState(false);
    const [postTitleMinError, setPostTitleMinError] = useState(false)
  
   

   
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

   console.log(catName)

   //handle select category

   const handleSelectCategory = (catId) =>{
        setSelectedCategoryId(catId)
   }

//handles the submittion of post and uploading of images
const handleSubmit = async (e) =>{
    e.preventDefault();
     dispatch({type:"CURSOR_NOT_ALLOWED_START"});

    const newPost = {
        username: logUser.userId,
        role: logUser.role,
        title,
        description,
        categories:selectedCategoryId
       
    };
   
   //logic behind uploading image and the image name
    if(file){                    
        const data = new FormData();
        const filename = Date.now() + file.name;
        data.append("name", filename);
        data.append("file", file);
        data.append("username", logUser.userId);
        data.append("role", logUser.role);
        data.append("title", title);
        data.append("description", description);
         data.append("categories", selectedCategoryId);
        try{
       
            const response = await axiosPrivate.post('/v1/posts',  data,{ withCredentials: true,
            headers:{authorization: `Bearer ${auth.token}`}
           
        },)
        window.location.replace("/post/" + response.data._id, );
      
        
    }catch(err){
         dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
        console.log(err)

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
       
    }
    }else{
        setImageUploadText(true)
        dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
    }
    

};

//useEffect to clear error messages after some seconds

useEffect(()=>{
    setTimeout(() => {
        setUserNotFounderError(false)
    }, 2000);

    setTimeout(() => {
        setBlockedUserError(false)
    }, 2000);

     setTimeout(() => {
        setBlockedUserError(false)
    }, 2000);

    setTimeout(() => {
        setVerifiedUserError(false)
    }, 2000);

    setTimeout(() => {
        setImageUploadText(false)
    }, 2000);

     setTimeout(() => {
        setCategorySetError(false)
    }, 2000);

     setTimeout(() => {
        setDubplicateTitleError(false)
    }, 2000);

    setTimeout(() => {
        setPostTitleMaxError(false)
    }, 2000);

    setTimeout(() => {
        setPostTitleEmptyError(false)
    }, 2000);

    setTimeout(() => {
        setPostTitleMinError(false)
    }, 2000);

}, [userNotFoundError, blockedUserError, verifiedUserError, 
    imgeUploadText, categorySetError, duplicatePostTitleError,
    postTitleMaxError, postTitleEmptyError, postTitleMinError
    ]);


//handle show category

const handleShowCategory = () =>{
    setShowCategories(!showCategories)
};

//handl clear category input box


    return (
    <>
   
        <div className='write'>
            {file &&  <img 
               className='writeImg'
               src={URL.createObjectURL(file)} 
               alt="" />
            }
           
           <form className='writeForm' onSubmit={handleSubmit}>
              
              
                <div className="writeFormGroup">
                    <label htmlFor="fileInput">
                    <i className="writeIcon fas fa-plus"></i>
                    </label>
                    <input type="file" className='fileUpload' id='fileInput'  
                        onChange={e=> setFile(e.target.files[0])} 
                    />                                               {/* the code syntax to upload image via using onchange method */}
                    <input type="text" placeholder='Title' className='writeInput' 
                     autoFocus={true} 
                     onChange={e=> setTitle(e.target.value)}
                    />
                </div>
                    <div className="writeFormGroup">
                        <textarea placeholder='Tell your story...' 
                        type='text' 
                        className='writeInput writetext'
                        onChange={e => setDescription(e.target.value)}
                        ></textarea>
                                   {/* I need to create the option to write category */}
                    </div>
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

                        <div className='category-div'><p className='text-general-small color3 '>Category</p>  <input className='input-general category-box margin-small  color3' type='text' placeholder='category here...'
                            value={selectedCategoryId}
                            
                           readOnly
                            /> 

                            <div>
                                    <button onClick={handleShowCategory} className='margin-small select-category-custom-BTN button-general ' type='button'>Select Category</button>

                               

                                    <div className={showCategories ? 'margin-small category-display-main-div category-display-main-div-animated': 'category-display-main-div'}>
                                        {catName.map((singleCat)=>{
                                             const {catName, _id: catId} = singleCat;
                                            {console.log(catName)}
                                            return (
                                                <>
                                                <div className='custom-single-category-div'>
                                                    <p onClick={()=> handleSelectCategory(catName)} className='text-general-small category-name-text color3'>{catName}</p>
                                                </div>
                                                </>   
                                                )
                                            })}

                                    </div>
                                  
                            </div>
                      
                        </div>
                      
                      <div className='btn-custom-div flex-2 flex '>
                             <button className="button-general write-custom-btn " type="subit">
                                 Publish
                            </button>
                      </div>
               
                    <br />
                   
           </form>
                        
        </div>
    </>    
    )
}
