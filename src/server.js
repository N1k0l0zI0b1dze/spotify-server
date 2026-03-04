//Load env variables
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const { StatusCodes } = require("http-status-codes");

const connectedDB = require("./config/dbConnect.js");
const userRouter = require("./routes/userRoutes.js");
const artistRouter = require("./routes/artistRoutes.js");

const app = express();

//Middleware
app.use(express.json());

//Initialize app
const PORT = process.env.PORT || 5000;

// Routes
app.use("/api/users", userRouter);
app.use("/api/artists", artistRouter);

// Error handling middleware (optional)
// 404
app.use((req, res, next) => {
  const error = new Error("Not Found - " + req.originalUrl);
  error.status = StatusCodes.NOT_FOUND;
  next(error);
});

// Global error Handler
app.use((err, req, res, next) => {
  res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: err.message || "Internal Server Error",
    status: "error",
  });
});
// Start the server
const startServer = async () => {
  await connectedDB(); // ensures DB is connected first
  app.listen(PORT, () =>
    console.log(`Server is running http://localhost:${PORT}`),
  );
};

startServer();
