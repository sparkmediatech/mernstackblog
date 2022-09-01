import React, {useEffect, useContext, useState, useRef} from 'react';
import './menu.css';
import AdminSidebar from './AdminSidebar';
import  BASE_URL from '../../hooks/Base_URL';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {AuthContext} from '../../context/AuthProvide';
import axios from 'axios';
import {FaEdit} from 'react-icons/fa';
import {AiFillDelete} from 'react-icons/ai'
import {MdOutlineAdd} from 'react-icons/md';
import {ImCancelCircle} from 'react-icons/im';

function Menu() {
        const {auth, dispatch, componentName, pathName, setPathName, pathNameMount, setPathNameMount, pathLocation,} = useContext(AuthContext);
        const axiosPrivate = useAxiosPrivate();
        const [showEditPathNameInput, setShowEditPathNameInput] = useState(false)
        const [pathNameSelectedId, setPathNameSelectedId] = useState('');
        const [addPathNameField,  setAddPathNameField] = useState(false);
        const [selectedComponentName,  setSelectedComponentName] = useState('');
  
        const [compArrayToCreate, setCompArrayToCreate] = useState([]);
        const [selectedPathName, setSelectedPathName] = useState('');
        const [selectedMenuName, setSelectedMenuName] = useState('')
        const pathNameRef = useRef('');
        const pathNameMenuNameRef = useRef('')
        //error states start from here
        const [pathMenuEmptyError, setPathNameEmptyError] = useState(false);
        const [userNotAuthorizedError, setUserNotAuthorizedError] = useState(false);
        const [menuNameError, setMenuNameError] = useState(false);
        const [aliasNameProvidedError, setAliasNameProvidedError] = useState(false);
        const [aliasNameEmptyError, setAliasNameEmptyError] = useState(false);
        const [pathNameProvidedError, setPathNameProvidedError] = useState(false);
        const [pathNameIsEmptyError, setPathNameIsEmptyError] = useState(false);
        const [pathNameSpaceError, setPathNameSpaceError] = useState(false);
        const [pathNameCapsError,  setPathNameCapsError] = useState(false);
        const [pathNameNumberError, setPathNameNumberError] = useState(false);
        const [pathNameExistError, setPathNameExistError] = useState(false);
        const [pathMenuNameExistError, setPathMenuNameExistError] = useState(false);
        const [somethingWentWrong, setSomethingWentWrongError] = useState(false);
        const [menuNameNumberError, setMenuNameNumberError] = useState(false);
        const [noUserFoundError, setNoUserFoundError] = useState(false);
        const [clientPathNameNotFoundError, setClientPathNameNotFoundError] = useState(false)



  
//create new pathName
 const handleAddNewPathName = async () =>{
       
       const pathName = {
            pathName: pathNameRef.current.value,
            aliasName:selectedComponentName,
            menuName: pathNameMenuNameRef.current.value
        }
    
        try{
             dispatch({type:"CURSOR_NOT_ALLOWED_START"});
             const response = await axiosPrivate.post(`${BASE_URL}/pathname`,  pathName, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
            })
            setSelectedComponentName('')
            setAddPathNameField(false)
            setPathNameMount(!pathNameMount)
            setPathName([response.data])
           
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
        }catch(err){
              dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
              if(err.response.data == 'Menu name must be present'){
                return setPathNameEmptyError(true)
              }
              if(err.response.data == 'no user found'){
                return setNoUserFoundError(true)
              }

              if(err.response.data == 'you do not have permission'){
                return setUserNotAuthorizedError(true)
              }

              if(err.response.data == 'menu name can not be empty'){
                return setMenuNameError(true)
              }

              if(err.response.data == 'alias name must be provided'){
                return setAliasNameProvidedError(true)
              }

              if(err.response.data == 'alias name must not be empty'){
                return setAliasNameEmptyError(true)
              }

              if(err.response.data == 'path name must be provided'){
                return setPathNameProvidedError(true)
              }

              if(err.response.data == 'pathName must not be empty'){
                return  setPathNameIsEmptyError(true)
              }

              if(err.response.data == 'pathname must not contain empty space'){
                return setPathNameSpaceError(true)
              }

              if(err.response.data == 'path name should not be all capital letters'){
                return setPathNameCapsError(true)
              }

            if(err.response.data === 'pathname should not be a number'){
              return setPathNameNumberError(true)
            }

            if(err.response.data === 'client menu name already exist'){
              return setPathNameExistError(true)
            }

          if(err.response.data == 'client path name already exist'){
            return setPathMenuNameExistError(true)
          }
        if(err.response.data === 'something went wrong'){
          return setSomethingWentWrongError(true)
        }
        if(err.response.data == 'menu name should not be a number'){
          return setNoUserFoundError(true)
        }
        }
 }

 
 //handle delete of pathname
 const handleDeletePath = async(pathNameId)=>{
    try{
        dispatch({type:"CURSOR_NOT_ALLOWED_START"});
        const response = await axiosPrivate.delete(`${BASE_URL}/pathname/${pathNameId}`,{ withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
            })
                setPathNameMount(!pathNameMount)
                setPathName([response.data])
         dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
    }catch(err){
         dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
         if(err.response.data == 'user not found'){
          return setNoUserFoundError(true)
         }
        if(err.response.data === 'You are not authourized to perform this action'){
          return setUserNotAuthorizedError(true)
        }
      if(err.response.data == 'no pathName found'){
        return setClientPathNameNotFoundError(true)
      }
    if(err.response.data === 'Something went wrong'){
      return setSomethingWentWrongError(true)
    }
    }
 }
  //handles the toggling of pathName creation input field
  const handleToggleCreateInput = (componentName) =>{
        setSelectedComponentName(componentName)
        setAddPathNameField(true)
    
  }
  //this handles the state of turning on edit mode
  const handleEditPathName = (pathNameId,  pathName, menuName) =>{
    setPathNameSelectedId(pathNameId);
    setShowEditPathNameInput(true);
    setSelectedPathName(pathName);
    setSelectedMenuName(menuName)
    
  }
  
 

