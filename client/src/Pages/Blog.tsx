import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Blog from "../interfaces/blog.interface";
import { BarLoader } from "react-spinners";
import BlogTitle from "../Components/Blog/BlogTitle";
import BlogImage from "../Components/Blog/BlogImage";
import CustomDate from "../Components/Date";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.bubble.css'

const BlogPage = () => {
  const { blogSlug } = useParams();
  const { data, fetchData, loading } = useFetch("GET");
  const [blogData, setBlogData] = useState<null | Blog>(null);
  const navigate = useNavigate()

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
        blogData && (
          <div className="text-center">
            <BlogTitle className="w-full text-7xl " title={blogData.title} />
            <BlogImage className="mt-8 " src={blogData.image} />
            <div className="relative w-full flex gap-12 justify-end items-center mt-4">
              <div className="flex gap-4 items-center cursor-pointer" onClick={()=>navigate(`/creator/${blogData._userId.username}`)}>
                <img
                  src={blogData._userId.profilePicture}
                  className="w-12 h-12 rounded-full"
                  alt=""
                />
                <p className="opacity-60">@{blogData._userId.username}</p>
              </div>
              <div className="w-1 h-12 bg-text-accent"></div>
              {blogData.createdAt && <CustomDate date={blogData.createdAt} />}
            </div>
            <p className="mt-12 text-lg">{blogData.desc}</p>
            <div className="mt-12">
              <ReactQuill readOnly value={blogData.body} theme="bubble" />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default BlogPage;
