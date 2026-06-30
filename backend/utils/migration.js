import User from '../models/User.js';
import logger from './logger.js';

/**
 * Migrates existing database users who still have `avatar` stored as a string
 * (e.g. "", or direct URL string) to the strict `{ url, publicId }` object shape.
 */
export const migrateLegacyUserAvatars = async () => {
  try {
    // Query directly on the raw MongoDB collection to bypass Mongoose query casting
    const legacyUserDocs = await User.collection.find({ avatar: { $type: 'string' } }).toArray();
    if (legacyUserDocs.length > 0) {
      logger.info(`[Migration] Found ${legacyUserDocs.length} users with legacy string avatar. Normalizing...`);
      for (const rawDoc of legacyUserDocs) {
        // Safe check for string representation
        const rawVal = rawDoc.avatar;
        const legacyAvatar = typeof rawVal === 'string' ? rawVal : '';
        
        // Update direct in MongoDB to bypass mongoose validation / pre-save hooks
        await User.collection.updateOne(
          { _id: rawDoc._id },
          { $set: { avatar: { url: legacyAvatar, publicId: '' } } }
        );
      }
      logger.info(`[Migration] Successfully normalized ${legacyUserDocs.length} users' avatars.`);
    } else {
      logger.info('[Migration] No legacy string avatars found. All users normalized.');
    }
  } catch (err) {
    logger.error(`[Migration] Error during legacy user avatar migration: ${err.message}`);
  }
};
