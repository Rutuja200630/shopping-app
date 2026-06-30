import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, Eye, Loader, CheckCircle2, AlertCircle, Calendar, MapPin, CreditCard, Package, X } from 'lucide-react'
import api from '../../services/api'

const ALLOWED_TRANSITIONS = {
  'Pending': ['Confirmed', 'Cancelled'],
  'Confirmed': ['Packed', 'Cancelled'],
  'Packed': ['Shipped'],
  'Shipped': ['Delivered'],
  'Delivered': [],
  'Cancelled': []
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [feedback, setFeedback] = useState({ text: '', type: '' })

  const showFeedback = (text, type = 'success') => {
    setFeedback({ text, type })
    setTimeout(() => setFeedback({ text: '', type: '' }), 4500)
  }

  // Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)

  const location = useLocation()

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders')
      setOrders(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('q')
    if (q) {
      setSearchQuery(q)
    }
  }, [location.search])

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus })
      
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? { 
                ...order, 
                status: newStatus,
                paymentStatus: newStatus === 'Delivered' ? 'Paid' : (newStatus === 'Cancelled' && order.paymentStatus === 'Paid' ? 'Refunded' : order.paymentStatus)
              }
            : order
        )
      )

      // Also update selectedOrder if details modal is open
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({
          ...prev,
          status: newStatus,
          paymentStatus: newStatus === 'Delivered' ? 'Paid' : (newStatus === 'Cancelled' && prev.paymentStatus === 'Paid' ? 'Refunded' : prev.paymentStatus)
        }))
      }
    } catch (err) {
      showFeedback(err.response?.data?.error || 'Failed to update order status.', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleOpenDetails = (order) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
  }

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 border-amber-200 text-amber-600'
      case 'Confirmed':
        return 'bg-sky-50 border-sky-200 text-sky-600'
      case 'Packed':
        return 'bg-violet-50 border-violet-200 text-violet-600'
      case 'Shipped':
        return 'bg-indigo-50 border-indigo-200 text-indigo-600'
      case 'Delivered':
        return 'bg-emerald-50 border-emerald-200 text-emerald-600'
      case 'Cancelled':
        return 'bg-rose-50 border-rose-200 text-rose-600'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-600'
    }
  }

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'N/A'
    }
  }

  const filteredOrders = orders.filter(order => {
    const customerName = order.user?.name || ''
    const customerEmail = order.user?.email || ''
    const orderId = order._id || ''
    const matchesSearch = customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          orderId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 text-violet-600 animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Loading orders…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Manage Orders</h1>
        <p className="text-slate-500 text-sm mt-0.5">Track shipment states and process customer orders.</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID, name or email…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs placeholder-slate-400 focus:outline-none focus:border-violet-400"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
          {['All', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-white text-violet-600 shadow'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/70">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Products Count</th>
                <th className="py-4 px-6">Total Amount</th>
                <th className="py-4 px-6">Payment Method</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 font-semibold">
                    No orders match current criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const validNext = ALLOWED_TRANSITIONS[order.status] || []
                  const isChangeable = validNext.length > 0
                  const isUpdating = updatingId === order._id

                  return (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Order ID */}
                      <td className="py-4 px-6">
                        <code className="text-slate-900 font-bold bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">
                          {order._id}
                        </code>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 block">{order.user?.name || 'N/A'}</span>
                        <span className="text-slate-400 text-[10px] block font-normal">{order.user?.email || 'N/A'}</span>
                      </td>

                      {/* Products Count */}
                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-700">
                          {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0} items
                        </span>
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-6 font-extrabold text-slate-900">
                        ₹{order.total.toLocaleString()}
                      </td>

                      {/* Payment Method */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          order.paymentMethod === 'COD' 
                            ? 'bg-amber-50/50 border-amber-100 text-amber-700' 
                            : 'bg-emerald-50/50 border-emerald-100 text-emerald-700'
                        }`}>
                          {order.paymentMethod}
                        </span>
                      </td>

                      {/* Dispatch Status */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {isChangeable ? (
                            <select
                              value={order.status}
                              disabled={isUpdating}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 font-bold focus:outline-none focus:border-violet-400 outline-none max-w-[130px]"
                            >
                              <option value={order.status}>{order.status}</option>
                              {validNext.map(val => (
                                <option key={val} value={val}>{val}</option>
                              ))}
                            </select>
                          ) : (
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeStyles(order.status)}`}>
                              {order.status}
                            </span>
                          )}
                          {isUpdating && <Loader size={12} className="animate-spin text-slate-400" />}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-slate-500">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenDetails(order)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors inline-flex"
                          title="View order details"
                        >
                          <Eye size={13} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Order Details Modal ── */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 max-w-xl w-full relative my-8 flex flex-col max-h-[90vh]">
            
            {/* Modal Close */}
            <button
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Modal Title */}
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Order details: <code>{selectedOrder._id}</code>
              </h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
                Placed on {formatDate(selectedOrder.createdAt)}
              </span>
            </div>
            <div className="h-px bg-slate-100 mb-5" />

            {/* Modal Content Scroll */}
            <div className="space-y-6 flex-1 overflow-y-auto pr-1">
              
              {/* Order Status Display & Controls */}
              <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Current status</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mt-1.5 ${getStatusBadgeStyles(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>

                {ALLOWED_TRANSITIONS[selectedOrder.status]?.length > 0 && (
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 text-right">Advance status</span>
                    <div className="flex gap-2">
                      {ALLOWED_TRANSITIONS[selectedOrder.status].map((nextStatus) => (
                        <button
                          key={nextStatus}
                          onClick={() => handleStatusChange(selectedOrder._id, nextStatus)}
                          disabled={updatingId === selectedOrder._id}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all border ${
                            nextStatus === 'Cancelled'
                              ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-600 hover:text-white hover:border-rose-600'
                              : 'bg-violet-600 text-white border-violet-600 hover:bg-violet-500'
                          }`}
                        >
                          {nextStatus}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Customer summary */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Customer info</span>
                <div className="text-xs text-slate-800 bg-white border border-slate-200 p-3 rounded-xl">
                  <p className="font-bold">{selectedOrder.user?.name}</p>
                  <p className="text-slate-500">{selectedOrder.user?.email}</p>
                </div>
              </div>

              {/* Items Summary */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                  <Package size={12} /> Items list ({selectedOrder.items?.reduce((sum, item) => sum + item.quantity, 0) || 0})
                </span>
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                      <div className="w-10 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200/50 flex-shrink-0">
                        {item.productImage ? (
                          <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">🛍️</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-slate-800 text-xs truncate block">{item.productName}</span>
                        <div className="flex gap-3 text-[10px] text-slate-400 font-semibold mt-0.5">
                          <span>Size: {item.size}</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        ₹{(item.priceSnapshot * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address & Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Address */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                    <MapPin size={12} /> Delivery address
                  </span>
                  <div className="text-xs text-slate-700 leading-relaxed bg-white border border-slate-200 p-3.5 rounded-xl h-full">
                    <span className="font-bold block text-slate-900 mb-0.5">{selectedOrder.addressSnapshot?.label} Address</span>
                    <p>{selectedOrder.addressSnapshot?.street}</p>
                    <p>{selectedOrder.addressSnapshot?.city}, {selectedOrder.addressSnapshot?.state} - {selectedOrder.addressSnapshot?.zipCode}</p>
                    <p className="mt-1 text-slate-400">📞 {selectedOrder.addressSnapshot?.phone}</p>
                  </div>
                </div>

                {/* Payment & Bills */}
                <div className="space-y-1.5 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                    <CreditCard size={12} /> Billing info
                  </span>
                  <div className="text-xs text-slate-700 bg-white border border-slate-200 p-3.5 rounded-xl flex-1 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <span className="font-semibold block text-slate-900">{selectedOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</span>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase mt-0.5">Payment status</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                        selectedOrder.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>

                    <div className="space-y-1 font-medium">
                      <div className="flex justify-between text-slate-500 text-[10px]">
                        <span>Subtotal:</span>
                        <span>₹{selectedOrder.subtotal?.toLocaleString()}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-emerald-600 text-[10px]">
                          <span>Discount:</span>
                          <span>-₹{selectedOrder.discount?.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-500 text-[10px]">
                        <span>Shipping:</span>
                        <span>{selectedOrder.shipping === 0 ? 'FREE' : `₹${selectedOrder.shipping}`}</span>
                      </div>
                      <div className="flex justify-between font-extrabold text-slate-900 border-t border-slate-100 pt-2">
                        <span>Grand Total:</span>
                        <span>₹{selectedOrder.total?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

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
