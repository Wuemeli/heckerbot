import mongoose, { Schema } from 'mongoose';

const welcomeSchema: Schema = new Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  welcomeMessage: { type: String, required: true },
  welcomeRole: { type: String, required: true },
});

export default mongoose.model ('welcome', welcomeSchema);