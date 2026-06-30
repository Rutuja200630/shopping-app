import { body, param } from 'express-validator';
import { validate } from './authValidator.js';

// ── Add / Upsert Cart Item Validator ─────────────────────────────────────────
// POST /api/cart
export const addCartValidator = [
  body('productId')
    .trim()
    .notEmpty().withMessage('Product ID is required.')
    .isMongoId().withMessage('Invalid product ID format.'),
  body('size')
    .trim()
    .notEmpty().withMessage('Size is required.'),
  body('quantity')
    .optional()
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer.'),
  validate
];

// ── Update Cart Item Validator ────────────────────────────────────────────────
// PUT /api/cart/:id
export const updateCartValidator = [
  param('id')
    .trim()
    .notEmpty().withMessage('Cart item ID is required.')
    .isMongoId().withMessage('Invalid cart item ID format.'),
  body('quantity')
    .optional()
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer.'),
  body('size')
    .optional()
    .trim()
    .notEmpty().withMessage('Size cannot be empty.'),
  validate
];

// ── Cart Item ID Param Validator ──────────────────────────────────────────────
// DELETE /api/cart/:id
export const cartIdValidator = [
  param('id')
    .trim()
    .notEmpty().withMessage('Cart item ID is required.')
    .isMongoId().withMessage('Invalid cart item ID format.'),
  validate
];
