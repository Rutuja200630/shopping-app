import mongoose from 'mongoose';

/**
 * Normalizes a product into the exact minimal shape used in API responses and look slots.
 */
export const toMinimalProduct = (product) => {
  if (!product) return null;
  const idStr = product._id ? product._id.toString() : '';
  return {
    _id: idStr,
    name: product.name || '',
    slug: product.slug || '',
    price: typeof product.price === 'number' ? product.price : 0,
    images: Array.isArray(product.images) ? product.images : (product.images ? [product.images] : []),
    category: product.category || '',
    brand: product.brand || 'StyleAI'
  };
};

/**
 * Classifies a product into main, footwear, accessory, or layer.
 */
export const classifyProductRole = (product) => {
  if (!product) return null;
  const category = (product.category || '').toLowerCase();
  const subCategory = (product.subCategory || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();

  const footwearKeywords = ['heels', 'shoes', 'loafers', 'sneakers', 'juttis', 'sandals', 'flats', 'boots', 'pumps', 'footwear', 'mojaris'];
  if (
    footwearKeywords.includes(subCategory) ||
    footwearKeywords.some(kw => name.includes(kw)) ||
    category === 'footwear'
  ) {
    return 'footwear';
  }

  const accessoryKeywords = ['clutch', 'handbag', 'belt', 'necklace', 'earrings', 'watch', 'bracelet', 'jewelry', 'bag', 'ring', 'potli', 'accessories', 'watches', 'handbags', 'belts', 'sunglasses', 'scarf', 'tote bag', 'sling bag', 'potli bag'];
  if (
    accessoryKeywords.includes(subCategory) ||
    accessoryKeywords.some(kw => name.includes(kw)) ||
    category === 'accessories'
  ) {
    return 'accessory';
  }

  const layerKeywords = ['blazer', 'jacket', 'shrug', 'shawl', 'cardigan', 'trench', 'coat', 'overlay', 'outerwear', 'shawls', 'blazers', 'jackets', 'sweaters', 'cardigans'];
  if (
    layerKeywords.includes(subCategory) ||
    layerKeywords.some(kw => name.includes(kw)) ||
    category === 'outerwear' || category === 'layer'
  ) {
    return 'layer';
  }

  return 'main';
};

/**
 * Groups candidate products into role buckets.
 */
export const groupProductsByRole = (products) => {
  const result = { main: [], footwear: [], accessory: [], layer: [] };
  if (!Array.isArray(products)) return result;
  for (const product of products) {
    if (!product) continue;
    const role = classifyProductRole(product);
    if (role && result[role]) {
      result[role].push(product);
    }
  }
  return result;
};

/**
 * Assigns a deterministic suitability score for a product given user intent.
 */
export const scoreProductForIntent = (product, intent, role) => {
  if (!product || !intent) return 0;
  let score = 0;

  if (product.isActive === false || product.inventory === 0) return -1000;

  // Personalization score modifications
  if (intent.personalization) {
    const p = intent.personalization;
    const brand = (product.brand || '').toLowerCase();
    const subCategory = (product.subCategory || '').toLowerCase();
    const category = (product.category || '').toLowerCase();
    const name = (product.name || '').toLowerCase();
    const desc = (product.description || '').toLowerCase();
    const tags = (product.occasionTags || []).map(t => t.toLowerCase());
    const colors = (product.colors || []).map(c => c.toLowerCase());

    // 1. Favorite Brand: +15
    if (p.likes?.brands && Array.isArray(p.likes.brands)) {
      if (p.likes.brands.some(b => b.toLowerCase() === brand)) {
        score += 15;
      }
    }

    // 2. Disliked Brand: -20
    if (p.dislikes?.brands && Array.isArray(p.dislikes.brands)) {
      if (p.dislikes.brands.some(b => b.toLowerCase() === brand)) {
        score -= 20;
      }
    }

    // 3. Preferred Style: +10
    if (p.likes?.styles && Array.isArray(p.likes.styles)) {
      const matchesStyle = p.likes.styles.some(style => {
        const s = style.toLowerCase();
        return name.includes(s) || desc.includes(s) || tags.includes(s) || subCategory.includes(s) || category.includes(s);
      });
      if (matchesStyle) score += 10;
    }

    // 4. Preferred Occasion: +8
    if (p.likes?.occasions && Array.isArray(p.likes.occasions)) {
      const matchesOcc = p.likes.occasions.some(occ => {
        const o = occ.toLowerCase();
        return tags.includes(o) || name.includes(o) || desc.includes(o) || subCategory.includes(o) || category.includes(o);
      });
      if (matchesOcc) score += 8;
    }

    // 5. Favorite Color: +8
    if (p.likes?.colors && Array.isArray(p.likes.colors)) {
      const matchesCol = p.likes.colors.some(color => {
        const c = color.toLowerCase();
        return colors.includes(c) || name.includes(c) || desc.includes(c);
      });
      if (matchesCol) score += 8;
    }

    // 6. Disliked Color: -20
    if (p.dislikes?.colors && Array.isArray(p.dislikes.colors)) {
      const matchesDiscol = p.dislikes.colors.some(color => {
        const c = color.toLowerCase();
        return colors.includes(c) || name.includes(c) || desc.includes(c);
      });
      if (matchesDiscol) score -= 20;
    }

    // 7. Preferred Footwear (only if footwear role): +8
    if (role === 'footwear' && p.likes?.footwear && Array.isArray(p.likes.footwear)) {
      if (p.likes.footwear.some(f => subCategory.includes(f.toLowerCase()) || name.includes(f.toLowerCase()))) {
        score += 8;
      }
    }

    // 8. Preferred Accessories (only if accessory role): +6
    if (role === 'accessory' && p.likes?.accessories && Array.isArray(p.likes.accessories)) {
      if (p.likes.accessories.some(a => subCategory.includes(a.toLowerCase()) || name.includes(a.toLowerCase()))) {
        score += 6;
      }
    }
  }

  const occasion = intent.occasion ? intent.occasion.toLowerCase() : null;
  const gender = intent.gender ? intent.gender.toLowerCase() : null;
  const budget = intent.budget;
  const colors = (intent.colors || []).map(c => c.toLowerCase());
  const style = intent.style ? intent.style.toLowerCase() : null;

  const prodName = (product.name || '').toLowerCase();
  const prodDesc = (product.description || '').toLowerCase();
  const prodCategory = (product.category || '').toLowerCase();
  const prodSubCategory = (product.subCategory || '').toLowerCase();
  const prodTags = (product.occasionTags || []).map(t => t.toLowerCase());
  const prodGender = (product.gender || '').toLowerCase();

  if (occasion) {
    const matchesOccasion =
      prodTags.includes(occasion) ||
      prodName.includes(occasion) ||
      prodDesc.includes(occasion) ||
      prodSubCategory.includes(occasion) ||
      prodCategory.includes(occasion);
    if (matchesOccasion) score += 40;
  }

  if (gender) {
    if (prodGender === 'unisex') score += 15;
    else if (gender === 'female' && prodGender === 'women') score += 30;
    else if (gender === 'male' && prodGender === 'men') score += 30;
    else score -= 100;
  }

  if (colors && colors.length > 0) {
    const prodColors = (product.colors || []).map(c => c.toLowerCase());
    const matchesColor = colors.some(color =>
      prodColors.includes(color) || prodName.includes(color) || prodDesc.includes(color)
    );
    if (matchesColor) score += 15;
  }

  if (style) {
    const matchesStyle =
      prodName.includes(style) ||
      prodDesc.includes(style) ||
      prodTags.includes(style) ||
      prodSubCategory.includes(style) ||
      prodCategory.includes(style);
    if (matchesStyle) score += 15;
  }

  if (occasion) {
    if (occasion === 'wedding' || occasion === 'festive') {
      if (role === 'footwear') {
        if (['heels', 'juttis', 'mojaris'].some(kw => prodName.includes(kw) || prodSubCategory.includes(kw))) score += 10;
        else if (['sneakers', 'running', 'jogger'].some(kw => prodName.includes(kw))) score -= 15;
      }
      if (role === 'accessory') {
        if (['clutch', 'potli', 'jewelry', 'necklace', 'earrings'].some(kw => prodName.includes(kw) || prodSubCategory.includes(kw))) score += 10;
      }
    } else if (occasion === 'casual' || occasion === 'college') {
      if (role === 'footwear') {
        if (['sneakers', 'flats', 'sandals'].some(kw => prodName.includes(kw) || prodSubCategory.includes(kw))) score += 10;
      }
    } else if (occasion === 'office') {
      if (role === 'footwear') {
        if (['loafers', 'flats', 'shoes'].some(kw => prodName.includes(kw) || prodSubCategory.includes(kw))) score += 10;
      }
    }
  }

  if (budget) {
    if (product.price <= budget) {
      if (role === 'main' && product.price <= budget * 0.7) score += 8;
      else if (role !== 'main' && product.price <= budget * 0.2) score += 5;
    } else {
      score -= 50;
    }
  }

  return score;
};

/**
 * Sorts products descending by score, then shuffles equally-scored items slightly
 * to produce natural variety across looks.
 */
export const sortProductsForRole = (products, intent, role) => {
  if (!Array.isArray(products)) return [];
  return [...products].sort((a, b) => {
    const scoreA = scoreProductForIntent(a, intent, role);
    const scoreB = scoreProductForIntent(b, intent, role);
    if (scoreB !== scoreA) return scoreB - scoreA;
    // Tie-break with light randomness to spread variety
    return Math.random() - 0.5;
  });
};

/**
 * Picks the best product that is budget-safe, has not been used within this look,
 * and (for cross-look diversity) prefers items not already used in previous looks.
 */
export const pickBestCompatibleItem = ({
  candidates,
  usedIds,
  globalUsedIds,
  budgetRemaining,
  intent,
  role
}) => {
  if (!Array.isArray(candidates)) return null;

  // First pass: prefer items unused globally across all looks
  for (const item of candidates) {
    const idStr = item._id.toString();
    if (usedIds.has(idStr)) continue;
    if (globalUsedIds && globalUsedIds.has(idStr)) continue;
    if (budgetRemaining !== undefined && item.price > budgetRemaining) continue;
    return item;
  }

  // Second pass: allow global reuse if no fresh alternatives exist
  for (const item of candidates) {
    const idStr = item._id.toString();
    if (usedIds.has(idStr)) continue;
    if (budgetRemaining !== undefined && item.price > budgetRemaining) continue;
    return item;
  }

  return null;
};

// ── Themed title maps per occasion ──────────────────────────────────────────

const OCCASION_THEMES = {
  wedding: ['Classic Royal', 'Modern Glam', 'Minimal Luxury', 'Heritage Elegance', 'Festive Grace'],
  party: ['Bold & Chic', 'Statement Night', 'Glam Affair', 'Sleek & Edgy', 'Festive Fever'],
  office: ['Executive Formal', 'Smart Casual', 'Minimal Professional', 'Power Dressing', 'Clean Chic'],
  casual: ['Effortless Cool', 'Street Casual', 'Weekend Ease', 'Laid-Back Chic', 'Daily Fresh'],
  college: ['Campus Cool', 'Street Smart', 'Casual Academic', 'Young & Bold', 'Everyday Chic'],
  vacation: ['Beach Relaxed', 'Resort Chic', 'Street Explorer', 'Breezy Traveller', 'Wanderlust Style'],
  festive: ['Ethnic Grandeur', 'Festive Glow', 'Heritage Look', 'Traditional Luxe', 'Celebration Drape'],
  'date night': ['Romantic Chic', 'Intimate Glam', 'Understated Luxury', 'Evening Allure', 'Soft Elegance'],
};

/**
 * Generates a unique themed title for an outfit look based on occasion and index.
 */
export const generateLookTitle = (look, intent, index) => {
  const occasion = (intent.occasion || '').toLowerCase();
  const themes = OCCASION_THEMES[occasion];

  if (themes && themes[index - 1]) {
    return themes[index - 1];
  }

  // Fallback generic title
  const colors = intent.colors || [];
  const style = intent.style;
  let title = '';
  if (colors.length > 0) title += colors[0].charAt(0).toUpperCase() + colors[0].slice(1) + ' ';
  if (style) title += style.charAt(0).toUpperCase() + style.slice(1) + ' ';
  if (occasion) title += occasion.charAt(0).toUpperCase() + occasion.slice(1) + ' ';
  title = title.trim();
  return title ? `${title} Look` : `Styled Look ${index}`;
};

// ── Unique note templates to vary stylist voices across looks ────────────────

const NOTE_OPENERS = [
  (mainName) => `Anchored by the stunning ${mainName}`,
  (mainName) => `Built around the elegant ${mainName}`,
  (mainName) => `The hero piece here is the ${mainName}`,
  (mainName) => `Centred on the beautiful ${mainName}`,
  (mainName) => `This look draws its strength from the ${mainName}`,
];

const NOTE_CONNECTORS = {
  both: [
    (fw, ac) => `, gracefully paired with the ${fw} and finished with the ${ac}`,
    (fw, ac) => `, complemented by the ${fw} and accessorised with the ${ac}`,
    (fw, ac) => ` — grounded by the ${fw} and elevated with the ${ac}`,
    (fw, ac) => `, styled with the ${fw} and punctuated by the ${ac}`,
  ],
  footwearOnly: [
    (fw) => `, completed with the ${fw}`,
    (fw) => ` and paired elegantly with the ${fw}`,
    (fw) => ` — grounded by the ${fw}`,
  ],
  accessoryOnly: [
    (ac) => ` and accented with the ${ac}`,
    (ac) => `, finished with the ${ac}`,
    (ac) => ` — elevated by the ${ac}`,
  ],
};

const NOTE_CLOSERS = {
  occasion: [
    (occ) => ` for a polished ${occ} aesthetic.`,
    (occ) => `, perfectly suited for a ${occ} occasion.`,
    (occ) => ` — a curated choice for ${occ} events.`,
    (occ) => ` to make a lasting impression at your ${occ}.`,
  ],
  budget: [
    () => ` Thoughtfully styled within your budget.`,
    () => ` A complete look crafted to fit your price range.`,
    () => ` Maximum style, minimum spend.`,
  ],
  generic: [
    () => `.`,
    () => ` — a complete, coordinated ensemble.`,
    () => ` for an effortlessly put-together look.`,
  ],
};

const pick = (arr, index) => arr[index % arr.length];

/**
 * Generates a unique, varied stylist note for each look using the look index as a seed.
 */
export const generateLookNote = (look, intent, lookIndex = 0) => {
  const occasion = intent.occasion ? intent.occasion.toLowerCase() : null;
  const mainName = look.items.main?.name || 'outfit';
  const footwearName = look.items.footwear?.name;
  const accessoryName = look.items.accessory?.name;

  let note = pick(NOTE_OPENERS, lookIndex)(mainName);

  if (footwearName && accessoryName) {
    note += pick(NOTE_CONNECTORS.both, lookIndex)(footwearName, accessoryName);
  } else if (footwearName) {
    note += pick(NOTE_CONNECTORS.footwearOnly, lookIndex)(footwearName);
  } else if (accessoryName) {
    note += pick(NOTE_CONNECTORS.accessoryOnly, lookIndex)(accessoryName);
  }

  if (occasion) {
    note += pick(NOTE_CLOSERS.occasion, lookIndex)(occasion);
  } else if (intent.budget) {
    note += pick(NOTE_CLOSERS.budget, lookIndex)();
  } else {
    note += pick(NOTE_CLOSERS.generic, lookIndex)();
  }

  return note;
};

/**
 * Assembles one look combination anchored by a main product.
 * Accepts globalUsedIds to avoid reusing footwear/accessories/layers across looks.
 */
export const buildSingleLook = ({
  mainProduct,
  grouped,
  intent,
  usedGlobalMainIds,
  globalUsedFootwearIds = new Set(),
  globalUsedAccessoryIds = new Set(),
  globalUsedLayerIds = new Set(),
}) => {
  if (!mainProduct) return null;
  const budget = intent.budget;
  const minMain = toMinimalProduct(mainProduct);

  const look = {
    id: '',
    title: '',
    stylistNote: '',
    totalPrice: minMain.price,
    items: { main: minMain, footwear: null, accessory: null, layer: null }
  };

  const usedIds = new Set([mainProduct._id.toString()]);
  let budgetRemaining = budget ? budget - minMain.price : undefined;

  // 1. Footwear — prefer globally unused
  if (grouped.footwear && grouped.footwear.length > 0) {
    const footwearCandidates = sortProductsForRole(grouped.footwear, intent, 'footwear');
    const bestFootwear = pickBestCompatibleItem({
      candidates: footwearCandidates,
      usedIds,
      globalUsedIds: globalUsedFootwearIds,
      budgetRemaining,
      intent,
      role: 'footwear'
    });
    if (bestFootwear) {
      look.items.footwear = toMinimalProduct(bestFootwear);
      look.totalPrice += bestFootwear.price;
      usedIds.add(bestFootwear._id.toString());
      globalUsedFootwearIds.add(bestFootwear._id.toString());
      if (budgetRemaining !== undefined) budgetRemaining -= bestFootwear.price;
    }
  }

  // 2. Accessory — prefer globally unused
  if (grouped.accessory && grouped.accessory.length > 0) {
    const accessoryCandidates = sortProductsForRole(grouped.accessory, intent, 'accessory');
    const bestAccessory = pickBestCompatibleItem({
      candidates: accessoryCandidates,
      usedIds,
      globalUsedIds: globalUsedAccessoryIds,
      budgetRemaining,
      intent,
      role: 'accessory'
    });
    if (bestAccessory) {
      look.items.accessory = toMinimalProduct(bestAccessory);
      look.totalPrice += bestAccessory.price;
      usedIds.add(bestAccessory._id.toString());
      globalUsedAccessoryIds.add(bestAccessory._id.toString());
      if (budgetRemaining !== undefined) budgetRemaining -= bestAccessory.price;
    }
  }

  // 3. Layer — prefer globally unused
  if (grouped.layer && grouped.layer.length > 0) {
    const layerCandidates = sortProductsForRole(grouped.layer, intent, 'layer');
    const bestLayer = pickBestCompatibleItem({
      candidates: layerCandidates,
      usedIds,
      globalUsedIds: globalUsedLayerIds,
      budgetRemaining,
      intent,
      role: 'layer'
    });
    if (bestLayer) {
      look.items.layer = toMinimalProduct(bestLayer);
      look.totalPrice += bestLayer.price;
      usedIds.add(bestLayer._id.toString());
      globalUsedLayerIds.add(bestLayer._id.toString());
    }
  }

  return look;
};

/**
 * Main coordinator that builds up to 3 diverse styled looks.
 * Tracks used products globally to maximise diversity across all looks.
 */
export const buildLooks = ({ products, intent, maxLooks = 3 }) => {
  if (!products || products.length === 0) return [];

  const grouped = groupProductsByRole(products);

  if (!grouped.main || grouped.main.length === 0) return [];

  const rankedMains = sortProductsForRole(grouped.main, intent, 'main');

  const looks = [];
  const usedGlobalMainIds = new Set();
  const duplicateSignatures = new Set();

  // Cross-look shared trackers — force accessories/footwear/layers to rotate
  const globalUsedFootwearIds = new Set();
  const globalUsedAccessoryIds = new Set();
  const globalUsedLayerIds = new Set();

  // Pass 1: Build looks using unique main items
  for (const mainProd of rankedMains) {
    if (looks.length >= maxLooks) break;
    if (usedGlobalMainIds.has(mainProd._id.toString())) continue;

    const look = buildSingleLook({
      mainProduct: mainProd,
      grouped,
      intent,
      usedGlobalMainIds,
      globalUsedFootwearIds,
      globalUsedAccessoryIds,
      globalUsedLayerIds,
    });
    if (!look) continue;

    const signature = [
      look.items.main?._id?.toString() || '',
      look.items.footwear?._id?.toString() || '',
      look.items.accessory?._id?.toString() || '',
      look.items.layer?._id?.toString() || ''
    ].join('|');

    if (duplicateSignatures.has(signature)) continue;

    look.id = 'look_' + Math.random().toString(16).substring(2, 8);
    look.title = generateLookTitle(look, intent, looks.length + 1);
    look.stylistNote = generateLookNote(look, intent, looks.length);

    looks.push(look);
    usedGlobalMainIds.add(mainProd._id.toString());
    duplicateSignatures.add(signature);
  }

  // Pass 2: Fill remaining slots if needed, allowing main re-use but keeping accessories/footwear fresh
  if (looks.length < maxLooks) {
    for (const mainProd of rankedMains) {
      if (looks.length >= maxLooks) break;

      const look = buildSingleLook({
        mainProduct: mainProd,
        grouped,
        intent,
        usedGlobalMainIds,
        globalUsedFootwearIds,
        globalUsedAccessoryIds,
        globalUsedLayerIds,
      });
      if (!look) continue;

      const signature = [
        look.items.main?._id?.toString() || '',
        look.items.footwear?._id?.toString() || '',
        look.items.accessory?._id?.toString() || '',
        look.items.layer?._id?.toString() || ''
      ].join('|');

      if (duplicateSignatures.has(signature)) continue;

      look.id = 'look_' + Math.random().toString(16).substring(2, 8);
      look.title = generateLookTitle(look, intent, looks.length + 1);
      look.stylistNote = generateLookNote(look, intent, looks.length);

      looks.push(look);
      duplicateSignatures.add(signature);
    }
  }

  return looks;
};

/**
 * Recalculates total price and regenerates the stylist note after an item modification.
 */
export const recalculateLookDetails = (look, intent = {}, lookIndex = 0) => {
  if (!look) return null;

  let totalPrice = 0;
  for (const slot of ['main', 'footwear', 'accessory', 'layer']) {
    const item = look.items[slot];
    if (item && typeof item.price === 'number') totalPrice += item.price;
  }
  look.totalPrice = totalPrice;

  look.stylistNote = generateLookNote(look, intent, lookIndex);

  return look;
};
