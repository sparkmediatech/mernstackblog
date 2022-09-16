import React, {useEffect, useContext, useState, useRef} from 'react';
import axiosPrivate from '../../hooks/AxiosPrivate';
import AdminSidebar from './AdminSidebar';
import {AuthContext} from '../../context/AuthProvide';
import './subscribers.css';
import  BASE_URL from '../../hooks/Base_URL';
import {HiUserGroup} from 'react-icons/hi';
import {AiOutlineMail, AiOutlineFileText, AiFillDelete} from 'react-icons/ai';
import {BiTime} from 'react-icons/bi';
import {MdOutlineCancel, MdNavigateNext, MdNavigateBefore} from 'react-icons/md';
import WriteEmail from '../../components/EmailSubscribers/WriteEmail';
import PreviousEmail from '../../components/EmailSubscribers/PreviousEmail';
import ScheduledEmail from '../../components/EmailSubscribers/ScheduledEmail';
import {BsCheckLg} from 'react-icons/bs'

function Subscribers() {
    const {auth, dispatch,  allSubscribersState, setAllsubscribersState, allSubscribers, setAllSubscribers, pageNumber, setPageNumber, fetchPreviousEmail, setFetchPreviousEmail,
    setFetchAllScheduledEmail, fetchAllScheduledEmail, editModeState, setEditModeState, emailUpdateMode, setEmailUpdateMode, setgeneralFetchError} = useContext(AuthContext);
    const [displaySubscribersMode, setDisplaySubscribersMode] = useState(false)
    const [cursorNotAllowedState, setCursorNotAllowedState] = useState(false);
    
    const [ selectedReminder, setSelectedReminder] = useState('');
    const [createEmailState, setCreateEmailState] = useState(false);
    const [activeDisplayMode, setActiveDisplayMode] = useState(false);
    const [previousEmailState, setPreviousEmailState] = useState(false);
    const [scheduledEmailState, setScheduledEmailState] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [subDeletedState, setSubDeletedState] = useState(false)

    //error states
    const [noUserFoundError, setNoUserFoundError] = useState(false);
    const [notAuthorizedError, setNotAuthorizedError] = useState(false);
    const [noSubscriberFoundError, setNoSubscriberFoundError] = useState(false);
    const [somethingWentWrongError, setSomethingWentWrongError] = useState(false);
    const [userIdEmptyError, setUserIdEmptyError] = useState(false)
    
   
    // set session storage page number for subscribers page
    useEffect(() => {
        sessionStorage.setItem("subscribersPageNum", JSON.stringify(Number(pageNumber), ));         
    }, [pageNumber]);



    //fetch all subscribers
    useEffect(()=>{
        const fetchAllSubscribers = async ()=>{
            try{
                dispatch({type:"CURSOR_NOT_ALLOWED_START"});
                const response = await axiosPrivate.get(`${BASE_URL}/emailsub/subscribers?page=${pageNumber}`, { withCredentials: true,
            headers:{authorization: `Bearer ${auth}`}
            })
             dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
            
             setAllSubscribers(response.data)
            }catch(err){
                 dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
                if(err.response.data === 'no user found'){
                    return setNoUserFoundError(true)
                }

            if(err.response.data === 'you are not permitted'){
                return setNotAuthorizedError(true)
            }

            if(err.response.data === 'subscribers not found'){
                return setNoSubscriberFoundError(true)
            }

            if(err.response.data === 'something went wrong'){
                return setgeneralFetchError(true)
            }
            }
        }
        fetchAllSubscribers()
    }, [allSubscribersState])

//handles the fetching suscribers state
const handleAllSubscribers = ()=>{
    setAllsubscribersState(!allSubscribersState);
    setActiveDisplayMode(true)
    setDisplaySubscribersMode(true);
    setCursorNotAllowedState(true)
}

//this function turns on the previous email state
const togglePreviousEmailState = () =>{
    setActiveDisplayMode(true);
    setCursorNotAllowedState(true);
    setPreviousEmailState(true);
    setFetchPreviousEmail(!fetchPreviousEmail)

}
//handles the state of schaduled email state

const toggleScheduledEmailState = ()=>{
    setActiveDisplayMode(true);
     setCursorNotAllowedState(true);
     setScheduledEmailState(true);
     setFetchAllScheduledEmail(!fetchAllScheduledEmail);
     setAllsubscribersState(!allSubscribersState);
}
//handles the creation of email state
const toggleCreateEmailState = () =>{
    setActiveDisplayMode(true)
    setCursorNotAllowedState(true)
    setCreateEmailState(true);
    if(emailUpdateMode == true){
        setEmailUpdateMode(false)
    }
}

//This function turns off the active diplaymoode and turns off any display element that is active as well
const handleCancelSubscribers = ()=>{
     setActiveDisplayMode(false);
     setAllsubscribersState(!allSubscribersState)
    setCursorNotAllowedState(false)
    if(createEmailState == true){
        setCreateEmailState(false)
    }
    if(displaySubscribersMode == true){
        setDisplaySubscribersMode(false);
    }

    if(previousEmailState == true){
        setPreviousEmailState(false)
    }
    if(scheduledEmailState == true){
        setScheduledEmailState(false)
    }
    if(emailUpdateMode == true){
        setEmailUpdateMode(false)
    }
   
}


//handle next page navigation

const handleNextPage = () =>{
    if(allSubscribers.length == Number(9)){
        setAllsubscribersState(!allSubscribersState);
        setPageNumber(pageNumber + 1)   
    }
    
}

//handle prev page 
const handlePrevPage = () =>{
    if(pageNumber > 1){
         setAllsubscribersState(!allSubscribersState);
        setPageNumber(pageNumber - 1)
    }
   
}

//This handles the state that toggles the mouse enter change of color for reminder text
const handleReminderState = (textId)=>{
    setSelectedReminder(textId)
}
const  handleReminderOppositeState = ()=>{
    setSelectedReminder('')
}

//delete subscriber
const handleDeleteSubscriber = async (subscriberId)=>{
    try{
        dispatch({type:"CURSOR_NOT_ALLOWED_START"});
            setIsLoading(true)
            const response = await axiosPrivate.delete(`${BASE_URL}/emailsub/deleteSub/${subscriberId}`, { withCredentials: true,
                headers:{authorization: `Bearer ${auth}`}
            })
             dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
             setAllsubscribersState(!allSubscribersState);
            setSubDeletedState(true)
    }catch(err){
        dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
         if(err.response.data === 'no user found'){
                return setNoUserFoundError(true)
             }
        if(err.response.data === 'you are not permitted '){
            return setNotAuthorizedError(true)
        }

        if(err.response.data === 'no subscriber found'){
            return setNoSubscriberFoundError(true)
        }

        if(err.response.data === 'something went wrong'){
            return setSomethingWentWrongError(true)
        }
    }
}


//handle resend verification email for unverified user
const handleVeryReminder = async(id)=>{
    const userId = {
        subscriberId: id
    }
    try{
         dispatch({type:"CURSOR_NOT_ALLOWED_START"});
            setIsLoading(true)
        const response = await axiosPrivate.post(`${BASE_URL}/emailsub/resendSubVerifcation/`, userId, { withCredentials: true,
                headers:{authorization: `Bearer ${auth}`}
            })
        dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
    }catch(err){
        dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
        if(err.response.data === 'no user found'){
            return setNoUserFoundError(true)
        }
        if(err.response.data === 'you are not permitted'){
            return setNotAuthorizedError(true)
        }
        if(err.response.data === 'userId must be provided'){
            return setUserIdEmptyError(true)
        }
        if(err.response.data === 'no subscriber found'){
            return setNoSubscriberFoundError(true)
        }
        if(err.response.data === 'something went wrong'){
            return setSomethingWentWrongError(true)
        }
    }
}

//displays notification
useEffect(()=>{
    setTimeout(() => {
        setSubDeletedState(false);
        setIsLoading(false)
    }, 3000);

    setTimeout(() => {
        setNoUserFoundError(false)
    }, 3000);

    setTimeout(() => {
        setNotAuthorizedError(false)
    }, 3000);

    setTimeout(() => {
      setNoSubscriberFoundError(false)
    }, 3000);

    setTimeout(() => {
      setSomethingWentWrongError(false)
    }, 3000);
    


}, [noUserFoundError, isLoading, notAuthorizedError, noSubscriberFoundError, somethingWentWrongError, userIdEmptyError])





  return (
    <article className='dashboard-container'>
        <div className='admin-dashboard-custom-container flex-3'>
            <AdminSidebar/>

            <div className={activeDisplayMode ? 'other-pages custom-other-page-subscribers topMargin-Extral-Large  ' : 'other-pages custom-other-page-subscribers topMargin-Extral-Large'}>

                {
                    /* when this state is true, turn on the cursor not allowed div to disable clicks for divs under  */
                    cursorNotAllowedState && 

                    <div className='custom-disabled-screen '>

                    </div>
                }
                
                 <h3 className='text-general-Medium margin-small margin-left-sm1'>Email Demon</h3>
                 <div className='flex-2 marginLeft-sm topMargin'>

                {/* this handles the display of the subscribers list menu when set to true */} 
                   {
                    activeDisplayMode &&
                   
                     <div className='flex-2 custom-display-allSubscribers-div'>

                    {/*the editModestate is coming from scheduled email state. This is to hide the cancel button coming from this component to avoid confusion for the user. The use already has a button'
                    to turn of the editModeState right inside the schedule email component */
                        !editModeState && <div className='flex-3 custom-subscribers-cancel-main-title-div'> <MdOutlineCancel onClick={handleCancelSubscribers} className='custom-subscribers-cancel-icon'/></div>
                    }
                       {createEmailState && <WriteEmail/>}

                        {previousEmailState && <PreviousEmail/>}

                        {scheduledEmailState && <ScheduledEmail/>}
                      
                       {/* dsplay for subscribers list */
                        displaySubscribersMode && 
                        <>
                            {!subDeletedState && <h4 className='center-text text-general-small color1'>Subscribers</h4>}
                            <div className='flex-2 custom-subscribers-heading-div margin-small'>
                           
                                <div className='flex-3 custom-sub-subscribers-heading-text-div margin-small'>
                                    <div><p className='color1 text-general-small'>Name</p></div>
                                    <div><p className='color1 text-general-small'>Email</p></div>
                                    <div><p className='color1 text-general-small marginRight-sm'>Verified</p></div>
                                </div>

                                <hr className='margin-extra-small-Top color1'/>
                            </div>


                        {isLoading &&

                            <div className='custom-subscribers-loading-div flex-2 center-flex-align-display'>
                                {subDeletedState &&
                                    <>
                                        <BsCheckLg className='color4 iconSM'/>
                                        <h3 className='color1 text-general-extral-small center-text'>Deleted</h3>
                                    </>
                                }
                            </div>
                            
                        }

                        {allSubscribers.map((singleSubscribers)=>{
                            const {_id: subscriberId, isVerified, subscriberEmail, subscriberName} = singleSubscribers
                            return(
                                <div className='flex-3 custom-subscribers-listing-div margin-small center-flex-align-display margin-small '>
                                    <div className='custom-subscriber-list-header-div'><h5 className='color1 text-general-extral-small'>{subscriberName}</h5> </div>
                                    <div className='custom-subscriber-list-header-div flex'><h5 className='color1 text-general-extral-small'>{subscriberEmail}</h5></div>
                                    <div className='custom-subscriber-list-header-div flex custom-verified-div'>{isVerified == false && <p onMouseEnter={()=> handleReminderState(subscriberId)} onMouseLeave={handleReminderOppositeState} className={selectedReminder == subscriberId ? 
                                    'color1 text-general-extral-small marginRight-sm custom-reminder-subscriber-text' : 
                                    'color1 text-general-extral-small marginRight-sm'} onClick={()=>handleVeryReminder(subscriberId)}>Reminder</p>}
                                    {isVerified === true ? <p className='color1 text-general-extral-small marginRight-sm'>YES</p>: <p className='color1 text-general-extral-small marginRight-sm'>No</p>}
                                        <AiFillDelete onClick={()=> handleDeleteSubscriber(subscriberId)} className='general-cursor-pointer red-text'/>
                                    </div>
                                </div>
                            )
                        })}

                        {/* error messages start here */}
                         {noUserFoundError  &&  <p className='color2 text-general-extral-small center-text margin-small'>User not found</p>}

                        {notAuthorizedError  &&  <p className='color2 text-general-extral-small center-text margin-small'>You are not authorized to perform this action</p>}

                        {noSubscriberFoundError  &&  <p className='color2 text-general-extral-small center-text margin-small'>No subscriber found</p>}

                        {somethingWentWrongError  &&  <p className='color2 text-general-extral-small center-text margin-small'>Something went wrong, refresh page</p>}

                         {userIdEmptyError  &&  <p className='color2 text-general-extral-small center-text margin-small'>User Id must be provided</p>}


                        {/* error messages ends here */}


                        {allSubscribers && 
                        
                             <div className='flex margin-small'>
                            <div className={pageNumber == 1 && 'curson-not-allowed-2'}>
                                <MdNavigateBefore onClick={ handlePrevPage} className={pageNumber == 1 ?'customNavigation-subscribers-icon curson-not-allowed-2' :'customNavigation-subscribers-icon general-cursor-pointer'}/>
                                
                            </div>
                                <div><p className='color1 text-general-small general'>Page: {pageNumber}</p></div>
                             <div className={allSubscribers.length < 9 && 'curson-not-allowed-2'}>
                                <MdNavigateNext onClick={handleNextPage} className={allSubscribers.length < 9 ? 'customNavigation-subscribers-icon curson-not-allowed-2' : 'customNavigation-subscribers-icon general-cursor-pointer'}/>  
                            </div>
                        </div>
                        }
                        </>
                       }
                    </div>
                   }
   {/* The subscirbers list menu ends here */} 

                     <div className={activeDisplayMode ? 'flex-3 custom-subscriber-sub-div bg-blur ': 'flex-3 custom-subscriber-sub-div'}>
                        <div className='flex margin-left-sm1 custom-subscriber-icon-div flex'>
                            <HiUserGroup  className='custom-subscribers-icon'/>
                        </div>
                        
                        <div className='flex-2 margin-left-sm1 margin-small-small custom-subscribers-sub-text-div '>
                            <h5 className='text-general-Medium '>Subscribers</h5>
                            <p className='color1 text-general-small margin-extra-small-Top'>Use this channel to see all subscribers on your list. You can also manage these subscribers. You can delete subscribers and also send them verification remainder email from here</p>

                        </div>
                    
                     <div className='custom-subscribers-BTN-div flex'>
                            <button onClick={handleAllSubscribers} className='custom-subscribers-BTN'>Get started</button>
                        </div>
                    </div>

                   

                      <div className={activeDisplayMode ? 'flex-3 custom-subscriber-sub-div  bg-blur' : 'flex-3 custom-subscriber-sub-div '}>
                        <div className='flex margin-left-sm1 custom-subscriber-icon-div flex'>
                            <AiOutlineMail  className='custom-subscribers-icon'/>
                        </div>
                        
                        <div className='flex-2 margin-left-sm1 margin-small-small custom-subscribers-sub-text-div '>
                            <h5 className='text-general-Medium '>Previous Emails</h5>
                            <p className='color1 text-general-small margin-extra-small-Top'>Use this channel to check your previous emails sent to your subscribers. This is the section where you manage your sent email records You can also delete previously sent emails here</p>

                        </div>

                        <div className={activeDisplayMode ? 'custom-subscribers-BTN-div flex bg-blur' : 'custom-subscribers-BTN-div flex'}>
                            <button onClick={togglePreviousEmailState} className='custom-subscribers-BTN'>Get started</button>
                        </div>
                    </div>

                    <div className={activeDisplayMode ? 'flex-3 custom-subscriber-sub-div bg-blur' : 'flex-3 custom-subscriber-sub-div'}>
                         <div className='flex margin-left-sm1 custom-subscriber-icon-div flex'>
                            <BiTime  className='custom-subscribers-icon'/>
                        </div>
                        
                        <div className='flex-2 margin-left-sm1 margin-small-small custom-subscribers-sub-text-div '>
                            <h5  className='text-general-Medium '>Scheduled Email</h5>
                            <p className='color1 text-general-small margin-extra-small-Top'>Use this channel to check your emails you scheduled for future delivery. You may decide to change the delivery date as well. You may also delete it or update the content of the email here</p>
                        </div>
                        
                         <div className='custom-subscribers-BTN-div flex'>
                            <button onClick={toggleScheduledEmailState} className='custom-subscribers-BTN'>Get started</button>
                        </div>
                    </div>

                    <div className={activeDisplayMode ? 'flex-3 custom-subscriber-sub-div bg-blur' : 'flex-3 custom-subscriber-sub-div'}>
                        <div className='flex margin-left-sm1 custom-subscriber-icon-div flex'>
                        
                            <AiOutlineFileText className='custom-subscribers-icon'/>
                        </div>

                        <div className='flex-2 margin-left-sm1 margin-small-small custom-subscribers-sub-text-div '>
                            <h5 className='text-general-Medium '>Create New Email</h5>

                            <p className='color1 text-general-small margin-extra-small-Top'>Use this channel to create a new email to send to your subscribers. You can decide if the email should be sent instantly or decide when it can be delivered on a later date</p>
                        </div>
                        
                     <div className='custom-subscribers-BTN-div flex'>
                            <button onClick={toggleCreateEmailState} className='custom-subscribers-BTN'>Get started</button>
                        </div>
                    </div>
                 </div>

                 <div>

                 </div>

            </div>
        </div>

    </article>
  )
}

export default Subscribers