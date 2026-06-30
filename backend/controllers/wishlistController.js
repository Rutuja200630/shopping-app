import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';
import mongoose from 'mongoose';
import { learnFromProducts } from '../services/fashionMemoryService.js';

// ── GET USER WISHLIST ────────────────────────────────────────────────────────
// GET /api/wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const wishlistItems = await Wishlist.find({ user: req.user._id })
    .populate({
      path: 'product',
      match: { isActive: true },
      select: 'name slug images price originalPrice category occasionTags sizes'
    })
    .lean();

  // Exclude soft-deleted/inactive products (populated as null or undefined)
  const activeWishlist = wishlistItems.filter((item) => item && item.product);

  res.status(200).json(activeWishlist);
});

// ── GET USER WISHLIST COUNT ──────────────────────────────────────────────────
// GET /api/wishlist/count
export const getWishlistCount = asyncHandler(async (req, res) => {
  // Use aggregation to efficiently count only active products linked to user's wishlist
  const result = await Wishlist.aggregate([
    { $match: { user: req.user._id } },
    {
      $lookup: {
        from: 'products', // Collection name of Product model (plural lowercase by default)
        localField: 'product',
        foreignField: '_id',
        as: 'productDoc'
      }
    },
    { $unwind: '$productDoc' },
    { $match: { 'productDoc.isActive': true } },
    { $count: 'count' }
  ]);

  const count = result.length > 0 ? result[0].count : 0;

  res.status(200).json({ count });
});

// ── ADD TO WISHLIST ──────────────────────────────────────────────────────────
// POST /api/wishlist/:productId
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // 1. Verify product exists and is active (respect soft deletes)
  const product = await Product.findOne({ _id: productId, isActive: true }).lean();
  if (!product) {
    res.status(404);
    throw new Error('Product not found or has been deactivated.');
  }

  // 2. Check if product is already in the user's wishlist
  const existingItem = await Wishlist.findOne({ user: req.user._id, product: productId }).lean();
  if (existingItem) {
    res.status(400);
    throw new Error('Product is already in your wishlist.');
  }

  // 3. Create new wishlist item
  const wishlistItem = await Wishlist.create({
    user: req.user._id,
    product: productId
  });

  // Learn from the wishlisted product (weight +3)
  try {
    await learnFromProducts(req.user._id, [productId], 3);
  } catch (err) {
    console.error('Failed to learn from wishlist addition:', err);
  }

  res.status(201).json({
    message: 'Product added to wishlist successfully.',
    wishlistItem
  });
});

// ── REMOVE FROM WISHLIST ─────────────────────────────────────────────────────
// DELETE /api/wishlist/:productId
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const deletedItem = await Wishlist.findOneAndDelete({
    user: req.user._id,
    product: productId
  });

  if (!deletedItem) {
    res.status(404);
    throw new Error('Product not found in your wishlist.');
  }

  res.status(200).json({
    message: 'Product removed from wishlist successfully.'
  });
});

// ── WISHLIST ENTIRE LOOK ─────────────────────────────────────────────────────
// POST /api/wishlist/look
export const addLookToWishlist = asyncHandler(async (req, res) => {
  const { productIds } = req.body;

  if (!productIds || !Array.isArray(productIds)) {
    res.status(400);
    throw new Error('productIds must be an array.');
  }

  // Remove duplicate IDs, nulls, and format checks
  const uniqueIds = [...new Set(productIds.filter(id => id && typeof id === 'string'))];

  let added = 0;
  let skipped = 0;

    const addedIds = [];
    for (const prodId of uniqueIds) {
      if (!mongoose.Types.ObjectId.isValid(prodId)) {
        skipped++;
        continue;
      }

      // Verify product exists and is active
      const product = await Product.findOne({ _id: prodId, isActive: true }).lean();
      if (!product) {
        skipped++;
        continue;
      }

      // Check if product is already in user wishlist
      const exists = await Wishlist.findOne({ user: req.user._id, product: prodId }).lean();
      if (exists) {
        skipped++;
        continue;
      }

      // Add to wishlist
      await Wishlist.create({
        user: req.user._id,
        product: prodId
      });
      addedIds.push(prodId);
      added++;
    }

    if (addedIds.length > 0) {
      try {
        await learnFromProducts(req.user._id, addedIds, 3);
      } catch (err) {
        console.error('Failed to learn from wishlist entire look:', err);
      }
    }

  res.status(200).json({
    success: true,
    added,
    skipped,
    message: `${added} product${added === 1 ? '' : 's'} added to wishlist.`
  });
});
