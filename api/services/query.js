const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_LIMIT = 12;
//user pagination
const DEFAULT_USER_PAGE_NUMBER = 1
const DEFAULT_USER_PAGE_LIMIT = 5;

//subscribers
const DEFAULT_SUBSCRIBERS_PAGE_NUMBER = 1
const DEFAULT_SUBSCRIBERS_PAGE_LIMIT = 9;


const getPagination =(query) =>{
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;

    const skip = (page -1) * limit


    return {
        skip,
        limit
    };

};


//user pagination
const getUserPagination =(query) =>{
    const page = Math.abs(query.page) || DEFAULT_USER_PAGE_NUMBER;
    const limit = Math.abs(query.limit) || DEFAULT_USER_PAGE_LIMIT;

    const skip = (page -1) * limit


    return {
        skip,
        limit
    };

};


//email subscribers pagination
const getSubscribersPagination =(query) =>{
    const page = Math.abs(query.page) || DEFAULT_SUBSCRIBERS_PAGE_NUMBER;
    const limit = Math.abs(query.limit) || DEFAULT_SUBSCRIBERS_PAGE_LIMIT;

    const skip = (page -1) * limit


    return {
        skip,
        limit
    };

};






module.exports ={ 
    getPagination,
    getUserPagination,
    getSubscribersPagination
}