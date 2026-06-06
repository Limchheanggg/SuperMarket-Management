import { useState, useEffect } from 'react'
import API from '../../services/api'
import toast from 'react-hot-toast'

const TIER_COLORS = {
  Bronze:   { bg:'#fff7ed', color:'#ea580c', border:'#fed7aa', icon:'🥉' },
  Silver:   { bg:'#f8fafc', color:'#64748b', border:'#cbd5e1', icon:'🥈' },
  Gold:     { bg:'#fefce8', color:'#ca8a04', border:'#fde047', icon:'🥇' },
  Platinum: { bg:'#f5f3ff', color:'#7c3aed', border:'#c4b5fd', icon:'💎' },
}

const EMPTY_COUPON = {
  Code:'', Description:'', Discount_Type:'percentage', Discount_Value:10,
  Min_Purchase:0, Tier_Required:'Bronze', Uses_Limit:100, Expiry_Date:'', Is_Active:1
}

function ProgressBar({ points }) {
  const tiers = [
    { label:'Silver',   min:0,    max:500  },
    { label:'Gold',     min:500,  max:2000 },
    { label:'Platinum', min:2000, max:5000 },
  ]
  const next = tiers.find(t => points < t.max)
  if (!next) return <span style={{ fontSize:12, color:'#7c3aed', fontWeight:700 }}>💎 Max Tier!</span>
  const pct = Math.min(100, ((points - next.min) / (next.max - next.min)) * 100)
  return (
    <div style={{ minWidth:140 }}>
      <div style={{ fontSize:11, color:'#64748b', marginBottom:4 }}>
        {points} / {next.max} pts → {next.label}
      </div>
      <div style={{ background:'#e5e7eb', borderRadius:99, height:6, overflow:'hidden' }}>
        <div style={{ width:`${pct}%`, height:'100%', background:'linear-gradient(90deg,#16a34a,#22c55e)', borderRadius:99 }} />
      </div>
    </div>
  )
}

