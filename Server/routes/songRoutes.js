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
  likeSong,
  songsWRTmood,
  respondToQuestion,
  actionOnSong,
} = require(`../controllers/songController`);

const recommendations = require(`../controllers/recommendationController`);

router.route(`/recommendations`).get(authenticateUser, recommendations);
router.route(`/action/:id`).post([authenticateUser], actionOnSong);
router.route(`/`).get(authenticateUser, getAllSongs);
router.route(`/addSong`).post(authenticateUser, addSong);
router.route(`/uploadSong`).post(authenticateUser, audioUpload);
router.route(`/updateSong/:id`).patch([authenticateUser], updateSong);
router.route(`/deleteSong/:id`).delete([authenticateUser], deleteSong);
router.route(`/like/:id`).post([authenticateUser], likeSong);
router.route(`/mood`).get([authenticateUser], songsWRTmood);
router.route(`/askQuestion`).get([authenticateUser], respondToQuestion);
router.route(`/:id`).get(authenticateUser, getSingleSong);

module.exports = router;