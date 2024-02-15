import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import {Blog} from "../interfaces/interface";
import { BarLoader } from "react-spinners";
import BlogTitle from "../Components/Blog/BlogTitle";
import BlogImage from "../Components/Blog/BlogImage";
import CustomDate from "../Components/Date";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import Comment from "../Components/Comment";
import { Button } from "../Components";
import Like from "../Components/Like";
import UserContext from "../context/userContext";
import toast from "react-hot-toast";

const BlogPage = () => {
  const { blogSlug } = useParams();
  const { data, fetchData, loading } = useFetch("GET");
  const { error:createError, fetchData:createComment } = useFetch("POST");
  const { error:blogLikeError, fetchData:likeBlog } = useFetch("PATCH");

  const {user : {isAuthenticated,user}} = useContext(UserContext)


  const [blogData, setBlogData] = useState<null | Blog>(null);
  const [newComment,setNewComment] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogData =  () => {
      if (!blogSlug) return;
      try {
         fetchData(`/api/blog/${blogSlug}`);
      } catch (err) {}
    };

    fetchBlogData();
  }, []);

  useEffect(() => {
    if (!data) return;
    //@ts-ignore
    const blog = data?.data;
    setBlogData(blog);
  }, [data]);

  const handleCreateComment=()=>{
    if(!isAuthenticated) return toast.error("You need to be signed in to Comment")
    createComment(`/api/comment/create`,{blogId:blogData?._id,comment:newComment})
  }

  const handleLike=()=> {
    if(!isAuthenticated) return toast.error("You need to be signed in to Like")
    likeBlog(`/api/blog/like/${blogData?._id}`)
  }

  const hasUserLikedBlog =  blogData?.likes?.find(like=>like._userId===user?._id)

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
              <div
                className="flex gap-4 items-center cursor-pointer"
                onClick={() =>
                  navigate(`/creator/${blogData._userId.username}`)
                }
              >
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
           <Like  className={`w-12 h-12 mx-auto my-2 fill-none  transition-colors ease-in-out ${!hasUserLikedBlog ? "stroke-text-accent   hover:fill-red-400 cursor-pointer" : "hover:stroke-text-accent  stroke-red-400 fill-red-400 hover:fill-none cursor-pointer"} ` } onClick={handleLike} />
            <p className="mt-6  text-lg">{blogData.desc}</p>
            <div className="bg-white px-2 py-4 mt-12">
              <div className="rounded-sm shadow-sm  w-5/6 mx-auto ">
                <ReactQuill readOnly value={blogData.body} theme="bubble" />
              </div>
              <div className="mt-12 w-5/6 text-left px-8 ">
                <h2 className="text-left font-display text-text-accent w-full mb-6 text-2xl">
                  Top Comments
                </h2>
                <div className="">
                <textarea
                  value={newComment}
                  onChange={(e)=>setNewComment(e.target.value)}
                  placeholder="Add Comment"
                  className="bg-transparent p-3  outline-offset-8  outline-text-accent outline-dashed w-full"
                />
              {newComment && <Button additionalStyles="my-4" onClick={handleCreateComment}>Create</Button>}
                </div>
                {blogData.comments && blogData.comments.map((comment) => (
                  <Comment
                    likes={comment.likes}
                    commentId={comment._id}
                    comment={comment.comment}
                    userId={comment._userId}
                    totalLikes={comment.totalLikes}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default BlogPage;
