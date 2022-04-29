import './write.css';
import React,{useContext, useState, useEffect} from 'react';
import axios from "axios";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {AuthContext} from '../../context/AuthProvide';
import PageLoader from '../../components/pageLoader/PageLoader';
import BASE_URL from '../../hooks/Base_URL'





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
  
   

   
    

   

//handles the submittion of post and uploading of images
const handleSubmit = async (e) =>{
    e.preventDefault();
     dispatch({type:"CURSOR_NOT_ALLOWED_START"});

    const newPost = {
        username: logUser.userId,
        role: logUser.role,
        title,
        description,
        categories,
       
    };
   //logic behind uploading image and the image name
    if(file){                    
        const data = new FormData();
        const filename = Date.now() + file.name;
        data.append("name", filename);
        data.append("file", file);
        newPost.postPhoto = filename
        try{
           const imageResponse = await axios.post(`${BASE_URL}/upload`,  data,)
           const imgUrl = imageResponse.data;
            console.log(imageResponse.data)
            newPost.postPhoto = imgUrl.url
        }catch(err){
            console.log(err)
        }
    }

    try{
       
        const response = await axiosPrivate.post('/v1/posts',  newPost, { withCredentials: true,
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
}, [userNotFoundError, blockedUserError, verifiedUserError])

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
                    {/* Error messages end */}

                      <div className='category-div'><p className='text-general-small'>Category</p>  <input className='category-box' type='text' placeholder='category'
                        onChange={(e)=>setCategories(e.target.value)}
                      /> </div>
                      <div className='btn-custom-div flex-2 flex '>
                             <button className=" write-custom-btn " type="subit">
                                 Publish
                            </button>
                      </div>
               
                    <br />
                   
           </form>
            
        </div>
    </>    
    )
}
