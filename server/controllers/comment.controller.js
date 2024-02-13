import {Comment,Vote,Blog} from "../models/index.js"
import errorHandler from "../utils/errorHandler.js";
import mongoose from "mongoose"

export const createComment = async(req,res,next)=>{
    try{

        const {id} = req.user;
        const {blogId,comment:content} = req.body;

        const comment =await new Comment({
            _blogId:blogId,
            comment:content,
            _userId:id
        }).save()

        return res.status(201).json({message:"Added comment successfully",data:comment})

    }catch(err){
        next(err);
    }
}

export const getBlogComments=async(req,res,next)=>{
    try{
        const {blogId} = req.params
        console.log(blogId)

        const result = await Blog.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(blogId) } },
            {
              $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: '_blogId',
                as: 'comments'
              }
            },
            {
              $lookup: {
                from: 'votes',
                localField: 'comments._id',
                foreignField: '_parentId',
                as: 'comments.votes'
              }
            }
          ])

          console.log(result,"Res")


        return res.status(200).json({data:""})


    }catch(err){
        next(err)
    }
}


export const likeComment = async(req, res, next) =>{
    try{
        const {commentId} = req.params;
        const {id} = req.user;

        const comment = await Comment.findOne({_id:commentId})

        if(!comment) return next(errorHandler(404,'Comment not found'))

        // check if user has already liked

        const hasUserLiked = await Vote.findOne({_userId:id,_parentId:commentId,parentType:"comment"})
        if(!hasUserLiked) {
            await Vote.create({_userId:id,_parentId:commentId,parentType:"comment"})
            await Comment.findByIdAndUpdate(comment._id,{totalLikes:comment.totalLikes + 1})
        } 
        else {  
            
           await Vote.findByIdAndDelete(hasUserLiked._id)
           await Comment.findByIdAndUpdate(comment._id,{totalLikes:comment.totalLikes - 1})
        }

        return res.status(200).json({message:"Success"})


    }catch(err){
        next(err)
    }
}

export const editComment = async(req,res,next)=>{
    try{
        const {commentId} = req.params;
        const {id} = req.user;
        const {comment:content} = req.body;

        const comment = await Comment.findOne({_id:commentId,_userId:id})
        if(!comment) return res.status(400).json({message:"Comment not found"});

       const newComm =  await Comment.findByIdAndUpdate(comment._id,{comment:content},{new:true})

        return res.status(200).json({message:"Comment updated successfully",data:newComm})
        
    }catch(err){
        next(err)
    }
}

export const deleteComment = async(req,res,next)=>{
    try{

        const {commentId} = req.params;
        const {id} = req.user;
        const commentExists = await Comment.findOne({_userId:id,_id:commentId})
        if(!commentExists) return next(errorHandler(400,"Comment not found"))

        await Vote.deleteMany({_parentId:commentExists._id,parentType:"comment"})

        await Comment.findOneAndDelete(commentExists._id)
        return res.status(200).json({message:"Comment deleted successfully"})

    }catch(err){
        next(err)
    }
}