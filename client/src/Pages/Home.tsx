import React, { useContext } from 'react'
import UserContext from '../context/userContext'

const Home = () => {
  const {user} = useContext(UserContext)
  console.log("userr",user)
  return (
    <div>Home</div>
  )
}

export default Home