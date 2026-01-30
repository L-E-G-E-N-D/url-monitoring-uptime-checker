import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState('Loading...')
  const [monitors, setMonitors] = useState([])

  useEffect(() => {
    // 1. We hardcode a user ID for now because there's no auth UI yet.
    // The backend endpoint requires a logged-in user, usually via token.
    // Wait, the backend uses JWT auth middleware...
    // The user said "No authentication UI unless backend already supports it".
    // Backend supports it, but I need a token.
    // For Step 3, let's just try to hit the health endpoint or similar if mon requires auth?
    // Let's check backend auth middleware usage.
    
    // Ah, checking routes... monitors routes are protected.
    // "router.use(verifyToken);" in monitor.routes.js?
    // Let's assume for this step, we just want to prove connection. Or we might fail with 401, which proves connection too.
    // Or we can register a user quickly via curl/postman and hardcode a token?
    // User Instructions: "Connect frontend to backend (GET /monitors using fetch)"
    
    // Let's try to fetch. If 401, we display "Connected (401 Unauthorized)".
    
    fetch('/monitors')
      .then(res => {
        if (res.status === 401) return 'Connected to Backend (Unauthorized - Need Login)'
        return res.json().then(data => JSON.stringify(data))
      })
      .then(data => {
        setMessage(typeof data === 'string' ? data : 'Connected! Data received.')
        console.log(data)
      })
      .catch(err => setMessage('Error connecting: ' + err.message))
  }, [])

  return (
    <div>
      <h1>Frontend running</h1>
      <p>Backend Status: {message}</p>
    </div>
  )
}

export default App
