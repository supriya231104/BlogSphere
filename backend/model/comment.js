import mongoose, { model } from "mongoose";




const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required:true
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog",
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user', // likes by users on particular comment
            required:true
            
        }
    ],
    parentComment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'comment',
        default:null
    },
    replyCount:{
        type:Number,
        default:0
    }
},{timestamps:true})



commentSchema.index({ user: 1, blog: 1 });
commentSchema.index({ blog: 1, parentComment:1 });
const comment = mongoose.model("comment",commentSchema)

export default comment