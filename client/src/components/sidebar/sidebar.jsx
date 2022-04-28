import axios from 'axios';
import react, { useState, useEffect } from 'react'
import './sidebar.css';
import { Link } from 'react-router-dom';

export default function Sidebar() {
    const [category, setCategory] = useState([]);
    const [catURL, setCatURL] = useState()
  
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
                <span className='sidebarTitle'>ABOUT ME</span>
                <img src={process.env.PUBLIC_URL + '/img/sidebarimg.jpg'} alt="" />
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
                    Error et repudiandae voluptas asperiores, aliquid veritatis 
                    odit sunt excepturi vitae quidem, quod.</p>
            </div>

            <div className='sidebarItem'>
                <span className='sidebarTitle'>CATEGORIES</span>
                <ul className='sidebarList'>
                    
                    { category.map((singleCategory, index)=>{
                   
                        
                       return <Link key={index} to={`/?cat=${singleCategory}`} className="link">{/* we assigned the link to point to the name of the category querry coming from our api  */}
                                   
                                  
                                   <li key={index} className='sidebarListItem'>{singleCategory}</li>
                                    {console.log(index)}
                                   
                      
                        </Link>

                          
                    })}
                   
                   
                </ul>
            </div>

            <div className='sidebarItem'>
                <span className='sidebarTitle'>FOLLOW US</span>
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
