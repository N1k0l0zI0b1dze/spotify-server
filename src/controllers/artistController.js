const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const Song = require("../models/Song");
const Album = require("../models/Album");
const Artist = require("../models/Artist");

const { uploadToCloudinary } = require("../utils/cloudinaryUpload");

const createArtist = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Request body is required");
  }

  const { name, bio, genres } = req.body;

  if (!name || !bio || !genres) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Name, bio, genres are required!");
  }

  // if artist already exists
  const existingArtists = await Artist.findOne({ name });
  if (existingArtist) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Artist already exists");
  }

  // upload artist image if provided
  let imgUrl = "";
  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, "spotify/artists");

    imgUrl = result.secure_url;
  }
  const artist = await Artist.create({
    name,
    bio,
    genres,
    isVerified: true,
    image: imgUrl,
  });
});

const getArtist = asyncHandler(async (req, res) => {
  const { genre, search, page = 1, limit = 10 } = req.query;
  const filter = {};

  if (genre) filter.genres = { $in: [genre] };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { bio: { $regex: search, $options: "i" } },
    ];
  }

  // Count total artists with filter
  const count = await Artist.countDocuments(filter);

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get artist
  const artists = await Artist.find(filter)
    .sort({ followers: -1 })
    .limit(parseInt(limit))
    .skip(skip);

  res.status(StatusCodes.OK).json({
    artists,
    page: parseInt(page),
    pages: Math.ceil(count / parseInt(limit)),
    totalArtists: count,
  });
});

const getArtistById = asyncHandler(async (req, res) => {
  const artist = await Artist.findById(req.params.id);

  if (artist) {
    res.status(StatusCodes.OK).json(artist);
  } else {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Artist not found");
  }
});

const updatedArtist = asyncHandler(async (req, res) => {
  const { name, bio, genres, isVerified } = req.body;

  const artist = await Artist.findById(req.params.id);

  if (!artist) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Artist not found");
  }

  artist.name = name || artist.name;
  artist.bio = bio || artist.bio;
  artist.genres = genres || artist.genres;
  artist.isVerified =
    isVerified !== undefined ? isVerified === true : artist.isVerified;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, "spotify/artists");
    artist.image = result.secure_url;
  }

  const updatedArtist = await artist.save();
});

const deleteArtist = asyncHandler(async (req, res) => {
  const artist = await Artist.findById(req.params.id);

  if (!artist) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Artist not found");
  }

  await artist.deleteOne();
  res.status(StatusCodes.OK).json({ message: "Artist removed" });
});

const getTopArtists = asyncHandler(async (req, res) => {
  const { limit } = req.query;

  const artists = await Artist.find()
    .sort({ followers: -1 })
    .limit(parseInt(limit));

    res.status(StatusCodes.OK).json(artists);
});



module.exports = {
  createArtist,
  getArtist,
  getArtistById,
  updatedArrist,
  deleteArtist,
  getTopArtists,    
};
