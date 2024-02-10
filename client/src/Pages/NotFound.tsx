/// <reference types="vite-plugin-svgr/client" />
import NotFoundLogo from "../assets/notfound.svg?react"

const NotFound = () => {
  return (
    <div className='w-full h-screen flex items-center flex-col justify-center'>
        <NotFoundLogo className="w-1/3 h-1/3" />
        <h1 className="font-display text-3xl mt-12 text-red-400">Not Found</h1>

    </div>
  )
}

export default NotFound