import express from 'express';
import {
  getCart,
  getCartCount,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  addLookToCart
} from '../controllers/cartController.js';
import {
  addCartValidator,
  updateCartValidator,
  cartIdValidator
} from '../validators/cartValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication to all cart routes
router.use(protect);

// ── Cart Endpoints ───────────────────────────────────────────────────────────

// GET  /api/cart/count  — total quantity for navbar badge (placed before '/:id' to avoid conflict)
router.get('/count', getCartCount);

// GET  /api/cart        — full cart with populated product details
router.get('/', getCart);

// POST /api/cart/look   — add entire styled look to cart
router.post('/look', addLookToCart);

// POST /api/cart        — add item (upserts if same product+size exists)
router.post('/', addCartValidator, addToCart);

// PUT  /api/cart/:id    — update quantity or size
router.put('/:id', updateCartValidator, updateCartItem);

// DELETE /api/cart/:id  — remove single item
router.delete('/:id', cartIdValidator, removeCartItem);

// DELETE /api/cart      — clear entire cart (must be before /:id)
router.delete('/', clearCart);

export default router;
