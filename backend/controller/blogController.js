import blog from "../model/blog.js";
import user from "../model/user.js";

import valiDateId from "./validate.js";
import like from "../model/like.js";
import uniqid from 'uniqid'
import saveblog from "../model/saveblog.js"
import { uploadImageToCloudinary } from "../utils/uploadImageCloudinary.js";
import deleteImageFromCloudinary from "../utils/deleteImageFromCloudinary.js";
import path from "path";




async function toggleLike(req, res) {
    const userId = req.user;
    const blogId = req.params.id;

    if (!valiDateId(blogId)) {
        return res.status(400).json({ message: "Invalid blog id" });
    }

    const blogExists = await blog.findById(blogId);
    if (!blogExists) {
        return res.status(404).json({ message: "Blog not found" });
    }

    const deleted = await like.findOneAndDelete({
        user: userId,
        blog: blogId
    });

    if (deleted) {
        await blog.findByIdAndUpdate(blogId, { $inc: { likesCount: -1 } });

        return res.json({ message: "Unliked" });
    }

    await like.create({ user: userId, blog: blogId });
    await blog.findByIdAndUpdate(blogId, { $inc: { likesCount: 1 } });

    return res.json({ message: "Liked" });
}
async function createBlog(req, res, next) {

    const image = req?.files?.image?.[0]
  
    const images = req.files?.images

    if (!image) {
        return res.status(400).json({
            success: false,
            message: "Image is required"
        });
    }

    try {

        const { title, description, draft } = req.body
        const content = JSON.parse(req.body.content)
        const creator = req.user
        const tags = JSON.parse(req.body.tags)
     





        if (!title || !description || !content) {
            return res.status(400).json({
                success: false,
                message: "please fill all required fields"
            })
        }
        let imageIndex = 0
        for (let i = 0; i < content.blocks.length; i++) {
            const block = content.blocks[i];
            if (block.type === 'image') {
                const { secure_url, public_id } = await uploadImageToCloudinary(images[imageIndex++]?.buffer)

                block.data.file = {
                    url: secure_url,
                    imageId: public_id
                }
            }

        }
        const { secure_url, public_id } = await uploadImageToCloudinary(image.buffer)
        const customBlogId = title.toLowerCase().split(' ').join('-') + '-' + uniqid()
        // const customBlogId=title.toLowerCase()
        // 4️⃣ create blog
        const created_blog = await blog.create({
            title,
            description,
            draft,
            creator,
            image: secure_url,
            cloudinaryImageId: public_id,
            customBlogId,
            content,
            draft,
            tags

        })
        await user.findByIdAndUpdate(creator, { $addToSet: { blogs: created_blog._id } }, { runValidators: true })

        const msg = draft ? 'blog saved successfully' : "blog created successfully"
        return res.status(201).json({
            success: true,
            message: msg,
            blog: created_blog,

        })


    } catch (error) {
        next(error)
    }
}


async function getBlog(req, res, next) {
    try {
        let id = req.params.id;

        const userId = req.user


        const desired_blog = await blog.findOne({ customBlogId: id }).populate('creator')
        let isLiked=false
        if (userId) {
            
             isLiked = await like.exists({ user: userId, blog: desired_blog._id })
        }

        if (!desired_blog) {
            return res.status(404).json({
                success: false,
                message: "blog doesnt exists"
            })
        }



        else {
            return res.status(200).json({
                success: true,
                message: "blog is fetched g",
                blog: { desired_blog, isLiked: !!isLiked }
            })
        }
    } catch (error) {
        next(`${error.message}`)
    }

}
async function getBlogs(req, res, next) {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const skip = (page - 1) * limit
    
    // page=1 ,limit=5 skip =0 !((skip+(page*limit))<=countblogs )then only well stop pagination 
    try {


        const total_blogs = await blog.countDocuments({ draft: false })
        const blogs = await blog
            .find({ draft: false })
            .populate("creator")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,
            message: "Blogs fetched successfully ",
            blogs: blogs,
            hasMore: (limit + skip) < total_blogs
        })


    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
async function getBlogsByCreatorId(req, res, next) {
    try {

        const { creatorId } = req.params

        const blogs = await blog.find({ creator: creatorId, draft: false }).populate('creator')

        return res.status(200).json({
            success: true,
            message: "Blogs fetched successfully ",
            blogs
        })


    } catch (error) {


        next("Something broke while fetching blogs")
    }
}

