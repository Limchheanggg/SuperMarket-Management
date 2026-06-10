import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getSales } from '../services/api'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'

const METHOD_COLORS = {
  Cash:          { bg:'#f0fdf4', color:'#16a34a', border:'#86efac' },
  'QR Code':     { bg:'#f5f3ff', color:'#7c3aed', border:'#c4b5fd' },
  'Bank Transfer':{ bg:'#eff6ff', color:'#1d4ed8', border:'#93c5fd' },
  ABA:           { bg:'#fff7ed', color:'#ea580c', border:'#fed7aa' },
}

export default function OrderHistory() {
  const { user } = useAuth()
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState(null)
  const [items, setItems]       = useState([])
  const [itemLoading, setItemLoading] = useState(false)

  useEffect(() => {
    API.get('/api/sales/my?user_id='+user?.id).then(r=>setOrders(r.data||[])).catch(()=>setOrders([])).finally(()=>setLoading(false))
  }, [])

  const openDetail = async (order) => {
    setSelected(order); setItems([]); setItemLoading(true)
    try {
      const id = String(order.Sale_ID).replace(/\D/g,'')
      const res = await API.get(`/api/sales/${id}`)
      setItems(res.data.items||[])
      // Merge sale detail info into selected
      let info = {}
      try { info = JSON.parse(res.data.Customer_Note || '{}') } catch {}
      setSelected(prev => ({
        ...prev,
        ...res.data,
        customerName:    info.name    || res.data.customer || user?.name || 'Walk-in',
        customerEmail:   info.email   || user?.email || 'N/A',
        customerPhone:   info.phone   || user?.phone || 'N/A',
        customerNotes:   info.notes   || '',
        customerAddress: info.address || 'N/A',
      }))
    } catch { setItems([]) }
    finally { setItemLoading(false) }
  }

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#f4f6fa', minHeight:'100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .order-row { border-bottom:1px solid #f4f6fa; transition:background .15s; }
        .order-row:hover { background:#fafbfc; }
        .order-row td { padding:14px 18px; }
        .detail-btn { padding:7px 16px; border-radius:8px; border:1.5px solid #fecaca; background:#fff0f0; color:#c0272d; font-weight:700; font-size:12px; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .2s; }
        .detail-btn:hover { background:#fecaca; }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ background:'#fff', borderBottom:'1px solid #eee', padding:'12px 0' }}>
        <div className="container">
          <span style={{ fontSize:13, color:'#9ca3af' }}>
            <Link to="/" style={{ color:'#9ca3af', textDecoration:'none' }}>Home</Link> ›{' '}
            <strong style={{ color:'#111827' }}>My Orders</strong>
          </span>
        </div>
      </div>

      {/* Dark header */}
      <div style={{ background:'linear-gradient(135deg,#1a0505,#2d0b0b 40%,#0d1240)', padding:'28px 0' }}>
        <div className="container">
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:900, color:'#fff', margin:0 }}>
            My Orders
          </h1>
          <p style={{ color:'rgba(255,255,255,.5)', fontSize:14, margin:'6px 0 0' }}>
            {orders.length} transaction{orders.length!==1?'s':''} found
          </p>
        </div>
      </div>

      <div className="container" style={{ padding:'28px 24px' }}>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:60 }}>
            <div style={{ width:36, height:36, border:'3px solid #f0f0f0', borderTopColor:'#c0272d', borderRadius:'50%', animation:'spin 1s linear infinite' }}/>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px', background:'#fff',
            borderRadius:20, boxShadow:'0 4px 24px rgba(0,0,0,.06)', animation:'fadeUp .5s ease' }}>
            <div style={{ width:80, height:80, borderRadius:'50%', background:'#f9fafb',
              display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, marginBottom:8 }}>No orders yet</h2>
            <p style={{ color:'#9ca3af', marginBottom:28 }}>You haven't placed any orders yet.</p>
            <Link to="/shop" style={{ padding:'13px 32px', background:'linear-gradient(135deg,#c0272d,#e53935)',
              color:'#fff', borderRadius:12, textDecoration:'none', fontWeight:700 }}>
              Browse Products
            </Link>
          </div>
        ) : (
          <div style={{ background:'#fff', borderRadius:20, overflow:'hidden',
            boxShadow:'0 4px 24px rgba(0,0,0,.06)', animation:'fadeUp .5s ease' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ background:'linear-gradient(135deg,#0f172a,#1e293b)' }}>
                  {['Order ID','Date','Items','Total','Payment','Actions'].map(h => (
                    <th key={h} style={{ padding:'14px 18px', textAlign:'left', fontWeight:700,
                      color:'rgba(255,255,255,.7)', fontSize:11, textTransform:'uppercase', letterSpacing:.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o,i) => {
                  const mc = METHOD_COLORS[o.Payment_Method||o.method]||{ bg:'#f3f4f6', color:'#374151', border:'#e5e7eb' }
                  return (
                    <tr key={i} className="order-row" style={{ animation:`fadeUp .4s ease ${i*.04}s both` }}>
                      <td style={{ fontWeight:700, color:'#c0272d', fontFamily:"'Playfair Display',serif" }}>
                        #{o.Sale_ID_fmt||o.Sale_ID}
                      </td>
                      <td style={{ color:'#6b7280' }}>{o.date}</td>
                      <td>
                        <span style={{ background:'#f3f4f6', color:'#374151', padding:'3px 10px',
                          borderRadius:99, fontSize:11, fontWeight:700 }}>
                          {o.item_count||o.items||0} items
                        </span>
                      </td>
                      <td style={{ fontWeight:800, color:'#0f172a', fontSize:15,
                        fontFamily:"'Playfair Display',serif" }}>
                        ${Number(o.Total_Amount||0).toFixed(2)}
                      </td>
                      <td>
                        <span style={{ padding:'4px 10px', borderRadius:99, fontSize:11, fontWeight:700,
                          background:mc.bg, color:mc.color, border:`1px solid ${mc.border}` }}>
                          {o.Payment_Method||o.method||'Cash'}
                        </span>
                      </td>
                      <td>
                        <button className="detail-btn" onClick={()=>openDetail(o)}>View Details</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}
          onClick={e=>{ if(e.target===e.currentTarget) setSelected(null) }}>
          <div style={{ background:'#fff', borderRadius:20, padding:32, width:'100%', maxWidth:520,
            boxShadow:'0 20px 60px rgba(0,0,0,.2)', maxHeight:'90vh', overflowY:'auto',
            animation:'scaleIn .25s cubic-bezier(.34,1.56,.64,1) forwards' }}>

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, color:'#0f172a', margin:0 }}>
                Order #{selected.Sale_ID_fmt||selected.Sale_ID}
              </h3>
              <button onClick={()=>setSelected(null)} style={{ width:32, height:32, borderRadius:8,
                border:'none', background:'#f3f4f6', cursor:'pointer', display:'flex',
                alignItems:'center', justifyContent:'center', color:'#6b7280' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
              {[['Date',selected.date],['Payment',selected.Payment_Method||selected.method||'Cash'],
                ['Customer',selected.customer||'Walk-in'],['Cashier',selected.cashier||'Staff']].map(([l,v]) => (
                <div key={l} style={{ background:'#f9fafb', borderRadius:10, padding:'12px 14px' }}>
                  <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, marginBottom:3 }}>{l}</div>
                  <strong style={{ fontSize:13, color:'#0f172a' }}>{v}</strong>
                </div>
              ))}
            </div>

            {/* Customer Info */}
            <div style={{ background:'#f0f9ff', borderRadius:12, padding:'14px 16px', marginBottom:16, border:'1px solid #bae6fd' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#0369a1', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>Customer Information</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {[
                  ['Full Name', selected?.customerName || user?.name || 'Walk-in'],
                  ['Email', selected?.customerEmail || user?.email || 'N/A'],
                  
                  ['Phone', selected?.customerPhone || 'N/A'],
                  ['Notes', selected?.customerNotes || 'None'],
                  ['Payment', selected?.Payment_Method || 'Cash'],
                ].map(([l,v]) => (
                  <div key={l} style={{ background:'#fff', borderRadius:8, padding:'10px 12px', border:'1px solid #e0f2fe' }}>
                    <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, marginBottom:3 }}>{l}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#0f172a' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <h4 style={{ fontSize:14, fontWeight:800, color:'#0f172a', marginBottom:12 }}>Items Purchased</h4>
            {itemLoading ? (
              <div style={{ display:'flex', justifyContent:'center', padding:24 }}>
                <div style={{ width:24, height:24, border:'3px solid #f0f0f0', borderTopColor:'#c0272d', borderRadius:'50%', animation:'spin 1s linear infinite' }}/>
              </div>
            ) : items.length === 0 ? (
              <div style={{ textAlign:'center', padding:20, color:'#94a3b8', background:'#f9fafb', borderRadius:12 }}>
                No item details available
              </div>
            ) : (
              <div style={{ border:'1px solid #f0f0f0', borderRadius:12, overflow:'hidden', marginBottom:20 }}>
                {items.map((item,i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                    padding:'12px 16px', borderBottom:i<items.length-1?'1px solid #f9fafb':'none',
                    background:i%2===0?'#fff':'#fafbfc' }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:'#0f172a' }}>{item.Name}</div>
                      <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>
                        ${Number(item.Unit_Price).toFixed(2)} x {item.Quantity}
                      </div>
                    </div>
                    <strong style={{ color:'#c0272d', fontSize:14 }}>${Number(item.Subtotal).toFixed(2)}</strong>
                  </div>
                ))}
              </div>
            )}

            <div style={{ borderTop:'1px solid #f0f0f0', paddingTop:16 }}>
              {[['Subtotal',`$${(Number(selected.Total_Amount||0)-Number(selected.Tax||0)).toFixed(2)}`],
                ['Tax (10%)',`$${Number(selected.Tax||0).toFixed(2)}`]].map(([l,v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:14,
                  color:'#6b7280', marginBottom:6 }}>
                  <span>{l}</span><span>{v}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', fontWeight:900, fontSize:18,
                marginTop:12, paddingTop:12, borderTop:'1px solid #f0f0f0' }}>
                <span style={{ fontFamily:"'Playfair Display',serif", color:'#0f172a' }}>Total</span>
                <span style={{ color:'#c0272d' }}>${Number(selected.Total_Amount||0).toFixed(2)}</span>
              </div>
            </div>

            <button onClick={()=>setSelected(null)} style={{ width:'100%', marginTop:20, padding:'13px',
              borderRadius:12, border:'none', background:'linear-gradient(135deg,#c0272d,#e53935)',
              color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
