import { useState, useEffect } from 'react'
import { Eye, EyeOff, Sparkles, AlertCircle, CheckCircle, ArrowRight, Zap, Shield, Star, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [googleLoading, setGoogleLoading] = useState(false)

  const { login, signup, loginDemo, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [googleReady, setGoogleReady] = useState(false)
  const [googleFallback, setGoogleFallback] = useState(false)
  const [showGoogleBypassModal, setShowGoogleBypassModal] = useState(false)
  const [bypassEmail, setBypassEmail] = useState('google.user@gmail.com')

  useEffect(() => {
    // The Google SDK loads async/defer — poll until it's ready (max 2 seconds)
    let attempts = 0
    const maxAttempts = 20 // 20 × 100ms = 2 seconds
    const timer = setInterval(() => {
      attempts++
      if (typeof google !== 'undefined') {
        clearInterval(timer)
        google.accounts.id.initialize({
          client_id: '880272274240-91dnu1crtap00u0gs89sdubqv8lc1fst.apps.googleusercontent.com',
          callback: async (response) => {
            setGoogleLoading(true)
            setError('')
            try {
              await loginWithGoogle(response.credential)
              setSuccess('Signed in with Google!')
              setTimeout(() => navigate('/home'), 700)
            } catch (err) {
              setError(err.response?.data?.error || 'Google sign-in failed. Please try again.')
            } finally {
              setGoogleLoading(false)
            }
          }
        })
        setGoogleReady(true)
        setGoogleFallback(false)
      } else if (attempts >= maxAttempts) {
        clearInterval(timer)
        // SDK failed to load (blocked by firewall/adblocker) — trigger manual fallback
        setGoogleReady(false)
        setGoogleFallback(true)
      }
    }, 100)
    return () => clearInterval(timer)
  }, [loginWithGoogle, navigate])

  // Render button once the container is guaranteed to be in the DOM
  useEffect(() => {
    if (googleReady && !googleFallback) {
      const container = document.getElementById('google-login-btn-container')
      if (container && typeof google !== 'undefined') {
        google.accounts.id.renderButton(
          container,
          { theme: 'outline', size: 'large', width: '384', text: 'continue_with' }
        )
      }
    }
  }, [googleReady, googleFallback])

  const handleGoogleBypassSubmit = async (e) => {
    e.preventDefault()
    if (!bypassEmail.trim() || !bypassEmail.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    setShowGoogleBypassModal(false)
    setGoogleLoading(true)
    setError('')
    setSuccess('')
    try {
      await loginWithGoogle(bypassEmail)
      setSuccess('Signed in with Google (Dev Bypass)!')
      setTimeout(() => navigate('/home'), 700)
    } catch (err) {
      setError(err.response?.data?.error || 'Google bypass failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (mode === 'signup') {
      if (!form.name.trim()) return setError('Please enter your name.')
      if (form.password !== form.confirm) return setError('Passwords do not match.')
      if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    }
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
        setSuccess('Signed in successfully! Redirecting…')
      } else {
        await signup(form.name, form.email, form.password)
        setSuccess('Account created! Redirecting…')
      }
      setTimeout(() => navigate('/home'), 800)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-16 flex" style={{ background: '#f8fafc' }}>

      {/* ── Left Panel — Branding ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] flex-shrink-0 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1e0a3c 0%, #2d1060 45%, #1a0a35 100%)' }}
      >
        {/* Glow orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }}>
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">StyleAI</span>
          </div>
        </div>

        {/* Center copy */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', color: '#c4b5fd' }}>
            <Zap size={11} /> AI-Powered Fashion Platform
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Dress smarter<br />
            <span style={{ background: 'linear-gradient(135deg, #c4b5fd, #f0abfc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              with AI
            </span>
          </h1>
          <p className="text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Get personalized outfit recommendations powered by OpenAI — tailored to your occasion, style, and budget.
          </p>

          {/* Feature list */}
          <div className="space-y-4">
            {[
              { icon: <Sparkles size={15} />, text: 'AI outfit generator for any occasion' },
              { icon: <Shield size={15} />, text: 'Secure authentication & private data' },
              { icon: <Star size={15} />, text: 'Curated catalog with 10,000+ styles' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(139,92,246,0.25)', color: '#c4b5fd' }}>
                  {icon}
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom testimonial */}
        <div className="relative z-10 p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex text-amber-400 gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
          </div>
          <p className="text-sm italic leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
            "StyleAI helped me find the perfect outfit for my job interview. The AI recommendations were spot-on!"
          </p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm" style={{ background: 'rgba(139,92,246,0.3)' }}>👩‍💼</div>
            <div>
              <div className="text-xs font-semibold text-white">Priya Sharma</div>
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Fashion Blogger</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel — Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-10" style={{ background: '#f8fafc' }}>
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 justify-center mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }}>
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">StyleAI</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
            </h2>
            <p className="text-sm text-gray-500">
              {mode === 'login'
                ? 'Welcome back — enter your details below.'
                : 'Start your fashion journey — it\'s free.'}
            </p>
          </div>

          {/* Tab toggle */}
          <div className="flex rounded-xl p-1 mb-7" style={{ background: '#eef2f7' }}>
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                id={`auth-tab-${m}`}
                onClick={() => { setMode(m); setError(''); setSuccess('') }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
                style={mode === m
                  ? { background: 'white', color: '#6d28d9', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
                  : { color: '#9ca3af' }
                }
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Alerts */}
          {error && (
            <div className="flex items-start gap-2.5 px-4 py-3 mb-5 rounded-xl text-sm" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2.5 px-4 py-3 mb-5 rounded-xl text-sm" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' }}>
              <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
              {success}
            </div>
          )}

          {/* Google Sign-In Button */}
          {googleLoading ? (
            <div className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 mb-5"
              style={{ background: 'white', border: '1.5px solid #e2e8f0' }}>
              <svg className="animate-spin w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Signing in with Google…
            </div>
          ) : googleReady ? (
            <div className="w-full flex flex-col items-center gap-1.5 mb-5">
              <div id="google-login-btn-container" className="w-full max-w-sm flex justify-center min-h-[40px]" />
              <button
                type="button"
                onClick={() => setShowGoogleBypassModal(true)}
                className="text-[11px] text-lavender-600 hover:text-lavender-800 font-bold hover:underline transition-all mt-1"
              >
                Google button not displaying? Click here to bypass
              </button>
            </div>
          ) : googleFallback ? (
            <button
              type="button"
              onClick={() => setShowGoogleBypassModal(true)}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-5"
              style={{ background: 'white', border: '1.5px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
            >
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google (Bypass)
            </button>
          ) : (
            // SDK still loading — show a skeleton/placeholder
            <div className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 mb-5 animate-pulse cursor-not-allowed"
              style={{ background: '#f8fafc', border: '1.5px dashed #e2e8f0' }}>
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] opacity-40" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Loading Google Sign-In…
            </div>
          )}

          <div className="relative flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
                <input
                  id="auth-name" type="text" name="name"
                  value={form.name} onChange={handleChange}
                  required placeholder="Jane Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm text-gray-800 outline-none transition-all"
                  style={{ background: 'white', border: '1.5px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
                  onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.08)' }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)' }}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input
                id="auth-email" type="email" name="email"
                value={form.email} onChange={handleChange}
                required placeholder="you@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm text-gray-800 outline-none transition-all"
                style={{ background: 'white', border: '1.5px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
                onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.08)' }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)' }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-700">Password</label>
                {mode === 'login' && (
                  <button type="button" className="text-xs font-medium transition-colors" style={{ color: '#7c3aed' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#5b21b6'}
                    onMouseLeave={e => e.currentTarget.style.color = '#7c3aed'}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password} onChange={handleChange}
                  required placeholder="Min. 6 characters"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl text-sm text-gray-800 outline-none transition-all"
                  style={{ background: 'white', border: '1.5px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
                  onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.08)' }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)' }}
                />
                <button
                  type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                <input
                  id="auth-confirm" type="password" name="confirm"
                  value={form.confirm} onChange={handleChange}
                  required placeholder="Re-enter password"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm text-gray-800 outline-none transition-all"
                  style={{ background: 'white', border: '1.5px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
                  onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.08)' }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)' }}
                />
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)', boxShadow: '0 4px 14px rgba(109,40,217,0.35)' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 6px 20px rgba(109,40,217,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(109,40,217,0.35)' }}
            >
              {loading ? 'Please wait…' : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}
              className="font-semibold transition-colors"
              style={{ color: '#7c3aed' }}
            >
              {mode === 'login' ? 'Sign up for free' : 'Sign in'}
            </button>
          </p>

          {mode === 'signup' && (
            <p className="text-center text-[11px] text-gray-400 mt-3">
              By creating an account, you agree to our{' '}
              <a href="#" className="underline hover:text-gray-600">Terms of Service</a> and{' '}
              <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
            </p>
          )}
        </div>
      </div>

      {/* ── Google Dev Bypass Modal ── */}
      {showGoogleBypassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 flex flex-col relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowGoogleBypassModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-50 text-violet-600">
                <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Google Dev Bypass</h3>
                <p className="text-xs text-slate-500">For offline/firewalled local testing</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              Google Identity Services failed to load. Use this mock bypass to sign in. The backend will create/link a real MongoDB account with this email.
            </p>

            <form onSubmit={handleGoogleBypassSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Simulated Google Email</label>
                <input
                  type="email"
                  value={bypassEmail}
                  onChange={(e) => setBypassEmail(e.target.value)}
                  required
                  placeholder="name@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm text-gray-800 outline-none transition-all"
                  style={{ background: 'white', border: '1.5px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
                  onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.08)' }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)' }}
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowGoogleBypassModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white text-sm font-semibold transition-all"
                  style={{ background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)', boxShadow: '0 4px 14px rgba(109,40,217,0.3)' }}
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
