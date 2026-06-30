import SavedLook from '../models/SavedLook.js';
import asyncHandler from '../utils/asyncHandler.js';
import { learnFromLook } from '../services/fashionMemoryService.js';

// ── SAVE A LOOK ──────────────────────────────────────────────────────────────
// POST /api/looks
export const saveLook = asyncHandler(async (req, res) => {
  const { title, stylistNote, totalPrice, items } = req.body;

  // 1. Validate basic inputs
  if (!title) {
    res.status(400);
    throw new Error('Look title is required.');
  }
  if (!items || !items.main) {
    res.status(400);
    throw new Error('Main outfit item is required to save a look.');
  }
  if (typeof totalPrice !== 'number') {
    res.status(400);
    throw new Error('Valid total price is required.');
  }

  // Validate items.main properties
  const { main } = items;
  if (!main.productId || !main.name || !main.slug || typeof main.price !== 'number') {
    res.status(400);
    throw new Error('Malformed request: Main item must contain productId, name, slug, and price.');
  }

  const mainProductId = main.productId.toString();

  // 2. Prevent duplicate saves of the exact same look by checking DB
  const existingLook = await SavedLook.findOne({
    user: req.user._id,
    title,
    'items.main.productId': mainProductId
  }).lean();

  if (existingLook) {
    res.status(409);
    throw new Error("You've already saved this look.");
  }

  // 3. Create the saved look record
  const savedLook = await SavedLook.create({
    user: req.user._id,
    title,
    stylistNote,
    totalPrice,
    items: {
      main: {
        productId: mainProductId,
        name: main.name,
        slug: main.slug,
        image: main.image || (Array.isArray(main.images) ? main.images[0] : main.images),
        price: main.price,
        brand: main.brand
      },
      footwear: items.footwear ? {
        productId: items.footwear.productId || items.footwear._id || items.footwear.id,
        name: items.footwear.name,
        slug: items.footwear.slug,
        image: items.footwear.image || (Array.isArray(items.footwear.images) ? items.footwear.images[0] : items.footwear.images),
        price: items.footwear.price,
        brand: items.footwear.brand
      } : undefined,
      accessory: items.accessory ? {
        productId: items.accessory.productId || items.accessory._id || items.accessory.id,
        name: items.accessory.name,
        slug: items.accessory.slug,
        image: items.accessory.image || (Array.isArray(items.accessory.images) ? items.accessory.images[0] : items.accessory.images),
        price: items.accessory.price,
        brand: items.accessory.brand
      } : undefined,
      layer: items.layer ? {
        productId: items.layer.productId || items.layer._id || items.layer.id,
        name: items.layer.name,
        slug: items.layer.slug,
        image: items.layer.image || (Array.isArray(items.layer.images) ? items.layer.images[0] : items.layer.images),
        price: items.layer.price,
        brand: items.layer.brand
      } : undefined
    }
  });

  // Learn from the saved look (weight +2)
  try {
    await learnFromLook(req.user._id, savedLook, 2);
  } catch (err) {
    console.error('Failed to learn from saved look:', err);
  }

  res.status(201).json(savedLook);
});

// ── GET USER SAVED LOOKS ──────────────────────────────────────────────────────
// GET /api/looks
export const getSavedLooks = asyncHandler(async (req, res) => {
  const looks = await SavedLook.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(looks);
});

// ── DELETE SAVED LOOK ─────────────────────────────────────────────────────────
// DELETE /api/looks/:id
export const deleteSavedLook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const savedLook = await SavedLook.findById(id);

  if (!savedLook) {
    res.status(404);
    throw new Error('Saved look not found.');
  }

  // Check if owner of the saved look is the logged in user
  if (savedLook.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete another user\'s look.');
  }

  await savedLook.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Saved look deleted successfully.'
  });
});
