const mongoose = require('mongoose');

const aimodSchema = mongoose.Schema({
  guildId: String,
  toggle: Boolean,
});

module.exports = mongoose.model('aimod', aimodSchema);