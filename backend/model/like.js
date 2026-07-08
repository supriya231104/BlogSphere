import mongoose, { model } from "mongoose";
const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog",
        required: true
    },
    showLikedBlogs:{
        type:Boolean,
        default:false

    }
}, { timestamps: true })



likeSchema.index({ user: 1, blog: 1 }, { unique: true });
const like = mongoose.model("like", likeSchema)

export default like