import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    select: false
  },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'blog' }],
  verify: {
    type: Boolean,
    default: false
  },
  isGoogleAuth: {
    type: Boolean,
    default: false

  },
  profilePic: {
    type: String,
    default: null
  },
  profilePicId: {
    type: String,
    default: null
  },
  userName: {
    type: String,
    require: true,
    unique: true
  },
  bio: {
    type: String
  },
  followerCount:{
    type:Number,
    default:0,
    min:0

  }
  
  


}, { timestamps: true })

const user = mongoose.model('user', userSchema)
export default user