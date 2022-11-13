import { createContext, useState, useEffect, useReducer, useRef} from "react";
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Reducer from "../context/Reducer";
import BASE_URL from '../hooks/Base_URL';



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
    //takes the image upload response and make it a global state
    const [imageDetails, setImageDetails] = useState();
    //this search query controls the search term input by the user. I ended up not using query useState
    const [query, setQuery] = useState();
    //controls the state of search via category. It has to be global becus we made use of it in another component
    const [categoryName, setCategoryName] = useState('')
    // controls the state of search which triggers the api for search
    const [searchState, setSearchState] = useState(false);
    //the states for menu and paths start here
    const [componentName, setComponentName] = useState([])
    const [pathName, setPathName] = useState([])
    const [blogPageName, setBlogPageName] = useState();
    
    const [writePageName, setWritePageName] = useState();
    const [pathNameMount, setPathNameMount] = useState(false)
    const [pathLocation, setPathLocation] = useState();
    const [blogPageAliasName, setBlogPageAliasName] = useState();
    const [writePageAliasName, setWritePageAliasName] = useState();
    const [contactPageAliasName,setContactPageAliasName] = useState()
    const [contactPageName,  setContPageName] = useState();

    const [aboutPageName,setAboutPageName] = useState()
    const [aboutPageAliasName, setAboutPageAliasName] = useState()



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
    
    //for header value
    const [headerValues, setHeaderValues] = useState([]); 
    //for sliderState Id
    const [sliderStateLoad, setSliderStateLoad] = useState(false)

    //admin side bar animation control
     const [openAdminSideBar, setOpenAdminSideBar] = useState('admin-sidebar-slideOut');
     //this state is used to adjust the height of the admin sidebar
     const [updateImageState, setUpdateImageState] = useState(false);
    //global state to manage the header image
    const [headerImage, setHeaderImage] = useState();
    //global state to manage sliderState contents
    const [sliderState, setSliderState] = useState([]);
    const [sliderStateText, setSliderStateText] = useState();

    //What this state does is to store the length of single Post component. When the length is greater than 0, then we can show the sidebar. This helps to encourage user experience
    const [postLength,  setPostLength] = useState([])

    //path state for logics that relies on path linke name globally
    const [globalPathName, setGlobalPathName] = useState('')
    
    //this search query ref controls the search term input by the user.
    const searchRef = useRef();
    //controls the update state mode of single post where updating of individual posts take place
    const [updateMode, setUpdateMode] = useState(false)
    


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



//fetch slider state. Slider state is needed in two seperate pages. I made it a global state
    
useEffect(()=>{
const fetchSliderState = async () =>{
    try{
        const res = await axios.get(`${BASE_URL}/sliderstate/`,);
            return  setSliderState(res.data)            
    }catch(err){
                
    }            
}

fetchSliderState() 
}, [sliderStateLoad])



//this function helps to extract the text of the sliderstate coming from database. Because this value is needed for the header slider to determine the state, I decided to bring it here. 
//it maybe needed in the future else where. 
useEffect(()=>{
let mounted = true
if(mounted){
     if(sliderState.length > 0){
        //get the sliderState Id into an array
            const arraySliderState = sliderState.map((singleSlider)=> singleSlider.sliderState);
            //convert array into object
            const stringSliderState = arraySliderState.toString()
           setSliderStateText(stringSliderState)

    }
}
return function cleanup() {
            mounted = false
        }
}, [sliderState]);



//fetch posts that would be used for home page, footer section and some other components that rely on footer components too

 useEffect( () => {
        dispatch({ type: "ISLOADING_START" });
        const fetchPosts = async ()=>{

            try{
                const res = await axios.get(`${BASE_URL}/posts/`)
                setPosts(res.data)
                dispatch({ type: "ISLOADING_END" });
            }catch(err){
                
            }            
                }
        fetchPosts()
         
    }, [])

console.log(globalPathName, 'global pathname', blogPageName)

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
            openAdminSideBar, setOpenAdminSideBar,
            updateImageState, setUpdateImageState,
            headerValues, setHeaderValues,
            sliderStateLoad, setSliderStateLoad,
            headerImage, setHeaderImage,
           sliderState, setSliderState,
           sliderStateText, setSliderStateText,
           contactPageAliasName,setContactPageAliasName,
           aboutPageName,setAboutPageName,
           aboutPageAliasName, setAboutPageAliasName,
           postLength,  setPostLength,
           globalPathName, setGlobalPathName,
           categoryName, setCategoryName,
           searchRef,
           updateMode, setUpdateMode,

           

        }}>
            {children}
        </AuthContext.Provider>
    )


};


