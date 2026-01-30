import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [monitors, setMonitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
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
  }, [])

  return (
    <div className="container">
      <h1>Monitored URLs</h1>
      
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
