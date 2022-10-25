import React from 'react';
import './cursornotallowed.css';

function CursorNotallowed() {
  return (
    <div className='cursornotallowed-container flex'>
       <img className='page-loader' src={require('../../assets/cursor-loading.gif')} alt="loading..." />
    </div>
  )
}

export default CursorNotallowed