import User from '../models/User.js';
import Product from '../models/Product.js';
import { classifyProductRole } from './outfitBuilderService.js';

/**
 * Calculates preference score applying exponential decay based on days since last update.
 * decayedScore = score * 0.98^(daysSinceUpdated)
 * @param {object} item - The preference item containing { score, updatedAt }
 * @returns {number} Decayed preference score
 */
export const calculatePreferenceScore = (item) => {
  if (!item || typeof item.score !== 'number') return 0;
  const daysSinceUpdated = (new Date() - new Date(item.updatedAt)) / (1000 * 60 * 60 * 24);
  return item.score * Math.pow(0.98, Math.max(0, daysSinceUpdated));
};

/**
 * Helper to update a score inside a preference list.
 * Caps scores at 100, limits to 0 minimum.
 */
const updateListItemScore = (list, name, weight) => {
  if (!list || !name) return;
  const normalized = name.trim().toLowerCase();
  if (!normalized) return;

  const existing = list.find(item => item.name.toLowerCase() === normalized);
  if (existing) {
    existing.score = Math.max(0, Math.min(100, existing.score + weight));
    existing.updatedAt = new Date();
  } else if (weight > 0) {
    list.push({
      name: name.trim(),
      score: Math.min(100, weight),
      updatedAt: new Date()
    });
  }
};

/**
 * Retrieves the fashion memory for a user. Initializes if empty.
 * @param {string} userId - Mongo ID of the user.
 * @returns {Promise<object>} User's fashionMemory object.
 */
export const getFashionMemory = async (userId) => {
  const user = await User.findById(userId).select('fashionMemory');
  if (!user) return null;

  if (!user.fashionMemory) {
    user.fashionMemory = {
      favoriteBrands: [],
      dislikedBrands: [],
      favoriteColors: [],
      dislikedColors: [],
      preferredOccasions: [],
      preferredStyles: [],
      preferredFootwear: [],
      preferredAccessories: [],
      minimumBudget: 0,
      maximumBudget: 1000000
    };
    await user.save();
  }
  return user.fashionMemory;
};

/**
 * Updates budget ranges directly.
 */
export const updateFashionMemory = async (userId, updates) => {
  const user = await User.findById(userId);
  if (!user) return null;

  if (!user.fashionMemory) {
    user.fashionMemory = {
      favoriteBrands: [],
      dislikedBrands: [],
      favoriteColors: [],
      dislikedColors: [],
      preferredOccasions: [],
      preferredStyles: [],
      preferredFootwear: [],
      preferredAccessories: [],
      minimumBudget: 0,
      maximumBudget: 1000000
    };
  }

  if (updates.minimumBudget !== undefined) user.fashionMemory.minimumBudget = updates.minimumBudget;
  if (updates.maximumBudget !== undefined) user.fashionMemory.maximumBudget = updates.maximumBudget;

  // Merge direct array updates from profile edits (merging intelligently, not overwriting)
  const listKeys = [
    'favoriteBrands', 'dislikedBrands', 'favoriteColors', 'dislikedColors',
    'preferredOccasions', 'preferredStyles', 'preferredFootwear', 'preferredAccessories'
  ];

  for (const key of listKeys) {
    if (updates[key] && Array.isArray(updates[key])) {
      for (const val of updates[key]) {
        updateListItemScore(user.fashionMemory[key], val, 10);
      }
    }
  }

  await user.save();
  return user.fashionMemory;
};

/**
 * Gradually learns preferences from a single Gemini conversational intent extraction.
 * @param {string} userId - User identifier
 * @param {object} intent - Intent object returned by extractFashionIntent
 */
