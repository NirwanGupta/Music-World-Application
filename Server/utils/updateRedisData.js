const User = require("../models/User");
const Song = require("../models/Songs");
const Playlist = require("../models/Playlist");
const customErrors = require(`../errors`);
const client = require(`../redis-client`);
const express = require(`express`);
const app = express();
const bodyParser = require('body-parser');
app.use(express.json);
app.use(bodyParser.json);

const updateRedisData = async (userId) => {
    const user = await User.findOne({ _id: userId });
    if (!user) {    
        throw new customErrors.notFoundError("No user found");
    }
    await client.expire(`recommendations:${userId}`, 0);

    const { likedSingers, favoriteGenres, recentlyPlayed } = user;
    const genreBasedSongs = await Song.find({ genre: { $in: favoriteGenres } });
    const singerBasedSongs = await Song.find({ artist: { $in: likedSingers.map(singer => singer._id) } });
    const genreBasedPlaylists = await Playlist.find({ genre: { $in: favoriteGenres } });
    const recentlyPlayedSongs = await Song.find({ _id: { $in: recentlyPlayed } });
    const recommendations = {
        songs: {
            genreBased: genreBasedSongs,
            singerBased: singerBasedSongs,
            recentlyPlayed: recentlyPlayedSongs,
        },
        playlists: genreBasedPlaylists,
    };

    await client.set(`recommendations:${userId}`, JSON.stringify(recommendations));
    await client.expire(`recommendations:${userId}`, 172800);
}

module.exports = updateRedisData;
