const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  time: { type: Number, required: true },
  message: { type: String, required: true },
});

module.exports = mongoose.model('reminder', reminderSchema);