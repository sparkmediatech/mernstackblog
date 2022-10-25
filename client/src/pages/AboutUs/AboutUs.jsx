import React, {useState, useEffect, useContext} from 'react';
import './aboutus.css';
import Footer from '../../components/Footer/Footer';
import {AuthContext} from '../../context/AuthProvide';







function AboutUs() {
    const {aboutWebsite, websiteName} = useContext(AuthContext); 







  return (
    <>
    
    <article>
        <div className='mainContainer custom-about-us-div topMargin-medium'>
          <div className='custom-about-us-sub-div'>

            <h5 className='color1 text-general-small2'>Welcome to {websiteName}</h5>

            <p className='margin-small color1 text-general-small custom-about-app-text'>{aboutWebsite}</p>
          </div>
    
        </div> 

    <Footer/>     
    </article>
    
    
    </>
    
  )
}

export default AboutUs