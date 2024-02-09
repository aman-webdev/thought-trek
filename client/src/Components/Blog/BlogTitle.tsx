import React from 'react'

const BlogTitle = ({title,className}:{title:string,className:string}) => {
  return (
    <h1 className={className}>{title}</h1>
  )
}

export default BlogTitle