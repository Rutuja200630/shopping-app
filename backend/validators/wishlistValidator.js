import { param } from 'express-validator';
import { validate } from './authValidator.js';

// Validator for routes expecting a productId param in route details
export const wishlistIdValidator = [
  param('productId')
    .trim()
    .notEmpty()
    .withMessage('Product ID is required.')
    .isMongoId()
    .withMessage('Invalid product ID format.'),
  validate
];
