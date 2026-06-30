import express from 'express';
import {
  getWishlist,
  getWishlistCount,
  addToWishlist,
  removeFromWishlist,
  addLookToWishlist
} from '../controllers/wishlistController.js';
import { wishlistIdValidator } from '../validators/wishlistValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect middleware to all wishlist routes
router.use(protect);

// ── Wishlist Endpoints ───────────────────────────────────────────────────────

// Get aggregate count of active wishlist items (placed first to avoid param matching conflicts)
router.get('/count', getWishlistCount);

// Get all active wishlisted products
router.get('/', getWishlist);

// Add entire look to user wishlist (placed before :productId route)
router.post('/look', addLookToWishlist);

// Add product to user wishlist
router.post('/:productId', wishlistIdValidator, addToWishlist);

// Remove product from user wishlist
router.delete('/:productId', wishlistIdValidator, removeFromWishlist);

export default router;
