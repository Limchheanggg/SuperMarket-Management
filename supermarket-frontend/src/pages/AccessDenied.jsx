import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AccessDenied() {
  const { user } = useAuth()
  return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ textAlign:'center', maxWidth:480, padding:40 }}>
        <div style={{ fontSize:80, marginBottom:20 }}>🚫</div>
        <h1 style={{ fontSize:28, fontWeight:800, color:'#111827', marginBottom:12 }}>Access Denied</h1>
        <p style={{ color:'#6b7280', fontSize:16, marginBottom:8 }}>
          This area is restricted to <strong>Admin</strong> and <strong>Manager</strong> roles only.
        </p>
        <p style={{ color:'#9ca3af', fontSize:14, marginBottom:32 }}>
          Your current role: <span style={{ background:'#f3f4f6', padding:'2px 10px', borderRadius:99, fontWeight:700, color:'#374151' }}>{user?.role || 'unknown'}</span>
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
          <Link to="/" style={{ padding:'12px 24px', background:'linear-gradient(135deg,#15803d,#22c55e)', color:'#fff', borderRadius:12, fontWeight:700, textDecoration:'none', fontSize:14 }}>
            🏠 Go Home
          </Link>
          <Link to="/shop" style={{ padding:'12px 24px', background:'#f3f4f6', color:'#374151', borderRadius:12, fontWeight:700, textDecoration:'none', fontSize:14 }}>
            🛒 Browse Shop
          </Link>
        </div>
      </div>
    </div>
  )
}
