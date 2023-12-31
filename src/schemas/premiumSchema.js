const mongoose = require('mongoose');

const premiumSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  premium: { type: Boolean, required: true },
  premiumSince: { type: Date, required: false },
  premiumExpires: { type: Date, required: false },
});

module.exports = mongoose.model('premiumdata', premiumSchema);
