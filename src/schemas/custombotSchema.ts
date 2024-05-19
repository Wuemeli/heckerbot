import mongoose, { Schema } from 'mongoose';

const custombotSchema: Schema = new mongoose.Schema({
  userId: { type: String, required: true },
  token: { type: String, required: true },
  clientId: { type: String, required: true },
  status: { type: String, required: true },
  online: { type: Boolean, default: true },
});

export default mongoose.model('custombot', custombotSchema);