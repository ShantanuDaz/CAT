import { useState } from 'react'
import { User, LogOut } from 'lucide-react'
import { signOut } from '../../lib/auth'
import UserProfile from './UserProfile'

const LogoutButton = () => {
  const [showProfile, setShowProfile] = useState(false)

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setShowProfile(true)}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          title="Profile"
        >
          <User size={20} />
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
    </>
  )
}

export default LogoutButton