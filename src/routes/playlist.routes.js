import { Router } from 'express';
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
    .post(createPlaylist)
    .get(getUserPlaylists); 
// Ek specific playlist ko get, update, ya delete karna
router.route("/:playlistId")
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist);

// URL: /api/v1/playlists/add/:playlistId/:videoId
router.route("/add/:playlistId/:videoId").patch(addVideoToPlaylist);
router.route("/remove/:playlistId/:videoId").patch(removeVideoFromPlaylist);

export default router;