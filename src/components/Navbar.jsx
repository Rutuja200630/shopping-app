import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, User, MessageCircle, Search, Menu, X, Sparkles, LogOut, Heart, Package, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn, isDemo, user, logout } = useAuth()
  const { cart, wishlist, clearCartAndWishlist } = useCart()

  // Only show dark/transparent glass nav on the landing page hero
  const isLandingPage = location.pathname === '/'
  const isDark = isLandingPage && !scrolled

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-close mobile menu on navigation
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/products?q=${query}`)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDark
          ? 'bg-[#0a0a0f]/60 backdrop-blur-sm'
          : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          to="/"
          id="nav-logo"
          className="flex items-center gap-2 flex-shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className={`text-xl font-bold tracking-tight transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Style<span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
          <Link
            to="/products"
            id="nav-shop"
            className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
              isDark ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-violet-700 hover:bg-violet-50'
            }`}
          >
            Shop
          </Link>
        </div>

        {/* Search bar – desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-sm mx-4"
        >
          <div className="relative w-full">
            <Search
              size={16}
              className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${isDark ? 'text-white/50' : 'text-gray-400'}`}
            />
            <input
              id="nav-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search styles, brands…"
              className={`w-full pl-9 pr-4 py-2 rounded-2xl border transition-all text-sm focus:outline-none focus:ring-2 ${
                isDark
                  ? 'bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-white/40 focus:ring-white/10'
                  : 'bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400 focus:border-violet-300 focus:ring-violet-100'
              }`}
            />
          </div>
        </form>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          {user?.role !== 'admin' && (
            <Link
              to="/ai-stylist"
              id="nav-ai-stylist"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white text-xs font-semibold shadow hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-105 transition-all mr-2"
            >
              <Sparkles size={13} />
              AI Stylist
            </Link>
          )}

          {user?.role !== 'admin' && (
            <NavIcon to="/chat" id="nav-chat" label="Chat" isDark={isDark}>
              <MessageCircle size={20} />
            </NavIcon>
          )}

          {isLoggedIn ? (
            <div className="flex items-center gap-1">
              <Link to="/profile" className={`hidden sm:block text-xs font-semibold px-2 hover:text-violet-600 transition-colors ${isDark ? 'text-white/80' : 'text-gray-600'}`}>
                Hi, {user?.name?.split(' ')[0]} 👋
              </Link>
              {user?.role === 'admin' && (
                <NavIcon to="/admin" id="nav-admin" label="Admin Panel" isDark={isDark}>
                  <Settings size={20} />
                </NavIcon>
              )}
              {user?.role !== 'admin' && (
                <NavIcon to="/orders" id="nav-orders" label="My Orders" isDark={isDark}>
                  <Package size={20} />
                </NavIcon>
              )}
              <button
                id="nav-logout"
                onClick={async () => {
                  await logout()
                  clearCartAndWishlist()
                  navigate('/login')
                }}
                aria-label="Logout"
                className={`p-2 rounded-xl transition-all ${isDark ? 'text-white/70 hover:text-red-400 hover:bg-white/10' : 'text-gray-600 hover:text-red-500 hover:bg-red-50'}`}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <NavIcon to="/login" id="nav-profile" label="Profile" isDark={isDark}>
              <User size={20} />
            </NavIcon>
          )}

          {user?.role !== 'admin' && (
            <NavIcon to="/wishlist" id="nav-wishlist" label="Wishlist" badge={wishlist.length > 0 ? wishlist.length : null} isDark={isDark}>
              <Heart size={20} />
            </NavIcon>
          )}

          {user?.role !== 'admin' && (
            <NavIcon to="/cart" id="nav-cart" label="Cart" badge={cart.length > 0 ? cart.length : null} isDark={isDark}>
              <ShoppingBag size={20} />
            </NavIcon>
          )}

          {/* Hamburger */}
          <button
            id="nav-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden ml-1 p-2 rounded-xl transition-colors ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Demo mode banner */}
      {isDemo && (
        <div className="bg-amber-400 text-amber-950 text-xs font-semibold text-center py-1.5 px-4">
          ⚡ Demo mode — backend not connected. Start <code className="font-mono bg-amber-300/50 px-1 rounded">backend/</code> server for full features.
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1 shadow-lg animate-fade-in">
          <form onSubmit={handleSearch} className="mb-2">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search styles, brands…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-violet-300 focus:outline-none text-sm"
              />
            </div>
          </form>
          {[
            { to: '/', label: '🏠 Home' },
            { to: '/products', label: '🛍️ Shop All' },
            ...(user?.role !== 'admin' ? [
              { to: '/ai-stylist', label: '✨ AI Stylist' },
              { to: '/chat', label: '💬 Style Chat' },
              { to: '/cart', label: `🛒 Cart (${cart.length})` },
              { to: '/wishlist', label: `❤️ Wishlist (${wishlist.length})` }
            ] : []),
            ...(isLoggedIn
              ? [
                  { to: '/profile', label: '👤 My Profile' },
                  ...(user?.role === 'admin' ? [{ to: '/admin', label: '🛠️ Admin Panel' }] : []),
                  ...(user?.role !== 'admin' ? [{ to: '/orders', label: '📦 My Orders' }] : [])
                ]
              : [{ to: '/login', label: '🔐 Login / Sign Up' }])
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-violet-50 hover:text-violet-700 text-gray-700 font-medium transition-colors text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

function NavIcon({ to, id, label, badge, isDark, children }) {
  return (
    <Link
      to={to}
      id={id}
      aria-label={label}
      title={label}
      className={`relative p-2 rounded-xl transition-all ${
        isDark
          ? 'text-white/80 hover:text-white hover:bg-white/10'
          : 'text-gray-600 hover:text-violet-600 hover:bg-violet-50'
      }`}
    >
      {children}
      {badge && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-violet-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
          {badge}
        </span>
      )}
    </Link>
  )
}
