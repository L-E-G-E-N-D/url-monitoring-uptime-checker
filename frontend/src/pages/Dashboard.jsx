import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import API_BASE_URL from '../config'

function Dashboard() {
  const [monitors, setMonitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  
  const [newUrl, setNewUrl] = useState('')
  const [interval, setInterval] = useState(15)
  
  const { token, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  }

  const fetchMonitors = () => {
    setLoading(true)
    const headers = {}
    if (token) headers['Authorization'] = `Bearer ${token}`

    fetch(`${API_BASE_URL}/monitors`, { headers })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) throw new Error('Unauthorized - please login')
          return res.json().then(err => { 
            throw new Error(err.message || err.error || `Error ${res.status}: ${res.statusText}`) 
          }).catch(e => {
             throw new Error(`Error ${res.status}: ${res.statusText}`)
          })
        }
        return res.json()
      })
      .then(data => {
        setMonitors(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
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

  const handleAddMonitor = (e) => {
    e.preventDefault()
    setError(null)

    fetch(`${API_BASE_URL}/monitors`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ url: newUrl, checkIntervalMinutes: parseInt(interval) })
    })
    .then(res => {
      if (!res.ok) {
        if (res.status === 401) throw new Error('Unauthorized - please login')
        return res.json().then(err => { throw new Error(err.message || 'Failed to create monitor') })
      }
      return res.json()
    })
    .then(() => {
      setNewUrl('')
      fetchMonitors()
    })
    .catch(err => setError(err.message))
  }

  const handleToggleActive = (monitor) => {
    fetch(`${API_BASE_URL}/monitors/${monitor.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ isActive: !monitor.isActive })
    })
    .then(res => {
        if (!res.ok) throw new Error('Failed to update monitor')
        return res.json()
    })
    .then(() => {
        setMonitors(monitors.map(m => 
            m.id === monitor.id ? { ...m, isActive: !monitor.isActive } : m
        ))
    })
    .catch(err => setError(err.message))
  }

  const handleEditInterval = (monitor) => {
    const newInterval = prompt('Enter new check interval in minutes:', monitor.checkIntervalMinutes)
    if (!newInterval || isNaN(newInterval) || newInterval < 1) return

    fetch(`${API_BASE_URL}/monitors/${monitor.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ checkIntervalMinutes: parseInt(newInterval) })
    })
    .then(res => {
        if (!res.ok) throw new Error('Failed to update monitor')
        return res.json()
    })
    .then(() => {
        setMonitors(monitors.map(m => 
            m.id === monitor.id ? { ...m, checkIntervalMinutes: parseInt(newInterval) } : m
        ))
    })
    .catch(err => setError(err.message))
  }

  const handleDeleteMonitor = (id) => {
    if (!confirm('Are you sure you want to delete this monitor?')) return

    fetch(`${API_BASE_URL}/monitors/${id}`, { 
        method: 'DELETE',
        headers: getHeaders()
    })
      .then(res => {
        if (!res.ok) {
           if (res.status === 401) throw new Error('Unauthorized - please login')
           throw new Error('Failed to delete monitor')
        }
        return res.json()
      })
      .then(() => {
        setMonitors(monitors.filter(m => m.id !== id))
      })
      .catch(err => setError(err.message))
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 relative">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Monitors</h1>
          <div className="flex gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                {showSettings && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-10 border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => { toggleTheme(); setShowSettings(false) }}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    </button>
                  </div>
                )}
              </div>
              <button 
                onClick={fetchMonitors} 
                disabled={loading}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm disabled:opacity-50"
              >
                  {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button 
                onClick={logout} 
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm"
              >
                Logout
              </button>
          </div>
        </div>
        
        {!token && (
            <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-md text-center text-yellow-800 dark:text-yellow-200">
                You are not logged in. <a href="/login" className="underline font-medium hover:text-yellow-900 dark:hover:text-yellow-100">Login</a> to manage monitors.
            </div>
        )}

      {token && (
        <form onSubmit={handleAddMonitor} className="mb-8 bg-white dark:bg-slate-800 shadow sm:rounded-lg p-6 flex flex-col sm:flex-row gap-4 border border-slate-200 dark:border-slate-700">
            <input 
              type="url" 
              name="url"
              id="url"
              placeholder="Enter URL to monitor (e.g. https://google.com)" 
              value={newUrl} 
              onChange={e => setNewUrl(e.target.value)}
              required 
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border-0 text-slate-900 dark:text-slate-100 dark:bg-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                className="block w-full px-3 py-2 rounded-md border-0 text-slate-900 dark:text-slate-100 dark:bg-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
            <button 
              type="submit"
              className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Add Monitor
            </button>
        </form>
      )}
      
      {loading && <p className="text-slate-600 dark:text-slate-400">Loading...</p>}
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      
      {!loading && !error && token && (
        <div className="bg-white dark:bg-slate-800 shadow overflow-hidden sm:rounded-md border border-slate-200 dark:border-slate-700">
          <ul role="list" className="divide-y divide-slate-200 dark:divide-slate-700">
            {monitors.length === 0 ? (
              <li className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                No monitors found. Add one above to start tracking.
              </li>
            ) : (
              monitors.map(monitor => (
                <li key={monitor.id} className="px-6 py-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150 ease-in-out">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-lg font-medium text-slate-900 dark:text-slate-100 truncate">{monitor.url}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          monitor.lastCheck?.status === 'UP' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                            : monitor.lastCheck?.status === 'DOWN'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {monitor.lastCheck?.status || 'PENDING'}
                        </span>
                        {!monitor.isActive && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                            Paused
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-slate-500 dark:text-slate-400 gap-x-6">
                         <div className="flex items-center gap-1">
                            <span className="font-medium text-slate-700 dark:text-slate-300">Interval:</span> {monitor.checkIntervalMinutes}m
                         </div>
                         {monitor.lastCheck && (
                            <>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Response:</span> {monitor.lastCheck.responseTime}ms
                                </div>
                                <div className="flex items-center gap-1 phone:hidden">
                                     <span className="font-medium text-slate-700 dark:text-slate-300">Uptime (24h):</span> 
                                     {monitor.uptimePercent !== null ? <span className="text-slate-900 dark:text-slate-100">{monitor.uptimePercent}%</span> : 'N/A'}
                                </div>
                                <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                                    Last Check: {new Date(monitor.lastCheck.checkedAt).toLocaleTimeString()}
                                </div>
                            </>
                         )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <button 
                          onClick={() => handleToggleActive(monitor)}
                          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-md border border-transparent transition-colors"
                      >
                          {monitor.isActive ? 'Pause' : 'Resume'}
                      </button>
                      <button 
                          onClick={() => handleEditInterval(monitor)}
                          className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-500 dark:hover:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
                      >
                          Edit
                      </button>
                      <button 
                          onClick={() => handleDeleteMonitor(monitor.id)} 
                          className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-md border border-transparent transition-colors"
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
      </div>
    </div>
  )
}

export default Dashboard
