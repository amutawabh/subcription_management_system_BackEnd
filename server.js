// Load environment variables
require('dotenv').config();
require('./config/database');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const verifyToken = require('./middleware/verifyToken');
const Log = require('./models/Logs'); 

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

// Logs Route
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await Log.find(); // افترض أن Log هو Mongoose Model
    console.log('Logs fetched from database:', logs); // طباعة البيانات للتأكد
    res.status(200).json(logs); // إعادة السجلات كـ JSON
  } catch (error) {
    console.error('Error fetching logs:', error.message);
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`The express app is running on port ${PORT}`);
});
