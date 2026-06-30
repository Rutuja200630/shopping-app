import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User, Award, Package, HelpCircle, MessageSquare, Image as ImageIcon,
  Heart, ExternalLink, Calendar, RefreshCw, AlertCircle, Sparkles,
  UploadCloud, Loader
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Button from '../components/Button'
import OutfitLookCard from '../components/OutfitLookCard'

const getAvatarUrl = (avatar) => {
  if (!avatar) return '';
  if (typeof avatar === 'object') return avatar.url || '';
  return avatar;
};

export default function ProfilePage() {
  const navigate = useNavigate()
  const { isLoggedIn, isDemo, logout } = useAuth() || {}

  const [activeTab, setActiveTab] = useState('looks') // 'looks' | 'questions' | 'answers' | 'photos'
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploadLoading, setUploadLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [savedLooks, setSavedLooks] = useState([])
  const [savedLooksLoading, setSavedLooksLoading] = useState(false)
  const [feedback, setFeedback] = useState({ text: '', type: '' })

  const showFeedback = (text, type = 'success') => {
    setFeedback({ text, type })
    setTimeout(() => setFeedback({ text: '', type: '' }), 4500)
  }

  // Fashion memory preferences state hooks
  const [prefOpen, setPrefOpen] = useState(false)
  const [prefLoading, setPrefLoading] = useState(false)
  const [prefSaveLoading, setPrefSaveLoading] = useState(false)
  const [prefSavedAlert, setPrefSavedAlert] = useState('')
  const [prefErrorAlert, setPrefErrorAlert] = useState('')

  const [prefFavBrands, setPrefFavBrands] = useState('')
  const [prefFavColors, setPrefFavColors] = useState('')
  const [prefDisColors, setPrefDisColors] = useState('')
  const [prefPrefStyles, setPrefPrefStyles] = useState('')
  const [prefPrefFootwear, setPrefPrefFootwear] = useState('')
  const [prefPrefAccessories, setPrefPrefAccessories] = useState('')
  const [prefMinBudget, setPrefMinBudget] = useState(0)
  const [prefMaxBudget, setPrefMaxBudget] = useState(1000000)

  const loadPreferences = async () => {
    if (!isLoggedIn || isDemo) return
    setPrefLoading(true)
    try {
      const res = await api.get('/ai/preferences')
      if (res.data.success) {
        const p = res.data.preferences
        setPrefFavBrands(p.likes?.brands?.join(', ') || '')
        setPrefFavColors(p.likes?.colors?.join(', ') || '')
        setPrefDisColors(p.dislikes?.colors?.join(', ') || '')
        setPrefPrefStyles(p.likes?.styles?.join(', ') || '')
        setPrefPrefFootwear(p.likes?.footwear?.join(', ') || '')
        setPrefPrefAccessories(p.likes?.accessories?.join(', ') || '')
        setPrefMinBudget(res.data.budget?.minimumBudget ?? 0)
        setPrefMaxBudget(res.data.budget?.maximumBudget ?? 1000000)
      }
    } catch (err) {
      console.error('Failed to load preferences:', err)
    } finally {
      setPrefLoading(false)
    }
  }

  useEffect(() => {
    if (prefOpen) {
      loadPreferences()
    }
  }, [prefOpen])

  const handleSavePreferences = async (e) => {
    e.preventDefault()
    setPrefSaveLoading(true)
    setPrefSavedAlert('')
    setPrefErrorAlert('')
    try {
      const body = {
        favoriteBrands: prefFavBrands.split(',').map(s => s.trim()).filter(Boolean),
        favoriteColors: prefFavColors.split(',').map(s => s.trim()).filter(Boolean),
        dislikedColors: prefDisColors.split(',').map(s => s.trim()).filter(Boolean),
        preferredStyles: prefPrefStyles.split(',').map(s => s.trim()).filter(Boolean),
        preferredFootwear: prefPrefFootwear.split(',').map(s => s.trim()).filter(Boolean),
        preferredAccessories: prefPrefAccessories.split(',').map(s => s.trim()).filter(Boolean),
        minimumBudget: Number(prefMinBudget),
        maximumBudget: Number(prefMaxBudget)
      }
      const res = await api.put('/ai/preferences', body)
      if (res.data.success) {
        setPrefSavedAlert('Fashion preferences updated successfully!')
        setTimeout(() => setPrefSavedAlert(''), 4000)
        const p = res.data.preferences
        setPrefFavBrands(p.likes?.brands?.join(', ') || '')
        setPrefFavColors(p.likes?.colors?.join(', ') || '')
        setPrefDisColors(p.dislikes?.colors?.join(', ') || '')
        setPrefPrefStyles(p.likes?.styles?.join(', ') || '')
        setPrefPrefFootwear(p.likes?.footwear?.join(', ') || '')
        setPrefPrefAccessories(p.likes?.accessories?.join(', ') || '')
      }
    } catch (err) {
      setPrefErrorAlert('Failed to update fashion preferences.')
      setTimeout(() => setPrefErrorAlert(''), 4000)
    } finally {
      setPrefSaveLoading(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Show preview immediately
    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)
    setUploadLoading(true)

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const res = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (res.data.success) {
        // Sync local storage user details
        const updatedUser = { ...userObj, avatar: res.data.imageUrl }
        localStorage.setItem('styleai_user', JSON.stringify(updatedUser))
        // Trigger page refresh to sync headers/avatars globally
        window.location.reload()
      }
    } catch (err) {
      showFeedback(err.response?.data?.error || 'Failed to upload avatar.', 'error')
      setPreviewUrl('')
    } finally {
      setUploadLoading(false)
    }
  }

  const fetchSavedLooks = async () => {
    if (!isLoggedIn || isDemo) return
    setSavedLooksLoading(true)
    try {
      const res = await api.get('/looks')
      setSavedLooks(res.data || [])
    } catch (err) {
      console.error('Failed to load saved looks:', err)
    } finally {
      setSavedLooksLoading(false)
    }
  }

  const handleDeleteLook = (deletedId) => {
    setSavedLooks((prev) => prev.filter((look) => (look._id || look.id) !== deletedId))
  }

  const fetchContributions = async () => {
    if (!isLoggedIn || isDemo) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/buyer-connect/profile/contributions')
      setProfileData(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load contributions details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    fetchContributions()
    fetchSavedLooks()
  }, [isLoggedIn, isDemo])

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

  if (!isLoggedIn) return null

  if (isDemo) {
    return (
      <div className="pt-24 min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-cream-200 p-8 text-center max-w-md w-full shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-3xl mx-auto mb-5">
            ⚡
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Unavailable in Demo</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Personal profiles and community contribution tracking are locked in offline demo mode. Please sign in using a registered database account.
          </p>
          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  const userObj = JSON.parse(localStorage.getItem('styleai_user')) || {}
  const initials = userObj.name ? userObj.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'

  // Contributions metrics
  const score = profileData?.communityScore ?? 0
  const verifiedPurchases = profileData?.verifiedPurchases ?? 0
  const isVerifiedBuyer = verifiedPurchases > 0

  return (
    <div className="pt-16 min-h-screen bg-cream-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-1 text-sm font-semibold">Manage your profile and track community contributions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: User Profile Metrics Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] border border-cream-200 p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
              {/* Profile Background Glow */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-violet-500/10 to-purple-500/10 -z-0" />
              
              {/* Profile Avatar with Edit/Upload Trigger */}
              <div className="relative group z-10 w-20 h-20 rounded-full border-4 border-white bg-gradient-to-tr from-violet-600 to-purple-500 flex items-center justify-center text-2xl font-black text-white shadow-md mb-4 mt-4 overflow-hidden">
                {uploadLoading ? (
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center z-20">
                    <Loader size={18} className="animate-spin text-white" />
                  </div>
                ) : null}
                {previewUrl || getAvatarUrl(userObj.avatar) ? (
                  <img src={previewUrl || getAvatarUrl(userObj.avatar)} alt="Profile" className="w-full h-full object-cover rounded-full" />
                ) : (
                  initials
                )}
                {/* Upload Hover Overlay */}
                <label className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200 cursor-pointer z-10">
                  <UploadCloud size={14} className="text-white" />
                  <span className="text-[9px] font-bold mt-0.5">Change</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>

              <h2 className="text-xl font-bold text-slate-800 leading-tight">{userObj.name}</h2>
              <span className="text-xs text-slate-400 font-medium mt-1 mb-3">{userObj.email}</span>

              {/* Verified Buyer Badge */}
              {isVerifiedBuyer && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-sm mb-4">
                  ✓ Verified Buyer
                </span>
              )}

              {/* User Roles */}
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 border text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-5">
                System Role: {userObj.role || 'user'}
              </span>

              {/* Stats Breakdown */}
              <div className="w-full grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 mt-2">
                <div className="text-center space-y-0.5">
                  <span className="text-2xl font-black text-slate-800 block">{score}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block flex items-center justify-center gap-1">
                    <Award size={10} className="text-violet-500" /> Score
                  </span>
                </div>
                <div className="text-center space-y-0.5 border-l border-slate-100">
                  <span className="text-2xl font-black text-slate-800 block">{verifiedPurchases}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block flex items-center justify-center gap-1">
                    <Package size={10} className="text-emerald-500" /> Purchases
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Navigation Help / Points Scale */}
            <div className="bg-white rounded-3xl border border-cream-200 p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b">
                <Sparkles size={14} className="text-violet-500" /> Points Scoring Chart
              </h3>
              <div className="space-y-2.5 text-xs text-slate-500 font-medium">
                <div className="flex justify-between">
                  <span>Ask a Question:</span>
                  <strong className="text-slate-800">+1 Point</strong>
                </div>
                <div className="flex justify-between">
                  <span>Answer a Question:</span>
                  <strong className="text-slate-800">+5 Points</strong>
                </div>
                <div className="flex justify-between">
                  <span>Upload Buyer Wear Photo:</span>
                  <strong className="text-slate-800">+10 Points</strong>
                </div>
                <div className="flex justify-between text-violet-600">
                  <span>Helpful Vote Received:</span>
                  <strong className="font-extrabold">+2 Points</strong>
                </div>
              </div>
            </div>

            {/* Fashion Preferences Collapsible Dashboard */}
            <div className="bg-white rounded-3xl border border-cream-200 p-5 shadow-sm space-y-4">
              <button
                type="button"
                onClick={() => setPrefOpen(!prefOpen)}
                className="w-full flex items-center justify-between font-bold text-slate-800 text-xs uppercase tracking-wider pb-2 border-b text-left"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-purple-600 animate-pulse" /> Fashion Preferences
                </span>
                <span>{prefOpen ? '−' : '+'}</span>
              </button>

              {prefOpen && (
                <div className="space-y-4 pt-2 text-xs font-semibold text-slate-600">
                  {prefSavedAlert && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-[11px] font-bold">
                      {prefSavedAlert}
                    </div>
                  )}
                  {prefErrorAlert && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-[11px] font-bold">
                      {prefErrorAlert}
                    </div>
                  )}
                  {prefLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader size={18} className="animate-spin text-purple-600" />
                    </div>
                  ) : (
                    <form onSubmit={handleSavePreferences} className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block">Favorite Brands</label>
                        <input
                          type="text"
                          value={prefFavBrands}
                          onChange={(e) => setPrefFavBrands(e.target.value)}
                          placeholder="e.g. Zara, Nike, Gucci (comma separated)"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-purple-400 font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block">Favorite Colors</label>
                        <input
                          type="text"
                          value={prefFavColors}
                          onChange={(e) => setPrefFavColors(e.target.value)}
                          placeholder="e.g. Pink, Pastels, Gold"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-purple-400 font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block">Disliked Colors</label>
                        <input
                          type="text"
                          value={prefDisColors}
                          onChange={(e) => setPrefDisColors(e.target.value)}
                          placeholder="e.g. Black, Neon Green"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-purple-400 font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block">Preferred Styles</label>
                        <input
                          type="text"
                          value={prefPrefStyles}
                          onChange={(e) => setPrefPrefStyles(e.target.value)}
                          placeholder="e.g. Minimalist, Traditional"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-purple-400 font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block">Preferred Footwear</label>
                        <input
                          type="text"
                          value={prefPrefFootwear}
                          onChange={(e) => setPrefPrefFootwear(e.target.value)}
                          placeholder="e.g. Sneakers, Loafers"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-purple-400 font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block">Preferred Accessories</label>
                        <input
                          type="text"
                          value={prefPrefAccessories}
                          onChange={(e) => setPrefPrefAccessories(e.target.value)}
                          placeholder="e.g. Handbags, Belts, Watches"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-purple-400 font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400 block">Min Budget (₹)</label>
                          <input
                            type="number"
                            value={prefMinBudget}
                            onChange={(e) => setPrefMinBudget(e.target.value)}
                            placeholder="0"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-purple-400 font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400 block">Max Budget (₹)</label>
                          <input
                            type="number"
                            value={prefMaxBudget}
                            onChange={(e) => setPrefMaxBudget(e.target.value)}
                            placeholder="10000"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-purple-400 font-medium"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={prefSaveLoading}
                        className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-purple-600 transition-all flex items-center justify-center gap-1 mt-3"
                      >
                        {prefSaveLoading ? <Loader size={12} className="animate-spin" /> : null}
                        Save Preferences
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Contributions Tabs Details */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tabs Trigger Headers */}
            <div className="bg-white rounded-2xl border border-cream-200 p-1.5 shadow-sm flex overflow-x-auto scrollbar-none gap-1">
              {[
                { id: 'looks', label: 'Saved Looks', icon: Heart, count: savedLooks.length },
                { id: 'questions', label: 'Questions Asked', icon: HelpCircle, count: profileData?.questions?.length || 0 },
                { id: 'answers', label: 'Answers Given', icon: MessageSquare, count: profileData?.answers?.length || 0 },
                { id: 'photos', label: 'Photos Shared', icon: ImageIcon, count: profileData?.photos?.length || 0 }
              ].map((tab) => {
                const TabIcon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 flex-1 py-3 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isActive 
                        ? 'bg-slate-900 text-white shadow' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <TabIcon size={14} />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 border'}`}>
                      {tab.count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Tab Body contents */}
            {activeTab === 'looks' ? (
              savedLooksLoading ? (
                /* Saved looks skeletons */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                  {[1, 2].map((n) => (
                    <div key={n} className="bg-white rounded-[2rem] border border-cream-200 p-6 shadow-sm min-h-[400px] space-y-4">
                      <div className="h-6 bg-cream-100 rounded-lg w-1/3" />
                      <div className="h-24 bg-cream-50 rounded-2xl w-full" />
                      <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-32 bg-cream-50 rounded-2xl w-full" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : savedLooks.length === 0 ? (
                <EmptyContributionsState
                  icon="💖"
                  title="No Saved Looks"
                  text="Ask the AI Stylist to generate customized looks, and tap Save Look to access them later here!"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedLooks.map((look) => (
                    <OutfitLookCard
                      key={look._id || look.id}
                      look={look}
                      isSavedView={true}
                      onDelete={handleDeleteLook}
                    />
                  ))}
                </div>
              )
            ) : loading ? (
              /* Profile list skeletons */
              <div className="space-y-4">
                {[1, 2].map((n) => (
                  <div key={n} className="bg-white rounded-3xl border border-cream-200 p-5 animate-pulse space-y-3">
                    <div className="h-4 bg-cream-100 w-1/3 rounded-lg" />
                    <div className="h-6 bg-cream-50 w-full rounded-lg" />
                    <div className="h-4 bg-cream-100 w-1/4 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-sm text-rose-600">
                <AlertCircle size={18} className="flex-shrink-0" />
                {error}
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* ── [1] QUESTIONS TAB CONTENT ── */}
                {activeTab === 'questions' && (
                  profileData?.questions?.length === 0 ? (
                    <EmptyContributionsState icon="❓" title="No Questions Asked" text="Have queries about sizes or fits? Ask on any product details page!" />
                  ) : (
                    profileData.questions.map((q) => (
                      <div key={q._id} className="bg-white rounded-3xl border border-cream-200 p-5 shadow-sm space-y-4 transition-all hover:shadow-md">
                        {/* Product Header */}
                        {q.product && (
                          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                            <Link to={`/products/${q.product.slug}`} className="flex items-center gap-2.5 text-xs font-bold text-slate-700 hover:text-violet-600 transition-colors">
                              <span className="px-2 py-0.5 rounded bg-cream-100 text-[10px] text-slate-500">View Product</span>
                              {q.product.name}
                            </Link>
                            <span className="text-[10px] text-slate-400 font-semibold">{formatDate(q.createdAt)}</span>
                          </div>
                        )}
                        
                        {/* Question info */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-extrabold bg-lavender-50 border border-lavender-200 text-lavender-600 px-1.5 py-0.5 rounded-md uppercase">Question Asked</span>
                          <p className="text-xs font-bold text-slate-800 mt-1 leading-relaxed">"{q.question}"</p>
                        </div>

                        {/* Answer details */}
                        {q.isAnswered ? (
                          <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-2xl text-xs text-slate-600 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-slate-800">Answer Received:</span>
                              <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border border-emerald-100">Verified Answer</span>
                            </div>
                            <p className="leading-relaxed">"{q.answer}"</p>
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-400 italic">Pending response from the buyer community…</p>
                        )}

                        {/* Helpful footer */}
                        <div className="text-[10px] text-slate-400 font-bold">
                          👍 {q.helpfulVotes} members found this question helpful
                        </div>
                      </div>
                    ))
                  )
                )}

                {/* ── [2] ANSWERS TAB CONTENT ── */}
                {activeTab === 'answers' && (
                  profileData?.answers?.length === 0 ? (
                    <EmptyContributionsState icon="💬" title="No Answers Given" text="Share your style coordinates by answering questions from the community on items you purchased!" />
                  ) : (
                    profileData.answers.map((q) => (
                      <div key={q._id} className="bg-white rounded-3xl border border-cream-200 p-5 shadow-sm space-y-4 transition-all hover:shadow-md">
                        {/* Product Header */}
                        {q.product && (
                          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                            <Link to={`/products/${q.product.slug}`} className="flex items-center gap-2.5 text-xs font-bold text-slate-700 hover:text-violet-600 transition-colors">
                              <span className="px-2 py-0.5 rounded bg-cream-100 text-[10px] text-slate-500">View Product</span>
                              {q.product.name}
                            </Link>
                            <span className="text-[10px] text-slate-400 font-semibold">{formatDate(q.answeredAt || q.updatedAt)}</span>
                          </div>
                        )}

                        {/* Question asked by someone */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Question Asked by Community Member</span>
                          <p className="text-xs text-slate-500 leading-relaxed italic">"{q.question}"</p>
                        </div>

                        {/* Your answer */}
                        <div className="space-y-1 bg-violet-50/40 border border-violet-100 p-4 rounded-2xl">
                          <span className="text-[9px] font-extrabold bg-violet-600 text-white px-1.5 py-0.5 rounded-md uppercase">Your Answer</span>
                          <p className="text-xs font-bold text-slate-800 mt-1 leading-relaxed">"{q.answer}"</p>
                        </div>

                        {/* Helpful votes */}
                        <div className="text-[10px] text-slate-400 font-bold">
                          👍 {q.helpfulVotes} members found this helpful (+{q.helpfulVotes * 2} points earned)
                        </div>
                      </div>
                    ))
                  )
                )}

                {/* ── [3] PHOTOS TAB CONTENT ── */}
                {activeTab === 'photos' && (
                  profileData?.photos?.length === 0 ? (
                    <EmptyContributionsState icon="📸" title="No Photos Shared" text="Share real-wear images showing how product coordinates fit you to earn +10 points!" />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profileData.photos.map((p) => (
                        <div key={p._id} className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
                          {/* Image card wrapper */}
                          <div className="relative aspect-[3/4] bg-cream-100">
                            <img src={p.imageUrl} alt={p.caption} className="w-full h-full object-cover" />
                            {p.product && (
                              <Link to={`/products/${p.product.slug}`} className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-xl text-white text-[10px] font-bold flex items-center justify-between hover:bg-black transition-colors">
                                <span className="truncate">{p.product.name}</span>
                                <ExternalLink size={10} className="flex-shrink-0 ml-1" />
                              </Link>
                            )}
                          </div>

                          {/* Info footer */}
                          <div className="p-4 space-y-3">
                            <p className="text-xs text-slate-700 font-bold leading-relaxed">"{p.caption || 'No caption provided'}"</p>
                            <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold border-t border-slate-100 pt-3">
                              <span>Uploaded on {formatDate(p.createdAt)}</span>
                              <span className="font-bold text-violet-600">👍 {p.helpfulVotes} helpful votes</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </div>
      </div>

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

function EmptyContributionsState({ icon, title, text }) {
  return (
    <div className="bg-white rounded-3xl border border-cream-200 p-10 text-center shadow-sm space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl mx-auto mb-2 animate-float">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-slate-900 text-base">{title}</h3>
        <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">{text}</p>
      </div>
    </div>
  )
}
