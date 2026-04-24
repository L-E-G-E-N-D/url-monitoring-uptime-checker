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
    { label: 'Total Monitors', value: total, textColor: 'text-white' },
    { label: 'Active', value: active, textColor: 'text-[#00ffcc]' }, // cyan
    { label: 'Down', value: down, textColor: 'text-red-400' },
    { label: 'Avg Uptime (24h)', value: `${avgUptime}%`, textColor: 'text-[#ccff00]' }, // lime
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className="bg-[#0a0a0f] rounded-2xl p-6 border border-white/10 shadow-[0_0_30px_rgba(204,255,0,0.03)] relative overflow-hidden group"
        >
          {/* Subtle hover glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <dt className="text-sm font-medium text-slate-400 truncate relative z-10">
            {card.label}
          </dt>
          <dd className={`mt-2 text-4xl font-bold ${card.textColor} relative z-10 drop-shadow-md`}>
            {card.value}
          </dd>
        </div>
      ))}
    </div>
  )
}

export default SummaryCards
