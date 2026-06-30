import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, TrendingUp, Compass, Heart, History, Sun } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import SectionHeader from '../components/SectionHeader'
import Button from '../components/Button'
import { products, categories, outfitIdeas } from '../data'
import { historyService } from '../services/history'

export default function HomePage() {
  const [history, setHistory] = useState({ viewed: [], preferences: { category: null, occasion: null } })
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    // Load personalization data
    const viewedIds = historyService.getViewed()
    const viewedProducts = viewedIds.map(id => products.find(p => p.id === id)).filter(Boolean)
    const prefs = historyService.getTopPreference()
    setHistory({ viewed: viewedProducts, preferences: prefs })
  }, [])

  // ─── Filtered Lists ────────────────────────────────────────────────────────
  const summerProducts = useMemo(() => products.filter(p => p.seasonal === 'summer'), [])
  const trendingProducts = useMemo(() => products.filter(p => p.trending), [])
  
  const recommendedProducts = useMemo(() => {
    const { category, occasion } = history.preferences
    if (!category && !occasion) return products.slice(0, 4) // Fallback
    return products.filter(p => p.category === category || p.occasion === occasion).slice(0, 8)
  }, [history.preferences])

  return (
    <div className="bg-cream-50 min-h-screen pb-20 pt-16">

      {/* ── HERO — DISCOVERY VIBE ────────────────────────────────────────── */}
      <section className="relative h-[70vh] sm:h-[80vh] flex items-center overflow-hidden bg-gray-950">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1600&q=80"
            alt="Summer Fashion"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
              <Sparkles size={14} /> New Season Drops
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-[1.05]">
              Find your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-pink-400">
                Perfect Vibe
              </span>
            </h1>
            <p className="text-white/70 text-lg mb-10 leading-relaxed max-w-md">
              The AI stylist has curated your personal feed. Explore styles tailored to your unique taste and occasion.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/ai-stylist">
                <Button variant="primary" size="xl" className="shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                  Start Styling
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="secondary" size="xl" className="bg-white/5 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
                  View Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK LINKS / CHIP NAV ────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-cream-50/80 backdrop-blur-xl border-b border-gray-100 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3 whitespace-nowrap scrollbar-hide">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'all' ? 'bg-gray-900 text-white shadow-lg' : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-300'}`}
          >
            All Styles
          </button>
          <button 
            onClick={() => setActiveTab('summer')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'summer' ? 'bg-amber-400 text-amber-950 shadow-lg' : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-300'}`}
          >
            <Sun size={14} /> Summer '26
          </button>
          <button 
            onClick={() => setActiveTab('trending')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'trending' ? 'bg-violet-600 text-white shadow-lg' : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-300'}`}
          >
            <TrendingUp size={14} /> Trending
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">

        {/* ── SECTION: RECENTLY VIEWED ─────────────────────────────────────── */}
        {history.viewed.length > 0 && (
          <section className="animate-fade-in">
            <SectionHeader 
              icon={<History size={18} className="text-gray-400" />}
              title="Continue Browsing"
              subtitle="Pick up right where you left off."
            />
            <div className="scroll-container mt-8 pb-4">
              {history.viewed.map(product => (
                <div key={product.id} className="w-48 sm:w-60 flex-shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── SECTION: RECOMMENDED ─────────────────────────────────────────── */}
        <section>
          <SectionHeader 
            icon={<Compass size={18} className="text-violet-500" />}
            title={history.preferences.category || history.preferences.occasion ? "Picked For Your Style" : "New Recommendations"}
            subtitle={history.preferences.category ? `Custom curation based on your love for ${history.preferences.category} styles.` : "Fresh styles hand-picked for you today."}
          />
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
            {recommendedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-violet-600 hover:text-violet-800 transition-colors group">
              View more personalized picks <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* ── SECTION: SUMMER COLLECTION ───────────────────────────────────── */}
        <section className="bg-amber-50 -mx-4 sm:-mx-8 px-4 sm:px-8 py-16 rounded-[3rem] border border-amber-100">
          <SectionHeader 
            icon={<Sun size={18} className="text-amber-500" />}
            title="Summer Solstice '26"
            subtitle="Explore our curated collection of breezy, lightweight styles for the sunny season."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-10">
            {summerProducts.map(product => (
              <div key={product.id} className="group">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION: OUTFIT IDEAS ────────────────────────────────────────── */}
        <section>
          <SectionHeader 
            icon={<Sparkles size={18} className="text-fuchsia-500" />}
            title="Style Inspo"
            subtitle="Full looks curated by our styling engine."
          />
          <div className="scroll-container mt-10 pb-4">
            {outfitIdeas.map(outfit => (
              <div key={outfit.id} className="w-72 sm:w-80 flex-shrink-0">
                <Link to="/ai-stylist" className="group relative block aspect-[4/5] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                  <img src={outfit.image} alt={outfit.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-[10px] font-bold text-violet-300 uppercase tracking-[0.2em] mb-2 block">{outfit.occasion}</span>
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight">{outfit.title}</h3>
                    <p className="text-white/60 text-sm italic">{outfit.description}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION: TRENDING ────────────────────────────────────────────── */}
        <section>
          <SectionHeader 
            icon={<TrendingUp size={18} className="text-emerald-500" />}
            title="Trending Now"
            subtitle="What's catching everyone's eye this week."
          />
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
            {trendingProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ── CTA: EXPLORE MORE ────────────────────────────────────────────── */}
        <section className="py-20 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-4xl">🌎</div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Still looking for your vibe?</h2>
            <p className="text-gray-500 text-lg">Explore our entire catalogue of over 500+ styles across all categories.</p>
            <div className="pt-4">
              <Link to="/products">
                <Button size="xl" variant="primary" className="px-10">
                  Browse All Products <ArrowRight size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
