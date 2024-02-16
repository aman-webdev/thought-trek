/// <reference types="vite-plugin-svgr/client" />
import Logo from "../assets/logo.svg?react";
import Avatar from "../assets/user-avatar.svg?react";

import { Input, Button } from ".";
import { useContext, useEffect, useState } from "react";
import UserContext from "../context/userContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useSignout from "../hooks/useSignout";
import toast from "react-hot-toast";

const Header = () => {
  const [searchInput, setSearchInput] = useState("");
  const { user,setUser } = useContext(UserContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate()
  const location = useLocation()

  const {signoutUser,error:signoutError} = useSignout()

  const handleLogout=async()=>{
    await signoutUser()
  }

  useEffect(()=>{
    if(signoutError) toast.error(signoutError)
  },[signoutError])

  useEffect(()=>{
    const urlParams =new URLSearchParams(location.search)
    const search = urlParams.get("searchTerm")
    setSearchInput(search || '')
  },[location.search])

  
  const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    const params = new URLSearchParams(location.search)
    params.set("searchTerm",searchInput)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <header className="px-12 mt-2 flex items-center justify-between w-full z-50">
      <Link to={'/'}><Logo className="w-12 h-12 fill-gray-800" /></Link>
      <form className="w-1/2" onSubmit={handleSubmit}>
          <Input
        
        type="string"
        placeholder="Search"
        className=" px-4 w-full py-2 rounded-full outline-text-accent outline-[0.1px] outline "
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      </form>
     
      <div
        className="flex justify-center items-center gap-6 cursor-pointer"
      >
        <Button onClick={()=>navigate( user.isAuthenticated ? "/blog/create" : "/sign-in")} additionalStyles="hover:bg-accent transition ease-in-out">
         {user.isAuthenticated ? "Write" : "Sign In"}
        </Button>
   
        <div className="relative px-2" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          {user.isAuthenticated ? (
            user?.user?.profilePicture ? (
              <img
                src={user.user.profilePicture}
                className="w-12 h-12 rounded-full"
                alt=""
              />
            ) : (
              <Avatar className="w-12 h-12" />
            )
          ) : null}
          {user.isAuthenticated && isDropdownOpen && <div className="absolute text-sm -left-1/2 top-3/4  rounded-md bg-white px-6 py-2 text-center z-50">
            <Link to='/profile' className=" block border-b border-spacing-2 border-gray-200 mb-2 hover:opacity-60">@{user.user.username}</Link>
            <Link to={`/creator/${user.user.username}`} className=" block border-b border-spacing-2 border-gray-200 mb-2 hover:opacity-60">Blogs</Link>
            <p onClick={handleLogout} className="hover:opacity-60">logout</p>
            </div>}
        </div>
      </div>
    </header>
  );
};

export default Header;
