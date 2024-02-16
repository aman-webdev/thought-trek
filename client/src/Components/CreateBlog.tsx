import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Input } from ".";
import Dropzone, { useDropzone } from "react-dropzone";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useFetch from "../hooks/useFetch";
import { ClipLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
import {Blog} from "../interfaces/interface";

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
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      title: "",
      desc: "",
    },
  });
  const [imageFile, setImageFile] = useState<null | File>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [blogData,setBlogData] = useState<null | Blog>(null)
  const { blogSlug } = useParams();
  const {
    error: createError,
    loading: createLoading,
    data: createData,
    fetchData: createFetch,
  } = useFetch(blogSlug ? "PUT" : "POST");
  const {
    error: fetchBlogError,
    loading: fetchBlogLoading,
    data: fetchBlogData,
    fetchData: fetchBlog,
  } = useFetch("GET");

  const onDrop = useCallback(
    (acceptedFiles: [File]) => {
      setImageFile(acceptedFiles[0]);
      setImageUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [imageFile]
  );

  useEffect(() => {
    const fetchBlogFromSlug = async () => {
      if (!blogSlug) return;
      try {
        const blogUrl = `/api/blog?slug=${blogSlug}`;
        await fetchBlog(blogUrl);
      } catch (err) {}
    };
    fetchBlogFromSlug();
  }, [blogSlug]);

  useEffect(() => {
    if (!fetchBlogData) return;
    const { data } = fetchBlogData;
    if (!data) return;
    console.log(data, "Data");
    const { title, desc, body, image } = data["blogs"][0];
    setBlogData(data['blogs'][0])
    setValue("title", title);
    setValue("desc", desc);
    setText(body);
    setImageUrl(image);
  }, [fetchBlogData]);

  const { getRootProps, getInputProps } = useDropzone({
    //@ts-ignore
    onDrop,
  });

  const navigate = useNavigate()

  const handleCreateBlog = async (data: { title: string; desc: string }) => {
    if (createLoading) return;
    try {
      if (text.length < 20) {
        toast.error("Please enter minimum 20 characters");
        return;
      }
      const { title, desc } = data;
      const formData = new FormData();
      formData.append("title", title);
      formData.append("desc", desc);
      if (imageFile) formData.append("image", imageFile);
      formData.append("body", text);
      const apiUrl= !blogSlug || !blogData  ?  `/api/blog/create` : `/api/blog/edit/${blogData._id}`
      await createFetch(apiUrl, formData, true);

    } catch (err) {}
  };

  useEffect(() => {
    if (createError) toast.error(createError);
    if (createData) {
      const { message, data } = createData;
      toast.success(message);
      setText(""),
      setImageFile(null)
      setImageUrl('')
      setValue("title",'')
      setValue("desc",'')
      navigate("/")

    }
  }, [createError, createData]);

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

  const remoeSelectedImage = (e: any) => {
    e.preventDefault();
    setImageFile(null);
    setImageUrl("");
  };

  return (
    <div className="w-3/4 mx-auto py-8">
      <h1 className="font-display text-5xl text-text-accent tracking-wide mt-4 text-center">
        {blogSlug ? "Edit" : "Share"} your thought
      </h1>
      <textarea
        placeholder="Title"
        {...register("title")} 
        className="w-full rounded-md bg-transparent mt-8 text-5xl  outline-none font-display px-12 py-6"
      />
      {errors.title?.message ? (
        <p className="text-sm text-red-400 px-12">
          {errors.title.message.toString()}
        </p>
      ) : null}

      <textarea
        {...register("desc")}
        placeholder="Description"
        rows={3}
        className="w-full  rounded-md  mt-1 bg-transparent focus:outline-none text-2xl  px-12 py-6 "
      />
      {errors.desc?.message ? (
        <p className="text-sm text-red-400  px-12">
          {errors.desc.message.toString()}
        </p>
      ) : null}

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
          {imageUrl && (
            <div onClick={remoeSelectedImage} className="w-1/5 h-1/5 mx-auto">
              <img
                className="w-full h-full object-cover"
                src={imageUrl}
                alt=""
              />
            </div>
          )}
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
      <Button
        additionalStyles="block w-1/3 mx-auto my-4 bg-accent-light rounded-md text-text-accent text-md font-bold uppercase hover:opacity-80 "
        onClick={handleSubmit(handleCreateBlog)}
      >
        {createLoading ? <ClipLoader size={30} color="#3F3D56" /> : blogSlug ? "Edit" : "Create"}
      </Button>
    </div>
  );
};

export default BlogPage;
