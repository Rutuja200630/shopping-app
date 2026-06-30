import mongoose from 'mongoose';
import colors from 'colors';
import logger from '../utils/logger.js';
import { migrateLegacyUserAvatars } from '../utils/migration.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    logger.info(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    // Run avatar migration asynchronously in the background once connected
    migrateLegacyUserAvatars();
  } catch (error) {
    logger.warn(`Failed to connect to primary MONGO_URI: ${error.message}. Attempting local fallback...`.yellow);
    try {
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/styleai');
      logger.info(`MongoDB Connected (Local Fallback): ${conn.connection.host}`.cyan.underline);
      // Run avatar migration asynchronously in the background once connected
      migrateLegacyUserAvatars();
    } catch (localError) {
      logger.error(`Database Connection Error: ${localError.message}`.red.bold);
      process.exit(1);
    }
  }
};

export default connectDB;
