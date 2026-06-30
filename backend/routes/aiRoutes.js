import express from 'express';
import {
  getRecommendation,
  getChatResponse,
  testGemini,
  modifyLook,
  getUserPreferences,
  updateUserPreferences
} from '../controllers/aiController.js';
import { optionalProtect, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(optionalProtect);

router.post('/recommend', getRecommendation);
router.post('/chat', getChatResponse);
router.post('/test-gemini', testGemini);
router.post('/modify-look', modifyLook);

router.get('/preferences', protect, getUserPreferences);
router.put('/preferences', protect, updateUserPreferences);

export default router;
