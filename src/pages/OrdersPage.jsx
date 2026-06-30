import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight, Sparkles, Package, MapPin, Calendar, CreditCard, XCircle, AlertCircle, Loader } from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'

export default function OrdersPage() {
  const { isLoggedIn, isDemo } = useAuth() || {}
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)
  const [feedback, setFeedback] = useState({ text: '', type: '' })

  const showFeedback = (text, type = 'success') => {
    setFeedback({ text, type })
    setTimeout(() => setFeedback({ text: '', type: '' }), 4500)
  }

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false)
      return
    }

    const fetchOrders = async () => {
      try {
        if (isDemo) {
          // Demo fallback
          setOrders([])
          setLoading(false)
          return
        }

        const res = await api.get('/orders')
        setOrders(res.data)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch order history.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [isLoggedIn, isDemo])

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return
    }

    setCancellingId(orderId)
    setError('')
    try {
      const res = await api.patch(`/orders/${orderId}/cancel`)
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? { ...order, status: 'Cancelled', paymentStatus: order.paymentStatus === 'Paid' ? 'Refunded' : order.paymentStatus }
            : order
        )
      )
      showFeedback(res.data.message || 'Order cancelled successfully.', 'success')
    } catch (err) {
      showFeedback(err.response?.data?.error || 'Failed to cancel the order. Please try again.', 'error')
    } finally {
      setCancellingId(null)
    }
  }

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'Pending':
        return { bg: 'bg-amber-50 border-amber-200 text-amber-600', dot: 'bg-amber-500' }
      case 'Confirmed':
        return { bg: 'bg-sky-50 border-sky-200 text-sky-600', dot: 'bg-sky-500' }
      case 'Shipped':
        return { bg: 'bg-indigo-50 border-indigo-200 text-indigo-600', dot: 'bg-indigo-500' }
      case 'Delivered':
        return { bg: 'bg-emerald-50 border-emerald-200 text-emerald-600', dot: 'bg-emerald-500' }
      case 'Cancelled':
        return { bg: 'bg-rose-50 border-rose-200 text-rose-600', dot: 'bg-rose-500' }
      default:
        return { bg: 'bg-gray-50 border-gray-200 text-gray-600', dot: 'bg-gray-500' }
    }
  }

  // Formatting helper for MongoDB ISO dates
  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'N/A'
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="pt-24 min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-cream-200 p-8 text-center max-w-md w-full shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-lavender-50 border border-lavender-100 flex items-center justify-center text-3xl mx-auto mb-5">
            🔐
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Please log in to view your order history and track your packages.
          </p>
          <Link to="/login">
            <Button variant="primary" className="w-full">Sign In / Create Account</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isDemo) {
    return (
      <div className="pt-24 min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-cream-200 p-8 text-center max-w-md w-full shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-3xl mx-auto mb-5">
            ⚡
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unavailable in Demo Mode</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Order history requires a connection to the live backend. Please log out and sign in using a real account (or Google Dev Bypass) to place and view real orders.
          </p>
          <Link to="/login">
            <Button variant="primary" className="w-full">Go to Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-cream-50 pb-24">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
            <p className="text-gray-500 mt-1 text-sm">
              {loading ? 'Fetching your past orders…' : `${orders.length} order${orders.length !== 1 ? 's' : ''} placed`}
            </p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-lavender-600 hover:text-lavender-800 transition-colors flex items-center gap-1">
            Continue Shopping <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          /* Skeletons Loader */
          <div className="space-y-6">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white rounded-3xl border border-cream-200 p-6 animate-pulse space-y-4">
                <div className="h-6 bg-cream-100 w-1/3 rounded-lg" />
                <div className="h-24 bg-cream-50 w-full rounded-2xl" />
                <div className="h-10 bg-cream-100 w-1/4 rounded-lg self-end ml-auto" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-sm text-rose-600">
            <AlertCircle size={18} className="flex-shrink-0" />
            {error}
          </div>
        ) : orders.length === 0 ? (
          /* High-Quality Empty State */
          <div className="bg-white rounded-[2.5rem] border border-cream-200 p-12 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-20 h-20 rounded-3xl bg-lavender-50 border border-lavender-100 flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm animate-float">
              📦
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Orders Placed Yet</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed mb-8">
              Looks like you haven't placed any orders yet. Find your style matches with our AI Stylist or browse our latest catalog!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/products">
                <Button variant="primary" size="lg">Explore Catalog</Button>
              </Link>
              <Link to="/ai-stylist">
                <Button variant="secondary" size="lg" className="flex items-center gap-2">
                  <Sparkles size={16} /> Outfit Recommendations
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-8">
            {orders.map((order) => {
              const badge = getStatusBadgeStyles(order.status)
              const cancellable = ['Pending', 'Confirmed'].includes(order.status)

              return (
                <div
                  key={order._id}
                  id={`order-${order._id}`}
                  className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden transition-all hover:shadow-md"
                >
                  {/* Order Header Summary */}
                  <div className="bg-cream-50/50 border-b border-cream-100 px-6 py-5 flex flex-wrap gap-y-4 items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-gray-400">ORDER ID</span>
                        <code className="text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2.5 py-0.5 rounded-lg shadow-sm">
                          {order._id}
                        </code>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar size={13} className="text-gray-400" />
                        <span>Placed on {formatDate(order.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status Badge */}
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {order.status}
                      </span>
                      
                      {/* Final Order Price */}
                      <div className="text-right">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase leading-none">Total Amount</span>
                        <span className="text-lg font-extrabold text-gray-900">₹{order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Column 1: Order Items List (Takes up 2 cols on wide screens) */}
                    <div className="lg:col-span-2 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-3">
                        <Package size={14} /> Ordered Items ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
                      </h3>
                      <div className="space-y-3.5">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-4 items-center bg-cream-50/20 p-3 rounded-2xl border border-cream-100">
                            {/* Product Image */}
                            <div className="w-16 h-20 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0 border border-cream-200/50">
                              {item.productImage ? (
                                <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&auto=format&fit=crop&q=60' }} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-50">🛍️</div>
                              )}
                            </div>
                            
                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 text-sm truncate">{item.productName}</h4>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                <span>Size: <strong className="text-gray-700">{item.size}</strong></span>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <span>Qty: <strong className="text-gray-700">{item.quantity}</strong></span>
                              </div>
                            </div>

                            {/* Price Snapshot */}
                            <div className="text-right">
                              <span className="text-sm font-extrabold text-gray-900">₹{item.priceSnapshot.toLocaleString()}</span>
                              <span className="block text-[10px] text-gray-400">each</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Delivery & Billing details */}
                    <div className="bg-cream-50/30 border border-cream-100/50 rounded-2xl p-5 space-y-5">
                      {/* Delivery Address Snapshot */}
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                          <MapPin size={14} /> Delivery Address
                        </h4>
                        <div className="text-xs text-gray-700 space-y-0.5 leading-relaxed bg-white/70 border border-cream-200/60 p-3 rounded-xl">
                          <span className="font-bold block text-gray-900 mb-0.5">{order.addressSnapshot.label} Address</span>
                          <p>{order.addressSnapshot.street}</p>
                          <p>{order.addressSnapshot.city}, {order.addressSnapshot.state} - {order.addressSnapshot.zipCode}</p>
                          <p className="mt-1 text-gray-500">📞 Phone: {order.addressSnapshot.phone}</p>
                        </div>
                      </div>

                      {/* Payment Snapshot */}
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                          <CreditCard size={14} /> Payment Details
                        </h4>
                        <div className="text-xs text-gray-700 space-y-1 bg-white/70 border border-cream-200/60 p-3 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="font-semibold block text-gray-800">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</span>
                            <span className="text-[10px] text-gray-400">Status: {order.paymentStatus}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            order.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Bill Summary */}
                      <div className="border-t border-cream-100 pt-3 space-y-1.5 text-xs">
                        <div className="flex justify-between text-gray-500">
                          <span>Subtotal:</span>
                          <span>₹{order.subtotal.toLocaleString()}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-emerald-600">
                            <span>Discount:</span>
                            <span>-₹{order.discount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-500">
                          <span>Shipping:</span>
                          <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
                        </div>
                        <div className="flex justify-between font-extrabold text-gray-900 border-t border-cream-100 pt-2 text-sm">
                          <span>Grand Total:</span>
                          <span>₹{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions footer */}
                  <div className="bg-cream-50/30 border-t border-cream-100 px-6 py-4 flex justify-end gap-3">
                    <Link to={`/orders/${order._id}`}>
                      <Button variant="secondary" size="sm" className="text-xs">
                        View Details
                      </Button>
                    </Link>
                    {cancellable && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingId === order._id}
                        className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-white hover:bg-rose-600 hover:border-rose-600 transition-all"
                      >
                        {cancellingId === order._id ? (
                          <>
                            <Loader size={12} className="animate-spin" />
                            Cancelling…
                          </>
                        ) : (
                          <>
                            <XCircle size={14} />
                            Cancel Order
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {feedback.text && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 border animate-fade-in ${
          feedback.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-700'
            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          <AlertCircle size={16} />
          <span className="text-xs font-bold">{feedback.text}</span>
        </div>
      )}
    </div>
  )
}
