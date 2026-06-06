import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/api'

const TIER_COLORS    = { Bronze:'#ea580c', Silver:'#64748b', Gold:'#ca8a04', Platinum:'#7c3aed' }
const TIER_NEXT      = { Bronze:'Silver', Silver:'Gold', Gold:'Platinum', Platinum:null }
const TIER_THRESHOLD = { Bronze:0, Silver:50, Gold:200, Platinum:500 }

function getTier(spent) {
  if (spent>=500) return 'Platinum'
  if (spent>=200) return 'Gold'
  if (spent>=50)  return 'Silver'
  return 'Bronze'
}

function TierBadge({ tier }) {
  const c = TIER_COLORS[tier]||'#ea580c'
  const labels = { Bronze:'Bronze', Silver:'Silver', Gold:'Gold', Platinum:'Platinum' }
  return (
    <span style={{ fontSize:11, fontWeight:800, padding:'3px 10px', borderRadius:99,
      background:`${c}22`, color:c, border:`1px solid ${c}44`, letterSpacing:.5 }}>
      {labels[tier]}
    </span>
  )
}

const NAV = [
  { label:'Dashboard', path:'/dashboard', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
  { label:'My Orders', path:'/orders',    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { label:'Wishlist',  path:'/wishlist',  icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
  { label:'Settings',  path:'/account',  icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats]   = useState({ orders:0, spent:0, points:0, tier:'Bronze' })
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const name = user?.full_name || user?.name || user?.email || 'Customer'
  const firstName = name.split(' ')[0]

  useEffect(() => {
    const load = async () => {
      try {
        const [salesRes, memRes] = await Promise.all([
          API.get('/api/sales/').catch(()=>({data:[]})),
          API.get(`/api/membership/me?user_id=${user?.id}`).catch(()=>({data:null})),
        ])
        const sales = salesRes.data || []
        const spent = sales.reduce((s,o) => s+Number(o.Total_Amount||0), 0)
        setOrders(sales.slice(0,5))
        const mem = memRes.data
        setStats({
          orders: sales.length,
          spent:  mem?.total_spent || spent,
          points: mem?.points || Math.floor(spent),
          tier:   mem?.tier   || getTier(spent),
        })
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const tc      = TIER_COLORS[stats.tier] || '#ea580c'
  const nextTier = TIER_NEXT[stats.tier]
  const nextVal  = nextTier ? TIER_THRESHOLD[nextTier] : 500
  const currVal  = TIER_THRESHOLD[stats.tier]
  const progress = nextTier ? Math.min(100,((stats.spent-currVal)/(nextVal-currVal))*100) : 100

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#f4f6fa', minHeight:'100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeLeft{ from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .nav-link { display:flex; align-items:center; gap:10px; padding:11px 16px; border-radius:10px; text-decoration:none; font-size:14px; font-weight:600; color:#94a3b8; transition:all .2s; border:1px solid transparent; }
        .nav-link:hover { background:rgba(255,255,255,.08); color:#e2e8f0; }
        .nav-link.active { background:rgba(192,39,45,.15); color:#fca5a5; border-color:rgba(192,39,45,.25); }
        .stat-card { border-radius:16px; padding:20px; border:1.5px solid transparent; transition:transform .3s; cursor:default; }
        .stat-card:hover { transform:translateY(-4px); }
        .order-row { display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #f4f6fa; transition:all .2s; border-radius:8px; }
        .order-row:hover { background:#f9fafb; padding-left:8px; padding-right:8px; }
        .quick-btn { padding:13px; border-radius:12px; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:8px; font-size:14px; font-weight:700; color:#fff; transition:all .25s; }
        .quick-btn:hover { transform:translateY(-3px); opacity:.9; }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ background:'#fff', borderBottom:'1px solid #eee', padding:'12px 0' }}>
        <div className="container">
          <span style={{ fontSize:13, color:'#9ca3af' }}>
            <Link to="/" style={{ color:'#9ca3af', textDecoration:'none' }}>Home</Link> ›{' '}
            <strong style={{ color:'#111827' }}>My Dashboard</strong>
          </span>
        </div>
      </div>

      <div className="container" style={{ padding:'32px 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:24, minHeight:'80vh' }}>

          {/* Sidebar */}
          <aside style={{ background:'linear-gradient(180deg,#0d1240,#0f172a 60%,#1a2035)',
            borderRadius:20, padding:'24px 12px', display:'flex', flexDirection:'column',
            boxShadow:'0 8px 32px rgba(0,0,0,.15)', animation:'fadeLeft .5s ease forwards' }}>

            {/* Avatar */}
            <div style={{ padding:'0 8px 20px', borderBottom:'1px solid rgba(255,255,255,.07)', marginBottom:16 }}>
              <div style={{ width:52, height:52, borderRadius:14,
                background:`linear-gradient(135deg,${tc},${tc}88)`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:20, fontWeight:900, color:'#fff', marginBottom:12,
                boxShadow:`0 4px 16px ${tc}44` }}>
                {firstName[0]?.toUpperCase()}
              </div>
              <div style={{ color:'#f1f5f9', fontWeight:700, fontSize:14, marginBottom:4 }}>{name}</div>
              <TierBadge tier={stats.tier}/>
            </div>

            <nav style={{ flex:1, display:'flex', flexDirection:'column', gap:3 }}>
              {NAV.map(n => (
                <Link key={n.path} to={n.path} className={`nav-link${location.pathname===n.path?' active':''}`}>
                  <span style={{ opacity:.7 }}>{n.icon}</span>
                  {n.label}
                </Link>
              ))}
              {['admin','manager'].includes(user?.role) && (
                <Link to="/admin" style={{ display:'flex', alignItems:'center', gap:10,
                  padding:'11px 16px', borderRadius:10, textDecoration:'none',
                  fontSize:14, fontWeight:700, color:'#a78bfa', marginTop:8,
                  background:'rgba(124,58,237,.12)', border:'1px solid rgba(124,58,237,.25)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                  Admin Panel
                </Link>
              )}
            </nav>

            <div style={{ marginTop:16, padding:'12px 8px', borderTop:'1px solid rgba(255,255,255,.06)' }}>
              <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, fontSize:13,
                fontWeight:600, color:'#475569', textDecoration:'none' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Back to Store
              </Link>
            </div>
          </aside>

          {/* Main */}
          <div style={{ display:'flex', flexDirection:'column', gap:20, animation:'fadeUp .5s ease .1s both' }}>

            {/* Greeting */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:900,
                  color:'#0f172a', margin:'0 0 4px' }}>
                  Good day, {firstName}
                </h1>
                <p style={{ color:'#94a3b8', fontSize:14, margin:0 }}>
                  Welcome back to your dashboard
                </p>
              </div>
              <TierBadge tier={stats.tier}/>
            </div>

            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
              {[
                { label:'Total Orders',   value: stats.orders,                 color:'#6366f1', bg:'linear-gradient(135deg,#eef2ff,#e0e7ff)' },
                { label:'Loyalty Points', value:`${stats.points} pts`,         color: tc,       bg:`linear-gradient(135deg,${tc}15,${tc}08)` },
                { label:'Total Spent',    value:`$${stats.spent.toFixed(2)}`,  color:'#db2777', bg:'linear-gradient(135deg,#fdf2f8,#fce7f3)' },
              ].map((s,i) => (
                <div key={s.label} className="stat-card" style={{ background:s.bg, borderColor:`${s.color}22`,
                  animationDelay:`${i*.1}s` }}>
                  <div style={{ fontSize:11, fontWeight:800, color:'#9ca3af', textTransform:'uppercase',
                    letterSpacing:1, marginBottom:8 }}>{s.label}</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:900, color:s.color }}>
                    {loading ? '—' : s.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Loyalty Card */}
            <div style={{ background:'#fff', borderRadius:16, padding:24,
              border:'1px solid rgba(0,0,0,.06)', boxShadow:'0 2px 12px rgba(0,0,0,.04)' }}>
              <h3 style={{ fontSize:15, fontWeight:800, color:'#0f172a', margin:'0 0 16px' }}>
                Loyalty Program
              </h3>
              <div style={{ background:`linear-gradient(135deg,${tc}12,${tc}06)`,
                borderRadius:12, padding:'16px 20px', marginBottom:16, border:`1px solid ${tc}30` }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:32,
                      fontWeight:900, color:tc, lineHeight:1 }}>{stats.points}</div>
                    <div style={{ fontSize:12, color:'#94a3b8', marginTop:4 }}>points earned</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'#374151' }}>{stats.tier} Member</div>
                    <div style={{ fontSize:12, color:'#94a3b8' }}>${stats.spent.toFixed(2)} spent</div>
                  </div>
                </div>
              </div>
              <div style={{ background:'#f0f0f0', height:8, borderRadius:99, overflow:'hidden', marginBottom:8 }}>
                <div style={{ height:'100%', width:`${Math.max(progress,2)}%`,
                  background:`linear-gradient(90deg,${tc},${tc}88)`, borderRadius:99,
                  transition:'width .6s ease' }}/>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#94a3b8' }}>
                <span>{stats.tier} (${TIER_THRESHOLD[stats.tier]})</span>
                {nextTier
                  ? <span>{nextTier} — ${Math.max(0,nextVal-stats.spent).toFixed(2)} away</span>
                  : <span>Maximum tier reached</span>}
              </div>
            </div>

            {/* Recent Orders */}
            <div style={{ background:'#fff', borderRadius:16, padding:24,
              border:'1px solid rgba(0,0,0,.06)', boxShadow:'0 2px 12px rgba(0,0,0,.04)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <h3 style={{ fontSize:15, fontWeight:800, color:'#0f172a', margin:0 }}>Recent Orders</h3>
                <Link to="/orders" style={{ fontSize:12, fontWeight:700, color:'#c0272d', textDecoration:'none' }}>View all →</Link>
              </div>
              {loading ? (
                <div style={{ display:'flex', justifyContent:'center', padding:24 }}>
                  <div style={{ width:24, height:24, border:'3px solid #f0f0f0', borderTopColor:'#c0272d', borderRadius:'50%', animation:'spin 1s linear infinite' }}/>
                </div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign:'center', padding:'24px 0', color:'#94a3b8' }}>
                  <p style={{ fontSize:13 }}>No orders yet. <Link to="/shop" style={{ color:'#c0272d', fontWeight:700 }}>Start shopping!</Link></p>
                </div>
              ) : orders.map((o,i) => (
                <div key={i} className="order-row">
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:10, background:'#fff0f0',
                      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:'#0f172a' }}>#{o.Sale_ID}</div>
                      <div style={{ fontSize:11, color:'#94a3b8' }}>{o.date}</div>
                    </div>
                  </div>
                  <strong style={{ fontSize:14, color:'#16a34a' }}>${Number(o.Total_Amount||0).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {[
                { label:'Browse Shop',  path:'/shop',     bg:'linear-gradient(135deg,#c0272d,#e53935)' },
                { label:'My Orders',    path:'/orders',   bg:'linear-gradient(135deg,#6366f1,#8b5cf6)' },
                { label:'Wishlist',     path:'/wishlist', bg:'linear-gradient(135deg,#db2777,#ec4899)' },
              ].map(b => (
                <Link key={b.path} to={b.path} className="quick-btn" style={{ background:b.bg }}>
                  {b.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
