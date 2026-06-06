import { useState, useEffect } from 'react'
import API from '../../services/api'
import './admin.css'
import { Link, Outlet, useLocation } from 'react-router-dom'

const NAV = [
  { label:'Dashboard', path:'/admin',            color:'#6366f1',
    icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
  { label:'Inventory',  path:'/admin/inventory', color:'#0891b2',
    icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> },
  { label:'Suppliers',  path:'/admin/suppliers', color:'#ea580c',
    icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
  { label:'Users',      path:'/admin/users',     color:'#7c3aed',
    icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { label:'Sales',      path:'/admin/sales',     color:'#16a34a',
    icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> },
  { label:'Membership', path:'/admin/membership',color:'#d97706',
    icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { label:'Analytics',    path:'/admin/reports',   color:'#db2777',
    icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
]

const AMSLogoMark = ({ size=40 }) => {
  const s=size/44, bw=Math.round(7*s), bh1=Math.round(22*s), bh2=Math.round(14*s), bh3=Math.round(30*s)
  const g=Math.round(3.5*s), ph=Math.round(7*s), pb=Math.round(9*s), br=`${Math.round(2*s)}px ${Math.round(2*s)}px 1px 1px`
  return (
    <div style={{ width:size, height:size, borderRadius:Math.round(size*0.22),
      background:'linear-gradient(160deg,#1e2472 0%,#0d1240 100%)',
      display:'flex', alignItems:'flex-end', justifyContent:'center',
      padding:`0 ${ph}px ${pb}px`, gap:g, flexShrink:0, position:'relative', overflow:'hidden',
      boxShadow:'0 4px 18px rgba(13,18,64,0.55)' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'44%', background:'linear-gradient(180deg,rgba(255,255,255,0.12),transparent)', pointerEvents:'none' }}/>
      <div style={{ width:bw, height:bh1, borderRadius:br, background:'rgba(255,255,255,0.93)', flexShrink:0, position:'relative', zIndex:1 }}/>
      <div style={{ width:bw, height:bh2, borderRadius:br, background:'#c0272d', flexShrink:0, position:'relative', zIndex:1 }}/>
      <div style={{ width:bw, height:bh3, borderRadius:br, background:'rgba(255,255,255,0.93)', flexShrink:0, position:'relative', zIndex:1 }}/>
      <div style={{ position:'absolute', bottom:Math.round(4*s), left:ph, right:ph, height:Math.round(2.5*s), background:'#c0272d', borderRadius:99, zIndex:1 }}/>
    </div>
  )
}

export default function AdminLayout() {
  const location  = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [lowStockCount, setLowStockCount] = useState(0)

  useEffect(() => {
    API.get('/api/inventory/').then(res => {
      const items = res.data || []
      setLowStockCount(items.filter(i => i.Status !== 'In Stock').length)
    }).catch(() => {})
  }, [])


  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f4f6fa', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes slideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        .al-item {
          display:flex; align-items:center; gap:12px; padding:11px 14px;
          border-radius:12px; text-decoration:none;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:13.5px;
          font-weight:600; color:#64748b; transition:all .2s;
          margin-bottom:3px; white-space:nowrap; overflow:hidden;
          border:1px solid transparent; position:relative;
        }
        .al-item::before {
          content:''; position:absolute; left:0; top:4px; bottom:4px;
          width:3px; border-radius:0 2px 2px 0;
          background:var(--item-color,#6366f1);
          transform:scaleY(0); transition:transform .2s;
        }
        .al-item:hover { background:rgba(255,255,255,.07); color:#cbd5e1; }
        .al-item.active { color:#fff; }
        .al-item.active::before { transform:scaleY(1); }
        .al-btn { width:28px; height:28px; border-radius:8px; background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.1); color:#64748b; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .2s; }
        .al-btn:hover { background:rgba(255,255,255,.12); color:#cbd5e1; }
        .al-back { display:flex; align-items:center; gap:12px; padding:11px 14px; border-radius:12px; text-decoration:none; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:600; color:#475569; transition:all .2s; white-space:nowrap; overflow:hidden; }
        .al-back:hover { background:rgba(255,255,255,.05); color:#94a3b8; }
      `}</style>

      {/* SIDEBAR */}
      <aside style={{
        width: collapsed ? 68 : 234,
        background:'linear-gradient(180deg,#0d1240 0%,#0f172a 60%,#1a2035 100%)',
        padding:'18px 10px', display:'flex', flexDirection:'column',
        transition:'width .28s cubic-bezier(.4,0,.2,1)', flexShrink:0,
        position:'sticky', top:0, height:'100vh', overflowY:'auto', overflowX:'hidden',
        borderRight:'1px solid rgba(255,255,255,.04)',
      }}>

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:collapsed?'center':'space-between', padding:'0 4px', marginBottom:28 }}>
          {!collapsed && (
            <div style={{ display:'flex', alignItems:'center', gap:10, animation:'slideIn .3s ease' }}>
              <AMSLogoMark size={36}/>
              <div>
                <div style={{ fontWeight:800, fontSize:15, lineHeight:1.2 }}>
                  <span style={{ color:'#f1f5f9' }}>AMS</span>
                  <span style={{ color:'#c0272d' }}> Mart</span>
                </div>
                <div style={{ fontSize:9, color:'#334155', fontWeight:700, letterSpacing:2, textTransform:'uppercase', marginTop:1 }}>
                  ADMIN PANEL
                </div>
              </div>
            </div>
          )}
          {collapsed && <AMSLogoMark size={36}/>}
          {!collapsed && (
            <button className="al-btn" onClick={() => setCollapsed(true)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
          )}
        </div>

        {collapsed && (
          <button className="al-btn" onClick={() => setCollapsed(false)} style={{ margin:'0 auto 20px', width:36, height:36 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        )}

        {!collapsed && (
          <div style={{ fontSize:10, fontWeight:700, color:'#2d3a52', letterSpacing:2, textTransform:'uppercase', padding:'0 14px', marginBottom:10 }}>
            Menu
          </div>
        )}

        <nav style={{ flex:1 }}>
          {NAV.map((item,i) => {
            const active = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path}
                className={`al-item${active?' active':''}`}
                title={collapsed ? item.label : ''}
                style={{
                  '--item-color': item.color,
                  animation:`slideIn .3s ease ${i*.04}s both`,
                  ...(active ? {
                    background:`linear-gradient(135deg,${item.color}28,${item.color}14)`,
                    color:item.color, borderColor:`${item.color}25`,
                  } : {})
                }}>
                <span style={{ flexShrink:0, opacity:active?1:0.55, color:active?item.color:'currentColor', transition:'color .2s' }}>{item.icon}</span>
                {!collapsed && <span style={{ transition:'opacity .2s' }}>{item.label}</span>}
                {!collapsed && active && (
                  <span style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:item.color, flexShrink:0, boxShadow:`0 0 8px ${item.color}` }}/>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div style={{ height:1, background:'rgba(255,255,255,.06)', margin:'12px 4px' }}/>

        {/* Back to store */}
        <Link to="/" className="al-back" title={collapsed?'Back to Store':''}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, opacity:.5 }}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          {!collapsed && <span>Back to Store</span>}
        </Link>
      </aside>

      {/* MAIN */}
      <main style={{ flex:1, overflowY:'auto', minHeight:'100vh' }}>
        <Outlet/>
      </main>
    </div>
  )
}

