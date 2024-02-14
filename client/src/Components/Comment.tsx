import React, { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../context/userContext";
import useFetch from "../hooks/useFetch";
import toast from "react-hot-toast";
import Button from "./Button";
import Like from "./Like";

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


  const [commentValue,setCommentValue] = useState(comment)
  const [isEdit,setIsEdit] = useState(false)
  const textRef = useRef<HTMLTextAreaElement>(null)


  const {error:editError,fetchData:editComment} = useFetch("PATCH")
  const {error:likeError,fetchData:likeComment} = useFetch("PATCH")
  const {error:deleteError,fetchData:deleteComment} = useFetch("DELETE")


  const hasUserLiked = likes.find(like=>like._userId===user?._id)


  useEffect(()=>{
    if(editError) toast.error(editError)
    if(likeError) toast.error(likeError)

  },[editError,likeError])



  const handleOutsideClick=(e:React.FocusEvent<HTMLElement>)=>{
    if(!e.currentTarget.contains(e.relatedTarget)) setIsEdit(false)
  
  }

  const handleEdit =() => {
     editComment(`/api/comment/edit/${commentId}`,{comment:commentValue})
    
  }

  const handleLike=async()=>{
     likeComment(`/api/comment/like/${commentId}`)

  }

  const handleDelete=()=>{
     deleteComment(`/api/comment/delete/${commentId}`)
  } 

  if(!commentId) return

  return (
    <div className="comment">
      <div className="my-6  w-full items-center outline-dashed p-3 outline-offset-8 outline-text-accent ">
        <div className=" w-full flex items-center gap-3   ">
          <div className="text-center ">
            {isAuthenticated && (
              <Like onClick={handleLike} className={`w-6 cursor-pointer h-6 fill-none transition-colors ${!hasUserLiked ? 'stroke-text-accent fill-none hover:stroke-none hover:fill-red-400' : 'stroke-none fill-red-400 hover:stroke-text-accent hover:fill-none'}  `} />
            )}
            {totalLikes ? (
              <p className="mt-[4px] text-xs">{totalLikes}</p>
            ) : null}
          </div>

          <textarea onBlur={handleOutsideClick} value={commentValue} onChange={(e)=>setCommentValue(e.target.value)} ref={textRef} readOnly={!isEdit} className="w-full h-full outline-none ">{comment}</textarea>
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
      ) : <Button onClick={handleEdit}>Edit</Button> : null}
    </div>
  );
};

export default Comment;
