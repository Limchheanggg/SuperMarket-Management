import { useState, useEffect, useCallback } from 'react'
import API from '../../services/api'
import toast from 'react-hot-toast'

const METHOD_COLORS = {
  Cash:     { bg:'#f0fdf4', color:'#16a34a', border:'#86efac' },
  Card:     { bg:'#dbeafe', color:'#1d4ed8', border:'#93c5fd' },
  'QR Code':{ bg:'#f5f3ff', color:'#7c3aed', border:'#c4b5fd' },
  ABA:      { bg:'#fff7ed', color:'#ea580c', border:'#fed7aa' },
  Wing:     { bg:'#fef9c3', color:'#ca8a04', border:'#fde047' },
}

function Icon({ name, size=16, color='currentColor' }) {
  const p = { width:size, height:size, viewBox:'0 0 24 24', fill:'none', stroke:color, strokeWidth:1.8, strokeLinecap:'round', strokeLinejoin:'round' }
  switch (name) {
    case 'receipt': return <svg {...p}><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="13" y2="15"/></svg>
    case 'dollar': return <svg {...p}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    case 'bar-chart': return <svg {...p}><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
    case 'trend-up': return <svg {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
    case 'filter': return <svg {...p}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
    case 'loader': return <svg {...p} style={{animation:'spin 1s linear infinite'}}><circle cx="12" cy="12" r="9" opacity=".25"/><path d="M21 12a9 9 0 0 0-9-9"/></svg>
    case 'search': return <svg {...p}><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16" y2="16"/></svg>
    case 'user': return <svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    default: return null
  }
}

export default function AdminSales() {
  const [sales, setSales]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [summary, setSummary]       = useState(null)
  const [cashiers, setCashiers]     = useState([])
  const [methods, setMethods]       = useState([])
  const [selectedSale, setSelected] = useState(null)
  const [detailItems, setDetailItems] = useState([])
  const [detailLoading, setDetailLoading] = useState(false)

  // Filters
  const [dateFrom,   setDateFrom]   = useState('')
  const [dateTo,     setDateTo]     = useState('')
  const [method,     setMethod]     = useState('')
  const [cashier,    setCashier]    = useState('')
  const [minAmount,  setMinAmount]  = useState('')
  const [maxAmount,  setMaxAmount]  = useState('')
  const [search,     setSearch]     = useState('')

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    fetchSummary()
    fetchMeta()
    fetchSales()
  }, [])

  const fetchSummary = async () => {
    try {
      const r = await API.get('/api/sales/reports/summary')
      setSummary(r.data)
    } catch {}
  }

  const fetchMeta = async () => {
    try {
      const [cRes, mRes] = await Promise.all([
        API.get('/api/sales/cashiers'),
        API.get('/api/sales/methods'),
      ])
      setCashiers(cRes.data || [])
      setMethods(mRes.data || [])
    } catch {}
  }

  const fetchSales = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const query = new URLSearchParams()
      if (params.dateFrom  || dateFrom)   query.set('date_from',  params.dateFrom  ?? dateFrom)
      if (params.dateTo    || dateTo)     query.set('date_to',    params.dateTo    ?? dateTo)
      if (params.method    !== undefined ? params.method    : method)   query.set('method',     params.method    !== undefined ? params.method    : method)
      if (params.cashier   !== undefined ? params.cashier   : cashier)  query.set('cashier',    params.cashier   !== undefined ? params.cashier   : cashier)
      if (params.minAmount || minAmount)  query.set('min_amount', params.minAmount ?? minAmount)
      if (params.maxAmount || maxAmount)  query.set('max_amount', params.maxAmount ?? maxAmount)
      if (params.search    || search)     query.set('search',     params.search    ?? search)
      const res = await API.get(`/api/sales/?${query.toString()}`)
      setSales(res.data || [])
    } catch { setSales([]) }
    finally { setLoading(false) }
  }, [dateFrom, dateTo, method, cashier, minAmount, maxAmount, search])

  const handleApplyFilters = () => fetchSales()

  const handleClearFilters = () => {
    setDateFrom(''); setDateTo(''); setMethod(''); setCashier('')
    setMinAmount(''); setMaxAmount(''); setSearch('')
    fetchSales({ dateFrom:'', dateTo:'', method:'', cashier:'', minAmount:'', maxAmount:'', search:'' })
  }

  const openDetail = async (sale) => {
    setSelected(sale)
    setDetailItems([])
    setDetailLoading(true)
    try {
      const res = await API.get(`/api/sales/${sale.Sale_ID}`)
      setDetailItems(res.data.items || [])
    } catch { setDetailItems([]) }
    finally { setDetailLoading(false) }
  }

  const totalFiltered = sales.reduce((s, o) => s + Number(o.Total_Amount||0), 0)

  const activeFilters = [dateFrom, dateTo, method, cashier, minAmount, maxAmount, search].filter(Boolean).length

  return (
    <div className='admin-page'>

      {/* Header */}
      <div className='admin-header'>
        <div>
          <div className='admin-header-tag'>Sales Management</div>
          <h1 className='admin-title'>Sales and Transactions</h1>
          <p className='admin-subtitle'>View, filter and analyse all transactions</p>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          ['Total Transactions', summary?.total_transactions||0,                          '#6366f1','linear-gradient(135deg,#eef2ff,#e0e7ff)','receipt'],
          ['Monthly Revenue',   `$${(summary?.monthly_revenue||0).toFixed(2)}`,           '#16a34a','linear-gradient(135deg,#f0fdf4,#dcfce7)','dollar'],
          ['Monthly Sales',      summary?.monthly_sales||0,                               '#d97706','linear-gradient(135deg,#fffbeb,#fef3c7)','bar-chart'],
          ['Avg Transaction',   `$${(summary?.average_transaction||0).toFixed(2)}`,       '#db2777','linear-gradient(135deg,#fdf2f8,#fce7f3)','trend-up'],
        ].map(([l,v,c,bg,icon]) => (
          <div key={l} style={{ background:bg, borderRadius:14, padding:'18px 20px', border:`1.5px solid ${c}22` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <span style={{ fontSize:11, color:'#64748b', fontWeight:700, textTransform:'uppercase', letterSpacing:.5 }}>{l}</span>
              <Icon name={icon} size={16} color={c}/>
            </div>
            <div style={{ fontSize:26, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* ── FILTERS ── */}
      <div style={{ background:'#fff', borderRadius:16, padding:20, border:'1.5px solid #e5e7eb', marginBottom:20, boxShadow:'0 2px 8px rgba(0,0,0,.04)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:'#0f172a', display:'flex', alignItems:'center', gap:8 }}><Icon name="filter" size={16} color="#6366f1"/> Filters</h3>
          {activeFilters > 0 && (
            <button onClick={handleClearFilters}
              style={{ fontSize:12, color:'#dc2626', fontWeight:700, background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:'4px 12px', cursor:'pointer' }}>
              Clear all ({activeFilters})
            </button>
          )}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:12 }}>
          {/* Date Range */}
          <div>
            <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:5 }}>Date Range</label>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <input type="date" value={dateFrom} min="2024-06-10" max={dateTo || new Date().toISOString().split("T")[0]}
                onChange={e => setDateFrom(e.target.value)}
                style={{ width:'100%', padding:'9px 6px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:12, outline:'none', boxSizing:'border-box' }} />
              <span style={{ color:'#cbd5e1', fontSize:12 }}>-</span>
              <input type="date" value={dateTo} min={dateFrom || "2024-06-10"} max={new Date().toISOString().split("T")[0]}
                onChange={e => setDateTo(e.target.value)}
                style={{ width:'100%', padding:'9px 6px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:12, outline:'none', boxSizing:'border-box' }} />
            </div>
          </div>
          {/* Payment Method */}
          <div>
            <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:5 }}>Payment Method</label>
            <select value={method} onChange={e => setMethod(e.target.value)}
              style={{ width:'100%', padding:'9px 12px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:13, outline:'none', background:'#fff' }}>
              <option value="">All Methods</option>
              {methods.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          {/* Cashier */}
          <div>
            <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:5 }}>Cashier</label>
            <select value={cashier} onChange={e => setCashier(e.target.value)}
              style={{ width:'100%', padding:'9px 12px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:13, outline:'none', background:'#fff' }}>
              <option value="">All Cashiers</option>
              {cashiers.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {/* Amount Range */}
          <div>
            <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:5 }}>Amount Range ($)</label>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <input type="number" min="0" step="0.01" value={minAmount} onChange={e => setMinAmount(e.target.value)}
                placeholder="Min"
                style={{ width:'100%', padding:'9px 6px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:12, outline:'none', boxSizing:'border-box' }} />
              <span style={{ color:'#cbd5e1', fontSize:12 }}>-</span>
              <input type="number" min="0" step="0.01" value={maxAmount} onChange={e => setMaxAmount(e.target.value)}
                placeholder="Max"
                style={{ width:'100%', padding:'9px 6px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:12, outline:'none', boxSizing:'border-box' }} />
            </div>
          </div>
        </div>

        {/* Quick date shortcuts + Apply */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <span style={{ fontSize:12, color:'#64748b', alignSelf:'center', fontWeight:600 }}>Quick:</span>
            {[
              ['Today',      today,                    today],
              ['This Week',  (() => { const d=new Date(); d.setDate(d.getDate()-d.getDay()); return d.toISOString().split('T')[0] })(), today],
              ['This Month', today.slice(0,7)+'-01',   today],
              ['This Year',  today.slice(0,4)+'-01-01',today],
            ].map(([label, from, to]) => (
              <button key={label} onClick={() => { setDateFrom(from); setDateTo(to) }}
                style={{ padding:'5px 12px', borderRadius:8, border:'1.5px solid #e5e7eb', background: dateFrom===from&&dateTo===to ? '#f0fdf4' : '#fff', color: dateFrom===from&&dateTo===to ? '#16a34a' : '#374151', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                {label}
              </button>
            ))}
          </div>

          <button onClick={handleApplyFilters}
            style={{ padding:'10px 28px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#15803d,#22c55e)', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', boxShadow:'0 4px 12px rgba(21,128,61,.3)' }}>
            Apply Filters
          </button>
        </div>
      </div>

      {/* Results summary */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, padding:'12px 16px', background:'#f8fafc', borderRadius:10, border:'1px solid #e5e7eb', fontSize:13 }}>
        <span style={{ color:'#374151' }}>
          Showing <strong style={{ color:'#0f172a' }}>{sales.length}</strong> transactions
          {activeFilters > 0 && <span style={{ color:'#6366f1' }}> (filtered)</span>}
        </span>
        <span style={{ fontWeight:800, color:'#16a34a', fontSize:15 }}>
          Total: ${totalFiltered.toFixed(2)}
        </span>
      </div>

      {/* ── TABLE ── */}
      <div style={{ background:'#fff', borderRadius:16, overflow:'hidden', border:'1.5px solid #e5e7eb', boxShadow:'0 2px 10px rgba(0,0,0,.04)' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ background:'#f8fafc', borderBottom:'2px solid #e5e7eb' }}>
              {['Sale ID','Date','Time','Customer','Cashier','Items','Amount','Payment','Actions'].map(h => (
                <th key={h} style={{ padding:'13px 14px', textAlign:'left', fontWeight:700, color:'#374151', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ padding:48, textAlign:'center', color:'#94a3b8' }}>
                <div style={{ display:'flex', justifyContent:'center', marginBottom:10 }}><Icon name="loader" size={32}/></div>
                <p>Loading sales...</p>
              </td></tr>
            ) : sales.length === 0 ? (
              <tr><td colSpan={9} style={{ padding:48, textAlign:'center', color:'#94a3b8' }}>
                <div style={{ display:'flex', justifyContent:'center', marginBottom:10 }}><Icon name="search" size={36}/></div>
                <p>No sales found for the selected filters.</p>
              </td></tr>
            ) : sales.map(s => {
              const mc = METHOD_COLORS[s.Payment_Method] || { bg:'#f3f4f6', color:'#374151', border:'#e5e7eb' }
              return (
                <tr key={s.Sale_ID} style={{ borderBottom:'1px solid #f8fafc' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#fafafa'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'12px 14px', fontWeight:700, color:'#6366f1' }}>{s.Sale_ID_fmt}</td>
                  <td style={{ padding:'12px 14px', color:'#374151', fontWeight:500, whiteSpace:'nowrap' }}>{s.date}</td>
                  <td style={{ padding:'12px 14px', color:'#94a3b8', fontSize:12 }}>{s.time}</td>
                  <td style={{ padding:'12px 14px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                      <div style={{ width:28, height:28, borderRadius:9, background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#16a34a', flexShrink:0 }}>
                        {s.customer === 'Walk-in' ? <Icon name="user" size={14} color="#16a34a"/> : s.customer[0].toUpperCase()}
                      </div>
                      <span style={{ color: s.customer==='Walk-in' ? '#94a3b8' : '#0f172a', fontStyle: s.customer==='Walk-in' ? 'italic' : 'normal', fontSize:13 }}>
                        {s.customer}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding:'12px 14px', color:'#374151', fontSize:13 }}>{s.cashier}</td>
                  <td style={{ padding:'12px 14px', textAlign:'center' }}>
                    <span style={{ background:'#f1f5f9', color:'#475569', padding:'3px 10px', borderRadius:99, fontSize:12, fontWeight:700 }}>
                      {s.item_count}
                    </span>
                  </td>
                  <td style={{ padding:'12px 14px', fontWeight:800, color:'#0f172a', fontSize:14 }}>
                    ${s.Total_Amount.toFixed(2)}
                  </td>
                  <td style={{ padding:'12px 14px' }}>
                    <span style={{ padding:'4px 10px', borderRadius:99, fontSize:11, fontWeight:700, background:mc.bg, color:mc.color, border:`1px solid ${mc.border}`, whiteSpace:'nowrap' }}>
                      {s.Payment_Method}
                    </span>
                  </td>
                  <td style={{ padding:'12px 14px' }}>
                    <button onClick={() => openDetail(s)}
                      style={{ padding:'5px 14px', borderRadius:8, border:'1.5px solid #c4b5fd', background:'#f5f3ff', color:'#7c3aed', cursor:'pointer', fontSize:12, fontWeight:700 }}>
                      Details
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── DETAIL MODAL ── */}
      {selectedSale && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}
          onClick={e => { if(e.target===e.currentTarget) setSelected(null) }}>
          <div style={{ background:'#fff', borderRadius:18, padding:32, width:'100%', maxWidth:560, boxShadow:'0 8px 40px rgba(0,0,0,.15)', maxHeight:'90vh', overflowY:'auto' }}>

            {/* Header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, paddingBottom:16, borderBottom:'1.5px solid #f1f5f9' }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'#c0272d', textTransform:'uppercase', letterSpacing:1.5, marginBottom:4 }}>Transaction Receipt</div>
                <h3 style={{ fontSize:22, fontWeight:900, color:'#0f172a', margin:0, fontFamily:"'Playfair Display',serif" }}>{selectedSale.Sale_ID_fmt}</h3>
              </div>
              <button onClick={() => setSelected(null)} style={{ background:'#f1f5f9', border:'none', borderRadius:10, width:36, height:36, cursor:'pointer', fontSize:16, color:'#64748b', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>✕</button>
            </div>

            {/* Info grid */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:20 }}>
              {[
                ['Date',     selectedSale.date],
                ['Time',     selectedSale.time],
                ['Customer', selectedSale.customer],
                ['Cashier',  selectedSale.cashier],
                ['Payment',  selectedSale.Payment_Method],
                ['Items',    `${selectedSale.item_count} item${selectedSale.item_count!==1?'s':''}`],
              ].map(([label, value]) => {
                const isPayment = label === 'Payment'
                const mc = isPayment ? (METHOD_COLORS[value] || {}) : {}
                return (
                  <div key={label} style={{ padding:'12px 14px', background:'#f8fafc', borderRadius:10, border:'1px solid #f1f5f9' }}>
                    <div style={{ fontSize:10, color:'#94a3b8', marginBottom:4, fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>{label}</div>
                    <div style={{ fontSize:14, fontWeight:700, color: mc.color || '#0f172a', background: isPayment && mc.bg ? mc.bg : 'transparent', display:'inline-block', padding: isPayment ? '2px 10px' : '0', borderRadius: isPayment ? 99 : 0 }}>{value}</div>
                  </div>
                )
              })}
            </div>

            {/* Customer Info */}
            {selectedSale.customerName && selectedSale.customerName !== 'Walk-in' && (
              <div style={{ background:'#f0f9ff', borderRadius:12, padding:'14px 16px', marginBottom:16, border:'1px solid #bae6fd' }}>
                <div style={{ fontSize:10, fontWeight:700, color:'#0369a1', textTransform:'uppercase', letterSpacing:1.5, marginBottom:10 }}>Customer Information</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {[
                    ['Name',  selectedSale.customerName],
                    ['Email', selectedSale.customerEmail],
                    ['Phone', selectedSale.customerPhone],
                    ['Notes', selectedSale.customerNotes || '—'],
                  ].map(([l,v]) => (
                    <div key={l} style={{ background:'#fff', borderRadius:8, padding:'10px 12px', border:'1px solid #e0f2fe' }}>
                      <div style={{ fontSize:10, color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:3 }}>{l}</div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#0f172a' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Items table */}
            <div style={{ fontSize:10, fontWeight:700, color:'#0f172a', textTransform:'uppercase', letterSpacing:1.5, marginBottom:10 }}>Items Purchased</div>
            {detailLoading ? (
              <div style={{ textAlign:'center', padding:24, color:'#94a3b8', fontSize:13 }}>Loading items...</div>
            ) : detailItems.length === 0 ? (
              <div style={{ textAlign:'center', padding:20, color:'#94a3b8', background:'#f8fafc', borderRadius:10, fontSize:13 }}>No item details available</div>
            ) : (
              <div style={{ borderRadius:12, overflow:'hidden', border:'1.5px solid #f1f5f9', marginBottom:20 }}>
                <div style={{ background:'#0f172a', padding:'10px 16px', display:'grid', gridTemplateColumns:'1fr auto auto', gap:12, fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:1 }}>
                  <span>Product</span><span style={{ textAlign:'right' }}>Qty × Price</span><span style={{ textAlign:'right' }}>Subtotal</span>
                </div>
                {detailItems.map((item, i) => (
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:12, padding:'12px 16px', borderBottom: i<detailItems.length-1?'1px solid #f8fafc':'none', background: i%2===0?'#fff':'#fafafa', fontSize:13 }}>
                    <span style={{ fontWeight:600, color:'#0f172a' }}>{item.Name}</span>
                    <span style={{ color:'#94a3b8', textAlign:'right', whiteSpace:'nowrap' }}>{item.Quantity} × ${item.Unit_Price.toFixed(2)}</span>
                    <strong style={{ color:'#16a34a', textAlign:'right' }}>${item.Subtotal.toFixed(2)}</strong>
                  </div>
                ))}
              </div>
            )}

            {/* Totals */}
            <div style={{ background:'#f8fafc', borderRadius:12, padding:'14px 16px', border:'1.5px solid #f1f5f9' }}>
              {[
                ['Subtotal', `$${(selectedSale.Total_Amount - (selectedSale.Tax||0)).toFixed(2)}`, '#374151'],
                ['Tax (10%)', `$${(selectedSale.Tax||0).toFixed(2)}`, '#374151'],
                ...(selectedSale.Discount > 0 ? [['Discount', `-$${selectedSale.Discount.toFixed(2)}`, '#c0272d']] : []),
              ].map(([l,v,c]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:c||'#64748b', marginBottom:8 }}>
                  <span>{l}</span><span style={{ fontWeight:600 }}>{v}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', fontWeight:900, fontSize:20, color:'#0f172a', marginTop:12, paddingTop:12, borderTop:'2px solid #e5e7eb' }}>
                <span>Total</span><span style={{ color:'#16a34a' }}>${selectedSale.Total_Amount.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={() => setSelected(null)}
              style={{ width:'100%', marginTop:16, padding:'13px', borderRadius:12, border:'none', background:'#0f172a', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', letterSpacing:.5 }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