export const learnFromConversation = async (userId, intent) => {
  if (!userId || !intent) return null;

  const user = await User.findById(userId);
  if (!user) return null;

  if (!user.fashionMemory) {
    user.fashionMemory = {
      favoriteBrands: [], dislikedBrands: [], favoriteColors: [], dislikedColors: [],
      preferredOccasions: [], preferredStyles: [], preferredFootwear: [], preferredAccessories: [],
      minimumBudget: 0, maximumBudget: 1000000
    };
  }

  const mem = user.fashionMemory;
  const weight = 1; // Conversation learning weight

  // 1. Process array likes/dislikes
  if (Array.isArray(intent.favoriteBrands)) {
    intent.favoriteBrands.forEach(b => updateListItemScore(mem.favoriteBrands, b, weight));
  }
  if (Array.isArray(intent.dislikedBrands)) {
    intent.dislikedBrands.forEach(b => updateListItemScore(mem.dislikedBrands, b, weight));
  }
  if (Array.isArray(intent.colors)) {
    intent.colors.forEach(c => updateListItemScore(mem.favoriteColors, c, weight));
  }
  if (Array.isArray(intent.favoriteColors)) {
    intent.favoriteColors.forEach(c => updateListItemScore(mem.favoriteColors, c, weight));
  }
  if (Array.isArray(intent.dislikedColors)) {
    intent.dislikedColors.forEach(c => updateListItemScore(mem.dislikedColors, c, weight));
  }
  if (Array.isArray(intent.preferredFootwear)) {
    intent.preferredFootwear.forEach(f => updateListItemScore(mem.preferredFootwear, f, weight));
  }
  if (Array.isArray(intent.preferredAccessories)) {
    intent.preferredAccessories.forEach(a => updateListItemScore(mem.preferredAccessories, a, weight));
  }
  if (Array.isArray(intent.preferredStyles)) {
    intent.preferredStyles.forEach(s => updateListItemScore(mem.preferredStyles, s, weight));
  }

  // Single occasion extraction
  if (intent.occasion) {
    updateListItemScore(mem.preferredOccasions, intent.occasion, weight);
  }
  if (Array.isArray(intent.preferredOccasions)) {
    intent.preferredOccasions.forEach(occ => updateListItemScore(mem.preferredOccasions, occ, weight));
  }

  // Style tags extraction
  if (intent.style) {
    updateListItemScore(mem.preferredStyles, intent.style, weight);
  }

  // 2. Budget learning
  if (typeof intent.preferredPriceMin === 'number') {
    mem.minimumBudget = intent.preferredPriceMin;
  }
  if (typeof intent.preferredPriceMax === 'number') {
    mem.maximumBudget = intent.preferredPriceMax;
  } else if (typeof intent.budget === 'number') {
    mem.maximumBudget = intent.budget;
  }

  await user.save();
  return user.fashionMemory;
};

/**
 * Learns preferences from a collection of product IDs directly (e.g. Wishlist, Cart, Purchase, Replacement).
 * @param {string} userId - User identifier
 * @param {Array<string>} productIds - Array of Product Mongo IDs
 * @param {number} weight - Action weight
 */
export const learnFromProducts = async (userId, productIds, weight) => {
  if (!userId || !productIds || productIds.length === 0) return null;

  const user = await User.findById(userId);
  if (!user) return null;

  if (!user.fashionMemory) {
    user.fashionMemory = {
      favoriteBrands: [], dislikedBrands: [], favoriteColors: [], dislikedColors: [],
      preferredOccasions: [], preferredStyles: [], preferredFootwear: [], preferredAccessories: [],
      minimumBudget: 0, maximumBudget: 1000000
    };
  }

  const mem = user.fashionMemory;
  const products = await Product.find({ _id: { $in: productIds } }).lean();

  for (const prod of products) {
    // Learn Brand
    if (prod.brand) {
      updateListItemScore(mem.favoriteBrands, prod.brand, weight);
    }

    // Learn Colors
    if (Array.isArray(prod.colors)) {
      prod.colors.forEach(col => updateListItemScore(mem.favoriteColors, col, weight));
    }

    // Learn Occasions
    if (Array.isArray(prod.occasionTags)) {
      prod.occasionTags.forEach(occ => updateListItemScore(mem.preferredOccasions, occ, weight));
    }

    // Learn Footwear & Accessories
    const role = classifyProductRole(prod);
    if (role === 'footwear' && prod.subCategory) {
      updateListItemScore(mem.preferredFootwear, prod.subCategory, weight);
    } else if (role === 'accessory' && prod.subCategory) {
      updateListItemScore(mem.preferredAccessories, prod.subCategory, weight);
    }

    // Learn Styles
    if (prod.material) {
      updateListItemScore(mem.preferredStyles, prod.material, weight);
    }
    if (prod.category) {
      updateListItemScore(mem.preferredStyles, prod.category, weight);
    }
  }

  await user.save();
  return user.fashionMemory;
};

