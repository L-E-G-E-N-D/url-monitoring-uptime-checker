import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Header() {
  const { user, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <header className="h-16 bg-black/40 backdrop-blur-lg border-b border-white/5 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
        {/* Left: Brand */}
        <div className="flex-shrink-0 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
              <path d="M4 18L10 6" stroke="#ccff00" strokeWidth="3" strokeLinecap="round" />
              <path d="M10 20L16 8" stroke="#ccff00" strokeWidth="3" strokeLinecap="round" />
              <path d="M16 22L22 10" stroke="#ccff00" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span className="text-xl font-bold text-white tracking-tight">
              Monitorly
            </span>
          </Link>
        </div>

        {/* Center: Empty */}
        <div className="flex-1" />

        {/* Right: Profile */}
        <div className="flex items-center gap-4">
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 focus:outline-none group"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-medium text-sm shadow-[0_0_15px_rgba(147,51,234,0.3)] overflow-hidden border border-white/10 group-hover:border-white/30 transition-all">
                {user?.picture ? (
                  <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name ? user.name[0].toUpperCase() : 'U'
                )}
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                {user?.name || 'User'}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-colors">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0a0a0f] rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] py-1 z-50 border border-white/10">
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
