import express from "express"
import { createUser, deleteUser, followUser, getFollowings, getFollowingsDetails, getParticularUser, getUsers, getUserWithUserName, googleAuth, Login, partialUpdateUser, saveBlog, updateUser, verifyuser } from "../controller/userController.js";
import verifyUser from "../middleware/auth.js";
import { createUserForTest } from "../controller/userController.js";
import { uploader } from "../utils/multer.js";


const router = express.Router()



router.get("/users", getUsers);
router.get("/users/:id", getParticularUser);

router.post("/users/createTestUser",createUserForTest)
router.post("/users/signup", createUser);
router.post("/users/signin", Login);
// router.patch("/users/:id", verifyUser,partialUpdateUser);
router.put("/users/:id", verifyUser,uploader.single("image"),updateUser);
router.delete('/users/:id',verifyUser, deleteUser)
router.get('/verify/:verificationToken', verifyuser)
router.post("/google-auth",googleAuth)
router.patch("/save-blog/:blogId",verifyUser,saveBlog)
router.get("/blogs/follow/:followerId",verifyUser,getFollowings)
router.get("/blogs/follow/details/:followerId",getFollowingsDetails)
router.post("/blogs/follow/:followingId",verifyUser,followUser)
router.get("/users/profile/:username",getUserWithUserName)
export default router







