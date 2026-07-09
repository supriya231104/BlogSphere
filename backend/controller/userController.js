import mongoose from "mongoose";
import user from "../model/user.js";
import valiDateId from "./validate.js";
import bcrypt from "bcrypt"
import { genrateJwtToken, verifyJwtToken } from "../utils/genrateToken.js";
import admin from "firebase-admin"
import { getAuth } from "firebase-admin/auth"
import { sendVerificationMail } from "../utils/sendEmail.js";
import uniqid from 'uniqid'
import randomUUID from 'short-unique-id'
import ShortUniqueId from "short-unique-id";
import blog from "../model/blog.js";
import saveblog from "../model/saveblog.js";
import follow from "../model/follow.js";
import deleteImageFromCloudinary from "../utils/deleteImageFromCloudinary.js";
import { uploadImageToCloudinary } from "../utils/uploadImageCloudinary.js";
import dotenv from 'dotenv'
dotenv.config()
try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({

        credential: admin.credential.cert(
            serviceAccount
        )
    });
    // console.log("Firebase Admin SDK successfully initialized!");
} catch (error) {
    // console.error("Firebase authentication failed...")

}

async function Login(req, res, next) {
    try {
        const { email, password } = req.body;
     


        if (!email || !password) {
            let val = !email ? "email" : "password";
            return res.status(400).json({
                success: false,
                message: `please fill ${val}`,
            });
        }


        // 🔥 findOne + password include
        const userExist = await user.findOne({ email }).select('+password');

        return res.status(400).json({
            success: false,
            message: "User not exist try to register first",
            usernotExist: true
        });
        const pass_verify = await bcrypt.compare(password, userExist.password);

        if (!pass_verify) {
            return res.status(400).json({
                success: false,
                message: "Wrong  password",
            });
        }

        if (!userExist) {
            return res.status(400).json({
                success: false,
                message: "Please register first or create account",
            });
        }
        else if (userExist?.isGoogleAuth) {
            return res.status(400).json({
                success: false,
                message: "This user is already registered with google. Try with google"
            })

        }
        else if (!userExist.verify) {
            return res.status(404).json({
                success: false,
                message: "Please verify your email",
            });
        }

        // 🔐 correct bcrypt usage


        const token = genrateJwtToken({
            email: userExist.email,
            id: userExist._id,
        });

        // password hide in response
        userExist.password = undefined;

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: userExist,
            token,
        });
    } catch (err) {
        next(err);
    }
}



