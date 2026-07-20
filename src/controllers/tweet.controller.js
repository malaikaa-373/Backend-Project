import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body

    if (!content || content.trim() === "") {
        throw new ApiError(400, "No content found ")
    }

    const newTweet = await Tweet.create({
        content: content,
        owner: req.user._id
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, newTweet, "Tweet is added")
        )
})

const getUserTweets = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        {
            $unwind: "ownerDetails"
        },
        {
            $project:
            {
                content: 1,
                createdAt: 1,
                "ownerDetails.username": 1,
                "ownerDetails.avatar": 1
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ])
    return res
        .status(200)
        .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID")
    }

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(404, "Tweet isn't found")
    }

    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not allowed to update the tweet")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        { $set: { content: content } },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedTweet, "Tweet updated successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(404, "Tweet isn't found")
    }

    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete the tweet")
    }

    await Tweet.findByIdAndDelete(tweetId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Tweet updated successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
