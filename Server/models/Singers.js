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
  },
  { timestamps: true }
);

singerSchema.virtual("allsongs", {
  ref: "Song",
  localField: "_id",
  foreignField: "singer",
  justOne: false,
});

module.exports = mongoose.model("Singer", singerSchema);
