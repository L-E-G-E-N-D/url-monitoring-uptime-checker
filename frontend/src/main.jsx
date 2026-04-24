import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

console.log('Main.jsx is running');

const root = createRoot(document.getElementById('root'));
console.log('Root created', root);

root.render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)

