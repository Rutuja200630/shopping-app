import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

/**
 * POST /api/users/avatar
 * Upload a new user avatar to Cloudinary, deleting the old one if it exists.
 */
export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload an image file.');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  // If user already has an avatar in Cloudinary, delete it first
  if (user.avatar && user.avatar.publicId) {
    try {
      await cloudinary.uploader.destroy(user.avatar.publicId);
    } catch (err) {
      console.error('Failed to clean up old avatar from Cloudinary:', err);
    }
  }

  // Update user with new avatar info
  // Mongoose avatar field expects { url, publicId }
  user.avatar = {
    url: req.file.path, // Cloudinary URL populated by multer-storage-cloudinary
    publicId: req.file.filename // Cloudinary public_id
  };

  await user.save();

  res.status(200).json({
    success: true,
    imageUrl: req.file.path
  });
});
