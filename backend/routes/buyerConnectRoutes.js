import express from 'express';
import {
  getQuestions,
  askQuestion,
  answerQuestion,
  voteQuestionHelpful,
  getPhotos,
  uploadPhoto,
  votePhotoHelpful,
  getMyContributions,
  getStats
} from '../controllers/buyerConnectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadBuyerConnect } from '../middleware/upload.js';


const router = express.Router();

// ── Public Endpoints ──────────────────────────────────────────────────────────
router.get('/:slug/questions', getQuestions);
router.get('/:slug/photos', getPhotos);
router.get('/:slug/stats', getStats);

// ── Authenticated Endpoints ────────────────────────────────────────────────────
router.post('/:slug/questions', protect, askQuestion);
router.post('/questions/:id/answer', protect, answerQuestion);
router.post('/questions/:id/helpful', protect, voteQuestionHelpful);
router.post('/:slug/photos', protect, uploadBuyerConnect.single('image'), uploadPhoto);
router.post('/photos/:id/helpful', protect, votePhotoHelpful);
router.get('/profile/contributions', protect, getMyContributions);

export default router;
