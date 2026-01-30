import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../App.css'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleRegister = (e) => {
    e.preventDefault()
    setError(null)

    fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => { throw new Error(err.error || 'Registration failed') })
      }
      return res.json()
    })
    .then(() => {
      navigate('/login')
    })
    .catch(err => setError(err.message))
  }

  return (
    <div className="container" style={{ maxWidth: '400px' }}>
      <h1>Register</h1>
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleRegister} className="auth-form">
        <div className="form-group">
          <label htmlFor="register-email">Email</label>
          <input 
            type="email" 
            id="register-email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="register-password">Password</label>
          <input 
            type="password" 
            id="register-password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="primary-btn">Register</button>
      </form>
      
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  )
}

export default Register
