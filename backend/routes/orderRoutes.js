import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder
} from '../controllers/orderController.js';
import {
  createOrderValidator,
  orderIdValidator
} from '../validators/orderValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All order routes require authentication
router.use(protect);

// ── Order Endpoints ───────────────────────────────────────────────────────────

// POST   /api/orders          — Place new order from cart
router.post('/', createOrderValidator, createOrder);

// GET    /api/orders          — Get order history for logged-in user
router.get('/', getMyOrders);

// GET    /api/orders/:id      — Get single order details (owner only)
router.get('/:id', orderIdValidator, getOrderById);

// PATCH  /api/orders/:id/cancel — Cancel a Pending or Confirmed order
router.patch('/:id/cancel', orderIdValidator, cancelOrder);

export default router;
