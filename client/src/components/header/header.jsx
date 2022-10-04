import './header.css';
import { useState, useEffect, useContext } from 'react';
import Dashboard from '../../pages/Admindashboard/Dashboard';
import axios from 'axios';
import {AuthContext} from '../../context/AuthProvide';
import  BASE_URL from '../../hooks/Base_URL'
import {MdNavigateNext, MdNavigateBefore} from 'react-icons/md'
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../../hooks/CustomMediaQuery';


export default function Header() {
    const {auth, isLoading, dispatch} = useContext(AuthContext);
    let   tabletMode = useMediaQuery('(max-width: 768px)');
    let   mobileMode = useMediaQuery('(max-width: 576px)');
    let   biggerScreen1 = useMediaQuery('(max-width: 1200px)'); 
    const [headerValues, setHeaderValues] = useState([]);
    const [sliderPosts,  setSliderPosts] = useState([])
    
    const [desktopSlideCount, setDesktopSlideCount] = useState(0);
    const [tabletModeSlideCount, setTabletModeSlideCount] = useState(0)
    const [mobileModeSlideCount, setMobileModeSlideCount] = useState(0);
    const [biggerScreenSlideCount, setBiggerScreenSlideCount] = useState(0)
    const PF = "http://localhost:5000/images/";
    const [showSlideIcons, setShowSlideIcons] = useState(false);
    const [slideAnimation, setSlideAnimation] = useState(true)
    const [movePosition, setMovePosition] = useState(0);
    const [tabletModeMovePosition, setTabletModeMovePosition] = useState(25);
    const [mobileModeMovePosition, setMobileModeMovePosition] = useState(0);
    const [biggerScreenMovePosition, setBiggerScreenMovePosition] = useState(25)
    
    const [current, setCurrent] = useState(2)
    const [transition, setTransition] = useState(false);
    const [direction, setDirection] = useState(0);
    const [count, setCount] = useState(3);
    const [selectedId, setSelectedId] = useState('');
    const [randomPostTitle, setRandomPostTitle] = useState('');
    
   const percentage = 100
  

  useEffect(() => {
       dispatch({ type: "ISLOADING_START" });
      const fetchFrontendValue = async () =>{
          const res = await axios.get(`${BASE_URL}/headervalue`);
          setHeaderValues(res.data)
           dispatch({ type: "ISLOADING_END" });
      }
     fetchFrontendValue()
  }, [])

  

  //fetch the randomly generated post from api

  useEffect(()=>{
    const sliderPosts = async()=>{
        try{
            const response = await axios.post(`${BASE_URL}/posts/randomPosts`);
             
            setSliderPosts(response.data);
           
           
        }catch(err){

        }
    }
    sliderPosts()
  }, []);

  
  



    useEffect(()=>{
     const lastIndex = sliderPosts.length - 3;
     const tabletLastIndex = sliderPosts.length - 1;
    
    
     

      if(!tabletMode && !mobileMode && (desktopSlideCount < 0)){
        setDesktopSlideCount(2)
       setMovePosition(0)
     }
      if(tabletMode && !mobileMode && (tabletModeSlideCount < 2)){
        setTabletModeSlideCount(4)
        setTabletModeMovePosition(25)
      }
      if(mobileMode && (mobileModeSlideCount < 0) ){
       
        setMobileModeSlideCount(3)
        setMobileModeMovePosition(0)
      }
  

  //run when the screen mode is more than tablet and mobile
  if (!biggerScreen1 && !tabletMode && !mobileMode && ( desktopSlideCount > lastIndex)){  
      setDesktopSlideCount(2);
      setMovePosition(0)
 } 
 
 if(biggerScreen1 && !tabletMode && !mobileMode && (biggerScreenSlideCount > lastIndex)){
    setBiggerScreenSlideCount(2);
    setBiggerScreenMovePosition(-25)
 }
 //run on tablet mode
 if(tabletMode == true && !mobileMode && ( tabletModeSlideCount >  tabletLastIndex)){
     
      setTabletModeSlideCount(3)
       setTabletModeMovePosition(24.5)
   }
      
      if(mobileMode && (mobileModeSlideCount > tabletLastIndex-2)){
        setMobileModeSlideCount(1)
        setMobileModeMovePosition(0)
      }

      console.log(mobileModeSlideCount)
     
  }, [desktopSlideCount, tabletModeSlideCount, mobileModeSlideCount, tabletMode, mobileMode, biggerScreen1, biggerScreenSlideCount])

 

  //controls the auto animation and allows for pausing of animation slide when on hover
 useEffect(()=>{  
      if(slideAnimation == true){
       
        let slider = setInterval(() => {
        
      if(!biggerScreen1 && !tabletMode && !mobileMode){
          
          setDesktopSlideCount(desktopSlideCount + 1)
          setMovePosition(movePosition - 33)
        }
        if(biggerScreen1 && !tabletMode && !mobileMode){
          setBiggerScreenSlideCount(biggerScreenSlideCount + 1);
          setBiggerScreenMovePosition(biggerScreenMovePosition - 53)
        }
        if(tabletMode && !mobileMode ){
            setTabletModeSlideCount(tabletModeSlideCount + 1)
           setTabletModeMovePosition(tabletModeMovePosition - 50)
           
        }
        if(mobileMode){
          setMobileModeSlideCount(mobileModeSlideCount + 1)
          setMobileModeMovePosition(mobileModeMovePosition  - 101)
        }
       
       
      }, 2000);
    return () => {
      clearInterval(slider);
    };
      }
   
  }, [desktopSlideCount, tabletModeSlideCount, slideAnimation, movePosition, mobileModeSlideCount, tabletModeMovePosition, mobileModeMovePosition, biggerScreenMovePosition])
  


  const handleNextSlide = ()=>{
      if(!tabletMode && !mobileMode){
       
      setDesktopSlideCount(desktopSlideCount + 1);
     
      setMovePosition(movePosition - 33)
      }
      if(tabletMode && !mobileMode){
        setTabletModeSlideCount(tabletModeSlideCount + 1)
        setTabletModeMovePosition(tabletModeMovePosition - 50)
      }
      if(mobileMode ){
        
        setMobileModeSlideCount(mobileModeSlideCount + 1)
        setMobileModeMovePosition(mobileModeMovePosition -100)
      }
  } 
  
  //handle previous slide
  const handlePrevSlide = ()=>{
   
   
  if(!biggerScreen1 && !tabletMode && !mobileMode){
    setDesktopSlideCount(desktopSlideCount - 1)
    setMovePosition(movePosition + 33);
  }

  if(biggerScreen1 && !tabletMode && !mobileMode){
      setBiggerScreenSlideCount(biggerScreenSlideCount - 1)
      setBiggerScreenMovePosition(biggerScreenMovePosition + 50)
  }
   if(tabletMode && !mobileMode){
    setTabletModeSlideCount(tabletModeSlideCount - 1)
    setTabletModeMovePosition(tabletModeMovePosition + 50)
   }
   if(mobileMode){
    console.log(mobileModeSlideCount, 'I am mobile count')
     setMobileModeSlideCount(mobileModeSlideCount - 1)
    setMobileModeMovePosition(mobileModeMovePosition + 100)
   }
   
  }

  //handle show slideIcons
  const handleShowSlideIcons = ()=>{
    setSlideAnimation(false)
    setShowSlideIcons(true);
    
  }

  //handle hide slide Icons
const handleHideSlideIcons = () =>{
   setSlideAnimation(true)
     setShowSlideIcons(false);
   
}


console.log(mobileModeMovePosition)
useEffect(()=>{

      if(!biggerScreen1 && !tabletMode && !mobileMode){
        document.documentElement.style.setProperty('--tx', `${movePosition}vw`);
      }
      if(biggerScreen1 && !mobileMode && !tabletMode){
         document.documentElement.style.setProperty('--biggerScreenTX', `${biggerScreenMovePosition}vw`); 
      }
      if(tabletMode && !mobileMode){
        console.log('tablet mode also ran')
         document.documentElement.style.setProperty('--tabletModeTX', `${tabletModeMovePosition}vw`);
      }
      if(mobileMode ){
          document.documentElement.style.setProperty('--phoneModeTX', `${mobileModeMovePosition}vw`);
      }
     
     const nextSlide = (getComputedStyle(document.documentElement).getPropertyValue('--biggerScreenTX'))
     console.log(nextSlide, 'big screen')
     
}, [movePosition, tabletModeMovePosition, mobileModeMovePosition, biggerScreenMovePosition])

//this controls the line animation under each post title
useEffect(()=>{

  if(selectedId && randomPostTitle){
      //check the random post title length
       const postTitle = randomPostTitle.split('');
       const randomPostTitleCount = postTitle.filter(word => word !== '').length * 1.4;
       
      document.documentElement.style.setProperty('--postTitleLine', `${randomPostTitleCount}%`);
    const nextSlide = (getComputedStyle(document.documentElement).getPropertyValue('--postTitleLine'))
    
  }
}, [selectedId])






    return (
      
        <>
        
        <div className='section-slider-div'  onMouseEnter={handleShowSlideIcons} onMouseLeave={handleHideSlideIcons}  > 
        <MdNavigateNext  onClick={handleNextSlide} className={showSlideIcons ? 'next-icon slideIcon showSlideIcons': "next-icon slideIcon" }onMouseEnter={handleShowSlideIcons} onMouseLeave={handleHideSlideIcons}/>
         <MdNavigateBefore onClick={handlePrevSlide} className={showSlideIcons ? 'previous-icon slideIcon showSlideIcons': "previous-icon slideIcon"}onMouseEnter={handleShowSlideIcons} onMouseLeave={handleHideSlideIcons}/>
         {sliderPosts.map((singleSliderPost, index) =>{
             
             const {title, _id, postPhoto, createdAt, categories} = singleSliderPost || {}
              
            
              

                 return(
                     <> 
                   {/*<div  className={`${position} ${transition ? 'move header-image-div ': 'header-image-div '}  ` }  key={index}  >*/} 
                     <div  className='header-image-div move' key={index}  onMouseEnter={()=> {setSelectedId(_id); setRandomPostTitle(title)}} onMouseLeave={()=> {setSelectedId(''); setRandomPostTitle('')}}>
                     
                      
                      <img src={postPhoto} alt="" className='postSlider-img'  />
                      
                      <div className='postSlider-detail-div'>
                        <div className='margin-left-sm1 postSlider-category-div '><p className='white-text text-general-small'>{categories}</p></div>
                        <div className='postSlider-title-div margin-left-sm1 margin-small flex-2'><Link to={`/post/${_id}`} className='link'><p className={selectedId === _id ? 'postTitle-animated-color postTitle  ': 'postTitle white-text '}>{title}</p></Link></div>

                          
                          <div className={selectedId == _id ? 'postTitleLine animated-post-title-line': 'postTitleLine'}></div>
                      
                        
                        
                        <div className='margin-left-sm1 margin-small'><p className='text-general-small white-text'> {new Date(createdAt).toDateString()}</p></div>
                        </div>
                    </div>
            
            
      
                 </>   
                 )
             })}

                     
      </div>
        </>
    )
}