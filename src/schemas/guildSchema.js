const mongoose = require('mongoose');

const guildSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  dayBackup: { type: Boolean, default: false },
});

module.exports = mongoose.model('guildSettings', guildSettingsSchema);