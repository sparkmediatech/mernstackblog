import React, {useState, useEffect, useContext} from 'react';
import Header from '../../components/header/header';
import Posts from '../../components/posts/posts';
import Sidebar from '../../components/sidebar/sidebar';
import './home.css'
import "../responsive.css";
import axios from 'axios';
import {useLocation} from "react-router-dom";
import {AuthContext} from '../../context/AuthProvide';
import AutoRefreshToken from "../../hooks/AutoRefreshToken";



export default function Home() {
    const [posts, setPosts] = useState([]);//creating a usestate for the post
    const [loading, setLoading] = useState(false);
    const {auth, isLoading, dispatch} = useContext(AuthContext);
  
   
   
    
  
    //we created a useEffect to handle the post fetching coming from data base via express js.
    //we used useffect to trigger this data fetching which is handled by axios
    const location = useLocation();// called the useLocation here under a variable called location

    const search = location.search// declared a variable called search, assigned the location.search value to it. this is coming from useLocation. It works with query

   
    useEffect( () => {
        
        setLoading(true)
        dispatch({ type: "ISLOADING_START" });
        const fetchPosts = async ()=>{
        
       const res = await axios.get("/posts"+search)//all we are saying is that fetch the posts with the query search entered. This could be author's name, category, etc
        setPosts(res.data)
        setLoading(false)
        dispatch({ type: "ISLOADING_END" });
        }
        fetchPosts()
         
    }, [search])
   console.log(posts)
    return (
       <>
       
            <Header/>
            
                <div className='home'>
                
                <Posts posts={posts} />{/*we passed the post state as props inside the post component   */}
                <Sidebar/>
            </div>

            

        </>
    )
}
