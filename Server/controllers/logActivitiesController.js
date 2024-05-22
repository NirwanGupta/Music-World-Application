const express = require("express");
const mongoose = require("mongoose");
const UserActivity = require("../models/Activity");
const { StatusCodes } = require("http-status-codes");

const router = express.Router();

const logActivity = async (req, res) => {
    // try {
        const {songId, activityType } = req.body;
        if (!songId || !activityType) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "All fields are required" });
        }
        const userId = req.user.userId;
        const act = await UserActivity.create({ userId, songId, activityType });
        res.status(StatusCodes.CREATED).json({ act });
    // }
    // catch(error) {
    //     res.status(501).json({ error: "There was an error while logging the user activity" });
    // }
}

// router.post("/logActivity", async (req, res) => {
//     const { userId, songId, activityType } = req.body;

//     try {
//         const activity = new UserActivity({ userId, songId, activityType });
//         await activity.save();
//         res.status(201).send(activity);
//     } catch (error) {
//         res.status(500).send({ error: "Error logging activity" });
//     }
// });

module.exports = {
    logActivity,
};