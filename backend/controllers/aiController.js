import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';
import { 
  generateGeminiContent, 
  extractFashionIntent, 
  generateStylistExplanation,
  modifyOutfitLook
} from '../services/geminiService.js';
import {
  buildLooks,
  toMinimalProduct,
  groupProductsByRole,
  recalculateLookDetails,
  classifyProductRole,
  scoreProductForIntent,
  sortProductsForRole,
  buildSingleLook
} from '../services/outfitBuilderService.js';
import {
  getTopPreferences,
  learnFromConversation,
  learnFromLook,
  getFashionMemory,
  updateFashionMemory,
  removePreference
} from '../services/fashionMemoryService.js';
import {
  mergeConversationContext,
  determineMissingInformation,
  generateFollowUpQuestion,
  resolveLookReference,
  summarizeConversation,
  buildSuggestedReplies
} from '../services/conversationService.js';

// Conversational memory store in-memory (Map keyed by sessionId)
const chatMemory = new Map();

// ── intent parser regex fallbacks ──────────────────────────────────────────

export const extractBudget = (query) => {
  if (!query) return null;
  const regex = /(?:under|below|less than|budget of|within|max|₹|rs\.?|inr)\s*(\d+)/i;
  const match = query.match(regex);
  if (match) {
    return parseInt(match[1], 10);
  }
  const fallbackRegex = /\b(\d{3,6})\b/;
  const fallbackMatch = query.match(fallbackRegex);
  if (fallbackMatch) {
    return parseInt(fallbackMatch[1], 10);
  }
  return null;
};

export const extractGender = (query) => {
  if (!query) return null;
  const q = query.toLowerCase();

  const femaleKeywords = ['women', 'woman', 'female', 'girl', 'girls', 'ladies', 'lady', 'her', 'she'];
  const maleKeywords = ['men', 'man', 'male', 'boy', 'boys', 'guy', 'guys', 'gentleman', 'him', 'his', 'he'];
  const unisexKeywords = ['unisex', 'both', 'anyone', 'all'];

  if (unisexKeywords.some(kw => q.includes(kw))) {
    return 'Unisex';
  }
  if (femaleKeywords.some(kw => new RegExp(`\\b${kw}\\b`, 'i').test(q))) {
    return 'Female';
  }
  if (maleKeywords.some(kw => new RegExp(`\\b${kw}\\b`, 'i').test(q))) {
    return 'Male';
  }
  return null;
};

export const extractOccasion = (query) => {
  if (!query) return null;
  const q = query.toLowerCase();

  const occasions = [
    { name: 'Wedding', keywords: ['wedding', 'marriage', 'reception', 'shaadi', 'bride', 'groom'] },
    { name: 'Party', keywords: ['party', 'parties', 'clubbing', 'night out', 'celebration'] },
    { name: 'Festive', keywords: ['festive', 'festival', 'diwali', 'eid', 'pooja', 'ethnic'] },
    { name: 'Casual', keywords: ['casual', 'everyday', 'daily', 'home', 'lounge'] },
    { name: 'Office', keywords: ['office', 'formal', 'interview', 'work', 'meeting'] },
    { name: 'College', keywords: ['college', 'university', 'school', 'class'] },
    { name: 'Vacation', keywords: ['vacation', 'holiday', 'beach', 'travel', 'trip'] },
    { name: 'Date Night', keywords: ['date night', 'date', 'romantic', 'dinner date'] }
  ];

  for (const occ of occasions) {
    if (occ.keywords.some(kw => q.includes(kw))) {
      return occ.name;
    }
  }
  return null;
};

export const extractColors = (query) => {
  if (!query) return [];
  const q = query.toLowerCase();
  const colorKeywords = ['pink', 'gold', 'red', 'blue', 'green', 'black', 'white', 'grey', 'yellow', 'purple', 'violet', 'pastel', 'khaki', 'peach', 'orange'];
  return colorKeywords.filter(color => new RegExp(`\\b${color}\\b`, 'i').test(q));
};

export const extractStyle = (query) => {
  if (!query) return null;
  const q = query.toLowerCase();
  const styleKeywords = ['traditional', 'modern', 'western', 'formal', 'casual', 'sporty', 'party', 'ethnic'];
  const matched = styleKeywords.find(style => new RegExp(`\\b${style}\\b`, 'i').test(q));
  return matched ? matched.charAt(0).toUpperCase() + matched.slice(1) : null;
};

export const parseUserIntent = (query) => {
  const occasion = extractOccasion(query);
  const gender = extractGender(query);
  const budget = extractBudget(query);
  return { occasion, gender, budget };
};

