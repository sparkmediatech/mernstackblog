import Post from '../post/post'
import './posts.css'
import '../../pages/responsive.css'

export default function posts({posts}) {//we picked the posts props and declared it
    return (
        <div className='posts'>
           {posts.map((singlePost, index)=>{
                
               return <Post post={singlePost} key={index}/>
           })}
                
                     
           
           
        
        </div>
    )
}
