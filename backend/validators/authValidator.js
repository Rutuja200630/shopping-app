import { body, validationResult } from 'express-validator';

// Generic validation runner middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

// Register validation rules
export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').trim().isEmail().withMessage('Please provide a valid email address.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  validate
];

// Login validation rules
export const loginValidator = [
  body('email').trim().isEmail().withMessage('Please provide a valid email address.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
  validate
];

// Address validation rules
export const addressValidator = [
  body('label').optional().isIn(['Home', 'Office', 'Hostel', 'Other']).withMessage('Invalid address label.'),
  body('street').trim().notEmpty().withMessage('Street address is required.'),
  body('city').trim().notEmpty().withMessage('City is required.'),
  body('state').trim().notEmpty().withMessage('State is required.'),
  body('zipCode').trim().matches(/^[1-9][0-9]{5}$/).withMessage('ZIP code must be a valid 6-digit number.'),
  body('phone').trim().notEmpty().withMessage('Phone number is required.'),
  body('isDefault').optional().isBoolean().withMessage('isDefault must be a boolean.'),
  validate
];

// Preferences validation rules
export const preferencesValidator = [
  body('gender').optional().isIn(['Men', 'Women', 'Unisex', 'None']).withMessage('Invalid gender preference.'),
  body('favoriteOccasions').optional().isArray().withMessage('Favorite occasions must be an array.'),
  body('favoriteColors').optional().isArray().withMessage('Favorite colors must be an array.'),
  body('favoriteStyles').optional().isArray().withMessage('Favorite styles must be an array.'),
  validate
];
