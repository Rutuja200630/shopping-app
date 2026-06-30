import { useState, useRef, useEffect } from 'react'
import { Send, Smile, Paperclip, Phone, Video, MoreVertical, Search } from 'lucide-react'
import { chatUsers, chatMessages } from '../data'

export default function ChatPage() {
  const [activeUser, setActiveUser] = useState(chatUsers[0])
  const [messages, setMessages] = useState(chatMessages)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: 'me', text: input.trim(), time: 'Now' },
    ])
    setInput('')
  }

  return (
    <div className="pt-16 h-screen bg-cream-50 flex">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="hidden sm:flex flex-col w-72 lg:w-80 bg-white border-r border-gray-100 flex-shrink-0">
        {/* Header */}
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg mb-4">Messages</h2>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="chat-search"
              type="text"
              placeholder="Search chats…"
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-cream-100 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-200"
            />
          </div>
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto">
          {chatUsers.map((user) => (
            <button
              key={user.id}
              id={`chat-user-${user.id}`}
              onClick={() => setActiveUser(user)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left hover:bg-lavender-50 ${
                activeUser.id === user.id ? 'bg-lavender-50 border-r-2 border-lavender-500' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-lavender-200 to-lavender-400 flex items-center justify-center text-xl shadow-sm">
                  {user.avatar}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm text-gray-800 truncate">{user.name}</span>
                  <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{user.time}</span>
                </div>
                <p className="text-xs text-gray-400 truncate mt-0.5">{user.lastMsg}</p>
              </div>
              {user.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-lavender-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {user.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* ── Chat Window ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Chat Header */}
        <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender-200 to-lavender-400 flex items-center justify-center text-lg">
                {activeUser.avatar}
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{activeUser.name}</p>
              <p className="text-xs text-emerald-500">Online</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <IconBtn><Phone size={17} /></IconBtn>
            <IconBtn><Video size={17} /></IconBtn>
            <IconBtn><MoreVertical size={17} /></IconBtn>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-4 bg-cream-50">
          {/* Date separator */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">Today</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.from === 'me' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {msg.from === 'them' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lavender-200 to-lavender-400 flex items-center justify-center text-sm flex-shrink-0">
                  {activeUser.avatar}
                </div>
              )}
              <div className={`max-w-[75%] sm:max-w-[60%] ${msg.from === 'me' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.from === 'me'
                      ? 'bg-gradient-to-br from-lavender-500 to-lavender-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 px-1">{msg.time}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-100 px-4 sm:px-6 py-4">
          <form onSubmit={sendMessage} className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 rounded-xl text-gray-400 hover:text-lavender-500 hover:bg-lavender-50 transition-colors"
            >
              <Paperclip size={18} />
            </button>
            <div className="flex-1 relative">
              <input
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="w-full px-4 py-3 pr-11 rounded-2xl bg-cream-100 border border-transparent focus:border-lavender-300 focus:outline-none focus:ring-2 focus:ring-lavender-100 text-sm transition-all"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-lavender-500"
              >
                <Smile size={17} />
              </button>
            </div>
            <button
              id="chat-send-btn"
              type="submit"
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-lavender-500 to-lavender-600 text-white flex items-center justify-center shadow-md hover:shadow-lavender-300 hover:scale-105 transition-all"
            >
              <Send size={17} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function IconBtn({ children }) {
  return (
    <button className="p-2 rounded-xl text-gray-400 hover:text-lavender-500 hover:bg-lavender-50 transition-colors">
      {children}
    </button>
  )
}
