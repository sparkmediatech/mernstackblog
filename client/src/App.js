import React, {useContext, useState, useEffect} from 'react';
import Single from './pages/single/single'
import Home from './pages/home/home'
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
import  PageLoader from "../src/components/pageLoader/PageLoader";
import Usersmanager from './pages/Admindashboard/Usersmanager';
import CursorNotallowed from './pages/cursonnotallowed/CursorNotallowed';
import WebsiteSettings from './pages/Admindashboard/WebsiteSettings';
import SingleUser from './pages/singleUser/SingleUser';
import PageSettings from './pages/Admindashboard/PageSettings';
import UsersPosts from './pages/UsersPosts/usersPosts';
import Texteditor from './pages/Texteditor/Texteditor';
import Blog from './pages/Blogpage/Blog';
import axios from 'axios';
import Menu from './pages/Admindashboard/Menu';
import FetchingError from './pages/GeneralErrorPages/FetchingError';
import UserProfilePublic from './pages/userprofilePublic/UserProfilePublic';
import Subscribers from './pages/Admindashboard/Subscribers';
import SubscriberConfirmation from './pages/ConfirmEmail/SubscriberConfirmation';
import AboutUs from './pages/AboutUs/AboutUs';
import Contactus from './pages/ContactUs/Contactus';




import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
//import Helmethome from './components/helmet/Helmethome';
import axiosPrivate from './hooks/AxiosPrivate';



function App() {
  
  const {logUser,temp, isLoading, auth, cursorState,   componentName, setComponentName, pathName, setPathName,
  blogPageName, setBlogPageName, contactPageName,  setContPageName, writePageName, setWritePageName, pathNameMount, pathLocation,
  blogPageAliasName, setBlogPageAliasName, writePageAliasName, setWritePageAliasName, generalFetchError, setgeneralFetchError, setContactPageAliasName,
  setAboutPageName, setAboutPageAliasName, aboutPageName
  } = useContext(AuthContext);
  
  
  const [reload, setReload] = useState(false);

  //const [menuNameArray,  setMenuNameArray] = useState([])

  useEffect(()=>{
  setTimeout(() => {
    setReload(true)
  }, 600);

 
}, [])



//This handles the auto generation of pathname and menu names created by the admin
useEffect(() =>{
  console.log('testing pathnams')
  pathName?.map((singlePath) =>{
    componentName?.map((singleComponent)=>{
      console.log(componentName)
      if(singlePath.aliasName == 'BLOG' && singlePath?.aliasName == singleComponent?.componentName){
        setBlogPageName(singlePath?.pathName);
        setBlogPageAliasName(singlePath?.aliasName)
      }
      if(singlePath?.aliasName == 'CONTACT'&& singlePath?.aliasName == singleComponent.componentName){
        setContPageName(singlePath.pathName)
        setContactPageAliasName(singlePath?.aliasName)
      }
       if(singlePath?.aliasName === 'WRITE' && singlePath.aliasName == singleComponent.componentName){
      setWritePageName(singlePath?.pathName);
      setWritePageAliasName(singlePath?.aliasName)
    }

    if(singlePath?.aliasName === 'ABOUT' && singlePath.aliasName == singleComponent.componentName){
      setAboutPageName(singlePath?.pathName);
      setAboutPageAliasName(singlePath?.aliasName)
    }
    })
    
   
    
  })
}, [pathLocation, pathNameMount, pathName])

 



  return (
    <Router>
      {cursorState  && <CursorNotallowed/>}
      {!reload  && <PageLoader/>}

      
      {!isLoading && reload && <HeaderNavbar/>}

      {generalFetchError && <FetchingError/>}
      {/*<Helmethome/>*/}
      <Switch>
        
        <Route exact path="/">
          <Home />
        </Route>

        <Route exact path={`/${aboutPageName?.toLowerCase()}`}>
          <AboutUs />
        </Route>

        <Route exact path={`/${contactPageName?.toLowerCase()}`}>
          <Contactus/>
        </Route>
         
        <Route path="/register">
          <Register />
        </Route>

        <Route path="/login">
          {reload && <Login />}
        </Route>

        <Route path={`/${writePageName?.toLowerCase()}`}>
          {auth?.token ?<Texteditor/> : <Register/>}
        </Route>

         <Route path={`/${blogPageName?.toLowerCase()}/page/:id`}>
          {<Blog/>}
        </Route>

        <Route path="/settings/:profileId">
          {auth?.token  ? <Settings />: <Register/>}
        </Route>

       <Route path="/userProfile/:publicprofileId">
          <UserProfilePublic/>
        </Route>
        
        
      <Route path="/admin">
           <Admin/> 
        </Route>
       <Route path="/users/page/:pageId">
          {logUser?.role == "admin" && auth?.token  ?  <Usersmanager/> : <Register/> }
        </Route>
         <Route path="/settings">
          {logUser?.role == "admin" && auth?.token  ?  <WebsiteSettings/> : <Register/> }
        </Route>
        <Route path="/pages">
          {logUser?.role == "admin" && auth?.token ?  <PageSettings/> : <Register/> }
        </Route>

         <Route path="/menu">
          {logUser?.role == "admin" && auth?.token ?  <Menu/> : <Login/> }
        </Route>

         <Route path="/email-demon">
          {logUser?.role == "admin" && auth?.token ?  <Subscribers/> : <Login/> }
        </Route>

        <Route path="/users/:userId">
          {auth?.token  ?  <SingleUser/>: <Login/>}
        </Route>

        <Route path="/post/:postId">
          <Single />
        </Route>
         <Route path="/usersposts/:id/:pageId">
          {auth?.token ? <UsersPosts/>: <Login/>}
        </Route>
        
      <Route path="/subverify/:subId/:tokenId">
          {<SubscriberConfirmation/>}
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
