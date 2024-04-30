const { StatusCodes } = require("http-status-codes");
const Playlist = require("../models/Playlist");
const customErrors = require("../errors");

const createPlaylist = async (req, res) => {
    const {
        title,
        description,
        songs,
        tags,
    } = req.body;
    const playlist = await Playlist.create({
        createdBy: req.user.userId, 
        title,
        description,
        songs,
        number: songs.length,
        tags,
        allowAccess: [req.user.email],
    });
    res.status(StatusCodes.CREATED).json({ status: "Success", playlist });
};

const getAllPlaylist = async (req, res) => {
    const playLists = await Playlist.find({ privacy: "Public" });
    res.status(StatusCodes.OK).json({ playLists });
};

const GetCurrectUserPlaylists = async (req, res) => {
    const playlists = await Playlist.find({ createdBy: req.user.userId });
    if(!playlists || playlists.length === 0) {
        throw new customErrors.notFoundError("No playlists found");
    }
    res.status(StatusCodes.OK).json({ playlists });
}

const getSinglePlaylist = async (req, res) => {
    const { id: playlistId } = req.params;
    if(!playlistId) {
        throw new customErrors.BadRequestError("Please provide playlistId");
    }
    const playlist = await Playlist.findOne({ _id: playlistId });
    if(!playlist) {
        throw new customErrors.notFoundError(`No playlist found with the given id`);
    }
    if(playlist.createdBy.toString() !== req.user.userId.toString() && playlist.privacy === "Private") {
        if(!playlist.allowAccess.includes(req.user.email)) {
            throw new customErrors.BadRequestError("Can't give access to a private playlist");
        }
    }
    res.status(StatusCodes.OK).json({ playlist });
};

const updatePlaylist = async (req, res) => {
    // console.log("Entered update Playlists");
    const { id: playlistId } = req.params;
    const { 
        title, 
        description, 
        tags, 
        songs 
    } = req.body;
    if(!playlistId) {
        throw new customErrors.BadRequestError("Please provide playlistId");
    }
    // console.log("playlistiD");
    if(!title && !description && !tags && !songs) {
        throw new customErrors.BadRequestError("Please fill out atleast one field");
    }
    // console.log("Title");
    const playlist = await Playlist.findOne({ _id: playlistId });
    if(!playlist) {
        throw new customErrors.notFoundError(`No playlist found`);
    }
    if(playlist.createdBy.toString() !== req.user.userId.toString() && req.user.userId !== "admin") {
        throw new customErrors.UnauthorizedError("You cannot update this playlist");
    }
    if(title) {
        playlist.title = title;
    }
    if(description) {
        playlist.description = description;
    }
    if(tags && tags.length > 0) {
        const uniqueTags = new Set([...playlist.tags, ...tags]);
        playlist.tags = [...uniqueTags];
    } 
    if(songs) {
        const uniqueSongs = new Set([...playlist.songs, ...songs]);
        playlist.songs = [...uniqueSongs];
        playlist.number = playlist.songs.length;
    }
    await playlist.save();
    // console.log("At the end");
    res.status(StatusCodes.OK).json({ updatedPlaylist: playlist });
};

const deleteSongFromPlaylist = async (req, res) => {
    const { id: playlistId, songId } = req.params;
    if(!playlistId) {
        throw new customErrors.BadRequestError("Please provide playlistId");
    }
    if(!songId) {
        throw new customErrors.BadRequestError("Please provide songId");
    }
    const playlist = await Playlist.findOne({ _id: playlistId });
    if(!playlist) {
        throw new customErrors.notFoundError("No Playlist Found");
    }
    if(playlist.createdBy.toString() !== req.user.userId.toString() && req.user.role !== "admin") {
        throw new customErrors.BadRequestError("You cannot update this playlist");
    }
    playlist.songs = playlist.songs.filter(id => id.toString() !== songId.toString());
    playlist.number = playlist.number-1;
    await playlist.save();

    res.status(StatusCodes.OK).json({ message: "Song deleted from playlist successfully", updatedPlaylist: playlist });
}

const deletePlaylist = async (req, res) => {
    const { id: playlistId } = req.params;
    if(!playlistId) {
        throw new customErrors.BadRequestError("Please provide playlistId");
    }
    const playlist = await Playlist.findOneAndDelete({ _id: playlistId });
    if(!playlist) {
        throw new customErrors.notFoundError("No playlist found");
    }
    res.status(StatusCodes.OK).json({ msg: "Playlist deleted successfully" });
};

const sharePlaylist = async (req, res) => {
    const { id: playlistId } = req.params;
    if(!playlistId) {
        throw new customErrors.BadRequestError("No playlist found");
    }
    const playlist = await Playlist.findOne({ _id: playlistId });
    if(!playlist) {
        throw new customErrors.notFoundError("No playlist found");
    }
    if(playlist.privacy === "Public") {
        const url = `localhost:5000/api/v1/playlists/${playlistId}`;
        return res.status(StatusCodes.OK).json({ url:  url});
    }
    const {allowAccess} = req.body;
    if(!allowAccess || allowAccess.length === 0) {
        throw new customErrors.BadRequestError("Please give the email id of the people whome you want to give access");
    }
    const newAllowAccess = new Set([...playlist.allowAccess, ...allowAccess]);
    playlist.allowAccess = [...newAllowAccess];
    
    await playlist.save();

    const url = `localhost:5000/api/v1/playlists/${playlistId}`;
    res.status(StatusCodes.OK).json({ url: url, allowAccess: playlist.allowAccess });
};

module.exports = {
    createPlaylist,
    getAllPlaylist,
    getSinglePlaylist,
    GetCurrectUserPlaylists,
    deleteSongFromPlaylist,
    updatePlaylist,
    deletePlaylist,
    sharePlaylist,
};