import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import API from '../../services/api'

function useInView() {
  const ref = useRef(); const [v, setV] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if(e.isIntersecting) setV(true) }, { threshold:0.1 })
    if(ref.current) o.observe(ref.current); return () => o.disconnect()
  }, [])
  return [ref, v]
}

function Counter({ to, prefix='', suffix='' }) {
  const [n, setN] = useState(0); const [started, setStarted] = useState(false); const ref = useRef()
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if(e.isIntersecting) setStarted(true) }, { threshold:0.5 })
    if(ref.current) o.observe(ref.current); return () => o.disconnect()
  }, [])
  useEffect(() => {
    if(!started) return
    const num = parseFloat(String(to).replace(/[^0-9.]/g,'')) || 0
    if(num === 0) { setN(0); return }
    let cur = 0; const step = num/50
    const t = setInterval(() => { cur+=step; if(cur>=num){setN(num);clearInterval(t)}else setN(cur) }, 20)
    return () => clearInterval(t)
  }, [started, to])
  const isDecimal = parseFloat(String(to)) !== parseInt(String(to))
  return <span ref={ref}>{prefix}{isDecimal ? n.toFixed(2) : Math.floor(n)}{suffix}</span>
}

function DonutChart({ inStock, lowStock, outStock }) {
  const total = inStock+lowStock+outStock||1, r=32, cx=40, cy=40, circ=2*Math.PI*r
  const segs = [{v:inStock,c:'#22c55e'},{v:lowStock,c:'#f59e0b'},{v:outStock,c:'#ef4444'}]
  let off=0
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="10"/>
      {segs.map((s,i) => {
        const dash=(s.v/total)*circ, el=(
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.c} strokeWidth="10"
            strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={-off} strokeLinecap="round"
            style={{transform:'rotate(-90deg)',transformOrigin:'center'}}/>
        ); off+=dash; return el
      })}
      <text x="40" y="44" textAnchor="middle" style={{fontSize:11,fontWeight:800,fill:'#0f172a',fontFamily:'Plus Jakarta Sans,sans-serif'}}>{total}</text>
    </svg>
  )
}

