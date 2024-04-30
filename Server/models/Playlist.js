const mongoose = require("mongoose");
const validator = require("validator");

const playlist = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        default: "Untitled",
    },
    description: {
        type: String,
        trim: true,
        default: "",
        maxlength: 1000,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: `user`,
        required: true,
    },
    songs: [{
        type: mongoose.Types.ObjectId,
        ref: `Song`,
    }],
    number: {
        type: Number,
        default: 0,
    },
    likes: {
        type: Number,
        default: 0,
    },
    privacy: {
        type: String,
        enum: ["Public", "Private"],
        default: "Private",
    },
    tags: [{
        type: String,
    }],
    allowAccess: [{
        type: String,
        required: [true, "Please provide valid email"],
        validate: {
            validator: validator.isEmail,
            message: "Please provide a valid email",
        },
    }],
}, {timestamps: true});

module.exports = mongoose.model("Playlist", playlist);