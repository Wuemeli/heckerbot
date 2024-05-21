import { connect } from 'mongoose';
import { log } from '../functions/functions/log';

export const connectToDatabase = async (): Promise<void> => {
  log('Started connecting to MongoDB...', 'warn');

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined.");
  }

  await connect(process.env.MONGODB_URI).then(() => {
    log('MongoDB is connected to the atlas!', 'done');
  });
};