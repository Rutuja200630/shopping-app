import express from 'express';
import {
  register,
  login,
  googleAuth,
  refreshToken,
  logout,
  getMe,
  updatePreferences
} from '../controllers/authController.js';
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress
} from '../controllers/addressController.js';
import {
  registerValidator,
  loginValidator,
  addressValidator,
  preferencesValidator
} from '../validators/authValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Auth Endpoints ───────────────────────────────────────────────────────────
router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/google', googleAuth);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/preferences', protect, preferencesValidator, updatePreferences);

// ── Address Endpoints ────────────────────────────────────────────────────────
router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addressValidator, createAddress);
router.put('/addresses/:id', protect, addressValidator, updateAddress);
router.delete('/addresses/:id', protect, deleteAddress);

export default router;
