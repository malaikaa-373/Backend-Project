import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    const owner = req.user?._id
    if (!name || !description) {
        throw new ApiError(400, "Name and Description is required")
    }

    const playList = await PlayList.create({
        name,
        description,
        owner
    })

    if (!playlist) {
        throw new ApiError(500, "Something went wrong while creating playlist")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, playList, "Playlist created successfully")
        );
})

const getUserPlaylist = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Can't get user Playlist")
    }

    const playList = await playList.find({ owner: userId })

    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "User playlists fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Can't get user Playlist by Id")
    }

    const playlist = await PlayList.findById({ playlistById })

    if (!playlist) {
        throw new ApiError(500, "Something went wrong while getting playlist by Id")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "User playlists by id  fetched successfully"))
})

const addVideoToPlayList = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, " Invalid playlist and video ID.")
    }

    const playList = await Playlist.findById(playlistId)
    const video = await Video.findById(videoId)

    if (!playList || !video) {
        throw new ApiError(404, "No video and Playlist found")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push: {
                videos: videoId,
            },
        },
        { new: true }
    )

    if (!updatedPlaylist) {
        throw new ApiError(500, "Failed to add video to playlist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedPlaylist, "Video added to playlist successfully")
        );

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, " Invalid playlist and video ID.")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You don't have permission to modify this playlist");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: {
                videos: videoId,
            },
        },
        { new: true }
    )

    if (!updatedPlaylist) {
        throw new ApiError(500, "Failed to remove video from playlist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully")
        );

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You do not have permission to delete this playlist")
    }

    await Playlist.findByIdAndDelete(playlistId)

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Playlist deleted successfully")
        )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You can't update this playlist")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description,
            },
        },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"))
})

export {
    createPlaylist,
    getPlaylistById,
    getUserPlaylist,
    addVideoToPlayList,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,

}

