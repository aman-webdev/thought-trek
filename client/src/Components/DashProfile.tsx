/// <reference types="vite-plugin-svgr/client" />

import React, { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../context/userContext";
import Avatar from "../assets/user-avatar.svg?react";
import { Button, Input } from ".";
import { useForm } from "react-hook-form";
import useFetch from "../hooks/useFetch";
import toast from "react-hot-toast";
import { BarLoader } from "react-spinners";
import Modal from "react-modal"
import Throw from "../assets/throw.svg?react"
import { useNavigate } from "react-router-dom";
import useSignout from "../hooks/useSignout";



const DashProfile = () => {
  const {
    user: { user },
    setUser,
  } = useContext(UserContext);

  const navigate = useNavigate()
  

  const [imageFile,setImageFile] = useState<any>('')
  const [imgFIleUrl,setImgFileUrl] = useState('')
  const profileRef = useRef<HTMLInputElement>(null)
  const {data,error,loading,fetchData} = useFetch("PUT")
  const {data:deleteData,error:deleteError,loading:deleteLoading,fetchData:deleteFetch} = useFetch("DELETE")
  const {data:signoutData,loading:signoutLoading,error:signoutError,signoutUser} = useSignout()
  

  const [isDeleteModalOpen,setIsDeleteModalOpen] = useState(false)

  const {register,reset,formState:{errors},handleSubmit} = useForm({
    defaultValues:{
      username: user?.username || "", 
      password: user?.password || "",
      confirmPassword:user?.confirmPassword ||  "",
      email:user?.email || "",
    }
  })

  const handleUpdateProfile = async(data:any) => {
    (data)
    if(!user) return
    try{
      const {username,email,password,confirmPassword} = data;
      if(password!==confirmPassword){
        toast.error("Password and confirm password do not match")
        return
      }
     

      const formData = new FormData();
      Object.keys(data).forEach(key=>{
        if(key && data[key]) formData.append(key,data[key])
      })

      if(imageFile)
      formData.append('image',imageFile)

      await fetchData(`/api/user/update/${user._id}`,formData,true)

    }catch(err){
          
    }
    
  }

  useEffect(()=>{
    if(error)toast.error(error)
    if(data){
      const {data:userdata,message} = data;
      setUser({user:userdata , isAuthenticated:true})
      setImageFile('')
      setImgFileUrl('')
      reset(userdata)
      toast.success(message)
      localStorage.setItem("user",JSON.stringify({user:userdata,isAuthenticated:true}))
    }
  },[data,error])


  useEffect(()=>{

   
    if(!imageFile) return;
    const img = URL.createObjectURL(imageFile)
    setImgFileUrl(img)
  },[imageFile])


  const handleProfileImageClick = ()=>{
    if(!profileRef.current) return
    profileRef.current.click()
  }

  useEffect(()=>{
    if(deleteError) toast.error(deleteError)
  },[deleteError])

  const handleProfileDelete=async()=>{
    if(!user) return;
    try{
      await deleteFetch("/api/user/delete/"+user._id)
      toast.success("Profile deleted successfully")
      setUser({isAuthenticated:false,user:null})
      localStorage.setItem("user",JSON.stringify({isAuthenticated:false,user:null}))
      navigate("/sign-in")
    }catch(err:any){
      toast.error(err.message || "Something went wrong")
    }
  }

  const handleSignout = async() => {
    await signoutUser()
  }

  useEffect(()=>{
    if(signoutError) toast.error(signoutError)
  },[signoutError])

  return (
    <div className="w-full flex flex-col justify-center items-center ">
      <h1 className="font-display text-text-accent opacity-50 uppercase text-6xl tracking-wide text-center mt-12 font-bold">
        Welcome, <span className="text-black">{user.username}</span>
      </h1>

      <div className="w-48 mx-auto mt-12 relative  h-48  rounded-full cursor-pointer  border-accent-light border-4 transition ease-linear hover:opacity-50" onClick={handleProfileImageClick}>

        {user.profilePicture || imgFIleUrl ? (
          <img src={ imgFIleUrl || user.profilePicture} alt="" className="w-full h-full z-40 hover:opacity-50 rounded-full" />
        ) : (
          <Avatar className="w-full h-full" />
        )}
      <input  type='file' ref={profileRef}  name={imageFile?.name} onChange={(e)=>e.target.files ? setImageFile(e.target.files[0]) : setImageFile('')}    accept="image/*" className="text-xs mt-4 hidden" />

      </div>
      <div className="m-8 text-left w-1/3 mx-auto ">
            <Input register={register} name="username" placeholder="username" additionalStyles="w-full px-4 py-2 font-lg  rounded-md outline-1 outline outline-gray-200  outline-offset-2 "/>
            <Input register={register} name="email" placeholder="email" additionalStyles="w-full mt-4 px-4 py-2 font-lg rounded-md outline-1 outline outline-gray-200  outline-offset-2 "/>
            <Input register={register} name="password" placeholder="password" type="password" additionalStyles="w-full mt-4 px-4 py-2 font-lg rounded-md outline-1 outline outline-gray-200  outline-offset-2 "/>
            <Input placeholder="confirm password" name="confirmPassword" register={register} type="password" additionalStyles="w-full mt-4 px-4 py-2 font-lg rounded-md outline-1 outline outline-gray-200  outline-offset-2 "/>
           { loading ? <BarLoader width={'100%'} height={10} color="#3F3D56" className="mt-3"  /> : <Button onClick={handleSubmit(handleUpdateProfile)} className="w-full mt-8  py-3 rounded-lg bg-text-accent text-white">Update Profile</Button>}
      </div>
      <div className="w-1/3 mx-auto mt-4 text-sm flex justify-between items-center">
        <p onClick={()=>setIsDeleteModalOpen(true)} className="text-red-600 cursor-pointer">Delete Account</p>
        <p onClick={handleSignout} className="cursor-pointer">Sign Out</p>
      </div>
      <Modal ariaHideApp={false} style={{content:{width:"70%",height:"70%",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}}  shouldCloseOnEsc onRequestClose={()=>setIsDeleteModalOpen(!isDeleteModalOpen)} isOpen={isDeleteModalOpen} contentLabel="Delete Profile" >
          <div>
            <h2 className="font-display text-6xl uppercase my-12 text-center text-text-accent">Delete Profile?</h2>
            <Throw className='w-1/3 mx-auto h-1/3'/>
            <div className="mt-12 flex w-1/2 justify-between items-center mx-auto">
              <Button onClick={handleProfileDelete} className="bg-red-400  text-white px-8 py-2 rounded-md">Delete</Button>
              <Button onClick={()=>setIsDeleteModalOpen(!isDeleteModalOpen)} className="bg-none outline outline-accent px-8 py-2 rounded-md">Cancel</Button>

            </div>
          </div>
      </Modal>
    </div>
  );
};

export default DashProfile;
