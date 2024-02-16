import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import NoBlogIcon from "../assets/nonblogs.svg?react";

import { BarLoader } from "react-spinners";
import BlogCard from "../Components/Blog/BlogCard";

export const Search = () => {
  const location = useLocation();
  const { loading, error, data, fetchData } = useFetch("GET");
  const [blogsData, setBlogsData] = useState([]);
  const [searchTerm,setSearchTerm] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.toString();
    const searchTerm = params.get('searchTerm');
    setSearchTerm(searchTerm || '')
    fetchData(`/api/blog?${searchQuery}`);
  }, [location.search]);

  useEffect(() => {
    console.log(data);
    if (data) setBlogsData(data["data"]["blogs"]);
  }, [data]);

  return (
    <div className="h-screen w-full ">
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <BarLoader height={30} width={250} color="#3F3D56" />
        </div>
      ) : (
        <div className="w-full h-full">{!blogsData.length ? <div className="w-full h-full flex flex-col items-center justify-center">
           <NoBlogIcon className="w-full" />
           <h2 className="mt-5 font-display text-4xl text-center text-text-accent">Uhh..Ohh No blogs found for term <span className="text-accent">{searchTerm}</span></h2>
        </div> : <div className="w-full px-6 flex gap-3">
          
            {blogsData.map(blog=><div className="w-1/3"><BlogCard blog={blog}/></div>)}
          
          </div>}</div>
      )}
    </div>
  );
};
