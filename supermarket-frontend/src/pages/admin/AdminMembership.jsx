import { useState, useEffect } from 'react'
import API from '../../services/api'
import toast from 'react-hot-toast'

const TIER_COLORS = {
  Bronze:   { bg:'#fff7ed', color:'#ea580c', border:'#fed7aa', icon:'🥉' },
  Silver:   { bg:'#f8fafc', color:'#64748b', border:'#cbd5e1', icon:'🥈' },
  Gold:     { bg:'#fefce8', color:'#ca8a04', border:'#fde047', icon:'🥇' },
  Platinum: { bg:'#f5f3ff', color:'#7c3aed', border:'#c4b5fd', icon:'💎' },
}

function ProgressBar({ spent }) {
  const tiers = [
    { label:'Silver',   min:50,  max:200  },
    { label:'Gold',     min:200, max:500  },
    { label:'Platinum', min:500, max:1000 },
  ]
  const next = tiers.find(t => spent < t.max)
  if (!next) return <span style={{ fontSize:12, color:'#7c3aed', fontWeight:700 }}>💎 Max Tier!</span>
  const pct = Math.min(100, ((spent - (next.min||0)) / (next.max - (next.min||0))) * 100)
  return (
    <div style={{ minWidth:140 }}>
      <div style={{ fontSize:11, color:'#64748b', marginBottom:4 }}>
        ${spent.toFixed(0)} / ${next.max} → {next.label}
      </div>
      <div style={{ background:'#e5e7eb', borderRadius:99, height:6, overflow:'hidden' }}>
        <div style={{ width:`${pct}%`, height:'100%', background:'linear-gradient(90deg,#16a34a,#22c55e)', borderRadius:99, transition:'width .4s' }} />
      </div>
    </div>
  )
}

