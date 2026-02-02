import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import '../App.css'

function Dashboard() {
  // No comments
  const [monitors, setMonitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [newUrl, setNewUrl] = useState('')
  const [interval, setInterval] = useState(15)
  
  const { token, logout } = useAuth()

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

    fetch('/monitors', { headers })
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

    fetch('/monitors', {
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
    fetch(`/monitors/${monitor.id}`, {
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

    fetch(`/monitors/${monitor.id}`, {
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

    fetch(`/monitors/${id}`, { 
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
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Monitors</h1>
          <div className="flex gap-3">
              <button 
                onClick={fetchMonitors} 
                disabled={loading}
                className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm disabled:opacity-50"
              >
                  {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button 
                onClick={logout} 
                className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm"
              >
                Logout
              </button>
          </div>
        </div>
        
        {!token && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-center text-yellow-800">
                You are not logged in. <a href="/login" className="underline font-medium hover:text-yellow-900">Login</a> to manage monitors.
            </div>
        )}

      {token && (
        <form onSubmit={handleAddMonitor} className="mb-8 bg-white shadow sm:rounded-lg p-6 flex flex-col sm:flex-row gap-4 border border-slate-200">
            <input 
              type="url" 
              name="url"
              id="url"
              placeholder="Enter URL to monitor (e.g. https://google.com)" 
              value={newUrl} 
              onChange={e => setNewUrl(e.target.value)}
              required 
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border-0 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                className="block w-full px-3 py-2 rounded-md border-0 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
      
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      
      {!loading && !error && token && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md border border-slate-200">
          <ul role="list" className="divide-y divide-slate-200">
            {monitors.length === 0 ? (
              <li className="px-6 py-12 text-center text-slate-500 text-sm">
                No monitors found. Add one above to start tracking.
              </li>
            ) : (
              monitors.map(monitor => (
                <li key={monitor.id} className="px-6 py-6 hover:bg-slate-50 transition-colors duration-150 ease-in-out">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-lg font-medium text-slate-900 truncate">{monitor.url}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          monitor.lastCheck?.status === 'UP' 
                            ? 'bg-green-100 text-green-800' 
                            : monitor.lastCheck?.status === 'DOWN'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-100 text-slate-800'
                        }`}>
                          {monitor.lastCheck?.status || 'PENDING'}
                        </span>
                        {!monitor.isActive && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Paused
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-slate-500 gap-x-6">
                         <div className="flex items-center gap-1">
                            <span className="font-medium text-slate-700">Interval:</span> {monitor.checkIntervalMinutes}m
                         </div>
                         {monitor.lastCheck && (
                            <>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-slate-700">Response:</span> {monitor.lastCheck.responseTime}ms
                                </div>
                                <div className="flex items-center gap-1 phone:hidden">
                                     <span className="font-medium text-slate-700">Uptime (24h):</span> 
                                     {monitor.uptimePercent !== null ? <span className="text-slate-900">{monitor.uptimePercent}%</span> : 'N/A'}
                                </div>
                                <div className="flex items-center gap-1 text-slate-400">
                                    Last Check: {new Date(monitor.lastCheck.checkedAt).toLocaleTimeString()}
                                </div>
                            </>
                         )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <button 
                          onClick={() => handleToggleActive(monitor)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500 bg-white hover:bg-blue-50 px-3 py-1.5 rounded-md border border-transparent transition-colors"
                      >
                          {monitor.isActive ? 'Pause' : 'Resume'}
                      </button>
                      <button 
                          onClick={() => handleEditInterval(monitor)}
                          className="text-sm font-medium text-slate-600 hover:text-slate-500 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 transition-colors"
                      >
                          Edit
                      </button>
                      <button 
                          onClick={() => handleDeleteMonitor(monitor.id)} 
                          className="text-sm font-medium text-red-600 hover:text-red-500 bg-white hover:bg-red-50 px-3 py-1.5 rounded-md border border-transparent transition-colors"
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
