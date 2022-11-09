import React, {useEffect, useContext, useState, useRef} from 'react';
import {AuthContext} from '../../context/AuthProvide';
import  BASE_URL from '../../hooks/Base_URL';
import axiosPrivate from '../../hooks/AxiosPrivate';
import {AiOutlineMail, AiOutlineFileText, AiFillDelete, AiOutlineEdit} from 'react-icons/ai';
import {MdNavigateNext, MdNavigateBefore} from 'react-icons/md';
import {BsCheckLg} from 'react-icons/bs';
import WriteEmail from './WriteEmail';
import {MdOutlineCancel} from 'react-icons/md'


function ScheduledEmail() {
    const {auth, dispatch, fetchAllScheduledEmail, setFetchAllScheduledEmail, setEmailUpdateMode, editModeState, setEditModeState, setgeneralFetchError } = useContext(AuthContext);
    const[allScheduledEmail, setAllPreviousEmail] = useState([]);
    const [selectedEmailEditId, setSelectedEmailEditId] = useState(false);
    //const [editModeState, setEditModeState] = useState(false);
    const [emailTitle, setEmailTitle] = useState('');
    const [deliveryDate, setDeliveryDate] = useState();
    const [emailBody, setEmailBody] = useState('');
    const [emailReciever, setEmailReciever] = useState('');
    const [deliveryModeText, setDeliveryModeText] = useState('instant');
    const [deliveryModeState, setDeliveryModeState] = useState(false);
    const deliveryModeArray = ['instant', 'later'];
    const [dataDate, setDataDate] = useState();
    const [emailLoading, setEmailLoading] = useState(false);
    const [selectedSubscriberId, setSelectedSubscriberId] = useState()
    const [callSubscribersState, setCallSubscribersState] = useState(false);
    const [pageNumber, setPageNumber] = useState(1)
    const [isLoading, setIsLoading] = useState(false);
    const [deletedTextState, setDeletedTestState] = useState(false);

    //error states
    const [noUserFoundError, setNoUserFoundError] = useState(false);
    const [notAuthorizedError, setNotAuthorizedError] = useState(false);
    const [noEmailFoundError, setNoEmailFoundError] = useState(false);
    const [somethingWentWrongError, setSomethingWentWrongError] = useState(false)
    

    
   
//get pending emails
useEffect(()=>{
    const getScheduledEmail = async()=>{
         try{
             dispatch({type:"CURSOR_NOT_ALLOWED_START"});
                const response = await axiosPrivate.get(`${BASE_URL}/emailsub/pendingEmails?page=${pageNumber}`, { withCredentials: true,
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
    getScheduledEmail()
}, [fetchAllScheduledEmail])

const toggleEditMode = (emailTitle, emailBody, emailId, deliveryDate,emailReciever, deliveryMode) =>{
    setSelectedEmailEditId(emailId);
    setEmailBody(emailBody);
    setEmailTitle(emailTitle);
    setEmailReciever(emailReciever);
    setDeliveryDate(deliveryDate.split('T')[0])
    setEditModeState(true)
    setDeliveryModeText(deliveryMode);
    setEmailUpdateMode(true)
}


//handle delete of scheduled email
const handleDeleteScheduledEmail = async(id)=>{
    try{
         dispatch({type:"CURSOR_NOT_ALLOWED_START"});
            setIsLoading(true)
                const response = await axiosPrivate.delete(`${BASE_URL}/emailsub/deleteScheduleEmail/${id}`, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
            })
            dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            setFetchAllScheduledEmail(!fetchAllScheduledEmail);
            setDeletedTestState(true)
    }catch(err){
        dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
        setIsLoading(false);

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
        return setSomethingWentWrongError(true)
    }
    }
}


//handle prev
const handlePrev =()=>{
    if(pageNumber > 1){
        setFetchAllScheduledEmail(!fetchAllScheduledEmail);
        setPageNumber(Number(pageNumber) - 1)
    }
}

//hanlde next
const handleNext = ()=>{
    if(allScheduledEmail.length == 9){
        setFetchAllScheduledEmail(!fetchAllScheduledEmail);
        setPageNumber(Number(pageNumber) + 1)   
    }
}

console.log(deliveryModeText)

useEffect(()=>{
    setTimeout(() => {
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

}, [deletedTextState, noUserFoundError, notAuthorizedError, noEmailFoundError, somethingWentWrongError])



  return (
    <div className='flex-2'>
        {allScheduledEmail.length < 1 &&  <div className='flex'><h4 className='color1 text-general-small'>Email space is empty</h4></div>}

        {isLoading && 
            <div className='custom-scheduled-email-loading-div'>

            </div>
        }
        
        {
            editModeState &&
           <div className='flex-3'>
            <MdOutlineCancel onClick={()=> setEditModeState(false)} className='general-cursor-pointer red-text'/>
            <WriteEmail emailBody={emailBody} emailTitle={emailTitle} emailReciever={emailReciever} deliveryMode={deliveryModeText} deliveryDate={deliveryDate} emailId={selectedEmailEditId}/>
            
           </div>
        }


        
      
     
        {allScheduledEmail.map((singleEmail, key)=>{
            const {createdAt, _id: emailId, deliveryDate, emailReciever, emailTitle, emailBody, deliveryMode} = singleEmail

            return(
               <>
               
                {
                  !editModeState &&  
                        <div className='flex-3 custom-scheduled-email-title-div margin-small-small center-flex-align-display'>
                            
                            <div className='flex-2 margin-left-sm1'>
                                <h5 className='text-general-small color2 custom-scheduled-email-title'>{emailTitle}</h5>
                                <p className='color1 text-general-extral-small margin-extra-small-Top custom-scheduled-email-date'>Delivery Date: {deliveryDate ? new Date( deliveryDate).toDateString() : new Date(createdAt).toDateString()}</p>
                            </div>
                
                            <div className='flex-3 custom-scheduled-email-icon-div'>
                                <AiOutlineEdit onClick={()=> toggleEditMode(emailTitle, emailBody, emailId, deliveryDate, emailReciever, deliveryMode)} className='marginRight-sm general-cursor-pointer custom-scheduled-email-icon'/>

                                <AiFillDelete onClick={()=> handleDeleteScheduledEmail(emailId)} className='marginRight-extraSmall general-cursor-pointer red-text custom-scheduled-email-icon'/>

                        
                            </div>
                        </div>
                    }
               </>
            )

            
        })}

       {
        !editModeState &&
        <div>
             {noUserFoundError  &&  <p className='color2 text-general-extral-small center-text margin-small'>No user found</p>}

            {notAuthorizedError  &&  <p className='color2 text-general-extral-small center-text margin-small'>Not authorized to perform this action</p>}

            {noEmailFoundError &&  <p className='color2 text-general-extral-small center-text margin-small'>No email found with that id</p>}

            {somethingWentWrongError &&  <p className='color2 text-general-extral-small center-text margin-small'>Something went wrong, refresh the page</p>}
        </div>
       } 
     {
        allScheduledEmail.length > 0 && !editModeState && 
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

export default ScheduledEmail