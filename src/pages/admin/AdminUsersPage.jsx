import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, Loader, Users, Calendar, ShieldAlert, ShieldCheck, UserCheck, X, AlertCircle } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    targetUser: null,
    targetRole: ''
  })
  const [updatingId, setUpdatingId] = useState(null)
  const [feedback, setFeedback] = useState({ text: '', type: '' })

  const showFeedback = (text, type = 'success') => {
    setFeedback({ text, type })
    setTimeout(() => setFeedback({ text: '', type: '' }), 4500)
  }

  const { user: currentUser } = useAuth()
  const location = useLocation()

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('q')
    if (q) {
      setSearchQuery(q)
    }
  }, [location.search])

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

  const triggerRoleChange = (targetUser, targetRole) => {
    setConfirmModal({
      isOpen: true,
      targetUser,
      targetRole
    })
  }

  const handleRoleChangeConfirm = async () => {
    const { targetUser, targetRole } = confirmModal
    if (!targetUser) return

    setUpdatingId(targetUser._id)
    setConfirmModal({ isOpen: false, targetUser: null, targetRole: '' })

    try {
      await api.patch(`/admin/users/${targetUser._id}/role`, { role: targetRole })
      
      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(u =>
          u._id === targetUser._id ? { ...u, role: targetRole } : u
        )
      )
    } catch (err) {
      showFeedback(err.response?.data?.error || 'Failed to update user role.', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredUsers = users.filter(user => {
    const name = user.name || ''
    const email = user.email || ''
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           email.toLowerCase().includes(searchQuery.toLowerCase())
  })

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 text-violet-600 animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Loading user registry…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Manage Users</h1>
        <p className="text-slate-500 text-sm mt-0.5">View registered customer profiles and manage administrative roles.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs placeholder-slate-400 focus:outline-none focus:border-violet-400"
          />
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
          <Users size={16} />
          <span>{users.length} Users Seeded</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/70">
                <th className="py-4 px-6">User profile</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6">Role Privilege</th>
                <th className="py-4 px-6">Signup Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400 font-semibold">
                    No users matching search filters found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrentUser = currentUser && (u._id === currentUser.id || u._id === currentUser._id || u.email === currentUser.email)
                  const isUpdating = updatingId === u._id

                  return (
                    <tr key={u.email} className="hover:bg-slate-50/50 transition-colors">
                      {/* User profile with initials badge */}
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-xs font-bold text-violet-600 border border-violet-100">
                          {u.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="font-bold text-slate-800">{u.name}</span>
                      </td>

                      {/* Email address */}
                      <td className="py-4 px-6 text-slate-500">
                        {u.email}
                      </td>

                      {/* Role privilege with custom colors */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          u.role === 'admin'
                            ? 'bg-rose-50 border-rose-200 text-rose-600'
                            : u.role === 'influencer'
                            ? 'bg-sky-50 border-sky-200 text-sky-600'
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${
                            u.role === 'admin' ? 'bg-rose-500' : u.role === 'influencer' ? 'bg-sky-500' : 'bg-slate-400'
                          }`} />
                          {u.role}
                        </span>
                      </td>

                      {/* Registration date */}
                      <td className="py-4 px-6 text-slate-400 flex items-center gap-1.5 pt-5">
                        <Calendar size={13} className="text-slate-300" />
                        <span>{formatDate(u.createdAt)}</span>
                      </td>

                      {/* Role Promotion/Demotion actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        {isCurrentUser ? (
                          <span className="text-[10px] text-slate-400 italic font-semibold">Active Session (Self)</span>
                        ) : (
                          <div className="flex justify-end gap-2 items-center">
                            {u.role !== 'admin' ? (
                              <button
                                onClick={() => triggerRoleChange(u, 'admin')}
                                disabled={isUpdating}
                                className="px-2.5 py-1.5 bg-violet-50 text-violet-600 border border-violet-100 hover:bg-violet-600 hover:text-white hover:border-violet-600 rounded-xl text-[10px] font-bold transition-all disabled:opacity-50"
                              >
                                Promote to Admin
                              </button>
                            ) : (
                              <button
                                onClick={() => triggerRoleChange(u, 'user')}
                                disabled={isUpdating}
                                className="px-2.5 py-1.5 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white hover:border-rose-600 rounded-xl text-[10px] font-bold transition-all disabled:opacity-50"
                              >
                                Demote to User
                              </button>
                            )}
                            {isUpdating && <Loader size={12} className="animate-spin text-slate-400" />}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 max-w-sm w-full relative">
            <button
              onClick={() => setConfirmModal({ isOpen: false, targetUser: null, targetRole: '' })}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                confirmModal.targetRole === 'admin' 
                  ? 'bg-rose-50 border-rose-100 text-rose-500' 
                  : 'bg-amber-50 border-amber-100 text-amber-500'
              }`}>
                {confirmModal.targetRole === 'admin' ? <ShieldAlert size={24} /> : <ShieldAlert size={24} />}
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-800">Confirm Role Modification</h3>
                <p className="text-slate-500 text-xs mt-2 px-2">
                  Are you sure you want to change <strong>{confirmModal.targetUser?.name}</strong>'s role to{' '}
                  <span className={`font-bold capitalize ${confirmModal.targetRole === 'admin' ? 'text-rose-500' : 'text-slate-700'}`}>
                    {confirmModal.targetRole}
                  </span>?
                </p>
              </div>

              <div className="flex gap-3 w-full mt-4">
                <button
                  onClick={() => setConfirmModal({ isOpen: false, targetUser: null, targetRole: '' })}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRoleChangeConfirm}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold text-white transition-all shadow ${
                    confirmModal.targetRole === 'admin'
                      ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-200'
                      : 'bg-amber-600 hover:bg-amber-500 shadow-amber-200'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
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
