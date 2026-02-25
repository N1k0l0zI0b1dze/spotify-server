const mongoose = require("mongoose");

const connectedDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn(
        "⚠️ MONGO_URI not defined in .env — skipping DB connection (dev only)",
      );
      return false;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    // Do NOT exit the process here — let the caller decide how to handle DB failures.
    return false;
  }
};

module.exports = connectedDB;