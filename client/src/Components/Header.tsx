/// <reference types="vite-plugin-svgr/client" />
import Logo from "../assets/logo.svg?react";
import { Input , Button} from ".";
import { useState } from "react";


const Header = () => {

  const [searchInput,setSearchInput] = useState("")

  return (
    <header className="px-12 mt-2 flex items-center justify-between w-full">
      <Logo className="w-12 h-12 fill-gray-800" />
      <Input type="string" placeholder="Search" className="w-1/2 px-4 py-2 rounded-full outline-accent-light outline-[0.1px] outline " value={searchInput} onChange={(e)=>setSearchInput(e.target.value)} />
      <div>
        <Button  additionalStyles="hover:bg-accent transition ease-in-out">Sign In</Button>
      </div>
    </header>
  );
};

export default Header;
