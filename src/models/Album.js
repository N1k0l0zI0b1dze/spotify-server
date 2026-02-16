const mongoose = require("mongoose");

//Schema

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [40, "Title should not be more than 40 characters"],
      minlength: [3, "Title should be at least 3 characters"],
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide an artist"],
      ref: "Artist",
    },
    releaseDate: {
      type: Date,
      default: Date.now(),
    },
    CoverImage: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2016/07/20/10/57/nebula-10-1530144_1280.png",
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
    genre: {
      type: String,
      required: [true, "Please provide a genre"],
      trim: true,
      maxlength: [30, "Genre should not be more than 30 characters"],
      minlength: [3, "Genre should be at least 3 characters"],
    },
    likes: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description should not be more than 200 characters"],
      minlength: [3, "Description should be at least 3 characters"],
      default: "No description",
    },
    // for adults only
    isExplicit: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compile model from schema
// 02.Compile model.md
const Album = mongoose.model("Album", albumSchema);
module.exports = Album;