export const buildStylistMessage = ({ occasion, gender, budget, colors, style }) => {
  let message = 'Here are some top stylistic recommendations from our catalog';
  if (occasion) {
    message += ` matching your request for a "${occasion}" outfit`;
  }
  if (gender) {
    message += ` styled specifically for ${gender === 'Female' ? 'women' : gender === 'Male' ? 'men' : 'everyone'}`;
  }
  if (colors && colors.length > 0) {
    message += ` featuring ${colors.join(', ')} color tones`;
  }
  if (style) {
    message += ` in a ${style} aesthetic`;
  }
  if (budget) {
    message += ` keeping within your budget of ₹${budget}`;
  }
  message += ". These choices represent the best of StyleAI's premium coordinates, tailored to stand out.";
  return message;
};

// ── GET RECOMMENDATION (Phase 5.0 API fallback support) ─────────────────────

export const getRecommendation = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string' || !query.trim()) {
    res.status(400);
    throw new Error('Query text is required.');
  }

  const filters = parseUserIntent(query);
  const { occasion, gender, budget } = filters;

  const dbQuery = { isActive: true };

  if (gender) {
    if (gender === 'Female') dbQuery.gender = { $in: ['Women', 'Unisex'] };
    else if (gender === 'Male') dbQuery.gender = { $in: ['Men', 'Unisex'] };
    else if (gender === 'Unisex') dbQuery.gender = 'Unisex';
  }

  if (budget !== null) {
    dbQuery.price = { $lte: budget };
  }

  let searchKeyword = occasion;
  if (!searchKeyword) {
    let cleanQuery = query;
    cleanQuery = cleanQuery.replace(/(?:under|below|less than|budget of|within|max|₹|rs\.?|inr)\s*\d+/gi, '');
    cleanQuery = cleanQuery.replace(/\b(?:women|woman|female|girl|girls|ladies|lady|men|man|male|boy|boys|guy|guys|gentleman|unisex|both|anyone|all)\b/gi, '');
    cleanQuery = cleanQuery.replace(/\b(?:for|need|want|outfit|clothing|wear|style|styleai|fashion)\b/gi, '');
    cleanQuery = cleanQuery.replace(/\s+/g, ' ').trim();
    searchKeyword = cleanQuery || query;
  }

  const escapedKeyword = searchKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const searchRegex = new RegExp(escapedKeyword, 'i');

  dbQuery.$or = [
    { name: searchRegex },
    { description: searchRegex },
    { category: searchRegex },
    { subCategory: searchRegex },
    { occasionTags: searchRegex }
  ];

  const products = await Product.find(dbQuery)
    .select('_id name slug price images category brand')
    .limit(10)
    .lean();

  const stylistMessage = buildStylistMessage(filters);

  res.status(200).json({
    success: true,
    filters: {
      occasion,
      gender,
      budget
    },
    stylistMessage,
    products
  });
});

// ── GET CHAT RESPONSE (Phase 5.2 Gemini-powered memory-aware endpoint) ──────

