import React, { createContext, useEffect, useState } from 'react'

const UserContext = createContext<{user:any,setUser:any}>({
 user : { isAuthenticated:false,
  user:null} , setUser:null
})


export const UserProvider = ({children}:{children:React.ReactNode}) => {
  const [user,setUser] = useState({
    isAuthenticated:false,
    user:null
  })

  console.log(user,"updated user here")

  useEffect(()=>{
      const localuser = localStorage.getItem("user")
      // update local storage
      if(!localuser) localStorage.setItem("user",JSON.stringify(user))
      if(localuser) {
        const parsed = JSON.parse(localuser)
        if(!parsed.isAuthenticated && user.isAuthenticated) localStorage.setItem("user",JSON.stringify(user))
      }
  },[user])

  useEffect(()=>{
    const localuser = localStorage.getItem("user")
    if(localuser && !user.isAuthenticated) setUser(JSON.parse(localuser))
  },[])

  return <UserContext.Provider value={{user,setUser}}>{children}</UserContext.Provider>

}

export default UserContext