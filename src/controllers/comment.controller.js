import { isValidObjectId } from "mongoose"
import { comment } from "../models/comment.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.body
    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Video ID is invalid")
    }
    const aggregate = comment.aggregate([
        {
            $match: {
                videoId: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "Users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        }
    ])
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };
    const comments = await comment.aggregatePaginate(aggregate, options);

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Videos Comments are here")
        )
})

const addComments = asyncHandler(async (req, res) => {
    const { content } = req.body

    if (!content || content.trim() === "") {
        throw new ApiError(400, "No content found ")
    }

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Video ID is invalid ")
    }

    const newComment = await Comment.create({
        content: content,
        video: videoId,
        owner: req.user._id
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, new Comment, "Comment is added")
        )
})

const updateComments = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body; 

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const comment = await Comment.findById(commentId); 

    if (!comment) {
        throw new ApiError(404, "Comment isn't found");
    }

    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not allowed to update the comment");
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $set: { content: content } },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
    );
});


const deleteComments = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
    const { content } = req.body; 

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const comment = await Comment.findById(commentId); 

    if (!comment) {
        throw new ApiError(404, "Comment isn't found");
    }

    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete the comment");
    }

    const deleteComment = await Comment.findByIdAndDelete(
        commentId,
        { $set: { content: content } },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, {commentId}, "Comment delete successfully")
    );
})

export {
    getVideoComments,
    addComments,
    updateComments,
    deleteComments
}