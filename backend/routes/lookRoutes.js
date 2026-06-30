import express from 'express';
import {
  saveLook,
  getSavedLooks,
  deleteSavedLook
} from '../controllers/lookController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect middleware to all saved look routes
router.use(protect);

router.post('/', saveLook);
router.get('/', getSavedLooks);
router.delete('/:id', deleteSavedLook);

export default router;
