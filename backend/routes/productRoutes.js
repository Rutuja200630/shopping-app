import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getAiRecommendedProducts,
  submitProductReview,
  checkReviewEligibility
} from '../controllers/productController.js';
import {
  getProductsValidator,
  getProductBySlugValidator
} from '../validators/productValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Product Routes ───────────────────────────────────────────────────────────

// Featured products must precede parameterized /:slug
router.get('/featured', getFeaturedProducts);

// AI Recommended products must precede parameterized /:slug
router.get('/ai-recommended', getAiRecommendedProducts);

// Catalog listing with search/filter/sort/pagination
router.get('/', getProductsValidator, getProducts);

// Review submission and eligibility check
router.post('/:slug/reviews', protect, submitProductReview);
router.get('/:slug/reviews/eligible', protect, checkReviewEligibility);

// Get single product details by unique slug
router.get('/:slug', getProductBySlugValidator, getProductBySlug);

export default router;
