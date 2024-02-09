import React from 'react'

const BlogDescription = ({text,className}:{text:string,className:string}) => {
  return (
    <p className={className}>{text}</p>
  )
}

export default BlogDescription