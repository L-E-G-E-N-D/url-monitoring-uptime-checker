import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import API_BASE_URL from '../config'
import { parseApiError } from '../utils/http'
import Header from '../components/Header'
import SummaryCards from '../components/SummaryCards'
import RecentActivity from '../components/RecentActivity'
import MonitorDetailsModal from '../components/MonitorDetailsModal'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'

function Dashboard() {
  const [monitors, setMonitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [newUrl, setNewUrl] = useState('')
  const [interval, setInterval] = useState(15)
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, active, paused, down

  // Modal State
  const [selectedMonitorId, setSelectedMonitorId] = useState(null)
  const [selectedAnalyticsMonitorId, setSelectedAnalyticsMonitorId] = useState('')
  const [analyticsData, setAnalyticsData] = useState(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsError, setAnalyticsError] = useState(null)

  const { token, logout } = useAuth()
  const { addToast } = useToast()

  const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  }

  const handleAuthError = (res) => {
    if (res.status === 401 || res.status === 403) {
      logout()
      throw new Error('Session expired. Please login again.')
    }
    return parseApiError(res, `Error ${res.status}: ${res.statusText}`).then(msg => {
      throw new Error(msg)
    })
  }

  const fetchMonitors = () => {
    setLoading(true)
    const headers = {}
    if (token) headers['Authorization'] = `Bearer ${token}`

    fetch(`${API_BASE_URL}/monitors`, { headers })
      .then(res => {
        if (!res.ok) return handleAuthError(res)
        return res.json()
      })
      .then(data => {
        setMonitors(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        addToast(err.message, 'error')
        setLoading(false)
      })
  }

  useEffect(() => {
    if (token) {
        fetchMonitors()
    } else {
        setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (!monitors.length) {
      setSelectedAnalyticsMonitorId('')
      setAnalyticsData(null)
      return
    }

    const selectedStillExists = monitors.some(m => m.id === selectedAnalyticsMonitorId)
    if (!selectedAnalyticsMonitorId || !selectedStillExists) {
      setSelectedAnalyticsMonitorId(monitors[0].id)
    }
  }, [monitors, selectedAnalyticsMonitorId])

  useEffect(() => {
    if (!token || !selectedAnalyticsMonitorId) return

    setAnalyticsLoading(true)
    setAnalyticsError(null)

    const headers = {}
    if (token) headers['Authorization'] = `Bearer ${token}`

    fetch(`${API_BASE_URL}/stats/${selectedAnalyticsMonitorId}`, { headers })
      .then(res => {
        if (!res.ok) return handleAuthError(res)
        return res.json()
      })
      .then(data => {
        setAnalyticsData(data)
        setAnalyticsLoading(false)
      })
      .catch(err => {
        console.error('Dashboard Analytics Fetch Error:', err)
        setAnalyticsError(`Analytics Error: ${err.message}`)
        setAnalyticsLoading(false)
      })
  }, [selectedAnalyticsMonitorId, token])

  const handleAddMonitor = (e) => {
    e.preventDefault()
    setError(null)

    fetch(`${API_BASE_URL}/monitors`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ url: newUrl, checkIntervalMinutes: parseInt(interval) })
    })
    .then(res => {
      if (!res.ok) return handleAuthError(res)
      return res.json()
    })
    .then(() => {
      setNewUrl('')
      addToast('Monitor added successfully', 'success')
      fetchMonitors()
    })
    .catch(err => {
        setError(err.message)
        addToast(err.message, 'error')
    })
  }

  const handleToggleActive = (e, monitor) => {
    e.stopPropagation()
    fetch(`${API_BASE_URL}/monitors/${monitor.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ isActive: !monitor.isActive })
    })
    .then(res => {
        if (!res.ok) return handleAuthError(res)
        return res.json()
    })
    .then(() => {
        setMonitors(monitors.map(m => 
            m.id === monitor.id ? { ...m, isActive: !monitor.isActive } : m
        ))
        addToast(`Monitor ${!monitor.isActive ? 'resumed' : 'paused'}`, 'success')
    })
    .catch(err => addToast(err.message, 'error'))
  }

  const handleEditInterval = (e, monitor) => {
    e.stopPropagation()
    const newInterval = prompt('Enter new check interval in minutes:', monitor.checkIntervalMinutes)
    if (!newInterval || isNaN(newInterval) || newInterval < 1) return

    fetch(`${API_BASE_URL}/monitors/${monitor.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ checkIntervalMinutes: parseInt(newInterval) })
    })
    .then(res => {
        if (!res.ok) return handleAuthError(res)
        return res.json()
    })
    .then(() => {
        setMonitors(monitors.map(m => 
            m.id === monitor.id ? { ...m, checkIntervalMinutes: parseInt(newInterval) } : m
        ))
        addToast('Check interval updated', 'success')
    })
    .catch(err => addToast(err.message, 'error'))
  }

  const handleDeleteMonitor = (e, id) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this monitor?')) return

    fetch(`${API_BASE_URL}/monitors/${id}`, { 
        method: 'DELETE',
        headers: getHeaders()
    })
      .then(res => {
        if (!res.ok) return handleAuthError(res)
        return res.json()
      })
      .then(() => {
        setMonitors(monitors.filter(m => m.id !== id))
        addToast('Monitor deleted', 'success')
        if (selectedMonitorId === id) setSelectedMonitorId(null)
      })
      .catch(err => addToast(err.message, 'error'))
  }

  // Filter monitors logic
  const filteredMonitors = monitors.filter(monitor => {
    // Search Filter
    const matchesSearch = monitor.url.toLowerCase().includes(searchQuery.toLowerCase())

    // Status Filter
    let matchesStatus = true
    if (filterStatus === 'active') matchesStatus = monitor.isActive === true
    if (filterStatus === 'paused') matchesStatus = monitor.isActive === false
    if (filterStatus === 'down') matchesStatus = monitor.lastCheck?.status === 'DOWN'

    return matchesSearch && matchesStatus
  })

  const chartData = (analyticsData?.last20Records || [])
    .slice()
    .reverse()
    .map((record, index) => ({
      name: `${index + 1}`,
      latency: record.latency,
      uptime: record.status === 'UP' ? 100 : 0
    }))

  return (
    <div className="min-h-screen bg-black transition-colors duration-200">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        
        {!token && (
            <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-center text-yellow-200">
                You are not logged in. <a href="/" className="underline font-medium hover:text-yellow-100">Login</a> to manage monitors.
            </div>
        )}

      {token && (
        <>
          <SummaryCards monitors={monitors} />
          <RecentActivity monitors={monitors} />

          <div className="mb-8 bg-[#0a0a0f] shadow-[0_0_30px_rgba(204,255,0,0.03)] sm:rounded-2xl border border-white/10 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-base font-semibold text-white">Analytics</h2>
              <select
                value={selectedAnalyticsMonitorId}
                onChange={(e) => setSelectedAnalyticsMonitorId(e.target.value)}
                className="w-full sm:w-80 rounded-xl border border-white/10 py-2 pl-3 pr-10 text-white bg-black focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00] sm:text-sm outline-none"
              >
                {monitors.map((monitor) => (
                  <option key={monitor.id} value={monitor.id}>
                    {monitor.url}
                  </option>
                ))}
              </select>
            </div>

            {analyticsLoading && <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Loading analytics...</p>}
            {analyticsError && <p className="text-sm text-red-600 dark:text-red-400 mb-3">{analyticsError}</p>}

            {!analyticsLoading && analyticsData && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-slate-400">Uptime</p>
                    <p className="text-2xl font-bold text-white">{analyticsData.uptimePercentage}%</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-slate-400">Avg Latency</p>
                    <p className="text-2xl font-bold text-white">{analyticsData.avgLatency}ms</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="rounded-xl border border-white/10 bg-black p-4">
                    <p className="text-sm font-medium text-slate-300 mb-3">Uptime Trend</p>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#0a0a0f', borderColor: '#ffffff20', borderRadius: '8px' }} />
                          <Line type="monotone" dataKey="uptime" stroke="#ccff00" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black p-4">
                    <p className="text-sm font-medium text-slate-300 mb-3">Latency Trend</p>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#0a0a0f', borderColor: '#ffffff20', borderRadius: '8px' }} />
                          <Line type="monotone" dataKey="latency" stroke="#00ffcc" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <form onSubmit={handleAddMonitor} className="mb-8 bg-[#0a0a0f] shadow-[0_0_30px_rgba(204,255,0,0.03)] sm:rounded-2xl p-6 flex flex-col sm:flex-row gap-4 border border-white/10">
              <input 
                type="url" 
                name="url"
                id="url"
                placeholder="Enter URL to monitor (e.g. https://google.com)" 
                value={newUrl} 
                onChange={e => setNewUrl(e.target.value)}
                required 
                className="flex-1 min-w-0 block w-full px-4 py-3 rounded-xl border border-white/10 text-white bg-black placeholder-slate-500 focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00] sm:text-sm outline-none transition-all"
              />
              <div className="sm:w-32">
                <input 
                  type="number" 
                  name="interval"
                  id="interval"
                  placeholder="Int (m)" 
                  value={interval} 
                  onChange={e => setInterval(e.target.value)}
                  min="1"
                  required 
                  className="block w-full px-4 py-3 rounded-xl border border-white/10 text-white bg-black placeholder-slate-500 focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00] sm:text-sm outline-none transition-all"
                />
              </div>
              <button 
                type="submit"
                className="inline-flex justify-center rounded-xl bg-gradient-to-r from-[#ccff00] to-[#e6ff00] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:brightness-110 transition-all cursor-pointer items-center"
              >
                Add Monitor
              </button>
          </form>

          {/* Search & Filter Controls */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg className="h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search monitors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-xl border border-white/10 py-3 pl-11 pr-4 text-white bg-[#0a0a0f] placeholder-slate-500 focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00] sm:text-sm outline-none transition-all"
              />
            </div>
            <div className="w-full sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full rounded-xl border border-white/10 py-3 pl-4 pr-10 text-white bg-[#0a0a0f] focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00] sm:text-sm outline-none transition-all"
              >
                <option value="all">All Monitors</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="down">Down</option>
              </select>
            </div>
          </div>
        </>
      )}
      
      {loading && <p className="text-slate-600 dark:text-slate-400">Loading...</p>}
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      
      {!loading && !error && token && (
        <div className="bg-[#0a0a0f] shadow-[0_0_30px_rgba(147,51,234,0.03)] overflow-hidden sm:rounded-2xl border border-white/10">
          <ul role="list" className="divide-y divide-white/5">
            {filteredMonitors.length === 0 ? (
              <li className="px-6 py-20 flex flex-col items-center justify-center text-center">
                 <svg className="h-12 w-12 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                 </svg>
                 <h3 className="text-sm font-medium text-white">
                    {monitors.length === 0 ? 'No monitors found' : 'No matching monitors'}
                 </h3>
                 <p className="mt-1 text-sm text-slate-400">
                    {monitors.length === 0 
                      ? 'Get started by adding a new URL to monitor above.' 
                      : 'Try adjusting your search or filter criteria.'
                    }
                 </p>
              </li>
            ) : (
              filteredMonitors.map(monitor => (
                <li 
                  key={monitor.id} 
                  className="px-6 py-6 hover:bg-white/5 transition-colors duration-150 ease-in-out cursor-pointer"
                  onClick={() => setSelectedMonitorId(monitor.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-lg font-medium text-white truncate">{monitor.url}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          monitor.lastCheck?.status === 'UP' 
                            ? 'bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20' 
                            : monitor.lastCheck?.status === 'DOWN'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-white/5 text-slate-300 border border-white/10'
                        }`}>
                          {monitor.lastCheck?.status || 'PENDING'}
                        </span>
                        {!monitor.isActive && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                            Paused
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-slate-400 gap-x-6">
                         <div className="flex items-center gap-1">
                            <span className="font-medium text-slate-300">Interval:</span> {monitor.checkIntervalMinutes}m
                         </div>
                         {monitor.lastCheck && (
                            <>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-slate-300">Response:</span> {monitor.lastCheck.responseTime}ms
                                </div>
                                <div className="flex items-center gap-1 phone:hidden">
                                     <span className="font-medium text-slate-300">Uptime (24h):</span> 
                                     {monitor.uptimePercent !== null ? <span className="text-white">{monitor.uptimePercent}%</span> : 'N/A'}
                                </div>
                                <div className="flex items-center gap-1 text-slate-500">
                                    Last Check: {new Date(monitor.lastCheck.checkedAt).toLocaleTimeString()}
                                </div>
                            </>
                         )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <button 
                          onClick={(e) => handleToggleActive(e, monitor)}
                          className="text-sm font-medium text-purple-400 hover:text-purple-300 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/5 transition-colors cursor-pointer"
                      >
                          {monitor.isActive ? 'Pause' : 'Resume'}
                      </button>
                      <button 
                          onClick={(e) => handleEditInterval(e, monitor)}
                          className="text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/5 transition-colors cursor-pointer"
                      >
                          Edit
                      </button>
                      <button 
                          onClick={(e) => handleDeleteMonitor(e, monitor.id)} 
                          className="text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-xl border border-red-500/20 transition-colors cursor-pointer"
                      >
                          Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
      </main>

      {selectedMonitorId && (
        <MonitorDetailsModal 
          monitorId={selectedMonitorId} 
          onClose={() => setSelectedMonitorId(null)} 
        />
      )}
    </div>
  )
}

export default Dashboard
