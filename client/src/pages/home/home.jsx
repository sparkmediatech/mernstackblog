import React, {useState, useEffect, useContext} from 'react';
import Header from '../../components/header/header';
import Posts from '../../components/posts/posts';
import Sidebar from '../../components/sidebar/sidebar';
import './home.css'
import "../responsive.css";
import VideoComponent from '../Video Components/VideoComponent'

import {useLocation} from "react-router-dom";
import {AuthContext} from '../../context/AuthProvide';
import AutoRefreshToken from "../../hooks/AutoRefreshToken";
import PopularPosts from '../PopularPosts/PopularPosts';
import  Page1 from '../CategoryPages/page1';
import Page2 from '../CategoryPages/Page2';
import Page3 from '../CategoryPages/Page3'
import Page4 from '../CategoryPages/Page4';
import Footer from '../../components/Footer/Footer';





export default function Home() { 
    const {auth, isLoading, dispatch} = useContext(AuthContext);
  
   

    return (
       <>
       
            <Header/>
            
                <div className='home'>
                <h4 className='latest-text margin-small '>Latest</h4>
                <div className='flex-3 page-div'>
                     <hr className='page-line1 '/>
                     <hr className='page-line2 '/>
                </div>
               
                <Posts />
                 <h4 className='latest-text topMargin-medium '>Top Videos</h4>
                 <div className='flex-3 page-div'>
                     <div className='page-line1'></div>
                     <hr className='page-line2 '/>
                    
                </div>
                <VideoComponent/>
                {/*<Sidebar/>*/}

                 <h4 className='latest-text  '>Popular Posts</h4>
                 <div className='flex-3 page-div padding-buttom-sm'>
                     <div className='page-line1'></div>
                     <hr className='page-line2 '/>
                    
                </div>
                <  PopularPosts  />
                
                 <Page3/>

                <Page1/>
                <Page4/>

                < Page2/>

                
            </div>

            
            < Footer/>

        </>
    )
}
