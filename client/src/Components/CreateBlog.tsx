import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Input } from ".";
import Dropzone, { useDropzone } from "react-dropzone";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useFetch from "../hooks/useFetch";
import { ClipLoader } from "react-spinners";

const UploadIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M3 19H21V21H3V19ZM13 5.82843V17H11V5.82843L4.92893 11.8995L3.51472 10.4853L12 2L20.4853 10.4853L19.0711 11.8995L13 5.82843Z"></path>
  </svg>
);

const BlogPage = () => {
  const [text, setText] = useState("");
  const {register,formState:{errors},handleSubmit} = useForm({
    defaultValues:{
      title:"",
      desc:"",
      body:""
    }
  })
  const [imageFile,setImageFile] = useState<null | File>(null)
  const {error:createError,loading:createLoading,data:createData,fetchData:createFetch} = useFetch("POST")

  const onDrop = useCallback((acceptedFiles:[File]) => {
    setImageFile(acceptedFiles[0])
  }, [imageFile])


  const { getRootProps, getInputProps } = useDropzone({
  //@ts-ignore
    onDrop
  })

  const handleCreateBlog=async(data:{title:string,desc:string})=>{
    if(createLoading) return
    try{
      if(text.length<20) {
        toast.error("Please enter minimum 20 characters")
        return
      }
      const {title,desc} = data
      const formData = new FormData()
      formData.append("title",title)
      formData.append("desc",desc)
      if(imageFile)formData.append("image",imageFile)
      formData.append("body",text)
  
      await createFetch("/api/blog/create",formData,true)
    }catch(err){

    }
    
  }

  useEffect(()=>{
    if(createError) toast.error(createError)
    if(createData) {
      const {message,data} = createData
      toast.success(message)
    }
  },[createError,createData])

  
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, false] }],
        ["bold", "italic", "underline", "blockquote", "strike"],
        [{ font: [] }],
        [{ align: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link"],
        ["clean"],
      ],
    },
    clipboard: {
      matchVisual: true,
    },
  };

  const remoeSelectedImage=(e:any)=>{
      e.preventDefault()
      setImageFile(null)
  }




  return (
    <div className="w-3/4 mx-auto py-8">
      <h1 className="font-display text-5xl text-text-accent tracking-wide mt-4 text-center">
        Share your thought
      </h1>
      <Input
        type="text"
        placeholder="Title"
        name="title"
        register={register}
        validation={{required:{value:true,message:"Title is required"},minLength:{value:10,message:"Title Should have minimum 10 characters"},maxLength:{value:50,message:"Title Should have max 50 characters"}}}
        className="w-4/5 rounded-md bg-transparent mt-8 text-5xl  outline-none font-display px-12 py-6"
      />
          {errors.title?.message ? <p className="text-sm text-red-400 px-12">{errors.title.message.toString()}</p> : null}

      <Input
        type="text"
        name="desc"
        register={register}
        validation={{required:{value:true,message:"Description is required"},minLength:{value:10,message:"Description Should have minimum 10 characters"}, maxLength:{value:100,message:"Description Should have max 100 characters"}}}
        placeholder="Description"
        className="w-full  rounded-md  mt-1 bg-transparent focus:outline-none text-2xl  px-12 py-6 "
      />
      {errors.desc?.message ? <p className="text-sm text-red-400  px-12">{errors.desc.message.toString()}</p> : null}


     
          <section className="w-full mt-4 h-96 rounded-lg outline-dashed outline-text-accent outline-2 outline-offset-4 ">
           <div
              className="w-full h-full flex flex-col opacity-70 cursor-pointer hover:opacity-100 transition-opacity items-center justify-center font-display text-2xl"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <UploadIcon className="w-1/2 h-1/2" />
              <p className="opacity-50">
                Drag 'n' drop some files here, or click to select files
              </p>
            {imageFile&& <div onClick={remoeSelectedImage} className="w-1/5 h-1/5 mx-auto"><img className="w-full h-full object-cover" src={URL.createObjectURL(imageFile)} alt="" /></div>}

            </div> 
          </section>
   
      <div className="mt-8">
        <ReactQuill
          placeholder="Start Writing"
          modules={modules}
          theme="snow"
          className="block"
          value={text}
          onChange={setText}
        />
      </div>
     <Button additionalStyles="block w-1/3 mx-auto my-4 bg-accent-light rounded-md text-text-accent text-md font-bold uppercase hover:opacity-80 " onClick={handleSubmit(handleCreateBlog)} >{createLoading ? <ClipLoader size={30} color="#3F3D56" />:  "Create"}</Button>
    </div>
  );
};

export default BlogPage;
