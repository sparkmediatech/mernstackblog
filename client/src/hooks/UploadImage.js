import React, {useContext, useState} from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import {AuthContext} from '../context/AuthProvide';

//the image uploader react function

function UploadImage() {
    const axiosPrivate = useAxiosPrivate();
    const {auth, logUser, dispatch, setImageDetails} = useContext(AuthContext);
   


    const imageUploader = async (file) =>{
         const data = new FormData();
        const filename = Date.now() + file.name;
        data.append("name", filename);
        data.append("file", file);

        try{
            const response = await axiosPrivate.post('/v1/posts/uploadImage',  data,{ withCredentials: true,
            headers:{authorization: `Bearer ${auth.token}`}
           
        },)
       
          setImageDetails(response.data)
         
           return new Promise(
            (resolve, reject) => {
              resolve({ data: { link: response.data.url } });
              }
              );
    }catch(err){

    }     
    }
  return imageUploader
}

export default UploadImage