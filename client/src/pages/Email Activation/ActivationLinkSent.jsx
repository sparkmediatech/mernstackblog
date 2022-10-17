import './emailgeneral.css';
import React, { useContext } from 'react';
import {MdOutlineMail} from 'react-icons/md';
import {Context} from '../../context/Context';
import {FaCheckSquare} from 'react-icons/fa';
import {AuthContext} from '../../context/AuthProvide';








function ActivationLinkSent() {
    const {temp, regUser} = useContext(AuthContext)








  return (
    <>
    <article className='mainWrapper'>
    <div className='mainContainer flex custom-mainContainer-email-verify-div' >
        <div className='email-div custom-email-veri-div'>
             <div className='md-div'><MdOutlineMail className='emailIcon2'/></div>
            <h2 className='text-general-small2 color1 margin-small custom-veri-email-title-text'>
                Email activation link sent
        </h2>
        <p className='paragraph-text custom-email-veri-text'>
            Hey {regUser.username}, you're almost ready to start enjoying
                your blog account. An activation email was sent to your email address.
                Kindly check your email inbox or spam box, click
                the activation link to activate your account.
        </p>
        <FaCheckSquare className='Icon custom-email-icon'/>
        <h3 className='verifyText2'>
            Nodejs and Reactjs Blog application team
        </h3>
        </div>
       
    </div>
    </article>
    </>
  )
}

export default ActivationLinkSent