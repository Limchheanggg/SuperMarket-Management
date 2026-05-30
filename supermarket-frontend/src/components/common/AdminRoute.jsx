import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ADMIN_ROLES = ['admin', 'manager']

export default function AdminRoute() {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:40, marginBottom:12 }}>🌿</div>
        <p style={{ color:'#6b7280' }}>Loading…</p>
      </div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (!ADMIN_ROLES.includes(user.role)) return <Navigate to="/access-denied" replace />
  return <Outlet />
}
