const mongoose = require(`mongoose`);

const GIFS = [
  `https://res.cloudinary.com/dbmeb5p2d/image/upload/v1713212792/Music-World/Music-GIFS/hjhkst6p9zofysk1edkl.gif`,
  `https://res.cloudinary.com/dbmeb5p2d/image/upload/v1713212956/Music-World/Music-GIFS/fwehqtbwkqg6hqwefgp3.gif`,
  `https://res.cloudinary.com/dbmeb5p2d/image/upload/v1713213164/Music-World/Music-GIFS/gklj5mkrarazcgfcxqxt.gif`,
  `https://res.cloudinary.com/dbmeb5p2d/image/upload/v1713213469/Music-World/Music-GIFS/z0beleedylqyhawvtbse.gif`,
  `https://res.cloudinary.com/dbmeb5p2d/image/upload/v1713213623/Music-World/Music-GIFS/mxi6o1luyy3knuyxu8wn.gif`,
  `https://res.cloudinary.com/dbmeb5p2d/image/upload/v1713213620/Music-World/Music-GIFS/qikeemzaz7o2wrhbhbbm.gif`,
];

const songSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide song name"],
    },
    audio: {
      type: String,
      required: [true, "Please provide the audio"],
      validate: {
        validator: function (v) {
          return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
        },
        message: "Invalid audio URL",
      },
    },
    singerName: {
      type: String,
      trim: true,
      default: "unknown",
    },
    singer: {
      type: mongoose.Schema.ObjectId,
      ref: `Singer`,
    },
    gif: {
      type: String,
      default: function () {
        return GIFS[Math.floor(Math.random() * GIFS.length)];
      },
    },
    language: {
      type: String,
      enum: [
        "Hindi",
        "English",
      ],
      required: [true, "Please provide language"],
    },
    genre: {
      type: String,
      enum: [
        "Pop",
        "Rock",
        "Jazz",
        "Hip Hop",
        "Country",
        "Romantic",
        "Classical",
        "Electronic",
        "R&B",
        "Folk",
        "Blues",
        "Reggae",
        "Metal",
        "Indie",
        "Alternative",
        "Punk",
        "Soul",
        "Dance",
        "Ambient",
        "Gospel",
        "Funk",
      ],
      required: [true, "please provide genre"],
    },
    duration: {
      type: String,
      required: [true, "Please provide duration"],
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(`Song`, songSchema);
