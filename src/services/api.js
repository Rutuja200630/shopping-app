import axios from 'axios'

// All API calls go to /api (proxied to localhost:5000 by Vite)
const api = axios.create({
  baseURL: '/api',
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
