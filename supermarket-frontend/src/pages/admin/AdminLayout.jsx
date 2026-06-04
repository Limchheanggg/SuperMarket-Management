import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const NAV = [
  { label:'Dashboard', path:'/admin',            color:'#6366f1',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
  { label:'Inventory',  path:'/admin/inventory', color:'#0891b2',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> },
  { label:'Users',      path:'/admin/users',     color:'#7c3aed',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { label:'Sales',      path:'/admin/sales',     color:'#16a34a',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> },
  { label:'Membership', path:'/admin/membership',color:'#d97706',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { label:'Reports',    path:'/admin/reports',   color:'#db2777',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
]

// AMS Logo mark — matches your brand exactly
const AMSLogoMark = ({ size = 40 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.26,
    background: 'linear-gradient(145deg,#1a1f5e 0%,#0d1240 100%)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    padding: `${size * 0.12}px ${size * 0.14}px ${size * 0.14}px`,
    gap: size * 0.07, flexShrink: 0,
    boxShadow: '0 4px 16px rgba(13,18,64,0.45)',
    position: 'relative', overflow: 'hidden',
  }}>
    {/* Shine overlay */}
    <div style={{ position:'absolute', top:0, left:0, right:0, height:'45%', background:'linear-gradient(180deg,rgba(255,255,255,0.13) 0%,transparent 100%)', borderRadius: `${size*0.26}px ${size*0.26}px 0 0` }} />
    {/* Bar 1 — tall left, white */}
    <div style={{ width: size*0.155, height: size*0.62, borderRadius: size*0.04, background: 'rgba(255,255,255,0.92)', flexShrink:0 }} />
    {/* Bar 2 — medium middle, red */}
    <div style={{ width: size*0.155, height: size*0.38, borderRadius: size*0.04, background: '#c0272d', flexShrink:0 }} />
    {/* Bar 3 — tall right, white */}
    <div style={{ width: size*0.155, height: size*0.72, borderRadius: size*0.04, background: 'rgba(255,255,255,0.92)', flexShrink:0 }} />
    {/* Red underline */}
    <div style={{ position:'absolute', bottom: size*0.1, left: size*0.1, right: size*0.1, height: size*0.055, background:'#c0272d', borderRadius: 99 }} />
  </div>
)

export default function AdminLayout() {
  const location  = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f1f5f9', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .al-item{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:11px;text-decoration:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:13.5px;font-weight:600;color:#64748b;transition:all .2s;margin-bottom:3px;white-space:nowrap;overflow:hidden;border:1.5px solid transparent}
        .al-item:hover{background:rgba(255,255,255,.07);color:#cbd5e1;border-color:rgba(255,255,255,.06)}
        .al-item.active{color:#fff;border-color:rgba(255,255,255,.1)}
        .al-collapse-btn{width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:#64748b;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s}
        .al-collapse-btn:hover{background:rgba(255,255,255,.12);color:#cbd5e1}
        .al-back{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:11px;text-decoration:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:600;color:#475569;transition:all .2s;white-space:nowrap;overflow:hidden}
        .al-back:hover{background:rgba(255,255,255,.05);color:#94a3b8}
      `}</style>

      {/* SIDEBAR */}
      <aside style={{
        width: collapsed ? 68 : 230,
        background: 'linear-gradient(180deg,#0d1240 0%,#0f172a 60%,#1e293b 100%)',
        padding: '18px 10px',
        display: 'flex', flexDirection: 'column',
        transition: 'width .28s cubic-bezier(.4,0,.2,1)',
        flexShrink: 0, position: 'sticky', top: 0,
        height: '100vh', overflowY: 'auto', overflowX: 'hidden',
        borderRight: '1px solid rgba(255,255,255,.05)',
      }}>

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', justifyContent: collapsed ? 'center' : 'space-between', padding:'0 4px', marginBottom:28 }}>
          {!collapsed && (
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <AMSLogoMark size={38} />
              <div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:15, lineHeight:1.2 }}>
                  <span style={{ color:'#f1f5f9' }}>AMS</span>
                  <span style={{ color:'#c0272d' }}> Mart</span>
                </div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:9, color:'#475569', fontWeight:700, letterSpacing:2, textTransform:'uppercase', marginTop:1 }}>
                  ADMIN PANEL
                </div>
              </div>
            </div>
          )}
          {collapsed && <AMSLogoMark size={38} />}
          {!collapsed && (
            <button className="al-collapse-btn" onClick={() => setCollapsed(true)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button className="al-collapse-btn" onClick={() => setCollapsed(false)} style={{ margin:'0 auto 20px', width:36, height:36 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        )}

        {/* Section label */}
        {!collapsed && (
          <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:10, fontWeight:700, color:'#334155', letterSpacing:1.8, textTransform:'uppercase', padding:'0 14px', marginBottom:10 }}>
            Menu
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex:1 }}>
          {NAV.map(item => {
            const active = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path}
                className={`al-item${active ? ' active' : ''}`}
                title={collapsed ? item.label : ''}
                style={active ? {
                  background: `linear-gradient(135deg,${item.color}28,${item.color}18)`,
                  color: item.color,
                  borderColor: `${item.color}30`,
                  boxShadow: `inset 3px 0 0 ${item.color}`,
                } : {}}>
                <span style={{ flexShrink:0, opacity: active ? 1 : 0.65 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && active && (
                  <span style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:item.color, flexShrink:0 }} />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,.06)', paddingTop:14, marginTop:14 }}>
          <Link to="/" className="al-back" title={collapsed ? 'Back to Store' : ''}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, opacity:.6 }}>
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            {!collapsed && <span>Back to Store</span>}
          </Link>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex:1, overflowY:'auto', minHeight:'100vh' }}>
        <Outlet />
      </main>
    </div>
  )
}
