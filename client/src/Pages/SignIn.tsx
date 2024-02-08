/// <reference types="vite-plugin-svgr/client" />
import { useForm } from "react-hook-form"
import { Button, Input, Text } from "../Components";
import SignIn from "../assets/signin.svg?react";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import toast, { Toaster } from 'react-hot-toast';
import { BarLoader } from "react-spinners";
import { useContext, useEffect } from "react";
import UserContext from "../context/userContext";
import GoogleAuth from "../Components/GoogleAuth";

const SignUp = () => {

  const { handleSubmit, register, formState: { errors ,isSubmitSuccessful},reset,} = useForm({
    defaultValues:{
      usernameOrEmail:"",
      password:""
    }
  })

  const {setUser,user} = useContext(UserContext)


  const navigate = useNavigate()

  const {data,error,loading,fetchData} = useFetch("POST")

  useEffect(()=>{
    if(!isSubmitSuccessful) return;
    reset({usernameOrEmail:"",password:""})
  },[isSubmitSuccessful])

  const handleFormSubmit=async(data:any) =>{
    try{
      await fetchData('api/auth/signin',data)
      reset(  )

    }
    catch(err:any){
      toast.error(err?.message)
    }
     
    
  }

  useEffect(()=>{
    if(!data) return
    const {message,data:userinfo} = data;
    toast.success(message)
    setUser({user:userinfo,isAuthenticated:true}) 
    localStorage.setItem("user",JSON.stringify({user:userinfo,isAuthenticated:true}))
    navigate("/")
  },[data])

  useEffect(()=>{
    if(user.isAuthenticated) navigate("/")
  },[user])

  return (
    <div className="h-screen flex flex-col justify-center ">
     
       <div className="w-full flex gap-12 items-center ">
      <SignIn className="w-1/2 h-full" />
      <div className="w-1/2 my-6">
        <div className="w-full">
          <Text text="Username or Email" additionalClass="text-xl text-text-accent" />
          <Input type="text" name="usernameOrEmail" register={register} validation={{required:true}}  additionalStyles="w-2/3 mt-3 px-2 py-2 rounded-md outline outline-accent-light focus:outline-accent outline-[1px]" />
          {errors.usernameOrEmail?.message ? <p className="text-sm text-red-400 my-1">{errors.usernameOrEmail.message.toString()}</p> : null}

        </div>
        <div className="w-full my-6">
          <Text text="Password" additionalClass="text-xl text-text-accent" />
          <Input name="password" register={register} validation={{required:true}}  type="password" additionalStyles="w-2/3 mt-3 px-2 py-2 rounded-md outline outline-accent-light focus:outline-accent outline-[1px]" />
        {errors.password?.message ? <p className="text-sm text-red-400 my-1">{errors.password.message.toString()}</p> : null}

        </div>
        <div className="flex  items-center justify-center gap-2 w-2/3">
        { loading ? <BarLoader width={'100%'} height={8} color="#F9E197"  /> : <Button onClick={handleSubmit(handleFormSubmit)} additionalStyles='rounded-none text-gray-600 block w-full ' >Sign In</Button>}
        </div>
        <div className="w-2/3 mt-3">
        <Button children="Sign In As Guest"additionalStyles='rounded-none text-gray-600 block w-full bg-text-accent text-white transition ease-in=out' />
        <GoogleAuth/>
        <p className="text-sm mt-4">Don't have an account? <Link className="text-text-accent" to={'/sign-up'}>Sign Up</Link></p>
        </div>
      </div>
    </div>

    </div>
   
  );
};

export default SignUp;
