/// <reference types="vite-plugin-svgr/client" />
import Noblogimg from "../../assets/noblogimg.svg?react"


const BlogImage = ({className='',src}:{className?:string,src?:string}) => {
  return (
   src ?  <img src={src} className={` w-full h-80 rounded-xl object-cover ${className}`}/> : <Noblogimg className="w-full h-80"/>
  )
}

export default BlogImage