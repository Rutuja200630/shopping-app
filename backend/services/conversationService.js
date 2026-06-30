/**
 * Merges previous conversation context with new intent extractions.
 * Ensures previously stated preferences are preserved unless explicitly overridden.
 * @param {object} previousContext - Existing context from session memory
 * @param {object} extractedIntent - Brand new intent from the latest query
 * @returns {object} Updated conversation context
 */
export const mergeConversationContext = (previousContext, extractedIntent) => {
  const context = previousContext ? { ...previousContext } : {
    occasion: null,
    budget: null,
    gender: null,
    preferredColors: [],
    dislikedColors: [],
    preferredStyles: [],
    preferredBrands: [],
    currentLookId: null,
    currentIntent: null,
    lastQuestion: null,
    missingFields: []
  };

  if (!extractedIntent) return context;

  // Occasion, budget, gender override
  if (extractedIntent.occasion) context.occasion = extractedIntent.occasion;
  if (extractedIntent.budget) context.budget = extractedIntent.budget;
  if (extractedIntent.gender) context.gender = extractedIntent.gender;

  // Merge array preferences without duplicates
  const mergeArrays = (prev = [], next = []) => {
    const combined = [...prev, ...next].map(s => s.trim()).filter(Boolean);
    return [...new Set(combined)];
  };

  if (extractedIntent.colors) {
    context.preferredColors = mergeArrays(context.preferredColors, extractedIntent.colors);
  }
  if (extractedIntent.favoriteColors) {
    context.preferredColors = mergeArrays(context.preferredColors, extractedIntent.favoriteColors);
  }
  if (extractedIntent.dislikedColors) {
    context.dislikedColors = mergeArrays(context.dislikedColors, extractedIntent.dislikedColors);
  }
  if (extractedIntent.preferredStyles) {
    context.preferredStyles = mergeArrays(context.preferredStyles, extractedIntent.preferredStyles);
  }
  if (extractedIntent.style) {
    context.preferredStyles = mergeArrays(context.preferredStyles, [extractedIntent.style]);
  }
  if (extractedIntent.favoriteBrands) {
    context.preferredBrands = mergeArrays(context.preferredBrands, extractedIntent.favoriteBrands);
  }

  // Preserve prices
  if (extractedIntent.preferredPriceMin !== undefined && extractedIntent.preferredPriceMin !== null) {
    context.minimumBudget = extractedIntent.preferredPriceMin;
  }
  if (extractedIntent.preferredPriceMax !== undefined && extractedIntent.preferredPriceMax !== null) {
    context.maximumBudget = extractedIntent.preferredPriceMax;
  }

  context.currentIntent = extractedIntent;
  return context;
};

/**
 * Determines whether critical fields (occasion, budget) are missing.
 * @param {object} context - Merged conversation context
 * @returns {Array<string>} List of missing fields
 */
export const determineMissingInformation = (context) => {
  const missing = [];
  if (!context.occasion) missing.push('occasion');
  if (!context.budget) missing.push('budget');
  return missing;
};

/**
 * Formulates a natural, friendly follow-up question asking for missing fields.
 * @param {Array<string>} missingFields - List of missing keys
 * @returns {string} Styled follow-up question
 */
export const generateFollowUpQuestion = (missingFields) => {
  if (!missingFields || missingFields.length === 0) return '';

  const hasOccasion = missingFields.includes('occasion');
  const hasBudget = missingFields.includes('budget');

  if (hasOccasion && hasBudget) {
    return `I'd love to help curate some styled look coordinates for you! To get started, could you let me know:\n\n• What's the occasion (e.g. Wedding, Party, Office, Casual)?\n• What is your approximate budget or price limit?`;
  }
  if (hasOccasion) {
    return `I can definitely help you with that! What occasion or event are we styling this outfit for? (e.g., Wedding, Office, Festive, Casual Wear)`;
  }
  if (hasBudget) {
    return `Got it! What is your approximate budget or maximum price range for this outfit?`;
  }

  return `Could you provide some more details so I can select the best outfits from our catalog?`;
};

