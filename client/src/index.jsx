import React from 'react';
import ReactDOM from 'react-dom';
import { LogContextProvider} from './context/LogContext';
import {AuthProvider} from './context/AuthProvide';


import App from './App';


ReactDOM.render(
  <React.StrictMode>
      < LogContextProvider>
      <AuthProvider>

       
        <App />
      
       </AuthProvider>
        </LogContextProvider>
  
    
  </React.StrictMode>,
  document.getElementById('root')
);

