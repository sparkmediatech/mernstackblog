import React, {useEffect, useContext, useState, useRef} from 'react';
import './pagesetting.css';
import AdminSidebar from './AdminSidebar';
import  BASE_URL from '../../hooks/Base_URL';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {AuthContext} from '../../context/AuthProvide';
import axios from 'axios';
import {FaEdit} from 'react-icons/fa';
import {AiFillDelete} from 'react-icons/ai'

function PageSettings() {
    const axiosPrivate = useAxiosPrivate();
    const {auth, logUser, dispatch, setAuth,setgeneralFetchError } = useContext(AuthContext);
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
    const [somethingWentWrongError, setSomethingWentWrongError] = useState(false)
    
    
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
        setTimeout(() => {
            setCreated(false)
        }, 2000);

        setTimeout(() => {
            setAlreadyExistError(false)
        }, 2000);

        setTimeout(() => {
            setCategoryLessThanMinError(false)
        }, 2000);

        setTimeout(() => {
            setCategoryMoreThanMaxError(false)
        }, 2000);

        setTimeout(() => {
            setCategoryEmptyError(false)
        }, 2000);

        setTimeout(() => {
            setNoUserFoundError(false)
        }, 2000);

        setTimeout(() => {
            setNotAuthourizedError(false)
        }, 2000);

        setTimeout(() => {
            setCategoryNumberError(false)
        }, 2000);

        setTimeout(() => {
            setCategoryMaxLimitError(false)
        }, 2000);

        setTimeout(() => {
            setCategoryUpdated(false)
        }, 2000);

        setTimeout(() => {
           setCategoryDeleted(false)
        }, 2000);

        setTimeout(() => {
          setDeleteCategoryError(false)
        }, 3000);

     setTimeout(() => {
          setNoCategoryFoundError(false)
        }, 3000);

    setTimeout(() => {
          setSomethingWentWrongError(false)
        }, 3000);
    }, [created, alreadyExitError, categoryLessThanMinError, categoryMoreThanMaxError, categoryEmptyError, 
        noUserFoundError, notAuthourizedError, categoryNumberError, 
        categoryMaxLimitError, categoryUpdated, categoryDeleted, deletCategoryError, noCategoryFoundError, somethingWentWrongError]);

       

   
console.log(categoryId)

  return (

         <>
   <article className='dashboard-container'>
       <div className=" admin-dashboard-custom-container flex-3">

            < AdminSidebar/>

                <div className='other-pages custom-other-page topMargin-Extral-Large '>
                                <h3 className='text-general-Medium margin-small'>Page Setting</h3>
                        <div className='category-custom-div-wrapper margin-small'>
                               
                            <div className='flex-3 category-div-wrapper'>
                                <div className='create-category-div flex-2 topMargin-medium'>
                                    <p className='text-general-small2 color1 topMargin-medium'>Create category</p>
                                    <input type="text" className='topMargin-medium input-general custom-category-input'
                                        ref={categoryRef}
                                        />
                                    {!editCategory && <button onClick={ createNewCategory} className='button-general'>Create</button>}
                                    {editCategory && <button onClick={handleEditCategory} className='button-general'>Update</button>}
                                    {editCategory && <button onClick={handlecancelEdit} className='button-general'>Cancel</button>}
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
                                                <p className='text-general-small2 category-custom-text'>{catName}</p>
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