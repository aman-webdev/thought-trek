import React from 'react'

const BlogTitle = ({title,className=''}:{title:string,className?:string}) => {
  return (
    <h1 className={` text-4xl capitalize text-gray-700 my-2 font-bold ${className}`}>{title}</h1>
  )
}

export default BlogTitle