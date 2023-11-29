const mongoose = require('mongoose');

const welcomeSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  welcomeMessage: {
    type: String,
    required: true,
  },
  welcomePicture: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('welcome', welcomeSchema);