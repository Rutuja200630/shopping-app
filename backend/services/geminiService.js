import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const getApiKey = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return key.trim();
};

const apiKey = getApiKey();
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Generates simple content from the Gemini model. Useful for health checks and simple queries.
 * @param {string} prompt - Raw input prompt text.
 * @returns {Promise<string>} Gemini response text.
 */
export const generateGeminiContent = async (prompt) => {
  if (!genAI) {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in your env file.');
  }

  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.warn('[Gemini Service] generateGeminiContent failed, using fallback.');
    return 'Styling is all about balance, fit, and expressing your unique personality.';
  }
};

/**
 * Parses user input to extract occasion, gender, budget, color tags, and styles.
 * @param {string} query - Natural language style request.
 * @returns {Promise<object>} Parsed fashion intent metadata structure.
 */
export const extractFashionIntent = async (query, history = []) => {
  if (!genAI) {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in your env file.');
  }

  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: 'application/json'
    }
  });

  const historyText = Array.isArray(history) && history.length > 0
    ? history.map(h => `${h.sender === 'user' || h.role === 'user' ? 'User' : 'Assistant'}: ${h.text || h.response}`).join('\n')
    : 'None';

  const prompt = `
You are a fashion AI assistant for StyleAI platform.
Your task is to analyze the user's latest query, consider the conversation history context, and extract the fashion shopping intent.

Supported occasion list: Wedding, Party, Festive, Casual, Office, College, Vacation, Date Night.

Conversation History so far:
${historyText}

Latest User Query: "${query}"

Return ONLY a JSON object with this exact shape:
{
  "occasion": "string (one of the supported occasions, or null)",
  "gender": "string ('Female' | 'Male' | 'Unisex' | null)",
  "budget": "number (the maximum price limit found in the query or history, or null)",
  "colors": ["array of color names user likes, or empty array"],
  "style": "string (e.g., 'Traditional', 'Western', 'Formal', etc., or null)",
  "favoriteBrands": ["array of preferred brands if mentioned, otherwise empty array"],
  "dislikedBrands": ["array of brands user explicitly rejects or dislikes, otherwise empty array"],
  "favoriteColors": ["array of color names user likes or prefers, otherwise empty array"],
  "dislikedColors": ["array of color names user explicitly rejects or wants to avoid, otherwise empty array"],
  "preferredFootwear": ["array of footwear categories/types user likes or asks for, e.g. ['sneakers', 'loafers'], otherwise empty array"],
  "preferredAccessories": ["array of accessory categories/types user likes or asks for, e.g. ['clutch', 'watch'], otherwise empty array"],
  "preferredStyles": ["array of styles user likes, e.g. ['minimalist', 'bohemian'], otherwise empty array"],
  "preferredOccasions": ["array of occasions user likes, otherwise empty array"],
  "preferredPriceMin": "number (the minimum budget/price limit if mentioned, otherwise null)",
  "preferredPriceMax": "number (the maximum budget/price limit if mentioned, otherwise null)",
  "shoppingGoal": "string (e.g. 'Finding a wedding dress', 'Everyday casual coordinates', otherwise null)",
  "urgency": "string (e.g. 'high', 'normal', 'low', otherwise null)",
  "explicitOccasion": "string (the occasion directly mentioned in the latest message, or null)",
  "inferredOccasion": "string (the occasion that can be inferred from the query/history context, or null)",
  "eventTiming": "string (e.g. 'next week', 'next month', otherwise null)",
  "requiresFollowUp": "boolean (true if occasion or budget details are missing from latest query AND history)",
  "missingFields": ["array of missing fields from ['occasion', 'budget']"],
  "suggestedReplies": ["array of 3-4 short suggested user replies/actions suitable for the current state, e.g. occasion options or budget thresholds"],
  "confidence": "number (0.0 to 1.0 representing extraction confidence)"
}
`;

const localExtractBudget = (query) => {
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

const localExtractOccasion = (query) => {
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

  try {
    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }
    return JSON.parse(responseText);
  } catch (error) {
    console.warn('[Gemini Service] extractFashionIntent failed. Using local heuristic fallback. Error:', error.message);
    
    // Extract from current query first
    let occasion = localExtractOccasion(query);
    let budget = localExtractBudget(query);

    // Extract from history if not found in current query
    if (Array.isArray(history)) {
      for (const h of history) {
        const text = h.text || h.response || '';
        if (!occasion) occasion = localExtractOccasion(text);
        if (!budget) budget = localExtractBudget(text);
      }
    }

    let gender = null;
    const qLower = (query || '').toLowerCase();
    if (qLower.includes('women') || qLower.includes('female') || qLower.includes('girl')) gender = 'Female';
    else if (qLower.includes('men') || qLower.includes('male') || qLower.includes('guy')) gender = 'Male';
    else gender = null;

    const requiresFollowUp = !occasion || !budget;
    const missingFields = [];
    if (!occasion) missingFields.push('occasion');
    if (!budget) missingFields.push('budget');

    const suggestedReplies = [];
    if (!occasion) {
      suggestedReplies.push('For a Wedding', 'For everyday Casual wear', 'For Office/Workwear');
    } else if (!budget) {
      suggestedReplies.push('Under ₹3000', 'Under ₹5000', 'Under ₹8000');
    }

    return {
      occasion: occasion || 'Casual',
      gender,
      budget,
      colors: [],
      style: null,
      favoriteBrands: [],
      dislikedBrands: [],
      favoriteColors: [],
      dislikedColors: [],
      preferredFootwear: [],
      preferredAccessories: [],
      preferredStyles: [],
      preferredOccasions: [],
      preferredPriceMin: null,
      preferredPriceMax: budget || null,
      shoppingGoal: occasion ? `Find coordinates for ${occasion}` : 'Explore coordinates',
      urgency: 'normal',
      explicitOccasion: occasion,
      inferredOccasion: occasion,
      eventTiming: null,
      requiresFollowUp,
      missingFields,
      suggestedReplies,
      confidence: 0.8
    };
  }
};

