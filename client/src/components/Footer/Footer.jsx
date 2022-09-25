import React, {useState, useEffect, useContext, useRef} from 'react';
import './footer.css';
import {AuthContext} from "../../context/AuthProvide";
import {FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaSearch} from 'react-icons/fa';
import {AiOutlineInstagram} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import  BASE_URL from '../../hooks/Base_URL';
import axios from 'axios';
import {BsCheckLg} from 'react-icons/bs'

function Footer() {
    const {auth, setAuth, logUser, websiteName, setWebsiteName, aboutWebsite, posts,dispatch} = useContext(AuthContext);
    const [changePostTitleColor, setChangePostTitleColor] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState();
    const [categories, setCategories] = useState();
    const subscriberNameRef = useRef();
    const subscriberEmailRef = useRef();
    const [subscribedText, setSubscribedText] = useState(false)

    //error states
    const [subEmailEmptyError, setSubEmailEmptyError] = useState(false);
    const [subNameEmptyError, setSubNameEmptyError] = useState(false);
    const [subNameAlreadyExistError, setSubNameAlreadyExistError] = useState(false);
    const [subEmailAlreadyExistError, setSubEmailAlreadyExistError] = useState(false);
    const [subEmailNumberError, setSubEmailNumberError] = useState(false);
    const [subNameNumberError, setSubNameNumberError] = useState(false);
    const [somethhingWentWrongError, setSomethingWentWrongError] = useState(false);

    //category error state
    const [noCategoryFound, setCategoryFound] = useState(false);
    const [somethingWentWrongCatError, setSomethingWentWrongCatError] = useState(false)

      //fetch all categories
    useEffect(()=>{
             const fetchAllCategories = async () =>{
            try{
                const res = await axios.get(`${BASE_URL}/category`);

                console.log(res.data)
                return setCategories(res.data);
                
            
            }catch(err){
                if(err.response.data === 'No categories found'){
                    return setCategoryFound(true);

                }
                if(err.response.data === 'something went wrong'){
                    return setSomethingWentWrongCatError(true)
                }

            }

            
        }
        fetchAllCategories() 
    }, [])

   //handle suscriber submission
   
   const handleNewSubscriber = async () =>{
     try{
            dispatch({type:"CURSOR_NOT_ALLOWED_START"});
                const response = await axios.post(`${BASE_URL}/emailsub/subscribe`,{
                subscriberName:  subscriberNameRef.current.value,
                subscriberEmail: subscriberEmailRef.current.value
            },)
             dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
             subscriberNameRef.current.value = '';
             subscriberEmailRef.current.value = '';
             setSubscribedText(true)
            }catch(err){
                 dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
                if(err.response.data === 'subscriber email must not be empty'){
                    return setSubEmailEmptyError(true)
                }

                if(err.response.data === 'subscriber name must not be empty'){
                    return setSubNameEmptyError(true)
                }

                if(err.response.data === 'subcriber name already exist'){
                    return setSubNameAlreadyExistError(true)
                }

                if(err.response.data === 'subcriber email already exist'){
                    return setSubEmailAlreadyExistError(true)
                }
                if(err.response.data == 'subscriber email should not be a number'){
                    return setSubEmailNumberError(true)
                }
                if(err.response.data === 'subscriber name should not be a number'){
                    return setSubNameNumberError(true)
                }
                if(err.response.data === 'something went wrong'){
                    return setSomethingWentWrongError(true)
                }
            }
   }


    
//handles notification
useEffect(()=>{
    setTimeout(() => {
        setSubEmailEmptyError(false)
    }, 3000);

    setTimeout(() => {
       setSubNameEmptyError(false)
    }, 3000);

    setTimeout(() => {
       setSubNameAlreadyExistError(false)
    }, 3000);

    setTimeout(() => {
       setSubEmailAlreadyExistError(false)
    }, 3000);

    setTimeout(() => {
       setSubEmailNumberError(false)
    }, 3000);

    setTimeout(() => {
       setSubNameNumberError(false)
    }, 3000);

    setTimeout(() => {
       setSomethingWentWrongError(false)
    }, 3000);

    setTimeout(() => {
       setSubscribedText(false)
    }, 3000);

    setTimeout(() => {
       setSomethingWentWrongCatError(false)
    }, 3000);

    setTimeout(() => {
       setCategoryFound(false)
    }, 3000);

}, [subEmailEmptyError, subNameEmptyError, subNameAlreadyExistError, subEmailAlreadyExistError, subEmailNumberError, subNameNumberError, somethhingWentWrongError, subscribedText, somethingWentWrongCatError,
noCategoryFound
])




  return (
      <>
            <div className=' footer-custom-main-div flex-3'>
                <div className='homePage-post-div custom-footer-main-wrapper '>
                        <div className='footer-section1 topMargin-medium flex-2'>
                            <h4 className='text-general-small2 color1 custom-footer-title-text'>{websiteName}</h4>
                            <p className='text-general-small white-text margin-small site-about-text'>
                                {aboutWebsite}
                            </p>
                            <div className='socialMedia-footer-icon-div margin-small'>
                                <FaFacebookF className='social-media-footer-icon '/>
                                <FaLinkedinIn className='social-media-footer-icon margin-left-sm1'/>
                                <FaTwitter className='social-media-footer-icon margin-left-sm1'/>
                                <FaYoutube className='social-media-footer-icon margin-left-sm1'/>
                                <AiOutlineInstagram className='social-media-footer-icon margin-left-sm1'/>
                            </div>

                        </div>

                        <div className='footer-section1 custom-footer-recent-post-section topMargin-medium'>
                           
                            <h4 className='text-general-small2 color1 custom-footer-title-text'>Recent Posts</h4>
                             {posts.slice(0, 3).map((singlePost) =>{
                               const {title, _id, createdAt, postPhoto} = singlePost;
                               return (
                                   <>
                                        <div className='flex-3 recent-post-main-div margin-small'>
                                            <div className='recent-post-img-div'><Link className='link'  to={`/post/${_id}`} ><img onMouseEnter={()=> {setChangePostTitleColor(true); setSelectedPostId(_id)}} className='recent-post-img' src={postPhoto} alt="" onMouseLeave={() => setChangePostTitleColor(false)} /></Link></div>
                                            <div className='recent-post-postTitle-div'><Link className='link' to={`/post/${_id}`}><p className={selectedPostId === _id && changePostTitleColor ? 'white-text recent-post-postTitle text-general-small color2': "white-text recent-post-postTitle text-general-small" }>{title}</p></Link></div>
                                        </div>
                                   </>
                               )
                            })}
                        </div>

                        <div className='footer-section1 topMargin-medium custom-footer-link-section'>
                            <h4 className='text-general-small2 color1 custom-footer-title-text'>Links</h4>
                            {categories?.map((singleCategory, key)=>{
                                const {catName, _id} = singleCategory
                                return(
                                    <>
                                    <div className='site-link-text-div'>
                                         <p className='text-general-small white-text margin-small site-link-text' key={key}><Link className='link'>{catName}</Link> </p>
                                    </div>
                                   
                                    </>
                                )
                            })}


                        {noCategoryFound &&   <p className='color2 text-general-extral-small margin-small-small'>No user found, refresh page to fetch categories</p>}
                        {somethingWentWrongCatError &&   <p className='color2 text-general-extral-small margin-small-small'>Something went wrong loading cateorgy, refresh page</p>}
                        </div>
                        
                        
                        
                        <div className='footer-section1 topMargin-medium'>
                            
                           
                            <h4 className='text-general-small2 color1 custom-footer-title-text'>Subscribe</h4>

                            {subscribedText && 
                                    <div className='flex-2 center-flex-align-display'>
                                        <BsCheckLg className='color4 custom-fontSize'/>
                                        <p className='text-general-small2 color1'>Successful</p>
                                    </div>
                                }
                            <div className='subscribe-email-text-div'>
                                <p className='text-general-small white-text margin-small site-about-text'>Subscribe to our weekly email subscription service for free and get trending updates directly into your email</p>
                            </div>
                            <div className='subscribe-email-input-div margin-small flex-3'>
                                <input className='subscribe-emai-input' type="text" placeholder='Enter your name'  ref={subscriberNameRef}/>
                                <input className='margin-small subscribe-emai-input' type="text" placeholder='Enter your email'  ref={subscriberEmailRef}/>

                                {/* error messsages start here  */}
                                
                                {subEmailEmptyError  &&  <p className='color2 text-general-extral-small center-text margin-small'>Email must be provided</p>}
                                {subNameEmptyError &&  <p className='color2 text-general-extral-small center-text margin-small'>Subscriber name must be provided</p>}
                                {subNameAlreadyExistError &&  <p className='color2 text-general-extral-small center-text margin-small'>Subscriber name already exist</p>}
                                {subEmailAlreadyExistError &&  <p className='color2 text-general-extral-small center-text margin-small'>Subscriber email already exist</p>}
                                {subEmailNumberError &&  <p className='color2 text-general-extral-small center-text margin-small'>Subscriber email must not be all numbers</p>}
                                {subNameNumberError &&  <p className='color2 text-general-extral-small center-text margin-small'>Subscriber name must not be all numbers</p>}
                                {somethhingWentWrongError &&  <p className='color2 text-general-extral-small center-text margin-small'>Something went wrong, reload</p>}
                                



                                {/* error messsages end here  */}

                                

                                <button onClick={handleNewSubscriber} className='subscibe-custom-BTN margin-small'>Subscibe</button>
                            </div>

                            
                        </div>
                        
                </div>
                <div className='flex-2 center-flex-align-display credit-section-div'>
                    <hr className='footer-line'/>
                        <div className='flex-3'><p className='text-general-small white-text margin-small site-about-text'>Copyright © 2022 | {websiteName}. All Rights Reserved by </p><p className='text-general-small color2 margin-small site-about-text margin-left-sm1'>SparkMediaTech</p></div>
                </div>
            </div>
      </>
   
  )
}

export default Footer