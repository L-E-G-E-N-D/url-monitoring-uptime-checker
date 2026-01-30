import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import '../App.css'

function Dashboard() {
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

  /* ... existing fetchMonitors ... */

  /* ... existing useEffect ... */

  /* ... existing handlers ... */

  /* ... */

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Monitored URLs</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
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
