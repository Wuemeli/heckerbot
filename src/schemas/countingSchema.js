const mongoose = require('mongoose');

const countingSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  lastNumber: { type: Number, required: true },
  lastUser: { type: String, required: true },
  countingMode: { type: String, default: 'normal', enum: ['normal', 'nofail'] },
});

module.exports = mongoose.model('counting', countingSchema);