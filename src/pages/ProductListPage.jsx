import { useState, useMemo, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  SlidersHorizontal, X, ChevronDown, AlertCircle, RefreshCw,
  Search, Clock, Sparkles, Star, ShoppingBag, ShieldCheck, Heart
} from 'lucide-react'
import ProductCard from '../components/ProductCard'
import Button from '../components/Button'
import api from '../services/api'
import { historyService } from '../services/history'
import { useCart } from '../context/CartContext'
import { products as staticProducts } from '../data'

const OCCASIONS = ['All', 'Casual', 'Formal', 'Party', 'Wedding', 'Festive']
const GENDERS = ['All', 'Men', 'Women', 'Unisex']
const CATEGORIES = ['All', 'Ethnic', 'Western', 'Accessories', 'Footwear']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const POPULAR_SUGGESTIONS = ['Blazer', 'Hoodie', 'Dress', 'Joggers', 'Linen', 'Shirt']

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Global cart/wishlist context
  const { addToCart, toggleWishlist, isInWishlist } = useCart()

  // Data state
  const [products, setProducts] = useState([])
  const [fetchLoading, setFetchLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProductsCount, setTotalProductsCount] = useState(0)

  // Filters state
  const [priceRange, setPriceRange] = useState(9999)
  const [selectedOccasion, setSelectedOccasion] = useState(
    searchParams.get('occasion') || 'All'
  )
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  )
  const [selectedGender, setSelectedGender] = useState('All')
  const [selectedSizes, setSelectedSizes] = useState([])
  const [sortBy, setSortBy] = useState('default')

  // Search input and autocomplete state
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '')
  const [searchFocused, setSearchFocused] = useState(false)
  const recentSearches = useMemo(() => historyService.getSearches(), [searchParams])
  const searchRef = useRef(null)
  const loaderRef = useRef(null)

  // Quick View Product State
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [quickViewSize, setQuickViewSize] = useState('')
  const [quickViewQty, setQuickViewQty] = useState(1)
  const [quickViewAdded, setQuickViewAdded] = useState(false)
  const [quickViewSizeError, setQuickViewSizeError] = useState(false)

  // Fetch products from backend with query parameters for filtering, search, sorting and pagination
  const fetchProducts = async (pageToFetch = 1, shouldAppend = false) => {
    setFetchLoading(true)
    setFetchError('')
    try {
      const q = searchParams.get('q') || ''
      const genParam = selectedGender !== 'All' ? selectedGender : ''
      const cat = selectedCategory !== 'All' ? selectedCategory : ''
      const occ = selectedOccasion !== 'All' ? selectedOccasion : ''
      const sortVal = sortBy === 'price-asc' ? 'price_asc' : sortBy === 'price-desc' ? 'price_desc' : sortBy === 'rating' ? 'rating' : sortBy === 'newest' ? 'newest' : sortBy === 'popular' ? 'popular' : ''
      const sizeParam = selectedSizes.length > 0 ? selectedSizes[0] : ''
      const maxPriceParam = priceRange < 9999 ? priceRange : ''

      let url = `/products?page=${pageToFetch}&limit=40`
      if (q) url += `&search=${encodeURIComponent(q)}`
      if (genParam) url += `&gender=${encodeURIComponent(genParam)}`
      if (cat) url += `&category=${encodeURIComponent(cat)}`
      if (occ) url += `&occasion=${encodeURIComponent(occ)}`
      if (sortVal) url += `&sort=${sortVal}`
      if (sizeParam) url += `&size=${encodeURIComponent(sizeParam)}`
      if (maxPriceParam) url += `&maxPrice=${maxPriceParam}`

      const res = await api.get(url)
      const fetchedProducts = res.data.products || []
      
      if (fetchedProducts.length === 0 && !shouldAppend) {
        // Offline / fallback to staticProducts
        let offlineList = [...staticProducts]
        if (q) {
          const qLower = q.toLowerCase()
          offlineList = offlineList.filter(p => p.name?.toLowerCase().includes(qLower) || p.brand?.toLowerCase().includes(qLower) || p.category?.toLowerCase().includes(qLower))
        }
        if (selectedGender !== 'All') {
          offlineList = offlineList.filter(p => p.gender === selectedGender)
        }
        if (selectedCategory !== 'All') {
          offlineList = offlineList.filter(p => p.category === selectedCategory)
        }
        if (selectedOccasion !== 'All') {
          offlineList = offlineList.filter(p => p.occasion === selectedOccasion || p.occasionTags?.includes(selectedOccasion))
        }
        offlineList = offlineList.filter(p => p.price <= priceRange)
        if (selectedSizes.length) {
          offlineList = offlineList.filter(p => p.sizes?.some(s => selectedSizes.includes(s)))
        }
        setProducts(offlineList)
        setTotalPages(1)
        setTotalProductsCount(offlineList.length)
      } else {
        if (shouldAppend) {
          setProducts((prev) => {
            const existingIds = new Set(prev.map(p => p._id || p.id));
            const newFiltered = fetchedProducts.filter(p => !existingIds.has(p._id || p.id));
            return [...prev, ...newFiltered];
          });
        } else {
          setProducts(fetchedProducts)
        }
        setTotalPages(res.data.totalPages || res.data.pages || 1)
        setTotalProductsCount(res.data.totalProducts || fetchedProducts.length)
      }
    } catch (err) {
      if (!shouldAppend) {
        let offlineList = [...staticProducts]
        const q = searchParams.get('q') || ''
        if (q) {
          const qLower = q.toLowerCase()
          offlineList = offlineList.filter(p => p.name?.toLowerCase().includes(qLower) || p.brand?.toLowerCase().includes(qLower) || p.category?.toLowerCase().includes(qLower))
        }
        if (selectedGender !== 'All') {
          offlineList = offlineList.filter(p => p.gender === selectedGender)
        }
        if (selectedCategory !== 'All') {
          offlineList = offlineList.filter(p => p.category === selectedCategory)
        }
        if (selectedOccasion !== 'All') {
          offlineList = offlineList.filter(p => p.occasion === selectedOccasion || p.occasionTags?.includes(selectedOccasion))
        }
        offlineList = offlineList.filter(p => p.price <= priceRange)
        if (selectedSizes.length) {
          offlineList = offlineList.filter(p => p.sizes?.some(s => selectedSizes.includes(s)))
        }
        setProducts(offlineList)
        setTotalPages(1)
        setTotalProductsCount(offlineList.length)
        setFetchError('Using offline catalog — backend is offline.')
      }
    } finally {
      setFetchLoading(false)
    }
  }

  // Debounced load when filters/search changes to avoid spamming the backend during slider drags
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1)
      fetchProducts(1, false)
    }, 200)

    const q = searchParams.get('q')
    if (q) {
      historyService.saveSearch(q)
      setSearchInput(q)
    }

    return () => clearTimeout(delayDebounce)
  }, [searchParams, selectedCategory, selectedGender, selectedOccasion, priceRange, selectedSizes, sortBy])

  // IntersectionObserver for Infinite Scrolling
  useEffect(() => {
    if (fetchLoading || page >= totalPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchProducts(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [page, totalPages, fetchLoading]);

  // Close search suggestions on click outside
  useEffect(() => {
    const clickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', clickOutside)
    return () => document.removeEventListener('mousedown', clickOutside)
  }, [])

  // Close sliding filter drawer on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false)
      }
    }
    if (sidebarOpen) {
      window.addEventListener('keydown', handleEscape)
    }
    return () => window.removeEventListener('keydown', handleEscape)
  }, [sidebarOpen])

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  const filtered = useMemo(() => products, [products])

  const clearFilters = () => {
    setPriceRange(9999)
    setSelectedOccasion('All')
    setSelectedCategory('All')
    setSelectedGender('All')
    setSelectedSizes([])
    setSortBy('default')
    setSearchParams({})
    setSearchInput('')
  }

  const handleSearchSubmit = (queryStr) => {
    const q = queryStr.trim()
    setSearchFocused(false)
    if (q) {
      setSearchParams({ q })
      historyService.saveSearch(q)
    } else {
      setSearchParams({})
    }
  }

  // Active filter helper calculations
  const activeChips = useMemo(() => {
    const chips = []
    if (selectedGender !== 'All') {
      chips.push({ type: 'gender', value: selectedGender, label: `Gender: ${selectedGender}` })
    }
    if (selectedCategory !== 'All') {
      chips.push({ type: 'category', value: selectedCategory, label: `Category: ${selectedCategory}` })
    }
    if (selectedOccasion !== 'All') {
      chips.push({ type: 'occasion', value: selectedOccasion, label: `Occasion: ${selectedOccasion}` })
    }
    if (priceRange < 9999) {
      chips.push({ type: 'price', value: priceRange, label: `Under ₹${priceRange.toLocaleString()}` })
    }
    selectedSizes.forEach((sz) => {
      chips.push({ type: 'size', value: sz, label: `Size: ${sz}` })
    })
    return chips
  }, [selectedCategory, selectedGender, selectedOccasion, priceRange, selectedSizes])

  const removeChip = (chip) => {
    if (chip.type === 'gender') setSelectedGender('All')
    else if (chip.type === 'category') setSelectedCategory('All')
    else if (chip.type === 'occasion') setSelectedOccasion('All')
    else if (chip.type === 'price') setPriceRange(9999)
    else if (chip.type === 'size') setSelectedSizes((prev) => prev.filter((s) => s !== chip.value))
  }

  // Suggestions search list
  const autocompleteList = useMemo(() => {
    if (!searchInput.trim()) return POPULAR_SUGGESTIONS
    return POPULAR_SUGGESTIONS.filter(item => item.toLowerCase().includes(searchInput.toLowerCase()))
  }, [searchInput])

  // Quick View helper methods
  const handleQuickViewAdd = () => {
    if (!quickViewSize) {
      setQuickViewSizeError(true)
      setTimeout(() => setQuickViewSizeError(false), 2500)
      return
    }
    addToCart(quickViewProduct, quickViewSize, quickViewQty)
    setQuickViewAdded(true)
    setTimeout(() => {
      setQuickViewAdded(false)
      setQuickViewProduct(null)
      setQuickViewSize('')
      setQuickViewQty(1)
    }, 2000)
  }

  return (
    <div className="pt-16 min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Explore Catalog</h1>
            <p className="text-gray-500 mt-1 text-sm">
              {fetchLoading ? 'Loading styles…' : `${filtered.length} unique look${filtered.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          {/* Search Experience Panel */}
          <div ref={searchRef} className="relative w-full max-w-md">
            <div className="flex bg-cream-100 rounded-2xl border border-cream-200 shadow-sm p-1.5 focus-within:ring-2 focus-within:ring-lavender-300 transition-all">
              <input
                id="catalog-search"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search styles, fits, vibes…"
                className="flex-1 pl-3 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
              />
              <button
                onClick={() => handleSearchSubmit(searchInput)}
                className="w-10 h-10 rounded-xl bg-gray-950 text-white flex items-center justify-center hover:bg-lavender-600 transition-colors"
                aria-label="Search Submit"
              >
                <Search size={16} />
              </button>
            </div>

            {/* Suggestions Overlay Dropdown */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl z-40 p-4 max-h-[320px] overflow-y-auto">
                {recentSearches.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
                      <Clock size={10} /> Recent Searches
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSearchInput(term)
                            handleSearchSubmit(term)
                          }}
                          className="px-2.5 py-1 rounded-lg bg-cream-50 hover:bg-lavender-50 hover:text-lavender-600 border border-cream-100 text-xs font-semibold text-gray-600"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
                    <Sparkles size={10} className="text-lavender-500" /> Recommended Searches
                  </span>
                  <div className="space-y-1">
                    {autocompleteList.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSearchInput(term)
                          handleSearchSubmit(term)
                        }}
                        className="w-full text-left py-2 px-3 rounded-xl hover:bg-lavender-50 hover:text-lavender-700 text-xs text-gray-600 font-bold transition-all flex items-center justify-between"
                      >
                        {term}
                        <ChevronDown size={12} className="-rotate-90 text-gray-300" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Offline/error banner */}
      {fetchError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
            <AlertCircle size={16} className="flex-shrink-0" />
            {fetchError}
            <button onClick={fetchProducts} className="ml-auto flex items-center gap-1 text-xs font-semibold hover:underline">
              <RefreshCw size={12} /> Retry Catalog Load
            </button>
          </div>
        </div>
      )}

      {/* ── Active Filters Chips Panel ── */}
      {activeChips.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex flex-wrap items-center gap-2 bg-white rounded-2xl border border-cream-100 p-3.5 shadow-sm">
            <span className="text-xs font-bold text-gray-400 mr-2">ACTIVE FILTERS:</span>
            {activeChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => removeChip(chip)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-lavender-50 text-lavender-700 hover:bg-lavender-100 hover:text-lavender-900 border border-lavender-100 text-xs font-bold transition-all"
              >
                {chip.label} <X size={12} />
              </button>
            ))}
            <button
              onClick={clearFilters}
              className="text-xs text-rose-500 font-bold hover:underline ml-auto"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── FILTER DRAWER SIDE-OVER ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-opacity duration-300 cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-violet-600 animate-pulse" />
            <h2 className="font-extrabold text-slate-800 text-base">Catalog Filters</h2>
            {activeChips.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeChips.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearFilters}
              className="text-xs text-rose-500 hover:text-rose-700 font-bold transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {/* Gender */}
          <FilterSection title="Gender">
            <div className="flex flex-wrap gap-2">
              {GENDERS.map((gen) => (
                <button
                  key={gen}
                  id={`filter-gen-${gen.toLowerCase()}`}
                  onClick={() => setSelectedGender(gen)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedGender === gen
                      ? 'bg-violet-600 text-white border-violet-600 shadow-sm scale-[1.02]'
                      : 'border-slate-200 text-slate-600 hover:border-violet-300 bg-white'
                  }`}
                >
                  {gen}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Category */}
          <FilterSection title="Category">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  id={`filter-cat-${cat.toLowerCase()}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedCategory === cat
                      ? 'bg-violet-600 text-white border-violet-600 shadow-sm scale-[1.02]'
                      : 'border-slate-200 text-slate-600 hover:border-violet-300 bg-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Occasion tag */}
          <FilterSection title="Occasion">
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((occ) => (
                <button
                  key={occ}
                  id={`filter-occ-${occ.toLowerCase()}`}
                  onClick={() => setSelectedOccasion(occ)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedOccasion === occ
                      ? 'bg-violet-600 text-white border-violet-600 shadow-sm scale-[1.02]'
                      : 'border-slate-200 text-slate-600 hover:border-violet-300 bg-white'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Price slider */}
          <FilterSection title={`Price — up to ₹${priceRange.toLocaleString()}`}>
            <input
              id="filter-price-slider"
              type="range"
              min="500"
              max="9999"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-violet-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-semibold">
              <span>₹500</span>
              <span>₹9,999</span>
            </div>
          </FilterSection>

          {/* Sizes checks */}
          <FilterSection title="Sizes">
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    id={`filter-size-${size.toLowerCase()}`}
                    onClick={() => toggleSize(size)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold border transition-all flex items-center justify-center ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 scale-105 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:border-violet-300 bg-white'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </FilterSection>
        </div>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
          <Button
            variant="primary"
            className="w-full py-3 text-xs shadow-md"
            onClick={() => setSidebarOpen(false)}
          >
            Apply & View {totalProductsCount} Styles
          </Button>
        </div>
      </aside>


          {/* Controls Header Panel */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-150/60">
            <div className="flex items-center gap-3">
              <button
                id="open-filters-btn"
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold hover:border-violet-400 hover:text-violet-700 shadow-sm transition-all flex-shrink-0"
              >
                <SlidersHorizontal size={14} />
                <span>Filter</span>
                {activeChips.length > 0 && (
                  <span className="w-4.5 h-4.5 rounded-full bg-violet-600 text-white text-[9px] flex items-center justify-center font-bold">
                    {activeChips.length}
                  </span>
                )}
              </button>

              <div className="relative">
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-4 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 appearance-none cursor-pointer hover:border-violet-400 hover:text-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-100 shadow-sm transition-all"
                >
                  <option value="default">Featured</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">New Arrivals</option>
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <p className="text-slate-400 text-xs font-semibold">
              {fetchLoading && page === 1 ? 'Refreshing...' : `Showing ${totalProductsCount} style${totalProductsCount !== 1 ? 's' : ''}`}
            </p>
          </div>


          {/* Loading Skeletons for first page */}
          {fetchLoading && page === 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="rounded-2xl bg-white border border-gray-100 overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-gray-100" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-100" />
                    <div className="h-3 w-1/2 rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty Search/Filter State */}
          {(!fetchLoading || page > 1) && filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-cream-200 p-10 max-w-xl mx-auto shadow-sm">
              <div className="text-6xl mb-4 animate-float inline-block">👗</div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">No Styles Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed mb-6">
                We couldn't find any products matching your active filters or search queries. Try removing some filters or search for another occasion!
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs shadow-md transition-colors"
              >
                Clear All Filters & Reset
              </button>
            </div>
          ) : (!fetchLoading || page > 1) ? (
            <>
              {/* Grid mapping */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filtered.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={{ ...product, id: product._id || product.id }}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>

              {/* Infinite scroll loader ref element */}
              {page < totalPages && (
                <div ref={loaderRef} className="w-full mt-10">
                  {fetchLoading && (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-2xl bg-white border border-gray-100 overflow-hidden animate-pulse">
                          <div className="aspect-[3/4] bg-gray-100" />
                          <div className="p-4 space-y-2">
                            <div className="h-4 w-3/4 rounded bg-gray-100" />
                            <div className="h-3 w-1/2 rounded bg-gray-100" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {!fetchLoading && (
                    <div className="text-center text-xs text-gray-400 py-4">
                      Scroll to load more styles (showing {filtered.length} of {totalProductsCount})
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}
      </div>

      {/* ── Quick View Modal Overlay ── */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] overflow-hidden max-w-3xl w-full shadow-2xl border border-gray-100 relative flex flex-col md:flex-row h-auto max-h-[90vh] animate-scale-in">
            
            {/* Left: Image showcase */}
            <div className="md:w-1/2 bg-cream-100 relative min-h-[300px] md:min-h-0">
              <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10">
                {quickViewProduct.trending && (
                  <span className="px-2.5 py-1 rounded-full bg-violet-600 text-white text-[10px] font-bold shadow flex items-center gap-0.5">
                    <Sparkles size={9} fill="currentColor" /> AI Recommended
                  </span>
                )}
              </div>
            </div>

            {/* Right: Info selections */}
            <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
              
              {/* Close Button */}
              <button
                onClick={() => {
                  setQuickViewProduct(null)
                  setQuickViewSize('')
                  setQuickViewQty(1)
                }}
                className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors z-20"
                aria-label="Close Quick View"
              >
                <X size={18} />
              </button>

              <div className="space-y-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-lg bg-lavender-50 border border-lavender-100 text-[10px] font-bold text-lavender-600 uppercase tracking-wide">
                    {quickViewProduct.occasion}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mt-2">{quickViewProduct.name}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{quickViewProduct.category}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill={i < Math.floor(quickViewProduct.rating) ? 'currentColor' : 'none'} className="text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400 font-semibold">{quickViewProduct.rating} ({quickViewProduct.reviews} reviews)</span>
                </div>

                {/* Prices */}
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-900">₹{(quickViewProduct.price || 0).toLocaleString()}</span>
                  <span className="text-xs text-gray-400 line-through">₹{(quickViewProduct.originalPrice || 0).toLocaleString()}</span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">{quickViewProduct.description}</p>

                {/* Sizes selections */}
                <div>
                  <span className="block text-xs font-bold text-gray-700 mb-2">Select Size:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {quickViewProduct.sizes ? (
                      quickViewProduct.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setQuickViewSize(sz)}
                          className={`w-9 h-9 rounded-xl border text-xs font-bold transition-all ${
                            quickViewSize === sz ? 'bg-gray-950 text-white border-gray-950 shadow-sm' : 'border-gray-200 text-gray-500 hover:border-lavender-400 hover:text-lavender-600 bg-white'
                          }`}
                        >
                          {sz}
                        </button>
                      ))
                    ) : (
                      ['XS', 'S', 'M', 'L', 'XL'].map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setQuickViewSize(sz)}
                          className={`w-9 h-9 rounded-xl border text-xs font-bold transition-all ${
                            quickViewSize === sz ? 'bg-gray-950 text-white border-gray-950 shadow-sm' : 'border-gray-200 text-gray-500 hover:border-lavender-400 hover:text-lavender-600 bg-white'
                          }`}
                        >
                          {sz}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Size error inline */}
                {quickViewSizeError && (
                  <p className="text-[11px] text-rose-500 font-semibold -mt-1 flex items-center gap-1">
                    ↑ Please select a size before adding to cart
                  </p>
                )}

                {/* Qty selectors */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-700">Qty:</span>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-cream-50">
                    <button onClick={() => setQuickViewQty(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center font-bold text-gray-600">-</button>
                    <span className="w-8 text-center text-xs font-bold">{quickViewQty}</span>
                    <button onClick={() => setQuickViewQty(q => q + 1)} className="w-8 h-8 flex items-center justify-center font-bold text-gray-600">+</button>
                  </div>
                </div>
              </div>

              {/* Action buttons inside Quick View */}
              <div className="mt-6 space-y-2">
                <Button
                  variant={quickViewAdded ? 'ghost' : 'dark'}
                  className="w-full h-11 text-xs"
                  onClick={handleQuickViewAdd}
                >
                  <ShoppingBag size={14} />
                  {quickViewAdded ? '✓ Added to Cart!' : 'Add to Cart'}
                </Button>
                
                {/* SSL lock signal */}
                <div className="flex items-center justify-center gap-1 text-[9px] text-gray-400 pt-1">
                  <ShieldCheck size={12} className="text-emerald-500" /> SSL Encrypted Checkout
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-gray-100 pb-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <span className="font-semibold text-gray-700 text-sm">{title}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && children}
    </div>
  )
}
