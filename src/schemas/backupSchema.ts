import mongoose, { Schema } from 'mongoose';

const backupSchema: Schema = new mongoose.Schema({
  userId: { type: String, required: false },
  backupId: { type: String, required: true },
  guildId: { type: String, required: true },
  dayBackup: { type: Boolean, default: false },
});

export default mongoose.model('backup', backupSchema);