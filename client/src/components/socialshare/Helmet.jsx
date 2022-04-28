import React from 'react';
import { Helmet } from "react-helmet";

export default function HelmetMetaData({pathURL, description, title, image}) {
 let currentUrl = pathURL;
 let postdescription = description;
 let posttitle = title;
 let postimage = image
 console.log(title)
 return (
  <Helmet>
    <title>{posttitle}</title>
    <meta charset="utf-8" />
     <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="csrf_token" content="" />
     <meta property="type" content="website" />
     <meta property="url" content={currentUrl} />
     <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
     <meta name="msapplication-TileColor" content="#ffffff" />
     <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />

      <meta name="theme-color" content="#ffffff" />
     <meta name="_token" content="" />
     <meta name="robots" content="noodp" />
     <meta property="title" content={posttitle} />
     <meta name="description" content={postdescription} />
      <meta property="image" content={postimage} />
        <meta property="og:locale" content="en_US" />
         <meta property="og:type" content="website" />
          <meta property="og:title" content={posttitle} />
           <meta property="og:image" content={postimage} />
          <meta content="image/*" property="og:image:type" />
     <meta property="og:url" content={currentUrl} />
     <meta property="og:site_name" content="React Blog" />
     <meta property="og:description" content={postdescription} />  
  </Helmet>
 )
}
