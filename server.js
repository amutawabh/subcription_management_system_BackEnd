// server.js

// Load environment variables
require('dotenv').config();
require('./config/database');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const verifyToken = require('./middleware/verifyToken');

// Routers
const usersRouter = require('./controllers/userController');
const subscriptionsRouter = require('./controllers/subscriptionController');

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Public Routes
app.use('/users', usersRouter); // User routes

// Private Routes (Protected with verifyToken)
app.use(verifyToken);
app.use('/subscriptions', subscriptionsRouter); // Subscription routes

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`The express app is running on port ${PORT}`);
});
