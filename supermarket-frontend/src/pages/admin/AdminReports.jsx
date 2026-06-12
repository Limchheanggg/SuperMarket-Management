import { useState, useEffect, useRef } from "react";
import API from "../../services/api";
import PaymentIcon from "../../components/PaymentIcon";

function useInView(t=0.1){const ref=useRef();const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:t});if(ref.current)o.observe(ref.current);return()=>o.disconnect()},[]);return[ref,v]}

/* ── BAR CHART ── */
function BarChart({ data, color='#c0272d', height=200 }) {
  const [hovered, setHovered] = useState(null)
  const max = Math.max(...data.map(d=>d.value), 1)
  const currentMonth = new Date().getMonth()
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:6, height, paddingBottom:24, position:'relative' }}>
      {data.map((d,i) => {
        const pct = (d.value/max)*100
        const isNow = i === currentMonth
        const isHov = hovered === i
        return (
          <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, height:'100%', justifyContent:'flex-end', position:'relative' }}
            onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}>
            {isHov && d.value > 0 && (
              <div style={{ position:'absolute', bottom:'100%', left:'50%', transform:'translateX(-50%)',
                background:'#0f172a', color:'#fff', fontSize:11, fontWeight:700,
                padding:'4px 8px', borderRadius:6, whiteSpace:'nowrap', marginBottom:4, zIndex:10,
                boxShadow:'0 4px 12px rgba(0,0,0,.2)' }}>
                ${d.value >= 1000 ? (d.value/1000).toFixed(1)+'k' : d.value.toFixed(0)}
              </div>
            )}
            <div style={{
              width:'100%', borderRadius:'4px 4px 0 0',
              background: isNow ? color : isHov ? color+'cc' : color+'44',
              height:`${Math.max(pct,2)}%`,
              transition:'all .3s cubic-bezier(.34,1.56,.64,1)',
              transform: isHov ? 'scaleY(1.03)' : 'scaleY(1)',
              transformOrigin:'bottom',
              cursor:'pointer',
            }}/>
            <div style={{ fontSize:9, fontWeight: isNow?800:500, color: isNow?color:'#94a3b8',
              position:'absolute', bottom:0, textAlign:'center', width:'100%' }}>
              {d.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── LINE CHART ── */
function LineChart({ data, color='#6366f1', height=180 }) {
  const max = Math.max(...data.map(d=>d.value),1)
  const w=700,padL=48,padR=16,padT=20,padB=30
  const chartW=w-padL-padR, chartH=height-padT-padB
  const points = data.map((d,i)=>({
    x: padL+(i/(data.length-1))*chartW,
    y: padT+chartH-(d.value/max)*chartH, ...d
  }))
  let pathD=`M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
  for(let i=1;i<points.length;i++){
    const cp1x=(points[i-1].x+points[i].x)/2
    pathD+=` C ${cp1x.toFixed(1)} ${points[i-1].y.toFixed(1)}, ${cp1x.toFixed(1)} ${points[i].y.toFixed(1)}, ${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)}`
  }
  const areaD=`${pathD} L ${points[points.length-1].x} ${padT+chartH} L ${points[0].x} ${padT+chartH} Z`
  const gridLines=[0,.25,.5,.75,1].map(pct=>({
    y:padT+chartH-pct*chartH,
    label:max>=1000?`$${((max*pct)/1000).toFixed(1)}k`:`$${(max*pct).toFixed(0)}`
  }))
  const cur=new Date().getMonth()
  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{width:'100%',height,overflow:'visible'}}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      {gridLines.map((g,i)=>(
        <g key={i}>
          <line x1={padL} y1={g.y} x2={w-padR} y2={g.y} stroke={i===0?'#e2e8f0':'#f1f5f9'} strokeWidth={i===0?1.5:1} strokeDasharray={i===0?'none':'4,4'}/>
          <text x={padL-8} y={g.y+4} textAnchor="end" style={{fontSize:10,fill:'#94a3b8',fontFamily:'Plus Jakarta Sans,sans-serif',fontWeight:500}}>{g.label}</text>
        </g>
      ))}
      <path d={areaD} fill="url(#areaGrad)"/>
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      {points.map((p,i)=>(
        <g key={i}>
          {i===cur&&p.value>0&&<circle cx={p.x} cy={p.y} r={9} fill={color} fillOpacity="0.15"/>}
          {p.value>0&&<text x={p.x} y={p.y-12} textAnchor="middle" style={{fontSize:9,fill:color,fontWeight:700,fontFamily:'Plus Jakarta Sans,sans-serif'}}>
            {p.value>=1000?`$${(p.value/1000).toFixed(1)}k`:`$${p.value.toFixed(0)}`}
          </text>}
          <circle cx={p.x} cy={p.y} r={i===cur&&p.value>0?5:3.5} fill={p.value>0?'#fff':'#f1f5f9'} stroke={p.value>0?color:'#cbd5e1'} strokeWidth="2"/>
          <text x={p.x} y={padT+chartH+18} textAnchor="middle" style={{fontSize:10,fill:i===cur?color:p.value>0?'#64748b':'#cbd5e1',fontWeight:i===cur?800:p.value>0?600:400,fontFamily:'Plus Jakarta Sans,sans-serif'}}>{p.label}</text>
        </g>
      ))}
    </svg>
  )
}

/* ── KPI SPARKLINE ── */
function Sparkline({ data, color }) {
  if(!data||data.length<2) return null
  const max=Math.max(...data,1), min=Math.min(...data,0)
  const w=80, h=32
  const pts=data.map((v,i)=>({
    x:(i/(data.length-1))*w,
    y:h-((v-min)/(max-min||1))*h
  }))
  let d=`M ${pts[0].x} ${pts[0].y}`
  for(let i=1;i<pts.length;i++){const cp=(pts[i-1].x+pts[i].x)/2;d+=` C ${cp} ${pts[i-1].y}, ${cp} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`}
  return(
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:80,height:32}}>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y} r={3} fill={color}/>
    </svg>
  )
}

export default function AdminReports() {
  const [summary,      setSummary]      = useState(null)
  const [daily,        setDaily]        = useState(null)
  const [monthly,      setMonthly]      = useState([])
  const [bestSellers,  setBestSellers]  = useState([])
  const [inventory,    setInventory]    = useState([])
  const [loading,      setLoading]      = useState(true)
  const [activeChart,  setActiveChart]  = useState('bar')
  const [chartYear,    setChartYear]    = useState(new Date().getFullYear())
  const [dateRange,    setDateRange]    = useState({ from:'', to:'' })

  const [kpiRef,  kpiVisible]  = useInView()
  const [chartRef,chartVisible]= useInView()
  const [botRef,  botVisible]  = useInView()

  useEffect(()=>{ fetchAll() },[])

  const fetchAll = async (from, to) => {
    const df = from !== undefined ? from : dateRange.from
    const dt = to !== undefined ? to : dateRange.to
    const p = df && dt ? "?date_from="+df+"&date_to="+dt : ""
    const yr = df ? new Date(df).getFullYear() : new Date().getFullYear()
    try {
      const [sRes,dRes,iRes,mRes,bRes] = await Promise.all([
        API.get("/api/sales/reports/summary"+p),
        API.get("/api/sales/reports/daily"),
        API.get("/api/inventory/"),
        API.get("/api/sales/reports/monthly?year="+yr),
        API.get("/api/sales/reports/best-sellers"+p),
      ])
      setSummary(sRes.data); setDaily(dRes.data)
      setInventory(iRes.data||[]); setMonthly(mRes.data||[])
      setBestSellers(bRes.data||[])
    } catch {}
    finally { setLoading(false) }
  }

  const lowStock   = inventory.filter(i=>i.Status!=='In Stock')
  const payData    = summary?.by_method ? Object.entries(summary.by_method).map(([k,v])=>({label:k,value:v})) : []
  const COLORS     = ['#c0272d','#6366f1','#d97706','#16a34a','#0891b2']
  const RANK_COLS  = ['#f59e0b','#94a3b8','#cd7c0a','#6366f1','#16a34a','#db2777','#0891b2','#7c3aed','#ea580c','#15803d']

  const KPI = [
    { label:"Today's Revenue",   value:`$${(daily?.total_revenue||0).toFixed(2)}`,   raw:daily?.total_revenue||0,     color:'#c0272d', bg:'linear-gradient(135deg,#fff0f0,#ffe4e4)', spark:[0,0,0,0,0,daily?.total_revenue||0] },
    { label:"Today's Sales",     value: daily?.total_sales??0,                        raw:daily?.total_sales||0,       color:'#6366f1', bg:'linear-gradient(135deg,#eef2ff,#e0e7ff)', spark:[0,0,0,0,0,daily?.total_sales||0] },
    { label:"Monthly Revenue",   value:`$${(summary?.monthly_revenue||0).toFixed(2)}`,raw:summary?.monthly_revenue||0, color:'#16a34a', bg:'linear-gradient(135deg,#f0fdf4,#dcfce7)', spark:[0,0,0,summary?.monthly_revenue||0] },
    { label:"Avg Transaction",   value:`$${(summary?.average_transaction||0).toFixed(2)}`,raw:summary?.average_transaction||0,color:'#d97706',bg:'linear-gradient(135deg,#fffbeb,#fef3c7)',spark:[0,0,summary?.average_transaction||0] },
  ]

  if(loading) return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh',fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:40,height:40,border:'3px solid #f0f0f0',borderTopColor:'#c0272d',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 16px'}}/>
        <p style={{color:'#94a3b8',fontSize:14}}>Loading analytics…</p>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  )

  return (
    <div className="admin-page" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeLeft{ from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .rp-card { background:#fff; border-radius:18px; padding:24px; border:1px solid rgba(0,0,0,.06); box-shadow:0 2px 12px rgba(0,0,0,.04); transition:transform .3s,box-shadow .3s; }
        .rp-card:hover { transform:translateY(-3px); box-shadow:0 8px 32px rgba(0,0,0,.08); }
        .kpi-card { border-radius:16px; padding:22px; transition:transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .3s; cursor:default; }
        .kpi-card:hover { transform:translateY(-5px); box-shadow:0 12px 32px rgba(0,0,0,.1); }
        .chart-tab { padding:8px 18px; border-radius:8px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:600; transition:all .2s; }
        .chart-tab.active { background:#c0272d; color:#fff; box-shadow:0 4px 12px rgba(192,39,45,.3); }
        .chart-tab:not(.active) { background:#f3f4f6; color:#6b7280; }
        .chart-tab:not(.active):hover { background:#fee2e2; color:#c0272d; }
        .bs-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid #f8fafc; transition:background .15s; border-radius:8px; }
        .bs-row:hover { background:#fafbfc; padding-left:8px; padding-right:8px; }
      `}</style>

      {/* Header */}
      <div className="admin-header">
        <div style={{animation:'fadeLeft .5s ease forwards'}}>
          <div className="admin-header-tag">Analytics</div>
          <h1 className="admin-title">Reports and Analytics</h1>
          <p className="admin-subtitle">Track your store performance in real time</p>
        </div>
        {/* Date range */}
        <div style={{display:'flex',alignItems:'center',gap:10,animation:'fadeLeft .5s ease .1s both'}}>
          <input type="date" value={dateRange.from} min="2024-06-10" max={new Date().toISOString().split("T")[0]} onChange={e=>setDateRange({...dateRange,from:e.target.value})}
            style={{padding:'8px 12px',border:'1.5px solid #e5e7eb',borderRadius:10,fontSize:13,outline:'none',fontFamily:"'Plus Jakarta Sans',sans-serif"}}/>
          <span style={{color:'#94a3b8',fontSize:13}}>to</span>
          <input type="date" value={dateRange.to} min={dateRange.from||"2024-06-10"} max={new Date().toISOString().split("T")[0]} onChange={e=>setDateRange({...dateRange,to:e.target.value})}
            style={{padding:'8px 12px',border:'1.5px solid #e5e7eb',borderRadius:10,fontSize:13,outline:'none',fontFamily:"'Plus Jakarta Sans',sans-serif"}}/>
          <button onClick={()=>fetchAll(dateRange.from, dateRange.to)}
            style={{padding:'8px 18px',borderRadius:10,border:'none',background:'linear-gradient(135deg,#c0272d,#e53935)',color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer',fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
            Refresh
          </button>
        </div>
      </div>

      {/* Today Banner */}
      <div style={{background:'linear-gradient(135deg,#0f172a,#1e293b)',borderRadius:20,padding:24,marginBottom:24,display:'flex',gap:20,alignItems:'center',animation:'fadeUp .5s ease forwards',boxShadow:'0 8px 32px rgba(0,0,0,.15)'}}>
        <div style={{flex:1}}>
          <div style={{fontSize:11,color:'#64748b',fontWeight:700,textTransform:'uppercase',letterSpacing:1.5,marginBottom:6}}>
            Today — {daily?.date}
          </div>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:40,fontWeight:900,color:'#fff',marginBottom:4,lineHeight:1}}>
            ${daily?.total_revenue?.toFixed(2)||'0.00'}
          </div>
          <div style={{fontSize:13,color:'#64748b'}}>Total Revenue Today</div>
        </div>
        {[
          { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
            value:daily?.total_sales||0, label:'Sales Today' },
          { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
            value:`$${daily?.avg_transaction?.toFixed(2)||'0.00'}`, label:'Avg Transaction' },
        ].map((s,i)=>(
          <div key={i} style={{background:'rgba(255,255,255,.06)',borderRadius:16,padding:'18px 28px',border:'1px solid rgba(255,255,255,.08)',textAlign:'center',minWidth:150,transition:'all .25s'}}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.1)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.06)'}>
            <div style={{display:'flex',justifyContent:'center',marginBottom:10}}>{s.icon}</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:26,fontWeight:900,color:'#fff',marginBottom:4}}>{s.value}</div>
            <div style={{fontSize:12,color:'#64748b'}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* KPI Cards */}
      <div ref={kpiRef} style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        {KPI.map((k,i)=>(
          <div key={k.label} className="kpi-card" style={{background:k.bg,border:`1.5px solid ${k.color}22`,
            animation:`fadeUp .5s ease ${i*.08}s both`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:1}}>{k.label}</div>
              <Sparkline data={k.spark} color={k.color}/>
            </div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:28,fontWeight:900,color:'#0f172a',lineHeight:1,marginBottom:6}}>{k.value}</div>
            <div style={{fontSize:11,color:k.color,fontWeight:700}}>Live data</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div ref={chartRef} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>

        {/* Monthly Revenue Chart */}
        <div className="rp-card" style={{animation:'scaleIn .6s ease both'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
            <div>
              <h3 style={{fontSize:16,fontWeight:800,color:'#0f172a',margin:0}}>Monthly Revenue</h3>
              <p style={{fontSize:12,color:'#94a3b8',margin:'4px 0 0'}}>Revenue trend for {new Date().getFullYear()}</p>
            </div>
            <div style={{display:'flex',gap:6,alignItems:'center'}}>
              <button className={`chart-tab${activeChart==='bar'?' active':''}`} onClick={()=>setActiveChart('bar')}>Bar</button>
              <button className={`chart-tab${activeChart==='line'?' active':''}`} onClick={()=>setActiveChart('line')}>Line</button>
            </div>
          </div>
          {monthly.length > 0 ? (
            <>
              {activeChart==='bar'
                ? <BarChart data={monthly} color="#c0272d" height={200}/>
                : <LineChart data={monthly} color="#c0272d" height={200}/>
              }
              <div style={{marginTop:8,padding:'10px 14px',background:'#f8fafc',borderRadius:10,fontSize:13,display:'flex',justifyContent:'space-between'}}>
                <span style={{color:'#64748b'}}>Total this year</span>
                <strong style={{color:'#c0272d'}}>${summary?.yearly_revenue?.toFixed(2)||'0.00'}</strong>
              </div>
            </>
          ) : (
            <div style={{textAlign:'center',padding:40,color:'#94a3b8'}}>No revenue data yet</div>
          )}
        </div>

        {/* Best Sellers */}
        <div className="rp-card" style={{animation:'scaleIn .6s ease .1s both'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <div>
              <h3 style={{fontSize:16,fontWeight:800,color:'#0f172a',margin:0}}>Best Selling Products</h3>
              <p style={{fontSize:12,color:'#94a3b8',margin:'4px 0 0'}}>By total units sold</p>
            </div>
            <span style={{fontSize:12,color:'#d97706',fontWeight:700,background:'#fef3c7',padding:'4px 10px',borderRadius:99}}>Top 10</span>
          </div>
          {bestSellers.length===0 ? (
            <div style={{textAlign:'center',padding:40,color:'#94a3b8'}}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="1.5" style={{marginBottom:12}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              <p style={{fontSize:13}}>No sales data yet</p>
            </div>
          ) : (
            <div style={{overflowY:'auto',maxHeight:300}}>
              {bestSellers.map((p,i)=>{
                const c=RANK_COLS[i]||'#6366f1'
                const maxQty=bestSellers[0].total_qty
                return(
                  <div key={i} className="bs-row">
                    <div style={{width:28,height:28,borderRadius:9,background:c+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,color:c,flexShrink:0}}>{i+1}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:5,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.name}</div>
                      <div style={{height:5,background:'#f1f5f9',borderRadius:99,overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${(p.total_qty/maxQty)*100}%`,background:`linear-gradient(90deg,${c},${c}88)`,borderRadius:99,transition:'width .6s ease'}}/>
                      </div>
                    </div>
                    <div style={{textAlign:'right',flexShrink:0}}>
                      <div style={{fontSize:13,fontWeight:800,color:c}}>${p.total_revenue.toFixed(2)}</div>
                      <div style={{fontSize:11,color:'#94a3b8'}}>{p.total_qty} units</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div ref={botRef} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>

        {/* Payment Methods */}
        <div className="rp-card" style={{animation:'fadeUp .5s ease both'}}>
          <h3 style={{fontSize:16,fontWeight:800,color:'#0f172a',marginBottom:4}}>Revenue by Payment</h3>
          <p style={{fontSize:12,color:'#94a3b8',marginBottom:16}}>Breakdown by payment method</p>
          {payData.length===0 ? (
            <div style={{textAlign:'center',padding:20,color:'#94a3b8',fontSize:13}}>No payment data yet</div>
          ) : (
            payData.map((p,i)=>{
              const total=payData.reduce((s,x)=>s+x.value,0)
              const pct=total>0?((p.value/total)*100).toFixed(1):0
              const c=COLORS[i%COLORS.length]
              return(
                <div key={i} style={{marginBottom:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:13}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <PaymentIcon method={p.label} size={18}/>
                      <span style={{fontWeight:700,color:'#374151'}}>{p.label}</span>
                    </div>
                    <span style={{fontWeight:800,color:c}}>${p.value.toFixed(2)} <span style={{color:'#94a3b8',fontWeight:400}}>({pct}%)</span></span>
                  </div>
                  <div style={{height:10,background:'#f1f5f9',borderRadius:99,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${c},${c}88)`,borderRadius:99,transition:'width .8s ease'}}/>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* All-Time Summary */}
        <div className="rp-card" style={{animation:'fadeUp .5s ease .1s both'}}>
          <h3 style={{fontSize:16,fontWeight:800,color:'#0f172a',marginBottom:16}}>All-Time Summary</h3>
          {[
            { label:'Total Transactions', value:summary?.total_transactions||0,       color:'#6366f1', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg> },
            { label:'Total Revenue',      value:`$${(summary?.total_revenue||0).toFixed(2)}`, color:'#16a34a', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
            { label:'Avg Transaction',    value:`$${(summary?.average_transaction||0).toFixed(2)}`, color:'#d97706', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg> },
            { label:'Products in Store',  value:inventory.length,                     color:'#0891b2', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> },
            { label:'Low/Out of Stock',   value:lowStock.length,                      color:'#dc2626', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg> },
            { label:'Monthly Sales',      value:summary?.monthly_sales||0,            color:'#7c3aed', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
          ].map(({label,value,color,icon})=>(
            <div key={label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',borderRadius:10,marginBottom:8,background:'#f8fafc',border:'1px solid #f0f0f0',transition:'all .2s'}}
              onMouseEnter={e=>{e.currentTarget.style.background=color+'12';e.currentTarget.style.borderColor=color+'33'}}
              onMouseLeave={e=>{e.currentTarget.style.background='#f8fafc';e.currentTarget.style.borderColor='#f0f0f0'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,color:'#374151',fontSize:13}}>
                <div style={{color,opacity:.8}}>{icon}</div>
                {label}
              </div>
              <strong style={{fontSize:14,color,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{value}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory Alerts */}
      <div className="rp-card" style={{animation:'fadeUp .5s ease .2s both'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <div>
            <h3 style={{fontSize:16,fontWeight:800,color:'#0f172a',margin:0}}>Inventory Alerts</h3>
            <p style={{fontSize:12,color:'#94a3b8',margin:'4px 0 0'}}>Products needing attention</p>
          </div>
          <span style={{fontSize:12,background:'#fef3c7',color:'#d97706',padding:'4px 10px',borderRadius:99,fontWeight:700}}>
            {lowStock.length} items
          </span>
        </div>
        {lowStock.length===0 ? (
          <div style={{textAlign:'center',padding:24,color:'#16a34a',fontWeight:700,fontSize:15,background:'#f0fdf4',borderRadius:12}}>
            All products are well stocked
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
            {lowStock.slice(0,9).map((item,i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px',borderRadius:12,
                background:item.Status==='Out of Stock'?'#fef2f2':'#fffbeb',
                border:`1.5px solid ${item.Status==='Out of Stock'?'#fecaca':'#fde68a'}`,
                transition:'transform .2s'}}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>{item.Name}</div>
                  <div style={{fontSize:11,color:'#94a3b8',marginTop:2}}>{item.Category_Name}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:14,fontWeight:800,color:item.Status==='Out of Stock'?'#ef4444':'#f59e0b'}}>{item.Quantity}</div>
                  <span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:99,
                    background:item.Status==='Out of Stock'?'#ef444420':'#f59e0b20',
                    color:item.Status==='Out of Stock'?'#ef4444':'#f59e0b'}}>
                    {item.Status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
