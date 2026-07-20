import mongoose from "mongoose";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toogleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id;

    const alreadyLike = await Like.findOne({ video: videoId, likedBy: userId });

    if (alreadyLike) {
        await Like.findByIdAndDelete(alreadyLike._id);
        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, "Like removed successfully"));
    }

    await Like.create({ video: videoId, likedBy: userId });
    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }, "Like added successfully"));
});

const toogleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user?._id;

    const alreadyLike = await Like.findOne({ comment: commentId, likedBy: userId });

    if (alreadyLike) {
        await Like.findByIdAndDelete(alreadyLike._id);
        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, "Comment Like removed successfully"));
    }

    await Like.create({ comment: commentId, likedBy: userId });
    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }, "Comment Like added successfully"));
});

const toogleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user?._id;

    const alreadyLike = await Like.findOne({ tweet: tweetId, likedBy: userId });

    if (alreadyLike) {
        await Like.findByIdAndDelete(alreadyLike._id);
        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, "Tweet Like removed successfully"));
    }

    await Like.create({ tweet: tweetId, likedBy: userId });
    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }, "Tweet Like added successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "likedVideoDetails"
            }
        },
        {
            $project: {
                videoTitle: { $first: "$likedVideoDetails.title" },
                thumbnail: { $first: "$likedVideoDetails.thumbnail" },
                owner: { $first: "$likedVideoDetails.owner" }
            }
        }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
});

export {
    toogleVideoLike,
    toogleCommentLike,
    toogleTweetLike,
    getLikedVideos
};