import React, { createContext, useEffect, useState } from 'react'

const UserContext = createContext<{user:any,setUser:any}>({
 user : { isAuthenticated:false,
  user:null} , setUser:null
})


export const UserProvider = ({children}:{children:React.ReactNode}) => {
  const [user,setUser] = useState( JSON.parse(localStorage.getItem("user") || "{}") || {
    isAuthenticated:false,
    user:null
  })


  return <UserContext.Provider value={{user,setUser}}>{children}</UserContext.Provider>

}

export default UserContext