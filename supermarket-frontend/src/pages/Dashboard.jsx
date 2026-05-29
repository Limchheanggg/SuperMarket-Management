import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getOrders } from '../services/api'
import API from '../services/api'

export default function Dashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const name = user?.name || user?.email || 'Customer'

  useEffect(() => {
    Promise.all([
      getOrders().catch(() => ({ data: [] })),
      API.get('/api/inventory/').catch(() => ({ data: [] }))
    ]).then(([ordRes, invRes]) => {
      setOrders(ordRes.data || [])
      setInventory(invRes.data || [])
    }).finally(() => setLoading(false))
  }, [])

  const totalSpent = orders.reduce((s, o) => s + Number(o.total || 0), 0)
  const lowStock = inventory.filter(i => i.Status !== 'In Stock')

  const SIDEBAR_LINKS = [
    ['🏠', 'Dashboard', '/dashboard'],
    ['📦', 'My Orders', '/orders'],
    ['❤️', 'Wishlist', '/wishlist'],
    ['⚙️', 'Settings', '/account'],
  ]

  return (
    <div className="page-enter">
      <div style={{ background:'#fff', borderBottom:'1px solid #e5e7eb', padding:'12px 0' }}>
        <div className="container">
          <span style={{ fontSize:13, color:'#6b7280', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
            🏠 Home › <strong style={{ color:'#111827' }}>My Dashboard</strong>
          </span>
        </div>
      </div>

      <div className="container" style={{ padding:'36px 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', minHeight:'70vh', background:'#fff', borderRadius:18, overflow:'hidden', border:'1.5px solid #e5e7eb', boxShadow:'0 4px 20px rgba(0,0,0,.06)' }}>

          {/* Sidebar */}
          <aside style={{ background:'linear-gradient(180deg,#0f172a,#1e293b)', padding:'28px 12px', display:'flex', flexDirection:'column' }}>
            <div style={{ padding:'0 8px 24px', borderBottom:'1px solid rgba(255,255,255,.07)', marginBottom:12 }}>
              <div style={{ width:52, height:52, borderRadius:15, background:'linear-gradient(135deg,#16a34a,#22c55e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:800, color:'#fff', marginBottom:10, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                {name[0].toUpperCase()}
              </div>
              <div style={{ color:'#f1f5f9', fontWeight:700, fontSize:15, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{name}</div>
              <div style={{ color:'#64748b', fontSize:12, marginTop:2 }}>
                {user?.role === 'admin' ? '🔴 Admin' : '⭐ Gold Member'}
              </div>
            </div>
            <nav style={{ flex:1 }}>
              {SIDEBAR_LINKS.map(([icon, label, to]) => (
                <Link key={to} to={to}
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', color:'#94a3b8', fontSize:14, fontWeight:600, textDecoration:'none', borderRadius:10, marginBottom:4, transition:'all .2s', fontFamily:"'Plus Jakarta Sans',sans-serif" }}
                  onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,.08)'; e.currentTarget.style.color='#e2e8f0' }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#94a3b8' }}>
                  <span style={{ fontSize:18 }}>{icon}</span> {label}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link to="/admin"
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', color:'#a78bfa', fontSize:14, fontWeight:700, textDecoration:'none', borderRadius:10, marginBottom:4, background:'rgba(124,58,237,.15)', border:'1px solid rgba(124,58,237,.3)', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                  <span style={{ fontSize:18 }}>⚙️</span> Admin Panel
                </Link>
              )}
            </nav>
          </aside>

          {/* Content */}
          <div style={{ padding:28, background:'#f8fafc' }}>
            <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, fontWeight:800, color:'#0f172a', marginBottom:20 }}>
              Good day, {name.split(' ')[0]}! 👋
            </h2>

            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
              {[
                ['Total Orders', orders.length, '#6366f1', 'linear-gradient(135deg,#eef2ff,#e0e7ff)'],
                ['Pending', orders.filter(o=>o.status==='Processing').length, '#d97706', 'linear-gradient(135deg,#fffbeb,#fef3c7)'],
                ['Loyalty Points', '1,240', '#16a34a', 'linear-gradient(135deg,#f0fdf4,#dcfce7)'],
                ['Total Spent', `$${totalSpent.toFixed(2)}`, '#db2777', 'linear-gradient(135deg,#fdf2f8,#fce7f3)'],
              ].map(([l,v,c,bg]) => (
                <div key={l} style={{ background:bg, borderRadius:14, padding:'18px 20px', border:`1.5px solid ${c}22` }}>
                  <div style={{ fontSize:12, color:'#64748b', marginBottom:6, fontWeight:600, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{l}</div>
                  <div style={{ fontSize:26, fontWeight:800, color:c, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              {/* Recent Orders */}
              <div style={{ background:'#fff', borderRadius:14, padding:20, border:'1.5px solid #e5e7eb' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                  <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, fontWeight:800, color:'#0f172a' }}>Recent Orders</h3>
                  <Link to="/orders" style={{ fontSize:12, color:'#6366f1', fontWeight:700, textDecoration:'none' }}>View all →</Link>
                </div>
                {loading ? <div style={{ textAlign:'center', color:'#94a3b8', padding:20 }}>Loading…</div>
                  : orders.length === 0 ? (
                    <div style={{ textAlign:'center', color:'#94a3b8', padding:20, fontSize:13 }}>
                      No orders yet. <Link to="/shop" style={{ color:'#16a34a', fontWeight:700 }}>Start shopping!</Link>
                    </div>
                  ) : orders.slice(0, 5).map(o => (
                    <div key={o.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:'1px solid #f8fafc', fontSize:13 }}>
                      <span style={{ color:'#16a34a', fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{o.id}</span>
                      <span className={`status status-${(o.status||'pending').toLowerCase()}`}>{o.status}</span>
                      <strong style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>${Number(o.total||0).toFixed(2)}</strong>
                    </div>
                  ))
                }
              </div>

              {/* Loyalty Program */}
              <div style={{ background:'#fff', borderRadius:14, padding:20, border:'1.5px solid #e5e7eb' }}>
                <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, fontWeight:800, color:'#0f172a', marginBottom:16 }}>🎁 Loyalty Program</h3>
                <div style={{ background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderRadius:12, padding:16, marginBottom:16, border:'1px solid #86efac' }}>
                  <div style={{ fontSize:30, fontWeight:800, color:'#16a34a', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>1,240 pts</div>
                  <div style={{ fontSize:13, color:'#15803d', marginTop:4 }}>760 points away from Platinum!</div>
                </div>
                <div style={{ background:'#e5e7eb', height:8, borderRadius:99, overflow:'hidden', marginBottom:6 }}>
                  <div style={{ background:'linear-gradient(90deg,#16a34a,#22c55e)', height:'100%', width:'62%', borderRadius:99 }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#94a3b8', marginBottom:16 }}>
                  <span>Gold (1,000)</span><span>Platinum (2,000)</span>
                </div>
                <button style={{ width:'100%', padding:'10px', borderRadius:10, border:'1.5px solid #86efac', background:'#f0fdf4', color:'#16a34a', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                  Redeem Points
                </button>
              </div>
            </div>

            {/* Low Stock Alert for admin */}
            {user?.role === 'admin' && lowStock.length > 0 && (
              <div style={{ marginTop:16, background:'#fffbeb', borderRadius:14, padding:18, border:'1.5px solid #fcd34d' }}>
                <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14, fontWeight:800, color:'#d97706', marginBottom:12 }}>
                  ⚠️ {lowStock.length} Low Stock Items
                </h3>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                  {lowStock.slice(0,6).map(item => (
                    <div key={item.Product_ID} style={{ background:'#fff', borderRadius:8, padding:'10px 12px', border:'1px solid #fde68a', fontSize:12 }}>
                      <div style={{ fontWeight:700, color:'#0f172a', marginBottom:2 }}>{item.Name}</div>
                      <div style={{ color:'#d97706', fontWeight:600 }}>{item.Quantity} left</div>
                    </div>
                  ))}
                </div>
                <Link to="/admin/inventory" style={{ display:'inline-block', marginTop:10, color:'#d97706', fontWeight:700, fontSize:13, textDecoration:'none' }}>
                  View all in inventory →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