export default function AdminMembership() {
  const [tab, setTab]               = useState('members')
  const [members, setMembers]       = useState([])
  const [coupons, setCoupons]       = useState([])
  const [customers, setCustomers]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [couponLoading, setCouponLoading] = useState(true)
  const [search, setSearch]         = useState('')
  const [tierFilter, setTierFilter] = useState('All')
  const [showModal, setShowModal]   = useState(false)
  const [selectedUser, setSelectedUser] = useState('')
  const [customerSearch, setCustomerSearch] = useState('')
  const [saving, setSaving]         = useState(false)
  const [pointsModal, setPointsModal] = useState(null)
  const [pointsForm, setPointsForm] = useState({ points:0, total_spent:0 })
  const [couponModal, setCouponModal] = useState(null)
  const [couponForm, setCouponForm] = useState(EMPTY_COUPON)

  useEffect(() => { fetchMembers(); fetchCoupons() }, [])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const [mRes, cRes] = await Promise.all([
        API.get('/api/membership/'),
        API.get('/api/membership/customers'),
      ])
      setMembers(mRes.data  || [])
      setCustomers(cRes.data || [])
    } catch(e) {
      console.error('Members error:', e)
      setMembers([])
    }
    setLoading(false)
  }

  const fetchCoupons = async () => {
    setCouponLoading(true)
    try {
      const res = await API.get('/api/coupons/')
      console.log('Coupons loaded:', res.data?.length)
      setCoupons(res.data || [])
    } catch(e) {
      console.error('Coupons error:', e)
      toast.error('Failed to load coupons: ' + (e.response?.data?.detail || e.message))
      setCoupons([])
    }
    setCouponLoading(false)
  }

  const handleRegister = async () => {
    if (!selectedUser) { toast.error('Please select a customer'); return }
    setSaving(true)
    try {
      await API.post('/api/membership/register', { customer_id: parseInt(selectedUser) })
      toast.success('Membership registered!')
      setShowModal(false); setSelectedUser(''); setCustomerSearch(''); fetchMembers()
    } catch(e) { toast.error(e.response?.data?.detail || 'Error') }
    finally { setSaving(false) }
  }

  const handleAddPoints = async () => {
    try {
      await API.put(`/api/membership/add-points/${pointsModal.id}`, pointsForm)
      toast.success('Points updated!')
      setPointsModal(null); fetchMembers()
    } catch { toast.error('Failed') }
  }

  const handleDeleteMember = async (id) => {
    if (!window.confirm('Remove this member?')) return
    try { await API.delete(`/api/membership/${id}`); toast.success('Removed'); fetchMembers() }
    catch { toast.error('Failed') }
  }

  const handleSaveCoupon = async () => {
    if (!couponForm.Code.trim()) { toast.error('Coupon code required'); return }
    if (!couponForm.Expiry_Date) { toast.error('Expiry date required'); return }
    setSaving(true)
    try {
      if (couponModal === 'add') await API.post('/api/coupons/', couponForm)
      else await API.put(`/api/coupons/${couponModal}`, couponForm)
      toast.success(couponModal === 'add' ? 'Coupon created!' : 'Coupon updated!')
      setCouponModal(null); setCouponForm(EMPTY_COUPON); fetchCoupons()
    } catch(e) { toast.error(e.response?.data?.detail || 'Error') }
    finally { setSaving(false) }
  }

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon?')) return
    try { await API.delete(`/api/coupons/${id}`); toast.success('Deleted'); fetchCoupons() }
    catch { toast.error('Failed') }
  }

  const toggleCoupon = async (c) => {
    try {
      await API.put(`/api/coupons/${c.Coupon_ID}`, {
        ...c,
        Is_Active: c.Is_Active ? 0 : 1,
        Expiry_Date: String(c.Expiry_Date).slice(0,10)
      })
      toast.success(c.Is_Active ? 'Deactivated' : 'Activated')
      fetchCoupons()
    } catch { toast.error('Failed') }
  }

  const isExpired = (d) => d && new Date(String(d).slice(0,10)) < new Date(new Date().toDateString())
  const daysLeft  = (d) => !d ? 0 : Math.ceil((new Date(String(d).slice(0,10)) - new Date()) / (1000*60*60*24))

  const filtered = members.filter(m => {
    const matchSearch = !search || (m.full_name||'').toLowerCase().includes(search.toLowerCase())
    const matchTier   = tierFilter === 'All' || m.tier === tierFilter
    return matchSearch && matchTier
  })

  const filteredCustomers = customers.filter(c =>
    !customerSearch || (c.full_name||'').toLowerCase().includes(customerSearch.toLowerCase())
  )

  const stats = {
    total:    members.length,
    bronze:   members.filter(m => m.tier==='Bronze').length,
    silver:   members.filter(m => m.tier==='Silver').length,
    gold:     members.filter(m => m.tier==='Gold').length,
    platinum: members.filter(m => m.tier==='Platinum').length,
  }

  return (
    <div className='admin-page'>

      {/* Header */}
      <div className='admin-header'>
        <div>
          <div className='admin-header-tag'>Membership</div>
          <h1 className='admin-title'>Loyalty and Coupons</h1>
          <p className='admin-subtitle'>Manage loyalty tiers, points and reward coupons</p>
        </div>
        {tab === 'members' ? (
          <button onClick={() => { setShowModal(true); setCustomerSearch('') }}
            style={{ padding:'10px 20px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#d97706,#f59e0b)', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14 }}>
            + Register Member
          </button>
        ) : (
          <button onClick={() => {
            setCouponForm({...EMPTY_COUPON, Expiry_Date: new Date(Date.now()+30*86400000).toISOString().split('T')[0]})
            setCouponModal('add')
          }}
            style={{ padding:'10px 20px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14 }}>
            + Create Coupon
          </button>
        )}
      </div>

      {/* Tier Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:24 }}>
        {[
          ['Total',    stats.total,    '#6366f1','linear-gradient(135deg,#eef2ff,#e0e7ff)','👥'],
          ['Bronze',   stats.bronze,   '#ea580c','linear-gradient(135deg,#fff7ed,#fed7aa)','🥉'],
          ['Silver',   stats.silver,   '#64748b','linear-gradient(135deg,#f8fafc,#e2e8f0)','🥈'],
          ['Gold',     stats.gold,     '#ca8a04','linear-gradient(135deg,#fefce8,#fef08a)','🥇'],
          ['Platinum', stats.platinum, '#7c3aed','linear-gradient(135deg,#f5f3ff,#ede9fe)','💎'],
        ].map(([l,v,c,bg,icon]) => (
          <div key={l} style={{ background:bg, borderRadius:14, padding:'16px 18px', border:`1.5px solid ${c}22`, cursor:'pointer' }}
            onClick={() => { setTab('members'); setTierFilter(l==='Total'?'All':l) }}>
            <div style={{ fontSize:11, color:'#64748b', marginBottom:4, fontWeight:600 }}>{icon} {l}</div>
            <div style={{ fontSize:28, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:20, background:'#f1f5f9', borderRadius:12, padding:4, width:'fit-content' }}>
        {[['members','⭐ Members'],['coupons',`🎟️ Coupons (${coupons.length})`]].map(([key,label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ padding:'9px 20px', borderRadius:9, border:'none', cursor:'pointer', fontSize:13, fontWeight:700,
              background: tab===key ? '#fff' : 'transparent',
              color: tab===key ? '#0f172a' : '#64748b',
              boxShadow: tab===key ? '0 2px 8px rgba(0,0,0,.08)' : 'none' }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── MEMBERS TAB ── */}
      {tab === 'members' && (
        <>
          <div style={{ display:'flex', gap:10, marginBottom:18, flexWrap:'wrap' }}>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="🔍 Search by name..."
              style={{ flex:1, minWidth:200, padding:'10px 14px', borderRadius:10, border:'1.5px solid #e5e7eb', fontSize:13, outline:'none', boxSizing:'border-box' }} />
            {['All','Bronze','Silver','Gold','Platinum'].map(t => {
              const tc = TIER_COLORS[t] || { bg:'#f1f5f9', color:'#374151', border:'#e2e8f0', icon:'' }
              return (
                <button key={t} onClick={() => setTierFilter(t)}
                  style={{ padding:'9px 16px', borderRadius:9, cursor:'pointer', fontSize:12, fontWeight:700,
                    border:`1.5px solid ${tierFilter===t ? tc.border : '#e5e7eb'}`,
                    background: tierFilter===t ? tc.bg : '#fff',
                    color: tierFilter===t ? tc.color : '#374151' }}>
                  {t==='All' ? 'All Tiers' : `${tc.icon} ${t}`}
                </button>
              )
            })}
          </div>

          <div style={{ background:'#fff', borderRadius:16, overflow:'hidden', border:'1.5px solid #e5e7eb', boxShadow:'0 2px 10px rgba(0,0,0,.04)' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ background:'#f8fafc', borderBottom:'2px solid #e5e7eb' }}>
                  {['Customer','Tier','Points','Total Spent','Progress','Joined','Actions'].map(h => (
                    <th key={h} style={{ padding:'13px 16px', textAlign:'left', fontWeight:700, color:'#374151' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ padding:40, textAlign:'center', color:'#94a3b8' }}>
                    <div style={{ fontSize:32, marginBottom:8 }}>⏳</div>Loading members...
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding:40, textAlign:'center', color:'#94a3b8' }}>
                    <div style={{ fontSize:36, marginBottom:10 }}>⭐</div>
                    <p>{members.length === 0 ? 'No members yet.' : 'No members match your search.'}</p>
                  </td></tr>
                ) : filtered.map(m => {
                  const tc = TIER_COLORS[m.tier] || TIER_COLORS.Bronze
                  return (
                    <tr key={m.id} style={{ borderBottom:'1px solid #f8fafc' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#fafafa'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'13px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:36, height:36, borderRadius:12, background:`${tc.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:14, color:tc.color, flexShrink:0 }}>
                            {(m.full_name||'?')[0].toUpperCase()}
                          </div>
                          <div>
                            <strong style={{ color:'#0f172a' }}>{m.full_name}</strong>
                            <div style={{ fontSize:11, color:'#94a3b8' }}>{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:'13px 16px' }}>
                        <span style={{ padding:'4px 12px', borderRadius:99, fontSize:12, fontWeight:700, background:tc.bg, color:tc.color, border:`1px solid ${tc.border}` }}>
                          {tc.icon} {m.tier}
                        </span>
                      </td>
                      <td style={{ padding:'13px 16px', fontWeight:800, color:'#6366f1', fontSize:15 }}>{m.points}</td>
                      <td style={{ padding:'13px 16px', fontWeight:700, color:'#16a34a' }}>${Number(m.total_spent||0).toFixed(2)}</td>
                      <td style={{ padding:'13px 16px' }}><ProgressBar points={m.points||0} /></td>
                      <td style={{ padding:'13px 16px', color:'#64748b', fontSize:12 }}>
                        {m.joined_at ? new Date(m.joined_at).toLocaleDateString() : '—'}
                      </td>
                      <td style={{ padding:'13px 16px' }}>
                        <div style={{ display:'flex', gap:6 }}>
                          <button onClick={() => { setPointsModal(m); setPointsForm({ points:0, total_spent:0 }) }}
                            style={{ padding:'5px 10px', borderRadius:7, border:'1.5px solid #fcd34d', background:'#fefce8', color:'#ca8a04', cursor:'pointer', fontSize:11, fontWeight:700 }}>
                            + Points
                          </button>
                          <button onClick={() => handleDeleteMember(m.id)}
                            style={{ padding:'5px 10px', borderRadius:7, border:'1.5px solid #fca5a5', background:'#fee2e2', color:'#dc2626', cursor:'pointer', fontSize:11, fontWeight:700 }}>
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── COUPONS TAB ── */}
      {tab === 'coupons' && (
        <>
          {/* Coupon Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
            {[
              ['Total Coupons', coupons.length,                                                          '#6366f1','linear-gradient(135deg,#eef2ff,#e0e7ff)'],
              ['Active',        coupons.filter(c => c.Is_Active && !isExpired(c.Expiry_Date)).length,    '#16a34a','linear-gradient(135deg,#f0fdf4,#dcfce7)'],
              ['Expired',       coupons.filter(c => isExpired(c.Expiry_Date)).length,                    '#dc2626','linear-gradient(135deg,#fef2f2,#fee2e2)'],
              ['Total Uses',    coupons.reduce((s,c) => s+(c.Uses_Count||0), 0),                         '#d97706','linear-gradient(135deg,#fffbeb,#fef3c7)'],
            ].map(([l,v,c,bg]) => (
              <div key={l} style={{ background:bg, borderRadius:14, padding:'16px 18px', border:`1.5px solid ${c}22` }}>
                <div style={{ fontSize:11, color:'#64748b', marginBottom:4, fontWeight:600 }}>{l}</div>
                <div style={{ fontSize:28, fontWeight:800, color:c }}>{v}</div>
              </div>
            ))}
          </div>

          {couponLoading ? (
            <div style={{ textAlign:'center', padding:60, color:'#94a3b8' }}>
              <div style={{ fontSize:36, marginBottom:12 }}>⏳</div>
              <p>Loading coupons...</p>
            </div>
          ) : coupons.length === 0 ? (
            <div style={{ textAlign:'center', padding:60, background:'#fff', borderRadius:16, border:'1.5px solid #e5e7eb', color:'#94a3b8' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🎟️</div>
              <p style={{ fontSize:16, fontWeight:600, marginBottom:6 }}>No coupons yet</p>
              <p style={{ fontSize:13, marginBottom:20 }}>Click "+ Create Coupon" to add your first reward coupon</p>
              <button onClick={() => { setCouponForm({...EMPTY_COUPON, Expiry_Date: new Date(Date.now()+30*86400000).toISOString().split('T')[0]}); setCouponModal('add') }}
                style={{ padding:'10px 24px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14 }}>
                + Create First Coupon
              </button>
            </div>
          ) : (
            <div style={{ background:'#fff', borderRadius:16, overflow:'hidden', border:'1.5px solid #e5e7eb', boxShadow:'0 2px 10px rgba(0,0,0,.04)' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr style={{ background:'linear-gradient(135deg,#0f172a,#1e293b)' }}>
                    {['Code','Description','Discount','Min Purchase','Tier','Usage','Expires','Status','Actions'].map(h => (
                      <th key={h} style={{ padding:'13px 14px', textAlign:'left', fontWeight:700, color:'rgba(255,255,255,.85)', fontSize:11, textTransform:'uppercase', letterSpacing:.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c, idx) => {
                    const tc       = TIER_COLORS[c.Tier_Required] || TIER_COLORS.Bronze
                    const expired  = isExpired(c.Expiry_Date)
                    const days     = daysLeft(c.Expiry_Date)
                    const usagePct = c.Uses_Limit > 0 ? Math.round(c.Uses_Count/c.Uses_Limit*100) : 0
                    return (
                      <tr key={c.Coupon_ID}
                        style={{ borderBottom:'1px solid #f8fafc', background: idx%2===0 ? '#fff' : '#fafbfc' }}
                        onMouseEnter={e=>e.currentTarget.style.background='#f0fdf4'}
                        onMouseLeave={e=>e.currentTarget.style.background=idx%2===0?'#fff':'#fafbfc'}>
                        <td style={{ padding:'13px 14px' }}>
                          <span style={{ fontFamily:'monospace', fontWeight:800, fontSize:13, color:'#6366f1', background:'#eef2ff', padding:'4px 10px', borderRadius:7 }}>
                            {c.Code}
                          </span>
                        </td>
                        <td style={{ padding:'13px 14px', color:'#374151', maxWidth:180 }}>
                          <div style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.Description}</div>
                        </td>
                        <td style={{ padding:'13px 14px' }}>
                          <div style={{ fontWeight:800, color:'#16a34a', fontSize:15 }}>
                            {c.Discount_Type==='percentage' ? `${c.Discount_Value}%` : `$${c.Discount_Value}`}
                          </div>
                          <div style={{ fontSize:10, color:'#94a3b8', textTransform:'uppercase' }}>{c.Discount_Type}</div>
                        </td>
                        <td style={{ padding:'13px 14px', color:'#64748b', fontWeight:600 }}>
                          {c.Min_Purchase > 0 ? `$${c.Min_Purchase}` : <span style={{ color:'#94a3b8' }}>No min</span>}
                        </td>
                        <td style={{ padding:'13px 14px' }}>
                          <span style={{ padding:'4px 10px', borderRadius:99, fontSize:11, fontWeight:700, background:tc.bg, color:tc.color, border:`1px solid ${tc.border}` }}>
                            {tc.icon} {c.Tier_Required}+
                          </span>
                        </td>
                        <td style={{ padding:'13px 14px' }}>
                          <div style={{ fontSize:12, fontWeight:700, color:'#374151', marginBottom:4 }}>{c.Uses_Count}/{c.Uses_Limit}</div>
                          <div style={{ height:5, background:'#e5e7eb', borderRadius:99, overflow:'hidden', width:80 }}>
                            <div style={{ height:'100%', width:`${usagePct}%`, background: usagePct>80?'#dc2626':'#6366f1', borderRadius:99 }} />
                          </div>
                        </td>
                        <td style={{ padding:'13px 14px' }}>
                          <div style={{ fontSize:12, fontWeight:700,
                            color: expired ? '#dc2626' : days <= 7 ? '#d97706' : '#16a34a' }}>
                            {expired ? '❌ Expired' : days <= 7 ? `⚠️ ${days}d left` : `✅ ${days}d`}
                          </div>
                          <div style={{ fontSize:11, color:'#94a3b8' }}>{String(c.Expiry_Date).slice(0,10)}</div>
                        </td>
                        <td style={{ padding:'13px 14px' }}>
                          <button onClick={() => toggleCoupon(c)}
                            style={{ padding:'5px 12px', borderRadius:8, border:'none', cursor:'pointer', fontSize:11, fontWeight:700,
                              background: c.Is_Active && !expired ? '#dcfce7' : '#f3f4f6',
                              color: c.Is_Active && !expired ? '#16a34a' : '#6b7280' }}>
                            {c.Is_Active && !expired ? '● Active' : '○ Off'}
                          </button>
                        </td>
                        <td style={{ padding:'13px 14px' }}>
                          <div style={{ display:'flex', gap:5 }}>
                            <button onClick={() => {
                              setCouponForm({...c, Expiry_Date: String(c.Expiry_Date).slice(0,10)})
                              setCouponModal(c.Coupon_ID)
                            }}
                              style={{ padding:'5px 10px', borderRadius:7, border:'1.5px solid #93c5fd', background:'#dbeafe', color:'#1d4ed8', cursor:'pointer', fontSize:11, fontWeight:700 }}>
                              Edit
                            </button>
                            <button onClick={() => handleDeleteCoupon(c.Coupon_ID)}
                              style={{ padding:'5px 10px', borderRadius:7, border:'1.5px solid #fca5a5', background:'#fee2e2', color:'#dc2626', cursor:'pointer', fontSize:11, fontWeight:700 }}>
                              Del
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── REGISTER MEMBER MODAL ── */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}
          onClick={e => { if(e.target===e.currentTarget) setShowModal(false) }}>
          <div style={{ background:'#fff', borderRadius:18, padding:32, width:'100%', maxWidth:460, boxShadow:'0 8px 40px rgba(0,0,0,.15)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h3 style={{ fontSize:18, fontWeight:800, color:'#0f172a' }}>+ Register Membership</h3>
              <button onClick={() => setShowModal(false)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#94a3b8' }}>✕</button>
            </div>
            <input value={customerSearch} onChange={e => setCustomerSearch(e.target.value)}
              placeholder="🔍 Search customer by name..."
              style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', marginBottom:10, boxSizing:'border-box' }} />
            <div style={{ maxHeight:220, overflowY:'auto', border:'1.5px solid #e5e7eb', borderRadius:10, marginBottom:20 }}>
              {filteredCustomers.length === 0 ? (
                <div style={{ padding:20, textAlign:'center', color:'#94a3b8', fontSize:13 }}>
                  {customers.length === 0 ? 'No unregistered customers found.' : 'No customers match your search.'}
                </div>
              ) : filteredCustomers.map(c => (
                <div key={c.id} onClick={() => setSelectedUser(String(c.id))}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', cursor:'pointer', borderBottom:'1px solid #f3f4f6',
                    background: selectedUser===String(c.id) ? '#f0fdf4' : '#fff' }}>
                  <div style={{ width:32, height:32, borderRadius:10, background:'#f5f3ff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13, color:'#7c3aed' }}>
                    {(c.full_name||'?')[0].toUpperCase()}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:'#0f172a', fontSize:13 }}>{c.full_name}</div>
                    <div style={{ fontSize:11, color:'#94a3b8' }}>{c.email}</div>
                  </div>
                  {selectedUser===String(c.id) && <span style={{ color:'#16a34a', fontSize:18 }}>✅</span>}
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={handleRegister} disabled={saving||!selectedUser}
                style={{ flex:1, padding:'12px', borderRadius:10, border:'none', background: selectedUser?'linear-gradient(135deg,#d97706,#f59e0b)':'#e5e7eb', color: selectedUser?'#fff':'#9ca3af', fontWeight:700, cursor: selectedUser?'pointer':'not-allowed', fontSize:14 }}>
                {saving ? '⏳ Registering…' : '⭐ Register'}
              </button>
              <button onClick={() => setShowModal(false)}
                style={{ flex:1, padding:'12px', borderRadius:10, border:'1.5px solid #e5e7eb', background:'#f8fafc', fontWeight:700, cursor:'pointer', fontSize:14 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD POINTS MODAL ── */}
      {pointsModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}
          onClick={e => { if(e.target===e.currentTarget) setPointsModal(null) }}>
          <div style={{ background:'#fff', borderRadius:18, padding:32, width:'100%', maxWidth:400, boxShadow:'0 8px 40px rgba(0,0,0,.15)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h3 style={{ fontSize:18, fontWeight:800, color:'#0f172a' }}>+ Add Points</h3>
              <button onClick={() => setPointsModal(null)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#94a3b8' }}>✕</button>
            </div>
            <div style={{ background:'#f8fafc', borderRadius:10, padding:'12px 16px', marginBottom:18, fontSize:13 }}>
              <strong>{pointsModal.full_name}</strong> — <strong style={{ color:'#6366f1' }}>{pointsModal.points} pts</strong> · <strong style={{ color:'#16a34a' }}>${Number(pointsModal.total_spent||0).toFixed(2)} spent</strong>
            </div>
            {[['Points to Add','points'],['Amount Spent ($)','total_spent']].map(([label,key]) => (
              <div key={key} style={{ marginBottom:14 }}>
                <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:6, color:'#374151' }}>{label}</label>
                <input type="number" min="0" value={pointsForm[key]}
                  onChange={e => setPointsForm({...pointsForm, [key]: parseFloat(e.target.value)||0})}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', boxSizing:'border-box' }} />
              </div>
            ))}
            <div style={{ display:'flex', gap:10, marginTop:8 }}>
              <button onClick={handleAddPoints}
                style={{ flex:1, padding:'12px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14 }}>
                ✅ Add Points
              </button>
              <button onClick={() => setPointsModal(null)}
                style={{ flex:1, padding:'12px', borderRadius:10, border:'1.5px solid #e5e7eb', background:'#f8fafc', fontWeight:700, cursor:'pointer', fontSize:14 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── COUPON MODAL ── */}
      {couponModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}
          onClick={e => { if(e.target===e.currentTarget) setCouponModal(null) }}>
          <div style={{ background:'#fff', borderRadius:18, padding:32, width:'100%', maxWidth:500, boxShadow:'0 8px 40px rgba(0,0,0,.15)', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
              <h3 style={{ fontSize:18, fontWeight:800, color:'#0f172a' }}>
                {couponModal==='add' ? '🎟️ Create Coupon' : '✏️ Edit Coupon'}
              </h3>
              <button onClick={() => setCouponModal(null)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#94a3b8' }}>✕</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:700, display:'block', marginBottom:6, color:'#374151', textTransform:'uppercase', letterSpacing:.4 }}>Coupon Code *</label>
                <input value={couponForm.Code} onChange={e => setCouponForm({...couponForm, Code:e.target.value.toUpperCase()})}
                  placeholder="e.g. SAVE20" maxLength={20}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:'monospace', fontWeight:700 }} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, display:'block', marginBottom:6, color:'#374151', textTransform:'uppercase', letterSpacing:.4 }}>Usage Limit</label>
                <input type="number" min="1" value={couponForm.Uses_Limit}
                  onChange={e => setCouponForm({...couponForm, Uses_Limit:parseInt(e.target.value)||1})}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', boxSizing:'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, display:'block', marginBottom:6, color:'#374151', textTransform:'uppercase', letterSpacing:.4 }}>Discount Type</label>
                <select value={couponForm.Discount_Type} onChange={e => setCouponForm({...couponForm, Discount_Type:e.target.value})}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none' }}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, display:'block', marginBottom:6, color:'#374151', textTransform:'uppercase', letterSpacing:.4 }}>
                  Value {couponForm.Discount_Type==='percentage'?'(%)':'($)'}
                </label>
                <input type="number" min="1" value={couponForm.Discount_Value}
                  onChange={e => setCouponForm({...couponForm, Discount_Value:parseFloat(e.target.value)||0})}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', boxSizing:'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, display:'block', marginBottom:6, color:'#374151', textTransform:'uppercase', letterSpacing:.4 }}>Min Purchase ($)</label>
                <input type="number" min="0" value={couponForm.Min_Purchase}
                  onChange={e => setCouponForm({...couponForm, Min_Purchase:parseFloat(e.target.value)||0})}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', boxSizing:'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, display:'block', marginBottom:6, color:'#374151', textTransform:'uppercase', letterSpacing:.4 }}>Tier Required</label>
                <select value={couponForm.Tier_Required} onChange={e => setCouponForm({...couponForm, Tier_Required:e.target.value})}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none' }}>
                  {['Bronze','Silver','Gold','Platinum'].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ fontSize:12, fontWeight:700, display:'block', marginBottom:6, color:'#374151', textTransform:'uppercase', letterSpacing:.4 }}>Expiry Date *</label>
                <input type="date" value={couponForm.Expiry_Date}
                  onChange={e => setCouponForm({...couponForm, Expiry_Date:e.target.value})}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', boxSizing:'border-box' }} />
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ fontSize:12, fontWeight:700, display:'block', marginBottom:6, color:'#374151', textTransform:'uppercase', letterSpacing:.4 }}>Description</label>
                <input value={couponForm.Description}
                  onChange={e => setCouponForm({...couponForm, Description:e.target.value})}
                  placeholder="e.g. Gold member 20% off all items"
                  style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', boxSizing:'border-box' }} />
              </div>
            </div>

            {/* Live Preview */}
            <div style={{ margin:'18px 0', padding:'16px 18px', background: TIER_COLORS[couponForm.Tier_Required]?.bg||'#f8fafc', borderRadius:12, border:`2px dashed ${TIER_COLORS[couponForm.Tier_Required]?.border||'#e5e7eb'}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:11, color:'#64748b', fontWeight:600, marginBottom:4, textTransform:'uppercase' }}>Preview</div>
                <div style={{ fontFamily:'monospace', fontWeight:800, fontSize:18, color:'#6366f1' }}>{couponForm.Code||'CODE'}</div>
                <div style={{ fontSize:12, color:'#64748b', marginTop:3 }}>{couponForm.Description||'No description'}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:24, fontWeight:800, color:'#16a34a' }}>
                  {couponForm.Discount_Type==='percentage' ? `${couponForm.Discount_Value}% OFF` : `$${couponForm.Discount_Value} OFF`}
                </div>
                <div style={{ fontSize:11, color:'#94a3b8', marginTop:3 }}>
                  {TIER_COLORS[couponForm.Tier_Required]?.icon} {couponForm.Tier_Required}+ · Expires {couponForm.Expiry_Date||'—'}
                </div>
              </div>
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={handleSaveCoupon} disabled={saving}
                style={{ flex:1, padding:'12px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14, opacity:saving?0.7:1 }}>
                {saving ? '⏳ Saving…' : '✅ Save Coupon'}
              </button>
              <button onClick={() => setCouponModal(null)}
                style={{ flex:1, padding:'12px', borderRadius:10, border:'1.5px solid #e5e7eb', background:'#f8fafc', fontWeight:700, cursor:'pointer', fontSize:14 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
