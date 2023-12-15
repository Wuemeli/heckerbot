const mongoose = require('mongoose');

const auditlogSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
});

module.exports = mongoose.model('auditlog', auditlogSchema);