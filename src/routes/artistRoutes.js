const express = require("express");
const artistRoutes = express.Router();

const { protect } = require("../middlewares/auth.js");
const upload = require("../middlewares/upload.js");
const {createArtist} = require("../controllers/artistController.js")

// public route
// artistRouter.get("/", getArtists);

// Admin can create Artist
// Protected
artistRoutes.post("/", protect,  upload.single("image"), createArtist);

module.exports = artistRoutes;