import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingBag, Trash2, ArrowRight, Sparkles, Loader, Minus, Plus
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import Button from '../components/Button'
import ProductCard from '../components/ProductCard'
import { products as allProducts } from '../data'

export default function CartPage() {
  const { cart, cartLoading, updateCartQuantity, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()

  // ── Pricing Calculations ──────────────────────────────────────────────────
  const subtotal = useMemo(() =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart])

  const deliveryFee = useMemo(() => {
    if (subtotal === 0 || subtotal >= 999) return 0
    return 99
  }, [subtotal])

  const discount = useMemo(() => {
    // Keep it simple, apply flat styling discounts if any
    return 0
  }, [subtotal])

  const total = subtotal - discount + deliveryFee

  const totalItems = useMemo(() =>
    cart.reduce((sum, item) => sum + item.quantity, 0), [cart])

  // Recommendations for empty cart
  const recommendedProducts = useMemo(() =>
    allProducts.filter(p => p.trending).slice(0, 4), [])

  // ── [1] LOADING STATE SKELETON ──
  if (cartLoading) {
    return (
      <div className="pt-24 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-24">
        <div className="h-10 bg-gray-200 rounded w-1/4 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-32 bg-gray-200 rounded-3xl animate-pulse w-full" />
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-3xl animate-pulse" />
        </div>
      </div>
    )
  }

  // ── [2] EMPTY STATE ──
  if (cart.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-cream-50 pb-24">
        <div className="bg-white border-b border-gray-100 py-8 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-500 mt-1 text-sm">Your cart is empty.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="bg-white rounded-[2.5rem] border border-cream-200 p-12 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-20 h-20 rounded-3xl bg-lavender-50 border border-lavender-100 flex items-center justify-center mx-auto mb-6 shadow-sm text-lavender-600 animate-float">
              <ShoppingBag size={36} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Style Cart is Empty</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed mb-8">
              Explore our curation or use the AI Stylist to find customized coordinates ready for checkout!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/products" id="empty-cart-browse-cta">
                <Button variant="primary" size="lg">Browse Shop Catalog</Button>
              </Link>
              <Link to="/ai-stylist" id="empty-cart-stylist-cta">
                <Button variant="secondary" size="lg" className="flex items-center gap-2">
                  <Sparkles size={16} /> Curate with AI
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-violet-500 mb-2">Recommended For You</span>
              <h3 className="text-xl font-bold text-gray-900">Trending Styles You Might Like</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommendedProducts.map(product => <ProductCard key={product._id || product.id} product={product} />)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── [3] ACTIVE CART LISTINGS ──
  return (
    <div className="pt-16 min-h-screen bg-cream-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-500 mt-1 text-sm">
              {totalItems} item{totalItems !== 1 ? 's' : ''} ready to check out
            </p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-lavender-600 hover:text-lavender-800 transition-colors flex items-center gap-1">
            Continue Shopping <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Items List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag size={16} className="text-lavender-500" />
                  Order Items <span className="text-xs font-normal text-slate-400">({cart.length})</span>
                </h2>
                <button 
                  onClick={() => clearCart()} 
                  className="text-xs text-rose-500 hover:underline font-bold"
                >
                  Clear Cart
                </button>
              </div>

              <div className="divide-y divide-cream-100">
                {cart.map((item) => {
                  const discountPct = item.originalPrice > item.price
                    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                    : 0
                  return (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="p-5 flex gap-4 relative hover:bg-cream-50/50 transition-all group"
                    >
                      {/* Image */}
                      <div className="w-20 sm:w-24 aspect-[3/4] rounded-2xl overflow-hidden bg-cream-100 flex-shrink-0 border border-cream-200/50">
                        <img
                          src={item.image || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80' }}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-grow flex flex-col justify-between min-w-0 pr-6">
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight truncate">{item.name}</h3>
                          <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">{item.category}</p>

                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-xs text-slate-700 font-semibold">Size: <strong className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">{item.size}</strong></span>
                            {discountPct > 0 && (
                              <span className="text-[9px] text-emerald-600 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded">
                                {discountPct}% OFF
                              </span>
                            )}
                          </div>

                          <div className="mt-1 flex items-baseline gap-2 text-xs">
                            <span className="font-extrabold text-slate-800">₹{(item.price || 0).toLocaleString()}</span>
                            {(item.originalPrice || 0) > (item.price || 0) && (
                              <span className="text-[10px] text-slate-400 line-through">₹{(item.originalPrice || 0).toLocaleString()}</span>
                            )}
                          </div>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.size, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 text-slate-600 font-bold"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.size, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 text-slate-600 font-bold"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right font-extrabold text-slate-900 text-xs sm:text-sm">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Remove item */}
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="absolute top-4 right-4 p-1 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right: Bill Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Order Summary</h3>
              
              <div className="space-y-2.5 text-xs font-medium border-b border-slate-100 pb-4">
                <div className="flex justify-between text-slate-500">
                  <span>Bag Subtotal:</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount:</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Delivery charges:</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-600 font-bold' : ''}>
                    {deliveryFee === 0 ? 'FREE ✓' : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-[10px] text-emerald-600 font-semibold">
                    Add ₹{(999 - subtotal).toLocaleString()} more for free delivery
                  </p>
                )}
              </div>

              <div className="flex justify-between items-baseline font-black text-slate-900 py-1 text-sm sm:text-base">
                <span>Grand Total:</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow shadow-slate-200 flex items-center justify-center gap-1.5"
              >
                Proceed to Checkout
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
