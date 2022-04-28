import React from 'react';
import { Helmet } from 'react-helmet';

export default function Helmethome() {
 return (
 <Helmet>
  <title>React Full Blog Application</title>

  <meta 
  name="description" 
  content="A full stack blog application built using react.js and node.js with Mongodb database"
  />

 </Helmet>
 )
}
