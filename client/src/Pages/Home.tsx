/// <reference types="vite-plugin-svgr/client" />
import React, { useContext, useEffect, useState } from "react";
import NoBlogIcon from "../assets/nonblogs.svg?react";
import UserContext from "../context/userContext";
import useFetch from "../hooks/useFetch";
import { BarLoader } from "react-spinners";
import Blog from "../interfaces/blog.interface";
import BlogCard from "../Components/Blog/BlogCard";
import { Link, useLocation, useParams } from "react-router-dom";
import { Button } from "../Components";

const Home = () => {
  const { data: blogsData, error, loading, fetchData } = useFetch("GET");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [totalBlogs, setTotalBlogs] = useState(0);

  const { username } = useParams();
  const {
    user: { isAuthenticated, user },
  } = useContext(UserContext);

  useEffect(() => {
    if (blogsData) {
      setBlogs(
        blogs?.length
          ? [...blogs, ...blogsData["data"]["blogs"]]
          : blogsData["data"]["blogs"]
      );
      setTotalBlogs(blogsData["data"]["totalBlogs"]);
    }
  }, [blogsData]);

  useEffect(() => {
    setBlogs([])
    setTotalBlogs(0)
    const fetchUrl = username
      ? `/api/blog?username=${username}`
      : "/api/blog";
    fetchData(fetchUrl);
  }, [username]);

  const handleShowMore = async () => {
    try {
      await fetchData(`/api/blog?startIndex=${blogs.length}`);
    } catch (err) {}
  };

  return (
    <div className="w-full h-screen">
      {loading && !blogs.length ? (
        <div className="w-full h-full flex items-center justify-center">
          <BarLoader height={30} width={250} color="#3F3D56" />
        </div>
      ) : (
        <div className="w-full h-full flex">
          {blogs.length ? <div className="w-1/5 "></div> : null}
          <div
            className={`${
              !blogs.length
                ? "w-full h-full flex items-center justify-center"
                : "w-4/5"
            }`}
          >
            {!username && (
              <h1 className="text-6xl my-8  font-display text-black">
                Latest Thoughts
              </h1>
            )}

            <div className=" ">
              {blogs.length ? (
                <div className="w-2/3">
                  {blogs.map((blog) => (
                    <BlogCard blog={blog} key={blog.slug} />
                  ))}
                  {blogs.length < totalBlogs && <Button additionalStyles="mx-auto block my-6" onClick={handleShowMore}>Show More</Button>}
                </div>
              ) : (
                <div>
                  <NoBlogIcon className="w-full" />

                  <p className="text-4xl font-display text-center text-text-accent my-8">
                    Uhh..Oh No Blogs Found{" "}
                    {user.username !== username && (
                      <span className="text-accent"> for {username}</span>
                    )}
                  </p>
                  {isAuthenticated && username === user.username && (
                    <Link to={"/blog/create"}>
                      <Button>Create?</Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
