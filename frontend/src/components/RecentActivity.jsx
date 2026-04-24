import React from 'react'

function RecentActivity({ monitors }) {
  // Filter monitors with checks and sort by latest check time
  const activity = monitors
    .filter(m => m.lastCheck)
    .sort((a, b) => new Date(b.lastCheck.checkedAt) - new Date(a.lastCheck.checkedAt))
    .slice(0, 5)

  if (activity.length === 0) return null

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + "y ago"
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + "mo ago"
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + "d ago"
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + "h ago"
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + "m ago"
    return Math.floor(seconds) + "s ago"
  }

  return (
    <div className="bg-[#0a0a0f] shadow-[0_0_30px_rgba(204,255,0,0.03)] sm:rounded-2xl border border-white/10 mb-8 overflow-hidden">
      <div className="px-4 py-4 sm:px-6 border-b border-white/10 bg-black">
        <h3 className="text-base font-semibold leading-6 text-white">
          Recent Activity
        </h3>
      </div>
      <ul role="list" className="divide-y divide-white/10">
        {activity.map((monitor) => (
          <li key={monitor.id} className="px-4 py-3 sm:px-6 hover:bg-white/5 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                 <span className={`relative flex h-2.5 w-2.5`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        monitor.lastCheck.status === 'UP' ? 'bg-[#ccff00]' : 'bg-red-400'
                    }`}></span>
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                        monitor.lastCheck.status === 'UP' ? 'bg-[#ccff00]' : 'bg-red-500'
                    }`}></span>
                 </span>
                 <p className="text-sm font-medium text-white truncate">
                    {monitor.url}
                 </p>
              </div>
              <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-400">
                 <span className={monitor.lastCheck.status === 'UP' ? 'text-[#ccff00]' : 'text-red-400'}>
                    {monitor.lastCheck.status}
                 </span>
                 <span>{monitor.lastCheck.responseTime}ms</span>
                 <span>{timeAgo(monitor.lastCheck.checkedAt)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecentActivity
