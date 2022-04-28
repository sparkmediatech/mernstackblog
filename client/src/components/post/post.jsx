import { useContext } from 'react';
import './post.css';
import {Link} from "react-router-dom"
import {AuthContext} from '../../context/AuthProvide';


export default function Post({post}) {
    const {auth} = useContext(AuthContext);
    console.log(auth)
    const PF = "http://localhost:5000/images/"
    return (
        <div className='post'>
            {post.postPhoto &&(
            <img 
            className='postImg'
            src={post.postPhoto} alt="" />
            )}

            <div className='postInfo'>
                <div className='postCats'>
                   
                </div>
                
                <Link to={`/post/${post._id}`} className="link">
                    <span className='postTitle'>{post.title}</span>
                </Link>

                
                <hr />
                <span className='postDate'> {new Date(post.createdAt).toDateString()}</span>
            </div>

            <p className='postDescription'>
                {post.description}
            </p>

        </div>
    )
}
