import { query, param } from 'express-validator';
import { validate } from './authValidator.js';

// Validator for GET /api/products query params
export const getProductsValidator = [
  query('search')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Search term cannot be empty if provided.'),

  query('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty.'),

  query('subCategory')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Sub-category cannot be empty.'),

  query('occasion')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Occasion tag cannot be empty.'),

  query('gender')
    .optional()
    .trim()
    .isIn(['Men', 'Women', 'Unisex'])
    .withMessage('Gender must be Men, Women, or Unisex.'),

  query('color')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Color cannot be empty.'),

  query('size')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Size cannot be empty.'),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('minPrice must be a non-negative number.'),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('maxPrice must be a non-negative number.')
    .custom((value, { req }) => {
      if (req.query.minPrice && parseFloat(value) < parseFloat(req.query.minPrice)) {
        throw new Error('maxPrice must be greater than or equal to minPrice.');
      }
      return true;
    }),

  query('sort')
    .optional()
    .isIn(['price_asc', 'price_desc', 'newest', 'rating', 'popular'])
    .withMessage('Invalid sort parameter.'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page number must be a positive integer.'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100.'),

  validate
];

// Validator for GET /api/products/:slug
export const getProductBySlugValidator = [
  param('slug')
    .trim()
    .notEmpty()
    .withMessage('Product slug is required.')
    .matches(/^[a-z0-9-_]+$/)
    .withMessage('Invalid slug format.'),
  validate
];
