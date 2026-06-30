import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ShoppingBag, ArrowLeft, Calendar, Package, MapPin, CreditCard,
  XCircle, CheckCircle2, Clock, Truck, ShieldCheck, AlertCircle, RefreshCw
} from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'

const TIMELINE_STEPS = [
  { status: 'Pending', label: 'Order Placed', desc: 'We have received your order request.', icon: Clock },
  { status: 'Confirmed', label: 'Confirmed', desc: 'Your order has been verified and confirmed.', icon: ShieldCheck },
  { status: 'Shipped', label: 'In Transit', desc: 'Your package is on its way to your address.', icon: Truck },
  { status: 'Delivered', label: 'Delivered', desc: 'Package has been delivered to you.', icon: CheckCircle2 }
]

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn, isDemo } = useAuth() || {}

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(false)
  const [feedback, setFeedback] = useState({ text: '', type: '' })

  const showFeedback = (text, type = 'success') => {
    setFeedback({ text, type })
    setTimeout(() => setFeedback({ text: '', type: '' }), 4500)
  }

  const fetchOrderDetail = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api.get(`/orders/${id}`)
      setOrder(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch order details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false)
      return
    }
    if (isDemo) {
      setError('Order details are not available in Demo Mode.')
      setLoading(false)
      return
    }
    fetchOrderDetail()
  }, [id, isLoggedIn, isDemo])

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return
    }

    setCancelling(true)
    setError('')
    try {
      const res = await api.patch(`/orders/${id}/cancel`)
      showFeedback(res.data.message || 'Order cancelled successfully.', 'success')
      // Fetch details again to refresh status
      await fetchOrderDetail()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel the order. Please try again.')
    } finally {
      setCancelling(false)
    }
  }

  // Date formatter
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
            Please log in to view details for this order.
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
            Order tracking requires a connection to the live backend. Please log out and sign in using a real account to place and view real orders.
          </p>
          <Link to="/login">
            <Button variant="primary" className="w-full">Go to Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-cream-50 flex flex-col items-center justify-center px-4">
        <div className="animate-spin text-lavender-500 mb-4">
          <RefreshCw size={32} />
        </div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Loading Order Details…</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="pt-24 min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-cream-200 p-8 text-center max-w-md w-full shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-3xl text-rose-500 mx-auto mb-5">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Error</h2>
          <p className="text-rose-600 text-xs font-semibold mb-6">
            {error || 'The requested order could not be loaded.'}
          </p>
          <Link to="/orders">
            <Button variant="secondary" className="w-full">Return to Order History</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Determine current timeline progress index
  const currentStatusIndex = TIMELINE_STEPS.findIndex(step => step.status === order.status)
  const isCancelled = order.status === 'Cancelled'
  const isCancellable = ['Pending', 'Confirmed'].includes(order.status)

  return (
    <div className="pt-16 min-h-screen bg-cream-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/orders')}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Track Order</h1>
              <p className="text-gray-500 mt-1 text-sm font-semibold">
                Order ID: <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-800">{order._id}</code>
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-bold text-gray-400 uppercase">Placed On</span>
            <span className="text-xs font-bold text-slate-700">{formatDate(order.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Timeline tracker + Ordered Items */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Timeline Progress */}
            <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                <Truck size={16} className="text-lavender-500" />
                Delivery Status Timeline
              </h2>

              {isCancelled ? (
                <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 p-5 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl flex-shrink-0">
                    ❌
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-rose-700">This order has been Cancelled</h3>
                    <p className="text-xs text-rose-500 font-medium mt-0.5">
                      Cancelled on {formatDate(order.updatedAt)}. The item inventories have been successfully restored.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative pl-6 sm:pl-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-2">
                  {/* Progress Line */}
                  <div className="absolute left-2 sm:left-4 top-2 bottom-2 sm:top-[22px] sm:left-[35px] sm:right-[35px] sm:h-[3px] w-[3px] sm:w-auto bg-slate-100 -z-0" />
                  
                  {/* Colored progress fill */}
                  {currentStatusIndex > 0 && (
                    <div 
                      className="absolute left-2 sm:left-4 top-2 sm:top-[22px] sm:left-[35px] w-[3px] sm:h-[3px] bg-lavender-500 -z-0 transition-all duration-500" 
                      style={{
                        height: '100%',
                        width: typeof window !== 'undefined' && window.innerWidth >= 640 
                          ? `${(currentStatusIndex / (TIMELINE_STEPS.length - 1)) * 90}%`
                          : '3px'
                      }}
                    />
                  )}

                  {TIMELINE_STEPS.map((step, idx) => {
                    const Icon = step.icon
                    const isCompleted = idx <= currentStatusIndex
                    const isCurrent = idx === currentStatusIndex

                    return (
                      <div key={idx} className="relative z-10 flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2 flex-1 w-full">
                        {/* Icon Bubble */}
                        <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
                          isCompleted 
                            ? 'bg-lavender-500 text-white shadow-md shadow-lavender-200' 
                            : 'bg-white text-slate-300 border-2 border-slate-100'
                        } ${isCurrent ? 'ring-4 ring-lavender-100 animate-pulse' : ''}`}>
                          <Icon size={18} />
                        </div>
                        
                        {/* Labels */}
                        <div className="flex-1 text-left sm:text-center">
                          <span className={`block text-xs font-bold ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                            {step.label}
                          </span>
                          <span className="hidden sm:block text-[9px] text-slate-400 font-semibold leading-relaxed mt-0.5 max-w-[130px] mx-auto">
                            {step.desc}
                          </span>
                          {isCurrent && (
                            <span className="block text-[8px] bg-lavender-50 text-lavender-600 border border-lavender-200 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider mt-1 w-fit sm:mx-auto">
                              Active State
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Ordered Items List */}
            <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <Package size={16} className="text-lavender-500" />
                Ordered Items ({order.items?.reduce((acc, i) => acc + i.quantity, 0) || 0})
              </h2>

              <div className="space-y-4">
                {order.items?.map((item, idx) => {
                  const productSlug = item.product?.slug || item.product
                  const isLinkable = typeof productSlug === 'string'

                  return (
                    <div key={idx} className="flex gap-4 items-center bg-cream-50/20 p-4 rounded-2xl border border-cream-100">
                      {/* Product Image */}
                      <div className="w-16 h-22 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0 border border-cream-200/50">
                        {item.productImage ? (
                          <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&auto=format&fit=crop&q=60' }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl bg-gray-50">🛍️</div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        {isLinkable ? (
                          <Link to={`/products/${productSlug}`} className="font-bold text-gray-900 text-sm hover:text-lavender-600 transition-colors block truncate">
                            {item.productName}
                          </Link>
                        ) : (
                          <h4 className="font-bold text-gray-900 text-sm truncate">{item.productName}</h4>
                        )}
                        <span className="text-[10px] text-slate-400 font-bold bg-cream-100/50 border px-2 py-0.5 rounded-md inline-block mt-1">
                          Category: {item.product?.category || 'Fashion'}
                        </span>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                          <span>Size: <strong className="text-slate-700">{item.size}</strong></span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span>Qty: <strong className="text-slate-700">{item.quantity}</strong></span>
                        </div>
                      </div>

                      {/* Pricing Snapshot */}
                      <div className="text-right flex-shrink-0">
                        <span className="text-base font-extrabold text-slate-800 block">₹{(item.priceSnapshot * item.quantity).toLocaleString()}</span>
                        <span className="text-[9px] text-slate-400 font-semibold block">₹{item.priceSnapshot.toLocaleString()} each</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>

          {/* RIGHT: Address, Payment & Billing snapshot */}
          <div className="space-y-6">
            
            {/* Delivery address card */}
            <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 pb-3 border-b">
                <MapPin size={16} className="text-lavender-500" />
                Delivery Address
              </h3>
              
              {order.addressSnapshot && (
                <div className="text-xs text-slate-600 space-y-1 bg-slate-50/50 border border-slate-200/50 p-4 rounded-2xl">
                  <span className="font-extrabold text-slate-800 block text-xs mb-1.5 uppercase tracking-wider">
                    {order.addressSnapshot.label} Destination
                  </span>
                  <p className="font-medium text-slate-700">{order.addressSnapshot.street}</p>
                  <p className="font-medium text-slate-700">{order.addressSnapshot.city}, {order.addressSnapshot.state} - {order.addressSnapshot.zipCode}</p>
                  <p className="font-medium text-slate-700 mt-2 text-[11px]">Country: {order.addressSnapshot.country || 'India'}</p>
                  
                  <div className="pt-3 border-t border-slate-200/50 mt-3 flex items-center gap-1.5 text-slate-500 font-semibold">
                    <span>📞 Phone:</span>
                    <strong className="text-slate-700">{order.addressSnapshot.phone}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 pb-3 border-b">
                <CreditCard size={16} className="text-lavender-500" />
                Payment Summary
              </h3>

              <div className="flex justify-between items-center bg-slate-50/50 border border-slate-200/50 p-4 rounded-2xl text-xs font-semibold">
                <div>
                  <span className="block font-bold text-slate-800">
                    {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment (UPI)'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Method Code: {order.paymentMethod}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                  order.paymentStatus === 'Paid' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                    : order.paymentStatus === 'Refunded'
                    ? 'bg-sky-50 border-sky-200 text-sky-600'
                    : 'bg-amber-50 border-amber-200 text-amber-600'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Billing breakdown details */}
            <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Financial Breakdown</h3>
              
              <div className="space-y-3 text-xs font-semibold text-slate-500 border-b border-slate-100 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-slate-800">₹{order.subtotal?.toLocaleString()}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Campaign Discount:</span>
                    <span>-₹{order.discount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery fee:</span>
                  <span className="text-slate-800">{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline font-black text-slate-950 text-base">
                <span>Grand Total:</span>
                <span className="text-lg">₹{order.total?.toLocaleString()}</span>
              </div>

              {/* Cancel Button */}
              {isCancellable && (
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="w-full py-3 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    {cancelling ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        Cancelling order…
                      </>
                    ) : (
                      <>
                        <XCircle size={14} />
                        Cancel Order (Cancellable)
                      </>
                    )}
                  </button>
                  <p className="text-[9px] text-slate-400 text-center mt-2 leading-relaxed">
                    This order is eligible for cancellation as it has not been packed or shipped yet.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
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
