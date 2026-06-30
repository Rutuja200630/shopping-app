import { useState, useEffect } from 'react'
import {
  HelpCircle, MessageSquare, Image as ImageIcon, Trash2,
  AlertCircle, RefreshCw, Eye, ShieldCheck, CheckCircle2
} from 'lucide-react'
import api from '../../services/api'

export default function AdminBuyerConnectPage() {
  const [activeTab, setActiveTab] = useState('questions') // 'questions' | 'photos'
  const [data, setData] = useState({ questions: [], photos: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [deletingAnswerId, setDeletingAnswerId] = useState(null)
  const [feedback, setFeedback] = useState({ text: '', type: '' })

  const showFeedback = (text, type = 'success') => {
    setFeedback({ text, type })
    setTimeout(() => setFeedback({ text: '', type: '' }), 4500)
  }

  const fetchContent = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/admin/buyer-connect/content')
      setData(res.data || { questions: [], photos: [] })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch buyer connect content.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [])

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this question and its answer? This action cannot be undone.')) {
      return
    }

    setDeletingId(id)
    try {
      await api.delete(`/admin/buyer-connect/questions/${id}`)
      setData(prev => ({
        ...prev,
        questions: prev.questions.filter(q => q._id !== id)
      }))
      showFeedback('Question deleted successfully.', 'success')
    } catch (err) {
      showFeedback(err.response?.data?.error || 'Failed to delete question.', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const handleDeleteAnswer = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete the answer to this question? The question itself will remain.')) {
      return
    }

    setDeletingAnswerId(id)
    try {
      const res = await api.delete(`/admin/buyer-connect/questions/${id}/answer`)
      setData(prev => ({
        ...prev,
        questions: prev.questions.map(q => q._id === id ? { ...q, isAnswered: false, answer: undefined, answeredBy: undefined, answeredAt: undefined } : q)
      }))
      showFeedback('Answer cleared successfully.', 'success')
    } catch (err) {
      showFeedback(err.response?.data?.error || 'Failed to delete answer.', 'error')
    } finally {
      setDeletingAnswerId(null)
    }
  }

  const handleDeletePhoto = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this buyer photo? This action cannot be undone.')) {
      return
    }

    setDeletingId(id)
    try {
      await api.delete(`/admin/buyer-connect/photos/${id}`)
      setData(prev => ({
        ...prev,
        photos: prev.photos.filter(p => p._id !== id)
      }))
      showFeedback('Photo deleted successfully.', 'success')
    } catch (err) {
      showFeedback(err.response?.data?.error || 'Failed to delete photo.', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'N/A'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Buyer Connect Moderation</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage community-driven questions, answers, and customer real-wear photos.</p>
        </div>
        <button
          onClick={fetchContent}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh Content
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'questions' ? 'bg-white text-slate-800 shadow' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle size={14} /> Questions & Answers ({data.questions.length})
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'photos' ? 'bg-white text-slate-800 shadow' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ImageIcon size={14} /> Real Buyer Photos ({data.photos.length})
        </button>
      </div>

      {/* Body List */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 text-xs font-bold uppercase tracking-wider gap-2">
          <RefreshCw size={14} className="animate-spin" /> Loading Moderation Content…
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-sm text-rose-600">
          <AlertCircle size={18} className="flex-shrink-0" />
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          
          {/* QUESTIONS LISTING */}
          {activeTab === 'questions' && (
            data.questions.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm font-semibold">No questions reported or asked in the platform.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Product</th>
                      <th className="py-4 px-6">Question & Asker</th>
                      <th className="py-4 px-6">Answer & Responder</th>
                      <th className="py-4 px-6">Helpful Votes</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                    {data.questions.map((q) => (
                      <tr key={q._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 max-w-[150px]">
                          {q.product ? (
                            <a href={`/products/${q.product.slug}`} target="_blank" rel="noreferrer" className="text-slate-800 font-extrabold hover:text-violet-600 truncate block">
                              {q.product.name}
                            </a>
                          ) : (
                            <span className="text-slate-300">N/A</span>
                          )}
                        </td>
                        <td className="py-4 px-6 max-w-[280px]">
                          <p className="text-slate-800 font-bold leading-relaxed">"{q.question}"</p>
                          <span className="text-[10px] text-slate-400 block mt-1.5">
                            By {q.user?.name || 'Customer'} ({q.user?.email || 'N/A'}) · {formatDate(q.createdAt)}
                          </span>
                        </td>
                        <td className="py-4 px-6 max-w-[280px]">
                          {q.isAnswered ? (
                            <div>
                              <p className="text-slate-700 font-medium leading-relaxed">"{q.answer}"</p>
                              <span className="text-[10px] text-slate-400 block mt-1.5">
                                By {q.answeredBy?.name || 'Buyer'} ({q.answeredBy?.email || 'N/A'}) · {formatDate(q.answeredAt)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-300 italic">Unanswered</span>
                          )}
                        </td>
                        <td className="py-4 px-6 font-extrabold text-slate-700">👍 {q.helpfulVotes}</td>
                        <td className="py-4 px-6 text-right space-y-2">
                          {q.isAnswered && (
                            <button
                              onClick={() => handleDeleteAnswer(q._id)}
                              disabled={deletingAnswerId === q._id}
                              className="text-[10px] text-amber-600 hover:text-amber-700 font-bold border border-amber-200 hover:bg-amber-50 px-2.5 py-1 rounded-lg transition-all mr-2"
                            >
                              Delete Answer
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteQuestion(q._id)}
                            disabled={deletingId === q._id}
                            className="text-[10px] text-rose-600 hover:text-rose-700 font-bold border border-rose-200 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-all"
                          >
                            Delete Q&A
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* PHOTOS LISTING */}
          {activeTab === 'photos' && (
            data.photos.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm font-semibold">No buyer wear photos uploaded in the system.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Product</th>
                      <th className="py-4 px-6">Buyer Wear Photo</th>
                      <th className="py-4 px-6">Caption & Uploader</th>
                      <th className="py-4 px-6">Helpful Votes</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                    {data.photos.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 max-w-[150px]">
                          {p.product ? (
                            <a href={`/products/${p.product.slug}`} target="_blank" rel="noreferrer" className="text-slate-800 font-extrabold hover:text-violet-600 truncate block">
                              {p.product.name}
                            </a>
                          ) : (
                            <span className="text-slate-300">N/A</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <a href={p.imageUrl} target="_blank" rel="noreferrer" className="block w-12 h-16 rounded-lg overflow-hidden border border-slate-200 hover:opacity-85 transition-opacity">
                            <img src={p.imageUrl} className="w-full h-full object-cover" alt="wear snapshot" />
                          </a>
                        </td>
                        <td className="py-4 px-6 max-w-[280px]">
                          <p className="text-slate-800 font-bold">"{p.caption || 'No caption provided'}"</p>
                          <span className="text-[10px] text-slate-400 block mt-1.5">
                            Uploaded by {p.user?.name || 'Customer'} ({p.user?.email || 'N/A'}) · {formatDate(p.createdAt)}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-extrabold text-slate-700">👍 {p.helpfulVotes}</td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeletePhoto(p._id)}
                            disabled={deletingId === p._id}
                            className="text-[10px] text-rose-600 hover:text-rose-700 font-bold border border-rose-200 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-all"
                          >
                            Delete Photo
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

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
