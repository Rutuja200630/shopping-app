import { body, param } from 'express-validator';
import { validate } from './authValidator.js';

// ── Product Create Validator ──────────────────────────────────────────────────
export const productCreateValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required.'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Product description is required.'),
  
  body('brand')
    .optional()
    .trim()
    .notEmpty().withMessage('Brand name cannot be empty.'),
  
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required.'),
  
  body('subCategory')
    .trim()
    .notEmpty().withMessage('Sub-category is required.'),
  
  body('material')
    .trim()
    .notEmpty().withMessage('Material is required.'),
  
  body('fit')
    .trim()
    .notEmpty().withMessage('Fit is required.'),
  
  body('gender')
    .trim()
    .isIn(['Men', 'Women', 'Unisex']).withMessage('Gender must be Men, Women, or Unisex.'),
  
  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number.'),
  
  body('originalPrice')
    .isFloat({ min: 0 }).withMessage('Original price must be a non-negative number.'),
  
  body('discount')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('Discount must be between 0% and 100%.'),
  
  body('images')
    .isArray({ min: 1 }).withMessage('Product images must be an array with at least one image URL.'),
  
  body('images.*')
    .trim()
    .notEmpty().withMessage('Image URL cannot be empty.'),

  body('sizes')
    .isArray({ min: 1 }).withMessage('Product sizes must be an array with at least one size.'),
  
  body('sizes.*')
    .trim()
    .notEmpty().withMessage('Size name cannot be empty.'),

  body('colors')
    .optional()
    .isArray().withMessage('Colors must be an array.'),
  
  body('colors.*')
    .trim()
    .notEmpty().withMessage('Color cannot be empty.'),

  body('inventory')
    .optional()
    .isInt({ min: 0 }).withMessage('Inventory must be a non-negative integer.'),

  body('occasionTags')
    .isArray({ min: 1 }).withMessage('Occasion tags must be an array with at least one occasion tag.'),
  
  body('occasionTags.*')
    .trim()
    .notEmpty().withMessage('Occasion tag cannot be empty.'),

  body('featured')
    .optional()
    .isBoolean().withMessage('Featured must be a boolean value.'),

  body('aiRecommended')
    .optional()
    .isBoolean().withMessage('aiRecommended must be a boolean value.'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean value.'),

  validate
];

// ── Product Update Validator ──────────────────────────────────────────────────
export const productUpdateValidator = [
  param('id')
    .isMongoId().withMessage('Invalid product ID format.'),

  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Product name cannot be empty.'),
  
  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('Product description cannot be empty.'),
  
  body('brand')
    .optional()
    .trim()
    .notEmpty().withMessage('Brand name cannot be empty.'),
  
  body('category')
    .optional()
    .trim()
    .notEmpty().withMessage('Category cannot be empty.'),
  
  body('subCategory')
    .optional()
    .trim()
    .notEmpty().withMessage('Sub-category cannot be empty.'),
  
  body('material')
    .optional()
    .trim()
    .notEmpty().withMessage('Material cannot be empty.'),
  
  body('fit')
    .optional()
    .trim()
    .notEmpty().withMessage('Fit cannot be empty.'),
  
  body('gender')
    .optional()
    .trim()
    .isIn(['Men', 'Women', 'Unisex']).withMessage('Gender must be Men, Women, or Unisex.'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number.'),
  
  body('originalPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Original price must be a non-negative number.'),
  
  body('discount')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('Discount must be between 0% and 100%.'),
  
  body('images')
    .optional()
    .isArray({ min: 1 }).withMessage('Product images must be an array with at least one image URL.'),
  
  body('images.*')
    .optional()
    .trim()
    .notEmpty().withMessage('Image URL cannot be empty.'),

  body('sizes')
    .optional()
    .isArray({ min: 1 }).withMessage('Product sizes must be an array with at least one size.'),
  
  body('sizes.*')
    .optional()
    .trim()
    .notEmpty().withMessage('Size name cannot be empty.'),

  body('colors')
    .optional()
    .isArray().withMessage('Colors must be an array.'),
  
  body('colors.*')
    .optional()
    .trim()
    .notEmpty().withMessage('Color cannot be empty.'),

  body('inventory')
    .optional()
    .isInt({ min: 0 }).withMessage('Inventory must be a non-negative integer.'),

  body('occasionTags')
    .optional()
    .isArray({ min: 1 }).withMessage('Occasion tags must be an array with at least one occasion tag.'),
  
  body('occasionTags.*')
    .optional()
    .trim()
    .notEmpty().withMessage('Occasion tag cannot be empty.'),

  body('featured')
    .optional()
    .isBoolean().withMessage('Featured must be a boolean value.'),

  body('aiRecommended')
    .optional()
    .isBoolean().withMessage('aiRecommended must be a boolean value.'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean value.'),

  validate
];

// ── Order Status Validator ────────────────────────────────────────────────────
export const orderStatusValidator = [
  param('id')
    .isMongoId().withMessage('Invalid order ID format.'),
  
  body('status')
    .trim()
    .isIn(['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'])
    .withMessage('Invalid order status. Status must be one of: Pending, Confirmed, Packed, Shipped, Delivered, Cancelled.'),
  
  validate
];

// ── User Role Update Validator ─────────────────────────────────────────────────
export const userRoleUpdateValidator = [
  param('id')
    .isMongoId().withMessage('Invalid user ID format.'),
  
  body('role')
    .trim()
    .isIn(['user', 'influencer', 'admin'])
    .withMessage('Invalid role. Role must be user, influencer, or admin.'),
  
  validate
];

// ── Product Inventory Update Validator ─────────────────────────────────────────
export const inventoryUpdateValidator = [
  param('id')
    .isMongoId().withMessage('Invalid product ID format.'),
  
  body('inventory')
    .isInt({ min: 0 })
    .withMessage('Inventory must be a non-negative integer.'),
  
  validate
];