export default function AdminMembership() {
  const [members, setMembers]       = useState([])
  const [customers, setCustomers]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [tierFilter, setTierFilter] = useState('All')
  const [showModal, setShowModal]   = useState(false)
  const [selectedUser, setSelectedUser] = useState('')
  const [customerSearch, setCustomerSearch] = useState('')
  const [saving, setSaving]         = useState(false)
  const [pointsModal, setPointsModal] = useState(null)
  const [pointsForm, setPointsForm] = useState({ points:0, total_spent:0 })

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [mRes, cRes] = await Promise.all([
        API.get('/api/membership/'),
        API.get('/api/membership/customers'),
      ])
      setMembers(mRes.data || [])
      setCustomers(cRes.data || [])
    } catch { setMembers([]); setCustomers([]) }
    finally { setLoading(false) }
  }

  const handleRegister = async () => {
    if (!selectedUser) { toast.error('Please select a customer'); return }
    setSaving(true)
    try {
      await API.post('/api/membership/register', { customer_id: parseInt(selectedUser) })
      toast.success('Membership registered!')
      setShowModal(false)
      setSelectedUser('')
      setCustomerSearch('')
      fetchAll()
    } catch (e) { toast.error(e.response?.data?.detail || 'Error') }
    finally { setSaving(false) }
  }

  const handleAddPoints = async () => {
    try {
      await API.put(`/api/membership/add-points/${pointsModal.id}`, pointsForm)
      toast.success('Points updated!')
      setPointsModal(null)
      fetchAll()
    } catch { toast.error('Failed') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this member?')) return
    try { await API.delete(`/api/membership/${id}`); toast.success('Removed'); fetchAll() }
    catch { toast.error('Failed') }
  }

  const filtered = members.filter(m => {
    const matchSearch = !search ||
      m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase())
    const matchTier = tierFilter === 'All' || m.tier === tierFilter
    return matchSearch && matchTier
  })

  // Filter customers in modal by search
  const filteredCustomers = customers.filter(c =>
    !customerSearch ||
    c.full_name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.email?.toLowerCase().includes(customerSearch.toLowerCase())
  )

  const stats = {
    total:    members.length,
    bronze:   members.filter(m => m.tier==='Bronze').length,
    silver:   members.filter(m => m.tier==='Silver').length,
    gold:     members.filter(m => m.tier==='Gold').length,
    platinum: members.filter(m => m.tier==='Platinum').length,
  }

  return (
    <div style={{ padding:28, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h2 style={{ fontSize:24, fontWeight:800, color:'#0f172a', marginBottom:4 }}>⭐ Customer Membership</h2>
          <p style={{ color:'#64748b', fontSize:14 }}>Manage loyalty tiers and points for registered customers</p>
        </div>
        <button onClick={() => { setShowModal(true); setCustomerSearch('') }}
          style={{ padding:'10px 20px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#d97706,#f59e0b)', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14, boxShadow:'0 4px 12px rgba(217,119,6,.3)' }}>
          + Register Member
        </button>
      </div>

      {/* Tier Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:24 }}>
        {[
          ['Total',    stats.total,    '#6366f1', 'linear-gradient(135deg,#eef2ff,#e0e7ff)', '👥'],
          ['Bronze',   stats.bronze,   '#ea580c', 'linear-gradient(135deg,#fff7ed,#fed7aa)', '🥉'],
          ['Silver',   stats.silver,   '#64748b', 'linear-gradient(135deg,#f8fafc,#e2e8f0)', '🥈'],
          ['Gold',     stats.gold,     '#ca8a04', 'linear-gradient(135deg,#fefce8,#fef08a)', '🥇'],
          ['Platinum', stats.platinum, '#7c3aed', 'linear-gradient(135deg,#f5f3ff,#ede9fe)', '💎'],
        ].map(([l,v,c,bg,icon]) => (
          <div key={l} style={{ background:bg, borderRadius:14, padding:'16px 18px', border:`1.5px solid ${c}22`, cursor:'pointer' }}
            onClick={() => setTierFilter(l==='Total'?'All':l)}>
            <div style={{ fontSize:11, color:'#64748b', marginBottom:4, fontWeight:600 }}>{icon} {l}</div>
            <div style={{ fontSize:28, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{ display:'flex', gap:10, marginBottom:18, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="🔍 Search by name or email..."
          style={{ flex:1, minWidth:200, padding:'10px 14px', borderRadius:10, border:'1.5px solid #e5e7eb', fontSize:13, outline:'none', boxSizing:'border-box' }} />
        {['All','Bronze','Silver','Gold','Platinum'].map(t => {
          const tc = TIER_COLORS[t] || { bg:'#f1f5f9', color:'#374151', border:'#e2e8f0' }
          return (
            <button key={t} onClick={() => setTierFilter(t)}
              style={{ padding:'9px 16px', borderRadius:9, border:`1.5px solid ${tierFilter===t ? tc.border : '#e5e7eb'}`,
                cursor:'pointer', fontSize:12, fontWeight:700,
                background: tierFilter===t ? tc.bg : '#fff',
                color: tierFilter===t ? tc.color : '#374151' }}>
              {t==='All'?'All Tiers':`${tc.icon} ${t}`}
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div style={{ background:'#fff', borderRadius:16, overflow:'hidden', border:'1.5px solid #e5e7eb', boxShadow:'0 2px 10px rgba(0,0,0,.04)' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ background:'#f8fafc', borderBottom:'2px solid #e5e7eb' }}>
              {['Customer','Tier','Points','Total Spent','Progress to Next','Joined','Actions'].map(h => (
                <th key={h} style={{ padding:'13px 16px', textAlign:'left', fontWeight:700, color:'#374151' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding:40, textAlign:'center', color:'#94a3b8' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding:40, textAlign:'center', color:'#94a3b8' }}>
                <div style={{ fontSize:36, marginBottom:10 }}>⭐</div>
                <p>{members.length === 0 ? 'No members yet. Register your first customer!' : 'No members match your search.'}</p>
              </td></tr>
            ) : filtered.map(m => {
              const tc = TIER_COLORS[m.tier] || TIER_COLORS.Bronze
              return (
                <tr key={m.id} style={{ borderBottom:'1px solid #f8fafc' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#fafafa'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'13px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:36, height:36, borderRadius:12, background:`linear-gradient(135deg,${tc.color}22,${tc.color}11)`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:14, color:tc.color }}>
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
                  <td style={{ padding:'13px 16px' }}><ProgressBar spent={Number(m.total_spent||0)} /></td>
                  <td style={{ padding:'13px 16px', color:'#64748b', fontSize:12 }}>
                    {m.joined_at ? new Date(m.joined_at).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding:'13px 16px' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={() => { setPointsModal(m); setPointsForm({ points:0, total_spent:0 }) }}
                        style={{ padding:'5px 10px', borderRadius:7, border:'1.5px solid #fcd34d', background:'#fefce8', color:'#ca8a04', cursor:'pointer', fontSize:11, fontWeight:700 }}>
                        + Points
                      </button>
                      <button onClick={() => handleDelete(m.id)}
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

      {/* Register Member Modal */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}
          onClick={e => { if(e.target===e.currentTarget) setShowModal(false) }}>
          <div style={{ background:'#fff', borderRadius:18, padding:32, width:'100%', maxWidth:460, boxShadow:'0 8px 40px rgba(0,0,0,.15)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h3 style={{ fontSize:18, fontWeight:800, color:'#0f172a' }}>+ Register Membership</h3>
              <button onClick={() => setShowModal(false)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#94a3b8' }}>✕</button>
            </div>

            <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:8, color:'#374151' }}>
              Search Customer
            </label>
            {/* Search input */}
            <input value={customerSearch} onChange={e => setCustomerSearch(e.target.value)}
              placeholder="🔍 Type name or email..."
              style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', marginBottom:10, boxSizing:'border-box' }} />

            {/* Customer list */}
            <div style={{ maxHeight:220, overflowY:'auto', border:'1.5px solid #e5e7eb', borderRadius:10, marginBottom:20 }}>
              {filteredCustomers.length === 0 ? (
                <div style={{ padding:20, textAlign:'center', color:'#94a3b8', fontSize:13 }}>
                  {customers.length === 0
                    ? 'No customers found. Users with role "customer" will appear here.'
                    : 'No customers match your search.'}
                </div>
              ) : filteredCustomers.map(c => (
                <div key={c.id} onClick={() => setSelectedUser(String(c.id || c.Customer_ID))}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', cursor:'pointer', borderBottom:'1px solid #f3f4f6',
                    background: selectedUser===String(c.id) ? '#f0fdf4' : '#fff',
                    transition:'background .15s' }}
                  onMouseEnter={e => { if(selectedUser!==String(c.id)) e.currentTarget.style.background='#f8fafc' }}
                  onMouseLeave={e => { if(selectedUser!==String(c.id)) e.currentTarget.style.background='#fff' }}>
                  <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#7c3aed22,#7c3aed11)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13, color:'#7c3aed', flexShrink:0 }}>
                    {(c.full_name||'?')[0].toUpperCase()}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:'#0f172a', fontSize:13 }}>{c.full_name}</div>
                    <div style={{ fontSize:11, color:'#94a3b8' }}>{c.email}</div>
                  </div>
                  {selectedUser===String(c.id) && (
                    <span style={{ color:'#16a34a', fontSize:18 }}>✅</span>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={handleRegister} disabled={saving || !selectedUser}
                style={{ flex:1, padding:'12px', borderRadius:10, border:'none', background: selectedUser ? 'linear-gradient(135deg,#d97706,#f59e0b)' : '#e5e7eb', color: selectedUser ? '#fff' : '#9ca3af', fontWeight:700, cursor: selectedUser ? 'pointer' : 'not-allowed', fontSize:14, opacity:saving?0.7:1 }}>
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

      {/* Add Points Modal */}
      {pointsModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}
          onClick={e => { if(e.target===e.currentTarget) setPointsModal(null) }}>
          <div style={{ background:'#fff', borderRadius:18, padding:32, width:'100%', maxWidth:400, boxShadow:'0 8px 40px rgba(0,0,0,.15)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h3 style={{ fontSize:18, fontWeight:800, color:'#0f172a' }}>+ Add Points</h3>
              <button onClick={() => setPointsModal(null)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#94a3b8' }}>✕</button>
            </div>
            <div style={{ background:'#f8fafc', borderRadius:10, padding:'12px 16px', marginBottom:18, fontSize:13 }}>
              <strong>{pointsModal.full_name}</strong> — currently <strong style={{ color:'#6366f1' }}>{pointsModal.points} pts</strong> · <strong style={{ color:'#16a34a' }}>${Number(pointsModal.total_spent||0).toFixed(2)} spent</strong>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:6, color:'#374151' }}>Points to Add</label>
              <input type="number" min="0" value={pointsForm.points} onChange={e=>setPointsForm({...pointsForm,points:parseInt(e.target.value)||0})}
                style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', boxSizing:'border-box' }} />
            </div>
            <div style={{ marginBottom:22 }}>
              <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:6, color:'#374151' }}>Amount Spent ($)</label>
              <input type="number" min="0" step="0.01" value={pointsForm.total_spent} onChange={e=>setPointsForm({...pointsForm,total_spent:parseFloat(e.target.value)||0})}
                style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', boxSizing:'border-box' }} />
            </div>
            <div style={{ display:'flex', gap:10 }}>
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
    </div>
  )
}
