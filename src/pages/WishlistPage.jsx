import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ArrowRight, Sparkles, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import Button from '../components/Button'
import ProductCard from '../components/ProductCard'
import { products as allProducts } from '../data'

export default function WishlistPage() {
  const { wishlist, toggleWishlist, moveToCart, wishlistLoading } = useCart()

  // Recommendations for empty states
  const recommendedProducts = useMemo(() => {
    return allProducts.filter(p => !p.trending).slice(0, 4)
  }, [])

  return (
    <div className="pt-16 min-h-screen bg-cream-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-500 mt-1 text-sm">
              {wishlistLoading ? 'Checking vault…' : wishlist.length === 0 ? 'Your wishlist is empty' : `${wishlist.length} item${wishlist.length > 1 ? 's' : ''} saved to style vault`}
            </p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-lavender-600 hover:text-lavender-800 transition-colors flex items-center gap-1">
            Back to Shop <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {wishlistLoading ? (
          /* Skeletons Loader Grid */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-sm flex flex-col p-4 space-y-3.5 animate-pulse">
                <div className="bg-cream-100 aspect-[3/4] w-full rounded-2xl" />
                <div className="h-3 bg-cream-100 w-1/3 rounded-lg" />
                <div className="h-5 bg-cream-100 w-full rounded-lg" />
                <div className="h-4 bg-cream-100 w-1/4 rounded-lg" />
                <div className="pt-3 border-t border-cream-100 space-y-1">
                  <div className="h-2 bg-cream-100 w-1/2 rounded-md" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-cream-100 w-8 rounded-lg" />
                    <div className="h-6 bg-cream-100 w-8 rounded-lg" />
                    <div className="h-6 bg-cream-100 w-8 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          /* High-Quality Empty State */
          <div className="space-y-16">
            <div className="bg-white rounded-[2.5rem] border border-cream-200 p-12 text-center max-w-2xl mx-auto shadow-sm">
              <div className="w-20 h-20 rounded-3xl bg-lavender-50 border border-lavender-100 flex items-center justify-center mx-auto mb-6 shadow-sm text-lavender-600 animate-float">
                <Heart size={36} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Style Wishlist is Empty</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed mb-8">
                Save your favorite finds to build the perfect outfit catalog. Browse our latest drops or let the AI Stylist curate outfit inspirations for you!
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/products" id="empty-wishlist-shop-cta">
                  <Button variant="primary" size="lg">
                    Browse Shop
                  </Button>
                </Link>
                <Link to="/ai-stylist" id="empty-wishlist-stylist-cta">
                  <Button variant="secondary" size="lg" className="flex items-center gap-2">
                    <Sparkles size={16} /> Open AI Stylist
                  </Button>
                </Link>
              </div>
            </div>

            {/* Recommendations Section */}
            <div>
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-violet-500 mb-2">
                  Recommendations
                </span>
                <h3 className="text-xl font-bold text-gray-900">Explore Fresh Additions</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {recommendedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => {
              const originalPrice = item.originalPrice || item.price || 0
              const price = item.price || 0
              const discount = originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0
              const imageSrc = item.image || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80'
              const occasionText = item.occasion || (item.occasionTags && item.occasionTags[0]) || 'General'

              return (
                <div
                  key={item.id}
                  id={`wishlist-item-${item.id}`}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-cream-200"
                >
                  {/* Image wrapper */}
                  <div className="relative overflow-hidden aspect-[3/4] bg-cream-100">
                    <img
                      src={imageSrc}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80' }}
                    />
                    
                    {/* Occasion / Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-lavender-500 text-white text-[9px] font-bold shadow">
                        {occasionText}
                      </span>
                      {discount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold shadow">
                          -{discount}%
                        </span>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => toggleWishlist(item)}
                      id={`remove-wish-${item.id}`}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-rose-50 hover:text-rose-500 transition-colors"
                      aria-label="Remove from Wishlist"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  {/* Info block */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-lavender-500 uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 mt-0.5 mb-1.5">
                        {item.name}
                      </h3>
                      
                      {/* Price info */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="font-bold text-sm text-gray-900">₹{price.toLocaleString()}</span>
                        {originalPrice > price && (
                          <span className="text-xs text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                    </div>

                    {/* Sizing options to directly Move to Cart */}
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-[10px] text-gray-400 font-semibold mb-2">SELECT SIZE TO BUY:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.sizes ? (
                          item.sizes.map((sz) => (
                            <button
                              key={sz}
                              onClick={() => moveToCart(item, sz)}
                              className="px-2 py-1 rounded-lg border border-gray-200 text-[10px] font-bold text-gray-600 hover:bg-lavender-500 hover:text-white hover:border-lavender-500 transition-colors"
                            >
                              {sz}
                            </button>
                          ))
                        ) : (
                          ['S', 'M', 'L'].map((sz) => (
                            <button
                              key={sz}
                              onClick={() => moveToCart(item, sz)}
                              className="px-2 py-1 rounded-lg border border-gray-200 text-[10px] font-bold text-gray-600 hover:bg-lavender-500 hover:text-white hover:border-lavender-500 transition-colors"
                            >
                              {sz}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
