const express = require(`express`);
const router = express.Router();
const { authenticateUser, authorizePermissions } = require(`../middleware/authentication`);

const {
  getAllSongs,
  getSingleSong,
  addSong,
  updateSong,
  deleteSong,
  audioUpload,
} = require(`../controllers/songController`);

router.route(`/`).get(authenticateUser, getAllSongs);
router.route(`/addSong`).post(authenticateUser, addSong);
router.route(`/uploadSong`).post(authenticateUser, audioUpload);
router.route(`/updateSong/:id`).patch([authenticateUser], updateSong);
router.route(`/deleteSong/:id`).delete([authenticateUser], deleteSong);
router.route(`/:id`).get(authenticateUser, getSingleSong);

module.exports = router;