import errorHandler from "../utils/errorHandler.js"
import bcrypt from "bcryptjs"
import {uploadImage} from "../utils/initFirebase.js"
import User from "../models/user.model.js"

export const test =(req,res) => {
    res.json({message:"working"})
}

export const updateUser = async(req, res,next) => {
    try{

        if(req.user.id!==req.params.userId) return next(errorHandler(403,"Unauthorized access"))
        const {username,email,password,confirmPassword} = req.body;
        if(username && username.length<5) return next(errorHandler(400,"Username should have minimum 5 characters"))
        if(!username.match(/^[a-zA-Z0-9]+$/)) return next(errorHandler(400,"Username should only contain alphanumeric characters"))
        if(password && password.length<5) return next(errorHandler(400,"Password should have minimum 5 characters"))
        if(password!==confirmPassword) return next(errorHandler(400,"Password and confirm password do not match"))
        
        let updatedPassword, imageUrl
        if(password) updatedPassword = bcrypt.hashSync(password,10)
    
       
        if(req.file) {
            imageUrl = await uploadImage(req.file.path,req.file.originalname,req.file.mimetype)
        }

        const updatedData = {
            username,email,
            ...(updatedPassword && {password:updatedPassword}),
            ...(imageUrl && {profilePicture:imageUrl})
        }

        const updatedProfile = await User.findByIdAndUpdate(req.params.userId, updatedData,{new:true})
        if(!updatedProfile) next(errorHandler(400,"User not found"))
        delete updatedProfile._doc.password
        res.status(201).json({message:"Profile updated successfully",data:updatedProfile._doc})

    }catch(err){
        next(err)
    }
 
}

export const deleteUser=async(req,res,next)=>{
    try{
        if(req.params.userId!==req.user.id) return next(errorHandler(403,"Unauthorized access"))
        await User.findByIdAndDelete(req.params.userId)
        res.status(201).json({message:"User deleted successfully"})
    }
    catch(err){
        next(err)
    }
    
}

export const signoutUser=(req,res,next)=>{
    try{
        res.clearCookie("access_token").status(200).json({message:"User has been signed out"})
    }catch(err){
        next(err)
    }
}