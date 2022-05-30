import React, {useState, useEffect, useContext} from 'react';
import './footer.css';
import {AuthContext} from "../../context/AuthProvide";

function Footer() {
     const {auth, setAuth, logUser, websiteName, setWebsiteName} = useContext(AuthContext);

     console.log(websiteName)
  return (
      <>
            <div className=' footer-custom-main-div flex-3'>
                <div className='homePage-post-div custom-footer-main-wrapper '>
                        <div className='footer-section1 topMargin-medium flex-2'>
                            <h4 className='text-general-small2 color1'>{websiteName}</h4>
                            <p className='text-general-small white-text margin-small site-about-text'>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's 
                                standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a 
                                type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining 
                                essentially unchanged.
                            </p>
                        </div>

                        <div className='footer-section1 topMargin-medium'>
                            <h4>Recent Posts</h4>
                        </div>

                        <div className='footer-section1 topMargin-medium'>
                            <h4>Links</h4>
                        </div>

                        <div className='footer-section1 topMargin-medium'>
                            <h4>Subscribe</h4>
                        </div>
                </div>
                
            </div>
      </>
   
  )
}

export default Footer