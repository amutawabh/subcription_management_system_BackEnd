// server.js

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(); //.env

const { registerUser, loginUser } = require("./controllers/userController");
const { createSubscription, getSubscriptions } = require("./controllers/subscriptionController");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
app.use(express.json());

// User Routes
app.post("/api/users/register", registerUser);
app.post("/api/users/login", async (req, res) => {
  try {
    await loginUser(req, res); 
  } catch (error) {
    console.error("Error in login route:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Subscription Routes
app.post("/api/subscriptions/create", authMiddleware, createSubscription);
app.get("/api/subscriptions", authMiddleware, getSubscriptions);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // Stop the server if DB connection fails
  });

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
