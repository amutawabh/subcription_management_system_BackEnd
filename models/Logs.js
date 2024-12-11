// models/Log.js
const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Log', LogSchema);
