import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Sparkles } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { historyService } from '../services/history'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80'

export default function ProductCard({ product, onQuickView }) {
  const { toggleWishlist, isInWishlist, addToCart } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)
  const [imgError, setImgError] = useState(false)
  
  const productId = product._id || product.id
  const wishlisted = isInWishlist(productId)

  const handleView = () => {
    if (historyService?.saveView) {
      historyService.saveView(product)
    }
  }

  const handleCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 'M', 1)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const price = product.price || 0
  const originalPrice = product.originalPrice || price
  const discount = originalPrice > price && price > 0
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  const imgSrc = imgError
    ? FALLBACK_IMAGE
    : (product.image || product.images?.[0] || FALLBACK_IMAGE)

  const occasionLabel = product.occasion || product.occasionTags?.[0]

  // Premium badges hierarchy (max 2 badges)
  const badges = useMemo(() => {
    const list = []
    const ratingVal = product.rating || product.ratings || 0
    const reviewsVal = product.reviews || product.reviewsCount || 0

    if (discount > 0) {
      list.push({ text: `Sale -${discount}%`, bg: 'bg-emerald-500 text-white font-extrabold shadow-sm' })
    }
    if (product.inventory > 0 && product.inventory <= 5) {
      list.push({ text: `Only ${product.inventory} left`, bg: 'bg-rose-600 text-white font-extrabold animate-pulse shadow-sm' })
    }
    if (ratingVal >= 4.6 && reviewsVal >= 15) {
      list.push({ text: 'Best Seller', bg: 'bg-amber-500 text-slate-900 font-extrabold shadow-sm' })
    }
    if (product.trending === true) {
      list.push({ text: 'Trending', bg: 'bg-violet-600 text-white font-semibold shadow-sm' })
    }
    if (product.featured === true) {
      list.push({ text: 'New Arrival', bg: 'bg-sky-500 text-white font-semibold shadow-sm' })
    }
    if (price >= 4000) {
      list.push({ text: 'Luxury Pick', bg: 'bg-indigo-950 text-amber-300 font-extrabold border border-amber-400/20 shadow-sm' })
    }
    return list.slice(0, 2)
  }, [product, discount, price])

  // Star ratings string helper
  const starString = useMemo(() => {
    const ratingVal = product.rating || product.ratings || 0
    const rounded = Math.round(ratingVal)
    return '★'.repeat(rounded) + '☆'.repeat(5 - rounded)
  }, [product.rating, product.ratings])

  const ratingText = useMemo(() => {
    const ratingVal = product.rating || product.ratings || 0
    const reviewsVal = product.reviews || product.reviewsCount || 0
    return `${ratingVal.toFixed(1)} (${reviewsVal})`
  }, [product.rating, product.ratings, product.reviews, product.reviewsCount])

  return (
    <Link
      to={`/products/${product.slug || productId}`}
      id={`product-card-${productId}`}
      onClick={handleView}
      className="group relative bg-white rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl border border-cream-100 flex flex-col h-full transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image Container with lazy load aspect ratio */}
      <div className="relative overflow-hidden bg-cream-50/50 aspect-[3/4]">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={() => setImgError(true)}
        />

        {/* Badges Overlay */}
        {badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {badges.map((badge, idx) => (
              <span
                key={idx}
                className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold ${badge.bg}`}
              >
                {badge.text}
              </span>
            ))}
          </div>
        )}

        {/* Wishlist Button Toggle */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleWishlist(product)
          }}
          id={`wishlist-${productId}`}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all z-10"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={14}
            className={`transition-colors duration-200 ${wishlisted ? 'text-rose-500 fill-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
          />
        </button>

        {/* Quick Add Overlay (slides up on hover) */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col gap-1.5 p-2.5 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent z-10">
          <button
            onClick={handleCart}
            id={`add-cart-${productId}`}
            className={`w-full py-2 flex items-center justify-center gap-1.5 text-xs font-bold rounded-xl transition-colors ${
              addedToCart
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-900 text-white hover:bg-violet-600'
            }`}
          >
            <ShoppingBag size={13} />
            {addedToCart ? 'Added to cart 🛍️' : 'Add to Cart'}
          </button>
          
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onQuickView(product)
              }}
              id={`quick-view-${productId}`}
              className="w-full py-2 bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white hover:text-slate-950 flex items-center justify-center gap-1.5 text-xs font-bold rounded-xl transition-all"
            >
              Quick View
            </button>
          )}
        </div>
      </div>

      {/* Info Details Panel */}
      <div className="p-4 flex-grow flex flex-col justify-between gap-2.5 bg-white border-t border-cream-50/50">
        <div className="space-y-1">
          {/* Category & Occasion badge */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">
              {product.category}
            </span>
            {occasionLabel && (
              <span className="px-1.5 py-0.5 rounded bg-violet-50 border border-violet-100 text-[8px] font-black text-violet-600 uppercase tracking-wider flex-shrink-0">
                {occasionLabel}
              </span>
            )}
          </div>

          <h3 className="font-bold text-slate-800 text-xs sm:text-sm leading-snug group-hover:text-violet-600 transition-colors line-clamp-2 h-10 overflow-hidden">
            {product.name}
          </h3>
        </div>

        <div className="pt-2 border-t border-slate-50/60 space-y-1">
          {/* Star ratings details */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-amber-500 font-bold tracking-tight leading-none">{starString}</span>
            <span className="text-[9px] text-slate-400 font-bold leading-none">
              {ratingText}
            </span>
          </div>

          {/* Pricing Details */}
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-slate-900 text-sm">₹{price.toLocaleString()}</span>
            {originalPrice > price && (
              <span className="text-xs text-slate-400 line-through">₹{originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
