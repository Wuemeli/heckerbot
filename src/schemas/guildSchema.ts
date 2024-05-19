import mongoose, { Schema } from 'mongoose';

const guildSettingsSchema: Schema = new mongoose.Schema({
  guildId: { type: String, required: true },
  dayBackup: { type: Boolean, default: false },
});

export default mongoose.model('guildSettings', guildSettingsSchema);