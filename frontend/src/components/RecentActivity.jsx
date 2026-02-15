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
    <div className="bg-white dark:bg-slate-800 shadow sm:rounded-lg border border-slate-200 dark:border-slate-700 mb-8 overflow-hidden">
      <div className="px-4 py-4 sm:px-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <h3 className="text-base font-semibold leading-6 text-slate-900 dark:text-white">
          Recent Activity
        </h3>
      </div>
      <ul role="list" className="divide-y divide-slate-200 dark:divide-slate-700">
        {activity.map((monitor) => (
          <li key={monitor.id} className="px-4 py-3 sm:px-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                 <span className={`relative flex h-2.5 w-2.5`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        monitor.lastCheck.status === 'UP' ? 'bg-green-400' : 'bg-red-400'
                    }`}></span>
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                        monitor.lastCheck.status === 'UP' ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                 </span>
                 <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {monitor.url}
                 </p>
              </div>
              <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                 <span className={monitor.lastCheck.status === 'UP' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
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
