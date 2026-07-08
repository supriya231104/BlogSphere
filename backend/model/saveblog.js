import mongoose from "mongoose";


const saveBlogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog",
        required: true
    }

})

saveBlogSchema.index({user:1,blog:1},{unique:true})



const saveblog = mongoose.model("saveblog", saveBlogSchema)
export default saveblog