export const getChatResponse = asyncHandler(async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    res.status(400);
    throw new Error('Message is required.');
  }

  // Retrieve session memory
  const sessionKey = sessionId || 'default-session';
  const session = chatMemory.get(sessionKey) || {
    history: [],
    context: {},
    preferences: {
      colors: [],
      style: null,
      previousRecommendations: []
    }
  };

  if (req.user && !session.personalization) {
    session.personalization = getTopPreferences(req.user.fashionMemory);
  }

  console.log(`[AI-STYLIST-DEBUG] Session ID: ${sessionKey}`);
  console.log(`[AI-STYLIST-DEBUG] Incoming Message: "${message}"`);

  // Handle rolling history summaries to preserve token limit
  if (session.history.length > 6) {
    session.summary = summarizeConversation(session.history);
    session.history = session.history.slice(-4);
  }

  const recentHistory = [...session.history];
  if (session.summary) {
    recentHistory.unshift({ role: 'system', text: `Rolling Conversation Summary: ${session.summary}` });
  }

  // Extract intent using Gemini
  let intent;
  let fallbackIntent = false;
  try {
    intent = await extractFashionIntent(message, recentHistory);
    if (!intent || typeof intent !== 'object') {
      throw new Error('Malformed intent returned.');
    }
  } catch (err) {
    console.warn('[AI-STYLIST-DEBUG] Gemini intent parsing failed, using regex fallback:', err.message);
    fallbackIntent = true;
    intent = {
      occasion: extractOccasion(message),
      gender: extractGender(message),
      budget: extractBudget(message),
      colors: extractColors(message),
      style: extractStyle(message),
      confidence: 0.5
    };
  }

  if (req.user && intent) {
    try {
      const updatedMem = await learnFromConversation(req.user._id, intent);
      session.personalization = getTopPreferences(updatedMem);
    } catch (err) {
      console.error('Failed to learn from conversation:', err);
    }
  }

  // Merge context
  session.context = mergeConversationContext(session.context, intent);

  if (session.personalization) {
    session.context.personalization = session.personalization;
  }

  console.log(`[AI-STYLIST-DEBUG] Unified Conversation Context:`, JSON.stringify(session.context));

  // Determine missing information
  const missingFields = determineMissingInformation(session.context);
  const requiresFollowUp = intent.requiresFollowUp || missingFields.length > 0;

  const suggestedReplies = intent.suggestedReplies && intent.suggestedReplies.length > 0
    ? intent.suggestedReplies
    : buildSuggestedReplies(session.context);

  if (requiresFollowUp) {
    const responseText = generateFollowUpQuestion(missingFields);

    session.history.push({ sender: 'user', text: message });
    session.history.push({ sender: 'ai', text: responseText });

    chatMemory.set(sessionKey, session);

    return res.status(200).json({
      success: true,
      response: responseText,
      looks: [],
      products: [],
      fallback: false,
      followUp: true,
      suggestedReplies,
      intent: {
        occasion: session.context.occasion,
        gender: session.context.gender,
        budget: session.context.budget
      }
    });
  }

  // Continue to catalog matching logic (using context variables)
  const finalOccasion = session.context.occasion;
  const finalBudget = session.context.budget;
  const finalGender = session.context.gender;
  const finalColors = session.context.preferredColors;
  const finalStyle = session.context.preferredStyles?.[0] || null;

  // MongoDB Product Query Formulation
  const dbQuery = { isActive: true };

  // Gender constraints
  if (finalGender) {
    if (finalGender === 'Female' || finalGender === 'women') dbQuery.gender = { $in: ['Women', 'Unisex'] };
    else if (finalGender === 'Male' || finalGender === 'men') dbQuery.gender = { $in: ['Men', 'Unisex'] };
    else if (finalGender === 'Unisex') dbQuery.gender = 'Unisex';
  }

  // Budget bounds
  if (finalBudget !== null && finalBudget !== undefined) {
    dbQuery.price = { $lte: finalBudget };
  }

  // Avoid duplicate recommendations
  if (session.preferences.previousRecommendations && session.preferences.previousRecommendations.length > 0) {
    dbQuery._id = { $nin: session.preferences.previousRecommendations };
  }

  // Collect occasion / color / style matching search filters
  const searchTerms = [];
  if (finalOccasion) searchTerms.push(finalOccasion);
  if (finalStyle) searchTerms.push(finalStyle);
  if (finalColors && finalColors.length > 0) {
    searchTerms.push(...finalColors);
  }

  // If no terms were matched, default to cleaned query
  if (searchTerms.length === 0) {
    let cleanQuery = message;
    cleanQuery = cleanQuery.replace(/(?:under|below|less than|budget of|within|max|₹|rs\.?|inr)\s*\d+/gi, '');
    cleanQuery = cleanQuery.replace(/\b(?:women|woman|female|girl|girls|ladies|lady|men|man|male|boy|boys|guy|guys|gentleman|unisex|both|anyone|all)\b/gi, '');
    cleanQuery = cleanQuery.replace(/\b(?:for|need|want|outfit|clothing|wear|style|styleai|fashion)\b/gi, '');
    cleanQuery = cleanQuery.replace(/\s+/g, ' ').trim();
    if (cleanQuery) searchTerms.push(cleanQuery);
    else searchTerms.push(message);
  }

  const andConditions = searchTerms.map(term => {
    const regex = new RegExp(term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
    return {
      $or: [
        { name: regex },
        { description: regex },
        { category: regex },
        { subCategory: regex },
        { occasionTags: regex }
      ]
    };
  });

  if (andConditions.length > 0) {
    dbQuery.$and = andConditions;
  }

  console.log(`[AI-STYLIST-DEBUG] MongoDB Query Filters:`, JSON.stringify(dbQuery));

  // Fetch candidate products (up to 30 products)
  let candidateProducts = await Product.find(dbQuery).limit(30).lean();

  // Fill missing roles (Footwear, Accessories, Layers) if candidate pool is sparse
  const groupedCandidates = groupProductsByRole(candidateProducts);

  const fillQuery = { isActive: true };
  if (finalGender) {
    if (finalGender === 'Female' || finalGender === 'women') fillQuery.gender = { $in: ['Women', 'Unisex'] };
    else if (finalGender === 'Male' || finalGender === 'men') fillQuery.gender = { $in: ['Men', 'Unisex'] };
    else if (finalGender === 'Unisex') fillQuery.gender = 'Unisex';
  }
  if (finalOccasion) {
    fillQuery.occasionTags = finalOccasion;
  }

  const extraRoles = [];

  // Footwear fill
  if (groupedCandidates.footwear.length === 0) {
    let extraFootwear = await Product.find({
      ...fillQuery,
      subCategory: { $in: ['Heels', 'Juttis', 'Sneakers', 'Loafers', 'Shoes', 'Sandals'] }
    }).limit(5).lean();
    if (extraFootwear.length === 0 && finalOccasion) {
      const { occasionTags, ...rest } = fillQuery;
      extraFootwear = await Product.find({
        ...rest,
        subCategory: { $in: ['Heels', 'Juttis', 'Sneakers', 'Loafers', 'Shoes', 'Sandals'] }
      }).limit(5).lean();
    }
    extraRoles.push(...extraFootwear);
  }

  // Accessories fill
  if (groupedCandidates.accessory.length === 0) {
    let extraAccessories = await Product.find({
      ...fillQuery,
      subCategory: { $in: ['Handbags', 'Watches', 'Belts', 'Jewelry', 'Necklaces', 'Earrings'] }
    }).limit(5).lean();
    if (extraAccessories.length === 0 && finalOccasion) {
      const { occasionTags, ...rest } = fillQuery;
      extraAccessories = await Product.find({
        ...rest,
        subCategory: { $in: ['Handbags', 'Watches', 'Belts', 'Jewelry', 'Necklaces', 'Earrings'] }
      }).limit(5).lean();
    }
    extraRoles.push(...extraAccessories);
  }

  // Layers fill
  if (groupedCandidates.layer.length === 0) {
    let extraLayers = await Product.find({
      ...fillQuery,
      subCategory: { $in: ['Blazers', 'Jackets', 'Sweaters', 'Cardigans', 'Shawls'] }
    }).limit(5).lean();
    if (extraLayers.length === 0 && finalOccasion) {
      const { occasionTags, ...rest } = fillQuery;
      extraLayers = await Product.find({
        ...rest,
        subCategory: { $in: ['Blazers', 'Jackets', 'Sweaters', 'Cardigans', 'Shawls'] }
      }).limit(5).lean();
    }
    extraRoles.push(...extraLayers);
  }

  if (extraRoles.length > 0) {
    candidateProducts.push(...extraRoles);
    // Deduplicate by _id
    const seenIds = new Set();
    candidateProducts = candidateProducts.filter(p => {
      const idStr = p._id.toString();
      if (seenIds.has(idStr)) return false;
      seenIds.add(idStr);
      return true;
    });
  }

  console.log(`[AI-STYLIST-DEBUG] Final Candidate Pool Count: ${candidateProducts.length}`);

  // Build looks locally using deterministic logic (using merged session context)
  const looks = buildLooks({ products: candidateProducts, intent: session.context, maxLooks: 3 });
  let flatProducts = [];

  // Assemble flat backward-compatible products list
  if (looks.length > 0) {
    const seenIds = new Set();
    for (const look of looks) {
      for (const slot of ['main', 'footwear', 'accessory', 'layer']) {
        const item = look.items[slot];
        if (item && !seenIds.has(item._id.toString())) {
          seenIds.add(item._id.toString());
          flatProducts.push(item);
        }
      }
    }
  } else {
    // Fallback: if no looks are built, map candidates to minimal shape
    flatProducts = candidateProducts.map(p => toMinimalProduct(p));
  }

  // Cache products into memory to prevent duplicates in future turns
  flatProducts.forEach(p => {
    if (!session.preferences.previousRecommendations.includes(p._id.toString())) {
      session.preferences.previousRecommendations.push(p._id.toString());
    }
  });

  // Generate stylist response reasoning via Gemini
  let responseText;
  let fallbackExplanation = false;
  try {
    responseText = await generateStylistExplanation(message, {
      occasion: finalOccasion,
      gender: finalGender,
      budget: finalBudget,
      colors: finalColors,
      style: finalStyle
    }, flatProducts, looks, session.personalization);
  } catch (err) {
    console.warn('[AI-STYLIST-DEBUG] Gemini stylist explanation failed, using fallback:', err.message);
    fallbackExplanation = true;
    if (looks.length > 0) {
      responseText = `I've put together a few coordinated looks for you based on your styling preferences.`;
    } else if (flatProducts.length > 0) {
      responseText = `I found some matching items in our catalog, but not enough compatible pieces to construct complete coordinated looks.`;
    } else {
      responseText = buildStylistMessage({
        occasion: finalOccasion,
        gender: finalGender,
        budget: finalBudget,
        colors: finalColors,
        style: finalStyle
      });
    }
  }

  console.log(`[AI-STYLIST-DEBUG] Gemini Explanation Response: "${responseText}"`);
  console.log(`[AI-STYLIST-DEBUG] Whether fallback explanation was used: ${fallbackExplanation}`);

  // Record dialogue turn
  session.history.push({ sender: 'user', text: message });
  session.history.push({ sender: 'ai', text: responseText });

  // Limit memory history length
  if (session.history.length > 10) {
    session.history = session.history.slice(-10);
  }

  // Cache looks inside session for future interactive edits
  session.currentLooks = looks || [];

  // Update memory store
  chatMemory.set(sessionKey, session);

  const fallback = fallbackIntent || fallbackExplanation;

  res.status(200).json({
    success: true,
    fallback,
    followUp: false,
    suggestedReplies,
    intent: {
      occasion: finalOccasion,
      gender: finalGender,
      budget: finalBudget
    },
    response: responseText,
    looks,
    products: flatProducts
  });
});

