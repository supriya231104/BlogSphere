import express from "express"
import {  createBlog, deleteBlog, getBlog, getBlogs, getBlogsByCreatorId, getDraftBlogs, getLikedBlogs, getLikedBlogsId, getSavedBlogs, getSavedBlogsDetailed, searchBlog, toggleLike, updateBlog } from "../controller/blogController.js"
import verifyUser from "../middleware/auth.js";

import { uploader } from "../utils/multer.js";
const router = express.Router()

router.get("/blogs/saved-blogs",verifyUser,getSavedBlogs)
router.get("/blogs/draft",verifyUser,getDraftBlogs)
router.get("/blogs/saved-blogs/details",verifyUser,getSavedBlogsDetailed)
router.get("/blogs", getBlogs);
router.get("/blogs/:id", getBlog);
router.get("/blogs/user/:creatorId", getBlogsByCreatorId);
router.post("/blogs",verifyUser,uploader.fields([{name:"image"},{name:"images"}]), createBlog);
router.patch("/blogs/:id",verifyUser,uploader.fields([{name:"image"},{name:"images"}]),updateBlog);
router.delete("/blogs/:id",verifyUser, deleteBlog);
router.post("/blogs/:id/likes",verifyUser,toggleLike)
router.get("/search-blog",searchBlog)
router.get("/liked-blogs",verifyUser,getLikedBlogsId)
router.get("/liked-blogs/:id",getLikedBlogs)


export default router 
