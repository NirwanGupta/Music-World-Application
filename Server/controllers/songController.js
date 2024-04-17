const customErrors = require("../errors");
const Song = require(`../models/Songs`);
const Singer = require(`../models/Singers`);
const User = require("../models/User");
const cloudinary = require(`cloudinary`).v2;
const { StatusCodes } = require(`http-status-codes`);

const getAllSongs = async (req, res) => {
  const songs = await Song.find({});
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
  // if(user.role !== 'artist') {
  //     throw new customErrors.UnauthorizedError("You are not an Artist, thus you are not allowed to upload songs");
  // }
  const { name, singerName, genre, duration, audio } = req.body;

  const song = await Song.create({ name, singerName, genre, duration, audio });
  song.singer = req.user.userId;

  await Singer.findOneAndUpdate(
    {name: singerName},
    {$push: {songs: song._id}},
    {new: true},
  ).populate('allSongs');

  res.status(StatusCodes.OK).json({ song });
};

const audioUpload = async (req, res) => {
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

    const singerId = song.singer;
    song = await Song.findOneAndDelete({ _id: songId });
    
    const updatedSinger = await Singer.findOneAndUpdate(
        { _id: singerId },
        { $pull: { songs: songId } },
        { new: true }
    );

    res.status(StatusCodes.OK).json({ msg: "Song deleted Successfully" });
};

const updateSong = async (req, res) => {
    const { id: songId } = req.params;
    if(!songId) {
        throw new customErrors.BadRequestError("Please provide songId");
    }

    const song = await Song.findOne({ _id: songId });
    if(!song) {
        throw new customErrors.notFoundError("No song found");
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
        song.audio = audio;
    }
    if(duration) {
        song.duration = duration;
    }
    if(genre) {
        song.genre = genre;
    }
    await song.save();

    const deletedSinger = await Singer.findOneAndUpdate(
        { _id: singerId },
        { $pull: { songs: songId } },
        { new: true }
    );
    const updatedSinger = await Singer.findOneAndUpdate(
        { _id: singerId },
        { $push: { songs: songId } },
        { new: true }
    );

    re.status(StatusCodes.OK).json({ msg: "Song updated successfully" });
};

module.exports = {
  getAllSongs,
  getSingleSong,
  addSong,
  updateSong,
  deleteSong,
  audioUpload,
};
