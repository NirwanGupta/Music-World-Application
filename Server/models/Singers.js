const mongoose = require("mongoose");

const singerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide the singer's name"],
    },
    image: {
      type: [String],
      trim: true,
      required: [true, "Please provide at least one singer's image URL"],
    },
    bio: {
      type: String,
      trim: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    // songs: [{
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'Song'
    // }],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    likedBy: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    }],
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true ,
  toJSON: {virtuals: true}, toObject: {virtuals: true}
});

singerSchema.virtual("songs", {
  ref: "Song",
  localField: "_id",
  foreignField: "singer",
  justOne: false,
});

singerSchema.pre(`remove`, async function() {
  console.log("Deleting all the songs of the deleting artist");
  await this.model(`Song`).deleteMany({ singer: this._id });
})

module.exports = mongoose.model("Singer", singerSchema);
