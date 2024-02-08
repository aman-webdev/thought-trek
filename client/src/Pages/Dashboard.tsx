import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashProfile from '../Components/DashProfile'


const ProfileLinks = [{
  label:"Profile" , 
  path:"/dashboard?tab=profile"
}]

const Hamburger = ({additionalClass}:{additionalClass?:string}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`${additionalClass ?additionalClass :"" } w-12 h-12`} fill="currentColor"><path d="M3 4H21V6H3V4ZM3 11H15V13H3V11ZM3 18H21V20H3V18Z"></path></svg>


const SidebarItem = ({label,path}:{label:string,path:string})=>{
  return <div className='border border-gray-300 rounded-md w-full px-4 py-2 text-center cursor-pointer'>
    {label}
  </div>
}

const Dashboard = () => {

  const location = useLocation()
  const [tab,setTab] = useState("")
  
  useEffect(()=>{
      const urlParams = new URLSearchParams(location.search)
      setTab(urlParams.get("tab") || "")
  },[location.search])


  return (
    <div className='  '>
      <div className="absolute left-0 w-1/4 top-0 bottom-0 bg-white opacity-60  ">
      
        <div className='relative top-28'>
        {ProfileLinks.map(link=><SidebarItem label={link.label} path={link.path} key={link.path} />)}
        </div>
        <div className=' absolute bottom-2  cursor-pointer left-2'>
          <Hamburger/>
        </div>
      </div>
      <div className="  relative flex items-center left-1/4 w-3/4  justify-center  mt-12"><DashProfile/></div>
    </div>
  )
}

export default Dashboard