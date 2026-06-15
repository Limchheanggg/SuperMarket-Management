import { createContext, useContext, useState, useEffect } from 'react'
import API from '../services/api'
const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }
    API.get('/api/auth/me')
      .then(res => {
        const userData = { id:res.data.id, name:res.data.name, email:res.data.email, phone:res.data.phone, address:res.data.address, role:res.data.role||'customer', customer_id:res.data.customer_id, membership_tier:res.data.membership_tier }
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
      })
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('cart')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])
  const loginUser = (token, userData) => {
    localStorage.removeItem('cart')
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    window.dispatchEvent(new Event('userChanged'))
  }
  const logoutUser = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('cart')
    setUser(null)
    window.dispatchEvent(new Event('userChanged'))
  }
  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext)
