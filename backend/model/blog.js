import mongoose from "mongoose";



const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 100
    },
    customBlogId: {
        type: String,
        required: true,
        unique: true


    },
    description: {
        type: String,
        required: true,
    },
    content: {
        type: Object,
        required: true

    },
    draft: {
        type: Boolean,
        default: false
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    likesCount: {
        type: Number,
        default: 0,
        min:0


    },
    image: {
        required: true,
        type: String
    },
    cloudinaryImageId: {
        required: true,
        type: String
    },
    commentCount: {
        type: Number,
        default: 0


    },
    tags:{
        type:[String],
        default:[]
    }
  
}, { timestamps: true })



const blog = mongoose.model('blog', blogSchema)



export default blog