/**
 * Resolves natural language references to look indexes (e.g. "look 2", "third outfit").
 * @param {string} query - User message
 * @param {Array} currentLooks - Looks active in current session
 * @returns {object|null} Resolved reference configuration
 */
export const resolveLookReference = (query, currentLooks) => {
  if (!query || !Array.isArray(currentLooks) || currentLooks.length === 0) return null;

  const q = query.toLowerCase();

  // 1. Detect Look index
  let lookIndex = -1;

  if (/\b(look|outfit|option|choice|card|one)\s*1\b/.test(q) || /\b(first|1st)\b/.test(q) || q.includes('look one') || q.includes('outfit one')) {
    lookIndex = 0;
  } else if (/\b(look|outfit|option|choice|card|one)\s*2\b/.test(q) || /\b(second|2nd)\b/.test(q) || q.includes('look two') || q.includes('outfit two')) {
    lookIndex = 1;
  } else if (/\b(look|outfit|option|choice|card|one)\s*3\b/.test(q) || /\b(third|3rd)\b/.test(q) || q.includes('look three') || q.includes('outfit three')) {
    lookIndex = 2;
  }

  // Fallback to check simple numbers if look context is implied
  if (lookIndex === -1) {
    if (/\b1\b/.test(q)) lookIndex = 0;
    else if (/\b2\b/.test(q)) lookIndex = 1;
    else if (/\b3\b/.test(q)) lookIndex = 2;
  }

  if (lookIndex === -1 || lookIndex >= currentLooks.length) return null;

  const resolvedLook = currentLooks[lookIndex];

  // 2. Detect Slot
  let slot = 'main';
  if (q.includes('shoes') || q.includes('footwear') || q.includes('heels') || q.includes('sneakers') || q.includes('loafers') || q.includes('sandals') || q.includes('boots')) {
    slot = 'footwear';
  } else if (q.includes('accessory') || q.includes('accessories') || q.includes('bag') || q.includes('watch') || q.includes('clutch') || q.includes('belt') || q.includes('jewelry') || q.includes('necklace')) {
    slot = 'accessory';
  } else if (q.includes('jacket') || q.includes('blazer') || q.includes('layer') || q.includes('shrug') || q.includes('shawl') || q.includes('coat')) {
    slot = 'layer';
  }

  // 3. Detect Action
  let action = 'replace';
  if (q.includes('cheaper') || q.includes('budget') || q.includes('price') || q.includes('cost') || q.includes('less')) {
    action = 'replace';
  } else if (q.includes('remove') || q.includes('delete') || q.includes('take off') || q.includes('without')) {
    action = 'remove';
  } else if (q.includes('upgrade') || q.includes('premium') || q.includes('better')) {
    action = 'upgrade';
  }

  return {
    resolvedLook,
    lookId: resolvedLook.id,
    slot,
    action,
    modifiedQuery: query
  };
};

/**
 * Builds rolling summaries of conversation turns to save Gemini token limits.
 * @param {Array} history - Dialogue turns list
 * @returns {string} Compact conversation summary
 */
export const summarizeConversation = (history) => {
  if (!Array.isArray(history) || history.length === 0) return '';

  // Get key topics discussed
  const userMessages = history.filter(h => h.sender === 'user' || h.role === 'user').map(h => h.text || h.response || '');
  if (userMessages.length === 0) return '';

  return `User is searching for outfits. Key requests mentioned: ${userMessages.slice(-4).join('; ')}`;
};

/**
 * Builds dynamic suggested replies based on missing fields or active looks.
 * @param {object} context - Current conversation context
 * @returns {Array<string>} List of suggestion chips strings
 */
export const buildSuggestedReplies = (context) => {
  const missing = determineMissingInformation(context);

  if (missing.includes('occasion')) {
    return ['Wedding Outfit', 'Casual Wear', 'Office Wear', 'Party Looks'];
  }
  if (missing.includes('budget')) {
    return ['Under ₹3000', 'Under ₹5000', 'Under ₹8000', 'No strict budget'];
  }

  // Outfits are ready or generated
  return [
    'Make look 2 cheaper',
    'Replace footwear in look 1',
    'Show premium options',
    'Different colors',
    'Show casual version'
  ];
};
