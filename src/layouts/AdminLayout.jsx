import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, ClipboardList, Users, ArrowLeft, Menu, X, ShieldAlert, LogOut, Search, MessageSquare } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user, logout, isDemo } = useAuth() || {}
  const location = useLocation()
  const navigate = useNavigate()

  // Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null)
      setShowSearchModal(false)
      return
    }

    const delayDebounce = setTimeout(async () => {
      setSearchLoading(true)
      setShowSearchModal(true)
      try {
        const res = await api.get(`/admin/search?q=${searchQuery}`)
        setSearchResults(res.data)
      } catch (err) {
        console.error('Global search error:', err)
      } finally {
        setSearchLoading(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchQuery])

  // Guard: non-admins cannot render
  const isAdmin = user?.role === 'admin'

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Breadcrumb helper
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean)
    return paths.map((path, idx) => {
      const url = `/${paths.slice(0, idx + 1).join('/')}`
      const isLast = idx === paths.length - 1
      const label = path.charAt(0).toUpperCase() + path.slice(1)

      return (
        <span key={url} className="flex items-center">
          <span className="mx-2 text-slate-400">/</span>
          {isLast ? (
            <span className="font-semibold text-slate-800">{label}</span>
          ) : (
            <Link to={url} className="hover:text-slate-900 transition-colors capitalize">{label}</Link>
          )}
        </span>
      )
    })
  }

  const navItems = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products', icon: ShoppingBag },
    { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/buyer-connect', label: 'Buyer Connect', icon: MessageSquare }
  ]

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-slate-800 border border-slate-700/60 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mx-auto">
            <ShieldAlert size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">403 - Forbidden Access</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              You do not have administrative permissions to view the admin console. Please log in with an authorized administrator account.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Link to="/login" className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all">
              Go to Sign In
            </Link>
            <Link to="/home" className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold transition-all">
              Return to Store
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center shadow-lg">
          <span className="text-white font-extrabold text-sm">A</span>
        </div>
        <div>
          <span className="text-white font-bold text-base block tracking-wide">StyleAI Admin</span>
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest leading-none">Control Panel</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setDrawerOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                  : 'hover:bg-slate-800/60 hover:text-white'
              }`
            }
          >
            <item.icon size={18} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Session block */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-slate-800/30">
          <div className="w-9 h-9 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-sm font-bold text-violet-400">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-sm font-bold text-white truncate block">{user?.name}</span>
            <span className="text-slate-500 text-xs block capitalize">{user?.role}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-800 hover:bg-rose-950/20 hover:border-rose-900/40 hover:text-rose-400 text-slate-400 text-xs font-semibold transition-all"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8fafc] flex relative">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-slate-200/80 shadow-sm z-30">
        <SidebarContent />
      </aside>

      {/* ── Main Layout Wrapper ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar Header */}
        <header className="bg-white border-b border-slate-200/80 h-16 px-6 flex items-center justify-between shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Hamburger drawer trigger (mobile only) */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumbs */}
            <div className="hidden sm:flex items-center text-xs font-semibold text-slate-500 mr-4">
              <Link to="/home" className="hover:text-slate-900 transition-colors flex items-center gap-1">
                <ArrowLeft size={12} /> Storefront
              </Link>
              {getBreadcrumbs()}
            </div>
          </div>

          {/* Global Admin Search Bar */}
          <div className="relative max-w-xs w-64 hidden md:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Global admin search…"
              className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/50 bg-slate-50/50 transition-all font-semibold"
            />
          </div>

          <div className="flex items-center gap-4">
            {isDemo && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-bold">
                ⚡ Demo Mode
              </span>
            )}
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700 border border-slate-200">
                🛠️
              </div>
              <span className="text-sm font-bold text-slate-800 hidden sm:inline-block">Console</span>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* ── Mobile Drawer Overlays ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop shadow overlay */}
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
          />

          {/* Drawer Panel content */}
          <div className="relative w-64 bg-slate-900 h-full shadow-2xl flex flex-col z-10 animate-slide-in-left">
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* ── Global Search Results Modal Overlay ── */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-slate-900/40 backdrop-blur-sm pt-20">
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/85 rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative max-h-[75vh] flex flex-col animate-fade-in">
            <button
              onClick={() => {
                setSearchQuery('')
                setShowSearchModal(false)
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <X size={18} />
            </button>

            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              🔍 Global Search Results for <span className="text-violet-600 font-extrabold">"{searchQuery}"</span>
            </h3>
            
            {searchLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                <Loader className="w-6 h-6 animate-spin text-violet-600" />
                <span className="text-xs font-semibold">Searching StyleAI database…</span>
              </div>
            ) : (
              <div className="space-y-6 flex-1 overflow-y-auto pr-1 text-xs text-left">
                {(!searchResults || (searchResults.products?.length === 0 && searchResults.orders?.length === 0 && searchResults.users?.length === 0)) ? (
                  <p className="text-center text-slate-400 py-10 font-semibold">No results match your search term.</p>
                ) : (
                  <>
                    {/* Products Category */}
                    {searchResults.products?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">Products ({searchResults.products.length})</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {searchResults.products.map(p => (
                            <Link
                              key={p._id}
                              to={`/admin/products?q=${encodeURIComponent(p.name)}`}
                              onClick={() => {
                                setSearchQuery('')
                                setShowSearchModal(false)
                              }}
                              className="flex gap-2.5 items-center p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-violet-50/50 hover:border-violet-100 transition-all group"
                            >
                              <div className="w-8 h-10 rounded-md bg-slate-200 overflow-hidden border border-slate-200/50 flex-shrink-0">
                                {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-cover" /> : '👕'}
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="font-bold text-slate-800 block truncate group-hover:text-violet-600 transition-colors">{p.name}</span>
                                <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">{p.category}</span>
                              </div>
                              <span className="font-extrabold text-slate-700">₹{p.price.toLocaleString()}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Orders Category */}
                    {searchResults.orders?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">Orders ({searchResults.orders.length})</h4>
                        <div className="space-y-1.5">
                          {searchResults.orders.map(o => (
                            <Link
                              key={o._id}
                              to={`/admin/orders?q=${o._id}`}
                              onClick={() => {
                                setSearchQuery('')
                                setShowSearchModal(false)
                              }}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-violet-50/50 hover:border-violet-100 transition-all group"
                            >
                              <div className="flex gap-2.5 items-center">
                                <code className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">#{o._id.substring(18)}</code>
                                <span className="text-slate-500 font-bold group-hover:text-violet-600 transition-colors">{o.user?.name || 'Guest'}</span>
                              </div>
                              <div className="flex gap-3 items-center">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                                  o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                                  o.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' :
                                  'bg-amber-50 text-amber-600'
                                }`}>{o.status}</span>
                                <span className="font-extrabold text-slate-800">₹{o.total.toLocaleString()}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Users Category */}
                    {searchResults.users?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">Users ({searchResults.users.length})</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {searchResults.users.map(u => (
                            <Link
                              key={u.email}
                              to={`/admin/users?q=${encodeURIComponent(u.email)}`}
                              onClick={() => {
                                setSearchQuery('')
                                setShowSearchModal(false)
                              }}
                              className="flex gap-2.5 items-center p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-violet-50/50 hover:border-violet-100 transition-all group"
                            >
                              <div className="w-7 h-7 rounded-lg bg-violet-100/50 flex items-center justify-center text-xs font-bold text-violet-600 flex-shrink-0">
                                {u.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="font-bold text-slate-800 block truncate group-hover:text-violet-600 transition-colors">{u.name}</span>
                                <span className="text-[9px] text-slate-400 block truncate">{u.email}</span>
                              </div>
                              <span className="text-[9px] font-extrabold text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded">{u.role}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