async function updateBlog(req, res, next) {
    try {
        const creator = req.user
        const { id } = req.params

        const { title, description, draft } = req.body
        const image = req.files.image?.[0]
        const images = req.files.images
        const content = JSON.parse(req.body.content)
        const existingImages = JSON.parse(req.body.existingImages)
        const tags = JSON.parse(req.body.tags)



        let req_blog = await blog.findOne({ customBlogId: id })
        if (!req_blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
       

        if (!(creator == req_blog.creator)) {
            return res.status(403).json({
                success: false,
                message: "you're not allowed to change this blog"
            })



        }
        const imagesToDelete = req_blog?.content?.blocks?.filter((block) => block.type === 'image').filter((block) => {
            return !existingImages?.some(({ url }) => {
                return url === block?.data?.file?.url
            })
        }).map((block) => {
            return block?.data?.file?.imageId
        })

        if (imagesToDelete?.length > 0) {
            await Promise.all(
                imagesToDelete.map((id) => deleteImageFromCloudinary(id))
            )

        }
        if (images) {
            let imageIndex = 0
            for (let i = 0; i < content.blocks.length; i++) {
                const block = content.blocks[i];
                if (block.type === 'image' && block.data?.file?.image) {
                    const { secure_url, public_id } = await uploadImageToCloudinary(images[imageIndex++]?.buffer)

                    block.data.file = {
                        url: secure_url,
                        imageId: public_id
                    }
                }
            }

        }
        const customBlogId = title.toLowerCase().split(' ').join('-') + '-' + uniqid()
        let secure_url = undefined;
        let public_id = undefined;
        if (image) {
            let previousImageId = req_blog.cloudinaryImageId
            await deleteImageFromCloudinary(previousImageId)
            let obj = await uploadImageToCloudinary(image?.buffer)
            secure_url = obj.secure_url
            public_id = obj.public_id


        }
        let updated_blog = await req_blog.updateOne({ title, description, image: secure_url, customBlogId, cloudinaryImageId: public_id, content, tags, draft })

        const msg = draft ? 'blog saved successfully' : "blog updated succesfully"
        return res.status(200).json({
            success: true,
            message: msg,

        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message

        })

    }

}
async function deleteBlog(req, res, next) {
    try {
        let id = req.params.id;
        let creator = req.user

        let isvalid = valiDateId(id)
        if (!isvalid) {
            return res.status(400).json({
                success: false,
                message: "id is not valid"
            })

        }
        const req_blog = await blog.findById(id)
        if (!req_blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
        if (!req_blog.creator.equals(creator)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this blog"
            });
        }

        const del_blog = await blog.findByIdAndDelete(id)
        const public_id = del_blog.cloudinaryImageId
        await deleteImageFromCloudinary(public_id)


        const updated_User_Blogs = await user.findByIdAndUpdate(creator, { $pull: { blogs: id } })

        return res.status(200).json({
            success: true,
            message: "deleted blog ",
            blog: del_blog
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,

        })
    }





}
async function getSavedBlogs(req, res, next) {

    try {

        let userId = req.user

        if (!valiDateId(userId)) {
            return res.status(400).json({
                success: false,
                message: "Id is not valid"

            })

        }
        let savedBlogs = await saveblog.find({ user: userId }).select("blog")

        return res.status(200).json({
            success: true,
            message: "Feteched saved blogs succesfully",
            blogs: savedBlogs

        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `${error.message}`,


        })

    }






}
async function getSavedBlogsDetailed(req, res, next) {
    

    try {
        let userId = req.user
       

        if (!valiDateId(userId)) {
            return res.status(400).json({
                success: false,
                message: "Id is not valid"

            })

        }
        let savedBlogs = await saveblog.find({ user: userId }).populate({
            path:'blog',
            populate:{
                path:'creator'

            }
        })
        const formattedBlogs = savedBlogs?.map(item => item.blog);

        return res.status(200).json({
            success: true,
            message: "Feteched saved blogs succesfully",
            blogs: formattedBlogs

        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `${error.message}`,


        })

    }

}
async function getDraftBlogs(req, res, next) {

    try {
        let userId = req.user
      

        if (!valiDateId(userId)) {
            return res.status(400).json({
                success: false,
                message: "Id is not valid"

            })

        }
        let blogs = await blog.find({ creator: userId,draft:true }).populate('creator')
       

        return res.status(200).json({
            success: true,
            message: "Feteched saved blogs succesfully",
            blogs

        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `${error.message}`,


        })

    }






}


async function searchBlog(req, res, next) {

    const { searchQuery: search, tag } = req.query
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const skip = (page - 1) * limit
    let query
    if (search) {
        query = {
            draft: false,
            $or: [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ]
        }

    }
    else if (tag) {
        query = { tags: tag }

    }

    const total_blogs = await blog.countDocuments(query)
    // or operator actually checks if even one condtion is satisfied returns document and or operator accepts array of conditions to be checked and conditions in mongodb are shown in {} syntax ,$regex ,$options are in built function in mongodb 
    const blogs = await blog.find(query).populate('creator').sort({ createdAt: -1 }).skip(skip).limit(limit)
    const hasMore = (skip + limit) < total_blogs
    if (blogs.length == 0) {


        return res.status(200).json({
            success: false,
            hasMore,

            message: "No results found.Try searching with diffrent key words."
        })

    }

    return res.status(200).json({
        success: true,
        message: "Search succesfull",
        blogs,
        hasMore
    })

}

async function getLikedBlogsId(req,res) {

    const id=req.user


    try {
        if (!valiDateId(id)) {
            return res.status(404).json({
                success:false,
                message:"Id is not valid"
            })
            
        }
        const Liked_blogs=await like.find({user:id}).select('blog')
        const blogs=Liked_blogs?.map((one)=>{
            return one?.blog
        })
      
        return res.status(200).json({
            success:true,
            blogs,
            message:"Fetched liked blog ids successfully"

        })



    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
    
}

async function getLikedBlogs(req,res,next) {

    const {id}=req.params

    try {
        if (!valiDateId(id)) {
            return res.status(404).json({
                success:false,
                message:"Id is not valid"
            })
            
        }
        const Liked_blogs=await like.find({user:id}).select('blog').populate({
            path:'blog',
            populate:{
                path:'creator'
            }
        })
        const blogs=Liked_blogs?.map((one)=>{
            return one?.blog
        })
        
        return res.status(200).json({
            success:true,
            blogs,
            message:"Fetched liked blog successfully"

        })



    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
    
}
export {getLikedBlogsId, createBlog,getSavedBlogsDetailed,getLikedBlogs, getDraftBlogs,searchBlog, getBlog, getBlogsByCreatorId, getBlogs, updateBlog, deleteBlog, toggleLike, getSavedBlogs }

