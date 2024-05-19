import mongoose, { Schema } from 'mongoose';

const reminderSchema: Schema = new mongoose.Schema({
  userID: { type: String, required: true },
  time: { type: Number, required: true },
  message: { type: String, required: true },
});

export default mongoose.model('Reminder', reminderSchema);