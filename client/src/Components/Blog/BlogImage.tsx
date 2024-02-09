import React from 'react'

const BlogImage = ({title,className,src}:{title:string,className:string,src?:string}) => {
  return (
    <img src={src || ''} className={className}>{title}</img>
  )
}

export default BlogImage