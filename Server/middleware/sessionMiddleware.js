const session = require("express-session");
const Interaction = require("../models/Interaction");

const sessionHandler = async (req, res, next) => {
    if(!req.session.listenedSongs) {
        req.session.listenedSongs = [];
    }

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const userId = req.session.userId;
    const pastFiveDaysSongs = await Interaction.find({
        userId,
        listenedAt: { $gte: fiveDaysAgo }
    }).select('songId');

    req.session.listenedSongs = pastFiveDaysSongs.map(interaction => interaction.songId);
    next();
};

module.exports = sessionHandler;