/**
 * Gradually learns preferences from outfit looks by extracting item IDs and delegating.
 * @param {string} userId - User identifier
 * @param {object} look - The outfit look object containing items slots
 * @param {number} weight - Action confidence weight (Save=+2, Wishlist=+3, Cart=+5, Purchase=+10)
 */
export const learnFromLook = async (userId, look, weight) => {
  if (!userId || !look || !look.items) return null;

  const productIds = [];
  for (const slot of ['main', 'footwear', 'accessory', 'layer']) {
    const item = look.items[slot];
    const pid = item?._id || item?.id || item?.productId;
    if (pid) {
      productIds.push(pid);
    }
  }

  return learnFromProducts(userId, productIds, weight);
};

/**
 * Removes a specific preference chip (by reducing its score to 0).
 */
export const removePreference = async (userId, category, value) => {
  const user = await User.findById(userId);
  if (!user || !user.fashionMemory) return null;

  const mem = user.fashionMemory;
  const list = mem[category];

  if (Array.isArray(list)) {
    const normalized = value.trim().toLowerCase();
    const existing = list.find(item => item.name.toLowerCase() === normalized);
    if (existing) {
      existing.score = 0;
      existing.updatedAt = new Date();
    }
  }

  await user.save();
  return user.fashionMemory;
};

/**
 * Decays user's preferences locally without modifying the original database values.
 * Returns a cloned object representing the effective fashion preferences model.
 * @param {object} memory - The user's embedded fashionMemory object.
 * @returns {object} Cloned fashionMemory object with decayed scores.
 */
export const applyPreferenceDecay = (memory) => {
  if (!memory) return null;

  const decayed = JSON.parse(JSON.stringify(memory));
  const listKeys = [
    'favoriteBrands', 'dislikedBrands', 'favoriteColors', 'dislikedColors',
    'preferredOccasions', 'preferredStyles', 'preferredFootwear', 'preferredAccessories'
  ];

  for (const key of listKeys) {
    if (Array.isArray(decayed[key])) {
      decayed[key] = decayed[key].map(item => {
        const days = (new Date() - new Date(item.updatedAt)) / (1000 * 60 * 60 * 24);
        const decayedScore = item.score * Math.pow(0.98, Math.max(0, days));
        return {
          name: item.name,
          score: decayedScore,
          updatedAt: item.updatedAt
        };
      });
    }
  }

  return decayed;
};

/**
 * Returns a high-confidence preferences summary (effective decayed score >= 3).
 * Useful for frontend chips list and Gemini prompt merging.
 * @param {object} memory - The user's fashionMemory object.
 * @returns {object} High-confidence categorized summary of likes and dislikes.
 */
export const getTopPreferences = (memory) => {
  if (!memory) return { likes: {}, dislikes: {}, minBudget: 0, maxBudget: 1000000 };

  const decayed = applyPreferenceDecay(memory);

  const filterTop = (list) => {
    if (!Array.isArray(list)) return [];
    return list.filter(item => item.score >= 3).map(item => item.name);
  };

  return {
    likes: {
      brands: filterTop(decayed.favoriteBrands),
      colors: filterTop(decayed.favoriteColors),
      styles: filterTop(decayed.preferredStyles),
      footwear: filterTop(decayed.preferredFootwear),
      accessories: filterTop(decayed.preferredAccessories),
      occasions: filterTop(decayed.preferredOccasions)
    },
    dislikes: {
      brands: filterTop(decayed.dislikedBrands),
      colors: filterTop(decayed.dislikedColors)
    },
    minBudget: decayed.minimumBudget || 0,
    maxBudget: decayed.maximumBudget || 1000000
  };
};