//update a pathname
const handleClientNameUpdate = async (pathNameId) =>{
     dispatch({type:"CURSOR_NOT_ALLOWED_START"});
    const pathName = {
            pathName: pathNameRef.current.value,
            menuName: pathNameMenuNameRef.current.value
        }
        try{
            const response = await axiosPrivate.patch(`${BASE_URL}/pathname/${pathNameId}`,  pathName ,{ withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
            })

             setPathNameMount(!pathNameMount)
            pathNameRef.current.value = "";
            pathNameMenuNameRef.current.value = "";
            setShowEditPathNameInput(false)
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
        }catch(err){
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            if(err.response.data == 'menu name must be present'){
              
                  return setPathNameEmptyError(true)
            }
            if(err.response.data == 'pathName must be present'){
               return setPathNameProvidedError(true)
            }
          if(err.response.data == 'pathname must not contain empty space'){
            return setPathNameSpaceError(true)
          }
          if(err.response.data == 'pathName must not be empty'){
            return setPathNameIsEmptyError(true)
          }
          if(err.response.data == 'pathname should not be a number'){
            return setPathNameNumberError(true)
          }
          if(err.response.data === 'menu name should not be a number'){
            return setMenuNameNumberError(true)
          }
          if(err.response.data === 'path name should not be all capital letters'){
            return setPathNameCapsError(true)
          }
          if(err.response.data === 'menu name must not be empty'){
             return setMenuNameError(true)
          }
          if(err.response.data == 'no user found'){
            return 
          }
          if(err.response.data == 'you do not have permission'){
            return setUserNotAuthorizedError(true)
          }

          if(err.response.data == 'no pathname found'){
            return setClientPathNameNotFoundError(true)
          }
        if(err.response.data == 'something went wrong'){
          return setSomethingWentWrongError(true)
        }
        }
}

//handle cancel pathName edit mode
const handleCanlePathNameEditMode = ()=>{
    setPathNameSelectedId('');
    setShowEditPathNameInput(false)
}
//Whoever that can improve this performance can let me know. This code checks to see which component name needs a pathname. It runs multiple map and filter methdos which surely would affect performance in large array
//however, it is obvious that this array can never be more than 7 items. It maybe safe to say that this can fly
//it first convert the pathName into a flat array of object containing only the alias names in an array
//the aliasNames are used to check and return only component names that are not found inside the arrayPath variable
//this still returns array of objects. I used map method once more to return only the component names which is what I need and set that in a state.
//the add pathName icon is checks if the component name is found in the new state, if so, it makes it available for a new pathname to be created.

useEffect(()=>{
   const arrayPath = pathName.map((singlePath) => singlePath.aliasName)
   const arrayComp = componentName.filter((singleCom) =>{
    
    return !arrayPath.includes(singleCom.componentName)
   })
   
   const compToCreate = arrayComp.map((singleComp) => singleComp.componentName)
  
   setCompArrayToCreate(compToCreate)
}, [pathName, pathLocation])


//useEffect for all kinds of notifications to time out

