import { createContext, useContext, useState, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

const normalizeUser = (usr) => {
  if (!usr) return null;
  let avatarUrl = '';
  if (usr.avatar) {
    if (typeof usr.avatar === 'string') {
      avatarUrl = usr.avatar;
    } else if (typeof usr.avatar === 'object') {
      avatarUrl = usr.avatar.url || '';
    }
  }
  return { ...usr, avatar: avatarUrl };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('styleai_user')
      return stored ? normalizeUser(JSON.parse(stored)) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => localStorage.getItem('styleai_token') || null)
  const [isDemo, setIsDemo] = useState(() => localStorage.getItem('styleai_demo') === 'true')

  // Helper: persist auth state
  const persist = (tok, usr, demo = false) => {
    const normalizedUser = normalizeUser(usr)
    localStorage.setItem('styleai_token', tok)
    localStorage.setItem('styleai_user', JSON.stringify(normalizedUser))
    localStorage.setItem('styleai_demo', demo ? 'true' : 'false')
    setToken(tok)
    setUser(normalizedUser)
    setIsDemo(demo)
  }

  // ── signup ────────────────────────────────────────────────────────────────
  const signup = useCallback(async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password })
      const { token: newToken, user: newUser } = res.data
      persist(newToken, newUser, false)
      return newUser
    } catch (err) {
      // Fall back to demo if: no response (network error) OR Vite proxy 404 (backend not running)
      const isOffline = !err.response || (err.response.status === 404 && !err.response.data?.error)
      if (isOffline) {
        const demoUser = { id: 'demo-' + Date.now(), name, email }
        const demoToken = 'demo_token_' + btoa(email)
        persist(demoToken, demoUser, true)
        return demoUser
      }
      throw err
    }
  }, [])

  // ── login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password })
      const { token: newToken, user: newUser } = res.data
      persist(newToken, newUser, false)
      return newUser
    } catch (err) {
      // Fall back to demo if: no response (network error) OR Vite proxy 404 (backend not running)
      const isOffline = !err.response || (err.response.status === 404 && !err.response.data?.error)
      if (isOffline) {
        const name = email.split('@')[0]
        const demoUser = { id: 'demo-' + Date.now(), name, email }
        const demoToken = 'demo_token_' + btoa(email)
        persist(demoToken, demoUser, true)
        return demoUser
      }
      throw err
    }
  }, [])

  // ── loginDemo ─────────────────────────────────────────────────────────────
  const loginDemo = useCallback((name, email) => {
    const demoUser = { id: 'demo-' + Date.now(), name: name || email.split('@')[0], email }
    const demoToken = 'demo_token_' + btoa(email)
    persist(demoToken, demoUser, true)
    return demoUser
  }, [])

  // ── loginWithGoogle ───────────────────────────────────────────────────────
  const loginWithGoogle = useCallback(async (credential) => {
    try {
      const res = await api.post('/auth/google', { credential })
      const { token: newToken, user: newUser } = res.data
      persist(newToken, newUser, false)
      return newUser
    } catch (err) {
      // Fallback to demo login if backend is offline/404 during Google auth testing
      const isOffline = !err.response || (err.response.status === 404 && !err.response.data?.error)
      if (isOffline) {
        return loginDemo('Google User', 'google.user@gmail.com')
      }
      throw err
    }
  }, [loginDemo])

  // ── logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      if (!isDemo) {
        await api.post('/auth/logout')
      }
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      localStorage.removeItem('styleai_token')
      localStorage.removeItem('styleai_user')
      localStorage.removeItem('styleai_demo')
      setToken(null)
      setUser(null)
      setIsDemo(false)
    }
  }, [isDemo])

  return (
    <AuthContext.Provider value={{ user, token, login, loginDemo, loginWithGoogle, logout, signup, isLoggedIn: !!token, isDemo }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
