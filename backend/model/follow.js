import mongoose from "mongoose";


const followSchema = new mongoose.Schema({
    followingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    followerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }

})

followSchema.index({followerId:1,followingId:1},{unique:true})



const follow = mongoose.model("follow", followSchema)
export default follow