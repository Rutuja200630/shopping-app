import api from './api';

/**
 * Sends a chat message in a session context to the Gemini-powered AI Stylist.
 * 
 * @param {string} message - User query message text.
 * @param {string} sessionId - Unique identifier tracking session conversational memory.
 * @returns {Promise<object>} Response data matching { success, intent, response, products }
 */
export const getStylistChatResponse = async (message, sessionId) => {
  const response = await api.post('/ai/chat', { message, sessionId });
  return response.data;
};

/**
 * Legacy wrapper for product suggestions compatibility.
 */
export const getStylistRecommendations = async (query, sessionId) => {
  const data = await getStylistChatResponse(query, sessionId);
  return {
    success: data.success,
    filters: data.intent,
    stylistMessage: data.response,
    products: data.products
  };
};

/**
 * Sends a modification request to alter a generated look.
 */
export const modifyOutfitLook = async ({ sessionId, lookId, slot, action, query }) => {
  const response = await api.post('/ai/modify-look', { sessionId, lookId, slot, action, query });
  return response.data;
};

/**
 * Fetches user's learned persistent fashion preferences.
 */
export const getUserPreferences = async () => {
  const response = await api.get('/ai/preferences');
  return response.data;
};

/**
 * Updates user's persistent fashion preferences or removes a specific preference chip.
 */
export const updateUserPreferences = async (updates) => {
  const response = await api.put('/ai/preferences', updates);
  return response.data;
};
