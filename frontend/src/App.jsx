import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [monitors, setMonitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /* Existing code... */
  const [newUrl, setNewUrl] = useState('')
  const [interval, setInterval] = useState(15)

  const fetchMonitors = () => {
    setLoading(true)
    fetch('/monitors')
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
    fetchMonitors()
  }, [])

  const handleAddMonitor = (e) => {
    e.preventDefault()
    setError(null)

    fetch('/monitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

  return (
    <div className="container">
      <h1>Monitored URLs</h1>
      
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
  /* ... rest of render ... */
      
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      
      {!loading && !error && (
        <div className="monitor-list">
          {monitors.length === 0 ? (
            <p>No monitors found.</p>
          ) : (
            <ul>
              {monitors.map(monitor => (
                <li key={monitor.id} className="monitor-item">
                  <strong>{monitor.url}</strong>
                  <span> - {monitor.isActive ? 'Active' : 'Paused'}</span>
                  <span className="interval"> ({monitor.checkIntervalMinutes}m)</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default App
