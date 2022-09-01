import React, {useState, useEffect, useContext} from 'react';
import './footer.css';
import {AuthContext} from "../../context/AuthProvide";
import {FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaSearch} from 'react-icons/fa';
import {AiOutlineInstagram} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import  BASE_URL from '../../hooks/Base_URL';
import axios from 'axios';

function Footer() {
     const {auth, setAuth, logUser, websiteName, setWebsiteName, aboutWebsite, posts,} = useContext(AuthContext);
     const [changePostTitleColor, setChangePostTitleColor] = useState(false);
     const [selectedPostId, setSelectedPostId] = useState();
     const [categories, setCategories] = useState()

      //fetch all categories
    useEffect(()=>{
             const fetchAllCategories = async () =>{
            try{
                const res = await axios.get(`${BASE_URL}/category`);

                console.log(res.data)
                return setCategories(res.data);
                
            
            }catch(err){

            }

            
        }

        fetchAllCategories() 
    }, [])

    


    console.log(categories)
  return (
      <>
            <div className=' footer-custom-main-div flex-3'>
                <div className='homePage-post-div custom-footer-main-wrapper '>
                        <div className='footer-section1 topMargin-medium flex-2'>
                            <h4 className='text-general-small2 color1'>{websiteName}</h4>
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

                        <div className='footer-section1 topMargin-medium'>
                           
                            <h4 className='text-general-small2 color1'>Recent Posts</h4>
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

                        <div className='footer-section1 topMargin-medium'>
                            <h4 className='text-general-small2 color1'>Links</h4>
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

                        </div>

                        <div className='footer-section1 topMargin-medium'>
                            <h4 className='text-general-small2 color1'>Subscribe</h4>
                            <div className='subscribe-email-text-div'>
                                <p className='text-general-small white-text margin-small site-about-text'>Subscribe to our weekly email subscription service for free and get trending updates directly into your email</p>
                            </div>
                            <div className='subscribe-email-input-div margin-small flex-3'>
                                <input className='subscribe-emai-input' type="text" placeholder='Enter your name'/>
                                <input className='margin-small subscribe-emai-input' type="text" placeholder='Enter your email'/>

                                <button className='subscibe-custom-BTN margin-small'>Subscibe</button>
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