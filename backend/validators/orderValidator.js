import { body, param } from 'express-validator';
import { validate } from './authValidator.js';

// ── Create Order Validator ────────────────────────────────────────────────────
// POST /api/orders
export const createOrderValidator = [
  body('addressId')
    .trim()
    .notEmpty().withMessage('Delivery address ID is required.')
    .isMongoId().withMessage('Invalid address ID format.'),
  body('paymentMethod')
    .trim()
    .notEmpty().withMessage('Payment method is required.')
    .isIn(['COD', 'UPI', 'Card', 'NetBanking', 'Wallet'])
    .withMessage('Payment method must be one of: COD, UPI, Card, NetBanking, Wallet.'),
  validate
];

// ── Order ID Param Validator ──────────────────────────────────────────────────
// GET /api/orders/:id  |  PATCH /api/orders/:id/cancel
export const orderIdValidator = [
  param('id')
    .trim()
    .notEmpty().withMessage('Order ID is required.')
    .isMongoId().withMessage('Invalid order ID format.'),
  validate
];
