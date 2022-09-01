const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_LIMIT = 12;

const DEFAULT_USER_PAGE_NUMBER = 1
const DEFAULT_USER_PAGE_LIMIT = 5;


const getPagination =(query) =>{
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;

    const skip = (page -1) * limit


    return {
        skip,
        limit
    };

};



const getUserPagination =(query) =>{
    const page = Math.abs(query.page) || DEFAULT_USER_PAGE_NUMBER;
    const limit = Math.abs(query.limit) || DEFAULT_USER_PAGE_LIMIT;

    const skip = (page -1) * limit


    return {
        skip,
        limit
    };

};








module.exports ={ 
    getPagination,
    getUserPagination
}