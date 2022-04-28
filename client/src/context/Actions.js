
export const RegSucess = (temp) => ({
    type: "REG_SUCCESS", 
    payload: temp  
});

export const isLoadingStart = () => ({
    type: "ISLOADING_START", 
    
});
export const IsLoadingEnd = () => ({
    type: "ISLOADING_END", 
    
});

export const CursorNotallowed = () => ({
    type: "CURSOR_NOT_ALLOWED_START", 
    
});
export const CursorNotallowedEnd = () => ({
    type: "CURSOR_NOT_ALLOWED_START_END", 
    
});
export const WebsiteSettingState = () => ({
    type: "WEBSITE_SETTINGS_STATE", 
    
});

export const WebsiteSettingStateEnd = () => ({
    type: "WEBSITE_SETTINGS_STATE_END", 
    
});

