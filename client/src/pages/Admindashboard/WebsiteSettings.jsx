import React, {useState, useEffect, useContext, useRef} from 'react';
import axios from 'axios';
import {AuthContext} from '../../context/AuthProvide';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import AdminSidebar from './AdminSidebar';
import BASE_URL from '../../hooks/Base_URL'
import { RiTruckLine } from 'react-icons/ri';
import {FiEdit} from 'react-icons/fi';
import {MdCancel, MdTrendingUp} from 'react-icons/md';
import {FiMenu} from 'react-icons/fi'
import {MdOutlineCancel} from 'react-icons/md';

function WebsiteSettings() {
    const [headerValues, setHeaderValues] = useState([])
    const [file, setFile] = useState("");
    const [headerImg, setHeaderImg] = useState(null)
    const [websiteName, setWebsiteName] = useState("");
    const [sitesubName, setSitesubName] = useState("");
    const [headerColor, setHeaderColor] = useState("");
    const [aboutWebsite, setAboutWebsite] = useState(" ")
    const [navColor, setNavColor] = useState("");
    const PF = "http://localhost:5000/images/";
    const [usersDashboardMode, setUsersDashboardMode] = useState(false);
    const {logUser, auth, dashboardEditMode, dispatch, setgeneralFetchError, openAdminSideBar, setOpenAdminSideBar, updateImageState, setUpdateImageState} = useContext(AuthContext);
    const axiosPrivate = useAxiosPrivate();
    const [updating, setUpdating] = useState(false);
    const [textUpdate, setTextUpdate] = useState(false);
    
    const [editAboutWebsiteState, setEditAboutWebsite] = useState(false);
   
   
   
    
    //errors for creating frontend values
    const [aboutWebsiteMaxTextError, setAboutWebsiteMaxTextError] = useState(false);
    const [aboutWebsiteMinTextError, setAboutWebsiteMinTextError] = useState(false);
    const [websiteNameEmptyError, setWebsiteNameEmptyError] = useState(false);
    const [websiteNameMaxTextError, setWebsiteNameMaxTextError] = useState(false);
    const [websiteHeaderImageEmptyError, setWebsiteHeaderImageEmptyError] = useState(false);
    const [userNotFoundError, setUserNotFoundError] = useState(false);
    const [notAuthorizedError, setNotAuthorizedError] = useState(false);
    const [somethingWentWrongWithImageError,  setSomethingWentWrongWithImageError] = useState(false);
    const [somethingWentWrongError, setSomethingWentWrongError] = useState(false);
    const [websiteValuesAlreadyExistError, setWebsiteValuesAlreadyExistError] = useState(false);
    const [noValueIdFoundError, setNoValueIdFoundError] = useState(false);
    const [somethingWentWrongWithUserError, setSomethingWentWrongWithUserError] = useState(false)
   

//UseEffct to get the header values
   useEffect(() => {

    const fetchFrontendValue = async () =>{
          try{
                const res = await axiosPrivate.get("/v1/headervalue");
                const headerValueObject = Object.assign({}, ...res.data)
                setHeaderValues(headerValueObject);
                setHeaderColor(headerValueObject.headerColor);
                setNavColor(headerValueObject.navColor);
                setAboutWebsite(headerValueObject.aboutWebsite)
          }catch(err){
            if(err.response.data === 'no value found'){
              return setgeneralFetchError(true)
            }
            if(err.response.data === 'something went wrong'){
              return setgeneralFetchError(true)
            }
          }
    }
   fetchFrontendValue()
  }, [])


console.log(aboutWebsite)
//create website values
const handleHeaderValueCreation = async ()=>{
   dispatch({type:"CURSOR_NOT_ALLOWED_START"});

       //logic behind uploading image and the image name
       
         if(file){                    
            const data = new FormData();
            const filename = Date.now() + file.name;
            data.append("name", filename);
            data.append("file", file);
            data.append("username", logUser.userId);
            data.append("role", logUser.role);
            data.append("websiteName", websiteName);
            data.append("headerColor", headerColor);
            data.append("navColor", navColor);
            data.append("aboutWebsite", aboutWebsite);

            try{
                  const response = await axiosPrivate.post('/v1/headervalue',  data,{ withCredentials: true,
                  headers:{authorization: `Bearer ${auth.token}`}},)
                  window.location.reload()
                  //dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
                  
               
      
            }catch(err){
               dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
               if(err.response.data === "about website section should not be more than 400 words"){
                 setAboutWebsiteMaxTextError(true)
               };
               if(err.response.data === "about website section should not be less than 100 words"){
                setAboutWebsiteMinTextError(true)
               };
               if(err.response.data === "website name must not be less than 4 words"){
                 setWebsiteNameEmptyError(true)
               };
               if(err.response.data === "website name should not be more than 13 words"){
                 setWebsiteNameMaxTextError(true)
               }
               if(err.response.data === 'website header image should not be empty'){
                 setWebsiteHeaderImageEmptyError(true)
               }
               if(err.response.data === 'User not found'){
                 setUserNotFoundError(true)
               };
               if(err.response.data === 'Not authorized for this feature'){
                 setNotAuthorizedError(true)
               };
               if(err.response.data === 'something with wrong with image'){
                  setSomethingWentWrongWithImageError(true)
               };
               if(err.response.data === "Something went wrong"){
                 setSomethingWentWrongError(true)
               };
               if(err.response.data === "You can not create more than one document for this model"){
                 setWebsiteValuesAlreadyExistError(true)
               }
            }
         }
         else{
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            setWebsiteHeaderImageEmptyError(true)
         }

}

//cancel website editmode gotten from global state via useContext
 const handleCancleEditMode = () =>{
     dispatch({type:"WEBSITE_SETTINGS_STATE_END"});
     setEditAboutWebsite(false);
     setUpdateImageState(false)
     
   
  }


//update website details function 
const handleHeaderValueUpdate = async ( headerId, e) =>{
dispatch({type:"CURSOR_NOT_ALLOWED_START"});
e.preventDefault()
     
        const data = new FormData();
        const filename = Date.now() + file.name;
        data.append("name", filename);
        data.append("file", file);
        data.append("userId", logUser.userId);
        data.append("role", logUser.role);
        data.append('websiteName', websiteName);
        data.append('headerColor', headerColor);
        data.append("navColor", navColor);;
        data.append("aboutWebsite", aboutWebsite);
        console.log(data) 
       
        try{
          await axiosPrivate.patch(`${BASE_URL}/headervalue/${headerId}`, data, { withCredentials: true,headers:{authorization: `Bearer ${auth}`}
              });
                  dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
                  setTextUpdate(true)
                  window.location.reload()
        }catch(err){
          dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
          if(err.response.data === 'about website section should not be more than 400 words'){
            setAboutWebsiteMaxTextError(true)
          };
          if(err.response.data === "website name must not be less than 4 words"){
            setWebsiteNameEmptyError(true)
          };
          if(err.response.data === "website name should not be more than 13 words"){
            setWebsiteNameMaxTextError(true)
          };
          if(err.response.data === 'no user found'){
              setUserNotFoundError(true)
          };
          if(err.response.data === "You do not have permission"){
            setNotAuthorizedError(true)
          };
          if(err.response.data === 'about website section should not be less than 100 words'){
            setAboutWebsiteMinTextError(true)
          };
          if(err.response.data === "No value with this Id found"){
            setNoValueIdFoundError(true)
          };
          if(err.response.data === 'something went wrong with image'){
            setSomethingWentWrongWithImageError(true)
          };
          if(err.response.data === 'something went wrong with user'){
            setSomethingWentWrongWithUserError(true)
          }
        }
          
 
   }
    


  


//Turns website edit mode on gotten from global state via useContext
  const handleEditMode = () =>{
     dispatch({type:"WEBSITE_SETTINGS_STATE"});
      
    
  }

  //clear off notifications after some a
  useEffect(()=>{
      setTimeout(() => {
        setAboutWebsiteMaxTextError(false)
      }, 3000);

      setTimeout(() => {
        setAboutWebsiteMinTextError(false)
      }, 3000);

      setTimeout(() => {
        setWebsiteNameEmptyError(false)
      }, 3000);

       setTimeout(() => {
        setWebsiteNameMaxTextError(false)
      }, 3000);

      setTimeout(() => {
        setWebsiteHeaderImageEmptyError(false)
      }, 3000);

      setTimeout(() => {
        setUserNotFoundError(false)
      }, 3000);

       setTimeout(() => {
        setNotAuthorizedError(false)
      }, 3000);

       setTimeout(() => {
        setSomethingWentWrongWithImageError(false)
      }, 3000);

      setTimeout(() => {
        somethingWentWrongError(false)
      }, 3000);

       setTimeout(() => {
        setWebsiteValuesAlreadyExistError(false)
      }, 3000);

      setTimeout(() => {
        setNoValueIdFoundError(false)
      }, 3000);
      setTimeout(() => {
       setSomethingWentWrongWithUserError(false)
      }, 3000);
  }, [aboutWebsiteMaxTextError, aboutWebsiteMinTextError, websiteNameEmptyError,
    websiteNameMaxTextError, websiteHeaderImageEmptyError, userNotFoundError,
    notAuthorizedError, somethingWentWrongWithImageError, somethingWentWrongError,
    websiteValuesAlreadyExistError, noValueIdFoundError, somethingWentWrongWithUserError,
  
  ])


  const handleImageUpdateMode = ()=>{
    setUpdateImageState(true)
    
  }
  //handle cancel edit image state

  const handleCancelEditImageState = ()=>{
    setUpdateImageState(false);
    setFile("")
  }
const handleOpenSidebarMenu = ()=>{
  if(openAdminSideBar == 'admin-sidebar-slideOut'){
      setOpenAdminSideBar('admin-sidebar-slideIn')
  }
 
    
}


  
  return (

     <>
   <article className='dashboard-container'>
       <div className=" admin-dashboard-custom-container flex-3">
      
      < AdminSidebar/>
      
  
  {
    openAdminSideBar === 'admin-sidebar-slideIn' && <div className='custom-cover-website-setting-div'></div>

  }
  
 <FiMenu onClick={handleOpenSidebarMenu}  className={openAdminSideBar == 'admin-sidebar-slideOut' && !dashboardEditMode ?  'custom-sidebar-menuOpen' :  'custom-sidebar-menuOpen customMenuOpenOff' }/>
   <div className={openAdminSideBar === 'admin-sidebar-slideIn' ? 'other-pages topMargin-medium custom-website-setting-div bg-blur2': 'other-pages topMargin-medium custom-website-setting-div'}>
     
      <div className='custom-sub-wensite-setting-div'>
        
           <h2 className='text-general-Medium margin-small custom-website-title-name'>Website Information</h2>
          {!dashboardEditMode && headerValues.length !== 0 && <button className='button-general-2 custom-edit-website-BTN' onClick={handleEditMode}>Edit</button>} 
           {dashboardEditMode && <button className='button-general custom-admin-BTN' onClick={handleCancleEditMode}>Cancel</button>}
          
     
             
          <div  className='dashboard-wrapper'>
             <div className="updatedText">{textUpdate && <h3>Updated successfully</h3>}</div>
            <form onSubmit={(e)=>handleHeaderValueUpdate(headerValues._id, e)} className="dashboard-form">

            <div className={dashboardEditMode ? "dasboard-input-div custom-dashboard-input-div": 'dasboard-input-div'}>
              <p  className='text-general-small color1'>Website Name</p>
              {dashboardEditMode ? <input className="dashboard-input input-general" type="text" placeholder={headerValues.websiteName} autoFocus
                 onChange={(e) => setWebsiteName(e.target.value)}
                 required
                /> : 
                <input className="dashboard-input" type="text" placeholder={headerValues.websiteName} readOnly/>
              }
              
             {!dashboardEditMode && 
               <div className='about-website-custom-div margin-small '> 
                <p  className='text-general-small color1 '>About Website</p>
                <p className='text-general-small color1 margin-small '>{headerValues.aboutWebsite}</p>
               </div>
             }
              
            </div>
             {dashboardEditMode && 
            <div className='margin-small flex-3'>
                <div className='color-picker-input-div'>
                     <p  className='text-general-small color1'>Header Color</p>
                    <input className='color-pciker1' onChange={(e) => setHeaderColor(e.target.value)} type="color" value={headerColor === "" ? headerValues.headerColor : headerColor} />
                </div>
                  <div className='color-picker-input-div'>
                      <p  className='text-general-small color1 color-picker-label'>Hex Value</p>
                      <input className='color-pciker1 color-picker-hex-input' type="text" placeholder={headerColor} onChange={(e) => setHeaderColor(e.target.value)} />
                  
                  </div>
               
              </div>

            }
             {dashboardEditMode && 
             <div className='margin-small flex-3 '>
                  <div className='color-picker-input-div'>
                     <p  className='text-general-small color1'>Navbar Color</p>
                      <input className='color-pciker1' onChange={(e) => setNavColor(e.target.value)} type="color" value={navColor === "" ? headerValues.navColor : navColor} />
                  </div>

                <div className='color-picker-input-div'>
                    <p  className='text-general-small color1 color-picker-label'>Hex Value</p>
                    <input className='color-pciker1 color-picker-hex-input' type="text" placeholder={navColor} onChange={(e) => setNavColor(e.target.value)} />
                  
                </div>
               
              </div>

            }

           {dashboardEditMode &&  <p  className='text-general-small color1 '>About website</p>}
            {dashboardEditMode && !editAboutWebsiteState &&
              
              <div >
                
                  <div className='about-website-custom-div margin-small flex-3'> 
                      <p className='text-general-small color1 custom-about-text'>{headerValues.aboutWebsite}</p>
                      {!editAboutWebsiteState && < FiEdit onClick={()=> setEditAboutWebsite(true)} className='custom-image-edit-icon'/>}
                      
                  </div>
                
              </div>
            }

            {
               dashboardEditMode && editAboutWebsiteState &&
              <div className='about-website-textArea-custom-div flex-3 margin-small'>
                
                <textarea className='about-website-textArea'
                  placeholder={headerValues.aboutWebsite ? headerValues.aboutWebsite: 'Tell us about your website'}

                 onChange={e => setAboutWebsite(e.target.value)}
                  required
                  >
                  
                </textarea>
                 < MdCancel onClick={()=> setEditAboutWebsite(false)} className='custom-image-edit-icon'/>

                 
              </div>
              
            }
            {aboutWebsiteMaxTextError ? <div className='empty-div-text  fadeInText'><p className='color2 text-general-small '>About website section should not be more than 400 words</p></div>: websiteNameEmptyError?
              <div className='empty-div-text  fadeInText'><p className='color2 text-general-small '>Website name section must not be empty or less than 4 words</p></div>:
              websiteNameMaxTextError ? <div className='empty-div-text  fadeInText'><p className='color2 text-general-small '>Website name section must not be more than 13 words</p></div>:

              userNotFoundError ? <div className='empty-div-text  fadeInText'><p className='color2 text-general-small '>No user found</p></div>:

              notAuthorizedError ?  <div className='empty-div-text  fadeInText'><p className='color2 text-general-small '>You are not permitted to carry out this action</p></div>:

              aboutWebsiteMinTextError ? <div className='empty-div-text  fadeInText'><p className='color2 text-general-small '>About website section should not be less than 100 words</p></div>:
              noValueIdFoundError ? <div className='empty-div-text  fadeInText'><p className='color2 text-general-small '>No frontend value with this ID found</p></div>:
              somethingWentWrongWithImageError ? <div className='empty-div-text  fadeInText'><p className='color2 text-general-small '>Something went wrong with image</p></div>:

              somethingWentWrongWithUserError ? <div className='empty-div-text  fadeInText'><p className='color2 text-general-small '>Something went wrong with user</p></div>:
               <div className='empty-div-text customParaText '></div>
            
            }
       
            {updateImageState && 
              <div className='flex-2 margin-small'>
                    <label>Upload Website Header Image</label>
                  <input className='upload-input' type="file" 
                    onChange={(e) => setFile(e.target.files[0])}
                  required/>
                </div>
            }
         
             {dashboardEditMode && 
            
                <>
                 <p className='text-general-small color1'>Header Image</p>
                        <div className='sub-image-custom-div flex-3'>
                          <img className='headerValueImg customHeaderValueImage margin-small' src={file? URL.createObjectURL(file): headerValues.headerImg} alt="" />
                          {!updateImageState && < FiEdit onClick={handleImageUpdateMode} className='custom-image-edit-icon'/>}
                          {updateImageState && < MdCancel onClick={handleCancelEditImageState} className='custom-image-edit-icon'/>}
                         
                        </div>
                
                </> 
            
             }
            
            {!dashboardEditMode && 
              <div className="headerImg-div custom-header-image-2 ">
                <p className='text-general-small color1'>Header Image</p>
                <img className='headerValueImg  customHeaderValueImage-2' src={file? URL.createObjectURL(file): headerValues.headerImg} alt="" />
               </div>
            }
            {dashboardEditMode && <div className='custom-website-setting-update-BTN-div'><button className={updating ? "updateModeBTN-unclick button-general" : "button-general custom-website-setting-update-BTN"} type="submit">Update</button></div>}

            
             </form>
          </div>
   

{/* handles creation of header values     */}
    {headerValues.length === 0 && 
      <div className='flex-2 header-value-create-div center-flex-align-display margin-small'>
        <div className='flex-2 header-value-create-wrapper margin-small'>
               <p className='text-general-small color1'>Website Name</p>
                <input onChange={(e) => setWebsiteName(e.target.value)} className='margin-small dashboard-input  ' type="text" />
              {websiteNameEmptyError? <p className='color2 text-general-small customParaText fadeInText'>Website name section must not be empty or less than 4 words</p>: 
               <p className='color2 text-general-small customParaText'>Website name section must not be empty or less than 4 words</p>
               
               }

                {websiteNameMaxTextError ? <p className='color2 text-general-small customParaText fadeInText'>Website name section must not be more than 13 words</p>: 
               <p className='color2 text-general-small customParaText'>Website name section must not be more than 13 words</p>
               
               }
              <div className='margin-small flex-3'>
                <div className='color-picker-input-div'>
                    <p className='text-general-small color1'>Header Color</p>
                    <input className='color-pciker1' onChange={(e) => setHeaderColor(e.target.value)} type="color" value={headerColor} />
                </div>
                  <div className='color-picker-input-div'>
                      <label className='color-picker-label'>Hex Value</label >
                      <input className='color-pciker1 color-picker-hex-input' type="text" placeholder={headerColor} onChange={(e) => setHeaderColor(e.target.value)} />
                  
                  </div>
               
              </div>
              
       
              <div className='margin-small flex-3 '>
                  <div className='color-picker-input-div'>
                      <p className='text-general-small color1'>Navbar Color</p>
                      <input className='color-pciker1' onChange={(e) => setNavColor(e.target.value)} type="color" value={navColor} />
                  </div>

                <div className='color-picker-input-div'>
                    <label className='color-picker-label'>Hex Value</label >
                    <input className='color-pciker1 color-picker-hex-input' type="text" placeholder={navColor} onChange={(e) => setNavColor(e.target.value)} />
                  
                </div>
               
              </div>

               
               
              <p className='text-general-small color1 margin-small'>About Website</p>
              <textarea className='margin-small custom-about-user-textbox'  
                  onChange={e => setAboutWebsite(e.target.value)}
                 >
                
              </textarea>

              {aboutWebsiteMaxTextError ? <div  className='empty-div-text  fadeInText'><p className='color2 text-general-small'>About section must not be more than 400 words</p></div> : 
              
              
              aboutWebsiteMinTextError ? <div  className='empty-div-text  fadeInText'><p className='color2 text-general-small'>About section must not be less than 100 words</p></div>: 

               
              userNotFoundError ? <div  className='empty-div-text  fadeInText'><p className='color2 text-general-small'>User not found, contact support</p></div>: 

              
              notAuthorizedError ? <div  className='empty-div-text  fadeInText'><p className='color2 text-general-small'>You are not authorized to perform this action</p></div>:

               
              somethingWentWrongError ? <div  className='empty-div-text  fadeInText'><p className='color2 text-general-small'>Something went wrong, reload and try again or contact suppor</p></div>:

              
              websiteValuesAlreadyExistError ? <div  className='empty-div-text  fadeInText'><p className='color2 text-general-small'>Website values already exist. You can not create more than one. Consider editing existing values</p></div>:
              <div className='empty-div-text customParaText '></div>
               
               }

             <p className='text-general-small color1 margin-small'>Upload Image</p>
              <div className='custom-upload-image-div '>
                  <input  className='margin-small  custom-upload-image-input' type="file" 
                    onChange={e=> setFile(e.target.files[0])} 
                  />

                  
                <img className='custom-display-header-image ' src={file && URL.createObjectURL(file)} alt="" />
                
              </div>
               {websiteHeaderImageEmptyError ? <div  className='empty-div-text  fadeInText'><p className='color2 text-general-small'>Website header image can not be empty</p></div>: 
               <div className='empty-div-text customParaText '></div>
               
               }

                {somethingWentWrongWithImageError ? <div  className='empty-div-text  fadeInText'><p className='color2 text-general-small'>Something went wrong with the image, try again</p></div>: 
               <div className='empty-div-text customParaText '></div>
               
               }

             
          <div className='flex-3 center-flex-justify-display'><button onClick={handleHeaderValueCreation} className=' button-general-2'  type='button'>Submit</button></div>
        </div>
      </div>
    

    }
        </div>

 </div>    
  </div>
   </article>
 
  
  
   </>
    
        
  
    
  
    
  )
}

export default WebsiteSettings