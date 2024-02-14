import React from 'react'
import {Blog} from '../../interfaces/interface'
import BlogTitle from './BlogTitle'
import BlogImage from './BlogImage'
import CustomDate from '../Date'
import BlogDescription from './BlogDescription'
import { useNavigate } from 'react-router-dom'
import Like from '../Like'

const BlogCard = ({blog}:{blog:Blog}) => {
  const navigate = useNavigate()
  return (
    <div className='w-full p-4  my-12 cursor-pointer' onClick={()=>navigate(`/blog/${blog.slug}`)}>
        <header className='flex items-center justify-between '>
          <BlogTitle title={blog.title}/>
         {blog.createdAt &&  <CustomDate date={blog.createdAt} />}
        </header>
        <div className='m mb-4  text-xs flex  items-center  '>
       {blog.totalLikes ? <> <Like className='w-5 h-5 fill-red-400'/> <p className='ml-1'>{blog.totalLikes}</p> </> : null}

          <p onClick={(e)=>{
            e.stopPropagation()
            navigate(`/creator/${blog._userId.username}`)}} className={`opacity-50 ${blog.totalLikes && 'ml-3'} `}>@{blog._userId.username}</p>
        </div>
        <BlogImage src={blog.image}/>
        <BlogDescription className='w-5/6 leading-relaxed mt-2 capitalize' text={blog.desc} />
    </div>
  )
}

export default BlogCard