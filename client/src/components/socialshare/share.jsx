import React from 'react';
import {FacebookShareButton, TumblrShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton, EmailShareButton,
 TelegramShareButton, PinterestShareButton} from "react-share";
import {FacebookIcon, TumblrIcon, TwitterIcon, LinkedinIcon, WhatsappIcon, EmailIcon, TelegramIcon,
PinterestIcon} from "react-share";
import "./share.css"

export default function Share({link}) {
  console.log(link.toString())

 return (
  <div className="socialmedia-div">
   <FacebookShareButton url={link} >
     <FacebookIcon className="social-icons" lightingColor="white" round={true} size={30}>

     </FacebookIcon>
   </FacebookShareButton>
<TumblrShareButton url={link}>

  <TumblrIcon className="social-icons" lightingColor="white" round={true} size={30}>

  </TumblrIcon>
</TumblrShareButton>

<TwitterShareButton  url={link}>
  <TwitterIcon className="social-icons" lightingColor="white" round={true} size={30}>

  </TwitterIcon>

</TwitterShareButton>

<LinkedinShareButton url={link}>
  <LinkedinIcon className="social-icons" lightingColor="white" round={true} size={30}>
  
  </LinkedinIcon>
</LinkedinShareButton>

<WhatsappShareButton url={link}>
    <WhatsappIcon className="social-icons" lightingColor="white" round={true} size={30}>

    </WhatsappIcon>

</WhatsappShareButton>

<EmailShareButton url={link}>
    <EmailIcon className="social-icons" lightingColor="white" round={true} size={30}>

    </EmailIcon>
</EmailShareButton>

<TelegramShareButton url={link}>
  <TelegramIcon className="social-icons" lightingColor="white" round={true} size={30}>

  </TelegramIcon>
</TelegramShareButton>

<PinterestShareButton url={link}>
  <PinterestIcon className="social-icons" lightingColor="white" round={true} size={30}>

  </PinterestIcon>

</PinterestShareButton>
  </div>
 )
}
