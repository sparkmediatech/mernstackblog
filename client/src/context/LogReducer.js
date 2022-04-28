const TokenReducer = (state, action) =>{
     switch(action.type){
             case "LOG_SESSION":
                return{
                    session: action.payload
                };

        default:
            return state;
     }
};




export default TokenReducer;