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





export default function Home() {
  
    const [posts, setPosts] = useState([]);//creating a usestate for the post
   
    const {auth, isLoading, dispatch} = useContext(AuthContext);
  
   
   
    
  
    

   
   
   console.log(posts)
    return (
       <>
       
            <Header/>
            
                <div className='home'>
                <h4 className='latest-text topMargin-medium '>Latest</h4>
                <div className='flex-3 line-div'>
                     <hr className='latest-line '/>
                     <hr className='latest-line2 '/>
                </div>
               
                <Posts />
                 <h4 className='latest-text topMargin-medium '>Top Videos</h4>
                 <div className='flex-3 line-div'>
                     <div className='latest-line1'></div>
                     <hr className='latest-line2 '/>
                     <hr className='latest-line2 '/>
                </div>
                <VideoComponent/>
                {/*<Sidebar/>*/}

                 <h4 className='latest-text topMargin-medium '>Popular Posts</h4>
                 <div className='flex-3 line-div'>
                     <div className='latest-line1'></div>
                     <hr className='latest-line2 '/>
                     <hr className='latest-line2 '/>
                </div>
                < PopularPosts/>

            </div>

            

        </>
    )
}
