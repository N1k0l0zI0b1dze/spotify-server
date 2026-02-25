const jwt = require("jsonwebtoken");
const asyncHanlder = require("express-async-handler");
const User = require("../models/User.js");
const { StatusCodes } = require("http-status-codes");

// Middleware to protect routes - verify JWT token and set req.user

const protect = asyncHanlder(async (req, res, next) => {
  let token;

  if (!req.headers.authorization) {
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error("No Token found in the header");
  }

  // Check if token exists in Authorization header

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC
      // ["Bearer", "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC"]
      token = req.headers.authorization.split(" ")[1];

      // Verify
      const decoded = jwt.verify(token, process.env.JWT);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.UNAUTHORIZED);
      throw new Error("Not authorized, token failed");
    }
  }
});

module.exports = { protect };