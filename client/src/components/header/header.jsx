import './header.css';
import TopBar from '../topbar/TopBar';
import { useState, useEffect, useContext } from 'react';
import Dashboard from '../../pages/Admindashboard/Dashboard';
import axios from 'axios';
import {AuthContext} from '../../context/AuthProvide';
import  BASE_URL from '../../hooks/Base_URL'
import {MdNavigateNext, MdNavigateBefore} from 'react-icons/md'
import { Link } from 'react-router-dom';
//import {useLocation} from "react-router-dom"

const DIRECTIOM_TYPE = {
  next: "NEXT",
  prev: "PREV"
};

export default function Header() {
     const {auth, isLoading, dispatch} = useContext(AuthContext);
   
    const [headerValues, setHeaderValues] = useState([]);
    const [sliderPosts,  setSliderPosts] = useState([])
    const [slider1, setSlider1] = useState(0)
    const [slider2, setSlider2] = useState(1)
    const [slider3, setSlider3] = useState(2)
    const PF = "http://localhost:5000/images/";
    const [showSlideIcons, setShowSlideIcons] = useState(false);
    const [slideAnimation, setSlideAnimation] = useState(true)
    const [movePosition, setMovePosition] = useState(0) 
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
    if(slider1 < 0 || slider2 < 0 || slider3 < 0) {
     setTransition(false)
      setSlider1(lastIndex);
      setSlider2(lastIndex -1);
      setSlider3(lastIndex - 2);
      setMovePosition(0)
    }
    if (slider1 > lastIndex || slider2 > lastIndex || slider3 > lastIndex ) {
       setTransition(false)
      setSlider1(0);
      setSlider2(1);
      setSlider3(2);
      setMovePosition(0)
     
    }
  }, [slider1, slider2, slider3,])

 useEffect(()=>{  
      if(slideAnimation == true){
        setTransition(true)
        let slider = setInterval(() => {
        setSlider1(slider1 + 1);
        setSlider2(slider2 + 1);
        setSlider3(slider3 + 1);
        setMovePosition(movePosition - 33)
       
      }, 2000);
    return () => {
      clearInterval(slider);
    };
      }
   
  }, [slider1, slider2, slider3, slideAnimation, movePosition])
  


  const handleNextSlide = ()=>{
    
      setSlider1(slider1 + 1);
      setSlider2(slider2 + 1);
      setSlider3(slider3 + 1);
     setMovePosition(movePosition - 33)
  } 
  
  //handle previous slide
  const handlePrevSlide = ()=>{
    
   setSlider1(slider1 -1)
   setSlider2(slider2 -1)
   setSlider3(slider3 -1)
   setMovePosition(movePosition + 33)
   
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


console.log(slideAnimation)
useEffect(()=>{

      document.documentElement.style.setProperty('--tx', `${movePosition}vw`);
     const nextSlide = (getComputedStyle(document.documentElement).getPropertyValue('--tx'))
     //console.log(nextSlide, 'here here her')
}, [movePosition, ])

//this controls the line animation under each post title
useEffect(()=>{

  if(selectedId && randomPostTitle){
      //check the random post title length
       const postTitle = randomPostTitle.split('');
       const randomPostTitleCount = postTitle.filter(word => word !== '').length * 1.4;
       
      document.documentElement.style.setProperty('--postTitleLine', `${randomPostTitleCount}%`);
    const nextSlide = (getComputedStyle(document.documentElement).getPropertyValue('--postTitleLine'))
     console.log(nextSlide, 'here here her')
  }
}, [selectedId])


    return (
      
        <>
        
        <div className='section-slider-div'  onMouseEnter={handleShowSlideIcons} onMouseLeave={handleHideSlideIcons}  > 
        <MdNavigateNext  onClick={handleNextSlide} className={showSlideIcons ? 'next-icon slideIcon showSlideIcons': "next-icon slideIcon" }onMouseEnter={handleShowSlideIcons} onMouseLeave={handleHideSlideIcons}/>
         <MdNavigateBefore onClick={handlePrevSlide} className={showSlideIcons ? 'previous-icon slideIcon showSlideIcons': "previous-icon slideIcon"}onMouseEnter={handleShowSlideIcons} onMouseLeave={handleHideSlideIcons}/>
         {sliderPosts.map((singleSliderPost, index) =>{
             
             const {title, _id, postPhoto, createdAt, categories} = singleSliderPost || {}
              
             const percentage = 100;
              let position = 'nextSlide';
               const lastIndex = sliderPosts.length - 1;
              

              if(slider1 === index || slider2 === index || slider3 == index){
                position = 'currentSlide'
                
              }

            
              

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
