import mongoose, { Schema } from 'mongoose';

const auditlogSchema: Schema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
});

export default mongoose.model('auditlog', auditlogSchema);