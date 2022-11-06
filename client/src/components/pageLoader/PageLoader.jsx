import React from 'react';
import Pageloader from '../../../src/assets/page-loader.gif'
import './pageloader.css'

function PageLoader() {

  return (
      <>
      <article className='custom-loader-wrapper flex flex-2'>
         <img className='page-loader' src={require('../../assets/page-loader.gif')} alt="loading..." />
         {/*<div className='flex'> <p className='paragraph-text text-general-Medium white-text'>Loading...</p></div>*/}
      </article>
         
            
       
         
     
  </>  
  )
}

export default PageLoader