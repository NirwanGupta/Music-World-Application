const customErrors = require("../errors");
const Song = require(`../models/Songs`);
const Singer = require(`../models/Singers`);
const User = require("../models/User");
const cloudinary = require(`cloudinary`).v2;
const { StatusCodes } = require(`http-status-codes`);
// const {response} = require(`../utils/responseAI`);
const {moodDetector, response} = require(`../utils/AI_integration`);
const userActivity = require(`../models/Activity`);

const getAllSongs = async (req, res) => {
    //  this is to populate artist to songs
    // const songs = await Song.find({}).populate({
    //     path: "singer",
    //     select: "name duration audio image",
    // });
    const { songName, artist, genre, language, sort } = req.query;
    const queryObject = {};
    
    if(songName) {
        queryObject.name = { $regex: songName, $options: `i` };
    }
    if(artist) {
        queryObject.singerName = { $regex: artist, $options: `i` };
    }
    if(genre) {
        queryObject.genre = genre;
    }
    if(language) {
        queryObject.language = language;
    }
    let filteredSongs = Song.find(queryObject);
    
    if(sort === "a-z") {
        filteredSongs.sort('name');
    }
    if(sort === 'z-a') {
        filteredSongs.sort('-name');
    }
    if(sort == "likes") {
        filteredSongs.sort('likes');
    }
    
    const songs = await filteredSongs;
    res.status(StatusCodes.OK).json({songs});
};

const getSingleSong = async (req, res) => {
    const { id: songId } = req.params;

    if(!songId) {
        throw new customErrors.BadRequestError("Please provide songId");
    }

    const song = await Song.findOne({ _id: songId });
    if(!song) {
        throw new customErrors.notFoundError("No song found with the given songId");
    }

    res.status(StatusCodes.OK).json({ song, success: true });
};

const addSong = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    throw new customErrors.notFoundError("No user found with the given id");
  }
  if(user.role !== 'artist') {
      throw new customErrors.UnauthorizedError("You are not an Artist, thus you are not allowed to upload songs");
  }
    const { name, singerName, genre, duration, audio, language } = req.body;

    const singer = await Singer.findOne({ user: req.user.userId });
    if(!singer) {
        throw new customErrors.notFoundError("No singer found");
    }
    const song = await Song.create({ name, singerName, genre, duration, audio, language, singer: singer._id });

//   await Singer.findOneAndUpdate(
//     {name: singerName},
//     {$push: {songs: song._id}},
//     {new: true},
//   ).populate('allsongs');

  res.status(StatusCodes.OK).json({ song });
};

const audioUpload = async (req, res) => {
    if(req.user.role !== "admin" && req.user.role !== "artist") {
        throw new customErrors.UnauthorizedError("You are not an Artist, thus you are not allowed to upload songs");
    }
    if (!req.files || !req.files.audio) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "No audio file uploaded" });
    }

    const result = await cloudinary.uploader.upload(
        req.files.audio.tempFilePath, {
            use_filename: true,
            folder: "Music-World/Music-Audio",
            resource_type: "auto",
        }
    );

    res.status(StatusCodes.OK).json({ url: result.secure_url });
};

const deleteSong = async (req, res) => {
    const { id: songId } = req.params;

    if(!songId) {
        throw new customErrors.BadRequestError("Please provide songId");
    }
    let song = await Song.findOne({ _id: songId });
    if (!song) {
        throw new customErrors.notFoundError("No song found with given id");
    }

    const songSinger = await Singer.findOne({ _id: song.singer });
    if(!songSinger) {
        throw new customErrors.BadRequestError("Unexpected error occurred -> song is there but singer is not there");
    }

    if(songSinger.user.toString() !== req.user.userId || req.user.role === "admin") {
        throw new customErrors.UnauthorizedError("You are not authorized to delete this song -> only the artist can delete this song");
    }

    const singerId = song.singer;
    song = await Song.findOne({ _id: songId });
    
    function getImagePublicId(cloudinaryUrl) {
        const parts = cloudinaryUrl.split("/");
        const publicIdPart = parts[parts.length - 1].split(".")[0];
        return publicIdPart;
    }

    const cloudinaryUrl = song.audio;
    const imagePublicId = getImagePublicId(cloudinaryUrl);

    console.log(imagePublicId);

    await cloudinary.api
        .delete_resources([`Music-World/Music-Audio/${imagePublicId}`], {
            type: "upload",
            resource_type: "video",
        })
        .then((result) => {
          // console.log("Deleted resources:", result);
        })
        .catch((error) => {
            console.error("Error deleting resources:", error);
        });
    // const updatedSinger = await Singer.findOneAndUpdate(
    //     { _id: singerId },
    //     { $pull: { songs: songId } },
    //     { new: true }
    // );

    await song.remove();

    res.status(StatusCodes.OK).json({ msg: "Song deleted Successfully" });
};

