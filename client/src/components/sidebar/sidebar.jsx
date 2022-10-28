import axios from 'axios';
import react, { useState, useEffect, useContext } from 'react'
import './sidebar.css';
import { Link } from 'react-router-dom';
import {AuthContext} from '../../context/AuthProvide';

export default function Sidebar() {
    const [category, setCategory] = useState([]);
    const [catURL, setCatURL] = useState();
    const {auth, logUser, dispatch, setAuth, authorDetails} = useContext(AuthContext);
  
   console.log(catURL)

//we fetch the category from Post model, used spread operator and set methods to convert the categories in unique values.
    useEffect(() => {
       const getCategory = async ()=>{
           const response = await axios.get("/posts");
           const newArray = response.data
           const modifiedArray = [...new Set(newArray.map((uniqueArray) => uniqueArray.categories.toString()))]
           setCategory(modifiedArray)
           setCatURL(newArray)
           console.log(newArray)
           
           

       }
        getCategory()
    }, [])
  



    
    return (
        <div className='sidebar'>
            <div className='sidebarItem'>
                <p className='sidebarTitle text-general-small color1'>ABOUT THE AUTHOR</p>
                <img className='custom-sidebar-author-image' src={authorDetails.profilePicture} alt="" />
                <h5 className='text-general-small color1 margin-small'>Name: {authorDetails.username}</h5>
                <p className='text-general-small color1'>{authorDetails.aboutUser}</p>
            </div>

            <div className='sidebarItem'>
                
                
            </div>

            <div className='sidebarItem'>
                <p className='sidebarTitle text-general-small color1'>FOLLOW {authorDetails.username}</p>
                <div className='sidebarSocial'>
                    <i className="sidebaricon fab fa-facebook-square"></i>
                    <i className="sidebaricon fab fa-twitter-square"></i>
                    <i className="sidebaricon fab fa-pinterest-square"></i>
                    <i className="sidebaricon fab fa-instagram-square"></i>
                </div>
            </div>

        </div>
    )
}
