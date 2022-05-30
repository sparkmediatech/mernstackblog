import React, {useContext, useState, useEffect} from 'react';
import Single from './pages/single/single'
import Home from './pages/home/home'
import TopBar from "./components/topbar/TopBar";
import HeaderNavbar from './components/headerNavbar/headerNavbar'
import Write from './pages/write/write'
import Settings from './pages/settings/settings'
import Login from './pages/login/login'
import Register from './pages/register/register';
import Dashboard from "./pages/Admindashboard/Dashboard";
import Admin from "./pages/login/admin"
import ManageUsers from "./pages/Admindashboard/Usersmanager";
import ConfirmEmail from './pages/ConfirmEmail/confirmemail';
import ActivationLinkSent from './pages/Email Activation/ActivationLinkSent';
import {AuthContext} from '../src/context/AuthProvide';
import PasswordResetEmail from '../src/pages/passwordReset/PasswordResetEmail';
import ChangePassword from './pages/passwordReset/ChanagePassword';
import ResendVerifyLink from './pages/Email Activation/ResendVerifyLink';
import {LogContext} from '../src/context/LogContext';
import  PageLoader from "../src/components/pageLoader/PageLoader";
import Usersmanager from './pages/Admindashboard/Usersmanager';
import CursorNotallowed from './pages/cursonnotallowed/CursorNotallowed';
import WebsiteSettings from './pages/Admindashboard/WebsiteSettings';
import SingleUser from './pages/singleUser/SingleUser';
import PageSettings from './pages/Admindashboard/PageSettings';
import UsersPosts from './pages/UsersPosts/usersPosts';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Helmethome from './components/helmet/Helmethome';



function App() {

  const {logUser,temp, isLoading, cursorState} = useContext(AuthContext);
  const {session} = useContext(LogContext)

  const [reload, setReload] = useState(false)

  useEffect(()=>{
  setTimeout(() => {
    setReload(true)
  }, 500);
}, [])
  return (
    <Router>
      {cursorState  && <CursorNotallowed/>}
      { (!reload || isLoading) && <PageLoader />}
     
      {!isLoading && reload && <HeaderNavbar/>}
      <Helmethome/>
      <Switch>
        
        <Route exact path="/">
          <Home />
        </Route>

         
        <Route path="/register">
          <Register />
        </Route>

        <Route path="/login">
          {reload && <Login />}
        </Route>

        <Route path="/write">
          {session? <Write /> : <Register/>}
        </Route>

        <Route path="/settings">
          {session ? <Settings />: <Register/>}
        </Route>

         
      <Route path="/admin">
           <Admin/> 
        </Route>
       <Route path="/usersdashboard">
          {session && logUser?.role == "admin"  ?  <Usersmanager/> : <Register/> }
        </Route>
         <Route path="/websitesettings">
          {session && logUser?.role == "admin"  ?  <WebsiteSettings/> : <Register/> }
        </Route>
        <Route path="/pagesettings">
          {session && logUser?.role == "admin"  ?  <PageSettings/> : <Register/> }
        </Route>
         
        <Route path="/users/:userId">
          {session ?  <SingleUser/>: <Login/>}
        </Route>
        <Route path="/post/:postId">
          <Single />
        </Route>
         <Route path="/usersposts">
          <UsersPosts/>
        </Route>
      <Route path="/confirm/:tokenId">
          {temp?.emailToken ? <ConfirmEmail/>: <Login /> }
        </Route>

        <Route path="/linksent">
          {temp?.emailToken ? <ActivationLinkSent/>:  <Login /> }
        </Route>

        <Route path="/passrest">
          <PasswordResetEmail/>
        </Route>
                          
        <Route path="/updatepassword/:passwordId">
          {temp?.emailToken ?<ChangePassword /> :  <Login />}
        </Route>
      
       <Route path="/resendemaillink">
          {temp?.emailToken ?<ResendVerifyLink /> :  <Register />}
        </Route>

        
      </Switch>
    
    
    </Router>
  );
}

export default App;
