import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import '../App.css'

function Dashboard() {
  // Version: Fix ReferenceError Force Update
  const [monitors, setMonitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [newUrl, setNewUrl] = useState('')
  const [interval, setInterval] = useState(15)
  
  const { token, logout } = useAuth()

  // Helper to get headers with token
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
             // Fallback if json parse fails or if the above throw is caught (it won't be caught here)
             // Actually parsing might fail if response is not json
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
      fetchMonitors() // Refresh list
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
        // Update local state
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
    <div className="container">
      <div className="dashboard-header">
        <h1>Monitored URLs (Verified)</h1>
        <div className="header-actions">
            <button onClick={fetchMonitors} className="refresh-btn" disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh Status'}
            </button>
            <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>
      
      {!token && (
          <div className="error" style={{ textAlign: 'center' }}>
              You are not logged in. <a href="/login">Login</a> to manage monitors.
          </div>
      )}

      {token && (
        <form onSubmit={handleAddMonitor} className="add-form">
            <input 
            type="url" 
            name="url"
            id="url"
            placeholder="https://example.com" 
            value={newUrl} 
            onChange={e => setNewUrl(e.target.value)}
            required 
            />
            <input 
            type="number" 
            name="interval"
            id="interval"
            placeholder="Interval (min)" 
            value={interval} 
            onChange={e => setInterval(e.target.value)}
            min="1"
            required 
            />
            <button type="submit">Add Monitor</button>
        </form>
      )}
      
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      
      {!loading && !error && token && (
        <div className="monitor-list">
          {monitors.length === 0 ? (
            <p>No monitors found. Add one!</p>
          ) : (
            <ul>
              {monitors.map(monitor => (
                <li key={monitor.id} className="monitor-item">
                  <div className="monitor-main">
                    <div className="monitor-header">
                        <strong>{monitor.url}</strong>
                        <span className={`status-badge ${monitor.lastCheck?.status === 'UP' ? 'status-up' : 'status-down'}`}>
                            {monitor.lastCheck?.status || 'PENDING'}
                        </span>
                    </div>
                    <div className="monitor-details">
                        <span className="detail-item">
                            Interval: {monitor.checkIntervalMinutes}m
                        </span>
                        {monitor.lastCheck && (
                            <>
                                <span className="detail-item">
                                    Response: {monitor.lastCheck.responseTime}ms
                                </span>
                                <span className="detail-item">
                                    Last Check: {new Date(monitor.lastCheck.checkedAt).toLocaleString()}
                                </span>
                                <span className="detail-item">
                                    Uptime (24h): {monitor.uptimePercent !== null ? `${monitor.uptimePercent}%` : 'N/A'}
                                </span>
                            </>
                        )}
                        {!monitor.isActive && <span className="detail-item paused-badge">PAUSED</span>}
                    </div>
                  </div>
                  <div className="actions">
                    <button 
                        onClick={() => handleToggleActive(monitor)}
                        className="action-btn"
                    >
                        {monitor.isActive ? 'Pause' : 'Resume'}
                    </button>
                    <button 
                        onClick={() => handleEditInterval(monitor)}
                        className="action-btn"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={() => handleDeleteMonitor(monitor.id)} 
                        className="delete-btn"
                    >
                        Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard
