import React, { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../context/userContext";
import useFetch from "../hooks/useFetch";
import toast from "react-hot-toast";
import Button from "./Button";
import Like from "./Like";
import BlogContext from "../context/blogContext";

const Comment = ({
  comment,
  totalLikes,
  userId,
  commentId,
  likes
}: {
  comment: string;
  totalLikes: number;
  userId: string;
  commentId:string;
  likes:any[]
}) => {
  const {
    user: { user, isAuthenticated },
  } = useContext(UserContext);

  const {likeBlogComment,deleteBlogComment , editBlogComment} = useContext(BlogContext)


  const [commentValue,setCommentValue] = useState(comment)
  const [isEdit,setIsEdit] = useState(false)
  const textRef = useRef<HTMLTextAreaElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const wrappedRef = useRef<HTMLDivElement>(null)


  const {error:editError,fetchData:editComment,data:editCommentData} = useFetch("PATCH")
  const {error:likeError,fetchData:likeComment,data:likeCommentData} = useFetch("PATCH")
  const {error:deleteError,fetchData:deleteComment , data:deleteCommentData} = useFetch("DELETE")


  const hasUserLiked = likes.find(like=>like._userId===user?._id)


  useEffect(()=>{
    if(editError) toast.error(editError)
    if(editCommentData) editBlogComment(commentId , commentValue) 

  },[editError,editCommentData])

  useEffect(()=>{
    if(likeError) toast.error(likeError)
    if(likeCommentData) likeBlogComment(user._id,commentId)
  },[likeError,likeCommentData])

  useEffect(()=>{
    if(deleteError) toast.error(likeError)
    if(deleteCommentData) deleteBlogComment(commentId)
  },[deleteError,deleteCommentData])


  const unAuthError=(action:string)=>{
    if(!isAuthenticated) return `You need to be signed in to ${action}`
    return ''
  }

  

  const handleEdit =() => {
     const isErr = unAuthError('Edit')
     if(isErr) return toast.error(isErr)
     editComment(`/api/comment/edit/${commentId}`,{comment:commentValue})
     setIsEdit(false)
    
  }

  const handleLike=async()=>{
    const isErr = unAuthError('Like')
    if(isErr) return toast.error(isErr)
     likeComment(`/api/comment/like/${commentId}`)

  }

  const handleDelete=()=>{
    const isErr = unAuthError('Delete')
    if(isErr) return toast.error(isErr)
     deleteComment(`/api/comment/delete/${commentId}`)
  } 

  if(!comment) return

  return (
    <div className="comment">
      <div className="my-6  w-full items-center outline-dashed p-3 outline-offset-8 outline-text-accent ">
        <div className=" w-full flex items-center gap-3   ">
          <div className="text-center ">
            
              <Like onClick={handleLike} className={`w-6 cursor-pointer h-6 fill-none transition-colors ${!hasUserLiked  ? 'stroke-text-accent fill-none hover:stroke-none hover:fill-red-400' : 'stroke-none fill-red-400 hover:stroke-text-accent hover:fill-none'}  `} />
           
            {totalLikes ? (
              <p className="mt-[4px] text-xs">{totalLikes}</p>
            ) : null}
          </div>

          <textarea   value={commentValue} onChange={(e)=>setCommentValue(e.target.value)} ref={textRef} readOnly={!isEdit} className="w-full h-full outline-none "/>
        </div>
      </div>
      {isAuthenticated && user?._id === userId ?

      !isEdit ?  (
        <div className="flex text-xs mt-2 items-center gap-3 text-gray-400">
          <p className="cursor-pointer hover:text-black" onClick={()=>{
            setIsEdit(true)
            if(textRef.current) textRef.current.focus()
            }}>Edit</p>
          <p onClick={handleDelete} className="cursor-pointer hover:text-black" >Delete</p>
        </div>
      ) :<div className=" flex gap-4"> <Button  onClick={handleEdit}>Edit</Button>
      <Button  onClick={()=>{
        setIsEdit(false)
        setCommentValue(comment)
      }}>Cancel</Button>
      </div> : null}
    </div>
  );
};

export default Comment;
