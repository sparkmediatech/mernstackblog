import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom'
import './topbar.css';
import {AuthContext} from "../../context/AuthProvide";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {LogContext} from '../../context/LogContext';
import {FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube} from 'react-icons/fa';
import {AiOutlineInstagram} from 'react-icons/ai'


export default function TopBar(){
    const axiosPrivate = useAxiosPrivate();
    const PF = "http://localhost:5000/images/" 
    const [topMenuBar, setTopMenuBar] = useState(false);
    const {auth, setAuth, logUser, dispatch} = useContext(AuthContext);
    const {logdispatch} = useContext(LogContext);

    //open edit mode function
     const handleMenuClickOpen = ()=>{
          setTopMenuBar(!topMenuBar)       
    }
     //handle close edit mode
    const handleMenuClickClose = ()=>{
    setTopMenuBar(false)

    }

    //logout function
    const handleLogout = async (e) =>{
         dispatch({ type: "ISLOADING_START" });
       const logId ={
            userId: logUser.userId
        }
        try{
            
            await axiosPrivate.post(`/v1/auth/logout`,  logId, { withCredentials: true,
            headers:{authorization: `Bearer ${auth.token}`}})
             setAuth(null);
             logdispatch({type:"LOG_SESSION", payload: null});
             dispatch({ type: "ISLOADING_END" });
             window.location.reload()
        }catch(err){
            setAuth(null)
        }
 
}


return(
        <>
        <div className="top-div">
       
       <i className="fas open fa-bars" onClick={handleMenuClickOpen}></i>
        <div className={`top ${topMenuBar ? 'top2slidein': 'top2slideOut'}`}>
             <i className="fas close fa-times" onClick={handleMenuClickClose}></i>
             
             
           <div className='topLeft'>
           <div className='radius-circle flex'><FaFacebookF className='topicon'/></div>
           <div className='radius-circle flex'><FaTwitter className='topicon'/></div>
           <div className='radius-circle flex'><AiOutlineInstagram className='topicon'/></div>
           <div className='radius-circle flex'><FaLinkedinIn className='topicon'/></div>
            <div className='radius-circle flex'><FaYoutube className='topicon'/></div>
           </div>
           <div className='topCenter'>
                

           </div>
           <div className='topRight'>
               <ul className='topList'>               
                    {logUser.role == 'admin' && auth?.token && <li className='topListItem'>
                        <Link className='link' to='/dashboard'>Dashboard</Link>
                    </li>} 
                    <li className='topListItem' onClick={handleLogout}>
                        {auth?.token && 'LOGOUT'}
                    </li>
                </ul>
               {
               auth?.token ? (
                   <Link to="/settings">
                    <img className='topimg' 
                        src={PF + logUser.profilepicture} alt="" 
                    />
                </Link>
               ) : (
                   <ul className='topList'>
                        <li className='topListItem'>
                            <Link className='link' to='/login'>
                                LOGIN
                            </Link>
                        </li> 

                        <li className='topListItem'> 
                            <Link className='link' to='/register'>
                                REGISTER
                            </Link>
                        </li>

                    </ul>
               )
               }
              
               

           </div>
        </div>
         </div>
        </>
    )
}