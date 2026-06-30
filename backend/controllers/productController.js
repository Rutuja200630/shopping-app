import Product from '../models/Product.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import asyncHandler from '../utils/asyncHandler.js';

// ── GET ALL PRODUCTS (FILTERED, PAGINATED, SORTED) ───────────────────────────
// GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    subCategory,
    occasion,
    gender,
    color,
    size,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 40
  } = req.query;

  // Build query
  const query = { isActive: true };

  // 1. Case-insensitive Regex Partial Matching across all fields
  if (search) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { name: searchRegex },
      { brand: searchRegex },
      { category: searchRegex },
      { subCategory: searchRegex },
      { description: searchRegex },
      { material: searchRegex },
      { colors: searchRegex },
      { occasionTags: searchRegex }
    ];
  }

  // 2. Exact Filters
  if (category) {
    query.category = category;
  }
  if (subCategory) {
    query.subCategory = subCategory;
  }
  if (gender) {
    query.gender = gender;
  }
  if (color) {
    query.colors = color; // MongoDB matches value in array
  }
  if (size) {
    query.sizes = size; // MongoDB matches value in array
  }
  if (occasion) {
    query.occasionTags = occasion; // MongoDB matches value in array
  }

  // 3. Price Filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) {
      query.price.$gte = Number(minPrice);
    }
    if (maxPrice) {
      query.price.$lte = Number(maxPrice);
    }
  }

  // Determine Sorting
  let sortCriteria = {};
  if (sort) {
    switch (sort) {
      case 'price_asc':
        sortCriteria = { price: 1 };
        break;
      case 'price_desc':
        sortCriteria = { price: -1 };
        break;
      case 'newest':
        sortCriteria = { createdAt: -1 };
        break;
      case 'rating':
        sortCriteria = { ratings: -1 };
        break;
      case 'popular':
        sortCriteria = { reviewsCount: -1 };
        break;
      default:
        sortCriteria = { createdAt: -1 };
    }
  } else {
    // Default sort
    sortCriteria = { createdAt: -1 };
  }

  // Pagination Parsing
  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const skip = (parsedPage - 1) * parsedLimit;

  // Execute queries in parallel for efficiency
  const [products, totalProducts] = await Promise.all([
    Product.find(query)
      .sort(sortCriteria)
      .skip(skip)
      .limit(parsedLimit)
      .lean(),
    Product.countDocuments(query)
  ]);

  const totalPages = Math.ceil(totalProducts / parsedLimit);
  res.status(200).json({
    products,
    currentPage: parsedPage,
    totalPages,
    totalProducts,
    hasNextPage: parsedPage < totalPages,
    hasPreviousPage: parsedPage > 1
  });
});

// ── GET PRODUCT BY SLUG ──────────────────────────────────────────────────────
// GET /api/products/:slug
export const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug, isActive: true }).lean();
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  // Run related products lookup and reviews fetching in parallel
  const [reviews, relatedProducts] = await Promise.all([
    Review.find({ product: product._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .lean(),
    Product.find({
      _id: { $ne: product._id },
      isActive: true,
      $or: [
        { category: product.category },
        { occasionTags: { $in: product.occasionTags } }
      ]
    })
      .limit(4)
      .lean()
  ]);

  // Review Summary formatting
  const reviewSummary = {
    ratings: product.ratings,
    reviewsCount: product.reviewsCount,
    reviewsList: reviews
  };

  res.status(200).json({
    product,
    reviewSummary,
    relatedProducts
  });
});

// ── GET FEATURED PRODUCTS ────────────────────────────────────────────────────
// GET /api/products/featured
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
  
  const products = await Product.find({ featured: true, isActive: true })
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(products);
});

// ── GET AI RECOMMENDED PRODUCTS ──────────────────────────────────────────────
// GET /api/products/ai-recommended
export const getAiRecommendedProducts = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

  const products = await Product.find({ aiRecommended: true, isActive: true })
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(products);
});

// ── SUBMIT/UPDATE PRODUCT REVIEW ─────────────────────────────────────────────
// POST /api/products/:slug/reviews
export const submitProductReview = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { rating, review, images } = req.body;

  if (!rating || !review) {
    res.status(400);
    throw new Error('Rating and review text are required.');
  }

  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    res.status(400);
    throw new Error('Rating must be a number between 1 and 5.');
  }

  const product = await Product.findOne({ slug, isActive: true });
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  // Check if user has purchased this product
  const hasPurchased = await Order.exists({
    user: req.user._id,
    'items.product': product._id
  });

  if (!hasPurchased) {
    res.status(403);
    throw new Error('You must purchase this product before you can submit a review.');
  }

  // Check if review already exists for this user + product
  let reviewDoc = await Review.findOne({ user: req.user._id, product: product._id });

  if (reviewDoc) {
    // Edit existing review
    reviewDoc.rating = numRating;
    reviewDoc.review = review;
    reviewDoc.images = images || [];
    await reviewDoc.save();
  } else {
    // Create new review
    reviewDoc = new Review({
      user: req.user._id,
      product: product._id,
      rating: numRating,
      review,
      images: images || [],
      isVerifiedPurchase: true
    });
    await reviewDoc.save();
  }

  // Recalculate product ratings and reviews count
  const allProductReviews = await Review.find({ product: product._id });
  const reviewsCount = allProductReviews.length;
  const ratingSum = allProductReviews.reduce((sum, r) => sum + r.rating, 0);

  product.ratings = reviewsCount > 0 ? Number((ratingSum / reviewsCount).toFixed(1)) : 0;
  product.reviewsCount = reviewsCount;
  await product.save();

  res.status(200).json({
    message: 'Review submitted successfully.',
    review: reviewDoc,
    product: {
      ratings: product.ratings,
      reviewsCount: product.reviewsCount
    }
  });
});

// ── CHECK REVIEW ELIGIBILITY ──────────────────────────────────────────────────
// GET /api/products/:slug/reviews/eligible
export const checkReviewEligibility = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug, isActive: true });
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  const hasPurchased = await Order.exists({
    user: req.user._id,
    'items.product': product._id
  });

  res.status(200).json({
    eligible: !!hasPurchased
  });
});
