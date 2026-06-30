import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import api from '../services/api'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isLoggedIn, isDemo } = useAuth() || {}

  // ── Cart State ──────────────────────────────────────────────────────────────
  // For real users: synced with MongoDB via /api/cart
  // For demo / logged-out: stored in localStorage only
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('styleai_cart')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // ── Wishlist State ──────────────────────────────────────────────────────────
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('styleai_wishlist')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Loading States
  const [cartLoading, setCartLoading] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  // Global Toast state
  const [toast, setToast] = useState({ text: '', type: '' })
  const showToast = useCallback((text, type = 'success') => {
    setToast({ text, type })
    setTimeout(() => setToast({ text: '', type: '' }), 4000)
  }, [])

  // ── Sync cart to localStorage (offline / demo fallback) ────────────────────
  useEffect(() => {
    localStorage.setItem('styleai_cart', JSON.stringify(cart))
  }, [cart])

  // ── Sync wishlist to localStorage ──────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('styleai_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  // ── Normalise a backend cart item to frontend shape ────────────────────────
  // Backend: { _id, product: { _id, name, images, price, ... }, size, quantity }
  // Frontend: { _id(cartRowId), id(productId), name, image, price, size, quantity, ... }
  const normaliseCartItem = (item) => {
    if (!item || !item.product) return null
    const p = item.product
    return {
      _id: item._id,          // cart row id (used for PUT/DELETE)
      id: p._id || p.id,      // product id
      name: p.name,
      image: p.images?.[0] || '',
      images: p.images || [],
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      category: p.category,
      slug: p.slug,
      sizes: p.sizes || [],
      size: item.size,
      quantity: item.quantity,
    }
  }

  // ── Load cart from backend on login ───────────────────────────────────────
  useEffect(() => {
    const loadCart = async () => {
      if (isLoggedIn && !isDemo) {
        setCartLoading(true)
        try {
          const res = await api.get('/cart')
          const items = res.data
            .map(normaliseCartItem)
            .filter(Boolean)
          setCart(items)
        } catch (err) {
          console.error('Failed to fetch cart from backend:', err)
        } finally {
          setCartLoading(false)
        }
      } else if (!isLoggedIn) {
        // User logged out — clear local cart state
        setCart([])
      }
    }
    loadCart()
  }, [isLoggedIn, isDemo])

  // ── Load wishlist from backend on login ────────────────────────────────────
  useEffect(() => {
    const loadWishlist = async () => {
      if (isLoggedIn && !isDemo) {
        setWishlistLoading(true)
        try {
          const res = await api.get('/wishlist')
          const products = res.data
            .filter((item) => item && item.product)
            .map((item) => ({
              ...item.product,
              id: item.product._id || item.product.id
            }))
          setWishlist(products)
        } catch (err) {
          console.error('Failed to fetch wishlist from backend:', err)
        } finally {
          setWishlistLoading(false)
        }
      } else if (!isLoggedIn) {
        setWishlist([])
      }
    }
    loadWishlist()
  }, [isLoggedIn, isDemo])

  // ── Add item to cart ───────────────────────────────────────────────────────
  const addToCart = useCallback(async (product, size, quantity = 1) => {
    if (!product || !size) return

    const productId = product._id || product.id
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(String(productId))

    // Real logged-in user with a MongoDB product → sync to backend
    if (isLoggedIn && !isDemo && isMongoId) {
      try {
        const res = await api.post('/cart', { productId, size, quantity })
        const newItem = normaliseCartItem(res.data.cartItem)
        if (!newItem) return

        setCart((prev) => {
          // Replace if same cart row already in local state (upsert)
          const idx = prev.findIndex((i) => i._id === newItem._id)
          if (idx > -1) {
            const updated = [...prev]
            updated[idx] = newItem
            return updated
          }
          return [...prev, newItem]
        })
        showToast('Added to your cart.', 'success')
        return
      } catch (err) {
        console.error('Failed to add to cart on backend:', err)
        // Show error if it came from backend validation
        const msg = err.response?.data?.error
        if (msg) showToast(msg, 'error')
        return
      }
    }

    // Offline / demo mode — local only
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => (item.id === productId || item._id === productId) && item.size === size
      )
      if (existingIdx > -1) {
        const updated = [...prev]
        updated[existingIdx] = { ...updated[existingIdx], quantity: updated[existingIdx].quantity + quantity }
        return updated
      }
      return [...prev, { ...product, id: productId, size, quantity }]
    })
    showToast('Added to your cart.', 'success')
  }, [isLoggedIn, isDemo])

  // ── Remove item from cart ──────────────────────────────────────────────────
  const removeFromCart = useCallback(async (productId, size) => {
    if (isLoggedIn && !isDemo) {
      // Find the cart row to get its _id (backend cart row id)
      const item = cart.find(
        (i) => (i.id === productId || i._id === productId) && i.size === size
      )
      const rowId = item?._id
      if (rowId) {
        try {
          await api.delete(`/cart/${rowId}`)
        } catch (err) {
          console.error('Failed to remove cart item from backend:', err)
        }
      }
    }
    setCart((prev) =>
      prev.filter((item) => !(
        (item.id === productId || item._id === productId) && item.size === size
      ))
    )
  }, [isLoggedIn, isDemo, cart])

  // ── Update item quantity in cart ───────────────────────────────────────────
  const updateCartQuantity = useCallback(async (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size)
      return
    }

    if (isLoggedIn && !isDemo) {
      const item = cart.find(
        (i) => (i.id === productId || i._id === productId) && i.size === size
      )
      const rowId = item?._id
      if (rowId) {
        try {
          const res = await api.put(`/cart/${rowId}`, { quantity })
          const updated = normaliseCartItem(res.data.cartItem)
          if (updated) {
            setCart((prev) =>
              prev.map((i) => i._id === rowId ? updated : i)
            )
            return
          }
        } catch (err) {
          console.error('Failed to update cart quantity on backend:', err)
        }
      }
    }

    // Offline fallback
    setCart((prev) =>
      prev.map((item) =>
        (item.id === productId || item._id === productId) && item.size === size
          ? { ...item, quantity }
          : item
      )
    )
  }, [isLoggedIn, isDemo, cart, removeFromCart])

  // ── Clear entire cart ──────────────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    if (isLoggedIn && !isDemo) {
      try {
        await api.delete('/cart')
      } catch (err) {
        console.error('Failed to clear cart on backend:', err)
      }
    }
    setCart([])
  }, [isLoggedIn, isDemo])

  // ── Clear cart and wishlist (used on logout) ───────────────────────────────
  const clearCartAndWishlist = useCallback(() => {
    setCart([])
    setWishlist([])
    localStorage.removeItem('styleai_cart')
    localStorage.removeItem('styleai_wishlist')
  }, [])

  // ── Toggle wishlist ────────────────────────────────────────────────────────
  const toggleWishlist = useCallback(async (product) => {
    if (!product) return

    const productId = product._id || product.id
    const exists = wishlist.some((item) => item.id === productId || item._id === productId)
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(String(productId))

    if (!isLoggedIn || isDemo || !isMongoId) {
      setWishlist((prev) => {
        if (exists) {
          showToast('Wishlist updated successfully.', 'success')
          return prev.filter((item) => item.id !== productId && item._id !== productId)
        }
        showToast('Wishlist updated successfully.', 'success')
        return [...prev, product]
      })
      return
    }

    try {
      if (exists) {
        await api.delete(`/wishlist/${productId}`)
        setWishlist((prev) => prev.filter((item) => item.id !== productId && item._id !== productId))
        showToast('Wishlist updated successfully.', 'success')
      } else {
        await api.post(`/wishlist/${productId}`)
        setWishlist((prev) => [...prev, { ...product, id: productId }])
        showToast('Wishlist updated successfully.', 'success')
      }
    } catch (err) {
      console.error('Failed to toggle wishlist on backend:', err)
      showToast(err.response?.data?.error || 'Failed to update wishlist. Please try again.', 'error')
    }
  }, [isLoggedIn, isDemo, wishlist])

  // ── isInWishlist ───────────────────────────────────────────────────────────
  const isInWishlist = useCallback((productId) => {
    return wishlist.some((item) => item.id === productId || item._id === productId)
  }, [wishlist])

  // ── Move item from wishlist to cart ───────────────────────────────────────
  const moveToCart = useCallback((product, size) => {
    addToCart(product, size, 1)
    toggleWishlist(product)
  }, [addToCart, toggleWishlist])

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        cartLoading,
        wishlistLoading,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        clearCartAndWishlist,
        toggleWishlist,
        isInWishlist,
        moveToCart,
        toast,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider')
  }
  return context
}
