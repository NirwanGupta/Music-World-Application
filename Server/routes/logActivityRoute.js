const { logActivity } = require(`../controllers/logActivitiesController`);
const express = require(`express`);
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();

router.route(`/logActivity`).post(authenticateUser, logActivity);

module.exports = router;