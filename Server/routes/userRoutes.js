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
} = require(`../controllers/userController`);

router.route(`/`).get([authenticateUser, authorizePermissions(`admin`)], getAllUsers);
router.route(`/updateUser`).patch(authenticateUser, updateUser);
router.route(`/imageUpload`).post(authenticateUser, imageUpload);
router.route(`/updatePassword`).patch(authenticateUser, updatePassword);
router.route(`/deleteUser`).delete(authenticateUser, deleteUser);
router.route(`/:id`).get([authenticateUser, authorizePermissions(`admin`)], getSingleUser);

module.exports = router;