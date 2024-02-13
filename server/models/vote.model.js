import mongoose from "mongoose"

const Vote = new mongoose.Schema({
    _userId :{
        type:mongoose.Types.ObjectId,
        required:true
    },
   
    
    _parentId : {
        type:mongoose.Types.ObjectId,
        required:true,
        refPath:"parentType"
    },
    parentType:{
        type:String,
        required:true,
        enum:['comment','blog']

    }
})

export default mongoose.model("Vote",Vote)