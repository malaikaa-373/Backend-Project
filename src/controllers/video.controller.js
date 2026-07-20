import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //todo: get all vds based on queries , sort , pagination
})

const publishVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    //todo: get video , upload on cloudniary , create video
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //todo:update video details like title , description , thumbnail
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //todo:delete vedio
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

const tooglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    tooglePublishStatus
}