const mongoose = require('mongoose');

const custombotSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  token: { type: String, required: true },
  clientId: { type: String, required: true },
  status: { type: String, required: true },
});

module.exports = mongoose.model('custombot', custombotSchema);