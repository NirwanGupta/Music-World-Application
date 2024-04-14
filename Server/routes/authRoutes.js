const express = require(`express`);
const router = express.Router();
const { authenticateUser } = require(`../middleware/authentication`);
const {
  login,
  register,
  forgotPassword,
  resetPassword,
  logout,
  verifyEmail,
} = require(`../controllers/authController`);

router.route(`/register`).post(register);
router.route(`/login`).post(login);
router.route(`/logout`).delete(authenticateUser, logout);
router.route(`/verify-email`).post(verifyEmail);
router.route(`/forgot-password`).post(forgotPassword);
router.route(`/reset-password`).post(resetPassword);

module.exports = router;