import mongoose from "mongoose";

const Comment = new mongoose.Schema({
    comment:{
        type:String,
        required:true
    },
    _blogId : {
        type :mongoose.Types.ObjectId,
        required:true

    },
    _userId:{
        type:mongoose.Types.ObjectId,
        required:true
    },

    totalLikes : {
        type:Number,
        default:0
    }
   

},{timestamps:true})


export default mongoose.model("Comment", Comment)