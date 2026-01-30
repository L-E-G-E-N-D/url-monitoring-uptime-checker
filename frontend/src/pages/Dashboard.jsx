import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import '../App.css'

function Dashboard() {
  const [monitors, setMonitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [newUrl, setNewUrl] = useState('')
  const [interval, setInterval] = useState(15)
  
  const { token } = useAuth()

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
          throw new Error('Failed to fetch monitors')
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
        // If no token, we can't fetch. Just stop loading.
        setLoading(false)
        // Optionally setup a redirect or empty state here, but Step 6 handles protection.
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
      <h1>Monitored URLs</h1>
      
      {!token && (
          <div className="error" style={{ textAlign: 'center' }}>
              You are not logged in. <a href="/login">Login</a> to manage monitors.
          </div>
      )}

      {token && (
        <form onSubmit={handleAddMonitor} className="add-form">
            <input 
            type="url" 
            placeholder="https://example.com" 
            value={newUrl} 
            onChange={e => setNewUrl(e.target.value)}
            required 
            />
            <input 
            type="number" 
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
                  <div className="monitor-info">
                    <strong>{monitor.url}</strong>
                    <span> - {monitor.isActive ? 'Active' : 'Paused'}</span>
                    <span className="interval"> ({monitor.checkIntervalMinutes}m)</span>
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
