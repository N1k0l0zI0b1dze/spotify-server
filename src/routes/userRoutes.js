const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middlewares/auth.js");
const uplaod = require("../middlewares/upload.js");

const userRouter = express.Router();

// Public route
// Register User
userRouter.post("/register", registerUser);

// Login User
userRouter.post("/login", loginUser);

// Private route
// MyProfile
userRouter.get("/profile", protect, getUserProfile);

// File upload
userRouter.put(
  "/profile",
  protect,
  uplaod.single("profilePicture"),
  updateUserProfile,
);

module.exports = userRouter;