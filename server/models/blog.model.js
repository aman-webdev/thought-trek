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
        type:String,
        default:"https://firebasestorage.googleapis.com/v0/b/mern-blog-7448e.appspot.com/o/noblogimg.svg?alt=media&token=072c2a59-8e34-4978-8fd1-7f48c0de15be"
    },
    categories:{
        type:[String]
    }
},{timestamps:true})

export default mongoose.model("Blog",blogSchema)