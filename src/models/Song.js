const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: [true, "Please provide an artist"],
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
    },
    duration: {
      type: Number,
      required: [true, "Please provide a duration"],
    },
    audioUrl: {
      type: String,
      required: [true, "Please provide an audio URL"],
    },
    coverImage: {
      type: String,
      default: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    genre: {
      type: String,
      trim: true,
    },
    lyrics: {
      type: String,
      trim: true,
    },
    plays: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    isExplicit: {
      type: Boolean,
      default: false,
    },
    featuredArtists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist",
      },
    ],
  },
  { timestamps: true }
);

// Compile model from schema
const Song = mongoose.model("Song", songSchema);
module.exports = Song;