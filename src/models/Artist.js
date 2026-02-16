const mongoose = require("mongoose");

//Schema
const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      maxlength: [40, "Name should not be more than 40 characters"],
      minlength: [3, "Name should be at least 3 characters"],
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/04/29/09/33/drums-745077_1280.jpg",
    },
    genres: [
      {
        type: String,
        ref: "Song",
      },
    ],
    followers: {
      type: Number,
      default: 0,
    },
    albums: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Album",
      },
    ],
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//Compile to for the model
const Artist = mongoose.model("Artist", artistSchema);

module.exports = Artist;