const updateSong = async (req, res) => {
    const { id: songId } = req.params;
    console.log("In updateSong");
    if(!songId) {
        throw new customErrors.BadRequestError("Please provide songId");
    }
    
    const song = await Song.findOne({ _id: songId });
    if(!song) {
        throw new customErrors.notFoundError("No song found");
    }
    // console.log("song.singer: ", song.singer);
    const songSinger = await Singer.findOne({ _id: song.singer });
    // console.log(songSinger.user, req.user.userId);
    if(!songSinger) {
        throw new customErrors.BadRequestError("Unexpected error occurred -> song is there but singer is not there");
    }
    
    if(songSinger.user.toString() !== req.user.userId || req.user.role === "admin") {
        throw new customErrors.UnauthorizedError("You are not authorized to update this song -> only the artist can update this song");
    }
    
    const { name, singerName, audio, duration, genre } = req.body;
    if(!name && !singerName && !audio && !duration && !genre) {
        throw new customErrors.BadRequestError("Please provide at least one value");
    }

    const singerId = song.singer;
    if(name) {
        song.name = name;
    }
    if(singerName) {
        song.singerName = singerName;
    }
    if(audio) {
        
    function getImagePublicId(cloudinaryUrl) {
        const parts = cloudinaryUrl.split("/");
        const publicIdPart = parts[parts.length - 1].split(".")[0];
        return publicIdPart;
    }

    const cloudinaryUrl = song.audio;
    const imagePublicId = getImagePublicId(cloudinaryUrl);

    console.log(imagePublicId);

    await cloudinary.api
        .delete_resources([`Music-World/Music-Audio/${imagePublicId}`], {
            type: "upload",
            resource_type: "video",
        })
        .then((result) => {
          // console.log("Deleted resources:", result);
        })
        .catch((error) => {
            console.error("Error deleting resources:", error);
        });
        song.audio = audio;
    }
    if(duration) {
        song.duration = duration;
    }
    if(genre) {
        song.genre = genre;
    }
    await song.save();

    // const deletedSinger = await Singer.findOneAndUpdate(
    //     { _id: singerId },
    //     { $pull: { songs: songId } },
    //     { new: true }
    // );
    // const updatedSinger = await Singer.findOneAndUpdate(
    //     { _id: singerId },
    //     { $push: { songs: songId } },
    //     { new: true }
    // );

    res.status(StatusCodes.OK).json({ msg: "Song updated successfully" });
};

const likeSong = async (req, res) => {
    const { id: songId } = req.params;
    if(!songId) {
        throw new customErrors.BadRequestError("Please provide song ID");
    }
    const song = await Song.findOne({ _id: songId })
    if(!song) {
        throw new customErrors.notFoundError("No song found");
    }
    const alreadyLiked = song.likedBy.includes(req.user.userId);
    if(alreadyLiked) {
        song.likedBy = song.likedBy.filter((id) => id.toString() !== req.user.userId.toString());
    }
    else {
        song.likedBy.push(req.user.userId);
    }
    song.likes = song.likedBy.length;
    const likes = song.likes;

    const user = await User.findOne({ _id: req.user.userId });
    if(!user) {
        throw new customErrors.UnauthenticatedError("No user found");
    }
    
    if(alreadyLiked) {
        user.likedSongs = user.likedSongs.filter((id) => id.toString() !== songId.toString());
    }
    else{
        user.likedSongs.push(songId);
    }

    await song.save();
    await user.save();

    res.status(StatusCodes.OK).json({ message: alreadyLiked ? "Song unliked" : "Song liked", likes: likes });
};

const songsWRTmood = async (req, res) => {
    const { mood } = req.body;
    if (!mood || mood.length === 0) {
        throw new customErrors.BadRequestError("Please provide mood");
    }
    const generatedGenres = await moodDetector(mood);
    const genreArray = generatedGenres.flat();

    const songs = await Song.find({ genre: { $in: genreArray } });
    res.status(StatusCodes.OK).json({ songs, genreArray });
}

const respondToQuestion = async (req, res) => {
    const {prompt} = req.body;
    if(!prompt || prompt.length<5 || prompt.length>1000) {
        throw new customErrors.BadRequestError("The prompt length should be between 5 and 1000");
    }
    console.log("Correct till here");
    const generateResponse = await response(prompt);
    res.status(StatusCodes.OK).json({ response: generateResponse });
}

const updateUserProfile = async (userId) => {
    const activities = await userActivity.find({ userId });

    const genreCount = {};
    const artistCount = {};
    const recentPlays = [];

    for (const activity of activities) {
        if(activity.activityType === "play") {
            const song = await Song.findById(activity.songId);
            genreCount[song.genre] = (genreCount[song.genre] || 0) + 1;
            artistCount[song.singer] = (artistCount[song.singer] || 0) + 1;
            if(recentPlays.length < 10) {
                recentPlays.push(song._id);
            }
        }
    }

    const favoriteGenres = Object.keys(genreCount).sort(
        (a, b) => genreCount[b] - genreCount[a]
    );
    const topArtists = Object.keys(artistCount).sort(
        (a, b) => artistCount[b] - artistCount[a]
    );

    await User.findOneAndUpdate(
        { _id: userId },
        { favoriteGenres, topArtists, recentlyPlayed: recentPlays },
        { upsert: true }
    );
};

module.exports = {
    getAllSongs,
    getSingleSong,
    addSong,
    updateSong,
    deleteSong,
    audioUpload,
    likeSong,
    songsWRTmood,
    respondToQuestion,
    updateUserProfile,
};