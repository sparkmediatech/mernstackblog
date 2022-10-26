import React, {useEffect, useContext, useState, useRef} from 'react';
import './pagesetting.css';
import AdminSidebar from './AdminSidebar';
import  BASE_URL from '../../hooks/Base_URL';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {AuthContext} from '../../context/AuthProvide';
import axios from 'axios';
import {FaEdit} from 'react-icons/fa';
import {AiFillDelete} from 'react-icons/ai';
import { useMediaQuery } from '../../hooks/CustomMediaQuery';
import {FiMenu} from 'react-icons/fi'

function PageSettings() {
    const axiosPrivate = useAxiosPrivate();
    const {auth, logUser, dispatch, setAuth,setgeneralFetchError, openAdminSideBar, setOpenAdminSideBar,} = useContext(AuthContext);
    const [catName, setCategories] = useState([]);
    const categoryRef = useRef('');
    const [mount, setMount] = useState(false);
    const [created, setCreated] = useState(false);
    const [alreadyExitError, setAlreadyExistError] = useState(false);
    const [categoryLessThanMinError, setCategoryLessThanMinError] = useState(false);
    const [categoryMoreThanMaxError, setCategoryMoreThanMaxError] = useState(false);
    const [categoryEmptyError, setCategoryEmptyError] = useState(false);
    const [noUserFoundError, setNoUserFoundError] = useState(false);
    const [notAuthourizedError, setNotAuthourizedError] = useState(false);
    const [categoryNumberError, setCategoryNumberError] = useState(false);
    const [categoryMaxLimitError, setCategoryMaxLimitError] = useState(false);
    const [editCategory, setEditCategory] = useState(false);
    const [categoryId, setCategoryId] = useState('');
    const [categoryUpdated, setCategoryUpdated] = useState(false);
    const [categoryDeleted, setCategoryDeleted] = useState(false);
    const [deletCategoryError, setDeleteCategoryError] = useState(false);
    const [noCategoryFoundError, setNoCategoryFoundError] = useState(false);
    const [somethingWentWrongError, setSomethingWentWrongError] = useState(false);
    const [emptySpaceCatNameError, setEmptySpaceCatNameError] = useState(false);
    const [categoryEmptySpaceError, setCategoryEmptySpaceError] = useState(false)
    let   tabletMode = useMediaQuery('(max-width: 1200px)');
    
    
    //fetch all categories
    useEffect(()=>{
             const fetchAllCategories = async () =>{
            try{
                const res = await axios.get(`${BASE_URL}/category`);

                console.log(res.data)
                return setCategories(res.data);
                
            
            }catch(err){
                if(err.response.data === 'something went wrong'){
                    return setgeneralFetchError(true)
                }
                if(err.response.data === 'No categories found'){
                    return setgeneralFetchError(true)
                }
            }

            
        }

        fetchAllCategories() 
    }, [mount])

    

    //create new category

    const createNewCategory = async ()=>{
        dispatch({type:"CURSOR_NOT_ALLOWED_START"});
        const categoryName = {
            catName: categoryRef.current.value
        }
        try{
            const response = await axiosPrivate.post(`${BASE_URL}/category`, categoryName, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
            })
            setMount(!mount);
            setCreated(true);
            categoryRef.current.value = ''
            console.log(response.data)
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            
            //return setCategories([response.data])
            
        }catch(err){
            if(err.response.data === 'Category already exist'){
                dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
                setAlreadyExistError(true);
                
            };
            if(err.response.data === "category name should be more than 4 letters"){
                dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
                setCategoryLessThanMinError(true)
            };
            if(err.response.data === "category name should not be more than 16 letters"){
                dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
                setCategoryMoreThanMaxError(true)
            };
            if(err.response.data === "Category name must not be empty"){
                dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
                setCategoryEmptyError(true)
            };
            if(err.response.data === "No user found"){
                dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
                setNoUserFoundError(true) 
            };
            if(err.response.data === "You are not authourized to perform this action"){
                dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
                setNotAuthourizedError(true)
            };
            if(err.response.data === "check your category name, category name must be letters"){
                dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
                setCategoryNumberError(true)
            };
            if(err.response.data === "There are already 8 categories, you can not create more than 8"){
                dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
                setCategoryMaxLimitError(true)
            }

            if(err.response.data == 'catName must not contain empty space'){
                return setEmptySpaceCatNameError(true)
            }
           
        }
      
    };

     //handle edit category state
    const editCategoryState = (getValue)=>{
        setEditCategory(true);
        categoryRef.current.value = getValue

    }


    //handle edit category
    const handleEditCategory = async ()=>{
         dispatch({type:"CURSOR_NOT_ALLOWED_START"});
        
        const updatedCategoryName = {
            catName: categoryRef.current.value
        }
        console.log(updatedCategoryName)
        try{
            const response = await axiosPrivate.patch(`${BASE_URL}/category/${categoryId}`, updatedCategoryName, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
            });
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
             setMount(!mount);
             setCategoryUpdated(true);
             categoryRef.current.value = "";
             setEditCategory(false)
        }catch(err){
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            if(err.response.data == 'No category with the id found'){
                return setNoCategoryFoundError(true)
            }
        if(err.response.data === "No user found"){
            return setNoUserFoundError(true)
        }
        if(err.response.data === 'admin'){
            return setNotAuthourizedError(true)
        }
        if(err.response.data === 'something went wrong'){
            return setSomethingWentWrongError(true)
        }

        if(err.response.data == 'catName must not contain empty space'){
            return setCategoryEmptySpaceError(true)
        }

        if(err.response.data == 'catName should not be a number'){
            return setCategoryNumberError(true)
        }
        if(err.response.data == 'category name should be more than 4 letters'){
            return setCategoryLessThanMinError(true)
        }
        if(err.response.data == 'category name should not be more than 16 letters'){
            return setCategoryMoreThanMaxError(true)
        }
        }

    };

    //handle delete category

    const handleDeletCategory = async (categoryId) =>{
         dispatch({type:"CURSOR_NOT_ALLOWED_START"});
        
        try{
            const response = await axiosPrivate.delete(`${BASE_URL}/category/${categoryId}`,{ withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
            });
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
             setMount(!mount);
             setCategoryDeleted(true)
        }catch(err){
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
             if(err.response.data === "You can not delete a category that has been assigned a post. Please, consider changing the name"){
                 setDeleteCategoryError(true)
            }
            if(err.response.data === 'User not found'){
                return setNoUserFoundError(true)
            }
            if(err.response.data === 'admin'){
                setNotAuthourizedError(true)
            }
            if(err.response.data === 'no category found'){
                return setNoCategoryFoundError(true)
            }
            if(err.response.data === 'Something went wrong'){
                return setSomethingWentWrongError(true)
            }
        }
    }
    //hand cancel of editmode
    const handlecancelEdit = ()=>{
        setEditCategory(false);
        setCategoryId('')
        categoryRef.current.value = ""

    }
    //handle responses such as error and success
