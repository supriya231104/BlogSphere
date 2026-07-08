import blog from "../model/blog.js";
import comment from "../model/comment.js";
import valiDateId from "./validate.js";

async function commentBlog(req, res, next) {
    try {
        let userId = req.user
        let blogId = req.params.blogId
        let { comment: commentText } = req.body


        if (!(valiDateId(blogId))) {
            return res.status(400).json({
                success: false,
                message: "id is not valid"
            })

        }
        else if (!commentText) {
            return res.status(400).json({
                success: false,
                message: "comment should not be empty"
            })

        }
        const req_blog = await blog.findById(blogId)
        if (!req_blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }


        const new_comment = await comment.create({
            user: userId,
            blog: blogId,
            comment: commentText
        }).then((comment) => {
            return comment.populate({
                path: 'user',
                
            })
        })
        await blog.findByIdAndUpdate(blogId, { $inc: { commentCount: 1 } })

        return res.status(200).json({
            success: true,
            message: "commented  the blog ",
            comment: new_comment

        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,


        });

    }












}
async function getComments(req, res) {
    try {
        const blogId = req.params.blogId
        const userId = req.user


        if (!valiDateId(blogId)) {
            return res.status(400).json({ success: false, message: "Invalid blog id" });
        }

        const blogExists = await blog.findById(blogId);
        if (!blogExists) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        const comments = await comment.find({ blog: blogId, parentComment: null }).populate('user').sort({ createdAt: -1 })
        // return res.status(200).json({
        //     comments
        // })
        const updated_comments = comments.map((c) => {

            const obj = c.toObject()

            const isLiked = c?.likes?.some((likeUserId) => {
                return likeUserId?._id.toString() === userId

            })


            return { ...obj, isOwner: obj.user?._id.toString() === userId, isLiked }
        })

        return res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            comments: updated_comments
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `${error.message}`
        })
    }








}
async function getReplies(req, res) {
    try {
        const { blogId, commentId } = req.params
            ;

        const userId = req.user


        if (!valiDateId(blogId) || !valiDateId(commentId)) {
            return res.status(400).json({ success: false, message: "Invalid  id" });
        }

        const blogExists = await blog.findById(blogId);
        if (!blogExists) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        const req_comment = await comment.findById(commentId)
        if (!req_comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });

        }
        const comments = await comment.find({ blog: blogId, parentComment: commentId }).populate('user').sort({ createdAt: 1 })

        const updated_comments = comments.map((c) => {

            const obj = c.toObject()

            const isLiked = c.likes.some((likeUserId) => {
                return likeUserId._id.toString() === userId

            })

            return { ...obj, isOwner: obj.user._id.toString() === userId, isLiked }
        })

        return res.status(200).json({
            success: true,
            message: "Replies fetched successfully",
            comments: updated_comments
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }








}

async function updateComment(req, res, next) {
    try {
        let userId = req.user
        let blogId = req.params.blogId
        let commentId = req.params.commentId
        let { comment: commentText } = req.body


        if (!(valiDateId(blogId)) || !(valiDateId(commentId))) {
            return res.status(400).json({
                success: false,
                message: "id is not valid"
            })

        }


        const req_comm = await comment.findOne({ _id: commentId, blog: blogId })

        if (!req_comm) {
            return res.status(404).json({
                success: false,
                message: "comment not found"
            });
        }

        let isAllow = (req_comm.user.toString() === userId)
        if (isAllow) {
            let updated_comment = await comment.findByIdAndUpdate(commentId, { comment: commentText }, { new: true })
            return res.status(200).json({
                success: true,
                message: "comment updated  successfully ",
                comment: updated_comment

            });
        }

        return res.status(403).json({
            success: false,
            message: "not authorized to update this comment ",

        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,


        });

    }



}
async function likeComment(req, res, next) {
    try {
        let blogId = req.params.blogId
        let userId = req.user
        let commentId = req.params.commentId

        if (!(valiDateId(blogId)) || !(valiDateId(commentId))) {
            return res.status(400).json({
                success: false,
                message: "id is not valid"
            })

        }
        const req_comm = await comment.findOne({ _id: commentId, blog: blogId })
        if (!req_comm) {
            return res.status(404).json({
                success: false,
                message: "comment not found"
            });
        }
        let likes = req_comm.likes

        const isLiked = likes.some((oneId) => oneId.equals(userId))
        if (isLiked) {

            await comment.findByIdAndUpdate(commentId, { $pull: { likes: userId } })


            return res.status(200).json({
                success: true,
                message: "disliked comment "
            });



        }
        else {
            await comment.findByIdAndUpdate(commentId, { $push: { likes: userId } })
            return res.status(200).json({
                success: true,
                message: "liked comment "
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,


        });
    }

}

async function createNestedComments(req, res, next) {
    try {
        const userId = req.user
        const { blogId, commentId } = req.params
        const { reply } = req.body
        if (!(valiDateId(blogId)) || !(valiDateId(commentId))) {
            return res.status(400).json({
                success: false,
                message: "id is not valid"
            })

        }
        if (!reply?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment should not be empty"
            })

        }
        const req_comm = await comment.findOne({ _id: commentId, blog: blogId })
        if (!req_comm) {
            return res.status(404).json({
                success: false,
                message: "comment not found"
            });
        }
        let createdReply = await comment.create({
            user: userId,
            blog: blogId,
            comment: reply,
            parentComment: commentId
        })
        await createdReply.populate({ path: 'user' })
        await comment.findByIdAndUpdate(commentId, { $inc: { replyCount: 1 } })
        return res.status(201).json({
            success: true,
            message: "comment created successfully",
            comment: createdReply
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,


        });

    }

    // id validation
    // payload validation
    // resource validation
    // relationship validation whether owner or not 
    // db query
    // response



}

async function collectCommentIds(commentId, ids = []) {
    ids.push(commentId);

    const replies = await comment.find({
        parentComment: commentId
    });

    for (const reply of replies) {
        await collectCommentIds(reply._id, ids);
    }

    return ids;
}
async function deleteNestedComment(req, res, next) {
    try {
        const userId = req.user
        const { blogId, commentId } = req.params

        if (!(valiDateId(blogId)) || !(valiDateId(commentId))) {
            return res.status(400).json({
                success: false,
                message: "id is not valid"
            })

        }

        const req_comm = await comment.findOne({ _id: commentId, blog: blogId })
        if (!req_comm) {
            return res.status(404).json({
                success: false,
                message: "comment not found"
            });
        }
        const { parentComment } = req_comm
        const { creator: author } = await blog.findById(blogId).select('creator')
        if (!(req_comm?.user.toString() === userId) && !(author.toString() === userId)) {
            return res.status(403).json({
                success: false,
                message: "not authorized to delete this comment ",
            });
        }
        const result = await collectCommentIds(commentId);
        await comment.deleteMany({_id:{$in:result}})
        if (parentComment) {
            
            await comment.findByIdAndUpdate(parentComment, { $inc: { replyCount: -1 } })
        }
        else {
            // deleting a top-level comment
            await blog.findByIdAndUpdate(blogId, {
                $inc: { commentCount: -1 }
            });
        }
        return res.status(200).json({
            success: true,
            message: "comment deleted successfully",
            comment: result
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,


        });

    }

    // id validation
    // payload validation
    // resource validation
    // relationship validation whether owner or not 
    // db query
    // response



}
export { commentBlog, updateComment, getComments, likeComment, createNestedComments, deleteNestedComment, getReplies }