async function getUsers(req, res, next) {
    try {
        let users = await user.find();

        return res.status(200).json({
            success: true,
            users: users,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: " error occured while fetching the user  ",
            error: err.message
        });
    }
}
async function getParticularUser(req, res, next) {
    try {
        let id = req.params.id;
        let isvalid = valiDateId(id)
        if (!isvalid) {

            return res.status(400).json({
                success: false,
                message: "id is not valid"
            })
        }
        let ans = await user.findById(id)
        if (!ans) {
            return res.status(404).json({
                success: false,
                message: "user not found",
            });
        }

        else {
            return res.status(200).json({
                success: true,
                message: "user is fetched",
                user: ans,
            });
        }

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: " error occured while fetching the user  ",
            error: err.message
        });
    }
}
async function createUser(req, res, next) {

    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            let val = !email ? "email" : !password ? "password" : "name";
            return res.status(400).json({
                success: false,
                message: `please fill  ${val}`,
            });
        }
        const checkIfUserExist = await user.exists({
            email
        })

        if (checkIfUserExist) {
            return res.status(400).json({
                success: false,
                message: "email already exists "

            });
        }
        else {

            const hashed_pass = await bcrypt.hash(password, 10)
            const uid = new ShortUniqueId({ length: 4 });
            const userName = email.split('@')[0] + uid.rnd()

            const newUser = await user.create({
                name,
                password: hashed_pass,
                email,
                userName
            })

            const _user = await user.findById(newUser._id).select("-password")

            const verificationToken = genrateJwtToken({ email: _user.email, id: _user._id })
            // email logic 
            await sendVerificationMail(email, verificationToken)


            return res.status(200).json({
                success: true,
                message: "please check your email to verify your account",


            });

        }


    } catch (err) {

        return res.status(500).json({
            success: false,
            message: " error occured while creating the user  ",
            error: err.message
        });
    }
}
async function partialUpdateUser(req, res, next) {
    try {
        let id = req.params.id
        let isvalid = valiDateId(id)
        if (!isvalid) {

            return res.status(400).json({
                success: false,
                message: "id is not valid"
            })
        }
        let { email, name, password } = req.body
        let updatedUser = await user.findByIdAndUpdate(id, { email, password, name }, { runValidators: true, new: true });
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "user not found",
            });

        }
        else {

            return res.status(200).json({
                success: true,
                message: "user updated succesfully",
                user: updatedUser
            });
        }





    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "something failed while updating user",
            error: err.message
        });
    }
}
async function updateUser(req, res, next) {
    try {

        const { name, bio, userName, deleteProfilePic } = req.body
        const shouldDelete = deleteProfilePic === 'true'
        let id = req.params.id
        let userId = req.user
        const image = req.file

        let isvalid = valiDateId(id)
        if (!isvalid) {

            return res.status(400).json({
                success: false,
                message: "id is not valid"
            })
        }
        else if (id !== userId) {
            return res.status(400).json({
                success: false,
                message: "You are not allowed to update profile"
            })

        }
        let req_user = await user.findById(id)
        let profilePic, profilePicId
       
        if (shouldDelete) {

            if (req_user?.profilePicId) {
                await deleteImageFromCloudinary(req_user?.profilePicId)
            }
            req_user.profilePic = null
            req_user.profilePicId = null
        }
        if (image) {
          

            if (req_user?.profilePicId) {
                await deleteImageFromCloudinary(req_user?.profilePicId)
            }
            const res = await uploadImageToCloudinary(image?.buffer)

            profilePic = res?.secure_url
            profilePicId = res?.public_id

        }

        if (req_user?.userName !== userName) {

            let userWithNewUserName = await user.findOne({ userName: userName })

            if (userWithNewUserName) {
                return res.status(400).json({
                    success: false,
                    message: "Username already taken"
                })
            }

        }
        req_user.userName = userName
        req_user.bio = bio
        req_user.name = name
        if (profilePic && profilePicId) {
            req_user.profilePic = profilePic
            req_user.profilePicId = profilePicId
        }
        await req_user.save()
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: req_user
        })







    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "something failed while updating user",
            error: err.message
        });
    }
}
async function deleteUser(req, res) {
    try {
        let id = req.params.id;
        let isvalid = valiDateId(id)
        if (!isvalid) {

            return res.status(400).json({
                success: false,
                message: "id is not valid"
            })
        }
        let deletedUser = await user.findByIdAndDelete(id)
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "user not found",
            });

        }
        else {
            return res.status(200).json({
                success: true,
                message: "user deleted succesfully",
                user: deletedUser
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something failed while deleting user",
            error: err.message
        });
    }
}
async function verifyuser(req, res, next) {

    try {
        let { verificationToken } = req.params

        if (!verificationToken) {
            return res.status(400).json({ success: false, message: "Token is missing" });

        }

        let decoded;
        try {
            decoded = verifyJwtToken(verificationToken);
        } catch (err) {
            return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }
        const { id } = decoded;
        const userToVerify = await user.findById(id);
        if (!userToVerify) {
            return res.status(404).json({ success: false, message: "User not found" });


        }
        if (userToVerify.verify === true) {
            return res.status(200).json({ success: true, message: "User already verified" });
        }
        userToVerify.verify = true;
        await userToVerify.save();
        return res.status(200).json({ success: true, message: "User verified successfully" });



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something failed while verifying user",
            error: error.message
        });
    }



}
async function googleAuth(req, res, next) {
    try {
        const { accessToken } = req.body
        const response = await getAuth().verifyIdToken(accessToken)

        const { name, email, picture } = response
        const req_user = await user.findOne({ email })
        if (req_user) {

            if (req_user?.isGoogleAuth) {
                const token = genrateJwtToken({
                    email: req_user.email,
                    id: req_user._id,

                });
                return res.status(200).json({
                    success: true,
                    message: "Login successfull",
                    user: req_user,
                    token
                })


            }
            else {

                return res.status(400).json({
                    success: false,
                    message: "Please try login with form",

                })
            }

        }
        const uid = new ShortUniqueId({ length: 4 });
        const userName = email.split('@')[0] + uid.rnd()

        let newUser = await user.create({ name, email, isGoogleAuth: true, verify: true, userName, profilePic: picture })
        const token = genrateJwtToken({
            email: newUser.email,
            id: newUser._id,

        });
        return res.status(200).json({
            success: true,
            message: "Registration successfull",
            user: newUser,
            token
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something failed while authenticating user with google",
            error: error.message
        });

    }


}
async function saveBlog(req, res, next) {
    try {
        let userId = req.user
        let { blogId } = req.params
        if (!valiDateId(userId) || !valiDateId(blogId)) {
            return res.status(400).json({
                success: false,
                message: "Id not valid"
            })

        }

        let savedBlog = await saveblog.findOneAndDelete({ user: userId, blog: blogId })





        if (savedBlog) {

            return res.status(200).json({
                success: true,
                message: "Blog unsaved successfully",


            })
        }
        else {

            await saveblog.create({ user: userId, blog: blogId })
            return res.status(200).json({
                success: true,
                message: "Blog saved successfully",



            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something failed while authenticating user with google",
            error: error.message
        });

    }





}
async function followUser(req, res, next) {
    try {
        let followerId = req.user
        let { followingId } = req.params

        if (!valiDateId(followerId) || !valiDateId(followingId)) {
            return res.status(400).json({
                success: false,
                message: "Id not valid"
            })
        }

        else if (followerId === followingId) {
            return res.status(400).json({
                success: false,
                message: "You Cannot follow yourself"
            })
        }
        let connection = await follow.findOneAndDelete({ followerId, followingId })
        if (connection) {
            await user.findByIdAndUpdate(followingId, { $inc: { followerCount: -1 } })
            return res.status(200).json({
                success: true,
                message: "unfollowed",
                isFollowed: false
            })

        }
        else {
            await follow.create({ followerId, followingId })
            await user.findByIdAndUpdate(followingId, { $inc: { followerCount: 1 } })
            return res.status(200).json({
                success: true,
                message: "followed",
                isFollowed: true
            })
        }



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something failed while following a user",
            error: error.message
        });
    }

}
async function getFollowings(req, res, next) {


    try {
        let { followerId } = req.params



        if (!valiDateId(followerId)) {
            return res.status(400).json({
                success: false,
                message: "Id not valid"
            })
        }

        let follwings = await follow.find({ followerId }).select('followingId')
        return res.status(200).json({
            success: true,
            message: "Followings fetched successfully",
            follwings
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something failed while following a user",
            error: error.message
        });
    }

}
async function createUserForTest(req, res, next) {
    try {
        const { email, password, name, bio } = req.body;

        // 1. Basic Validation
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "Email, password, and name are required."
            });
        }

        // 2. Check if user already exists
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered."
            });
        }

        // 3. Generate unique username
        const uid = new ShortUniqueId({ length: 4 });
        let baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, "");
        let userName = `${baseUsername}${uid.rnd()}`;

        // Ensure username uniqueness
        let isUnique = false;
        while (!isUnique) {
            const check = await user.findOne({ userName });
            if (!check) isUnique = true;
            else userName = `${baseUsername}${uid.rnd()}`;
        }

        // 4. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Create new user
        const newUser = await user.create({
            name,
            email,
            password: hashedPassword,
            userName,
            bio: bio || "",
            verify: true // Set to true since you are skipping email verification
        });

        // 6. Return success (No email logic here)
        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                userName: newUser.userName
            }
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: "Internal server error during registration",
            error: err.message
        });
    }
};
async function getFollowingsDetails(req, res, next) {



    try {

        let { followerId } = req.params


        if (!valiDateId(followerId)) {
            return res.status(400).json({
                success: false,
                message: "Id not valid"
            })
        }

        let follwings = await follow.find({ followerId }).populate('followingId')
        return res.status(200).json({
            success: true,
            message: "Followings fetched successfully",
            follwings
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something failed while following a user",
            error: error.message
        });
    }

}

async function getUserWithUserName(req, res) {
    try {
        const { username } = req.params
        

        const req_user = await user.findOne({ userName: username })
       
        if (!req_user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })

        }
        return res.status(200).json({
            success: true,
            message: "User  found",
            user: req_user
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message,

        })
    }


}
export { getUsers, createUserForTest, getUserWithUserName, getFollowingsDetails, followUser, getParticularUser, verifyuser, createUser, partialUpdateUser, updateUser, deleteUser, Login, googleAuth, saveBlog, getFollowings }
