import express from 'express';
import { uploadAvatar } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadAvatars } from '../middleware/upload.js';

const router = express.Router();

// Upload user profile photo
router.post('/avatar', protect, uploadAvatars.single('avatar'), uploadAvatar);

export default router;