// ── MODIFY OUTFIT LOOK (Phase 5.5A interactive look modification) ────────────

export const modifyLook = asyncHandler(async (req, res) => {
  const { sessionId, lookId, slot, action, query } = req.body;

  if (!sessionId) {
    res.status(400);
    throw new Error('Session ID is required.');
  }
  if (!lookId) {
    res.status(400);
    throw new Error('Look ID is required.');
  }
  if (!action) {
    res.status(400);
    throw new Error('Action is required.');
  }

  const sessionKey = sessionId;
  const session = chatMemory.get(sessionKey);

  if (!session || !Array.isArray(session.currentLooks) || session.currentLooks.length === 0) {
    res.status(404);
    throw new Error('Session or looks not found. Please generate outfits first.');
  }

  // Resolve relative reference (e.g. "make look 2 cheaper" or lookId/query values)
  const resolvedRef = resolveLookReference(query || lookId, session.currentLooks);
  let finalLookId = lookId;
  let finalSlot = slot;
  let finalAction = action;
  let finalQuery = query;

  if (resolvedRef) {
    console.log(`[AI-STYLIST-DEBUG] Resolved relative reference:`, JSON.stringify(resolvedRef));
    finalLookId = resolvedRef.lookId;
    finalSlot = resolvedRef.slot || finalSlot;
    finalAction = resolvedRef.action || finalAction;
    finalQuery = resolvedRef.modifiedQuery;
  }

  const VALID_SLOTS = ['main', 'footwear', 'accessory', 'layer'];
  if (finalSlot && !VALID_SLOTS.includes(finalSlot)) {
    res.status(400);
    throw new Error(`Invalid slot name: ${finalSlot}. Supported slots are: ${VALID_SLOTS.join(', ')}`);
  }

  // Find look in session copy
  const lookIndex = session.currentLooks.findIndex(l => l.id === finalLookId);
  if (lookIndex === -1) {
    res.status(404);
    throw new Error('Look not found in session.');
  }

  // Clone immutably
  const lookCopy = JSON.parse(JSON.stringify(session.currentLooks[lookIndex]));

  let fallbackUsed = false;
  
  // Retrieve general intent fields from session or look metadata
  const originalIntent = {
    occasion: extractOccasion(finalQuery || '') || extractOccasion(session.history.map(h => h.text).join(' ')) || 'Casual',
    gender: extractGender(session.history.map(h => h.text).join(' ')) || 'Unisex',
    budget: extractBudget(session.history.map(h => h.text).join(' ')),
    colors: session.preferences.colors || [],
    style: session.preferences.style || null
  };

  if (req.user) {
    if (!session.personalization) {
      session.personalization = getTopPreferences(req.user.fashionMemory);
    }
    originalIntent.personalization = session.personalization;
  }

  if (finalAction === 'remove') {
    if (!finalSlot) {
      res.status(400);
      throw new Error('Slot name is required to remove an item.');
    }
    lookCopy.items[finalSlot] = null;
    recalculateLookDetails(lookCopy, originalIntent);
  } 
  else if (finalAction === 'regenerate' && !finalSlot) {
    // Regenerate ENTIRE look
    // Query main items excluding the current main item ID
    const currentMainId = lookCopy.items.main?._id;
    const dbQuery = { isActive: true };
    if (originalIntent.gender) {
      if (originalIntent.gender === 'Female') dbQuery.gender = { $in: ['Women', 'Unisex'] };
      else if (originalIntent.gender === 'Male') dbQuery.gender = { $in: ['Men', 'Unisex'] };
      else if (originalIntent.gender === 'Unisex') dbQuery.gender = 'Unisex';
    }
    if (currentMainId) {
      dbQuery._id = { $ne: currentMainId };
    }
    
    // Occasion match
    if (originalIntent.occasion) {
      const occasionRegex = new RegExp(originalIntent.occasion, 'i');
      dbQuery.$or = [
        { name: occasionRegex },
        { description: occasionRegex },
        { category: occasionRegex },
        { subCategory: occasionRegex },
        { occasionTags: occasionRegex }
      ];
    }
    
    // Fetch products
    let candidates = await Product.find(dbQuery).limit(30).lean();
    if (candidates.length === 0) {
      // Relax occasion check if sparse
      delete dbQuery.$or;
      candidates = await Product.find(dbQuery).limit(20).lean();
    }

    const grouped = groupProductsByRole(candidates);
    const rankedMains = sortProductsForRole(grouped.main, originalIntent, 'main');
    
    let newLook = null;
    if (rankedMains.length > 0) {
      newLook = buildSingleLook({
        mainProduct: rankedMains[0],
        grouped,
        intent: originalIntent,
        usedGlobalMainIds: new Set()
      });
    }

    if (newLook) {
      newLook.id = finalLookId;
      newLook.title = lookCopy.title;
      // Copy over looks
      Object.assign(lookCopy, newLook);
    } else {
      res.status(400);
      throw new Error('Could not regenerate outfit. No alternative products found.');
    }
  } 
  else if (finalAction === 'regenerate' && finalSlot) {
    // Regenerate ONLY that slot
    const currentItemId = lookCopy.items[finalSlot]?._id;
    const dbQuery = { isActive: true };
    
    if (originalIntent.gender) {
      if (originalIntent.gender === 'Female') dbQuery.gender = { $in: ['Women', 'Unisex'] };
      else if (originalIntent.gender === 'Male') dbQuery.gender = { $in: ['Men', 'Unisex'] };
      else if (originalIntent.gender === 'Unisex') dbQuery.gender = 'Unisex';
    }

    if (currentItemId) {
      dbQuery._id = { $ne: currentItemId };
    }

    // Role subcategories
    if (finalSlot === 'footwear') {
      dbQuery.subCategory = { $in: ['Heels', 'Juttis', 'Sneakers', 'Loafers', 'Shoes', 'Sandals'] };
    } else if (finalSlot === 'accessory') {
      dbQuery.subCategory = { $in: ['Handbags', 'Watches', 'Belts', 'Jewelry', 'Necklaces', 'Earrings'] };
    } else if (finalSlot === 'layer') {
      dbQuery.subCategory = { $in: ['Blazers', 'Jackets', 'Sweaters', 'Cardigans', 'Shawls'] };
    } else {
      dbQuery.category = { $ne: 'Accessories' };
    }

    const candidates = await Product.find(dbQuery).limit(20).lean();
    const sorted = sortProductsForRole(candidates, originalIntent, finalSlot);

    if (sorted.length > 0) {
      lookCopy.items[finalSlot] = toMinimalProduct(sorted[0]);
      recalculateLookDetails(lookCopy, originalIntent);
    }
  } 
  else if (finalAction === 'upgrade') {
    if (!finalSlot) {
      res.status(400);
      throw new Error('Slot name is required to upgrade an item.');
    }

    const currentItem = lookCopy.items[finalSlot];
    if (!currentItem) {
      res.status(400);
      throw new Error(`Cannot upgrade an empty slot: ${finalSlot}`);
    }

    const dbQuery = {
      isActive: true,
      _id: { $ne: currentItem._id }
    };

    if (originalIntent.gender) {
      if (originalIntent.gender === 'Female') dbQuery.gender = { $in: ['Women', 'Unisex'] };
      else if (originalIntent.gender === 'Male') dbQuery.gender = { $in: ['Men', 'Unisex'] };
      else if (originalIntent.gender === 'Unisex') dbQuery.gender = 'Unisex';
    }

    // Role-specific category
    if (finalSlot === 'footwear') {
      dbQuery.subCategory = { $in: ['Heels', 'Juttis', 'Sneakers', 'Loafers', 'Shoes', 'Sandals'] };
    } else if (finalSlot === 'accessory') {
      dbQuery.subCategory = { $in: ['Handbags', 'Watches', 'Belts', 'Jewelry', 'Necklaces', 'Earrings'] };
    } else if (finalSlot === 'layer') {
      dbQuery.subCategory = { $in: ['Blazers', 'Jackets', 'Sweaters', 'Cardigans', 'Shawls'] };
    } else {
      dbQuery.category = { $ne: 'Accessories' };
    }

    // Find items that have higher price or better ratings
    const currentPrice = currentItem.price || 0;
    dbQuery.price = { $gt: currentPrice };

    let candidates = await Product.find(dbQuery).sort({ price: 1, ratings: -1 }).limit(10).lean();

    if (candidates.length === 0) {
      // fallback to any higher-rated item if price is not higher
      delete dbQuery.price;
      dbQuery.ratings = { $gte: 4 };
      candidates = await Product.find(dbQuery).sort({ ratings: -1 }).limit(10).lean();
    }

    if (candidates.length > 0) {
      lookCopy.items[finalSlot] = toMinimalProduct(candidates[0]);
      recalculateLookDetails(lookCopy, originalIntent);
    } else {
      console.log(`[AI-STYLIST-DEBUG] No upgrade candidate found for slot ${finalSlot}. Keeping current item.`);
    }
  } 
  else if (finalAction === 'replace') {
    if (!finalSlot) {
      res.status(400);
      throw new Error('Slot name is required to replace an item.');
    }
    if (!finalQuery) {
      res.status(400);
      throw new Error('Replacement query is required.');
    }

    // Fetch products related to the slot
    const dbQuery = { isActive: true };
    if (originalIntent.gender) {
      if (originalIntent.gender === 'Female') dbQuery.gender = { $in: ['Women', 'Unisex'] };
      else if (originalIntent.gender === 'Male') dbQuery.gender = { $in: ['Men', 'Unisex'] };
      else if (originalIntent.gender === 'Unisex') dbQuery.gender = 'Unisex';
    }

    if (finalSlot === 'footwear') {
      dbQuery.subCategory = { $in: ['Heels', 'Juttis', 'Sneakers', 'Loafers', 'Shoes', 'Sandals'] };
    } else if (finalSlot === 'accessory') {
      dbQuery.subCategory = { $in: ['Handbags', 'Watches', 'Belts', 'Jewelry', 'Necklaces', 'Earrings'] };
    } else if (finalSlot === 'layer') {
      dbQuery.subCategory = { $in: ['Blazers', 'Jackets', 'Sweaters', 'Cardigans', 'Shawls'] };
    } else {
      dbQuery.category = { $ne: 'Accessories' };
    }

    // Perform keyword search for query excluding common stop words
    const STOP_WORDS = new Set(['replace', 'with', 'the', 'change', 'swap', 'for', 'this', 'these', 'those', 'that', 'with', 'a', 'an', 'to', 'remove', 'it', 'me', 'please', 'style', 'outfit', 'look']);
    const keywords = finalQuery.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z0-9]/g, '')).filter(w => w.length > 2 && !STOP_WORDS.has(w));
    if (keywords.length > 0) {
      dbQuery.$or = keywords.flatMap(kw => {
        const regex = new RegExp(kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
        return [
          { name: regex },
          { description: regex },
          { category: regex },
          { subCategory: regex }
        ];
      });
    }

    let candidates = await Product.find(dbQuery).limit(20).lean();
    if (candidates.length === 0) {
      // Try a wider query if keywords matching yielded nothing
      delete dbQuery.$or;
      candidates = await Product.find(dbQuery).limit(20).lean();
    }

    let selectedProduct = null;

    try {
      // 1. Try Gemini
      const geminiRes = await modifyOutfitLook({
        currentLook: lookCopy,
        history: session.history,
        slot: finalSlot,
        query: finalQuery,
        candidates
      });

      if (geminiRes && geminiRes.selectedId) {
        selectedProduct = candidates.find(c => c._id.toString() === geminiRes.selectedId.toString());
      }
    } catch (err) {
      console.warn('[AI-STYLIST-DEBUG] Gemini modify look failed, falling back to local scoring:', err.message);
      fallbackUsed = true;
    }

    if (!selectedProduct && candidates.length > 0) {
      fallbackUsed = true;
      // 2. Local Fallback scoring
      const scoredCandidates = candidates.map(c => {
        let score = scoreProductForIntent(c, originalIntent, finalSlot);
        
        // Custom keyword query scoring matching excluding common stop words
        const prodName = (c.name || '').toLowerCase();
        const prodDesc = (c.description || '').toLowerCase();
        const STOP_WORDS = new Set(['replace', 'with', 'the', 'change', 'swap', 'for', 'this', 'these', 'those', 'that', 'with', 'a', 'an', 'to', 'remove', 'it', 'me', 'please', 'style', 'outfit', 'look']);
        const qWords = finalQuery.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z0-9]/g, '')).filter(w => w.length > 2 && !STOP_WORDS.has(w));
        qWords.forEach(word => {
          if (prodName.includes(word)) score += 30;
          if (prodDesc.includes(word)) score += 10;
        });

        return { product: c, score };
      }).sort((a, b) => b.score - a.score);

      selectedProduct = scoredCandidates[0]?.product;
    }

    if (selectedProduct) {
      const removedItem = lookCopy.items[finalSlot];
      lookCopy.items[finalSlot] = toMinimalProduct(selectedProduct);
      recalculateLookDetails(lookCopy, originalIntent);

      // Learn from replacements (weight +2 for new selected, -1 for removed item)
      if (req.user) {
        try {
          await learnFromProducts(req.user._id, [selectedProduct._id.toString()], 2);
          if (removedItem) {
            const removedId = removedItem._id || removedItem.id || removedItem.productId;
            if (removedId) {
              await learnFromProducts(req.user._id, [removedId.toString()], -1);
            }
          }
          // Invalidate session cache to reload on next request
          session.personalization = null;
        } catch (err) {
          console.error('Failed to learn from replacement:', err);
        }
      }
    } else {
      res.status(404);
      throw new Error('No matching replacement items found in catalog.');
    }
  }

  // Update inside session copy (immutable change)
  const updatedLooks = [...session.currentLooks];
  updatedLooks[lookIndex] = lookCopy;
  session.currentLooks = updatedLooks;

  // Save back to memory store
  chatMemory.set(sessionKey, session);

  res.status(200).json({
    success: true,
    look: lookCopy,
    fallback: fallbackUsed
  });
});

