/// <reference types="vite-plugin-svgr/client" />
import { useForm } from "react-hook-form"
import { Button, Input, Text } from "../Components";
import Signup from "../assets/signup.svg?react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import toast, { Toaster } from 'react-hot-toast';
import { BarLoader } from "react-spinners";
import { useContext, useEffect } from "react";
import GoogleAuth from "../Components/GoogleAuth";
import UserContext from "../context/userContext";

const SignUp = () => {

  const { handleSubmit, register, formState: { errors , isSubmitSuccessful },reset} = useForm({
    defaultValues:{
      username:"",
      email:"",
      password:""
    }
  })

  const {data,error,loading,fetchData} = useFetch("POST")
  const navigate = useNavigate()
  const {user} =useContext(UserContext)


  const handleFormSubmit=async(data:any) =>{
    try{
      await fetchData('api/auth/signup',data)
      toast.success("Signup Successfull")
    }
    catch(err:any){
      toast.error(err?.message)
    }
     
    
  }

  
  useEffect(()=>{
    if(!isSubmitSuccessful) return;
    reset({username:"",password:"",email:""})
    navigate("/sign-in")
  },[isSubmitSuccessful])

  useEffect(()=>{
    if(user?.isAuthenticated) navigate("/")
  },[user])


  return (
    <div className="h-screen flex flex-col justify-center ">
    
       <div className="w-full flex gap-12 items-center ">
      <Signup className="w-1/2 h-full" />
      <div className="w-1/2 my-6">
        <div className="w-full">
          <Text text="Username" additionalClass="text-xl text-text-accent" />
          <Input type="text" name="username" register={register} validation={{required:true,minLength:{value:5,message:" Username Should have minimum 5 characters"} }}  additionalStyles="w-2/3 mt-3 px-2 py-2 rounded-md outline outline-accent-light focus:outline-accent outline-[1px]" />
          {errors.username?.message ? <p className="text-sm text-red-400 my-1">{errors.username.message.toString()}</p> : null}

        </div>
        <div className="w-full my-6">
          <Text text="Email" additionalClass="text-xl text-text-accent" />
          <Input name="email" register={register} validation={{required:true,pattern: {value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,message:"Invalid Email"} }}  type="email" additionalStyles="w-2/3 mt-3 px-2 py-2 rounded-md outline outline-accent-light focus:outline-accent outline-[1px]" />
        {errors.email?.message ? <p className="text-sm text-red-400 my-1">{errors.email.message.toString()}</p> : null}

        </div>
        <div className="w-full my-6">
          <Text text="Password" additionalClass="text-xl text-text-accent" />
          <Input type="password" name="password" validation={{required:true,minLength:{value:5,message:"Password Should have minimum 5 characters"}}}   register={register} additionalStyles="w-2/3 mt-3 px-2 py-2 rounded-md outline outline-accent-light focus:outline-accent outline-[1px]" />
        {errors.password?.message ? <p className="text-sm text-red-400 my-1">{errors.password.message.toString()}</p> : null}

        </div>
        <div className="flex  items-center justify-center gap-2 w-2/3">
        { loading ? <BarLoader width={'100%'} height={8} color="#F9E197"  /> : <Button onClick={handleSubmit(handleFormSubmit)} additionalStyles='rounded-none text-gray-600 block w-full ' >Sign Up</Button>}
        </div>
        <div className="w-2/3 mt-3">
        <Button children="Sign In As Guest"additionalStyles='rounded-none text-gray-600 block w-full bg-text-accent text-white transition ease-in=out' />
        <GoogleAuth/>
        <p className="text-sm mt-4">Already have an Account? <Link className="text-text-accent" to={'/sign-in'}>Sign In</Link></p>
        </div>
      </div>
    </div>
    </div>
   
  );
};

export default SignUp;
