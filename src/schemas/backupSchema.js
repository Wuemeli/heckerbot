const mongoose = require('mongoose');

const backupSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  backupId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('backup', backupSchema);