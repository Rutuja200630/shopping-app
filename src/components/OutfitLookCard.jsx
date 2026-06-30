import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, RefreshCw, Edit2, Heart, Trash2, X } from 'lucide-react';
import { historyService } from '../services/history';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function OutfitLookCard({
  look,
  isLoading,
  onReplaceItem,
  onRegenerateLook,
  isSavedView = false,
  onDelete
}) {
  if (!look) return null;

  const { title, stylistNote, totalPrice, items } = look;
  const { isLoggedIn, isDemo } = useAuth() || {};

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Define slot configuration mapping
  const slotConfig = [
    { key: 'main', label: 'Main Outfit' },
    { key: 'footwear', label: 'Footwear' },
    { key: 'accessory', label: 'Accessory' },
    { key: 'layer', label: 'Layer' }
  ];

  const handleProductView = (product) => {
    if (product && historyService?.saveView) {
      historyService.saveView(product);
    }
  };

  // Auto-expire toasts
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleSaveLook = async () => {
    if (!isLoggedIn) {
      setToast({ show: true, message: 'Please log in to save looks.', type: 'error' });
      return;
    }
    if (isDemo) {
      setToast({ show: true, message: 'Saved looks are not available in demo mode.', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: look.title || 'Styled Look',
        stylistNote: look.stylistNote || '',
        totalPrice: look.totalPrice || 0,
        items: {
          main: {
            productId: look.items?.main?._id || look.items?.main?.id || look.items?.main?.productId,
            name: look.items?.main?.name,
            slug: look.items?.main?.slug,
            image: look.items?.main?.image || (Array.isArray(look.items?.main?.images) ? look.items?.main?.images[0] : look.items?.main?.images),
            price: look.items?.main?.price,
            brand: look.items?.main?.brand
          },
          footwear: look.items?.footwear ? {
            productId: look.items?.footwear?._id || look.items?.footwear?.id || look.items?.footwear?.productId,
            name: look.items?.footwear?.name,
            slug: look.items?.footwear?.slug,
            image: look.items?.footwear?.image || (Array.isArray(look.items?.footwear?.images) ? look.items?.footwear?.images[0] : look.items?.footwear?.images),
            price: look.items?.footwear?.price,
            brand: look.items?.footwear?.brand
          } : undefined,
          accessory: look.items?.accessory ? {
            productId: look.items?.accessory?._id || look.items?.accessory?.id || look.items?.accessory?.productId,
            name: look.items?.accessory?.name,
            slug: look.items?.accessory?.slug,
            image: look.items?.accessory?.image || (Array.isArray(look.items?.accessory?.images) ? look.items?.accessory?.images[0] : look.items?.accessory?.images),
            price: look.items?.accessory?.price,
            brand: look.items?.accessory?.brand
          } : undefined,
          layer: look.items?.layer ? {
            productId: look.items?.layer?._id || look.items?.layer?.id || look.items?.layer?.productId,
            name: look.items?.layer?.name,
            slug: look.items?.layer?.slug,
            image: look.items?.layer?.image || (Array.isArray(look.items?.layer?.images) ? look.items?.layer?.images[0] : look.items?.layer?.images),
            price: look.items?.layer?.price,
            brand: look.items?.layer?.brand
          } : undefined
        }
      };

      await api.post('/looks', payload);
      setToast({ show: true, message: 'Look saved successfully.', type: 'success' });
    } catch (err) {
      if (err.response?.status === 409) {
        setToast({ show: true, message: "You've already saved this look.", type: 'error' });
      } else {
        setToast({
          show: true,
          message: err.response?.data?.error || err.response?.data?.message || 'Failed to save look.',
          type: 'error'
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLook = async () => {
    setDeleting(true);
    try {
      await api.delete(`/looks/${look._id || look.id}`);
      if (onDelete) {
        onDelete(look._id || look.id);
      }
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.error || 'Failed to delete look.', type: 'error' });
      setDeleting(false);
    }
  };

  const [wishlisting, setWishlisting] = useState(false);

  const handleWishlistEntireLook = async () => {
    if (!isLoggedIn) {
      setToast({ show: true, message: 'Please log in to wishlist items.', type: 'error' });
      return;
    }
    if (isDemo) {
      setToast({ show: true, message: 'Wishlisting is not available in demo mode.', type: 'error' });
      return;
    }

    const productIds = [
      items?.main?._id || items?.main?.id || items?.main?.productId,
      items?.footwear?._id || items?.footwear?.id || items?.footwear?.productId,
      items?.accessory?._id || items?.accessory?.id || items?.accessory?.productId,
      items?.layer?._id || items?.layer?.id || items?.layer?.productId
    ].filter(Boolean);

    if (productIds.length === 0) {
      setToast({ show: true, message: 'This look has no valid items.', type: 'error' });
      return;
    }

    setWishlisting(true);
    try {
      const res = await api.post('/wishlist/look', { productIds });
      const { added } = res.data;

      if (added > 0) {
        setToast({ show: true, message: `Added ${added} item${added === 1 ? '' : 's'} to wishlist.`, type: 'success' });
      } else {
        setToast({ show: true, message: 'Everything in this look is already in your wishlist.', type: 'success' });
      }
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.error || err.response?.data?.message || 'Failed to wishlist look.',
        type: 'error'
      });
    } finally {
      setWishlisting(false);
    }
  };

  const [carting, setCarting] = useState(false);

  const handleAddToCartEntireLook = async () => {
    if (!isLoggedIn) {
      setToast({ show: true, message: 'Please log in to add items to cart.', type: 'error' });
      return;
    }
    if (isDemo) {
      setToast({ show: true, message: 'Cart operations are not available in demo mode.', type: 'error' });
      return;
    }

    const productIds = [
      items?.main?._id || items?.main?.id || items?.main?.productId,
      items?.footwear?._id || items?.footwear?.id || items?.footwear?.productId,
      items?.accessory?._id || items?.accessory?.id || items?.accessory?.productId,
      items?.layer?._id || items?.layer?.id || items?.layer?.productId
    ].filter(Boolean);

    if (productIds.length === 0) {
      setToast({ show: true, message: 'This look has no valid items.', type: 'error' });
      return;
    }

    setCarting(true);
    try {
      const res = await api.post('/cart/look', { productIds });
      const { added } = res.data;

      if (added > 0) {
        setToast({ show: true, message: `Added ${added} product${added === 1 ? '' : 's'} to your cart.`, type: 'success' });
      } else {
        setToast({ show: true, message: 'Everything from this look is already in your cart.', type: 'success' });
      }
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.error || err.response?.data?.message || 'Failed to add look to cart.',
        type: 'error'
      });
    } finally {
      setCarting(false);
    }
  };

  // Default product placeholder image
  const defaultPlaceholder = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518';

  return (
    <div
      id={`outfit-look-card-${look.id || look._id}`}
      className="relative bg-white rounded-[2rem] border border-purple-100/60 p-6 shadow-md hover:shadow-xl transition-all duration-300 space-y-5 animate-slide-up overflow-hidden group"
    >
      {/* ── Toast Banner Overlay ── */}
      {toast.show && (
        <div
          className={`absolute top-4 left-4 right-4 z-30 flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border text-[11px] font-bold shadow-md transition-all duration-300 animate-slide-down ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
              : 'bg-rose-50 border-rose-100 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{toast.type === 'success' ? '✨' : '⚠️'}</span>
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => setToast({ show: false, message: '', type: '' })}
            className="hover:opacity-75"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* ── Loading Overlay ── */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 space-y-3 animate-fade-in">
          <Sparkles size={28} className="text-violet-600 animate-spin" />
          <span className="text-[11px] font-black uppercase tracking-widest text-violet-600 animate-pulse">
            Styling Outfit...
          </span>
        </div>
      )}

      {/* ── Card Header ── */}
      <div className="flex items-center justify-between gap-4 border-b border-purple-100/40 pb-4">
        <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
          <Sparkles size={16} className="text-violet-500 fill-violet-500 flex-shrink-0" />
          {title || 'Styled Outfit Look'}
        </h3>
        {typeof totalPrice === 'number' && totalPrice > 0 && (
          <div className="flex flex-col items-end bg-emerald-50/80 border border-emerald-100 rounded-2xl px-3.5 py-1.5 flex-shrink-0 text-right">
            <span className="text-[8px] font-black text-emerald-800 tracking-wider uppercase">Total Look</span>
            <span className="text-xs sm:text-sm font-black text-emerald-700">₹{totalPrice.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* ── Stylist Note ── */}
      {stylistNote && (
        <div className="bg-violet-50/20 border border-purple-50/50 rounded-2xl p-4 text-xs sm:text-sm text-slate-500 italic leading-relaxed relative pl-8 pr-6">
          <span className="absolute left-3 top-3 text-2xl text-violet-300 font-serif leading-none">“</span>
          {stylistNote}
          <span className="absolute right-2 bottom-1 text-2xl text-violet-300 font-serif leading-none">”</span>
        </div>
      )}

      {/* ── Vertical 2x2 Slot Grid inside Outfit Card (Equal Heights & Perfectly Aligned) ── */}
      <div className="grid grid-cols-2 gap-4 pt-1">
        {slotConfig.map(({ key, label }) => {
          const item = items?.[key];

          // If slot is empty, show a subtle placeholder card
          if (!item) {
            const placeholderText = key === 'layer'
              ? 'No Layer Needed'
              : 'Optional';

            return (
              <div
                key={key}
                className="flex flex-col h-full bg-slate-50/20 border border-dashed border-slate-200 rounded-[1.5rem] p-3.5 items-center justify-between text-center space-y-4 min-h-[280px]"
              >
                <div className="w-full aspect-[3/4] rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center flex-shrink-0 text-slate-300">
                  <span className="text-lg">✨</span>
                </div>
                <div className="flex-grow w-full flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">
                      {label}
                    </span>
                    <h4 className="font-extrabold text-[11px] text-slate-400 block truncate">
                      {placeholderText}
                    </h4>
                  </div>
                  <div className="mt-4">
                    <span className="w-full py-2 bg-slate-100 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-wider block text-center">
                      Optional
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          // Safe image retrieval
          const productImage = (item.images && Array.isArray(item.images) && item.images[0] && item.images[0].trim() !== '')
            ? item.images[0]
            : (item.image && typeof item.image === 'string' && item.image.trim() !== '')
            ? item.image
            : defaultPlaceholder;

          return (
            <div
              key={item._id || item.id || item.productId || key}
              className="flex flex-col h-full bg-slate-50/40 hover:bg-slate-50/80 border border-slate-100 rounded-[1.5rem] p-3.5 transition-all duration-200 justify-between group/item hover:-translate-y-0.5 shadow-sm hover:shadow-md min-h-[280px]"
            >
              {/* Product Image (Strict Aspect Ratio 3:4) */}
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-white border border-slate-200/40 flex-shrink-0 relative">
                <img
                  src={productImage}
                  alt={item.name || label}
                  className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = defaultPlaceholder;
                  }}
                />
              </div>

              {/* Product Details & Aligned Pinned Button */}
              <div className="flex-grow flex flex-col justify-between mt-3 w-full">
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-violet-600 uppercase tracking-widest block">
                    {label}
                  </span>
                  <h4 className="font-extrabold text-[11px] sm:text-xs text-slate-800 leading-snug line-clamp-2 block capitalize min-h-[32px]">
                    {item.name}
                  </h4>
                  <span className="text-[9px] text-slate-400 font-bold block">
                    {item.brand || 'StyleAI'}
                  </span>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Price</span>
                    <span className="font-black text-slate-900 text-xs sm:text-sm">
                      ₹{item.price ? item.price.toLocaleString() : '0'}
                    </span>
                  </div>
                  <Link
                    to={`/products/${item.slug || item._id || item.id || item.productId}`}
                    onClick={() => handleProductView(item)}
                    aria-label={`View details of ${item.name}`}
                    className="w-full py-2 bg-slate-900 hover:bg-violet-600 text-white rounded-xl text-[9px] font-black tracking-wider uppercase transition-all flex items-center justify-center gap-1 shadow-sm"
                  >
                    View Product
                    <ArrowRight size={10} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Add Cart & Wishlist Entire Look Buttons ── */}
      {!isSavedView && (
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-purple-100/40">
          <button
            onClick={handleAddToCartEntireLook}
            disabled={isLoading || saving || wishlisting || carting}
            aria-label="Add all products in this look to cart"
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <ArrowRight size={13} className="text-white" />
            {carting ? 'Adding...' : 'Add Look to Cart'}
          </button>

          <button
            onClick={handleWishlistEntireLook}
            disabled={isLoading || saving || wishlisting || carting}
            aria-label="Wishlist all products in this look"
            className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-xl text-[10px] font-black tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Heart size={13} className="fill-purple-600 stroke-purple-600" />
            {wishlisting ? 'Saving...' : 'Wishlist Look'}
          </button>
        </div>
      )}

      {/* ── Actions Bar ── */}
      <div className="flex items-center justify-between border-t border-purple-100/40 pt-4 mt-2 text-xs">
        {isSavedView ? (
          <button
            onClick={handleDeleteLook}
            disabled={deleting}
            aria-label="Delete this saved outfit look"
            className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-xl text-[10px] font-black tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Trash2 size={13} />
            {deleting ? 'Deleting...' : 'Delete Saved Look'}
          </button>
        ) : (
          <>
            <button
              onClick={() => onReplaceItem && onReplaceItem(look)}
              disabled={isLoading || saving}
              aria-label="Modify item in outfit look"
              className="flex items-center gap-1.5 text-slate-500 hover:text-violet-600 transition-colors font-bold disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              <Edit2 size={13} className="group-hover:stroke-violet-600 transition-colors" />
              Replace Item
            </button>

            <button
              onClick={handleSaveLook}
              disabled={isLoading || saving}
              aria-label="Save this look to profile"
              className="flex items-center gap-1.5 text-slate-500 hover:text-violet-600 transition-colors font-bold disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              <Heart size={13} className={`group-hover:fill-rose-500 group-hover:stroke-rose-500 transition-all ${saving ? 'animate-pulse' : ''}`} />
              {saving ? 'Saving...' : 'Save Look'}
            </button>

            <button
              onClick={() => onRegenerateLook && onRegenerateLook(look.id)}
              disabled={isLoading || saving}
              aria-label="Regenerate this entire outfit look"
              className="flex items-center gap-1.5 text-slate-500 hover:text-violet-600 transition-colors font-bold disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              <RefreshCw size={13} className="group-hover:stroke-violet-600 group-hover:rotate-45 transition-transform duration-200" />
              Regenerate
            </button>
          </>
        )}
      </div>
    </div>
  );
}