// ── TEST GEMINI HEALTH CHECK ────────────────────────────────────────────────

export const testGemini = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    res.status(400);
    throw new Error('Prompt is required.');
  }

  try {
    const response = await generateGeminiContent(prompt);
    res.status(200).json({
      success: true,
      prompt,
      response
    });
  } catch (err) {
    res.status(500);
    throw new Error(`Gemini Call Failed: ${err.message}`);
  }
});

/**
 * GET /api/ai/preferences
 * Returns the logged-in user's learned preferences.
 */
export const getUserPreferences = asyncHandler(async (req, res) => {
  const memory = await getFashionMemory(req.user._id);
  const summary = getTopPreferences(memory);

  res.status(200).json({
    success: true,
    preferences: summary,
    budget: {
      minimumBudget: memory.minimumBudget,
      maximumBudget: memory.maximumBudget
    }
  });
});

/**
 * PUT /api/ai/preferences
 * Allows direct edits. Merges intelligently rather than overwriting history.
 */
export const updateUserPreferences = asyncHandler(async (req, res) => {
  const {
    favoriteBrands,
    dislikedBrands,
    favoriteColors,
    dislikedColors,
    preferredOccasions,
    preferredStyles,
    preferredFootwear,
    preferredAccessories,
    minimumBudget,
    maximumBudget,
    removeCategory,
    removeValue
  } = req.body;

  let memory;
  if (removeCategory && removeValue) {
    memory = await removePreference(req.user._id, removeCategory, removeValue);
  } else {
    memory = await updateFashionMemory(req.user._id, {
      favoriteBrands,
      dislikedBrands,
      favoriteColors,
      dislikedColors,
      preferredOccasions,
      preferredStyles,
      preferredFootwear,
      preferredAccessories,
      minimumBudget,
      maximumBudget
    });
  }

  // Invalidate any session cached personalization summary for this user
  for (const [key, val] of chatMemory.entries()) {
    if (val && val.personalization) {
      val.personalization = null; // force reload
    }
  }

  const summary = getTopPreferences(memory);

  res.status(200).json({
    success: true,
    preferences: summary,
    budget: {
      minimumBudget: memory.minimumBudget,
      maximumBudget: memory.maximumBudget
    }
  });
});
