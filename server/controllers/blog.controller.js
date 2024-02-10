import errorHandler from "../utils/errorHandler.js"
import { uploadImage } from "../utils/initFirebase.js";
import { v4 as uuidv4 } from 'uuid'
import Blog from "../models/blog.model.js"
import User from "../models/user.model.js"


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
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9 
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        let userId = req.query.userId
        if(req.query.username) {
            const user = await User.findOne({username:req.query.username})
            userId = user?._id
        }

        const blogs = await Blog.find({
            ...(req.query.userId && {_userId:req.query.userId}),
            ...(req.query.username && {_userId:userId}),

            ...(req.query.category && {$in:{category:req.query.category}}),
            ...(req.query.slug && {slug:req.query.slug}),
            ...(req.query.blogId && {_id:req.query.blogId}),
            ...(req.query.searchTerm && {
                $or: [
                    { 
                        title:{$regex : req.query.searchTerm ,$options:"1"}
                    },
                    { 
                        desc:{$regex : req.query.searchTerm ,$options:"1"}
                    }
                ]
            })
        }).sort({updatedAt : sortDirection}).skip(startIndex).limit(limit)

    
        const totalBlogs = await Blog.countDocuments();

        res.status(200).json({data:{blogs,totalBlogs}})

    }catch(err){
        next(err)
    }
}

export const deleteBlog=async(req,res,next)=>{
    try{

        const {blogId} = req.params;
        const {user} = req;
        const blog = await Blog.findOne({_id:blogId})
        if(!blog) return next(errorHandler(400,'Blog not found'))
        if(blog._userId.toString()!==user.id) next(errorHandler(401,'Unauthorized'))

        await Blog.findByIdAndDelete(blogId)
        res.status(201).json(
            {message:'Deleted Successfully'}
        )
    }catch(err){
        next(err)
    }
}

export const edit = async(req,res,next) =>{
    try{    

        const {blogId} = req.params;
        const {user}  = req;

        const blog = await Blog.findOne({_id:blogId})
        if(!blog) return next(errorHandler(400,'Blog not found'))
        if(blog._userId.toString()!==user.id) next(errorHandler(401,'Unauthorized'))

        const {title,desc,body} = req.body;
        let imageUrl;

        if(req.file) {
            imageUrl = await uploadImage(req.file.path,req.file.originalname,req.file.mimetype)
        }

        const updatedBlog = {
            title,desc,body,
            ...(imageUrl && {image:imageUrl})
        }

        const updated = await Blog.findByIdAndUpdate(blogId ,updatedBlog ,{new:true});
        return res.status(201).json({message:"Updated successfully",data:updated})

    }catch(err){
        next(err)
    }
}