const NAV_CARDS = [
  { label:'Inventory',  path:'/admin/inventory',  color:'#0891b2', grad:'linear-gradient(135deg,#0891b2,#06b6d4)',
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> },
  { label:'Suppliers',  path:'/admin/suppliers',  color:'#ea580c', grad:'linear-gradient(135deg,#ea580c,#f97316)',
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
  { label:'Users',      path:'/admin/users',      color:'#7c3aed', grad:'linear-gradient(135deg,#7c3aed,#8b5cf6)',
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { label:'Reports',    path:'/admin/reports',    color:'#db2777', grad:'linear-gradient(135deg,#db2777,#ec4899)',
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { label:'Membership', path:'/admin/membership', color:'#d97706', grad:'linear-gradient(135deg,#d97706,#f59e0b)',
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { label:'Sales',      path:'/admin/sales',      color:'#16a34a', grad:'linear-gradient(135deg,#16a34a,#22c55e)',
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> },
]

export default function AdminDashboard() {
  const [summary,     setSummary]     = useState(null)
  const [daily,       setDaily]       = useState(null)
  const [inventory,   setInventory]   = useState([])
  const [recentSales, setRecentSales] = useState([])
  const [loading,     setLoading]     = useState(true)
  const kpiRef = null
  const botRef = null
  const kpiVisible = true
  const botVisible = true

  useEffect(() => {
    Promise.all([
      API.get('/api/sales/reports/summary').catch(()=>({data:null})),
      API.get('/api/sales/reports/daily').catch(()=>({data:null})),
      API.get('/api/inventory/').catch(()=>({data:[]})),
      API.get('/api/sales/').catch(()=>({data:[]})),
    ]).then(([s,d,i,sa]) => {
      setSummary(s.data); setDaily(d.data)
      setInventory(i.data||[]); setRecentSales((sa.data||[]).slice(0,6))
    }).finally(()=>setLoading(false))
  }, [])

  const inStock  = inventory.filter(i=>i.Status==='In Stock').length
  const lowStock = inventory.filter(i=>i.Status==='Low Stock').length
  const outStock = inventory.filter(i=>i.Status==='Out of Stock').length
  const total    = inventory.length

  const KPI = [
    { label:"Today's Revenue",  value:`$${(daily?.total_revenue||0).toFixed(2)}`,  raw: daily?.total_revenue||0,   color:'#6366f1', bg:'linear-gradient(135deg,#eef2ff,#e0e7ff)', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
    { label:"Today's Sales",    value: daily?.total_sales??0,                       raw: daily?.total_sales||0,    color:'#16a34a', bg:'linear-gradient(135deg,#f0fdf4,#dcfce7)', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> },
    { label:"Need Restocking",  value: lowStock+outStock,                           raw: lowStock+outStock,        color:'#d97706', bg:'linear-gradient(135deg,#fffbeb,#fef3c7)', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
    { label:"Monthly Revenue",  value:`$${(summary?.monthly_revenue||0).toFixed(2)}`, raw: summary?.monthly_revenue||0, color:'#db2777', bg:'linear-gradient(135deg,#fdf2f8,#fce7f3)', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> },
  ]

  return (
    <div style={{ padding:28, fontFamily:"'Plus Jakarta Sans',sans-serif", minHeight:'100vh', background:'#f4f6fa' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeLeft{ from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulse   { 0%,100%{opacity:1}50%{opacity:.5} }
        @keyframes spin    { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        .kpi-card { border-radius:18px; padding:24px; transition:transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .3s; cursor:default; }
        .kpi-card:hover { transform:translateY(-6px); box-shadow:0 16px 40px rgba(0,0,0,.1); }
        .nav-card { border-radius:16px; padding:20px; text-decoration:none; display:flex; align-items:center; gap:14px; transition:all .3s cubic-bezier(.34,1.56,.64,1); border:1px solid rgba(255,255,255,.15); }
        .nav-card:hover { transform:translateY(-5px) scale(1.02); box-shadow:0 12px 32px rgba(0,0,0,.15); }
        .recent-row { display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #f4f6fa; transition:background .2s; border-radius:8px; }
        .recent-row:hover { background:#f9fafb; padding-left:8px; padding-right:8px; }
        .ad-card { background:#fff; border-radius:18px; padding:24px; border:1px solid rgba(0,0,0,.06); box-shadow:0 2px 12px rgba(0,0,0,.04); }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom:28, animation:'fadeLeft .5s ease forwards' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:'#c0272d', textTransform:'uppercase', letterSpacing:1.5, marginBottom:6 }}>
              Admin Panel
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:900, color:'#0f172a', margin:'0 0 6px' }}>
              Dashboard
            </h1>
            <p style={{ color:'#94a3b8', fontSize:14, margin:0 }}>
              {total} products · {inStock} in stock · {lowStock+outStock} need attention
            </p>
          </div>
          <Link to="/admin/sales" style={{ display:'inline-flex', alignItems:'center', gap:8,
            padding:'12px 24px', borderRadius:12,
            background:'linear-gradient(135deg,#c0272d,#e53935)', color:'#fff',
            fontSize:14, fontWeight:700, textDecoration:'none',
            boxShadow:'0 6px 20px rgba(192,39,45,.35)',
            transition:'all .25s' }}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={e=>e.currentTarget.style.transform='none'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Sale
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div ref={kpiRef} style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {KPI.map((k,i) => (
          <div key={k.label} className="kpi-card" style={{ background:k.bg, border:`1.5px solid ${k.color}22`,
            }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
              <div style={{ width:46, height:46, borderRadius:14, background:`${k.color}22`,
                display:'flex', alignItems:'center', justifyContent:'center', color:k.color }}>
                {k.icon}
              </div>
              <div style={{ fontSize:10, fontWeight:700, color:k.color, background:`${k.color}15`,
                padding:'4px 10px', borderRadius:99, textTransform:'uppercase', letterSpacing:.5 }}>
                Live
              </div>
            </div>
            <div style={{ fontSize:32, fontWeight:900, color:'#0f172a', lineHeight:1, marginBottom:6, letterSpacing:'-1px' }}>
              {loading ? <span style={{color:'#d1d5db'}}>—</span> : <Counter to={k.raw} prefix={String(k.value).startsWith('$')?'$':''} suffix={String(k.value).includes('%')?'%':''}/>}
            </div>
            <div style={{ fontSize:13, color:'#64748b', fontWeight:500 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 300px', gap:20, marginBottom:20 }}>

        {/* Recent Sales */}
        <div className="ad-card" style={{ }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h3 style={{ fontSize:16, fontWeight:800, color:'#0f172a', margin:0 }}>Recent Sales</h3>
            <Link to="/admin/sales" style={{ fontSize:12, fontWeight:700, color:'#c0272d', textDecoration:'none' }}>View all →</Link>
          </div>
          {loading ? (
            <div style={{ display:'flex', justifyContent:'center', padding:32 }}>
              <div style={{ width:28, height:28, border:'3px solid #f0f0f0', borderTopColor:'#c0272d', borderRadius:'50%', animation:'spin 1s linear infinite' }}/>
            </div>
          ) : recentSales.length === 0 ? (
            <div style={{ textAlign:'center', padding:'32px 0', color:'#94a3b8' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="1.5" style={{ marginBottom:12 }}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <p style={{ fontSize:13, margin:0 }}>No sales yet</p>
            </div>
          ) : recentSales.map((s,i) => (
            <div key={s.Sale_ID} className="recent-row" style={{ animationDelay:`${i*.04}s` }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#fff0f0,#ffe4e4)',
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#0f172a' }}>#{s.Sale_ID}</div>
                  <div style={{ fontSize:11, color:'#94a3b8' }}>{s.cashier || s.Customer || 'Walk-in'}</div>
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:14, fontWeight:800, color:'#16a34a' }}>${Number(s.Total_Amount||0).toFixed(2)}</div>
                <div style={{ fontSize:11, color:'#94a3b8' }}>{s.Payment_Method}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Inventory Status */}
        <div className="ad-card" style={{ }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h3 style={{ fontSize:16, fontWeight:800, color:'#0f172a', margin:0 }}>Inventory Status</h3>
            <Link to="/admin/inventory" style={{ fontSize:12, fontWeight:700, color:'#c0272d', textDecoration:'none' }}>View all →</Link>
          </div>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
            <DonutChart inStock={inStock} lowStock={lowStock} outStock={outStock}/>
          </div>
          {[['In Stock',inStock,'#22c55e','#f0fdf4'],['Low Stock',lowStock,'#f59e0b','#fffbeb'],['Out of Stock',outStock,'#ef4444','#fef2f2']].map(([l,v,c,bg]) => (
            <div key={l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'10px 14px', borderRadius:12, background:bg, marginBottom:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:c }}/>
                <span style={{ fontSize:13, fontWeight:600, color:'#374151' }}>{l}</span>
              </div>
              <span style={{ fontSize:16, fontWeight:900, color:c, fontFamily:"'Playfair Display',serif" }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop:12, padding:'10px 14px', borderRadius:12, background:'#f8fafc',
            border:'1px solid #f0f0f0', textAlign:'center' }}>
            <span style={{ fontSize:12, color:'#94a3b8' }}>Total: </span>
            <span style={{ fontSize:15, fontWeight:800, color:'#0f172a' }}>{total} products</span>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="ad-card" style={{ }}>
          <h3 style={{ fontSize:16, fontWeight:800, color:'#0f172a', margin:'0 0 16px' }}>Quick Navigation</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {NAV_CARDS.map((n,i) => (
              <Link key={n.path} to={n.path} className="nav-card"
                style={{ background:n.grad, animationDelay:`${i*.05}s` }}>
                <div style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,.2)',
                  display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', flexShrink:0 }}>
                  {n.icon}
                </div>
                <span style={{ fontSize:14, fontWeight:700, color:'#fff' }}>{n.label}</span>
                <svg style={{ marginLeft:'auto', color:'rgba(255,255,255,.6)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div ref={botRef} style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
        {[
          { label:'Total Products',  value: total,                             color:'#0891b2', bg:'#ecfeff', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> },
          { label:'Monthly Sales',   value: summary?.monthly_sales??0,         color:'#7c3aed', bg:'#f5f3ff', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
          { label:'Yearly Revenue',  value: `$${(summary?.yearly_revenue||0).toFixed(0)}`, color:'#16a34a', bg:'#f0fdf4', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg> },
          { label:'Yearly Sales',    value: summary?.yearly_sales??0,          color:'#db2777', bg:'#fdf2f8', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
        ].map((s,i) => (
          <div key={s.label} className="ad-card" style={{ display:'flex', alignItems:'center', gap:16,
            }}>
            <div style={{ width:50, height:50, borderRadius:14, background:s.bg,
              display:'flex', alignItems:'center', justifyContent:'center', color:s.color, flexShrink:0 }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize:24, fontWeight:900, color:s.color, letterSpacing:'-0.5px' }}>
                {loading ? '—' : s.value}
              </div>
              <div style={{ fontSize:12, color:'#94a3b8', fontWeight:500 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
