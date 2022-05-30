import React, {useState, useEffect, useContext} from 'react';
import './headerNavbar.css';
import '../../CSS files/utilities.css';
import 'animate.css';
import axios from 'axios';
import {AuthContext} from "../../context/AuthProvide";
import { Link } from 'react-router-dom';
import {FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaSearch} from 'react-icons/fa';
import {AiOutlineInstagram} from 'react-icons/ai';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {LogContext} from '../../context/LogContext';
import  BASE_URL from '../../hooks/Base_URL'


function HeaderNavbar() {
    const axiosPrivate = useAxiosPrivate();
    const PF = "http://localhost:5000/images/" 
    const [topMenuBar, setTopMenuBar] = useState(false);
    const [headerValues, setHeaderValues] = useState([]);  
    const {auth, setAuth, logUser, websiteName, setWebsiteName} = useContext(AuthContext);
    const {logdispatch} = useContext(LogContext);
    const [query, setQuery] = useState('')

  

useEffect(() => {

      const fetchFrontendValue = async () =>{
          const res = await axios.get(`${ BASE_URL}/headervalue`);
          setHeaderValues(res.data)
          //console.log(res)
      }
     fetchFrontendValue()
  }, [])
  console.log(headerValues)
//turn on edit mode function
const handleMenuClickOpen = ()=>{
          setTopMenuBar(!topMenuBar)       
    }
//turn off edit mode function   
const handleMenuClickClose = ()=>{
    setTopMenuBar(false)

}
//handle logout
const handleLogout = async (e) =>{
    const logId ={
        userId: logUser.userId
    }
    try{
        await axiosPrivate.post(`/v1/auth/logout`,  logId, { withCredentials: true,
        headers:{authorization: `Bearer ${auth.token}`}})
        setAuth(null);
        logdispatch({type:"LOG_SESSION", payload: null});
        
        //window.location.replace('/login')
        }catch(err){
            setAuth(null)
        }
 
}

//map into the headervalues coming from database and pass that to a variable
 const customHeaderValues = headerValues.map((singleHeaderValue)=> singleHeaderValue)
 //get the variable and use object.assign method along with spread operator to copy the values of all enumerable own properties from source objects to a target object and then returns the target object.
 const arrayHeaderValues = Object.assign({}, ...customHeaderValues)

  //custom nav color 
const customNavColor = {
  backgroundColor: arrayHeaderValues.navColor
}
//custom header color
const customHeaderColor = {
   backgroundColor: arrayHeaderValues.headerColor
}

//setWebsiteName for global state management
useEffect(()=>{
     setWebsiteName(arrayHeaderValues.websiteName)
}, [headerValues])

  return (
      <>
      {/* Top navbar section*/}
        <div className="top-div" style={customHeaderColor}>
       
            <i className="fas open fa-bars" onClick={handleMenuClickOpen}></i>
            <div className={`top flex-3 ${topMenuBar ? 'top2slidein': 'top2slideOut'}`} >
                <i className="fas close fa-times" onClick={handleMenuClickClose}></i> 
                <div className='topLeft flex'>
                <div className='radius-circle flex'><FaFacebookF className='topicon'/></div>
                <div className='radius-circle flex'><FaTwitter className='topicon'/></div>
                <div className='radius-circle flex'><AiOutlineInstagram className='topicon'/></div>
                <div className='radius-circle flex'><FaLinkedinIn className='topicon'/></div>
                <div className='radius-circle flex'><FaYoutube className='topicon'/></div>
           </div>
          
           <div className='topRight'>
               <ul className='topList'>               
                    {logUser.role == 'admin' && auth?.token && <li className='topListItem'>
                        <Link className='link white-text text-general-small ' to='/websitesettings'>DASHBOARD</Link>
                    </li>} 
                    
                     {auth?.token && <li className='topListItem'>
                        <Link className='link white-text text-general-small ' onClick={handleLogout}>LOGOUT</Link>
                    </li>} 
                   
                </ul>
               {
               auth?.token ? (
                   <Link to="/settings">
                    <img className='topimg' 
                        src={logUser.profilepicture} alt="" 
                    />
                </Link>
               ) : (
                   <ul className='topList'>
                        <li className='topListItem  '>
                            <Link className='link white-text text-general-small' to='/login'>
                                LOGIN
                            </Link>
                        </li> 

                        <li className='topListItem'> 
                            <Link className='link white-text text-general-small' to='/register'>
                                REGISTER
                            </Link>
                        </li>

                    </ul>
               )
               }
              
           </div>
        </div>
         </div>


      {/*Header section */}
    <article className='navBar-header-wrapper   '  style={customNavColor}>
        <div className='navBar-header-div flex-3'>
                <div className='siteName-div'>
                    <h2 >{arrayHeaderValues.websiteName}</h2>
                </div>
            <div className='navBar-top-div'>
                 <ul className='topList '>
                        <div className='flex home-div '>
                            <Link className='link ' to={'/'}>
                                <li className='topListItem home-custom-color  '>
                                    Home
                                
                                </li> 
                            </Link>
                            
                        </div>

                       <div className='custom-topList-Item '>
                            <li className='topListItem'> 
                            <Link className='link ' to='/about'>
                                ABOUT
                            </Link>
                        </li>

                         <li className='topListItem'> 
                            <Link className='link' to='/write'>
                                WRITE
                            </Link>
                        </li>

                        <li className='topListItem'> 
                            <Link className='link' to='/contact'>
                                CONTACT
                            </Link>
                        </li>

                        <li className='topListItem'> 
                            <Link className='link' to='/#'>
                               CATEGORIES
                            </Link>
                        </li>

                       </div>
                    </ul>

                   
            </div>
            
             <div className='custom-topList-section2'>
                        <div className='search-input-div '>
                            <input className='search-custom' type="text" placeholder='Search Blog Posts'
                                onChange={(e)=>setQuery(e.target.value)}
                            /> 
                                <div className='search-icon-div'>
                                    <Link className='link' to={`/?searches=${query}`}>
                                        <FaSearch className='fa-search'/>
                                    </Link>
                                    
                                </div>
                            </div>
                    </div>
        </div>
       
    </article>
      </>
   
  )
}

export default HeaderNavbar