import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AuthenticatedUser from './components/Auth/AuthenticatedUser.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthenticatedUser />
  </StrictMode>,
)
