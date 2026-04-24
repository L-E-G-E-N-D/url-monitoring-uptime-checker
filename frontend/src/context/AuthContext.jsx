import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]))
        setToken(storedToken)
        setUser({ 
          token: storedToken,
          name: payload.name,
          picture: payload.picture,
          email: payload.email
        })
      } catch (e) {
        console.error('Failed to parse token', e)
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const login = (token) => {
    localStorage.setItem('token', token)
    const payload = JSON.parse(atob(token.split('.')[1]))
    setToken(token)
    setUser({ 
      token,
      name: payload.name,
      picture: payload.picture,
      email: payload.email
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
