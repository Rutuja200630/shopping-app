import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Send, User, AlertCircle, ArrowRight, X } from 'lucide-react';
import { getStylistChatResponse, modifyOutfitLook, getUserPreferences, updateUserPreferences } from '../services/aiStylistService';
import { historyService } from '../services/history';
import OutfitLookCard from '../components/OutfitLookCard';

const SUGGESTION_CHIPS = [
  'Wedding Outfit',
  'Office Wear',
  'Party Outfit',
  'Vacation Looks',
  'Traditional Wear',
  'Casual Wear'
];

const WELCOME_MESSAGE = {
  id: 'welcome-greeting',
  role: 'assistant',
  sender: 'ai',
  response: `👋 Hello! I'm your AI Fashion Stylist.

I'm here to help you discover outfits that match your style, occasion, and budget.

To get the best recommendations, simply tell me:

* 🎉 The occasion (Wedding, Office, Party, Vacation, Casual, Festival, Date Night, etc.)
* 💰 Your budget or price range
* 👩 Your preferred gender/style (optional)
* 🎨 Any favorite colors or brands (optional)
* 👠 Any specific preferences, such as sneakers, heels, ethnic wear, or western wear (optional)

I'll curate 2–3 complete outfit looks with matching footwear, accessories, and layers tailored just for you.`,
  text: `👋 Hello! I'm your AI Fashion Stylist.

I'm here to help you discover outfits that match your style, occasion, and budget.

To get the best recommendations, simply tell me:

* 🎉 The occasion (Wedding, Office, Party, Vacation, Casual, Festival, Date Night, etc.)
* 💰 Your budget or price range
* 👩 Your preferred gender/style (optional)
* 🎨 Any favorite colors or brands (optional)
* 👠 Any specific preferences, such as sneakers, heels, ethnic wear, or western wear (optional)

I'll curate 2–3 complete outfit looks with matching footwear, accessories, and layers tailored just for you.`,
  looks: [],
  products: [],
  fallback: false,
  isWelcome: true
};

