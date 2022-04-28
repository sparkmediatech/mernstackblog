import './header.css';
import TopBar from '../topbar/TopBar';
import { useState, useEffect, useContext } from 'react';
import Dashboard from '../../pages/Admindashboard/Dashboard';
import axios from 'axios';
import {AuthContext} from '../../context/AuthProvide';
//import {useLocation} from "react-router-dom"

export default function Header() {
     const {auth, isLoading, dispatch} = useContext(AuthContext);
    const [showTopBar, setShowTopBar] = useState(false);
    const [EditHeaderTitleMode, setEditHeaderTitleMode] = useState(false)
    const [writeHeaderTitle, setWriteHeaderTitle] = useState('')
    const [headerValues, setHeaderValues] = useState([]);
    const PF = "http://localhost:5000/images/"
    
    //console.log(headerValues)
   

  useEffect(() => {
       dispatch({ type: "ISLOADING_START" });
      const fetchFrontendValue = async () =>{
          const res = await axios.get("/headervalue");
          setHeaderValues(res.data)
           dispatch({ type: "ISLOADING_END" });
      }
     fetchFrontendValue()
  }, [])
   
    return (
        <>
         {headerValues.map((singleheaderValue) =>{
                 return(
                     <>
                    
        <div className='header'>
          
            <div className='headerTitles'>    
            </div>
            
            {singleheaderValue.headerImg ? <img className='headerImg' src={singleheaderValue.headerImg} alt="" /> : <img className='headerImg' src={process.env.PUBLIC_URL + '/img/headerimg.jpg'} alt="" />}
        </div>
                 </>   
                 )
             })}  
    
        </>
    )
}
