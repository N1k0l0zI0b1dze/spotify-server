const mongoose = require("mongoose");

// Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide a name"],
      maxlength: [40, "Name can not be more than 40 characters"],
      minlength: [2, "Name can not be less than 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password should be at least 6 characters"],
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2018/11/21/08/37/brain-3829057_1280.jpg",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    // Relation Schema
    likedSongs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
    likedAlbum: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Album",
      },
    ],
    followedArtists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artists",
      },
    ],
    followedPlaylists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist",
      },
    ],
  },
  { timestamps: ture },
);

const User = mongoose("User", userSchema);
module.exports = User;
