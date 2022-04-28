/*import React, {useContext, useReducer, useEffect} from "react";
import Reducer from "./Reducer";


const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    regUser: JSON.parse(localStorage.getItem("regUser")) || null,
    isFetching: false,
    error: false,
}

export const Context = React.createContext();


export const ContextProvider = ({children}) =>{
    const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);
 

    //useEffect to enable the user details to be stored in their local storage
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user, ));        
    }, [state.user], [state.token])


    return(
        <Context.Provider value={{
            user:state.user,
            isFetching: state.isFetching,
            error: state.error,
            dispatch,
        }}>
            {children}
        </Context.Provider>
    )
}
*/