import { createContext, useState, useEffect, useReducer } from "react";
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Reducer from "../context/Reducer";
import BASE_URL from '../hooks/Base_URL'


const INITIAL_STATE = {
    temp: JSON.parse(localStorage.getItem("obj")) || null,
    isLoading: false,
    cursorState: false,
   dashboardEditMode: false,
   searchStatus: false,
   
}

export const AuthContext = createContext({});



export const AuthProvider = ({children})=>{
    const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);
   
   
    const [auth, setAuth] = useState({});
    const [logUser, setLogUsers] = useState({})
    const [regUser, setRegUser] = useState({});
    const [websiteName, setWebsiteName] = useState();
    const [authorDetails, setAuthorDetails] = useState({});
    const [aboutWebsite, setAboutWebsite] = useState();
    const [posts, setPosts] = useState([]);
    const [imageDetails, setImageDetails] = useState();
    const [query, setQuery] = useState('');
    const [searchState, setSearchState] = useState(false);
    //the states for menu and paths start here
    const [componentName, setComponentName] = useState([])
    const [pathName, setPathName] = useState([])
    const [blogPageName, setBlogPageName] = useState();
    const [contactPageName,  setContPageName] = useState();
    const [writePageName, setWritePageName] = useState();
    const [pathNameMount, setPathNameMount] = useState(false)
    const [pathLocation, setPathLocation] = useState();
    const [blogPageAliasName, setBlogPageAliasName] = useState();
    const [writePageAliasName, setWritePageAliasName] = useState();
    const [generalFetchError, setgeneralFetchError] = useState(false);
    const [tokenError,  setTokenError] = useState(false)
    const [ allSubscribersState, setAllsubscribersState] = useState(false);
    const [allSubscribers, setAllSubscribers] = useState([]);
    //this is for email list pagination
    const [pageNumber, setPageNumber] = useState(()=> sessionStorage.getItem('subscribersPageNum') || Number(1));
    const [fetchPreviousEmail, setFetchPreviousEmail] = useState(false);
    const [fetchAllScheduledEmail, setFetchAllScheduledEmail] = useState(false);
    const [emailUpdateMode, setEmailUpdateMode] = useState(false);
    const [editModeState, setEditModeState] = useState(false);
    


    


    console.log(searchState)
    const refreshToken = async () =>{
        
        try{
                const response = await axios.post(`/refresh`, {
                 withCredentials: true
             });
             setAuth(response.data);
    
            
        }
            catch(err){
                if(err.response.data === "Token is not valid"){
                    setTokenError(true)
                }
                console.log(err);
            }
    };

 
    useEffect( async () =>{
        if(!auth?.token){
            console.log('I am running refresh token')
             refreshToken()
        }
    }, []);
console.log(auth);

const decodeJWT = ()=>{
    const decoded = jwt_decode(auth?.token);
    const newUser ={
        username: decoded.username,
        userId: decoded.userId,
        profilepicture: decoded.profilepicture,
        role: decoded.role,
        photoPublicId: decoded.photoPublicId,
        aboutUser: decoded.aboutUser,
        joined: decoded.joined
        }
    setLogUsers(newUser)
     console.log(decoded)
};
    
useEffect( async () =>{
        if(auth?.token){
             decodeJWT() 
        };
        
    }, [auth]);
    console.log(logUser)

useEffect(() => {
         if(state.temp){
             console.log('we ran')
            const decoded = jwt_decode(state.temp.emailToken);
            const newUser ={
            username: decoded.username,
            userId: decoded.userId,
        }
            setRegUser(newUser)
         };

    }, [])

 ///temp store user details on reg in localstorage
    useEffect(() => {
        localStorage.setItem("obj", JSON.stringify(state.temp, ));         
    }, [state.temp]);
   

useEffect(() =>{
    const getAllComponents = async () =>{
      try{
          const response = await axios.get(`${BASE_URL}/component`)
            setComponentName(response.data)
      }catch(err){
        if(err.response.data === 'No client component found'){
            return setgeneralFetchError(true)
        }
      }
    }
    
    getAllComponents()
}, [])




useEffect(()=>{

const fetchPathName = async ()=>{
     try{
        dispatch({type:"CURSOR_NOT_ALLOWED_START"});
        const response = await axios.get(`${BASE_URL}/pathname`);
        setPathName(response.data);
         dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
        console.log(response.data, 'my name path')
        }catch(err){
        dispatch({type:"CURSOR_NOT_ALLOWED_START_END"});
       if(err?.response?.data === 'No pathname found'){
        return setgeneralFetchError(true)
       }
    if(err?.response?.data == 'something went wrong'){
        return setgeneralFetchError(true)
    }     
    }
}
fetchPathName()
}, [pathNameMount, pathLocation])

console.log(tokenError, 'token error')
 console.log(state.temp) 
console.log(logUser)
console.log(auth)
console.log(regUser)
console.log(aboutWebsite)


    return(
        <AuthContext.Provider value={{auth, setAuth,logUser, setLogUsers, regUser, setRegUser, temp: state.temp, 
            isLoading: state.isLoading, dispatch,  cursorState: state. cursorState,
            dashboardEditMode: state.dashboardEditMode,
            searchStatus: state. searchStatus,
            websiteName, setWebsiteName,
            authorDetails, setAuthorDetails,
            aboutWebsite, setAboutWebsite,
            posts, setPosts,
            imageDetails, setImageDetails,
            query, setQuery,
            searchState, setSearchState, 
            componentName, setComponentName,
            pathName, setPathName,
            blogPageName, setBlogPageName,
            contactPageName,  setContPageName,
            writePageName, setWritePageName,
            pathNameMount, setPathNameMount,
            pathLocation, setPathLocation,
            blogPageAliasName, setBlogPageAliasName,
            writePageAliasName, setWritePageAliasName,
            generalFetchError, setgeneralFetchError,
            tokenError,  setTokenError,
            allSubscribersState, setAllsubscribersState,
            allSubscribers, setAllSubscribers,
            pageNumber, setPageNumber,
            fetchPreviousEmail, setFetchPreviousEmail,
            setFetchAllScheduledEmail, fetchAllScheduledEmail,
            emailUpdateMode, setEmailUpdateMode,
            editModeState, setEditModeState,

           

        }}>
            {children}
        </AuthContext.Provider>
    )


};

