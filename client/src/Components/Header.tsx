/// <reference types="vite-plugin-svgr/client" />
import Logo from "../assets/logo.svg?react";
import Avatar from "../assets/user-avatar.svg?react";

import { Input, Button } from ".";
import { useContext, useState } from "react";
import UserContext from "../context/userContext";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [searchInput, setSearchInput] = useState("");
  const { user,setUser } = useContext(UserContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate()

  const handleLogout=()=>{
    localStorage.removeItem("user")
    setUser({isAuthenticated:false,user:null})
    navigate("/")
  }

  return (
    <header className="px-12 mt-2 flex items-center justify-between w-full z-50">
      <Link to={'/'}><Logo className="w-12 h-12 fill-gray-800" /></Link>
      <Input
        type="string"
        placeholder="Search"
        className="w-1/2 px-4 py-2 rounded-full outline-accent-light outline-[0.1px] outline "
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <div
        className="flex justify-center items-center gap-6 cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Button additionalStyles="hover:bg-accent transition ease-in-out">
          {!user.isAuthenticated ? "Sign In" : "Write"}
        </Button>
        <div className="relative px-2 ">
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
            <p className=" border-b border-spacing-2 border-gray-200 mb-2 hover:opacity-60">@{user.user.username}</p>
            <Link to={'/profile'} className=" block border-b border-spacing-2 border-gray-200 mb-2 hover:opacity-60">Profile</Link>
            <p onClick={handleLogout} className="hover:opacity-60">logout</p>
            </div>}
        </div>
      </div>
    </header>
  );
};

export default Header;
