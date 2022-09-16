import React, {useEffect, useContext, useState, useRef} from 'react';
import {AuthContext} from '../../context/AuthProvide';
import  BASE_URL from '../../hooks/Base_URL';
import axiosPrivate from '../../hooks/AxiosPrivate';
import {AiOutlineMail, AiOutlineFileText, AiFillDelete} from 'react-icons/ai';
import {MdNavigateNext, MdNavigateBefore} from 'react-icons/md';
import {BsCheckLg} from 'react-icons/bs'

function PreviousEmail() {
const {auth, dispatch, fetchPreviousEmail, setFetchPreviousEmail, setgeneralFetchError} = useContext(AuthContext);
const [allPreviousEmail, setAllPreviousEmail] = useState([]);
const [pageNumber, setPageNumber] = useState(1);
const [emailDeletedState, setEmailDeletedState] = useState(false);
const [isLoading, setIsLoading] = useState(false);

//error states
const [noUserFoundError, setNoUserFoundError] = useState(false);
const [notAuthhorizedError, setNotAuthorizedError] = useState(false);
const [noEmailFoundError, setNoEmailFoundError] = useState(false);
const [somethingWentWrong, setSomethingWentWrongError] = useState(false);



//get delivered email
useEffect(()=>{
    const fetchPreviousEmails = async()=>{
        try{
             dispatch({type:"CURSOR_NOT_ALLOWED_START"});
                const response = await axiosPrivate.get(`${BASE_URL}/emailsub/deliveredEmail?page=${pageNumber}`, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
            })
             dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
             setAllPreviousEmail(response.data)
            console.log(response.data)
        }catch(err){
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            if(err.response.data === 'no user found'){
                return setNoUserFoundError(true)
            }

            if(err.response.data === 'you are not permitted'){
                return setNotAuthorizedError(true)
            }

            if(err.response.data === 'no email found'){
                return setNoEmailFoundError(true)
            }

            if(err.response.data === 'something went wrong'){
                return setgeneralFetchError(true)
            }
        }
        
    }
    fetchPreviousEmails()
}, [fetchPreviousEmail, ])


//delete prev email single delete
const handleDeletePrevEmail = async (emailId)=>{
    try{
        dispatch({type:"CURSOR_NOT_ALLOWED_START"});
                setIsLoading(true)
                const response = await axiosPrivate.delete(`${BASE_URL}/emailsub/deleteDelivered/${emailId}`, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
            })
             dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
             setFetchPreviousEmail(!fetchPreviousEmail)
             setEmailDeletedState(true);
            
    }catch(err){
         dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
         setIsLoading(false);
         if(err.response.data === 'no user found'){
            return setNoUserFoundError(true)
         }

        if(err.response.data === 'you are not permitted'){
            return setNotAuthorizedError(true)
        }

        if(err.response.data === 'email not found'){
            return setNoEmailFoundError(true)
        }

        if(err.response.data === 'something went wrong'){
            return setSomethingWentWrongError(true)
        }
    }
}

//handle prev
const handlePrev =()=>{
    if(pageNumber > 1){
        setFetchPreviousEmail(!fetchPreviousEmail);
        setPageNumber(Number(pageNumber) - 1)
    }
}

//hanlde next
const handleNext = ()=>{
    if(allPreviousEmail.length == 9){
        setFetchPreviousEmail(!fetchPreviousEmail);
        setPageNumber(Number(pageNumber) + 1)   
    }
}


//notifications
useEffect(()=>{
    setTimeout(() => {
       setEmailDeletedState(false);
        setIsLoading(false)
    }, 3000);

    setTimeout(() => {
      setNoUserFoundError(false)
    }, 3000);

    setTimeout(() => {
        setNotAuthorizedError(false)
    }, 3000);

    setTimeout(() => {
        setNoEmailFoundError(false)
    }, 3000);

    setTimeout(() => {
        setSomethingWentWrongError(false)
    }, 3000);

}, [emailDeletedState, noUserFoundError, notAuthhorizedError, noEmailFoundError, somethingWentWrong])


  return (
    <div className='flex-2'>
        {allPreviousEmail.length < 1 && !isLoading &&
        <h5 className='color1 text-general-small center-text'>No email at the moment</h5>
        }
       {
        isLoading &&  
        <div className='flex-2 center-flex-align-display custom-prev-email-notification-div'>
                {emailDeletedState &&
               <>
                    <BsCheckLg className='color4 iconSM'/>
                    <h3 className='color1 text-general-extral-small'>Deleted</h3>
               </>
                }
        </div>
       }
     
        {allPreviousEmail.map((singleEmail, key)=>{
            const {emailTitle, _id: emailId, deliveryDate, createdAt} = singleEmail
            
            return(
                <div className='flex-3 custom-prev-email-main-div margin-small-small center-flex-align-display margin-small' key={key}>
                   <div className='flex-2 custom-previous-email-title-div marginLeft-sm'>
                     <h5 className='text-general-small color2'>{emailTitle}</h5>
                        <p className='color1 text-general-extral-small margin-extra-small-Top'>Delivery Date: {deliveryDate ? new Date( deliveryDate).toDateString() : new Date(createdAt).toDateString()}</p>

                    </div>

                    <AiFillDelete onClick={()=> handleDeletePrevEmail(emailId)} className={!isLoading ? 'red-text marginRight-sm general-cursor-pointer': 'red-text marginRight-sm curson-not-allowed-2'}/>
                </div>
            )
        })}
        
        {/* erros start here  */}
            {noUserFoundError  &&  <p className='color2 text-general-extral-small center-text margin-small'>No user found</p>}

            {notAuthhorizedError  &&  <p className='color2 text-general-extral-small center-text margin-small'>Not authorized to perform this action</p>}

            {noEmailFoundError &&  <p className='color2 text-general-extral-small center-text margin-small'>No email found</p>}

            {somethingWentWrong &&  <p className='color2 text-general-extral-small center-text margin-small'>Something went wrong, refresh page</p>}

        {
        allPreviousEmail.length > 0 &&
        <div className='flex margin-small' >
        <div className='flex'>
            <MdNavigateBefore onClick={handlePrev} className='custom-navigation-sendEmail-icon marginRight-extraSmall general-cursor-pointer'/>
        </div>
            <p  className='color1 text-general-small general'>Page : {pageNumber}</p>
        <div className='flex'>
            <MdNavigateNext onClick={handleNext} className='custom-navigation-sendEmail-icon marginLeft-extraSmall general-cursor-pointer'/>
        </div>
    </div>
    }
    </div>
  )
}

export default PreviousEmail