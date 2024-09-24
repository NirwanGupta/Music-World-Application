const express = require(`express`);
const router = express.Router();
const { authenticateUser, authorizePermissions } = require(`../middleware/authentication`);
const {
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    updatePassword,
    imageUpload,
    becomeSinger,
    favoriteGenres,
} = require(`../controllers/userController`);
const { upload } = require(`../utils/multerConfig`);
const uploadHandler = require(`../middleware/uploadhandlermiddleware`);

router.route(`/`).get([authenticateUser, authorizePermissions(`admin`)], getAllUsers);
router.route(`/updateUser`).patch(authenticateUser, updateUser);
router.route(`/updateFavoriteGenres`).patch(authenticateUser, favoriteGenres);
router.route(`/imageUpload`).post(authenticateUser, imageUpload);
router.route(`/updatePassword`).patch(authenticateUser, updatePassword);
router.route(`/deleteUser`).delete(authenticateUser, deleteUser);
router.route(`/:id`).get([authenticateUser, authorizePermissions(`admin`)], getSingleUser);
router.route(`/becomeArtist`).post(authenticateUser, uploadHandler, becomeSinger);

module.exports = router;
