const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const Song = require("../models/Song");
const Album = require("../models/Album");
const Artist = require("../models/Artist");
const Playlist = require("../models/Playlist");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");

//@desc - Register a new user
//@route - POST /api/users/register
//@Access - Public

//// check readme.md
const registerUser = asyncHandler(async (req, res) => {
  // the “package” of information you are sending to the server.-Payload
  // Get The Payload
  const { name, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("User already exists");
  }

  // Create User
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(StatusCodes.CREATED).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePicture: user.profilePicture,
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Invalid user data");
  }
});

//@desc - Login user
//@route - POST /api/users/login
//@Access - Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //Find the user
  const user = await User.findOne({ email });
  //Check if user exists and password matches
  if (user && (await user.matchPassword(password))) {
    res.status(StatusCodes.OK).json({
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    });
  } else {
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error("Invalid email or password");
  }
});

//@desc - Get user profile
//@route - GET /api/users/login
//@Access - Private

const getUserProfile = asyncHandler(async (req, res) => {
  //Find the user
  // console.log("test", req.user);

  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("likedSongs", "title artist duration")
    .populate("likedAlbums", "title artist coverImage")
    .populate("followedArtists", "name image")
    .populate("followedPlaylists", "name creator coverImage");
  if (user) {
    res.status(StatusCodes.OK).json(user);
  } else {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("User not found");
  }
});

//@desc - Login user
//@route - PUT /api/users/profile
//@Access - Private

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const { name, email, password } = req.body;

  // Check if email is being updated
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("Email already in use");
    }
  }

  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    // Check if password is being updated
    if (password) {
      user.password = password;
    }
    // Upload profile picture if provided
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, "spotify/users");
      user.profilePicture = result.secure_url;
    }
    const updatedUser = await user.save();
    res.status(StatusCodes.OK).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("User Not Found");
  }
});
module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
