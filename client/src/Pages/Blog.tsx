import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Blog from "../interfaces/blog.interface";
import { BarLoader } from "react-spinners";

const BlogPage = () => {
  const { blogSlug } = useParams();
  const { data, fetchData, loading } = useFetch("GET");
  const [blogData, setBlogData] = useState<null | Blog>(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!blogSlug) return;
      try {
        await fetchData(`/api/blog?slug=${blogSlug}`);
      } catch (err) {}
    };

    fetchBlogData();
  }, []);

  useEffect(() => {
    if (!data) return;
    //@ts-ignore
    const blog = data?.data["blogs"][0];
    setBlogData(blog);
  }, [data]);


  return (
    <div className="w-5/6 mx-auto h-screen py-16">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          {" "}
          <BarLoader height={30} width={250} color="#3F3D56" />
        </div>
      ) : (
        <div>blog</div>
      )}
    </div>
  );
};

export default BlogPage;
