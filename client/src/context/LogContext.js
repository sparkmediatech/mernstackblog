import React, {useContext, useReducer, useEffect, useState} from "react";
import LogReducer from "./LogReducer";

const INITIAL_STATE = {
    session: JSON.parse(localStorage.getItem("buf")) || null,
};



export const LogContext = React.createContext();

export const LogContextProvider = ({children}) =>{
    const [state, logdispatch] = useReducer(LogReducer, INITIAL_STATE);
   

    //useEffect to enable the user details to be stored in their local storage
    useEffect(() => {
        
       localStorage.setItem("buf", JSON.stringify(state.session, ));
       
    },[state.session])


    return(
        <LogContext.Provider value={{
            session: state.session,
            logdispatch,
        }}>
            {children}
        </LogContext.Provider>
    )
}