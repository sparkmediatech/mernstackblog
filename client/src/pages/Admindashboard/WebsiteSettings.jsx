import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {AuthContext} from '../../context/AuthProvide';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import AdminSidebar from './AdminSidebar';

function WebsiteSettings() {
    const [headerValues, setHeaderValues] = useState([])
    const [file, setFile] = useState(null);
    const [headerImg, setHeaderImg] = useState(null)
    const [websiteName, setWebsiteName] = useState("");
    const [sitesubName, setSitesubName] = useState("");
    const [headerColor, setHeaderColor] = useState("");
    const [navColor, setNavColor] = useState("");
    const PF = "http://localhost:5000/images/";
    const [usersDashboardMode, setUsersDashboardMode] = useState(false);
    const {logUser, auth, dashboardEditMode, dispatch} = useContext(AuthContext);
    const axiosPrivate = useAxiosPrivate();
    const [updating, setUpdating] = useState(false);
    const [textUpdate, setTextUpdate] = useState(false);

//UseEffct to get the header values
   useEffect(() => {
    try{
         const fetchFrontendValue = async () =>{
          const res = await axiosPrivate.get("/v1/headervalue");
          setHeaderValues(res.data)
          //console.log(res)
      }
     fetchFrontendValue()
   
    }catch(err){

    }   
  }, [])


    //Turns website edit mode on
 /* const handleEditMode = () =>{
    setDashboardEditMode(true)
    setUsersDashboardMode(false)
  }*/
  //cancel website editmode
 const handleCancleEditMode = () =>{
     dispatch({type:"WEBSITE_SETTINGS_STATE_END"});
    //setDashboardEditMode(false)
    //setUsersDashboardMode(false)
  }
//update website details function
const handleHeaderValueUpdate = async ( headerId, e) =>{
 e.preventDefault()
  console.log(headerId)
  
setUpdating(true)
  const updatedHeaderValue = {
    userId: logUser.userId,
    role: logUser.role,
    websiteName,
    sitesubName,
    headerColor,
    navColor
    
  };
  if(headerImg){                    //logic behind uploading image and the image name
        const data = new FormData();
        const filename = Date.now() + headerImg.name;
        data.append("name", filename);
        data.append("file", headerImg);
        
      
        try{
              const imageResponse = await axios.post("/upload", data)//handles the uploading of the image
              const imgUrl = imageResponse.data;
              console.log(imageResponse.data)
              updatedHeaderValue.headerImg = imgUrl.url;
              //setUpdated(true)
        }catch(err){
           
        }
    }

     try{
        
        await axiosPrivate.patch("/v1/headervalue/" + headerId, updatedHeaderValue, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}})  
            setUpdating(false);
            setTextUpdate(true)
            window.location.reload()
   
    }catch(err){
       console.log(err)
    }

}

//Turns website edit mode on
  const handleEditMode = () =>{
     dispatch({type:"WEBSITE_SETTINGS_STATE"});
    
  }

  return (

     <>
   <article className='dashboard-container'>
       <div className=" admin-dashboard-custom-container flex-3">

      < AdminSidebar/>

   <div className='other-pages '>
      <div>
           <h2 className='text-general-Medium margin-small'>Website Information</h2>
          {!dashboardEditMode && <button className='button-general-2' onClick={handleEditMode}>Edit</button>} 
           {dashboardEditMode && <button className='button-general custom-admin-BTN' onClick={handleCancleEditMode}>Cancel Edit</button>}
          {headerValues.map((singleValues, index) =>{
      const {_id: headerId} = singleValues
      return(
             
          <div key={index} className="dashboard-wrapper">
             <div className="updatedText">{textUpdate && <h3>Updated successfully</h3>}</div>
            <form onSubmit={(e)=>handleHeaderValueUpdate(headerId, e)} className="dashboard-form">

            <div className='dasboard-input-div'>
              <p className="dashboard-label">Website Name</p>
              {dashboardEditMode ? <input className="dashboard-input input-general" type="text" placeholder={singleValues.websiteName} autoFocus
                 onChange={(e) => setWebsiteName(e.target.value)}
                 required
                /> : 
                <input className="dashboard-input" type="text" placeholder={singleValues.websiteName} readOnly/>
              }
              

             <p className="dashboard-label2">Sitesub Name</p>
             {dashboardEditMode ? <input className="dashboard-input dashboard-input-2" type="text" placeholder={singleValues.sitesubName} 
             onChange={(e) => setSitesubName(e.target.value)}
             autoFocus
             required/> 
              :
              <input className="dashboard-input dashboard-input-2" type="text" placeholder={singleValues.sitesubName} readOnly />}
              
            </div>
             {dashboardEditMode && 
             <div className='topMargin-medium flex-2 color-picker-custom-div'>
               <label >Header Color</label>
               <div className='flex-3 color-picker-input-div'>
                  <input className='color-pciker1' onChange={(e) => setHeaderColor(e.target.value)} type="color" value={headerColor} />
                <label className='color-picker-label'>Hex Value</label >
               <input className='color-pciker1 color-picker-hex-input' type="text" placeholder={headerColor} onChange={(e) => setHeaderColor(e.target.value)} />
               </div>
               
             </div>

            }
             {dashboardEditMode && 
             <div className='topMargin-medium flex-2 color-picker-custom-div'>
               <label >Navbar Color</label>
               <div className='flex-3 color-picker-input-div'>
                  <input className='color-pciker1' onChange={(e) => setNavColor(e.target.value)} type="color" value={navColor} />
                <label className='color-picker-label'>Hex Value</label >
               <input className='color-pciker1 color-picker-hex-input' type="text" placeholder={navColor} onChange={(e) => setNavColor(e.target.value)} />
               </div>
               
             </div>

            }
             {dashboardEditMode ? <div className='dashboard-img-container '>
                  <div className='flex-2 topMargin-medium'>
                    <label>Upload Website Header Image</label>
                  <input className='upload-input' type="file" 
                    onChange={(e) => setHeaderImg(e.target.files[0])}
                  required/>
                  </div>
             </div>: <div className="headerImg-div">
               <p>Header Image</p>
               <img className='headerValueImg' src={headerImg? URL.createObjectURL(headerImg): singleValues.headerImg} alt="" />
               </div>}
      
            {dashboardEditMode && <button className={updating ? "updateModeBTN-unclick button-general admin-update-custom-BTN" : "button-general admin-update-custom-BTN"} type="submit">Update</button>}

            
             </form>
          </div>
      )
    })}
        </div>

 </div>    
  </div>
   </article>
 
  
  
   </>
    
        
  
    
  
    
  )
}

export default WebsiteSettings