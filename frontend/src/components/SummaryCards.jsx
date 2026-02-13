import React from 'react'

function SummaryCards({ monitors }) {
  const total = monitors.length
  const active = monitors.filter(m => m.isActive).length
  const down = monitors.filter(m => m.lastCheck?.status === 'DOWN').length
  
  // Calculate Avg Uptime
  // Filter monitors that have uptimePercent (not null/undefined)
  const monitorsWithUptime = monitors.filter(m => m.uptimePercent !== null && m.uptimePercent !== undefined)
  const avgUptime = monitorsWithUptime.length > 0
    ? (monitorsWithUptime.reduce((acc, m) => acc + parseFloat(m.uptimePercent), 0) / monitorsWithUptime.length).toFixed(1)
    : '0.0'

  const cards = [
    { label: 'Total Monitors', value: total, textColor: 'text-slate-900 dark:text-white' },
    { label: 'Active', value: active, textColor: 'text-blue-600 dark:text-blue-400' },
    { label: 'Down', value: down, textColor: 'text-red-600 dark:text-red-400' },
    { label: 'Avg Uptime (24h)', value: `${avgUptime}%`, textColor: 'text-green-600 dark:text-green-400' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
            {card.label}
          </dt>
          <dd className={`mt-2 text-3xl font-semibold ${card.textColor}`}>
            {card.value}
          </dd>
        </div>
      ))}
    </div>
  )
}

export default SummaryCards
