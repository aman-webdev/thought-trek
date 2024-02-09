import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/userContext";
import useFetch from "../hooks/useFetch";
import { BarLoader } from "react-spinners";
import Blog from "../interfaces/blog.interface";
import BlogCard from "../Components/Blog/BlogCard";

const Home = () => {
  const { data: blogsData, error, loading, fetchData } = useFetch("GET");
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (blogsData) setBlogs(blogsData["data"]);
  }, [blogsData]);

  useEffect(() => {
    if (blogs.length) return;
    fetchData("/api/blog");
  }, [blogs]);

  return (
    <div className="w-full h-screen">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <BarLoader height={30} width={180} color="#3F3D56" />
        </div>
      ) : (
        <div className="w-full h-full bg-yellow-50 flex my-12">
          <div className="w-1/5 bg-yellow-100"></div>
          <div className="w-4/5 ">
            {blogs.map(blog=><BlogCard blog={blog} key={blog.slug} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
