const mongoose = require('mongoose');

const fnbotSchema = new mongoose.Schema({
  ownerId: { type: String, required: true },
  botId: { type: String, required: true },
  authcode: { type: String, required: true },
  status: { type: String, required: true },
  platform: { type: String, required: true },
});

module.exports = mongoose.model('fnbot', fnbotSchema);