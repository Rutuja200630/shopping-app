/**
 * Service to manage user activity history for personalization
 */

const KEYS = {
  SEARCHES: 'styleai_recent_searches',
  VIEWED: 'styleai_viewed_products',
  PREFERENCES: 'styleai_user_preferences' // counts for categories/occasions
}

export const historyService = {
  // ─── Search History ────────────────────────────────────────────────────────
  saveSearch(query) {
    if (!query || query.trim().length < 2) return
    const q = query.trim().toLowerCase()
    let searches = this.getSearches()
    searches = [q, ...searches.filter(s => s !== q)].slice(0, 10)
    localStorage.setItem(KEYS.SEARCHES, JSON.stringify(searches))
    this._updatePreferencesFromSearch(q)
  },

  getSearches() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.SEARCHES) || '[]')
    } catch {
      return []
    }
  },

  // ─── View History ──────────────────────────────────────────────────────────
  saveView(product) {
    if (!product || !product.id) return
    let viewed = this.getViewed()
    viewed = [product.id, ...viewed.filter(id => id !== product.id)].slice(0, 20)
    localStorage.setItem(KEYS.VIEWED, JSON.stringify(viewed))
    this._updatePreferencesFromProduct(product)
  },

  getViewed() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.VIEWED) || '[]')
    } catch {
      return []
    }
  },

  // ─── Preference Tracking ───────────────────────────────────────────────────
  getUserPreferences() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.PREFERENCES) || '{"categories":{}, "occasions":{}}')
    } catch {
      return { categories: {}, occasions: {} }
    }
  },

  _updatePreferencesFromSearch(query) {
    const prefs = this.getUserPreferences()
    // Simple: if search matches a category name, boost it
    const terms = query.split(' ')
    terms.forEach(t => {
      // Normalize common terms
      if (['men', 'man'].includes(t)) this._boost(prefs.categories, 'Men')
      if (['women', 'woman', 'girl'].includes(t)) this._boost(prefs.categories, 'Women')
      if (['casual', 'daily'].includes(t)) this._boost(prefs.occasions, 'Casual')
      if (['formal', 'office', 'work'].includes(t)) this._boost(prefs.occasions, 'Formal')
      if (['party', 'night', 'club'].includes(t)) this._boost(prefs.occasions, 'Party')
    })
    localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(prefs))
  },

  _updatePreferencesFromProduct(product) {
    const prefs = this.getUserPreferences()
    if (product.category) this._boost(prefs.categories, product.category)
    if (product.occasion) this._boost(prefs.occasions, product.occasion)
    localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(prefs))
  },

  _boost(obj, key) {
    obj[key] = (obj[key] || 0) + 1
  },

  getTopPreference() {
    const prefs = this.getUserPreferences()
    const topCat = Object.entries(prefs.categories).sort((a,b) => b[1] - a[1])[0]
    const topOcc = Object.entries(prefs.occasions).sort((a,b) => b[1] - a[1])[0]
    return {
      category: topCat ? topCat[0] : null,
      occasion: topOcc ? topOcc[0] : null
    }
  }
}
