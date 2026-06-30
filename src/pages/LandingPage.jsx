import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles, ArrowRight, Wand2, Star, ShoppingBag,
  Zap, Shield, Heart, ChevronDown, Play, Check
} from 'lucide-react'
import { products, categories } from '../data'
import { useAuth } from '../context/AuthContext'

// ─── Animated counter hook ────────────────────────────────────────────────────
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

// ─── Intersection observer hook ───────────────────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

// ─── Testimonials data ────────────────────────────────────────────────────────
const testimonials = [
  { name: 'Priya Sharma', role: 'Fashion Blogger', avatar: '👩‍🦱', text: 'StyleAI completely transformed how I shop. The AI recommendations are scarily accurate — it knows my style better than I do!', rating: 5 },
  { name: 'Arjun Mehta', role: 'Software Engineer', avatar: '👨‍💻', text: 'I used to spend hours figuring out what to wear. Now I just type my occasion and get a complete outfit in seconds. Game changer.', rating: 5 },
  { name: 'Ananya Krishnan', role: 'College Student', avatar: '👩‍🎓', text: 'Affordable, trendy, and the AI stylist is amazing! Found my entire college fest look here. Highly recommend to every Gen-Z shopper.', rating: 5 },
  { name: 'Riya Patel', role: 'Marketing Lead', avatar: '👩‍💼', text: 'The outfit suggestions for my corporate presentations have been spot on every single time. Worth every rupee!', rating: 5 },
]

// ─── Features data ────────────────────────────────────────────────────────────
const features = [
  { icon: <Wand2 size={22} />, title: 'AI Outfit Generator', desc: 'Describe your occasion and get a complete head-to-toe outfit curated by OpenAI in seconds.', color: 'from-violet-500 to-purple-600' },
  { icon: <Zap size={22} />, title: 'Instant Recommendations', desc: 'Real-time product matching — AI keywords sync directly with our catalog for relevant picks.', color: 'from-amber-400 to-orange-500' },
  { icon: <Shield size={22} />, title: 'Secure Checkout', desc: 'JWT-secured accounts, encrypted transactions, and trusted payment partners.', color: 'from-emerald-400 to-teal-500' },
  { icon: <Heart size={22} />, title: 'Curated Collections', desc: 'Every piece is hand-picked and trend-verified by fashion editors before it goes live.', color: 'from-pink-400 to-rose-500' },
]

// ─── Floating badge component ────────────────────────────────────────────────
function FloatingBadge({ children, className }) {
  return (
    <div className={`absolute bg-white rounded-2xl shadow-2xl border border-gray-100 px-4 py-3 flex items-center gap-3 ${className}`}>
      {children}
    </div>
  )
}

