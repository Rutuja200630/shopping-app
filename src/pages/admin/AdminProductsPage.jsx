import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, Check, X, Loader, ToggleLeft, ToggleRight, UploadCloud, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react'
import api from '../../services/api'
import Button from '../../components/Button'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [genderFilter, setGenderFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [feedback, setFeedback] = useState({ text: '', type: '' })

  const showFeedback = (text, type = 'success') => {
    setFeedback({ text, type })
    setTimeout(() => setFeedback({ text: '', type: '' }), 4500)
  }

  // Form states
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    brand: 'StyleAI',
    category: '',
    subCategory: '',
    material: '',
    fit: '',
    gender: 'Unisex',
    price: '',
    originalPrice: '',
    discount: '0',
    images: [],
    imagePublicIds: [],
    sizes: ['S', 'M', 'L'],
    colors: [''],
    inventory: '10',
    occasionTags: ['Casual'],
    featured: false,
    aiRecommended: false,
    isActive: true
  })

  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadUrlInput, setUploadUrlInput] = useState('')
  const [submittingForm, setSubmittingForm] = useState(false)

  const location = useLocation()

  const fetchProducts = async () => {
    try {
      const res = await api.get('/admin/products')
      setProducts(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('q')
    if (q) {
      setSearchQuery(q)
    }
  }, [location.search])

  const handleOpenCreate = () => {
    setEditingProduct(null)
    setForm({
      name: '',
      description: '',
      brand: 'StyleAI',
      category: 'Apparel',
      subCategory: 'Shirts',
      material: 'Cotton',
      fit: 'Regular Fit',
      gender: 'Unisex',
      price: '',
      originalPrice: '',
      discount: '0',
      images: [],
      imagePublicIds: [],
      sizes: ['S', 'M', 'L'],
      colors: ['Blue'],
      inventory: '20',
      occasionTags: ['Casual'],
      featured: false,
      aiRecommended: false,
      isActive: true
    })
    setUploadUrlInput('')
    setError('')
    setShowFormModal(true)
  }

  const handleOpenEdit = (product) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      description: product.description,
      brand: product.brand || 'StyleAI',
      category: product.category,
      subCategory: product.subCategory,
      material: product.material,
      fit: product.fit,
      gender: product.gender,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount?.toString() || '0',
      images: product.images || [],
      imagePublicIds: product.imagePublicIds || [],
      sizes: product.sizes || [],
      colors: product.colors && product.colors.length > 0 ? product.colors : [''],
      inventory: product.inventory?.toString() || '0',
      occasionTags: product.occasionTags || [],
      featured: !!product.featured,
      aiRecommended: !!product.aiRecommended,
      isActive: !!product.isActive
    })
    setUploadUrlInput('')
    setError('')
    setShowFormModal(true)
  }

  // Toggle active state (reactivate/deactivate)
  const handleToggleActive = async (productId, nextActiveState) => {
    try {
      if (nextActiveState) {
        await api.put(`/admin/products/${productId}`, { isActive: true })
      } else {
        await api.delete(`/admin/products/${productId}`)
      }
      // Update local state
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p._id === productId ? { ...p, isActive: nextActiveState } : p
        )
      )
    } catch (err) {
      showFeedback(err.response?.data?.error || 'Failed to update active state.', 'error')
    }
  }

  // Adjust stock inventory directly or via increment/decrement
  const handleAdjustStock = async (productId, newInventory) => {
    if (newInventory < 0) return
    try {
      await api.patch(`/admin/products/${productId}/inventory`, { inventory: newInventory })
      setProducts(prev => prev.map(p => p._id === productId ? { ...p, inventory: newInventory } : p))
    } catch (err) {
      showFeedback(err.response?.data?.error || 'Failed to update stock inventory.', 'error')
    }
  }

  // Handle real image files upload to Cloudinary via backend
  const handleRealUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploadLoading(true)
    try {
      const newImages = [...form.images].filter(Boolean)
      const newPublicIds = [...(form.imagePublicIds || [])]

      for (const file of files) {
        const formData = new FormData()
        formData.append('image', file)
        
        const res = await api.post('/admin/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        
        newImages.push(res.data.url)
        newPublicIds.push(res.data.publicId)
      }

      setForm(prev => ({
        ...prev,
        images: newImages,
        imagePublicIds: newPublicIds
      }))
    } catch (err) {
      showFeedback(err.response?.data?.error || 'Image upload failed.', 'error')
    } finally {
      setUploadLoading(false)
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (submittingForm) return
    setError('')

    // Clean up empty sizes/images/colors
    const cleanedImages = form.images.filter(Boolean)
    const cleanedColors = form.colors.map(c => c.trim()).filter(Boolean)
    const cleanedSizes = form.sizes.filter(Boolean)
    const cleanedOccasions = form.occasionTags.filter(Boolean)

    if (cleanedImages.length === 0) {
      setError('Please upload at least one product image.')
      return
    }
    if (cleanedSizes.length === 0) {
      setError('Please select at least one available size.')
      return
    }

    const payload = {
      ...form,
      price: parseFloat(form.price),
      originalPrice: parseFloat(form.originalPrice),
      discount: parseInt(form.discount || '0'),
      inventory: parseInt(form.inventory || '0'),
      images: cleanedImages,
      imagePublicIds: form.imagePublicIds || [],
      colors: cleanedColors,
      sizes: cleanedSizes,
      occasionTags: cleanedOccasions
    }

    setSubmittingForm(true)
    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct._id}`, payload)
        showFeedback('Product updated successfully.', 'success')
      } else {
        await api.post('/admin/products', payload)
        showFeedback('Product created successfully.', 'success')
      }
      setShowFormModal(false)
      fetchProducts()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product details.')
    } finally {
      setSubmittingForm(false)
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter
    const matchesGender = genderFilter === 'All' || p.gender === genderFilter
    const matchesStatus = statusFilter === 'All' || 
                          (statusFilter === 'Active' && p.isActive) ||
                          (statusFilter === 'Inactive' && !p.isActive)
    return matchesSearch && matchesCategory && matchesGender && matchesStatus
  })

  // Get categories for filtering
  const categories = ['All', ...new Set(products.map(p => p.category))]

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 text-violet-600 animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Loading catalog…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Products</h1>
          <p className="text-slate-500 text-sm mt-0.5">Add, edit, and deactivate items in the StyleAI store.</p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add Product</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products or brands…"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs placeholder-slate-400 focus:outline-none focus:border-violet-400"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Gender filter */}
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-600 font-bold focus:outline-none focus:border-violet-400 outline-none"
            >
              <option value="All">All Genders</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-600 font-bold focus:outline-none focus:border-violet-400 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Categories Tab list */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl w-max max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                categoryFilter === cat
                  ? 'bg-white text-violet-600 shadow'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/70">
                <th className="py-4 px-6">Product details</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Inventory Stock</th>
                <th className="py-4 px-6">Featured</th>
                <th className="py-4 px-6">AI Recommend</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 font-semibold">
                    No products matching current filters found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Details Column */}
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-10 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">👕</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 truncate block max-w-[150px]">{p.name}</span>
                        <span className="text-[10px] text-slate-400 block tracking-wide uppercase font-semibold">{p.brand}</span>
                      </div>
                    </td>

                    {/* Category Column */}
                    <td className="py-4 px-6 capitalize">
                      <span className="text-slate-800 font-bold">{p.category}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{p.subCategory}</span>
                    </td>

                    {/* Price Column */}
                    <td className="py-4 px-6 font-extrabold text-slate-900">
                      ₹{p.price.toLocaleString()}
                      {p.originalPrice > p.price && (
                        <span className="block text-[10px] text-slate-400 line-through font-normal mt-0.5">₹{p.originalPrice.toLocaleString()}</span>
                      )}
                    </td>

                    {/* Inventory Stock Column with micro-adjust buttons */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/80 rounded-xl px-1.5 py-1 w-max">
                        <button
                          type="button"
                          onClick={() => handleAdjustStock(p._id, p.inventory - 1)}
                          disabled={p.inventory <= 0}
                          className="w-5 h-5 rounded-lg hover:bg-slate-200/60 disabled:opacity-30 transition-all font-bold flex items-center justify-center text-slate-500 text-xs border border-transparent active:scale-95"
                          title="Decrease stock"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={p.inventory}
                          min="0"
                          onChange={(e) => handleAdjustStock(p._id, parseInt(e.target.value) || 0)}
                          className={`w-9 bg-transparent text-center text-xs font-bold focus:outline-none border-none outline-none ${
                            p.inventory === 0 ? 'text-rose-600 font-extrabold' : p.inventory < 10 ? 'text-amber-500 font-bold' : 'text-slate-700'
                          }`}
                          title="Direct stock edit"
                        />
                        <button
                          type="button"
                          onClick={() => handleAdjustStock(p._id, p.inventory + 1)}
                          className="w-5 h-5 rounded-lg hover:bg-slate-200/60 transition-all font-bold flex items-center justify-center text-slate-500 text-xs border border-transparent active:scale-95"
                          title="Increase stock"
                        >
                          +
                        </button>
                      </div>
                      
                      {/* Inventory status tags */}
                      {p.inventory === 0 ? (
                        <span className="text-[8px] font-bold text-rose-500 block mt-1 uppercase tracking-wider">Out Of Stock</span>
                      ) : p.inventory < 10 ? (
                        <span className="text-[8px] font-bold text-amber-500 block mt-1 uppercase tracking-wider">Low Stock (&lt;10)</span>
                      ) : (
                        <span className="text-[8px] font-bold text-emerald-500 block mt-1 uppercase tracking-wider">In Stock</span>
                      )}
                    </td>

                    {/* Featured Column */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        p.featured ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
                      }`}>
                        {p.featured ? 'Yes' : 'No'}
                      </span>
                    </td>

                    {/* AI Recommended Column */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        p.aiRecommended ? 'bg-violet-50 text-violet-600 border border-violet-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
                      }`}>
                        {p.aiRecommended ? 'Yes' : 'No'}
                      </span>
                    </td>

                    {/* Status Column */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        p.isActive
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          : 'bg-rose-50 border-rose-200 text-rose-600'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${p.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors inline-flex"
                        title="Edit product"
                      >
                        <Edit2 size={13} />
                      </button>
                      
                      {/* Activate/Deactivate Toggle */}
                      {p.isActive ? (
                        <button
                          onClick={() => handleToggleActive(p._id, false)}
                          className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors inline-flex"
                          title="Deactivate product (soft-delete)"
                        >
                          <Trash2 size={13} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleActive(p._id, true)}
                          className="p-1.5 rounded-lg border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 transition-colors inline-flex"
                          title="Reactivate product"
                        >
                          <Check size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Product Create / Edit Modal Form ── */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 max-w-2xl w-full relative my-8 flex flex-col max-h-[90vh]">
            
            {/* Modal Close */}
            <button
              onClick={() => setShowFormModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Modal Title */}
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              {editingProduct ? 'Edit Store Product' : 'Add New Store Product'}
            </h2>
            <div className="h-px bg-slate-100 mb-5" />

            {/* Form Error alert */}
            {error && (
              <div className="p-3 mb-4 rounded-xl text-xs bg-rose-50 border border-rose-200 text-rose-600">
                <span>⚠️ {error}</span>
              </div>
            )}

            {/* Modal Body Scroll */}
            <form onSubmit={handleFormSubmit} className="space-y-5 flex-1 overflow-y-auto pr-1">
              
              {/* Cloudinary Image Upload Block */}
              <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl space-y-3">
                <span className="block text-xs font-bold text-slate-800">Upload Product Images to Cloudinary</span>
                <div className="flex flex-col gap-3">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleRealUpload}
                    disabled={uploadLoading}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  {uploadLoading && (
                    <div className="flex items-center gap-2 text-xs text-violet-600 font-semibold">
                      <Loader size={14} className="animate-spin" />
                      <span>Uploading to Cloudinary...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Grid Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Product Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Pastel Lehenga"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-violet-400"
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Brand</label>
                  <input
                    type="text"
                    required
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-violet-400"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
                  <input
                    type="text"
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Apparel"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-violet-400"
                  />
                </div>

                {/* SubCategory */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Sub-Category</label>
                  <input
                    type="text"
                    required
                    value={form.subCategory}
                    onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                    placeholder="Ethnic Wear"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-violet-400"
                  />
                </div>

                {/* Material */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Material</label>
                  <input
                    type="text"
                    required
                    value={form.material}
                    onChange={(e) => setForm({ ...form, material: e.target.value })}
                    placeholder="Silk / Cotton"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-violet-400"
                  />
                </div>

                {/* Fit */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Fit</label>
                  <input
                    type="text"
                    required
                    value={form.fit}
                    onChange={(e) => setForm({ ...form, fit: e.target.value })}
                    placeholder="Regular Fit"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-violet-400"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Gender Target</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-violet-400 bg-white"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>

                {/* Inventory */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Initial Inventory Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.inventory}
                    onChange={(e) => setForm({ ...form, inventory: e.target.value })}
                    placeholder="50"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-violet-400"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Selling Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="1299"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-violet-400"
                  />
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Original Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    placeholder="1999"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-violet-400"
                  />
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    placeholder="35"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-violet-400"
                  />
                </div>

                {/* Occasions (comma-separated) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Occasions (Comma Separated)</label>
                  <input
                    type="text"
                    value={form.occasionTags.join(', ')}
                    onChange={(e) => setForm({ ...form, occasionTags: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="Casual, Wedding, Party"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              {/* Sizes (multiselect checkboxes) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Available Sizes</label>
                <div className="flex gap-3 flex-wrap">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                    const checked = form.sizes.includes(sz)
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          const newSizes = checked
                            ? form.sizes.filter(s => s !== sz)
                            : [...form.sizes, sz]
                          setForm({ ...form, sizes: newSizes })
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all ${
                          checked
                            ? 'bg-violet-600 border-violet-600 text-white shadow'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {sz}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Colors (comma-separated) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Available Colors (Comma Separated)</label>
                <input
                  type="text"
                  value={form.colors.join(', ')}
                  onChange={(e) => setForm({ ...form, colors: e.target.value.split(',').map(s => s.trim()) })}
                  placeholder="Red, Blue, Indigo"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-violet-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea
                  required
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Tell users about the style, cut, print and styling guide…"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-violet-400"
                />
              </div>

              {/* Product Images Preview Grid */}
              <div>
                <span className="block text-xs font-semibold text-slate-700 mb-1.5">Product Images ({form.images.filter(Boolean).length})</span>
                {form.images.filter(Boolean).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No images uploaded yet. Upload images above.</p>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    {form.images.filter(Boolean).map((imgUrl, idx) => (
                      <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                        <img src={imgUrl} alt="product preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = form.images.filter((_, i) => i !== idx)
                            const newPublicIds = (form.imagePublicIds || []).filter((_, i) => i !== idx)
                            setForm({ ...form, images: newImages, imagePublicIds: newPublicIds })
                          }}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600/90 text-white flex items-center justify-center hover:bg-rose-700 shadow-sm"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 border-t border-slate-100 pt-4">
                {/* featured */}
                <button
                  type="button"
                  onClick={() => setForm({ ...form, featured: !form.featured })}
                  className="flex items-center gap-2 group text-left"
                >
                  {form.featured ? (
                    <ToggleRight size={26} className="text-violet-600" />
                  ) : (
                    <ToggleLeft size={26} className="text-slate-400" />
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Featured Listing</span>
                    <span className="text-[10px] text-slate-400">Promote to home carousel</span>
                  </div>
                </button>

                {/* aiRecommended */}
                <button
                  type="button"
                  onClick={() => setForm({ ...form, aiRecommended: !form.aiRecommended })}
                  className="flex items-center gap-2 group text-left"
                >
                  {form.aiRecommended ? (
                    <ToggleRight size={26} className="text-violet-600" />
                  ) : (
                    <ToggleLeft size={26} className="text-slate-400" />
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">AI Recommended</span>
                    <span className="text-[10px] text-slate-400">Match in Style recommenders</span>
                  </div>
                </button>

                {/* isActive */}
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className="flex items-center gap-2 group text-left"
                >
                  {form.isActive ? (
                    <ToggleRight size={26} className="text-violet-600" />
                  ) : (
                    <ToggleLeft size={26} className="text-slate-400" />
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Activate Product</span>
                    <span className="text-[10px] text-slate-400">Visible to active shoppers</span>
                  </div>
                </button>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 justify-end border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingForm}
                  className="px-5 py-2 bg-violet-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold hover:bg-violet-500 shadow-lg shadow-violet-600/10 transition-colors"
                >
                  {submittingForm ? 'Saving...' : 'Save Product'}
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
