import React, {useState, useEffect, useContext} from 'react';
import './headerNavbar.css';
import '../../CSS files/utilities.css';
import axios from 'axios';
import {AuthContext} from "../../context/AuthProvide";
import { Link } from 'react-router-dom';
import {FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaSearch} from 'react-icons/fa';
import {AiOutlineInstagram} from 'react-icons/ai';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import  BASE_URL from '../../hooks/Base_URL';
import { useLocation } from 'react-router';
import {FiMenu} from 'react-icons/fi'
import {MdOutlineCancel} from 'react-icons/md';
import { useMediaQuery } from '../../hooks/CustomMediaQuery';
import { useHistory, useParams } from 'react-router-dom';





function HeaderNavbar() {
    const location = useLocation()
    const path = location.pathname.split("/")[1];
    const blogPath = location.pathname.split("/")[1];
    const pageNum = location.pathname.split("/")[3];
    const axiosPrivate = useAxiosPrivate();
    const PF = "http://localhost:5000/images/" 
    const {auth, setAuth, logUser, setWebsiteName, setAboutWebsite, setQuery,  searchState, setSearchState,  blogPageName, pathName,  writePageName,
    pathLocation, setPathLocation, blogPageAliasName, writePageAliasName, setgeneralFetchError,dispatch, headerValues, setHeaderValues, headerImage, setHeaderImage,
    contactPageName, contactPageAliasName, aboutPageName, aboutPageAliasName, globalPathName, setGlobalPathName,setCategoryName, searchRef
    } = useContext(AuthContext);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    let   tabletMode = useMediaQuery('(max-width: 1200px)');
    //const [searchState, setSearchState] = useState(false);
    const history = useHistory();  
    




//set the global state here
useEffect(()=>{
    setGlobalPathName(path)
}, [globalPathName, blogPageName, writePageName, aboutPageName, contactPageName, path == "", path])






useEffect(() => {

      const fetchFrontendValue = async () =>{
         try{
                const res = await axios.get(`${ BASE_URL}/headervalue`);
                setHeaderValues(res.data)
               
         }catch(err){
            if(err.response.data === 'no value found'){
                return setgeneralFetchError(true)
            }
            if(err.response.data === 'something went wrong'){
                return setgeneralFetchError(true)
            }
         }
          //console.log(res)
      }
     fetchFrontendValue()
  }, [])
  

   

//handle logout
const handleLogout = async (e) =>{
    const logId ={
        userId: logUser.userId
    }
    try{
        dispatch({type:"CURSOR_NOT_ALLOWED_START"}); 
        await axiosPrivate.post(`${BASE_URL}/auth/logout`,  logId, { withCredentials: true,
        headers:{authorization: `Bearer ${auth.token}`}})
        setAuth(null);
         dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
        
        window.location('/login')
        }catch(err){
            console.log(err)
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
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

//setWebsiteName and aboutWebsite for global state management
useEffect(()=>{
     setWebsiteName(arrayHeaderValues.websiteName)
     setAboutWebsite(arrayHeaderValues.aboutWebsite);
     setHeaderImage(arrayHeaderValues.headerImg)
     
}, [headerValues])



//handle search query to avoid the API calls from running on each time the user types a word. I want the search api to be called only when the user clicks the search icon
//the setSearchState has been set as a useContext state and can be gotten globally. Whenever there is a change on this state, the API can be called

const handleSearchQuery = ()=>{
    setCategoryName('')
    setSearchState(!searchState)
}

useEffect(()=>{
    setPathLocation(path)
}, [pathLocation, pathName]);


//this controls mobile menu toogle open state
const handleOpenMobileMenu = ()=>{
    setMobileMenuOpen(true)
}

//closes the mobile menu view
const handleCloseMobileMenu = ()=>{
    setMobileMenuOpen(false)
}


/*check for screen size  to enable menu div to toggle */

useEffect(()=>{
    if(!tabletMode){
        setMobileMenuOpen(false)
    }
}, [tabletMode])



//this function turns off the mobile menu open state to enable the mobile menu to disappear when moving to another page if it was open
const customFunction = ()=>{
    setMobileMenuOpen(false);
    setCategoryName('')
    setQuery('')
    searchRef.current.value = ''
}


  return (
      <>
      {/* Top navbar section*/}
        <div className="top-div " style={customHeaderColor}>
       
           
            <div className='top flex-3 ' >
               
                <div className='topLeft flex'>
                    <div className='mobile-radius radius-circle flex '><FaFacebookF className='topicon'/></div>
                    <div className='mobile-radius radius-circle flex'><FaTwitter className='topicon'/></div>
                    <div className='mobile-radius radius-circle flex'><AiOutlineInstagram className='topicon'/></div>
                    <div className='mobile-radius radius-circle flex'><FaLinkedinIn className='topicon'/></div>
                    <div className='mobile-radius radius-circle flex'><FaYoutube className='topicon'/></div>
                </div>
          
            <div className='topRight'>
               <ul className='topList'>               
                    {logUser.role == 'admin' && auth?.token && <li className='topListItem'>
                        <Link className='link white-text text-general-small custom-mobil-font' to='/settings'>DASHBOARD</Link>
                    </li>} 
                    
                     {auth?.token && <li className='topListItem'>
                        <Link className='link white-text text-general-small custom-mobil-font' onClick={handleLogout}>LOGOUT</Link>
                    </li>} 
                   
                </ul>
               {
               auth?.token ? (
                   <Link to={`/settings/${logUser.userId}`}>
                    <img className='topimg' 
                        src={logUser.profilepicture} alt="" 
                    />
                </Link>
               ) : (
                   <ul className='topList'>
                        <li className='topListItem  '>
                            <Link className='link white-text text-general-small custom-login-text-title' to='/login'>
                                LOGIN
                            </Link>
                        </li> 

                        <li className='topListItem'> 
                            <Link className='link white-text text-general-small custom-register-text-title' to='/register'>
                                REGISTER
                            </Link>
                        </li>

                    </ul>
               )
               }
              
           </div>
        </div>
         


      {/*Header section */}
    <article className='navBar-header-wrapper   '  style={customNavColor}>
        <div className='navBar-header-div flex-3 '>
                <div className='siteName-div flex-3 '>
                    <div className='custom-siteName-title-div'><h2 >{arrayHeaderValues.websiteName}</h2></div>   
                </div>

        {!mobileMenuOpen &&
            <div className='navBar-top-div'>
                 <ul className='topList '>
                    

                    {pathName.map((singlePath)=>{
                                if(singlePath.aliasName === 'HOME'){
                                    const {pathName, aliasName, _id, menuName} = singlePath || {}
                                        return(
                                            <div className={!path && path.toUpperCase() !==blogPageAliasName && path.toUpperCase() !== writePageAliasName  ? 'flex home-div ' : 'flex' }>
                         
                                                <>
                                                    <Link onClick={customFunction} className='link ' to={'/'}>
                                                        <li className={!path && path.toUpperCase() !==blogPageAliasName && path.toUpperCase() !== writePageAliasName ? 'topListItem home-custom-color  ' :"topListItem " }>
                                                            {menuName}
                                
                                                        </li> 
                                                    </Link>
                                                </>  
                            
                                            </div>
                                        )
                                        }
                                    })}
                   

                   
                                    
                    {pathName.map((singlePathName, key) =>{
                         const {pathName, aliasName, _id, menuName} = singlePathName || {}
                        if(aliasName !== 'HOME'){
                            console.log(singlePathName?.aliasName == aboutPageAliasName)
                        return(
                            <>
                                <div key={key} className={path == singlePathName?.pathName ? 'flex customItemDiv colorBG marginLeft-extraSmall':   'flex customItemDiv marginLeft-extraSmall '}>
                                    <Link onClick={customFunction} className='link ' to={singlePathName?.aliasName == blogPageAliasName ? `/${blogPageName?.toLowerCase()}/page/${Number(1)}`: singlePathName?.aliasName == contactPageAliasName? `/${contactPageName?.toLowerCase()}`: 
                                        singlePathName?.aliasName === writePageAliasName ? `/${writePageName?.toLowerCase() }` : singlePathName?.aliasName === aboutPageAliasName ? `/${aboutPageName?.toLowerCase()}` : '/'
                            
                                
                                        }>
                                        <li key={singlePathName._id}   className={path == singlePathName.pathName ? 'topListItem home-custom-color' : 'topListItem '}>
                                        {menuName}
                                
                                        </li> 
                                    </Link>
                            
                                </div>
                            
                            </>
                        )
                        }
                        
                        })}
                        

                      
                       
                    </ul>

                   
            </div>
        }
            

            {/* This is for tablet views  */}

            {mobileMenuOpen && 

                 <div className={mobileMenuOpen ? 'mobile-view-custom-menu-div-animated mobile-view-custom-menu-div ' : 'mobile-view-custom-menu-div  '}>
                     <ul className='  custom-mobile-view-ul '>

                        {pathName.map((singlePathName, key) =>{
                         const {pathName, aliasName, _id, menuName} = singlePathName || {}
                       
                            console.log(writePageAliasName)
                        return(
                            <>
                                <div key={key} className={path == singlePathName.pathName ? ' customItemDiv colorBG  margin-extra-small-Top':   ' customItemDiv '}>
                                    <Link onClick={customFunction} className='link ' to={singlePathName.aliasName == blogPageAliasName ? `/${blogPageName.toLowerCase()}/page/${Number(1)}`: singlePathName?.aliasName == contactPageAliasName? `/${contactPageName?.toLowerCase()}`: 
                                        singlePathName.aliasName === writePageAliasName ? `/${writePageName?.toLowerCase() }`: singlePathName?.aliasName === aboutPageAliasName ? `/${aboutPageName?.toLowerCase()}` : '/'
                            
                                
                                        }>
                                        <li key={singlePathName._id}   className={path == singlePathName.pathName ? 'topListItem home-custom-color flex-2' : 'topListItem flex-2 '}>
                                        {menuName}
                                
                                        </li> 
                                    </Link>
                            
                                </div>
                            
                            </>
                        )
                        
                        
                        })}
                        



                     </ul>
                    </div>
            
            }
            
             <div className='custom-topList-section2'>
                { console.log(globalPathName, blogPageName, !globalPathName == blogPageName, 'Hello globalpage')}
                        {globalPathName == blogPageName ?
                        
                       
                        <div className='search-input-div '>
                        {console.log('I am second to run')}   
                   <input className='search-custom' type="text" placeholder='Search Blog Posts'
                       ref={searchRef}
                   /> 
                       <div className='search-icon-div'>
                         
                               <FaSearch className='fa-search' onClick={handleSearchQuery}/>
                         
                               
                           
                           
                       </div>
                   </div>
                      
                            :
                        
                    

                        <div className='search-input-div '>
                        {console.log('I am first to run')}    
                    <input className='search-custom' type="text" placeholder='Search Blog Posts'
                        ref={searchRef}
                    /> 
                        <div className='search-icon-div'>
                            <Link onClick={handleSearchQuery} to={`/${blogPageName}/page/${Number(1)}`} >
                                <FaSearch className='fa-search' />
                            </Link>
                                
                    
                            
                            
                        </div>
                    </div>
                        }

                     
                            
                    </div>

            <div className='cstom-mobile-view-menu-icons-div flex-3 center-flex-align-display'>
                        {!mobileMenuOpen && <FiMenu onClick={handleOpenMobileMenu} className='custom-menuOpen-icon'/>}
                        {mobileMenuOpen && <MdOutlineCancel onClick={handleCloseMobileMenu} className='custom-menuClose-icon'/>}
                    </div>   
            
        </div>
       
    </article>
</div>
      </>
   
  )
}

export default HeaderNavbar