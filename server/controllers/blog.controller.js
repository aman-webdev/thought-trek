import errorHandler from "../utils/errorHandler.js"
import { uploadImage } from "../utils/initFirebase.js";
import { v4 as uuidv4 } from 'uuid'
import Blog from "../models/blog.model.js"

export const create=async(req,res,next)=>{
    try{

        const {title,desc,body} = req.body;
        if(!title || !desc || !body) next(errorHandler(400,"Required Parameters not found"))

        const slug = `${uuidv4()}-${title.toLowerCase().split(" ").join("-").replace(/[^a-zA-Z0-9-]/g,'')}`
        let updatedUrl;
        if(req.file){
             updatedUrl = await uploadImage(req.file.path,req.file.originalname,req.file.mimetype)
        }

        const newBlogData = {
            title,desc,body,slug,
            ...(updatedUrl && {image:updatedUrl}),
            _userId:req.user.id
        }

        const data = await new Blog(newBlogData).save()
        return res.status(201).json({message:"Blog created successfully",data})

    }catch(err){
        next(err)
    }
}

export const getAllBlogs=async(req,res,next) =>{
    try{
        const blogs = await Blog.find({})
        return res.status(200).json({data:blogs})
    }catch(err){
        next(err)
    }
}