useEffect(() =>{
    if(created){
         setTimeout(() => {
            setCreated(false)
        }, 2000);
    }    
       
    if(alreadyExitError){
        setTimeout(() => {
            setAlreadyExistError(false)
        }, 2000);
    }
    
    if(categoryLessThanMinError){
        setTimeout(() => {
            setCategoryLessThanMinError(false)
        }, 2000);
    }

        
    if(categoryMoreThanMaxError){
         setTimeout(() => {
            setCategoryMoreThanMaxError(false)
        }, 2000);
    }
       
    if(categoryEmptyError){
          setTimeout(() => {
            setCategoryEmptyError(false)
        }, 2000);
    }
     
    
    if(noUserFoundError){
         setTimeout(() => {
            setNoUserFoundError(false)
        }, 2000);
    }

    if(notAuthourizedError){
          setTimeout(() => {
            setNotAuthourizedError(false)
        }, 2000);
    }   

    
    if(categoryNumberError){
          setTimeout(() => {
            setCategoryNumberError(false)
        }, 2000);
    }

     if(categoryMaxLimitError){
        setTimeout(() => {
            setCategoryMaxLimitError(false)
        }, 2000);
     }

        
     if(categoryUpdated){
         setTimeout(() => {
            setCategoryUpdated(false)
        }, 2000);
     }
       
     if(categoryDeleted){
         setTimeout(() => {
           setCategoryDeleted(false)
        }, 2000);
     }
       
     if(deletCategoryError){
        setTimeout(() => {
          setDeleteCategoryError(false)
        }, 3000);
     }
        
     if(noCategoryFoundError){
         setTimeout(() => {
          setNoCategoryFoundError(false)
        }, 3000);
     }
    
     if(somethingWentWrongError){
         setTimeout(() => {
          setSomethingWentWrongError(false)
        }, 3000);
     }

     if(emptySpaceCatNameError){
         setTimeout(() => {
          setEmptySpaceCatNameError(false)
        }, 3000);
     }
   
     if(categoryEmptySpaceError){
        setTimeout(() => {
            setCategoryEmptySpaceError(false)
        }, 3000);
     }
    }, [created, alreadyExitError, categoryLessThanMinError, categoryMoreThanMaxError, categoryEmptyError, 
        noUserFoundError, notAuthourizedError, categoryNumberError, 
        categoryMaxLimitError, categoryUpdated, categoryDeleted, deletCategoryError, noCategoryFoundError, somethingWentWrongError, emptySpaceCatNameError,
    categoryEmptySpaceError
    ]);




//this brings the admin sidebar out in a screen mode that is not desktop screen mode
const handleOpenSidebarMenu = ()=>{
  if(openAdminSideBar == 'admin-sidebar-slideOut'){
      setOpenAdminSideBar('admin-sidebar-slideIn')
  }
 
    
}
       
