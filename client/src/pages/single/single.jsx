import React, {useEffect, useState, useContext} from 'react';
import './single.css'
import Sidebar from '../../components/sidebar/sidebar'
import SinglePost from '../../components/singlePost/singlePost'
import {AuthContext} from '../../context/AuthProvide';

export default function Single() {
    const {postLength} = useContext(AuthContext);
    //global post length that allows sidebar to be shown only whenthe length of post component is greater than 0 and improve user experience


    return (
        <div className='single'>
            <SinglePost/> 
            
            {postLength > 0 && <Sidebar/>}
        </div>
    )
}
