const express = require("express");
const router = express.Router();
const {
    createPlaylist,
    getAllPlaylist,
    getSinglePlaylist,
    GetCurrectUserPlaylists,
    deleteSongFromPlaylist,
    updatePlaylist,
    deletePlaylist,
    sharePlaylist,
} = require("../controllers/playlistController");
const { 
    authenticateUser, 
    authorizePermissions,
} = require(`../middleware/authentication`);

router.route("/newPlaylist").post([authenticateUser], createPlaylist);
router.route("/allPlaylists").get([authenticateUser], getAllPlaylist);
router.route("/currentUserPlaylists").get([authenticateUser], GetCurrectUserPlaylists);
router.route("/share/:id").get([authenticateUser], sharePlaylist);
router.route("/:id").patch([authenticateUser], updatePlaylist)
router.route("/:id").get([authenticateUser], getSinglePlaylist);
router.route("/:id").delete([authenticateUser], deletePlaylist);
router.route("/:id/:songId").delete([authenticateUser], deleteSongFromPlaylist);

module.exports = router;