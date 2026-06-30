import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MapPin, CreditCard, Banknote, Smartphone, ShieldCheck, Truck,
  Plus, ArrowRight, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2, Home, Briefcase, Building2, Package
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Button from '../components/Button'

const LABEL_ICONS = { Home, Office: Briefcase, Hostel: Building2, Other: MapPin }

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const { isLoggedIn, isDemo } = useAuth() || {}
  const navigate = useNavigate()

  // Address states
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [addressLoading, setAddressLoading] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressError, setAddressError] = useState('')
  const [addressForm, setAddressForm] = useState({
    label: 'Home', street: '', city: '', state: '', zipCode: '', phone: '', isDefault: false
  })
  const [savingAddress, setSavingAddress] = useState(false)

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('COD') // 'COD' | 'UPI'

  // Order placement states
  const [placingOrder, setPlacingOrder] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)
  const [checkoutError, setCheckoutError] = useState('')

  // ── Pricing ────────────────────────────────────────────────────────────────
  const subtotal = useMemo(() =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart])

  const deliveryFee = useMemo(() => {
    if (subtotal === 0 || subtotal >= 999) return 0
    return 99
  }, [subtotal])

  const discount = 0 // flat styled discount

  const total = subtotal - discount + deliveryFee

  // ── Load addresses ──
  const fetchAddresses = async () => {
    if (!isLoggedIn || isDemo) return
    setAddressLoading(true)
    setAddressError('')
    try {
      const res = await api.get('/auth/addresses')
      const list = res.data?.addresses || []
      setAddresses(list)
      const def = list.find(a => a.isDefault) || list[0]
      if (def) setSelectedAddressId(def._id)
    } catch {
      setAddressError('Could not load your saved addresses.')
    } finally {
      setAddressLoading(false)
    }
  }

  useEffect(() => {
    if (cart.length === 0 && !placedOrder) {
      navigate('/cart')
    }
    fetchAddresses()
  }, [isLoggedIn, isDemo])

  // Save new address
  const handleSaveAddress = async (e) => {
    e.preventDefault()
    setSavingAddress(true)
    setAddressError('')
    try {
      const res = await api.post('/auth/addresses', addressForm)
      const newAddr = res.data?.address
      setAddresses(prev => [...prev, newAddr])
      setSelectedAddressId(newAddr._id)
      setShowAddressForm(false)
      setAddressForm({ label: 'Home', street: '', city: '', state: '', zipCode: '', phone: '', isDefault: false })
    } catch (err) {
      setAddressError(err.response?.data?.error || 'Failed to save address.')
    } finally {
      setSavingAddress(false)
    }
  }

  // Handle Place Order
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setCheckoutError('Please select or add a delivery address before placing your order.')
      return
    }

    setPlacingOrder(true)
    setCheckoutError('')

    try {
      const res = await api.post('/orders', {
        addressId: selectedAddressId,
        paymentMethod
      })
      setPlacedOrder(res.data)
      clearCart()
    } catch (err) {
      setCheckoutError(err.response?.data?.error || 'Checkout failed. Please try again.')
    } finally {
      setPlacingOrder(false)
    }
  }

  // ── [1] ACCESS RESTRICTIONS ──
  if (!isLoggedIn) {
    return (
      <div className="pt-24 min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-cream-200 p-8 text-center max-w-md w-full shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-lavender-50 border border-lavender-100 flex items-center justify-center text-3xl mx-auto mb-5">
            🔐
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Please log in or register to complete checkout and manage orders.
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
            Checkout requires a connection to the live backend. Please log out and sign in using a real account (or Google Dev Bypass) to place real orders.
          </p>
          <Link to="/login">
            <Button variant="primary" className="w-full">Go to Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  // ── [2] ORDER PLACED (CONFIRMATION STATE) ──
  if (placedOrder) {
    return (
      <div className="pt-24 min-h-[80vh] bg-cream-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-[2.5rem] border border-cream-200 p-10 text-center max-w-lg w-full shadow-lg space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-100 text-emerald-500 flex items-center justify-center text-4xl mx-auto animate-bounce">
            🎉
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800">Order Placed Successfully!</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Order ID: <code className="bg-slate-50 border px-2 py-0.5 rounded text-slate-800">{placedOrder._id}</code>
            </p>
          </div>

          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Your package has been booked on <strong>{paymentMethod === 'COD' ? 'Cash on Delivery' : 'UPI Payment'}</strong> and is being prepared for dispatch.
          </p>

          <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 text-xs font-semibold text-slate-600 text-left space-y-1">
            <div className="flex justify-between">
              <span>Total Paid:</span>
              <span className="font-extrabold text-slate-900">₹{placedOrder.total?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-amber-600 uppercase font-bold">{placedOrder.status}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/orders')}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow"
            >
              View Orders Log
            </button>
            <button
              onClick={() => navigate('/home')}
              className="flex-1 py-3 bg-cream-100 hover:bg-cream-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-cream-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── [3] CHECKOUT WRAPPER ──
  return (
    <div className="pt-16 min-h-screen bg-cream-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/cart')}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
              <p className="text-gray-500 mt-1 text-sm font-semibold">Complete your style transaction securely</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm">
            <ShieldCheck size={14} /> SSL Secured
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Address select + Payment */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Delivery address card */}
            <div className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <MapPin size={16} className="text-lavender-500" />
                  Select Delivery Address
                </h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="flex items-center gap-1 text-xs font-bold text-lavender-600 hover:text-lavender-800 transition-colors"
                >
                  <Plus size={13} /> {showAddressForm ? 'Cancel' : 'Add New'}
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Form to add address */}
                {showAddressForm && (
                  <form onSubmit={handleSaveAddress} className="bg-cream-50/60 border border-cream-200 p-5 rounded-2xl space-y-3">
                    <h3 className="text-xs font-bold text-slate-700">Add Address details</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">LABEL</label>
                        <select
                          value={addressForm.label}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, label: e.target.value }))}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                        >
                          <option value="Home">Home</option>
                          <option value="Office">Office</option>
                          <option value="Hostel">Hostel</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">PHONE NUMBER</label>
                        <input
                          type="text"
                          required
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))}
                          placeholder="10-digit number"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">STREET ADDRESS</label>
                      <input
                        type="text"
                        required
                        value={addressForm.street}
                        onChange={(e) => setAddressForm(p => ({ ...p, street: e.target.value }))}
                        placeholder="House no, Building, Street name"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">CITY</label>
                        <input
                          type="text"
                          required
                          value={addressForm.city}
                          onChange={(e) => setAddressForm(p => ({ ...p, city: e.target.value }))}
                          placeholder="Mumbai"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">STATE</label>
                        <input
                          type="text"
                          required
                          value={addressForm.state}
                          onChange={(e) => setAddressForm(p => ({ ...p, state: e.target.value }))}
                          placeholder="MH"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">ZIPCODE</label>
                        <input
                          type="text"
                          required
                          value={addressForm.zipCode}
                          onChange={(e) => setAddressForm(p => ({ ...p, zipCode: e.target.value.replace(/\D/g, '') }))}
                          placeholder="400001"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={savingAddress}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow"
                    >
                      {savingAddress ? 'Saving Address…' : 'Save Address'}
                    </button>
                  </form>
                )}

                {addressLoading && (
                  <div className="flex items-center justify-center gap-2 text-slate-400 py-6 text-xs font-semibold">
                    <RefreshCw size={14} className="animate-spin" /> Loading saved addresses…
                  </div>
                )}

                {addressError && (
                  <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-600 font-semibold">
                    <AlertCircle size={14} className="mt-0.5" />
                    <p>{addressError}</p>
                  </div>
                )}

                {!addressLoading && addresses.length === 0 && !showAddressForm && (
                  <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                    No addresses found. Click "Add New" to save your shipping destination.
                  </div>
                )}

                {/* List of saved addresses */}
                <div className="space-y-3">
                  {addresses.map((addr) => {
                    const LabelIcon = LABEL_ICONS[addr.label] || MapPin
                    const isSelected = addr._id === selectedAddressId

                    return (
                      <button
                        key={addr._id}
                        type="button"
                        onClick={() => setSelectedAddressId(addr._id)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex gap-3 items-start ${
                          isSelected 
                            ? 'border-lavender-400 bg-lavender-50/50' 
                            : 'border-slate-100 hover:border-lavender-200 bg-slate-50/50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0 ${
                          isSelected ? 'bg-lavender-100 text-lavender-600' : 'bg-white text-slate-400 border border-slate-200'
                        }`}>
                          <LabelIcon size={14} />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">{addr.label} Address</span>
                            {addr.isDefault && <span className="text-[8px] bg-emerald-50 text-emerald-600 px-1 rounded-md font-bold uppercase border border-emerald-100">Default</span>}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 truncate">{addr.street}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{addr.city}, {addr.state} - {addr.zipCode}</p>
                          <span className="block text-[10px] text-slate-400 mt-1">📞 {addr.phone}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Payment methods selection */}
            <div className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <CreditCard size={16} className="text-lavender-500" />
                  Select Payment Method
                </h2>
              </div>
              <div className="p-6 space-y-3">
                {/* Cash on delivery */}
                <button
                  onClick={() => setPaymentMethod('COD')}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex gap-3 items-start ${
                    paymentMethod === 'COD' ? 'border-lavender-400 bg-lavender-50/50' : 'border-slate-100 bg-slate-50/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    paymentMethod === 'COD' ? 'bg-lavender-100 text-lavender-600' : 'bg-white text-slate-400 border border-slate-200'
                  }`}>
                    <Banknote size={15} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Cash on Delivery (COD)</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Pay in cash or card when package arrives.</span>
                  </div>
                </button>

                {/* UPI (placeholder) */}
                <button
                  onClick={() => setPaymentMethod('UPI')}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex gap-3 items-start ${
                    paymentMethod === 'UPI' ? 'border-lavender-400 bg-lavender-50/50' : 'border-slate-100 bg-slate-50/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    paymentMethod === 'UPI' ? 'bg-lavender-100 text-lavender-600' : 'bg-white text-slate-400 border border-slate-200'
                  }`}>
                    <Smartphone size={15} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800">Pay via UPI App</span>
                      <span className="text-[8px] bg-slate-100 text-slate-500 font-bold px-1 rounded border border-slate-200 uppercase">Placeholder Only</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">GPay, PhonePe, Paytm (Integration simulation bypass).</span>
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT: Summary panel */}
          <div className="space-y-6">
            
            {/* Products summary list */}
            <div className="bg-white rounded-3xl border border-cream-200 p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1">
                <Package size={12} /> Items list ({cart.length})
              </span>
              <div className="space-y-3.5 max-h-[180px] overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center text-xs">
                    <div className="w-10 h-14 rounded-lg bg-cream-50 overflow-hidden border border-cream-200/50 flex-shrink-0">
                      <img src={item.image || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80'} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80' }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-slate-800 block truncate leading-tight">{item.name}</span>
                      <span className="text-[9px] text-slate-400 font-bold block mt-0.5">Size {item.size} · Qty {item.quantity}</span>
                    </div>
                    <span className="font-extrabold text-slate-800">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Summary totals */}
            <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Order Billing Summary</h3>
              
              <div className="space-y-2.5 text-xs font-semibold text-slate-500 border-b border-slate-100 pb-4">
                <div className="flex justify-between">
                  <span>Bag Subtotal:</span>
                  <span className="text-slate-800">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery charges:</span>
                  <span className="text-slate-800">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline font-black text-slate-900 text-sm sm:text-base">
                <span>Grand Total:</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              {checkoutError && (
                <div className="flex items-start gap-1.5 bg-rose-50 border border-rose-200 p-3 rounded-xl text-[10px] text-rose-600 font-bold leading-normal">
                  <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                  <p>{checkoutError}</p>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {placingOrder ? (
                  <>
                    <RefreshCw className="animate-spin" size={14} />
                    Processing Order…
                  </>
                ) : (
                  <>
                    Place Order (COD)
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
