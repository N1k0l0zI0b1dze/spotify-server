const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//Load env variables
dotenv.config();

//Initialize app
const app = express();

//Connect to database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));