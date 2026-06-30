import { useState, useMemo, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Heart, ShoppingBag, Star, ArrowLeft, Truck, RotateCcw,
  Shield, Check, Sparkles, HelpCircle, X, ChevronLeft, ChevronRight, Edit3, Users, ImageIcon, MessageSquare, Clock, Award, Package, RefreshCw
} from 'lucide-react'
import ProductCard from '../components/ProductCard'
import Button from '../components/Button'
import { products as allProducts } from '../data'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function ProductDetailsPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addToCart, toggleWishlist, isInWishlist } = useCart()
  const { isLoggedIn } = useAuth() || {}

  // Backend state
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [related, setRelated] = useState([])
  const [isEligible, setIsEligible] = useState(false)
  const [checkingEligibility, setCheckingEligibility] = useState(false)

  // Buyer Connect System states
  const [connectTab, setConnectTab] = useState('questions') // 'questions' | 'photos'
  const [connectStats, setConnectStats] = useState({ questionsCount: 0, verifiedAnswersCount: 0, photosCount: 0 })
  const [connectQuestions, setConnectQuestions] = useState([])
  const [connectPhotos, setConnectPhotos] = useState([])
  const [loadingConnect, setLoadingConnect] = useState(false)

  // Buyer Connect Forms
  const [newQuestion, setNewQuestion] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState('')
  const [newPhotoCaption, setNewPhotoCaption] = useState('')
  const [submittingConnect, setSubmittingConnect] = useState(false)
  const [inlineAnswers, setInlineAnswers] = useState({})
  const [submittingAnswerId, setSubmittingAnswerId] = useState(null)

  // Carousel index for related products
  const [carouselIndex, setCarouselIndex] = useState(0)

  // Sizing/Quantity states
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [qty, setQty] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  // Zoom overlay state for gallery
  const [activeImgIndex, setActiveImgIndex] = useState(0)
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' })

  // Review Form Modal
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [reviewImageUrl, setReviewImageUrl] = useState('')
  const [reviewImages, setReviewImages] = useState([])
  const [submittingReview, setSubmittingReview] = useState(false)

  // Recently Viewed State
  const [recentlyViewed, setRecentlyViewed] = useState([])
  // Inline size error
  const [sizeError, setSizeError] = useState(false)
  const [feedback, setFeedback] = useState({ text: '', type: '' })

  const showFeedback = (text, type = 'success') => {
    setFeedback({ text, type })
    setTimeout(() => setFeedback({ text: '', type: '' }), 4500)
  }

  // Fetch product data
  const fetchProductDetails = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/products/${slug}`)
      if (res.data && res.data.product) {
        setProduct(res.data.product)
        setReviews(res.data.reviewSummary?.reviewsList || [])
        setRelated(res.data.relatedProducts || [])
        saveToRecentlyViewed(res.data.product)
      } else {
        const local = allProducts.find((p) => p.slug === slug || p.id === slug)
        if (local) {
          setProduct(local)
          saveToRecentlyViewed(local)
        }
      }
    } catch (err) {
      const local = allProducts.find((p) => p.slug === slug || String(p.id) === String(slug) || String(p._id) === String(slug))
      if (local) {
        setProduct(local)
        saveToRecentlyViewed(local)
      }
    } finally {
      setLoading(false)
    }
  }

  // Load all buyer connect lists and stats
  const fetchBuyerConnectData = async () => {
    if (!slug) return
    setLoadingConnect(true)
    try {
      const [statsRes, questionsRes, photosRes] = await Promise.all([
        api.get(`/buyer-connect/${slug}/stats`),
        api.get(`/buyer-connect/${slug}/questions`),
        api.get(`/buyer-connect/${slug}/photos`)
      ])
      setConnectStats(statsRes.data)
      setConnectQuestions(questionsRes.data)
      setConnectPhotos(photosRes.data)
    } catch (err) {
      console.error('Failed to load buyer connect logs:', err)
    } finally {
      setLoadingConnect(false)
    }
  }

  // Load details on mount or slug change
  useEffect(() => {
    fetchProductDetails()
    fetchBuyerConnectData()
    setSelectedSize('')
    setSelectedColor('')
    setQty(1)
    setActiveImgIndex(0)
    setNewQuestion('')
    setPhotoFile(null)
    setPhotoPreviewUrl('')
    setNewPhotoCaption('')
    setInlineAnswers({})
  }, [slug])

  // Check eligibility if user is logged in
  useEffect(() => {
    if (!isLoggedIn || !product) return
    const checkEligibility = async () => {
      setCheckingEligibility(true)
      try {
        const res = await api.get(`/products/${slug}/reviews/eligible`)
        setIsEligible(res.data.eligible)
      } catch (err) {
        console.error('Eligibility check error:', err)
      } finally {
        setCheckingEligibility(false)
      }
    }
    checkEligibility()
  }, [isLoggedIn, product, slug])

  // Load recently viewed from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('styleai_recently_viewed')
      if (stored) {
        setRecentlyViewed(JSON.parse(stored))
      }
    } catch (err) {
      console.error(err)
    }
  }, [slug])

  // Save item to recently viewed list
  const saveToRecentlyViewed = (prod) => {
    if (!prod) return
    try {
      const stored = localStorage.getItem('styleai_recently_viewed')
      let list = stored ? JSON.parse(stored) : []
      list = list.filter(item => item._id !== prod._id && item.id !== prod.id)
      list.unshift(prod)
      list = list.slice(0, 10)
      localStorage.setItem('styleai_recently_viewed', JSON.stringify(list))
    } catch (err) {
      console.error(err)
    }
  }

  const recentlyViewedDisplay = useMemo(() => {
    if (!product) return []
    return recentlyViewed
      .filter(item => item._id !== product._id && item.id !== product.id)
      .slice(0, 4)
  }, [recentlyViewed, product])

  // ratings breakdown calculation
  const ratingBreakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    if (reviews.length === 0) return counts
    reviews.forEach(r => {
      if (counts[r.rating] !== undefined) counts[r.rating]++
    })
    return counts
  }, [reviews])

  const wishlisted = product ? isInWishlist(product._id || product.id) : false

  const discount = product && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const productImages = useMemo(() => {
    if (!product) return []
    if (product.images && product.images.length > 0) return product.images
    return [
      product.image,
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80",
      "https://images.unsplash.com/photo-1623609163859-ca93c959b98a?w=600&q=80"
    ].filter(Boolean)
  }, [product])

  const productSizes = useMemo(() => {
    if (!product) return []
    return product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L']
  }, [product])

  const productColors = useMemo(() => {
    if (!product) return []
    return product.colors && product.colors.length > 0 ? product.colors : ['Charcoal', 'Linen White']
  }, [product])

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true)
      setTimeout(() => setSizeError(false), 3000)
      return
    }
    setSizeError(false)
    addToCart(product, selectedSize, qty)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
  }

  // Magnifying hover zoom handlers
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect()
    const x = ((e.pageX - left - window.scrollX) / width) * 100
    const y = ((e.pageY - top - window.scrollY) / height) * 100
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${productImages[activeImgIndex]})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%'
    })
  }

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' })
  }

  // Handle submit review
  const handleAddReviewImage = (e) => {
    e.preventDefault()
    if (!reviewImageUrl.trim()) return
    setReviewImages(prev => [...prev, reviewImageUrl.trim()])
    setReviewImageUrl('')
  }

  const handleOpenReviewWrite = () => {
    const existing = reviews.find(r => r.user?._id === reqUser_id() || r.user === reqUser_id())
    if (existing) {
      setReviewRating(existing.rating)
      setReviewText(existing.review)
      setReviewImages(existing.images || [])
    } else {
      setReviewRating(5)
      setReviewText('')
      setReviewImages([])
    }
    setShowReviewModal(true)
  }

  const reqUser_id = () => {
    try {
      const usr = JSON.parse(localStorage.getItem('styleai_user'))
      return usr?.id || usr?._id
    } catch {
      return null
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!reviewText.trim()) return showFeedback('Please write a review comment.', 'error')
    setSubmittingReview(true)

    try {
      const res = await api.post(`/products/${slug}/reviews`, {
        rating: reviewRating,
        review: reviewText,
        images: reviewImages
      })

      const updatedReview = res.data.review
      setReviews(prev => {
        const match = prev.find(r => r.user?._id === reqUser_id() || r.user === reqUser_id())
        if (match) {
          return prev.map(r => (r.user?._id === reqUser_id() || r.user === reqUser_id()) ? { ...updatedReview, user: r.user } : r)
        }
        return [
          {
            ...updatedReview,
            user: { _id: reqUser_id(), name: JSON.parse(localStorage.getItem('styleai_user'))?.name || 'Customer' }
          },
          ...prev
        ]
      })

      setProduct(prev => ({
        ...prev,
        ratings: res.data.product.ratings,
        reviewsCount: res.data.product.reviewsCount
      }))

      setShowReviewModal(false)
      showFeedback(res.data.message || 'Review submitted successfully!', 'success')
    } catch (err) {
      showFeedback(err.response?.data?.error || 'Failed to submit review.', 'error')
    } finally {
      setSubmittingReview(false)
    }
  }

  // ── BUYER CONNECT ACTIONS ──

  const handleAskQuestion = async (e) => {
    e.preventDefault()
    if (!newQuestion.trim() || newQuestion.trim().length < 5 || newQuestion.trim().length > 500) {
      showFeedback('Question must be between 5 and 500 characters.', 'error')
      return
    }
    setSubmittingConnect(true)
    try {
      const res = await api.post(`/buyer-connect/${slug}/questions`, { question: newQuestion.trim() })
      setConnectQuestions(prev => [res.data, ...prev])
      setNewQuestion('')
      const statsRes = await api.get(`/buyer-connect/${slug}/stats`)
      setConnectStats(statsRes.data)
      showFeedback('Question posted successfully! Community members will respond shortly.', 'success')
    } catch (err) {
      showFeedback(err.response?.data?.error || 'Failed to post question.', 'error')
    } finally {
      setSubmittingConnect(false)
    }
  }

  const handleAnswerQuestion = async (qId) => {
    const ansText = inlineAnswers[qId]
    if (!ansText || ansText.trim().length < 5 || ansText.trim().length > 1000) {
      showFeedback('Answer must be between 5 and 1000 characters.', 'error')
      return
    }
    setSubmittingAnswerId(qId)
    try {
      const res = await api.post(`/buyer-connect/questions/${qId}/answer`, { answer: ansText.trim() })
      setConnectQuestions(prev => prev.map(q => q._id === qId ? res.data : q))
      setInlineAnswers(prev => ({ ...prev, [qId]: '' }))
      const statsRes = await api.get(`/buyer-connect/${slug}/stats`)
      setConnectStats(statsRes.data)
      showFeedback('Answer submitted successfully! Thank you for helping the community.', 'success')
    } catch (err) {
      showFeedback(err.response?.data?.error || 'Failed to submit answer.', 'error')
    } finally {
      setSubmittingAnswerId(null)
    }
  }

  const handleVoteQuestionHelpful = async (qId) => {
    try {
      const res = await api.post(`/buyer-connect/questions/${qId}/helpful`)
      setConnectQuestions(prev => prev.map(q => q._id === qId ? { ...q, helpfulVotes: res.data.helpfulVotes } : q))
      showFeedback('Thank you for marking this question as helpful!', 'success')
    } catch (err) {
      showFeedback(err.response?.data?.error || 'Failed to register vote.', 'error')
    }
  }

  const handleUploadPhoto = async (e) => {
    e.preventDefault()
    if (!photoFile) {
      showFeedback('Please select an image file to upload.', 'error')
      return
    }
    if (newPhotoCaption && newPhotoCaption.length > 300) {
      showFeedback('Caption cannot exceed 300 characters.', 'error')
      return
    }
    setSubmittingConnect(true)
    try {
      const formData = new FormData()
      formData.append('image', photoFile)
      formData.append('caption', newPhotoCaption.trim())

      const res = await api.post(`/buyer-connect/${slug}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setConnectPhotos(prev => [res.data, ...prev])
      setPhotoFile(null)
      setPhotoPreviewUrl('')
      setNewPhotoCaption('')
      const statsRes = await api.get(`/buyer-connect/${slug}/stats`)
      setConnectStats(statsRes.data)
      showFeedback('Wear photo shared successfully with the community!', 'success')
    } catch (err) {
      showFeedback(err.response?.data?.error || 'Failed to upload photo.', 'error')
    } finally {
      setSubmittingConnect(false)
    }
  }

  const handleVotePhotoHelpful = async (pId) => {
    try {
      const res = await api.post(`/buyer-connect/photos/${pId}/helpful`)
      setConnectPhotos(prev => prev.map(p => p._id === pId ? { ...p, helpfulVotes: res.data.helpfulVotes } : p))
      showFeedback('Thank you for marking this photo as helpful!', 'success')
    } catch (err) {
      showFeedback(err.response?.data?.error || 'Failed to register vote.', 'error')
    }
  }

  // Formatting date helper
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

  // Related products carousel controls
  const handlePrevCarousel = () => {
    setCarouselIndex(prev => Math.max(0, prev - 1))
  }

  const handleNextCarousel = () => {
    setCarouselIndex(prev => Math.min(Math.max(0, related.length - 4), prev + 1))
  }

  // SKELETON LOADER
  if (loading) {
    return (
      <div className="pt-24 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-24 animate-pulse">
        <div className="h-4 w-1/4 bg-cream-200 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-2 hidden sm:flex flex-col gap-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="w-full h-24 rounded-xl bg-cream-200" />
              ))}
            </div>
            <div className="sm:col-span-10 aspect-[3/4] rounded-[2rem] bg-cream-200" />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="h-4 bg-cream-200 rounded w-1/3" />
            <div className="h-10 bg-cream-200 rounded w-3/4" />
            <div className="h-6 bg-cream-200 rounded w-1/2" />
            <div className="h-8 bg-cream-200 rounded w-1/3" />
            <div className="h-20 bg-cream-200 rounded w-full" />
            <div className="h-12 bg-cream-200 rounded w-1/2" />
            <div className="h-14 bg-cream-200 rounded w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-24 min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4 bg-cream-50">
        <div className="w-20 h-20 rounded-3xl bg-lavender-50 flex items-center justify-center text-4xl shadow animate-float">
          🧥
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mt-2">Product Not Found</h2>
        <p className="text-gray-500 text-xs max-w-sm">
          The product you are trying to view does not exist or has been removed from our marketplace listing.
        </p>
        <Link to="/products" className="mt-2">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-cream-50 pb-24">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-lavender-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-lavender-600 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate capitalize">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-lavender-600 transition-colors mb-6 font-semibold"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </button>

        {/* ── [1] Main Product Details Block ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* LEFT: Image Gallery Thumbnail Switcher */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-2 flex sm:flex-col gap-3 order-2 sm:order-1 overflow-x-auto sm:overflow-y-auto max-h-[480px] pb-2 sm:pb-0 scrollbar-hide">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`w-16 h-20 sm:w-full sm:h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                    activeImgIndex === idx ? 'border-lavender-500 scale-105 shadow-sm' : 'border-transparent hover:border-lavender-200'
                  }`}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&auto=format&fit=crop&q=60' }} />
                </button>
              ))}
            </div>

            {/* Main Image Container with zoom-on-hover */}
            <div className="sm:col-span-10 order-1 sm:order-2 relative aspect-[3/4] rounded-3xl overflow-hidden bg-white shadow-sm border border-cream-200/50 group">
              <div
                className="w-full h-full cursor-zoom-in relative"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={productImages[activeImgIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80' }}
                />
              </div>

              {/* Zoom overlay */}
              <div
                className="absolute inset-0 pointer-events-none border border-cream-100 rounded-3xl hidden sm:block shadow-inner"
                style={zoomStyle}
              />

              {/* Promotional Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-10">
                {(product.trending || product.aiRecommended) && (
                  <span className="px-3 py-1 rounded-full bg-violet-600 text-white text-[10px] font-extrabold shadow flex items-center gap-1">
                    <Sparkles size={10} fill="currentColor" /> AI Recommended
                  </span>
                )}
                {product.featured && (
                  <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-extrabold shadow">
                    ⭐ Featured Item
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold shadow">
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* Wishlist Button Toggle */}
              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 border border-cream-200 backdrop-blur-sm shadow flex items-center justify-center hover:scale-110 transition-transform z-10"
              >
                <Heart
                  size={18}
                  className={wishlisted ? 'text-rose-500 fill-rose-500' : 'text-gray-400'}
                />
              </button>
            </div>
          </div>

          {/* RIGHT: Product Information Controls */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase block mb-1">
                  {product.brand || 'StyleAI Brand'} · {product.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Product Trust Signals near Rating & Reviews (Visible before scrolling) */}
              <div className="flex items-center gap-2.5 text-[11px] text-slate-500 font-semibold border-b border-slate-100 pb-4 flex-wrap">
                <span className="text-[10px] text-amber-500 tracking-tight">
                  {'★'.repeat(Math.round(product.ratings || 0)) + '☆'.repeat(5 - Math.round(product.ratings || 0))}
                </span>
                <span className="text-slate-800 font-extrabold">{(product.ratings || 0).toFixed(1)}</span>
                <span>· {product.reviewsCount || 0} reviews</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-700 font-bold">{connectStats.questionsCount} Questions</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-700 font-bold">{connectStats.photosCount} Photos</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-700 font-bold text-violet-600">✓ {connectStats.verifiedAnswersCount} Verified Answers</span>
              </div>

              {/* Pricing Display */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900">
                  ₹{(product.price || 0).toLocaleString()}
                </span>
                {(product.originalPrice || 0) > (product.price || 0) && (
                  <>
                    <span className="text-base text-slate-400 line-through">
                      ₹{(product.originalPrice || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      -{discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status Badge */}
              {(() => {
                const inv = product.inventory || 0
                let badgeStyle = 'text-emerald-600 bg-emerald-50 border-emerald-100 font-bold'
                let badgeText = 'In Stock'
                if (inv === 0) {
                  badgeStyle = 'text-rose-600 bg-rose-50 border-rose-100 font-bold'
                  badgeText = 'Out of Stock'
                } else if (inv <= 5) {
                  badgeStyle = 'text-rose-600 bg-rose-50 border-rose-100 font-extrabold animate-pulse'
                  badgeText = `Only ${inv} left`
                } else if (inv <= 10) {
                  badgeStyle = 'text-amber-600 bg-amber-50 border-amber-100 font-bold animate-pulse'
                  badgeText = 'Selling Fast'
                }
                return (
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border w-fit ${badgeStyle}`}>
                    {badgeText}
                  </div>
                )
              })()}

              <div className="space-y-3">
                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                  {product.description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-500 bg-cream-100/60 p-3 rounded-2xl border border-cream-200/50">
                  <div>Material: <span className="text-slate-800 capitalize">{product.material || 'Premium Cotton'}</span></div>
                  <div>Fit Style: <span className="text-slate-800 capitalize">{product.fit || 'Regular Fit'}</span></div>
                </div>
              </div>

              {/* Sizing */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                  <span>Choose Size:</span>
                  <span className="text-lavender-600 underline cursor-pointer">Size Chart</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {productSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setSizeError(false) }}
                      className={`h-11 px-4 rounded-xl border-2 text-xs font-bold transition-all ${
                        selectedSize === size
                          ? 'bg-slate-900 text-white border-slate-900 shadow'
                          : `border-slate-200 text-slate-600 bg-white hover:border-lavender-400 hover:text-lavender-600 ${sizeError ? 'border-rose-300' : ''}`
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1.5 flex items-center gap-1">
                    ↑ Please select a size to continue
                  </p>
                )}
              </div>

              {/* Color */}
              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Select Color:</div>
                <div className="flex flex-wrap gap-2">
                  {productColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        selectedColor === color
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 font-bold text-slate-600 text-sm"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-800">{qty}</span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 font-bold text-slate-600 text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 h-12 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow ${
                    addedToCart 
                      ? 'bg-emerald-500 text-white shadow-emerald-100' 
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200'
                  }`}
                >
                  <ShoppingBag size={14} />
                  {addedToCart ? 'Added to Cart! ✓' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => {
                    if (!selectedSize) {
                      setSizeError(true)
                      setTimeout(() => setSizeError(false), 3000)
                      return
                    }
                    addToCart(product, selectedSize, qty)
                    navigate('/checkout')
                  }}
                  className="flex-1 h-12 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center shadow shadow-violet-200"
                >
                  Buy Now
                </button>
              </div>

              <button
                onClick={() => navigate('/ai-stylist', { state: { styleProduct: product } })}
                className="w-full h-12 border border-violet-200 text-violet-600 hover:bg-violet-50 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 bg-violet-50/40"
              >
                Style with AI Stylist
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 bg-white border border-cream-200 p-3 rounded-2xl text-[9px] text-slate-400 font-bold text-center">
                <div className="space-y-0.5 flex flex-col items-center">
                  <Truck size={14} className="text-lavender-500" />
                  <span>Free Delivery</span>
                </div>
                <div className="space-y-0.5 flex flex-col items-center">
                  <RotateCcw size={14} className="text-lavender-500" />
                  <span>30-Day Returns</span>
                </div>
                <div className="space-y-0.5 flex flex-col items-center">
                  <Shield size={14} className="text-lavender-500" />
                  <span>Secure Payments</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Bought Together Bundle */}
        {related.length > 0 && (
          <FrequentlyBoughtTogether 
            currentProduct={product} 
            bundleItem={related[0]} 
            addToCart={addToCart} 
            showFeedback={showFeedback}
          />
        )}

        {/* ── [2] Related Products Carousel Section ── */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-cream-200 pt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-extrabold text-violet-600 uppercase tracking-widest block mb-1">Matching Looksets</span>
                <h2 className="text-xl font-bold text-slate-900">Related Products</h2>
              </div>
              {related.length > 4 && (
                <div className="flex gap-1">
                  <button 
                    onClick={handlePrevCarousel}
                    disabled={carouselIndex === 0}
                    className="p-2 rounded-xl bg-white border border-cream-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50 shadow-sm"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={handleNextCarousel}
                    disabled={carouselIndex >= related.length - 4}
                    className="p-2 rounded-xl bg-white border border-cream-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50 shadow-sm"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-hidden">
              {related.slice(carouselIndex, carouselIndex + 4).map((item) => (
                <div key={item._id || item.id} className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── [3] Recently Viewed Section ── */}
        {recentlyViewedDisplay.length > 0 && (
          <section className="mt-16 border-t border-cream-200 pt-12">
            <span className="text-[10px] font-extrabold text-violet-600 uppercase tracking-widest block mb-1">Pick up where you left</span>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Recently Viewed Products</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentlyViewedDisplay.map((item) => (
                <ProductCard key={item._id || item.id} product={item} />
              ))}
            </div>
          </section>
        )}

        {/* ── [4] Ratings & Reviews Board ── */}
        <section className="mt-16 border-t border-cream-200 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Review breakdown metrics */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Ratings & Reviews</h3>
            
            <div className="flex gap-4 items-center bg-white border border-cream-200 p-5 rounded-3xl shadow-sm">
              <div className="text-center space-y-1">
                <span className="text-4xl font-black text-slate-900 block">{product.ratings || 0}</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Out of 5 Stars</span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className={i < Math.floor(product.ratings || 0) ? 'fill-current' : 'text-slate-200'} />
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 font-bold block">{reviews.length} Verified Buyer reviews</span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-600">
              {[5, 4, 3, 2, 1].map(stars => {
                const count = ratingBreakdown[stars] || 0
                const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="w-3 text-right">{stars}</span>
                    <Star size={11} className="text-amber-400 fill-current" />
                    <div className="flex-1 h-2 bg-cream-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="w-6 text-slate-400">{count}</span>
                  </div>
                )
              })}
            </div>

            {isLoggedIn ? (
              <div className="p-4 bg-violet-50 border border-violet-100 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-violet-700 uppercase block tracking-wider">Share your feedback</span>
                <p className="text-[11px] text-slate-500 leading-normal">
                  {isEligible 
                    ? "You purchased this item! Share your fit style coordinates with the community."
                    : "Review permissions are reserved for verified buyers of this style."
                  }
                </p>
                {isEligible && (
                  <button
                    onClick={handleOpenReviewWrite}
                    className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow shadow-violet-200"
                  >
                    <Edit3 size={12} />
                    Write a Review
                  </button>
                )}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-[11px] text-slate-500 leading-normal">
                Please <Link to="/login" className="text-violet-600 font-bold underline">sign in</Link> to write custom product reviews.
              </div>
            )}
          </div>

          {/* Customer Reviews List */}
          <div className="lg:col-span-8 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Verified Comments ({reviews.length})</h4>
            
            {reviews.length === 0 ? (
              <div className="bg-white border border-cream-200 p-8 rounded-3xl text-center text-slate-400 text-xs font-semibold shadow-sm">
                No reviews yet. Be the first to share your styling feedback!
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {reviews.map((rev) => (
                  <div key={rev._id} className="bg-white border border-cream-200 p-5 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 text-xs block">{rev.user?.name || 'Verified Buyer'}</span>
                        <span className="text-[9px] text-slate-400">{formatDate(rev.createdAt)}</span>
                      </div>
                      <div className="flex gap-0.5 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={11} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">"{rev.review}"</p>
                    
                    {rev.images?.length > 0 && (
                      <div className="flex gap-2.5 pt-1">
                        {rev.images.map((img, idx) => (
                          <a href={img} target="_blank" rel="noopener noreferrer" key={idx} className="w-12 h-16 rounded-lg overflow-hidden bg-cream-50 border border-cream-100 hover:opacity-85 transition-opacity flex-shrink-0">
                            <img src={img} className="w-full h-full object-cover" alt="attachment" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── [5] Buyer Connect Board (Community Section) ── */}
        <section className="mt-16 border-t border-cream-200 pt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Users size={20} className="text-lavender-500" />
                Buyer Connect Community Board
              </h2>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">Interact with verified shoppers, ask questions, or share style coordinates.</p>
            </div>
            
            {/* Tabs Trigger toggler */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
              <button
                onClick={() => setConnectTab('questions')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  connectTab === 'questions' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <HelpCircle size={13} /> Q&As ({connectQuestions.length})
              </button>
              <button
                onClick={() => setConnectTab('photos')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  connectTab === 'photos' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ImageIcon size={13} /> Buyer Wear Photos ({connectPhotos.length})
              </button>
            </div>
          </div>

          {loadingConnect ? (
            <div className="flex items-center justify-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest gap-2">
              <RefreshCw size={14} className="animate-spin" /> Loading Community Board logs…
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* ──────────────── Questions & Answers Board ──────────────── */}
              {connectTab === 'questions' && (
                <div className="max-w-3xl space-y-6">
                  {/* Ask Question Form */}
                  {isLoggedIn ? (
                    <form onSubmit={handleAskQuestion} className="flex gap-2.5 bg-white border border-cream-200 p-3 rounded-2xl shadow-sm">
                      <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Ask about details, sizing coordinates, fabric weight…"
                        className="flex-grow pl-3 bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none"
                      />
                      <button
                        type="submit"
                        disabled={submittingConnect}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-lavender-600 transition-colors shadow-sm disabled:opacity-50"
                      >
                        {submittingConnect ? 'Posting…' : 'Ask Question'}
                      </button>
                    </form>
                  ) : (
                    <div className="bg-slate-50 border border-cream-100 p-4 rounded-2xl text-center text-xs text-slate-400 font-semibold">
                      Please <Link to="/login" className="text-violet-600 font-bold underline">sign in</Link> to ask questions.
                    </div>
                  )}

                  {/* Questions List */}
                  {connectQuestions.length === 0 ? (
                    <div className="bg-white border border-cream-200 p-8 rounded-3xl text-center text-slate-400 text-xs font-semibold">
                      No questions asked yet for this style. Ask the first query!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {connectQuestions.map((q) => {
                        const userInitials = q.user?.name ? q.user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'
                        const answererInitials = q.answeredBy?.name ? q.answeredBy.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'B'
                        
                        return (
                          <div key={q._id} className="bg-white border border-cream-200 p-5 rounded-2xl shadow-sm space-y-4">
                            {/* Question Row */}
                            <div className="flex gap-3 items-start">
                              <div className="w-8 h-8 rounded-full bg-lavender-100 text-lavender-600 flex items-center justify-center text-[10px] font-black flex-shrink-0">
                                {userInitials}
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                                    {q.user?.name || 'Customer'}
                                    <span className="text-[9px] text-slate-400 font-normal">Score: {q.user?.communityScore || 0}</span>
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-bold">{formatDate(q.createdAt)}</span>
                                </div>
                                <p className="text-xs font-bold text-slate-900 leading-relaxed">Q: {q.question}</p>
                              </div>
                            </div>

                            {/* Answer Row (If Answered) */}
                            {q.isAnswered ? (
                              <div className="pl-6 border-l-2 border-slate-100 flex gap-3 items-start mt-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-black flex-shrink-0">
                                  {answererInitials}
                                </div>
                                <div className="flex-grow space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-800 text-xs flex items-center gap-2">
                                      {q.answeredBy?.name || 'Verified Buyer'}
                                      {q.isAnswererVerified && (
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase">
                                          ✓ Verified Buyer
                                        </span>
                                      )}
                                      <span className="text-[9px] text-slate-400 font-normal">Score: {q.answeredBy?.communityScore || 0}</span>
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-bold">{formatDate(q.answeredAt)}</span>
                                  </div>
                                  <p className="text-xs text-slate-700 leading-relaxed">A: {q.answer}</p>
                                </div>
                              </div>
                            ) : (
                              /* Verified Buyer Answer input (If Unanswered & user is verified buyer) */
                              isEligible && isLoggedIn && (
                                <div className="pl-6 border-l-2 border-slate-100 space-y-2 mt-2">
                                  <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 border border-emerald-100 rounded uppercase block w-fit">
                                    ✓ Verified Buyer: Add Answer
                                  </span>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={inlineAnswers[q._id] || ''}
                                      onChange={(e) => setInlineAnswers(prev => ({ ...prev, [q._id]: e.target.value }))}
                                      placeholder="Provide fit coordinates or styling info…"
                                      className="flex-grow px-3 py-2 bg-slate-50 text-xs border border-transparent rounded-xl outline-none focus:border-lavender-300 text-slate-700"
                                    />
                                    <button
                                      onClick={() => handleAnswerQuestion(q._id)}
                                      disabled={submittingAnswerId === q._id}
                                      className="px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                                    >
                                      {submittingAnswerId === q._id ? 'Posting…' : 'Submit'}
                                    </button>
                                  </div>
                                </div>
                              )
                            )}

                            {/* Question actions footer */}
                            <div className="flex items-center gap-3 pt-2 pl-11">
                              <button
                                onClick={() => handleVoteQuestionHelpful(q._id)}
                                className="flex items-center gap-1 text-[10px] text-slate-400 font-extrabold hover:text-slate-600 transition-colors"
                              >
                                👍 Helpful ({q.helpfulVotes})
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ──────────────── Buyer Photos wear gallery ──────────────── */}
              {connectTab === 'photos' && (
                <div className="space-y-6">
                  {/* Upload Wear Photo Form */}
                  {isEligible && isLoggedIn ? (
                    <form onSubmit={handleUploadPhoto} className="bg-white border border-cream-200 p-5 rounded-3xl shadow-sm space-y-3 max-w-lg">
                      <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded uppercase block w-fit">
                        ✓ Verified Buyer Wear Upload
                      </span>
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">CHOOSE WEAR PHOTO</label>
                          <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={(e) => {
                              const file = e.target.files[0]
                              if (file) {
                                setPhotoFile(file)
                                setPhotoPreviewUrl(URL.createObjectURL(file))
                              }
                            }}
                            className="w-full px-3 py-2 bg-cream-50/50 border border-slate-200 rounded-xl text-xs"
                          />
                          {photoPreviewUrl && (
                            <div className="relative w-24 h-32 rounded-xl overflow-hidden border border-cream-200 mt-2">
                              <img src={photoPreviewUrl} alt="wear preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  setPhotoFile(null)
                                  setPhotoPreviewUrl('')
                                }}
                                className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full p-1 hover:bg-slate-950 flex items-center justify-center"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">CAPTION (Max 300 chars)</label>
                          <input
                            type="text"
                            value={newPhotoCaption}
                            onChange={(e) => setNewPhotoCaption(e.target.value)}
                            placeholder="Styled with denim linen fits, relaxed fit profile."
                            className="w-full px-3 py-2 bg-cream-50/50 border border-slate-200 rounded-xl"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={submittingConnect}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                          {submittingConnect ? 'Uploading…' : 'Share Wear Photo (+10 pts)'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    isLoggedIn && (
                      <div className="bg-slate-50 border p-4 rounded-2xl text-center text-xs text-slate-400 font-semibold max-w-xl">
                        Wear photo uploads are reserved for verified buyers who purchased this style.
                      </div>
                    )
                  )}

                  {/* Photo Wear Grid */}
                  {connectPhotos.length === 0 ? (
                    <div className="bg-white border border-cream-200 p-8 rounded-3xl text-center text-slate-400 text-xs font-semibold max-w-3xl">
                      No customer wear photos uploaded yet. Verified buyers can upload coordinates!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl">
                      {connectPhotos.map((p) => {
                        return (
                          <div key={p._id} className="bg-white border border-cream-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
                            <div className="relative aspect-[3/4] bg-cream-50">
                              <img src={p.imageUrl} alt={p.caption} className="w-full h-full object-cover" />
                              <span className="absolute top-3 left-3 inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-50/95 text-emerald-600 border border-emerald-100 uppercase backdrop-blur-sm shadow-sm">
                                ✓ Verified Buyer
                              </span>
                            </div>

                            <div className="p-4 space-y-3">
                              <div>
                                <p className="text-xs text-slate-700 font-bold leading-relaxed">"{p.caption || 'Product wear snapshot'}"</p>
                                <span className="text-[9px] text-slate-400 block mt-1.5 font-semibold">
                                  Shared by {p.user?.name || 'Customer'} (Score: {p.user?.communityScore || 0})
                                </span>
                              </div>
                              
                              <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                                <button
                                  onClick={() => handleVotePhotoHelpful(p._id)}
                                  className="text-[10px] text-slate-400 font-bold hover:text-slate-600 flex items-center gap-1 transition-colors"
                                >
                                  👍 Helpful ({p.helpfulVotes})
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
        </section>
      </div>

      {/* ── [6] MOBILE STICKY ADD TO CART BAR ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 border-t border-cream-200 backdrop-blur p-4 z-40 flex items-center justify-between gap-4 shadow-lg">
        <div className="min-w-0">
          <span className="text-[10px] text-slate-400 font-bold uppercase truncate block capitalize">{product.name}</span>
          <span className="text-base font-black text-slate-900">₹{product.price.toLocaleString()}</span>
        </div>
        {selectedSize ? (
          <button
            onClick={handleAddToCart}
            className={`px-6 h-11 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow ${
              addedToCart
                ? 'bg-emerald-500 text-white shadow-emerald-100'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <ShoppingBag size={13} />
            {addedToCart ? 'Added! ✓' : 'Add to Cart'}
          </button>
        ) : (
          <div className="text-[10px] text-amber-600 font-bold bg-amber-50 px-3 py-2 rounded-xl border border-amber-100">
            Select size to Add
          </div>
        )}
      </div>

      {/* ── [7] REVIEWS FORM MODAL ── */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 max-w-md w-full relative">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-800">Write Product Review</h3>
                <p className="text-slate-400 text-[10px] mt-0.5">Your review helps verified community members choose styles.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Overall Rating:</label>
                <div className="flex gap-1 text-slate-200">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`hover:scale-110 transition-transform ${star <= reviewRating ? 'text-amber-400' : 'text-slate-200'}`}
                    >
                      <Star size={20} fill={star <= reviewRating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Review Comments:</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows="3"
                  placeholder="How does it fit? Is the fabric lightweight? Share styling tips…"
                  className="w-full p-3 bg-cream-50 text-xs border border-transparent rounded-xl outline-none focus:border-lavender-300 placeholder-slate-400 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Review Image URLs (Optional):</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={reviewImageUrl}
                    onChange={(e) => setReviewImageUrl(e.target.value)}
                    placeholder="https://example.com/my-style.jpg"
                    className="flex-grow px-3 py-2 bg-cream-50 text-xs border border-transparent rounded-xl outline-none focus:border-lavender-300 text-slate-700"
                  />
                  <button
                    type="button"
                    onClick={handleAddReviewImage}
                    className="px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Add URL
                  </button>
                </div>
                {reviewImages.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {reviewImages.map((url, idx) => (
                      <div key={idx} className="relative w-12 h-16 rounded-lg overflow-hidden border border-cream-200">
                        <img src={url} className="w-full h-full object-cover" alt="rev thumbnail" />
                        <button
                          type="button"
                          onClick={() => setReviewImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute -top-1 -right-1 bg-slate-900/80 text-white rounded-full p-0.5 hover:bg-slate-950"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="flex-grow py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow shadow-violet-200"
                >
                  {submittingReview ? <RefreshCw className="animate-spin" size={12} /> : 'Submit Review'}
                </button>
              </div>
            </form>
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

function FrequentlyBoughtTogether({ currentProduct, bundleItem, addToCart, showFeedback }) {
  const [includeMain, setIncludeMain] = useState(true)
  const [includeBundle, setIncludeBundle] = useState(true)
  const [added, setAdded] = useState(false)

  const totalPrice = (includeMain ? currentProduct.price : 0) + (includeBundle ? bundleItem.price : 0)

  const handleAddBundle = () => {
    if (!includeMain && !includeBundle) return
    if (includeMain) {
      addToCart(currentProduct, 'M', 1)
    }
    if (includeBundle) {
      addToCart(bundleItem, 'M', 1)
    }
    setAdded(true)
    showFeedback('Added bundle items to your cart.', 'success')
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <section className="mt-12 bg-white rounded-3xl border border-cream-200 p-6 shadow-sm">
      <span className="text-[10px] font-extrabold text-violet-600 uppercase tracking-widest block mb-1">Frequently Bought Together</span>
      <h3 className="text-base font-bold text-slate-900 mb-4">Complete the Look</h3>
      
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Main Item */}
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={includeMain} 
              onChange={() => setIncludeMain(!includeMain)} 
              className="w-4 h-4 rounded text-violet-600 focus:ring-violet-400 cursor-pointer"
            />
            <div className="w-16 h-20 rounded-xl overflow-hidden bg-cream-50 border flex-shrink-0">
              <img src={currentProduct.image || currentProduct.images?.[0]} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="text-xs max-w-[120px]">
              <p className="font-bold text-slate-800 truncate">{currentProduct.name}</p>
              <p className="font-extrabold text-slate-900 mt-0.5">₹{currentProduct.price.toLocaleString()}</p>
            </div>
          </div>

          <span className="text-xl font-bold text-slate-400">+</span>

          {/* Bundle Item */}
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={includeBundle} 
              onChange={() => setIncludeBundle(!includeBundle)} 
              className="w-4 h-4 rounded text-violet-600 focus:ring-violet-400 cursor-pointer"
            />
            <div className="w-16 h-20 rounded-xl overflow-hidden bg-cream-50 border flex-shrink-0">
              <img src={bundleItem.image || bundleItem.images?.[0]} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="text-xs max-w-[120px]">
              <p className="font-bold text-slate-800 truncate">{bundleItem.name}</p>
              <p className="font-extrabold text-slate-900 mt-0.5">₹{bundleItem.price.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex-grow border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex flex-col md:flex-row justify-between items-center gap-4 w-full">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Bundle Price</span>
            <span className="text-xl font-black text-slate-900">₹{totalPrice.toLocaleString()}</span>
          </div>
          <button
            onClick={handleAddBundle}
            disabled={!includeMain && !includeBundle}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow ${
              added ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {added ? 'Added Bundle! ✓' : 'Add Selected to Cart'}
          </button>
        </div>
      </div>
    </section>
  )
}
