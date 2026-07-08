import express from 'express'
import verifyUser, { verifyUserOptional } from '../middleware/auth.js'
import { commentBlog, getComments, likeComment, updateComment ,createNestedComments, deleteNestedComment, getReplies} from '../controller/commentController.js'




const router=express.Router()




router.get('/blogs/:blogId/comments',verifyUserOptional,getComments)
router.post("/blogs/:blogId/comments",verifyUser,commentBlog)
router.post("/blogs/:blogId/comments/:commentId/like",verifyUser,likeComment)
router.delete("/blogs/:blogId/comments/:commentId/dislike",verifyUser,likeComment)
router.delete("/blogs/:blogId/comments/:commentId",verifyUser,deleteNestedComment)
router.patch("/blogs/:blogId/comments/:commentId",verifyUser,updateComment)
router.post("/blogs/:blogId/comments/:commentId/replies",verifyUser,createNestedComments)

router.get("/blogs/:blogId/comments/:commentId/replies",verifyUserOptional,getReplies)
export default router
