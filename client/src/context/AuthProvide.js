import { createContext, useState, useEffect, useReducer } from "react";
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Reducer from "../context/Reducer";
import BASE_URL from '../hooks/Base_URL'


const INITIAL_STATE = {
    temp: JSON.parse(localStorage.getItem("obj")) || null,
    isLoading: false,
    cursorState: false,
   dashboardEditMode: false
   
}

export const AuthContext = createContext({});



export const AuthProvider = ({children})=>{
    const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);
   
   
    const [auth, setAuth] = useState({});
    const [logUser, setLogUsers] = useState({})

    const [regUser, setRegUser] = useState({});


    
    const refreshToken = async () =>{
        
        try{
                const response = await axios.post(`${BASE_URL}/refresh`, {
                 withCredentials: true
             });
             setAuth(response.data);
    
            
        }
            catch(err){
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
        role: decoded.role
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
    
 console.log(state.temp) 
console.log(logUser)
console.log(auth)
console.log(regUser)

    return(
        <AuthContext.Provider value={{auth, setAuth,logUser, setLogUsers, regUser, setRegUser, temp: state.temp, isLoading: state.isLoading, dispatch,  cursorState: state. cursorState,
            dashboardEditMode: state.dashboardEditMode
        }}>
            {children}
        </AuthContext.Provider>
    )


};


