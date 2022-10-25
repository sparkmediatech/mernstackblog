import axios from "axios";

const BASE_URL = "/api";
// /const BASE_URL = "http://localhost:5000/api/v1";



 const axiosPrivate = axios.create({
    
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});

export default  axiosPrivate