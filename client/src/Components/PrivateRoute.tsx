import React, { useContext, useEffect } from 'react'
import UserContext from '../context/userContext'
import { useNavigate } from 'react-router-dom'

const PrivateRoute = ({children}:{children:React.ReactNode}) => {
    const user = JSON.parse(localStorage.getItem("user")|| "{}")
    const navigate = useNavigate()

    useEffect(()=>{
          if(!user.isAuthenticated) navigate("/sign-in")

    },[user])

  return (
    <>{children}</>
  )
}

export default PrivateRoute