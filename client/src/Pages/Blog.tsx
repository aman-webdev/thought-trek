import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import {Blog, Comment as CommentInterface, Vote} from "../interfaces/interface";
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
import BlogContext from "../context/blogContext";

const BlogPage = () => {
  const { blogSlug } = useParams();
  const { data, fetchData, loading } = useFetch("GET");
  const { error:createError, fetchData:createComment ,data:createData } = useFetch("POST");
  const { error:blogLikeError, fetchData:likeBlog ,data:likeBlogData} = useFetch("PATCH");

  const {user : {isAuthenticated,user}} = useContext(UserContext)


  const {selectedBlog,setSelectedBlog ,createBlogComment,likeBlog:likeBlogState} = useContext(BlogContext)

  const [newComment,setNewComment] = useState('')
  const navigate = useNavigate();

  console.log(selectedBlog,"upcom state")

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
    setSelectedBlog(blog);
  }, [data]);

  useEffect(()=>{
    if(createData) {
      createBlogComment(user._id,newComment)
      setNewComment('')
    }
  },[createError , createData])

  const handleCreateComment=()=>{
    if(!isAuthenticated) return toast.error("You need to be signed in to Comment")
    createComment(`/api/comment/create`,{blogId:selectedBlog?._id,comment:newComment})
  }

  const handleLike=()=> {
    if(!isAuthenticated) return toast.error("You need to be signed in to Like")
    likeBlog(`/api/blog/like/${selectedBlog?._id}`)
  }

  useEffect(()=>{
    if(likeBlogData) likeBlogState(user._id)
  },[likeBlogData])

  const hasUserLikedBlog =  selectedBlog?.likes?.find((like:Vote)=>like._userId===user?._id)

  return (
    <div className="w-5/6 mx-auto h-screen py-16">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          {" "}
          <BarLoader height={30} width={250} color="#3F3D56" />
        </div>
      ) : (
        selectedBlog && (
          <div className="text-center">
            <BlogTitle className="w-full text-7xl " title={selectedBlog.title} />
            <BlogImage className="mt-8 " src={selectedBlog.image} />
            <div className="relative w-full flex gap-12 justify-end items-center mt-4">
              <div
                className="flex gap-4 items-center cursor-pointer"
                onClick={() =>
                  navigate(`/creator/${selectedBlog._userId.username}`)
                }
              >
                <img
                  src={selectedBlog._userId.profilePicture}
                  className="w-12 h-12 rounded-full"
                  alt=""
                />
                <p className="opacity-60">@{selectedBlog._userId.username}</p>
              </div>
              <div className="w-1 h-12 bg-text-accent"></div>
              {selectedBlog.createdAt && <CustomDate date={selectedBlog.createdAt} />}
            </div>
           <Like  className={`w-12 h-12 mx-auto my-2 fill-none  transition-colors ease-in-out ${!hasUserLikedBlog ? "stroke-text-accent   hover:fill-red-400 cursor-pointer" : "hover:stroke-text-accent  stroke-red-400 fill-red-400 hover:fill-none cursor-pointer"} ` } onClick={handleLike} />
            <p className="mt-6  text-lg">{selectedBlog.desc}</p>
            <div className="bg-white px-2 py-4 mt-12">
              <div className="rounded-sm shadow-sm  w-5/6 mx-auto ">
                <ReactQuill readOnly value={selectedBlog.body} theme="bubble" />
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
                {selectedBlog.comments && selectedBlog.comments.map((comment:CommentInterface) => (
                  <Comment
                  key={comment._id}
                    likes={comment.likes}
                    commentId={comment._id || ""}
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
