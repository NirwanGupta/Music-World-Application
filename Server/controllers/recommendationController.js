const User = require("../models/User");
const Song = require("../models/Songs");
const Playlist = require("../models/Playlist");
const customErrors = require(`../errors`);
const { StatusCodes } = require("http-status-codes");

const getRecommendations = async (req, res) => {
    const userId = req.user.userId;
    const user = await User.findOne({_id: userId });
    if(!user) {
        throw new customErrors.notFoundError("No user found");
    }

    const { likedSingers, favoriteGenres, recentlyPlayed } = user;
    
    const genreBasedSongs = await Song.find({ genre: { $in: favoriteGenres } });
    const singerBasedSongs = await Song.find({ artist: { $in: likedSingers.map(singer => singer._id) } });
    const genreBasedPlaylists = await Playlist.find({ genre: { $in: favoriteGenres } });
    // const recentlyPlayedSongs = await Song.find({ _id: { $in: recentlyPlayed } });

    const recommendations = {
        songs: {
            genreBased: genreBasedSongs,
            singerBased: singerBasedSongs,
            recentlyPlayed,
        },
        playlists: genreBasedPlaylists,
    };

    res.status(StatusCodes.OK).json({ recommendations });
};

module.exports = getRecommendations;