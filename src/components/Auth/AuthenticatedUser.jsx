import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import LoginSignup from './LoginSignup'
import UserProfile from './UserProfile'
import App from '../../App'

const AuthenticatedUser = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null
      setUser(newUser)
      
      // Check if Google user needs to set username
      if (newUser && newUser.app_metadata?.provider === 'google' && !newUser.user_metadata?.username) {
        setShowProfile(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (showProfile) {
    return <UserProfile onClose={() => setShowProfile(false)} />
  }

  return user ? <App /> : <LoginSignup />
}

export default AuthenticatedUser