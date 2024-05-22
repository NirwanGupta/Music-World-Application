const Singer = require(`../models/Singers`);
const Song = require(`../models/Songs`);
const {StatusCodes} = require(`http-status-codes`);
const customErrors = require(`../errors`);
const cloudinary = require(`cloudinary`).v2;
const fs = require(`fs`);
const User = require("../models/User");

const getAllArtists = async (req, res) => {
    const { artist, sort } = req.query;
    const queryObject = {};

    if(artist) {
        queryObject.name = { $regex: artist, $options: 'i' };
    }

    let query = Singer.find(queryObject);

    if(sort === 'a-z') {
        query = query.sort({ name: 1 });
    }
    else if(sort === 'z-a') {
        query = query.sort({ name: -1 });
    }
    else if(sort === 'likes') {
        query = query.sort({ likes: -1 });
    }

    const allArtists = await query.populate('songs');

    if(!allArtists || allArtists.length === 0) {
        throw new customErrors.notFoundError('No artists found');
    }

    res.status(StatusCodes.OK).json({ artists: allArtists, count: allArtists.length });
};


const getSingleArtist = async (req, res) => {
    const {id: artistId} = req.params;
    if(!artistId) {
        throw new customErrors.BadRequestError("Please provide the artistId");
    }
    
    const artist = await Singer.findOne({ _id: artistId }).populate("songs");
    console.log(artist);
    if(!artist) {
        throw new customErrors.notFoundError("No artist found with the provided id");
    }

    res.status(StatusCodes.OK).json({ artist });
};

const addArtist = async (req, res) => {
    const user = await User.findOne({ _id: req.user.userId });
    if(!user) {
        throw new customErrors.BadRequestError("No user found");
    }
    user.role = "artist";
    const { name, image, bio } = req.body;
    if(!name || !image || image.length === 0 || !bio) {
        throw new customErrors.BadRequestError("Please fill out all the credentials");
    }

    const artist = await Singer.create({name, image, bio, user: req.user.userId});
    artist.lastUpdated = new Date(Date.now());
    // artist.user = req.user.userId;

    res.status(StatusCodes.CREATED).json({ artist, msg: "Artist created successfully" });
};

const uploadImages = async (req, res) => {
    const user = await User.findOne({ _id: req.user.userId });
    if(user.role !== "artist" && user.role !== "admin") {
        throw new customErrors.UnauthorizedError("You are not an artist, you cannot access this route");
    }
    if (!req.files || !req.files.image || !Array.isArray(req.files.image)) {
      throw new customErrors.BadRequestError("Invalid file upload request");
    }

    const imagePromises = req.files.image.map(async (file) => {
      
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        use_filename: true,
        folder: "Music-World/Artist-Images",
      });

      fs.unlinkSync(file.tempFilePath);

      return { src: result.secure_url };
    });

    const uploadedImages = await Promise.all(imagePromises);

    res.status(StatusCodes.OK).json({ images: uploadedImages });
}

const updateArtist = async (req, res) => {
    const { name, image, bio } = req.body;
    if(!name && !image && image.length === 0 && !bio) {
        throw new customErrors.BadRequestError("Please provide at least one field to update");
    }

    const artist = await Singer.findOne({ user: req.user.userId });
    if(!artist) {
        throw new customErrors("No artist found");
    }
    if(artist.user.toString() !== req.user.userId) {
        throw new customErrors.UnauthorizedError("You are not alloawed to update the artist profile");
    }

    if(name) {
        artist.name = name;
    }
    if(image && image.length) {
        function getImagePublicId(cloudinaryUrl) {
            const parts = cloudinaryUrl.split("/");
            const publicIdPart = parts[parts.length - 1].split(".")[0];
            return publicIdPart;
        }

        const imagePublicIds = artist.image.map((cloudinaryUrl) =>
            getImagePublicId(cloudinaryUrl)
        );

        console.log(imagePublicIds);

        const deletePromises = imagePublicIds.map((imagePublicId) =>
        cloudinary.api
            .delete_resources([`Music-World/Artist-Images/${imagePublicId}`], {
                type: "upload",
                resource_type: "image",
            })
            .then((result) => {
                // console.log(`Deleted resource ${imagePublicId}:`, result);
            })
            .catch((error) => {
                console.error(`Error deleting resource ${imagePublicId}:`, error);
            })
        );

        await Promise.all(deletePromises);

        artist.image = image;
    }
    if(bio) {
        artist.bio = bio;
    }
    await artist.save();
    res.status(StatusCodes.OK).json({ msg: "Artist updated successfully" });
};

const deleteArtist = async (req, res) => {
    const artist = await Singer.findOne({ user: req.user.userId });
    if(!artist) {
        throw new customErrors.BadRequestError("No such artist");
    }
    if(artist.user.toString() !== req.user.userId) {
        throw new customErrors.UnauthorizedError("You are not alloawed to delete the artist profile");
    }

    function getImagePublicId(cloudinaryUrl) {
        const parts = cloudinaryUrl.split("/");
        const publicIdPart = parts[parts.length - 1].split(".")[0];
        return publicIdPart;
    }

    const imagePublicIds = artist.image.map((cloudinaryUrl) =>
        getImagePublicId(cloudinaryUrl)
    );

    console.log(imagePublicIds);

    const deletePromises = imagePublicIds.map((imagePublicId) =>
    cloudinary.api
        .delete_resources([`Music-World/Artist-Images/${imagePublicId}`], {
            type: "upload",
            resource_type: "image",
        })
        .then((result) => {
            // console.log(`Deleted resource ${imagePublicId}:`, result);
        })
        .catch((error) => {
            console.error(`Error deleting resource ${imagePublicId}:`, error);
        })
    );

    await Promise.all(deletePromises);

    await artist.remove();
    res.status(StatusCodes.OK).json({ msg: "Artist along with all his songs deleted" });
};

const likeSinger = async (req, res) => {
    const { id: singerId } = req.params;
    if(!singerId) {
        throw new customErrors.BadRequestError("Please provide singer ID");
    }
    const singer = await Singer.findOne({ _id: singerId });
    if(!singer) {
        throw new customErrors.notFoundError("No singer found");
    }
    const alreadyLiked = singer.likedBy.includes(req.user.userId);
    if(alreadyLiked) {
        singer.likedBy = singer.likedBy.filter((id) => id.toString() !== req.user.userId.toString());
    }
    else {
        singer.likedBy.push(req.user.userId.toString());
    }
    singer.likes = singer.likedBy.length;
    const likes = singer.likes;

    const user = await User.findOne({ _id: req.user.userId });
    if(!user) {
        throw new customErrors.UnauthenticatedError("No user found");
    }
    
    if(alreadyLiked) {
        user.likedSingers = user.likedSingers.filter((id) => id.toString() !== singerId.toString());
    }
    else {
        user.likedSingers.push(singerId);
    }

    await singer.save();
    await user.save();

    res.status(StatusCodes.OK).json({ message: alreadyLiked ? "Singer unliked" : "Singer liked", likes: likes });
}

module.exports = {
    getAllArtists,
    getSingleArtist,
    addArtist,
    updateArtist,
    deleteArtist,
    uploadImages,
    likeSinger,
}