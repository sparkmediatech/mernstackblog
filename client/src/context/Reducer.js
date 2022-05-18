const Reducer = (state, action) =>{
    switch(action.type){
            
            case "ISLOADING_START":
                return{
                    ...state,
                    isLoading: true
                };

            case "REG_SUCCESS":
                return{
                    temp: action.payload,
                    isLoading: false
                };
            case "ISLOADING_END":
                return{
                    ...state,
                    isLoading: false
                }
             case "CURSOR_NOT_ALLOWED_START":
                return{
                    ...state,
                    cursorState: true
                }

             case "CURSOR_NOT_ALLOWED_START_END":
                return{
                    ...state,
                    cursorState: false
                }
             case "WEBSITE_SETTINGS_STATE":
                return{
                    ...state,
                   dashboardEditMode: true
                }

             case "WEBSITE_SETTINGS_STATE_END":
                return{
                    ...state,
                   dashboardEditMode: false
                }
             case "SEARCH_STATUS_START":
                return{
                    ...state,
                   searchStatus: true
                }

            default:
                return state;
    }
};

export default Reducer;
