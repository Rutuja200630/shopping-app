import axios from 'axios'

// Normalize VITE_API_URL to ensure it always ends with /api (handling missing/duplicate path suffixes)
let apiURL = import.meta.env.VITE_API_URL || '';

if (apiURL) {
  if (!apiURL.endsWith('/api') && !apiURL.endsWith('/api/')) {
    const normalized = apiURL.endsWith('/') ? apiURL.slice(0, -1) : apiURL;
    apiURL = `${normalized}/api`;
  }
} else {
  apiURL = '/api';
}

const api = axios.create({
  baseURL: apiURL,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach JWT token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('styleai_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('styleai_token')
      localStorage.removeItem('styleai_user')
      // Don't force redirect here — let AuthContext handle it
    }
    return Promise.reject(error)
  }
)

export default api
