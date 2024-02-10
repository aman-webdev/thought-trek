import React from 'react'
import Blog from '../../interfaces/blog.interface'
import BlogTitle from './BlogTitle'
import BlogImage from './BlogImage'
import CustomDate from '../Date'
import BlogDescription from './BlogDescription'
import { useNavigate } from 'react-router-dom'

const BlogCard = ({blog}:{blog:Blog}) => {
  const navigate = useNavigate()
  return (
    <div className='w-2/3 p-4  my- cursor-pointer' onClick={()=>navigate(`/blog/${blog.slug}`)}>
        <header className='flex items-center justify-between mb-2'>
          <BlogTitle title={blog.title.substring(0,20)}/>
         {blog.createdAt &&  <CustomDate date={blog.createdAt} />}
        </header>
        <BlogImage src={blog.image}/>
        <BlogDescription className='w-5/6 leading-relaxed mt-2 capitalize' text={blog.desc.substring(0,30)} />
    </div>
  )
}

export default BlogCard