//this useEffect helps to remove the blur effect that was called when the admin side bar is toggle in during the tablet or mobile device screen mode. 
useEffect(()=>{
  if(openAdminSideBar == 'admin-sidebar-slideIn'){
      setOpenAdminSideBar('admin-sidebar-slideOut')
  }
}, [tabletMode])
   
console.log(openAdminSideBar)

  return (

         <>
   <article className='dashboard-container'>
       <div className=" admin-dashboard-custom-container flex-3">

            < AdminSidebar/>
    
     <FiMenu onClick={handleOpenSidebarMenu}  className={openAdminSideBar == 'admin-sidebar-slideOut' ?  'custom-sidebar-menuOpen' :  'custom-sidebar-menuOpen customMenuOpenOff' }/>

                <div className={openAdminSideBar === 'admin-sidebar-slideIn' ? 'other-pages custom-other-page bg-blur2 curson-not-allowed-2 pointer-events-none ' : 'other-pages custom-other-page'}>
                                <h3 className='text-general-Medium  custom-page-setting-title-text'>Page Setting</h3>
                        <div className='category-custom-div-wrapper margin-small'>
                               
                            <div className='flex-3 category-div-wrapper'>
                                <div className='create-category-div flex-2 topMargin-medium'>
                                    <p className='text-general-small2 color1 topMargin-medium custom-create-category-title-text'>Create category</p>
                                    <input type="text" className='topMargin-medium input-general custom-category-input custom-create-category-input'
                                        ref={categoryRef}
                                        />
                                    {!editCategory && <div className='custom-page-setting-BTN-div flex'><button onClick={ createNewCategory} className='button-general flex custom-page-setting-BTN'>Create</button></div>}
                                    {editCategory && <div className='custom-page-setting-BTN-div flex'><button onClick={handleEditCategory} className='button-general custom-page-setting-BTN'>Update</button></div>}
                                    {editCategory && <div className='custom-page-setting-BTN-div flex'><button onClick={handlecancelEdit} className='button-general custom-page-setting-BTN custom-page-setting-BTN'>Cancel</button></div>}
                                    { created && <p className='paragraph-text '>Category created</p>}
                                    { alreadyExitError && <p className='paragraph-text red-text'>There is a category with that name already</p>}
                                    { categoryLessThanMinError && <p className='paragraph-text red-text'>Category should be more than 4 letters</p>}
                                    { categoryMoreThanMaxError && <p className='paragraph-text red-text'>Category should not be more than 16 letters</p>}
                                    { categoryEmptyError && <p className='paragraph-text red-text'>Category must not be empty</p>}
                                    { noUserFoundError && <p className='paragraph-text red-text'>No user found</p>}
                                    { notAuthourizedError && <p className='paragraph-text red-text'>You are not authorized to perfomr this action</p>}
                                    { categoryNumberError && <p className='paragraph-text red-text'>category must not be number</p>}
                                    { categoryMaxLimitError && <p className='paragraph-text red-text'>You can not create more than 8 categories</p>}
                                    { categoryUpdated && <p className='paragraph-text'>Category name updated successfully</p>}
                                    { categoryDeleted && <p className='paragraph-text'>Category deleted successfully</p>}
                                    { deletCategoryError && <p className='paragraph-text'>You can not delete a category that already has a post, consider changing the name</p>}
                                    {noCategoryFoundError && <p className='paragraph-text'>No category found</p>}
                                    {somethingWentWrongError && <p className='paragraph-text'>Something went wrong </p>}
                                    
                                    {emptySpaceCatNameError && <p className='paragraph-text'>Something went wrong </p>}

                                    {categoryEmptySpaceError && <p className='paragraph-text'>Category must not contain any space </p>}


                                     

                                </div>

                                <div className='category-display-div flex-2'>
                                     {catName.length <= 0 && <p className='paragraph-text topMargin-Extral-Large'>You have not created any page yet</p>}
                                    {catName.map((singleCategory, index)=>{
                                        const {catName, _id: categoryId} = singleCategory
                                        {/* convert catNames First letter to upper case   */}
                                        {/*const catNameToUpperCase = catName.charAt(0).toUpperCase() + catName.slice(1);*/}
                        
                                        
                                        return(
                                        <>
                                            <div className='category-single-div flex-3 center-flex-align-display' key={index}>
                                                <div className='custom-category-name-div'><p className='text-general-small2 category-custom-text'>{catName}</p></div>
                                                <div className='category-icons-div '>
                                                    <FaEdit  className='category-icon-edit'onClick={() => {editCategoryState(catName);  setCategoryId(categoryId)}} />
                                                    <AiFillDelete onClick={()=>  handleDeletCategory(categoryId)} className='category-icon-edit category-icon-delete'/>
                                                </div>
                                            </div>
                  
                                         </>
                                    )
                                    })}
                                </div>
               
                            </div>
                        </div>
                </div>    
        </div>
   </article>
 
  
  
   </>
    

   
  )
}

export default PageSettings