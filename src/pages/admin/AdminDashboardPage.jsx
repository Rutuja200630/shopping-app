import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  ShoppingBag,
  ClipboardList,
  DollarSign,
  Calendar,
  ArrowRight,
  Loader,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  TrendingDown,
  AlertTriangle,
  Package,
  Heart,
  Sparkles,
  Star
} from 'lucide-react'
import api from '../../services/api'

// Native premium SVG Chart
function LineChart({ data, dataKey, stroke = "#8b5cf6", fillGradient = "violet-grad", suffix = "" }) {
  if (!data || data.length === 0) {
    return <div className="text-slate-400 text-xs py-10 text-center font-bold">No telemetry data available</div>
  }

  const width = 500
  const height = 140
  const padding = 20
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  const values = data.map(d => d[dataKey] || 0)
  const maxValue = Math.max(...values, 1)

  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth
    const y = padding + chartHeight - ((d[dataKey] || 0) / maxValue) * chartHeight
    return { x, y }
  })

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`
  }, "")

  const areaD = points.length > 0 ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z` : ""

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <defs>
        <linearGradient id={fillGradient} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      
      {/* Horizontal grid lines */}
      <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f8fafc" strokeWidth="1.5" />
      <line x1={padding} y1={padding + chartHeight / 2} x2={width - padding} y2={padding + chartHeight / 2} stroke="#f8fafc" strokeWidth="1.5" />
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#f1f5f9" strokeWidth="2" />

      {/* Area and Line Path */}
      {points.length > 0 && (
        <>
          <path d={areaD} fill={`url(#${fillGradient})`} />
          <path d={pathD} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}

      {/* Axis markers */}
      <text x={padding} y={height - 4} fill="#94a3b8" fontSize="8" fontWeight="bold">30d Ago</text>
      <text x={width - padding} y={height - 4} fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="end">Today</text>
      <text x={width - padding} y={padding - 4} fill="#64748b" fontSize="8" fontWeight="extrabold" textAnchor="end">Max: {suffix}{maxValue.toLocaleString()}</text>
    </svg>
  )
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard')
        setStats(res.data)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch dashboard metrics.')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 text-violet-600 animate-spin" />
          <span className="text-sm font-semibold text-slate-500 font-poppins">Loading console telemetry…</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 text-rose-600 rounded-3xl flex items-center gap-3 text-sm font-poppins">
        <span>⚠️ {error}</span>
      </div>
    )
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users, bg: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
    { label: 'Total Products', value: stats?.totalProducts ?? 0, icon: ShoppingBag, bg: 'bg-emerald-50 border-emerald-100 text-emerald-600' },
    { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: ClipboardList, bg: 'bg-amber-50 border-amber-100 text-amber-600' },
    { label: 'Total Revenue', value: `₹${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: DollarSign, bg: 'bg-violet-50 border-violet-100 text-violet-600' },
    { label: 'Pending Orders', value: stats?.pendingOrders ?? 0, icon: Clock, bg: 'bg-sky-50 border-sky-100 text-sky-600' },
    { label: 'Delivered Orders', value: stats?.deliveredOrders ?? 0, icon: CheckCircle, bg: 'bg-teal-50 border-teal-100 text-teal-600' },
    { label: 'Cancelled Orders', value: stats?.cancelledOrders ?? 0, icon: XCircle, bg: 'bg-rose-50 border-rose-100 text-rose-600' },
    { label: 'Active Products', value: stats?.activeProducts ?? 0, icon: Eye, bg: 'bg-cyan-50 border-cyan-100 text-cyan-600' },
    { label: 'Low Stock Products', value: stats?.lowStockProducts ?? 0, icon: TrendingDown, bg: 'bg-orange-50 border-orange-100 text-orange-600' },
    { label: 'Conversion Rate', value: `${stats?.conversionRate ?? 0}%`, icon: CheckCircle, bg: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
    { label: 'Wishlist Items', value: stats?.totalWishlistActivity ?? 0, icon: Heart, bg: 'bg-rose-50 border-rose-100 text-rose-600' },
    { label: 'Cart Items', value: stats?.totalCartActivity ?? 0, icon: ShoppingBag, bg: 'bg-amber-50 border-amber-100 text-amber-600' },
    { label: 'Saved Looks', value: stats?.totalSavedLooks ?? 0, icon: Sparkles, bg: 'bg-violet-50 border-violet-100 text-violet-600' },
    { label: 'AI Stylist Users', value: stats?.aiStylistUsage ?? 0, icon: Sparkles, bg: 'bg-teal-50 border-teal-100 text-teal-600' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-300 font-poppins">
      {/* Title block */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Control Panel Overview</h1>
          <p className="text-slate-500 text-sm mt-0.5">Real-time telemetry and management statistics for StyleAI.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
          <Calendar size={13} />
          <span>Last 30 Days Telemetry</span>
        </div>
      </div>

      {/* ── ALERTS / NOTIFICATIONS PANEL ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Low Stock Alerts */}
        <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-4 flex gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200/50 flex items-center justify-center text-amber-600 flex-shrink-0">
            <AlertTriangle size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-slate-800 block">Low Stock Alert</span>
            <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
              {stats?.lowStockProducts > 0 
                ? `${stats.lowStockProducts} products need restocking immediately.`
                : 'All active catalog items are adequately stocked.'}
            </span>
            {stats?.lowStockProducts > 0 && (
              <Link to="/admin/products" className="text-[9px] font-bold text-amber-700 hover:underline mt-2 inline-block">
                Manage Inventory &rarr;
              </Link>
            )}
          </div>
        </div>

        {/* New Orders Alert */}
        <div className="bg-violet-50/50 border border-violet-200/60 rounded-2xl p-4 flex gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-violet-100 border border-violet-200/50 flex items-center justify-center text-violet-600 flex-shrink-0">
            <Package size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-slate-800 block">Incoming Orders</span>
            <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
              {stats?.pendingOrders > 0 
                ? `${stats.pendingOrders} orders are pending confirmed dispatch.`
                : 'All customer shipments have been processed.'}
            </span>
            {stats?.pendingOrders > 0 && (
              <Link to="/admin/orders" className="text-[9px] font-bold text-violet-700 hover:underline mt-2 inline-block">
                Process Orders &rarr;
              </Link>
            )}
          </div>
        </div>

        {/* Users Last 24 Hours */}
        <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-2xl p-4 flex gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200/50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Users size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-slate-800 block">Growth Telemetry</span>
            <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
              New customer signups are logging into the database within normal thresholds.
            </span>
            <Link to="/admin/users" className="text-[9px] font-bold text-emerald-700 hover:underline mt-2 inline-block">
              View User Log &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid (9 items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md hover:scale-[1.01] transition-all duration-300 group"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{card.label}</span>
              <span className="text-xl font-extrabold text-slate-800 block group-hover:scale-[1.02] transition-transform origin-left">{card.value}</span>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-inner ${card.bg}`}>
              <card.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* ── SVG ANALYTICS CHARTS SECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders chart */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">Orders History</h3>
            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Total orders count logged daily</span>
          </div>
          <div className="h-36 flex items-center justify-center">
            <LineChart data={stats.ordersPerDay} dataKey="count" stroke="#3b82f6" fillGradient="blue-grad" />
          </div>
        </div>

        {/* Revenue chart */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">Revenue Telemetry</h3>
            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Daily income aggregates (excluding cancels)</span>
          </div>
          <div className="h-36 flex items-center justify-center">
            <LineChart data={stats.revenuePerDay} dataKey="revenue" stroke="#8b5cf6" fillGradient="violet-grad" suffix="₹" />
          </div>
        </div>

        {/* Signup chart */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">Signups Overview</h3>
            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">New user accounts added daily</span>
          </div>
          <div className="h-36 flex items-center justify-center">
            <LineChart data={stats.usersPerDay} dataKey="count" stroke="#10b981" fillGradient="emerald-grad" />
          </div>
        </div>
      </div>

      {/* ── RECENT ACTIVITIES FEEDS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Latest Orders */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Latest Orders</h2>
                <p className="text-slate-400 text-[10px] mt-0.5">Quick tracking of incoming customer requests</p>
              </div>
              <Link to="/admin/orders" className="text-[10px] font-extrabold text-violet-600 hover:text-violet-800 flex items-center gap-1">
                View All <ArrowRight size={10} />
              </Link>
            </div>

            <div className="space-y-3">
              {stats.latestOrders?.length === 0 ? (
                <p className="text-center text-slate-400 py-6 text-xs font-semibold">No orders logged.</p>
              ) : (
                stats.latestOrders?.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-colors text-xs">
                    <div className="min-w-0">
                      <code className="font-bold text-slate-800 block">#{order._id.substring(18)}</code>
                      <span className="text-slate-400 text-[9px] block mt-0.5 truncate max-w-[120px]">{order.user?.name || 'N/A'}</span>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                        order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        order.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {order.status}
                      </span>
                      <span className="block font-extrabold text-slate-800 mt-1">₹{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Latest Users */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Latest Users</h2>
                <p className="text-slate-400 text-[10px] mt-0.5">Recently registered customers</p>
              </div>
              <Link to="/admin/users" className="text-[10px] font-extrabold text-violet-600 hover:text-violet-800 flex items-center gap-1">
                View All <ArrowRight size={10} />
              </Link>
            </div>

            <div className="space-y-3">
              {stats.latestUsers?.length === 0 ? (
                <p className="text-center text-slate-400 py-6 text-xs font-semibold">No users found.</p>
              ) : (
                stats.latestUsers?.map((u) => (
                  <div key={u.email} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all text-xs">
                    <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center text-xs font-bold text-violet-600 border border-violet-100 flex-shrink-0">
                      {u.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-slate-800 block truncate">{u.name}</span>
                      <span className="text-[9px] text-slate-400 block truncate">{u.email}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase px-1.5 py-0.5 rounded bg-slate-100">
                      {u.role}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Latest Products */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Latest Products</h2>
                <p className="text-slate-400 text-[10px] mt-0.5">New additions to catalog</p>
              </div>
              <Link to="/admin/products" className="text-[10px] font-extrabold text-violet-600 hover:text-violet-800 flex items-center gap-1">
                View All <ArrowRight size={10} />
              </Link>
            </div>

            <div className="space-y-3">
              {stats.latestProducts?.length === 0 ? (
                <p className="text-center text-slate-400 py-6 text-xs font-semibold">No products listed.</p>
              ) : (
                stats.latestProducts?.map((p) => (
                  <div key={p._id} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all text-xs">
                    <div className="w-8 h-10 bg-slate-100 rounded overflow-hidden border border-slate-200 flex-shrink-0">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        '👕'
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-slate-800 block truncate">{p.name}</span>
                      <span className="text-[9px] text-slate-400 block truncate capitalize">{p.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="block font-extrabold text-slate-800">₹{p.price.toLocaleString()}</span>
                      <span className={`text-[9px] font-bold block mt-0.5 ${p.inventory < 10 ? 'text-amber-500' : 'text-slate-400'}`}>
                        {p.inventory} left
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ── METRIC INSIGHTS / BEST SELLERS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Best Sellers */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-4">Best Sellers</h2>
          <div className="space-y-3">
            {stats.bestSellingProducts?.length === 0 ? (
              <p className="text-center text-slate-400 py-6 text-xs font-semibold">No best sellers telemetry.</p>
            ) : (
              stats.bestSellingProducts?.map((p) => (
                <div key={p._id} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="w-8 h-10 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                    {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-slate-800 block truncate">{p.name}</span>
                    <span className="text-[9px] text-slate-400 block truncate">{p.brand}</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-extrabold text-slate-800">₹{p.price.toLocaleString()}</span>
                    <span className="text-[9px] text-amber-500 font-bold block">★ {p.ratings || 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Most Wishlisted */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-4">Most Wishlisted</h2>
          <div className="space-y-3">
            {stats.mostWishlistedProducts?.length === 0 ? (
              <p className="text-center text-slate-400 py-6 text-xs font-semibold">No wishlisted products.</p>
            ) : (
              stats.mostWishlistedProducts?.map((item, idx) => {
                const p = item._id;
                if (!p) return null;
                return (
                  <div key={p._id || idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="min-w-0">
                      <span className="font-bold text-slate-800 block truncate">{p.name}</span>
                      <span className="text-[9px] text-slate-400 block truncate">{p.brand}</span>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <span className="block font-bold text-rose-500">{item.count} Saves</span>
                      <span className="block font-bold text-slate-400 mt-0.5">₹{p.price?.toLocaleString()}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Most Carted */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-4">Most Added to Cart</h2>
          <div className="space-y-3">
            {stats.mostCartedProducts?.length === 0 ? (
              <p className="text-center text-slate-400 py-6 text-xs font-semibold">No cart items telemetry.</p>
            ) : (
              stats.mostCartedProducts?.map((item, idx) => {
                const p = item._id;
                if (!p) return null;
                return (
                  <div key={p._id || idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="min-w-0">
                      <span className="font-bold text-slate-800 block truncate">{p.name}</span>
                      <span className="text-[9px] text-slate-400 block truncate">{p.brand}</span>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <span className="block font-bold text-amber-600">{item.count} Items</span>
                      <span className="block font-bold text-slate-400 mt-0.5">₹{p.price?.toLocaleString()}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