useEffect(()=>{
    setTimeout(() => {
        setPathNameEmptyError(false)    
    }, 3000);

    setTimeout(() => {
       setUserNotAuthorizedError(false)    
    }, 3000);

     setTimeout(() => {
       setMenuNameError(false)    
    }, 3000);

     setTimeout(() => {
       setAliasNameProvidedError(false)    
    }, 3000);

    setTimeout(() => {
       setAliasNameEmptyError(false)    
    }, 3000);

     setTimeout(() => {
       setPathNameProvidedError(false)    
    }, 3000);


    setTimeout(() => {
       setPathNameEmptyError(false)    
    }, 3000);

    setTimeout(() => {
       setPathNameSpaceError(false)    
    }, 4000);

    setTimeout(() => {
       setPathNameCapsError(false)    
    }, 3000);

  setTimeout(() => {
       setPathNameNumberError(false)    
    }, 3000);

  setTimeout(() => {
       setPathNameExistError(false)    
    }, 3000);

  setTimeout(() => {
       setPathMenuNameExistError(false)    
    }, 3000);

  setTimeout(() => {
       setSomethingWentWrongError(false)    
    }, 3000);

  setTimeout(() => {
       setMenuNameNumberError(false)    
    }, 3000);

   setTimeout(() => {
       setNoUserFoundError(false)    
    }, 3000);

  setTimeout(() => {
       setClientPathNameNotFoundError(false)    
    }, 3000);
}, [pathMenuEmptyError, userNotAuthorizedError, menuNameError, aliasNameProvidedError, aliasNameEmptyError, pathNameProvidedError,
pathNameIsEmptyError, pathNameSpaceError, pathNameCapsError, pathNameNumberError, pathNameExistError, pathMenuNameExistError,
somethingWentWrong, menuNameNumberError, noUserFoundError, clientPathNameNotFoundError
])

    return (
   <>
   
    <article className='dashboard-container'>
       <div className=" admin-dashboard-custom-container flex-3">

            < AdminSidebar/>

                <div className='other-pages custom-other-page topMargin-Extral-Large '>
                        <h3 className='text-general-Medium margin-small'>Menu Page</h3>
                    <div className='flex-3 custom-menu-wrapper'>

                        <div className=' margin-small custom-component-div'>
                            <h4 className='color1 text-general-small2'>Components</h4>
                            <div className='topMargin-medium custom-menu-properties-div'>
                                { componentName.map((singleComponent, key) =>{

                                const {componentName, _id: componentId, } = singleComponent
                                console.log(key)
                                return(
                                    <>
                                        <div key={key} className='custom-single-componentName-div margin-small center-flex-align-display'>
                                            <p className='text-general-small color1'>{componentName}</p>
                                            { compArrayToCreate.includes(componentName) && <MdOutlineAdd className='marginLeft-extraSmall custom-addPathNameIcon color2 mousePointer-click-general' onClick={()=> handleToggleCreateInput(componentName)}/>}
                                        </div>
                                    </>
                                )
                               })}
                            </div>
                               
                            
                        </div>
                    
                    
                            <div className=' margin-small custom-component-div  marginLeft-extraSmall'>
                                  <div className='flex-3 center-flex-align-display custom-pathName-title-div'><h4 className='color1 text-general-small2'>PathName</h4> </div>  
                                <div className='topMargin-medium custom-menu-properties-div'>
                                    {pathName?.length < 1 && !addPathNameField && <div className='empty-pathName-text-div'><h4 className='color1 text-general-extral-small'>Your component pathnames are empty. Create pathnames for your components</h4></div>}
                                    {pathName?.map((singlePathName, key) =>{

                                    const {pathName, _id: pathNameId, menuName} = singlePathName
                                    console.log(key)
                                    return(
                                    <>
                                        <div key={key} className='custom-single-componentName-div margin-small flex-3 center-flex-align-display'>
                                                <div className='custom-pathName-text-div'>
                                                 
                                                   
                                                    {
                                                        pathNameSelectedId == pathNameId && showEditPathNameInput ?
                                                        
                                                        <div>
                                                            <input type="text" className='custom-addNewPathName-input custom-edit-input' 
                                                                ref={pathNameMenuNameRef} 
                                                            placeholder={`Edit menu name ${selectedMenuName}`}/>

                                                            <input type="text" className='custom-addNewPathName-input marginLeft-extraSmall' 
                                                                ref={pathNameRef} 
                                                            placeholder={`Edit path name ${selectedPathName}`}/>
                                                        </div>

                                                        :

                                                         <div className='menuName-pathName-custom-div flex-3'>
                                                            <div className='custom-menuName-div '><h5 className='color3 text-general-extral-small'>Menu Name</h5><p className='text-general-small color1 custom-pathName-text '>{menuName}</p></div>
                                                            <div className='custom-pathName-div flex-3'><h5 className='color3 text-general-extral-small marginLeft-extraSmall'>Menu Path</h5><p className='text-general-small color1 custom-pathName-text '>/{pathName}</p></div>
                                                         </div>
                                                     }
                                                </div>
                                            <div className='flex-3 custom-edit-delete-div center-flex-align-display '>
                                                {showEditPathNameInput &&  <MdOutlineAdd className='custom-addPathNameIcon  marginRight-extraSmall mousePointer-click-general color2' onClick={()=>  handleClientNameUpdate(pathNameId)}/>}
                                                {showEditPathNameInput &&  <ImCancelCircle className='red-text general-cursor-pointer marginRight-extraSmall' onClick={handleCanlePathNameEditMode}/>}
                                                    
                                                {!showEditPathNameInput &&  <FaEdit className='general-cursor-pointer color2 marginRight-extraSmall' onClick={() => handleEditPathName(pathNameId, pathName, menuName)}/>}
                                                {!showEditPathNameInput && <AiFillDelete className='general-cursor-pointer color2' onClick={()=> handleDeletePath(pathNameId)}/>}
                                                
                                            
                                            </div>
                                           
                                        </div>
                                    </>
                                    )
                                    })}
                                </div>
                               {addPathNameField && selectedComponentName && <div className='custom-addNewPathName-div flex-2 center-flex-justify-display'><input type="text" className='custom-addNewPathName-input' 
                                 ref={pathNameMenuNameRef} 
                               placeholder='create new Menu name'/>

                              

                               <input type="text" className='custom-addNewPathName-input marginLeft-extraSmall' 
                                 ref={pathNameRef} 
                               placeholder='create new pathName'/>

                               
                                    <div className='custom-create-cancel-pathName-div flex-3 center-flex-align-display' >
                                        <MdOutlineAdd className='marginRight-extraSmall custom-addPathNameIcon color2 mousePointer-click-general' onClick={handleAddNewPathName}/>
                                        <ImCancelCircle className='red-text general-cursor-pointer marginRight-extraSmall' onClick={()=> {setAddPathNameField(false); setSelectedComponentName('')}}/>
                                    </div>
                               </div>
                               
                               }
                             {pathMenuEmptyError && <p className='paragraph-text red-text'>Menu name must not be present</p>}

                            {userNotAuthorizedError && <p className='paragraph-text red-text'>Sorry, you are not authorized to perform this action</p>}

                            {userNotAuthorizedError && <p className='paragraph-text red-text'>Menu name must not be empty</p>}

                            {aliasNameProvidedError && <p className='paragraph-text red-text'>Alias name must be provided</p>}

                            {aliasNameEmptyError && <p className='paragraph-text red-text'>Alias name must not be empty</p>}

                            {pathNameProvidedError && <p className='paragraph-text red-text'>Path name must be provided</p>}

                            {pathNameIsEmptyError && <p className='paragraph-text red-text'>Path name must not be empty</p>}

                            {pathNameSpaceError && <p className='paragraph-text red-text'>Path name must not contain any space. You may use dash - instead for two words</p>}

                            {pathNameCapsError && <p className='paragraph-text red-text'>Path name must not be all capital letters</p>}

                            {pathNameNumberError && <p className='paragraph-text red-text'>Path name must not be all number</p>}

                            {pathNameExistError && <p className='paragraph-text red-text'>Menu name already exist</p>}

                            {pathMenuNameExistError && <p className='paragraph-text red-text'>path name already exist</p>}

                            {menuNameNumberError && <p className='paragraph-text red-text'>Menu name must not be all numbers</p>}

                            {noUserFoundError && <p className='paragraph-text red-text'>No user found</p>}

                            {clientPathNameNotFoundError && <p className='paragraph-text red-text'>No pathname file found</p>}
                            </div>
                            
                           
                            
                            
                            <div className=' margin-small custom-instruction-div  flex-2 '>
                                
                                    <h4 className='color1 text-general-small2 marginLeft-extraSmall'>Instructions</h4>
                                <div className='topMargin-medium custom-instruction-property-div flex-2'>
                                   <p className='color1 text-general-small marginLeft-extraSmall '>The component section contains the name of all the components in this app. The PathName section contains your Menu name and your menu path name. Your top menu can 

                                    take up to 5 names depending how long the names are. The names of the components should tell you what those components are for. For instance, Home component is for your homepage
                                    Contact component is for your contact page. About component is for About your service, etc. This means you should tailor your menu name to this direction. Though you are free to 
                                    give your menu name any name you like. For example, when you give your Home component a menu name, you can decide to call it Welcome or any name you like. You will also decide the path for this menu.
                                    The app has been promgrammed to assign the name you gave to each component via the pathName to be the URL name of that page. For example, your Home component, if you decide
                                   Take for example, if you decide to give your ABOUT component a menu name of ABOUT US, and you decide to give it a pathName of /about-us. That means your ABOUT US page would be located at www.yoursite.com/about-us
                                    For further information on this, kindly visit the documentation page.
                                   </p>
                                </div>
                               
                            
                            </div>


                    </div>


                    
                        
                </div>    
        </div>
   </article>
   
   
   </>
  )
}

export default Menu