function OutfitLookSkeletonCard() {
  return (
    <div className="bg-white rounded-[2rem] border border-purple-50 p-6 shadow-md space-y-5 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-purple-50">
        <div className="h-5 bg-slate-200 rounded-lg w-1/3" />
        <div className="h-8 bg-slate-200 rounded-xl w-20" />
      </div>
      {/* Note Skeleton */}
      <div className="h-16 bg-slate-100 rounded-2xl w-full" />
      {/* 4 slots vertical (matching 2x2 final layout) */}
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col h-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] p-3.5 justify-between space-y-3 min-h-[280px]">
            <div className="w-full aspect-[3/4] bg-slate-200 rounded-xl" />
            <div className="space-y-1.5 flex-grow mt-2">
              <div className="h-2.5 bg-slate-200 rounded-md w-1/2" />
              <div className="h-3.5 bg-slate-200 rounded-md w-full animate-pulse" />
              <div className="h-3 bg-slate-200 rounded-md w-2/3" />
            </div>
            <div className="h-8 bg-slate-200 rounded-xl w-full mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AIStylistPage() {
  const location = useLocation();
  const hasTriggeredRef = useRef(false);

  const [messages, setMessages] = useState(() => {
    try {
      const stored = sessionStorage.getItem('styleai_stylist_messages');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(msg => {
            const isAssistant = msg.role === 'assistant' || msg.role === 'ai' || msg.sender === 'ai';
            if (isAssistant) {
              return {
                id: msg.id || Date.now(),
                role: 'assistant',
                sender: 'ai',
                response: msg.response || msg.text || '',
                text: msg.response || msg.text || '',
                looks: Array.isArray(msg.looks) ? msg.looks : [],
                products: Array.isArray(msg.products) ? msg.products : [],
                fallback: Boolean(msg.fallback),
                suggestedReplies: Array.isArray(msg.suggestedReplies) ? msg.suggestedReplies : [],
                followUp: Boolean(msg.followUp)
              };
            }
            return {
              id: msg.id || Date.now(),
              role: msg.role || msg.sender || 'user',
              sender: msg.sender || msg.role || 'user',
              response: msg.response || msg.text || '',
              text: msg.response || msg.text || ''
            };
          });
        }
      }
    } catch (e) {
      console.error('Error hydrating messages:', e);
    }
    return [WELCOME_MESSAGE];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Outfit modification states
  const [loadingLooks, setLoadingLooks] = useState({});
  const [replaceModalOpen, setReplaceModalOpen] = useState(false);
  const [activeLook, setActiveLook] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('footwear');
  const [selectedAction, setSelectedAction] = useState('replace');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [engineFallbackNotice, setEngineFallbackNotice] = useState('');
  const [preferences, setPreferences] = useState(null);

  const fetchPreferences = async () => {
    if (!localStorage.getItem('styleai_token')) return;
    try {
      const data = await getUserPreferences();
      if (data.success && data.preferences) {
        setPreferences(data.preferences);
      }
    } catch (err) {
      console.error('Error fetching preferences:', err);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  const handleRemoveChip = async (category, value) => {
    try {
      const data = await updateUserPreferences({
        removeCategory: category,
        removeValue: value
      });
      if (data.success && data.preferences) {
        setPreferences(data.preferences);
      }
    } catch (err) {
      console.error('Error removing chip:', err);
    }
  };

  // Persist a unique sessionId across turns in sessionStorage
  const [sessionId] = useState(() => {
    const existing = sessionStorage.getItem('styleai_stylist_session');
    if (existing) return existing;
    const newId = 'session_' + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('styleai_stylist_session', newId);
    return newId;
  });

  // Dedicated container references for isolated scrolling
  const chatContainerRef = useRef(null);
  const bottomMessageRef = useRef(null);
  const prevMessagesCountRef = useRef(messages.length);

  // 1. Mount hook - Lock window auto scrolling & restore to top
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // 2. Chat update hook - Scroll chat container only when new AI turn is received
  useEffect(() => {
    if (messages.length > prevMessagesCountRef.current) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg && lastMsg.role === 'assistant') {
        bottomMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
    prevMessagesCountRef.current = messages.length;
  }, [messages]);

  // Scroll to bottom of chat list on loading state
  useEffect(() => {
    if (loading) {
      bottomMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [loading]);

  const normalizeAssistantMessage = (msg) => {
    if (!msg) return msg;
    const isAssistant = msg.role === 'assistant' || msg.role === 'ai' || msg.sender === 'ai';
    if (!isAssistant) return msg;
    return {
      id: msg.id || Date.now(),
      role: 'assistant',
      sender: 'ai',
      response: msg.response || msg.text || '',
      text: msg.response || msg.text || '',
      looks: Array.isArray(msg.looks) ? msg.looks : [],
      products: Array.isArray(msg.products) ? msg.products : [],
      fallback: Boolean(msg.fallback),
      suggestedReplies: Array.isArray(msg.suggestedReplies) ? msg.suggestedReplies : [],
      followUp: Boolean(msg.followUp)
    };
  };

  const getFallbackNotice = (message) => {
    if (!message?.fallback) return null;

    const hasLooks = Array.isArray(message.looks) && message.looks.length > 0;
    const hasProducts = Array.isArray(message.products) && message.products.length > 0;

    if (hasLooks) {
      return {
        type: 'info',
        text: 'Showing curated looks from your catalog.'
      };
    }

    if (hasProducts) {
      return {
        type: 'warning',
        text: "AI styling is currently limited, so we're showing catalog-based recommendations."
      };
    }

    return null;
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    setInput('');
    setError('');

    // Append user query message bubble
    const userMsg = { id: Date.now(), role: 'user', response: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await getStylistChatResponse(text, sessionId);
      
      if (data.success) {
        const rawAiMsg = {
          id: Date.now() + 1,
          role: 'assistant',
          response: data.response || '',
          looks: data.looks,
          products: data.products,
          fallback: data.fallback,
          suggestedReplies: data.suggestedReplies,
          followUp: data.followUp
        };

        const aiMsg = normalizeAssistantMessage(rawAiMsg);
        setMessages((prev) => {
          const next = [...prev, aiMsg];
          // Cache messages inside session storage to survive refreshes
          sessionStorage.setItem('styleai_stylist_messages', JSON.stringify(next));
          return next;
        });

        // Warn users only if matches were expected but catalog yields zero items (greeting bypassed)
        const hasLooks = aiMsg.looks.length > 0;
        const hasProducts = aiMsg.products.length > 0;
        if (!hasLooks && !hasProducts && text.toLowerCase() !== 'hi') {
          setError('I found matches, but they are currently out of stock. Try changing your budget or occasion!');
        }

        // Refresh learned memory chips list dynamically
        fetchPreferences();
      } else {
        setError('Sorry, I couldn\'t find matching products. Try changing your budget or occasion.');
      }
    } catch (err) {
      console.error(err);
      setError('Sorry, I couldn\'t find matching products. Try changing your budget or occasion.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.styleProduct && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      const p = location.state.styleProduct;
      sessionStorage.removeItem('styleai_stylist_messages');
      setMessages([WELCOME_MESSAGE]);
      handleSendMessage(`Style coordinates for ${p.name}`);
    }
  }, [location.state]);

  // Handle slot/item replacement or removal actions
  const handleReplaceItemSubmit = async (e) => {
    e.preventDefault();
    if (!activeLook) return;

    const lookId = activeLook.id;
    // Don't run multiple edits for the same look card concurrently
    if (loadingLooks[lookId]) return;

    setReplaceModalOpen(false);
    setLoadingLooks(prev => ({ ...prev, [lookId]: true }));
    setError('');
    setEngineFallbackNotice('');

    try {
      const data = await modifyOutfitLook({
        sessionId,
        lookId,
        action: selectedAction,
        slot: selectedSlot,
        query: selectedAction === 'replace' ? replaceQuery : ''
      });

      if (data.success && data.look) {
        // Update specific look immutably
        setMessages(prev => prev.map(msg => {
          if (msg.role === 'assistant' || msg.sender === 'ai') {
            if (msg.looks && msg.looks.some(l => l.id === lookId)) {
              return {
                ...msg,
                looks: msg.looks.map(l => l.id === lookId ? data.look : l)
              };
            }
          }
          return msg;
        }));

        if (data.fallback) {
          setEngineFallbackNotice('Using our catalog styling engine.');
          setTimeout(() => setEngineFallbackNotice(''), 4000);
        }

        // Refresh learned memory chips list dynamically
        fetchPreferences();
      } else {
        setError('Failed to update look item. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update look item. Please try again.');
    } finally {
      setLoadingLooks(prev => ({ ...prev, [lookId]: false }));
    }
  };

  // Handle entire look regeneration
  const handleRegenerateLook = async (lookId) => {
    if (loadingLooks[lookId]) return;

    setLoadingLooks(prev => ({ ...prev, [lookId]: true }));
    setError('');
    setEngineFallbackNotice('');

    try {
      const data = await modifyOutfitLook({
        sessionId,
        lookId,
        action: 'regenerate'
      });

      if (data.success && data.look) {
        setMessages(prev => prev.map(msg => {
          if (msg.role === 'assistant' || msg.sender === 'ai') {
            if (msg.looks && msg.looks.some(l => l.id === lookId)) {
              return {
                ...msg,
                looks: msg.looks.map(l => l.id === lookId ? data.look : l)
              };
            }
          }
          return msg;
        }));

        if (data.fallback) {
          setEngineFallbackNotice('Using our catalog styling engine.');
          setTimeout(() => setEngineFallbackNotice(''), 4000);
        }
      } else {
        setError('Failed to regenerate outfit look. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to regenerate outfit look. Please try again.');
    } finally {
      setLoadingLooks(prev => ({ ...prev, [lookId]: false }));
    }
  };

  const handleOpenReplaceModal = (look) => {
    setActiveLook(look);
    setSelectedSlot('footwear');
    setSelectedAction('replace');
    setReplaceQuery('');
    setReplaceModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleChipClick = (chipText) => {
    if (loading) return;
    handleSendMessage(chipText);
  };

  const handleClearChat = () => {
    setMessages([]);
    setError('');
    sessionStorage.removeItem('styleai_stylist_messages');
    // Clear session memory on frontend
    const newId = 'session_' + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('styleai_stylist_session', newId);
    window.location.reload(); // Hard reload to clear Map state on backend for this session
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col pt-16 bg-gradient-to-b from-[#f5f3ff] via-[#fafaf9] to-white">
      
      {/* ── Fixed Header ── */}
      <div className="bg-white/90 backdrop-blur-md border-b border-purple-100/60 py-4 flex-shrink-0 z-30 shadow-sm">
        <div className="max-w-[1500px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Sparkles size={20} className="text-white animate-pulse" />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                AI Fashion Stylist
              </h1>
              <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" /> Online · Active Catalog Matching
              </span>
            </div>
          </div>
          <button
            onClick={handleClearChat}
            aria-label="Reset stylist chat conversation and memory history"
            className="px-4 py-2 text-xs text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-100 rounded-xl font-bold transition-all hover:bg-rose-50/30"
          >
            Reset Chat & Memory
          </button>
        </div>
      </div>

      {/* ── Learned Preferences Banner ── */}
      {preferences && (
        (() => {
          const hasLikes =
            (preferences.likes?.brands?.length || 0) +
            (preferences.likes?.colors?.length || 0) +
            (preferences.likes?.styles?.length || 0) +
            (preferences.likes?.footwear?.length || 0) +
            (preferences.likes?.accessories?.length || 0) > 0;
          const hasDislikes =
            (preferences.dislikes?.brands?.length || 0) +
            (preferences.dislikes?.colors?.length || 0) > 0;

          if (!hasLikes && !hasDislikes) return null;

          return (
            <div className="bg-purple-50/60 border-b border-purple-100/40 px-6 py-2.5 flex-shrink-0 z-20 overflow-x-auto no-scrollbar">
              <div className="max-w-[1500px] mx-auto flex items-center gap-3 whitespace-nowrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 flex items-center gap-1">
                  <Sparkles size={11} className="text-purple-600 animate-pulse animate-duration-1000" />
                  I've learned your style:
                </span>
                <div className="flex gap-2 items-center overflow-x-auto no-scrollbar py-0.5">
                  {preferences.likes?.brands?.map(b => (
                    <span key={`like-brand-${b}`} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-purple-100 text-slate-700 rounded-full text-[11px] font-bold shadow-sm">
                      ❤️ {b}
                      <button type="button" onClick={() => handleRemoveChip('favoriteBrands', b)} className="text-slate-400 hover:text-slate-600 ml-0.5 transition-colors">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  {preferences.likes?.colors?.map(c => (
                    <span key={`like-color-${c}`} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-purple-100 text-slate-700 rounded-full text-[11px] font-bold shadow-sm">
                      ❤️ {c}
                      <button type="button" onClick={() => handleRemoveChip('favoriteColors', c)} className="text-slate-400 hover:text-slate-600 ml-0.5 transition-colors">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  {preferences.likes?.styles?.map(s => (
                    <span key={`like-style-${s}`} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-purple-100 text-slate-700 rounded-full text-[11px] font-bold shadow-sm">
                      ❤️ {s}
                      <button type="button" onClick={() => handleRemoveChip('preferredStyles', s)} className="text-slate-400 hover:text-slate-600 ml-0.5 transition-colors">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  {preferences.likes?.footwear?.map(f => (
                    <span key={`like-footwear-${f}`} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-purple-100 text-slate-700 rounded-full text-[11px] font-bold shadow-sm">
                      ❤️ {f}
                      <button type="button" onClick={() => handleRemoveChip('preferredFootwear', f)} className="text-slate-400 hover:text-slate-600 ml-0.5 transition-colors">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  {preferences.likes?.accessories?.map(a => (
                    <span key={`like-acc-${a}`} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-purple-100 text-slate-700 rounded-full text-[11px] font-bold shadow-sm">
                      ❤️ {a}
                      <button type="button" onClick={() => handleRemoveChip('preferredAccessories', a)} className="text-slate-400 hover:text-slate-600 ml-0.5 transition-colors">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  {preferences.dislikes?.brands?.map(b => (
                    <span key={`dislike-brand-${b}`} className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 border border-rose-100 text-rose-700 rounded-full text-[11px] font-bold shadow-sm">
                      🚫 {b}
                      <button type="button" onClick={() => handleRemoveChip('dislikedBrands', b)} className="text-rose-400 hover:text-rose-600 ml-0.5 transition-colors">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  {preferences.dislikes?.colors?.map(c => (
                    <span key={`dislike-color-${c}`} className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 border border-rose-100 text-rose-700 rounded-full text-[11px] font-bold shadow-sm">
                      🚫 {c}
                      <button type="button" onClick={() => handleRemoveChip('dislikedColors', c)} className="text-rose-400 hover:text-rose-600 ml-0.5 transition-colors">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })()
      )}

      {/* ── Scrollable Chat Messages Panel ── */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-start">
        <div className="max-w-[1500px] w-full mx-auto flex-grow flex flex-col justify-start">
          {/* Conversation Bubbles */}
          <div className="space-y-6 w-full">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user' || msg.sender === 'user';
              const isFirstWelcome = msg.id === 'welcome-greeting' && messages.length === 1;
              const isLastMessage = index === messages.length - 1;

              return (
                <div key={msg.id} className="space-y-4">
                  <div
                    className={`flex gap-3 max-w-[90%] md:max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-sm ${
                      isUser ? 'bg-slate-900 text-white' : 'bg-gradient-to-tr from-violet-600 to-purple-500 text-white'
                    }`}>
                      {isUser ? <User size={14} /> : <Sparkles size={14} />}
                    </div>

                    <div className={`p-5 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-sm border w-full ${
                      isUser 
                        ? 'bg-slate-900 text-white border-slate-950 rounded-tr-none' 
                        : 'bg-white/80 backdrop-blur-md border-purple-50/60 text-slate-700 rounded-tl-none'
                    }`}>
                    {/* Welcome card – rich structured layout */}
                    {msg.isWelcome ? (
                      <div className="space-y-3">
                        <p className="font-semibold text-slate-800 text-sm">
                          👋 Hi! I'm your <span className="text-violet-600 font-bold">AI Fashion Stylist</span>.
                        </p>
                        <p className="text-slate-500 text-xs leading-relaxed">
                          I'll help you discover complete outfits for any occasion — from wedding looks to office wear and everything in between.
                        </p>
                        <div className="bg-violet-50/60 border border-violet-100 rounded-2xl p-3.5 space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-violet-600">Tell me about yourself</p>
                          <ul className="space-y-1.5 text-xs text-slate-600">
                            <li className="flex items-start gap-2"><span className="text-base leading-none">🎉</span><span>The <strong>occasion</strong> — Wedding, Office, Party, Vacation, Festival, Date Night…</span></li>
                            <li className="flex items-start gap-2"><span className="text-base leading-none">💰</span><span>Your <strong>budget</strong> or price range</span></li>
                            <li className="flex items-start gap-2"><span className="text-base leading-none">🎨</span><span>Any <strong>favourite colours or brands</strong> (optional)</span></li>
                            <li className="flex items-start gap-2"><span className="text-base leading-none">👠</span><span>Any <strong>style preferences</strong> — sneakers, heels, ethnic wear, western wear (optional)</span></li>
                          </ul>
                        </div>
                        <p className="text-[11px] text-slate-400 italic">I'll curate 2–3 complete outfit looks with matching footwear and accessories.</p>
                      </div>
                    ) : (
                      <p className="font-semibold whitespace-pre-wrap">{msg.response || msg.text}</p>
                    )}

                      {/* Suggested reply chips immediately below the latest assistant message */}
                      {isLastMessage && !isUser && msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 animate-fade-in">
                          {msg.suggestedReplies.map((reply) => (
                            <button
                              key={reply}
                              type="button"
                              onClick={() => handleChipClick(reply)}
                              className="px-3.5 py-1.5 bg-purple-50 hover:bg-violet-600 border border-purple-100 hover:border-violet-600 text-purple-700 hover:text-white rounded-full text-[11px] font-bold shadow-sm transition-all duration-200 active:scale-95"
                            >
                              {reply}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Inline Fallback Notice */}
                      {!isUser && (() => {
                        const notice = getFallbackNotice(msg);
                        if (!notice) return null;
                        return (
                          <div className={`mt-3 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-bold ${
                            notice.type === 'info'
                              ? 'bg-slate-50 border-slate-200 text-slate-500 animate-fade-in'
                              : 'bg-amber-50/70 border-amber-100 text-amber-700 animate-fade-in'
                          }`}>
                            <AlertCircle size={13} className="flex-shrink-0" />
                            <span>{notice.text}</span>
                          </div>
                        );
                      })()}

                      {/* Case 1: Structured looks exist */}
                      {!isUser && msg.looks && msg.looks.length > 0 && (
                        <div className="mt-6 space-y-4 border-t border-purple-100/40 pt-5">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Styled Looks For You</span>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                            {msg.looks.map((look) => (
                              <OutfitLookCard 
                                key={look.id} 
                                look={look} 
                                isLoading={Boolean(loadingLooks[look.id])}
                                onReplaceItem={handleOpenReplaceModal}
                                onRegenerateLook={handleRegenerateLook}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Case 2: No looks, but legacy products exist */}
                      {!isUser && (!msg.looks || msg.looks.length === 0) && msg.products && msg.products.length > 0 && (
                        <div className="mt-6 space-y-4 border-t border-purple-100/40 pt-5">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">🛍️ Match Coordinates</span>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                            {msg.products.map((p) => (
                              <div key={p._id} className="bg-white rounded-2xl border border-cream-200 p-3 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group/item">
                                <div className="w-full aspect-[3/4] bg-cream-50 overflow-hidden flex-shrink-0 border border-slate-100 rounded-xl">
                                  <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518'} alt={p.name} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between mt-3 w-full">
                                    <div className="space-y-1">
                                      <h4 className="font-extrabold text-[11px] text-slate-800 line-clamp-2 block capitalize">{p.name}</h4>
                                      <span className="text-[9px] text-slate-400 font-bold block">{p.brand}</span>
                                    </div>
                                    <div className="mt-3 pt-2 border-t border-slate-50 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[8px] font-bold text-slate-400 uppercase">Price</span>
                                        <span className="font-black text-slate-900 text-xs">₹{p.price.toLocaleString()}</span>
                                      </div>
                                      <Link
                                        to={`/products/${p.slug}`}
                                        onClick={() => {
                                          if (historyService?.saveView) historyService.saveView(p);
                                        }}
                                        className="w-full py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black tracking-wider uppercase text-center block hover:bg-violet-600 transition-colors"
                                      >
                                        View Product
                                      </Link>
                                    </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Suggestion Chips immediately below welcome greeting (aligned with bubble start) */}
                  {isFirstWelcome && (
                    <div className="ml-12 animate-fade-in max-w-[90%] md:max-w-[85%] space-y-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block pl-1">
                        Try asking or select a query
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {SUGGESTION_CHIPS.map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => handleChipClick(chip)}
                            aria-label={`Send suggested query: ${chip}`}
                            className="px-4 py-2.5 bg-white hover:bg-violet-50/50 border border-purple-100 hover:border-violet-300 text-slate-700 hover:text-violet-600 rounded-full text-xs font-bold shadow-sm hover:shadow transition-all duration-200 active:scale-95 animate-fade-in"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Shimmer/Pulse Skeleton Look Loader (Replaces Typing dots) */}
            {loading && (
              <div className="flex gap-3 mr-auto items-start max-w-[90%] md:max-w-[85%] animate-fade-in">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-purple-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles size={14} className="animate-spin" />
                </div>
                <div className="p-5 bg-white/80 backdrop-blur-md border border-purple-50 rounded-3xl rounded-tl-none space-y-4 w-full">
                  <div className="h-4 bg-slate-200 rounded-md w-1/4 animate-pulse" />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                    <OutfitLookSkeletonCard />
                    <OutfitLookSkeletonCard />
                  </div>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-xs font-semibold max-w-md mx-auto shadow-sm animate-shake bg-rose-50 border-rose-200 text-rose-600">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div ref={bottomMessageRef} />
          </div>
        </div>
      </div>

      {/* ── Fixed Bottom Input Area Panel ── */}
      <div className="bg-gradient-to-t from-white via-white to-transparent pb-6 pt-3 flex-shrink-0 border-t border-purple-50/50 z-20">
        <div className="max-w-4xl w-full mx-auto px-6">
          <form onSubmit={handleSubmit} className="bg-white border border-purple-100 p-2 rounded-full shadow-lg backdrop-blur-md flex gap-2 items-center hover:border-violet-200 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all duration-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Ask about looks (e.g. Wedding outfits under 5000, vacation looks)..."
              className="flex-grow pl-5 bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message to styling assistant"
              className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-violet-600 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 flex-shrink-0"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>

      {/* ── Floating Engine Fallback Toast ── */}
      {engineFallbackNotice && (
        <div className="fixed bottom-24 right-6 z-50 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-black uppercase tracking-widest px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-1.5 animate-slide-up">
          <AlertCircle size={14} className="stroke-amber-600 animate-pulse" />
          <span>{engineFallbackNotice}</span>
        </div>
      )}

      {/* ── Replace Item / Custom Edit Modal ── */}
      {replaceModalOpen && activeLook && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-purple-100 space-y-4 relative animate-slide-up">
            <button
              onClick={() => setReplaceModalOpen(false)}
              aria-label="Close edit window"
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={16} className="text-slate-400 hover:text-slate-600" />
            </button>

            <div>
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide">Modify Outfit</h3>
              <p className="text-[10px] text-slate-400 font-medium">Fine-tune styling for: {activeLook.title}</p>
            </div>

            <form onSubmit={handleReplaceItemSubmit} className="space-y-4">
              {/* Select Slot */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Choose Item Type</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: 'main', lbl: 'Main Outfit' },
                    { val: 'footwear', lbl: 'Footwear' },
                    { val: 'accessory', lbl: 'Accessory' },
                    { val: 'layer', lbl: 'Layer' }
                  ].map(slot => (
                    <button
                      key={slot.val}
                      type="button"
                      onClick={() => setSelectedSlot(slot.val)}
                      className={`py-2 px-3 rounded-xl border text-center text-xs font-bold transition-all ${
                        selectedSlot === slot.val
                          ? 'border-violet-600 bg-violet-50/50 text-violet-600'
                          : 'border-slate-200 hover:border-slate-300 text-slate-500'
                      }`}
                    >
                      {slot.lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Action */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Choose Action</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { val: 'replace', lbl: 'Replace' },
                    { val: 'upgrade', lbl: 'Upgrade' },
                    { val: 'remove', lbl: 'Remove' }
                  ].map(act => (
                    <button
                      key={act.val}
                      type="button"
                      onClick={() => setSelectedAction(act.val)}
                      className={`py-1.5 rounded-lg border text-center text-[10px] font-black uppercase tracking-wider transition-all ${
                        selectedAction === act.val
                          ? 'border-violet-600 bg-violet-600 text-white'
                          : 'border-slate-200 hover:border-slate-300 text-slate-500'
                      }`}
                    >
                      {act.lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Query box (only if action is replace) */}
              {selectedAction === 'replace' && (
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Styling Prompt</span>
                  <input
                    type="text"
                    required
                    value={replaceQuery}
                    onChange={(e) => setReplaceQuery(e.target.value)}
                    placeholder="e.g. white sneakers, silk wedding shawl"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 outline-none text-xs text-slate-800 placeholder-slate-400"
                  />
                </div>
              )}

              {/* Actions submit */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReplaceModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-violet-600 transition-colors flex items-center justify-center gap-1"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
