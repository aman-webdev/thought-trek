import mongoose from "mongoose"

const blogSchema = new mongoose.Schema({
    _userId : {
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    desc:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    categories:{
        type:[String]
    }
},{timestamps:true})

export default mongoose.model("Blog",blogSchema)