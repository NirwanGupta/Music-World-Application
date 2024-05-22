const express = require(`express`);
const router = express.Router();
const {
    authenticateUser,
    authorizePermissions,
} = require(`../middleware/authentication`);

const {
    getAllArtists,
    getSingleArtist,
    addArtist,
    updateArtist,
    deleteArtist,
    uploadImages,
    likeSinger
} = require(`../controllers/singerController`);

router.route(`/`).get(authenticateUser, getAllArtists);
router.route(`/addArtist`).post(authenticateUser, addArtist);
router.route(`/update`).patch([authenticateUser], updateArtist);
router.route(`/delete`).delete([authenticateUser], deleteArtist);
router.route(`/upload`).post([authenticateUser], uploadImages);
router.route("/like/:id").post([authenticateUser], likeSinger);
router.route(`/:id`).get(authenticateUser, getSingleArtist);

module.exports = router;