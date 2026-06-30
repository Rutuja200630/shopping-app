import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';
import mongoose from 'mongoose';
import { learnFromProducts } from '../services/fashionMemoryService.js';

// ── GET USER CART ─────────────────────────────────────────────────────────────
// GET /api/cart
export const getCart = asyncHandler(async (req, res) => {
  const cartItems = await Cart.find({ user: req.user._id })
    .populate({
      path: 'product',
      match: { isActive: true },
      select: 'name slug images price originalPrice category sizes'
    })
    .lean();

  // Filter out items whose product has been deactivated/deleted
  const activeItems = cartItems.filter((item) => item && item.product);

  res.status(200).json(activeItems);
});

// ── GET CART COUNT ────────────────────────────────────────────────────────────
// GET /api/cart/count
// Returns sum of all quantities (not number of distinct items)
export const getCartCount = asyncHandler(async (req, res) => {
  const result = await Cart.aggregate([
    { $match: { user: req.user._id } },
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'productDoc'
      }
    },
    { $unwind: '$productDoc' },
    { $match: { 'productDoc.isActive': true } },
    {
      $group: {
        _id: null,
        totalQuantity: { $sum: '$quantity' }
      }
    }
  ]);

  const count = result.length > 0 ? result[0].totalQuantity : 0;
  res.status(200).json({ count });
});

// ── ADD TO CART ───────────────────────────────────────────────────────────────
// POST /api/cart
// Upserts: if same user + product + size exists, increments quantity
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, size, quantity = 1 } = req.body;

  // 1. Verify product exists and is active
  const product = await Product.findOne({ _id: productId, isActive: true }).lean();
  if (!product) {
    res.status(404);
    throw new Error('Product not found or has been deactivated.');
  }

  // 2. Validate selected size is available for this product
  if (!product.sizes.includes(size)) {
    res.status(400);
    throw new Error(`Size "${size}" is not available for this product. Available sizes: ${product.sizes.join(', ')}.`);
  }

  // 3. Upsert: find existing row and increment OR create new
  const existing = await Cart.findOne({ user: req.user._id, product: productId, size });

  if (existing) {
    existing.quantity += Number(quantity);
    await existing.save();

    const populated = await Cart.findById(existing._id)
      .populate('product', 'name slug images price originalPrice category sizes')
      .lean();

    return res.status(200).json({
      message: 'Cart quantity updated.',
      cartItem: populated
    });
  }

  // 4. Create new cart entry
  const cartItem = await Cart.create({
    user: req.user._id,
    product: productId,
    size,
    quantity: Number(quantity)
  });

  // Learn from the carted product (weight +5)
  try {
    await learnFromProducts(req.user._id, [productId], 5);
  } catch (err) {
    console.error('Failed to learn from cart addition:', err);
  }

  const populated = await Cart.findById(cartItem._id)
    .populate('product', 'name slug images price originalPrice category sizes')
    .lean();

  res.status(201).json({
    message: 'Product added to cart successfully.',
    cartItem: populated
  });
});

// ── UPDATE CART ITEM ──────────────────────────────────────────────────────────
// PUT /api/cart/:id
export const updateCartItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity, size } = req.body;

  const cartItem = await Cart.findOne({ _id: id, user: req.user._id });
  if (!cartItem) {
    res.status(404);
    throw new Error('Cart item not found or does not belong to you.');
  }

  // If size is being updated, validate it against the product's available sizes
  if (size && size !== cartItem.size) {
    const product = await Product.findById(cartItem.product).lean();
    if (product && !product.sizes.includes(size)) {
      res.status(400);
      throw new Error(`Size "${size}" is not available for this product. Available sizes: ${product.sizes.join(', ')}.`);
    }

    // Check if the new size combination already exists to prevent duplicates
    const duplicate = await Cart.findOne({
      user: req.user._id,
      product: cartItem.product,
      size,
      _id: { $ne: id }
    });
    if (duplicate) {
      res.status(400);
      throw new Error(`You already have this product in size "${size}" in your cart.`);
    }

    cartItem.size = size;
  }

  if (quantity !== undefined) {
    cartItem.quantity = Number(quantity);
  }

  await cartItem.save();

  const populated = await Cart.findById(cartItem._id)
    .populate('product', 'name slug images price originalPrice category sizes')
    .lean();

  res.status(200).json({
    message: 'Cart item updated successfully.',
    cartItem: populated
  });
});

// ── REMOVE CART ITEM ──────────────────────────────────────────────────────────
// DELETE /api/cart/:id
export const removeCartItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await Cart.findOneAndDelete({ _id: id, user: req.user._id });
  if (!deleted) {
    res.status(404);
    throw new Error('Cart item not found or does not belong to you.');
  }

  res.status(200).json({ message: 'Cart item removed successfully.' });
});

// ── CLEAR ENTIRE CART ─────────────────────────────────────────────────────────
// DELETE /api/cart
export const clearCart = asyncHandler(async (req, res) => {
  await Cart.deleteMany({ user: req.user._id });
  res.status(200).json({ message: 'Cart cleared successfully.' });
});

// ── ADD ENTIRE LOOK TO CART ──────────────────────────────────────────────────
// POST /api/cart/look
export const addLookToCart = asyncHandler(async (req, res) => {
  const { productIds } = req.body;

  if (!productIds || !Array.isArray(productIds)) {
    res.status(400);
    throw new Error('productIds must be an array.');
  }

  // Remove duplicate IDs, nulls, and format check
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

    // Verify product is in stock (inventory > 0)
    if (typeof product.inventory === 'number' && product.inventory <= 0) {
      skipped++;
      continue;
    }

    // Check if product is already in user cart
    const exists = await Cart.findOne({ user: req.user._id, product: prodId }).lean();
    if (exists) {
      skipped++;
      continue;
    }

    // Choose size: "M" if available, else first size, else skip
    let selectedSize = '';
    const sizes = Array.isArray(product.sizes) ? product.sizes : [];
    if (sizes.includes('M')) {
      selectedSize = 'M';
    } else if (sizes.length > 0) {
      selectedSize = sizes[0];
    } else {
      skipped++;
      continue;
    }

    // Add to cart with quantity 1
    await Cart.create({
      user: req.user._id,
      product: prodId,
      size: selectedSize,
      quantity: 1
    });
    addedIds.push(prodId);
    added++;
  }

  if (addedIds.length > 0) {
    try {
      await learnFromProducts(req.user._id, addedIds, 5);
    } catch (err) {
      console.error('Failed to learn from cart entire look:', err);
    }
  }

  res.status(200).json({
    success: true,
    added,
    skipped,
    message: `${added} product${added === 1 ? '' : 's'} added to cart.`
  });
});