/**
 * Generates an explanation message describing why selected products and looks match the user intent.
 * @param {string} query - Original user prompt.
 * @param {object} filters - Extracted occasion, gender, and budget filters.
 * @param {Array} products - List of matching database products.
 * @param {Array} [looks=[]] - Optional structured looks generated for the user query.
 * @returns {Promise<string>} Stylist advice description.
 */
export const generateStylistExplanation = async (query, filters, products, looks = [], personalizationSummary = null) => {
  if (!genAI) {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in your env file.');
  }

  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const productsText = products
    .map(p => `- ${p.name} (Brand: ${p.brand}, Category: ${p.category}, Price: ₹${p.price})`)
    .join('\n');

  const looksText = looks && looks.length > 0
    ? looks.map(look => `- ${look.title}: ${look.stylistNote} (Total Price: ₹${look.totalPrice})`).join('\n')
    : '';

  let personalizationPrompt = '';
  if (personalizationSummary) {
    personalizationPrompt = `
Here are the user's learned persistent fashion memory profile details:
${JSON.stringify(personalizationSummary)}

Instruction: Add a brief personalization sentence at the end of the styling description explaining WHY the outfit matches their learned style preferences (e.g. 'I chose pastel shades because you've consistently preferred softer colours, and I paired them with sneakers since you've replaced heels several times in previous looks.'). Only generate this personalization statement if there is meaningful preference data provided. Ensure it flows naturally with the rest of the text.
`;
  }

  const prompt = `
You are a premium AI fashion stylist at StyleAI.
Your task is to write a short, engaging opening message explaining the outfit recommendations below.

IMPORTANT: Each look must feel DISTINCT. Do NOT repeat the same phrases, adjectives, or styling direction across looks.
Highlight what makes each look unique — different style themes, mood, occasion energy, or fashion direction.

User Query: "${query}"
Extracted Filters: ${JSON.stringify(filters)}

${looksText ? `Styled Looks (each should feel visually different):\n${looksText}\n` : ''}
Matching Products in Catalog:
${productsText || 'No products found.'}
${personalizationPrompt}

Write a warm, confident stylist message (2-3 sentences) that:
- Highlights that the looks represent different styling directions
- Mentions the occasion, mood, or aesthetic briefly
- Feels personal and premium, not generic
Do NOT use the word "perfect" more than once. Avoid clichés like "elevate your look".
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.warn('[Gemini Service] generateStylistExplanation failed. Using local heuristic fallback. Error:', error.message);
    const occasionStr = filters?.occasion ? `for your ${filters.occasion} event` : 'for your request';
    return `Here are some styling options curated ${occasionStr}. Each coordinate combines high-quality materials and balanced proportions to suit the mood and keep you comfortable throughout the day.`;
  }
};

/**
 * Prompts Gemini to modify a specific slot in an outfit look using candidate products.
 * @param {object} params
 * @param {object} params.currentLook - The look being modified
 * @param {Array} params.history - Conversational history
 * @param {string} params.slot - The slot being modified (main, footwear, accessory, layer)
 * @param {string} params.query - User request (e.g. "replace with sneakers")
 * @param {Array} params.candidates - Valid candidate products for the slot
 * @returns {Promise<object>} JSON containing selectedId
 */
export const modifyOutfitLook = async ({ currentLook, history, slot, query, candidates }) => {
  if (!genAI) {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in your env file.');
  }

  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: 'application/json'
    }
  });

  const candidatesList = candidates.map(c => ({
    id: c._id ? c._id.toString() : c.id,
    name: c.name,
    brand: c.brand || '',
    price: c.price,
    category: c.category || '',
    subCategory: c.subCategory || '',
    description: c.description || ''
  }));

  const prompt = `
You are an expert AI fashion stylist. The user wants to modify an existing outfit look.
Specifically, they want to modify the slot: "${slot}" in the current outfit.
The user request is: "${query}"

Here is the current look structure:
${JSON.stringify(currentLook)}

Here is the conversational history so far:
${JSON.stringify(history)}

Here is the list of available candidate products in our catalog for this modification:
${JSON.stringify(candidatesList)}

Choose the SINGLE best product from the available candidates list that matches the user's request.
Rules:
1. You must ONLY choose a product ID that is present in the candidates list above. NEVER hallucinate, invent, or return any product ID that is not in the list.
2. Prefer a product that feels DIFFERENT from what is currently in the look — aim for variety and a fresh styling direction.
3. If none of the candidates seem perfectly suitable, choose the most neutral or versatile one from the list.
4. Return ONLY a JSON object with this exact shape:
{
  "selectedId": "string (the product id from the candidates list)"
}
`;

  try {
    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }
    return JSON.parse(responseText);
  } catch (error) {
    console.warn('[Gemini Service] modifyOutfitLook failed. Using local heuristic fallback. Error:', error.message);
    const selectedId = candidates && candidates.length > 0
      ? (candidates[0]._id ? candidates[0]._id.toString() : candidates[0].id)
      : '';
    return { selectedId };
  }
};
