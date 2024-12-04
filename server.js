const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(); // تحميل قيم .env
const { registerUser, loginUser } = require("./controllers/userController");
const { createSubscription, getSubscriptions } = require("./controllers/subscriptionController");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
app.use(express.json());

// User Routes
app.post("/api/users/register", registerUser);
app.post("/api/users/login", loginUser);

// Subscription Routes
app.post("/api/subscriptions/create", authMiddleware, createSubscription);
app.get("/api/subscriptions", authMiddleware, getSubscriptions);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {}) // استخدام مسار الاتصال من ملف .env
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));