export default function LandingPage() {
  const { isLoggedIn, user } = useAuth()
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [statsRef, statsInView] = useInView()

  const shoppers = useCountUp(50000, 2000, statsInView)
  const styles = useCountUp(10000, 2000, statsInView)
  const rating = useCountUp(49, 2000, statsInView)

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════ */}
      {/* HERO                                                       */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center bg-[#07070d] overflow-hidden pt-16">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
          <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-purple-500/15 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full bg-pink-500/10 blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — copy */}
            <div className={`transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/15 border border-violet-400/30 text-violet-300 text-sm font-medium mb-8 backdrop-blur-sm">
                <Sparkles size={14} className="text-violet-400" />
                Powered by OpenAI GPT
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse" />
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
                Dress{' '}
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-pink-400">
                    Smarter
                  </span>
                  <svg className="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none" preserveAspectRatio="none">
                    <path d="M0 4 Q50 1 100 4 Q150 7 200 4" stroke="url(#grad)" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#ec4899" /></linearGradient></defs>
                  </svg>
                </span>
                {' '}with AI
              </h1>

              <p className="text-base sm:text-lg text-white/55 mb-10 max-w-md leading-relaxed">
                StyleAI is your personal fashion assistant — tell us your occasion,
                and we'll generate a complete outfit with matching products from our curated catalog.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-12">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/ai-stylist"
                      id="hero-ai-stylist-cta"
                      className="group flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-base hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <Wand2 size={18} />
                      Try AI Stylist
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/products"
                      id="hero-shop-cta"
                      className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold text-base hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      <ShoppingBag size={18} />
                      Shop Now
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      id="hero-signup-cta"
                      className="group flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-base hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <Sparkles size={18} />
                      Get Started Free
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/products"
                      id="hero-browse-cta"
                      className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold text-base hover:bg-white/10 transition-all duration-300"
                    >
                      Browse Styles
                    </Link>
                  </>
                )}
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-5 text-sm text-white/45">
                {['No credit card required', 'Free forever plan', 'Cancel anytime'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <Check size={13} className="text-emerald-400" /> {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — visual */}
            <div className={`relative hidden lg:block transition-all duration-1000 delay-300 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* Main image */}
              <div className="relative w-full max-w-md mx-auto">
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80"
                    alt="Fashion model"
                    className="w-full h-[560px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 via-transparent to-transparent" />
                </div>
              </div>

              {/* Glow behind image */}
              <div className="absolute inset-0 -z-10 bg-violet-500/10 blur-3xl rounded-full" />
            </div>

          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-xs animate-bounce">
          <span className="tracking-widest uppercase text-[10px]">Scroll</span>
          <ChevronDown size={16} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* STATS                                                      */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section ref={statsRef} className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: shoppers.toLocaleString() + '+', label: 'Happy Shoppers', icon: '🛍️' },
              { value: styles.toLocaleString() + '+', label: 'Curated Styles', icon: '✨' },
              { value: (rating / 10).toFixed(1) + '★', label: 'Average Rating', icon: '⭐' },
              { value: '100%', label: 'AI-Powered', icon: '🤖' },
            ].map((s) => (
              <div key={s.label} className="text-center group">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">{s.value}</div>
                <div className="text-sm text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* HOW IT WORKS                                               */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-violet-500 mb-4">
              <Zap size={12} /> How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Three steps to your{' '}
              <span style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 50%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>perfect look</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">From occasion to outfit in under 10 seconds. No styling expertise needed.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-violet-200 via-purple-200 to-pink-200" />

            {[
              { step: '01', emoji: '📝', title: 'Describe Your Occasion', desc: 'Type anything — "beach party in Goa", "job interview", "sangeet night" — our AI understands context.' },
              { step: '02', emoji: '🤖', title: 'AI Builds Your Outfit', desc: 'GPT-powered engine crafts a detailed outfit suggestion with top, bottom, footwear, and style notes.' },
              { step: '03', emoji: '🛍️', title: 'Shop the Exact Looks', desc: 'We match AI keywords to real products in our catalog so you can buy the exact recommended pieces.' },
            ].map(({ step, emoji, title, desc }) => (
              <div
                key={step}
                className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  {emoji}
                </div>
                <span className="text-xs font-bold text-violet-400 tracking-widest uppercase">Step {step}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-2 mb-3">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                <div className="absolute top-6 right-6 text-4xl font-black text-gray-50 select-none">{step}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to={isLoggedIn ? '/ai-stylist' : '/login'}
              id="hiw-cta"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <Wand2 size={18} /> Try It Now — It's Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* FEATURES GRID                                              */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-[#0a0a0f] relative overflow-hidden">
        {/* Subtle bg glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-violet-900/20 blur-[100px] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-violet-400 mb-4">
              <Sparkles size={12} /> Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Everything you need to shop{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-300">confidently</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon, title, desc, color }) => (
              <div
                key={title}
                className="bg-white/5 border border-white/10 rounded-3xl p-7 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform`}>
                  {icon}
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* CATEGORIES SHOWCASE                                        */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">
              Explore
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-gray-400 mt-3 text-sm">Find your style across every vibe and occasion.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.name}`}
                id={`landing-cat-${cat.name.toLowerCase()}`}
                className="group relative rounded-3xl overflow-hidden aspect-[3/4] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="text-white font-bold text-xl leading-tight">{cat.name}</h3>
                  <p className="text-white/50 text-xs mt-1">{cat.count} styles</p>
                  <div className="mt-3 flex items-center gap-1 text-violet-300 text-xs font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                    Shop now <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* STYLE REELS & LOOKS                                        */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">
              📱 Style Reels
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Curated Trend Stories
            </h2>
            <p className="text-gray-500 mt-2 text-sm font-medium">Tap to watch and shop direct fits styled by our community.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { id: 1, name: 'Lavender Blazer Vibe', handle: '@priya_s', img: '/images/products/lavender_blazer.png', link: '/products/1', views: '12K views' },
              { id: 2, name: 'Gen-Z Street Comfort', handle: '@arjun_m', img: '/images/products/street_hoodie.png', link: '/products/2', views: '24K views' },
              { id: 3, name: 'Summer Solstice Dress', handle: '@ananya_k', img: '/images/products/floral_sundress.png', link: '/products/3', views: '18K views' },
              { id: 4, name: 'Gold Sequin Night Out', handle: '@riya_p', img: '/images/products/sequin_gown.png', link: '/products/5', views: '45K views' }
            ].map((reel) => (
              <div key={reel.id} className="group relative rounded-[2rem] overflow-hidden aspect-[9/16] shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-gray-950">
                <img src={reel.img} alt={reel.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-90 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-violet-600 group-hover:border-violet-400 transition-all duration-300 shadow">
                    <Play size={18} className="text-white fill-white ml-0.5" />
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 space-y-3 z-10">
                  <div>
                    <span className="text-[10px] text-violet-300 font-bold tracking-wide block">{reel.handle}</span>
                    <h3 className="text-white font-extrabold text-sm leading-snug line-clamp-1">{reel.name}</h3>
                    <span className="text-[9px] text-white/50">{reel.views}</span>
                  </div>
                  <Link
                    to={reel.link}
                    className="w-full py-2 bg-white hover:bg-violet-600 hover:text-white text-gray-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all"
                  >
                    Shop Fit <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TRENDING PRODUCTS                                          */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">
                🔥 Trending Now
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">What's Hot This Week</h2>
            </div>
            <Link to="/products" id="landing-see-all" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors group">
              See All <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.filter(p => p.trending).map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                id={`landing-product-${product.id}`}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-400"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-violet-500 text-white text-[10px] font-bold">🔥 Trending</span>
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart size={14} className="text-gray-600" />
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-violet-500 font-semibold mb-1">{product.category} · {product.occasion}</p>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 group-hover:text-violet-700 transition-colors">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through ml-1.5">₹{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                      <Star size={11} fill="currentColor" />
                      <span className="text-gray-600 font-medium">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TESTIMONIALS                                               */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">
              ❤️ Loved By Shoppers
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              What our community says
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map(({ name, role, avatar, text, rating: r }) => (
              <div
                key={name}
                className="bg-gray-50 rounded-3xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex text-amber-400 gap-0.5 mb-4">
                  {Array.from({ length: r }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-violet-100 flex items-center justify-center text-xl">{avatar}</div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{name}</div>
                    <div className="text-xs text-gray-400">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* CTA BANNER                                                 */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #13082a 0%, #1a0a3a 40%, #180d2e 70%, #0d0818 100%)' }}>
        {/* Layered glow orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-violet-600/25 blur-[130px]" />
          <div className="absolute -top-20 right-1/4 w-72 h-72 rounded-full bg-purple-500/15 blur-[80px]" />
          <div className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full bg-fuchsia-500/10 blur-[80px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight tracking-tight">
            Ready to dress smarter?
          </h2>
          <p className="text-white/55 text-lg mb-10 max-w-xl mx-auto">
            Join 50,000+ fashion-forward shoppers who let AI handle their outfit decisions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/ai-stylist"
                  id="cta-ai-stylist"
                  className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-base hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all hover:-translate-y-0.5"
                >
                  <Wand2 size={18} /> Open AI Stylist
                </Link>
                <Link
                  to="/products"
                  id="cta-shop"
                  className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white/5 border border-white/15 text-white font-semibold text-base hover:bg-white/10 transition-all"
                >
                  <ShoppingBag size={18} /> Browse Collection
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  id="cta-signup"
                  className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-base hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all hover:-translate-y-0.5"
                >
                  <Sparkles size={18} /> Create Free Account
                </Link>
                <Link
                  to="/products"
                  id="cta-browse"
                  className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white/5 border border-white/15 text-white font-semibold text-base hover:bg-white/10 transition-all"
                >
                  Browse First
                </Link>
              </>
            )}
          </div>

          <p className="mt-6 text-white/40 text-sm">No credit card required · Free AI outfit generator</p>
        </div>
      </section>

    </div>
  )
}
