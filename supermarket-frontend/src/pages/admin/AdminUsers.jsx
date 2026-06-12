import { useState, useEffect } from 'react'
import API from '../../services/api'
import toast from 'react-hot-toast'

const ROLE_COLORS = {
  admin:    { bg:'#fef2f2', color:'#dc2626', border:'#fecaca' },
  manager:  { bg:'#dbeafe', color:'#1d4ed8', border:'#93c5fd' },
  cashier:  { bg:'#dcfce7', color:'#15803d', border:'#86efac' },
  employee: { bg:'#fef3c7', color:'#d97706', border:'#fcd34d' },
  customer: { bg:'#f5f3ff', color:'#7c3aed', border:'#c4b5fd' },
}

const SHIFT_TEMPLATES = [
  { name:'Morning',   start:'06:00', end:'14:00', color:'#f59e0b' },
  { name:'Afternoon', start:'14:00', end:'22:00', color:'#6366f1' },
  { name:'Full Day',  start:'08:00', end:'20:00', color:'#16a34a' },
]

const STATUS_COLORS = {
  scheduled: { bg:'#dbeafe', color:'#1d4ed8' },
  completed:  { bg:'#dcfce7', color:'#15803d' },
  absent:     { bg:'#fee2e2', color:'#dc2626' },
  cancelled:  { bg:'#f3f4f6', color:'#6b7280' },
}

const PAGE_SIZE = 20

export default function AdminUsers() {
  const [tab, setTab]           = useState('users')
  const [users, setUsers]       = useState([])
  const [shifts, setShifts]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [page, setPage]         = useState(1)
  const [userModal, setUserModal]   = useState(null)
  const [shiftModal, setShiftModal] = useState(null)
  const [form, setForm]         = useState({ full_name:'', email:'', phone:'', role:'employee', password:'' })
  const [shiftForm, setShiftForm] = useState({ user_id:'', shift_name:'Morning', shift_date:'', start_time:'06:00', end_time:'14:00', status:'scheduled', note:'' })
  const [saving, setSaving]     = useState(false)

  const today    = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now()+86400000).toISOString().split('T')[0]
  const [dayView, setDayView] = useState('today')
  const [selectedDate, setSelectedDate] = useState(today)

  useEffect(() => { fetchAll() }, [])
  useEffect(() => { setPage(1) }, [search, roleFilter, tab])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [uRes, sRes] = await Promise.all([
        API.get('/api/users/employees'),
        API.get('/api/shifts/').catch(() => ({ data:[] })),
      ])
      setUsers(Array.isArray(uRes.data) ? uRes.data : [])
      setShifts(Array.isArray(sRes.data) ? sRes.data : [])
    } catch(e) {
      console.error('fetch error', e)
      setUsers([])
      setShifts([])
      toast.error('Failed to load users')
    }
    setLoading(false)
  }

  // ── User CRUD ──────────────────────────────────────────────
  const handleSaveUser = async () => {
    if (!form.full_name || !form.email) { toast.error('Name and email required'); return }
    if (userModal === 'add' && !form.password) { toast.error('Password required'); return }
    setSaving(true)
    try {
      if (userModal === 'add') await API.post('/api/users/employees', form)
      else await API.put(`/api/users/employees/${form.id}`, form)
      toast.success(userModal === 'add' ? 'User added!' : 'User updated!')
      setUserModal(null)
      fetchAll()
    } catch(e) { toast.error(e.response?.data?.detail || 'Error') }
    finally { setSaving(false) }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try { await API.delete(`/api/users/employees/${id}`); toast.success('Deleted'); fetchAll() }
    catch { toast.error('Failed to delete') }
  }

  // ── Shift CRUD ─────────────────────────────────────────────
  const handleSaveShift = async () => {
    if (!shiftForm.user_id || !shiftForm.shift_date) { toast.error('User and date required'); return }
    setSaving(true)
    try {
      if (shiftModal === 'add') await API.post('/api/shifts/', shiftForm)
      else await API.put(`/api/shifts/${shiftModal}`, shiftForm)
      toast.success(shiftModal === 'add' ? 'Shift created!' : 'Shift updated!')
      setShiftModal(null)
      fetchAll()
    } catch(e) { toast.error(e.response?.data?.detail || 'Error') }
    finally { setSaving(false) }
  }

  const handleDeleteShift = async (id) => {
    if (!window.confirm('Delete this shift?')) return
    try { await API.delete(`/api/shifts/${id}`); toast.success('Shift deleted'); fetchAll() }
    catch { toast.error('Failed') }
  }

  const applyTemplate = (t) => setShiftForm(f => ({ ...f, shift_name:t.name, start_time:t.start, end_time:t.end }))

  // ── Filtering & Pagination ─────────────────────────────────
  const filtered = users.filter(u => {
    const matchSearch = !search ||
      (u.full_name||'').toLowerCase().includes(search.toLowerCase()) ||
      (u.email||'').toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'All' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)

  const shiftableUsers = users.filter(u => ['employee','cashier','manager'].includes(u.role))
  const todayShifts    = shifts.filter(s => s.shift_date === today)

  const stats = {
    total:     users.length,
    admins:    users.filter(u => ['admin','manager'].includes(u.role)).length,
    staff:     users.filter(u => ['cashier','employee'].includes(u.role)).length,
    customers: users.filter(u => u.role === 'customer').length,
  }

  return (
    <div className='admin-page'>

      <div className='admin-header'>
        <div>
          <div className='admin-header-tag'>User Management</div>
          <h1 className='admin-title'>Users and Shifts</h1>
          <p className='admin-subtitle'>Manage all users and employee shift schedules</p>
        </div>
        <button onClick={() => { setForm({ full_name:'', email:'', phone:'', role:'employee', password:'' }); setUserModal('add') }}
          style={{ padding:'10px 20px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#15803d,#22c55e)', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14, boxShadow:'0 4px 12px rgba(21,128,61,.3)' }}>
          + Add User
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          ['Total Users',       stats.total,     '#6366f1','linear-gradient(135deg,#eef2ff,#e0e7ff)'],
          ['Admins & Managers', stats.admins,    '#dc2626','linear-gradient(135deg,#fef2f2,#fee2e2)'],
          ['Staff',             stats.staff,     '#16a34a','linear-gradient(135deg,#f0fdf4,#dcfce7)'],
          ['Customers',         stats.customers, '#7c3aed','linear-gradient(135deg,#f5f3ff,#ede9fe)'],
        ].map(([l,v,c,bg]) => (
          <div key={l} style={{ background:bg, borderRadius:14, padding:'18px 20px', border:`1.5px solid ${c}22` }}>
            <div style={{ fontSize:12, color:'#64748b', marginBottom:6, fontWeight:600 }}>{l}</div>
            <div style={{ fontSize:28, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:20, background:'#f1f5f9', borderRadius:12, padding:4, width:'fit-content' }}>
        {[['users','Users'],['shifts','Shifts']].map(([key,label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ padding:'9px 20px', borderRadius:9, border:'none', cursor:'pointer', fontSize:13, fontWeight:700,
              background: tab===key ? '#fff' : 'transparent',
              color: tab===key ? '#0f172a' : '#64748b',
              boxShadow: tab===key ? '0 2px 8px rgba(0,0,0,.08)' : 'none' }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── USERS TAB ── */}
      {tab === 'users' && (
        <>
          {/* Search + Role filters */}
          <div style={{ display:'flex', gap:10, marginBottom:18, flexWrap:'wrap', alignItems:'center' }}>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="🔍 Search by name or email..."
              style={{ flex:1, minWidth:220, padding:'10px 14px', borderRadius:10, border:'1.5px solid #e5e7eb', fontSize:13, outline:'none', boxSizing:'border-box' }} />
            {['All','admin','manager','cashier','employee','customer'].map(r => {
              const rc = ROLE_COLORS[r] || { bg:'#f1f5f9', color:'#374151', border:'#e2e8f0' }
              return (
                <button key={r} onClick={() => setRoleFilter(r)}
                  style={{ padding:'8px 14px', borderRadius:9, cursor:'pointer', fontSize:12, fontWeight:700,
                    border:`1.5px solid ${roleFilter===r ? rc.border : '#e5e7eb'}`,
                    background: roleFilter===r ? rc.bg : '#fff',
                    color: roleFilter===r ? rc.color : '#374151' }}>
                  {r}
                </button>
              )
            })}
          </div>

          {/* Result count */}
          <div style={{ fontSize:13, color:'#64748b', marginBottom:12 }}>
            Showing <strong style={{ color:'#0f172a' }}>{paginated.length}</strong> of <strong style={{ color:'#0f172a' }}>{filtered.length}</strong> users
            {roleFilter !== 'All' && <span style={{ color:'#6366f1' }}> (filtered by: {roleFilter})</span>}
          </div>

          {/* Table */}
          <div style={{ background:'#fff', borderRadius:16, overflow:'hidden', border:'1.5px solid #e5e7eb', boxShadow:'0 2px 10px rgba(0,0,0,.04)' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ background:'#f8fafc', borderBottom:'2px solid #e5e7eb' }}>
                  {['#','User','Email','Phone','Role','Access','Actions'].map(h => (
                    <th key={h} style={{ padding:'12px 14px', textAlign:'left', fontWeight:700, color:'#374151' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ padding:40, textAlign:'center', color:'#94a3b8' }}>
                    <div style={{ fontSize:32, marginBottom:8 }}>⏳</div>Loading users...
                  </td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding:40, textAlign:'center', color:'#94a3b8' }}>
                    <div style={{ fontSize:32, marginBottom:8 }}>🔍</div>No users match your search.
                  </td></tr>
                ) : paginated.map((u, idx) => {
                  const rc = ROLE_COLORS[u.role] || ROLE_COLORS.customer
                  const canAdmin = ['admin','manager'].includes(u.role)
                  return (
                    <tr key={u.id} style={{ borderBottom:'1px solid #f8fafc' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#fafafa'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'11px 14px', color:'#94a3b8', fontSize:12 }}>
                        {(page-1)*PAGE_SIZE + idx + 1}
                      </td>
                      <td style={{ padding:'11px 14px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                          <div style={{ width:32, height:32, borderRadius:10, background:`${rc.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13, color:rc.color, flexShrink:0 }}>
                            {(u.full_name||'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <strong style={{ color:'#0f172a', fontSize:13 }}>{u.full_name}</strong>
                            {['employee','cashier'].includes(u.role) && (
                              <div style={{ fontSize:10, color:'#94a3b8', marginTop:1 }}>
                                {shifts.filter(s=>s.user_id===u.id&&s.shift_date===today).length > 0 ? 'On shift' : 'Off today'}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:'11px 14px', color:'#64748b', fontSize:12 }}>{u.email}</td>
                      <td style={{ padding:'11px 14px', color:'#64748b', fontSize:12 }}>{u.phone||'—'}</td>
                      <td style={{ padding:'11px 14px' }}>
                        <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700, background:rc.bg, color:rc.color, border:`1px solid ${rc.border}` }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding:'11px 14px' }}>
                        {canAdmin
                          ? <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700, background:'#fef3c7', color:'#d97706', border:'1px solid #fcd34d' }}>⚙️ Admin</span>
                          : <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700, background:'#f0fdf4', color:'#16a34a', border:'1px solid #86efac' }}>Shop</span>
                        }
                      </td>
                      <td style={{ padding:'11px 14px' }}>
                        <div style={{ display:'flex', gap:5 }}>
                          <button onClick={() => { setForm({...u, password:''}); setUserModal('edit') }}
                            style={{ padding:'4px 10px', borderRadius:7, border:'1.5px solid #93c5fd', background:'#dbeafe', color:'#1d4ed8', cursor:'pointer', fontSize:11, fontWeight:700 }}>
                            Edit
                          </button>
                          {['employee','cashier'].includes(u.role) && (
                            <button onClick={() => { setShiftForm({user_id:u.id, shift_name:'Morning', shift_date:today, start_time:'06:00', end_time:'14:00', status:'scheduled', note:''}); setShiftModal('add') }}
                              style={{ padding:'4px 10px', borderRadius:7, border:'1.5px solid #fcd34d', background:'#fef3c7', color:'#d97706', cursor:'pointer', fontSize:11, fontWeight:700 }}>
                              +Shift
                            </button>
                          )}
                          <button onClick={() => handleDeleteUser(u.id)}
                            style={{ padding:'4px 10px', borderRadius:7, border:'1.5px solid #fca5a5', background:'#fee2e2', color:'#dc2626', cursor:'pointer', fontSize:11, fontWeight:700 }}>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:8, marginTop:16 }}>
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                style={{ padding:'7px 16px', borderRadius:8, border:'1.5px solid #e5e7eb', background: page===1?'#f8fafc':'#fff', cursor: page===1?'not-allowed':'pointer', fontWeight:600, fontSize:13, color: page===1?'#94a3b8':'#374151' }}>
                ← Prev
              </button>
              {Array.from({length: Math.min(totalPages,7)}, (_,i) => {
                const p = totalPages <= 7 ? i+1 : (page <= 4 ? i+1 : page-3+i)
                if (p < 1 || p > totalPages) return null
                return (
                  <button key={p} onClick={() => setPage(p)}
                    style={{ width:36, height:36, borderRadius:8, border:`1.5px solid ${page===p?'#6366f1':'#e5e7eb'}`, background: page===p?'#6366f1':'#fff', color: page===p?'#fff':'#374151', cursor:'pointer', fontWeight:700, fontSize:13 }}>
                    {p}
                  </button>
                )
              })}
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                style={{ padding:'7px 16px', borderRadius:8, border:'1.5px solid #e5e7eb', background: page===totalPages?'#f8fafc':'#fff', cursor: page===totalPages?'not-allowed':'pointer', fontWeight:600, fontSize:13, color: page===totalPages?'#94a3b8':'#374151' }}>
                Next →
              </button>
              <span style={{ fontSize:12, color:'#94a3b8', marginLeft:4 }}>
                Page {page} of {totalPages} ({filtered.length} users)
              </span>
            </div>
          )}
        </>
      )}

      {/* ── SHIFTS TAB ── */}
      {tab === 'shifts' && (
        <>
          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div style={{ display:'flex', gap:8 }}>
              {[
                { key:'today',    label:'Today',    date:today,    count:shifts.filter(s=>s.shift_date===today).length,    color:'#16a34a', bg:'#f0fdf4', border:'#86efac' },
                { key:'tomorrow', label:'Tomorrow', date:tomorrow, count:shifts.filter(s=>s.shift_date===tomorrow).length, color:'#6366f1', bg:'#eef2ff', border:'#a5b4fc' },
                { key:'all',      label:'All Shifts',date:null,   count:shifts.length,                                     color:'#374151', bg:'#f8fafc', border:'#e5e7eb' },
              ].map(d => (
                <button key={d.key} onClick={()=>setDayView(d.key)}
                  style={{ padding:'10px 18px', borderRadius:12, border:`1.5px solid ${dayView===d.key?d.border:'#e5e7eb'}`,
                    background:dayView===d.key?d.bg:'#fff', cursor:'pointer', fontSize:13,
                    fontWeight:700, color:dayView===d.key?d.color:'#64748b',
                    fontFamily:"'Plus Jakarta Sans',sans-serif", transition:'all .2s',
                    boxShadow:dayView===d.key?`0 4px 12px ${d.color}22`:'none' }}>
                  {d.label}
                  <span style={{ marginLeft:8, background:dayView===d.key?d.color:'#e5e7eb',
                    color:dayView===d.key?'#fff':'#64748b', borderRadius:99,
                    padding:'2px 8px', fontSize:11, fontWeight:800 }}>{d.count}</span>
                </button>
              ))}
              {dayView === 'pick' && (
                <input type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)}
                  style={{ padding:'9px 14px', borderRadius:12, border:'1.5px solid #fde68a',
                    background:'#fffbeb', fontSize:13, fontWeight:600, outline:'none',
                    color:'#d97706', fontFamily:"'Plus Jakarta Sans',sans-serif" }}/>
              )}
            </div>
            <button onClick={() => { setShiftForm({ user_id:'', shift_name:'Morning', shift_date:dayView==='tomorrow'?tomorrow:today, start_time:'06:00', end_time:'14:00', status:'scheduled', note:'' }); setShiftModal('add') }}
              style={{ padding:'10px 20px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#c0272d,#e53935)', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif", boxShadow:'0 4px 14px rgba(192,39,45,.3)' }}>
              + Add Shift
            </button>
          </div>

          {/* Shift Summary Cards */}
          {(dayView === 'today' || dayView === 'tomorrow' || dayView === 'pick') && (() => {
            const date = dayView === 'today' ? today : dayView === 'tomorrow' ? tomorrow : selectedDate
            const dayShifts = shifts.filter(s => s.shift_date === date)
            return (
              <>
                {/* Shift type breakdown */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
                  {SHIFT_TEMPLATES.map(t => {
                    const count = dayShifts.filter(s=>s.shift_name===t.name).length
                    const workers = dayShifts.filter(s=>s.shift_name===t.name)
                    return (
                      <div key={t.name} style={{ background:'#fff', borderRadius:16, padding:16,
                        border:`1.5px solid ${count>0?t.color+'33':'#f0f0f0'}`,
                        boxShadow:count>0?`0 4px 16px ${t.color}15`:'none',
                        transition:'all .3s' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <div style={{ width:10, height:10, borderRadius:'50%', background:t.color }}/>
                            <span style={{ fontWeight:700, fontSize:13, color:'#0f172a' }}>{t.name}</span>
                          </div>
                          <span style={{ fontSize:18, fontWeight:900, color:count>0?t.color:'#d1d5db',
                            fontFamily:"'Playfair Display',serif" }}>{count}</span>
                        </div>
                        <div style={{ fontSize:11, color:'#94a3b8', marginBottom:8 }}>{t.start} – {t.end}</div>
                        {workers.length > 0 ? (
                          <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                            {workers.slice(0,3).map(w => (
                              <span key={w.id} style={{ fontSize:10, fontWeight:700,
                                background:t.color+'18', color:t.color,
                                padding:'2px 8px', borderRadius:99 }}>
                                {w.full_name?.split(' ')[0]}
                              </span>
                            ))}
                            {workers.length > 3 && (
                              <span style={{ fontSize:10, color:'#94a3b8' }}>+{workers.length-3}</span>
                            )}
                          </div>
                        ) : (
                          <div style={{ fontSize:11, color:'#d1d5db' }}>No staff assigned</div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Who is working now indicator (today only) */}
                {dayView === 'today' && (() => {
                  const now = new Date()
                  const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
                  const onDuty = dayShifts.filter(s => {
                    const start = String(s.start_time).slice(0,5)
                    const end   = String(s.end_time).slice(0,5)
                    return hhmm >= start && hhmm <= end && s.status === 'scheduled'
                  })
                  return onDuty.length > 0 ? (
                    <div style={{ background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderRadius:14,
                      padding:'14px 20px', marginBottom:20, border:'1.5px solid #86efac',
                      display:'flex', alignItems:'center', gap:14 }}>
                      <div style={{ width:10, height:10, borderRadius:'50%', background:'#16a34a',
                        boxShadow:'0 0 0 4px rgba(22,163,74,.2)', animation:'pulse 1.5s infinite', flexShrink:0 }}/>
                      <div>
                        <div style={{ fontSize:12, fontWeight:700, color:'#15803d', marginBottom:4 }}>
                          Currently On Duty — {hhmm}
                        </div>
                        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                          {onDuty.map(w => (
                            <span key={w.id} style={{ fontSize:12, fontWeight:700, color:'#15803d',
                              background:'#fff', padding:'3px 10px', borderRadius:99,
                              border:'1px solid #86efac' }}>
                              {w.full_name} ({w.shift_name})
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null
                })()}
              </>
            )
          })()}

          {/* Table */}
          <div style={{ background:'#fff', borderRadius:16, overflow:'hidden',
            border:'1px solid rgba(0,0,0,.06)', boxShadow:'0 2px 12px rgba(0,0,0,.04)' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ background:'linear-gradient(135deg,#0f172a,#1e293b)' }}>
                  {['Employee','Role','Shift','Date','Time','Status','Note','Actions'].map(h => (
                    <th key={h} style={{ padding:'13px 14px', textAlign:'left', fontWeight:700,
                      color:'rgba(255,255,255,.7)', fontSize:11, textTransform:'uppercase', letterSpacing:.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ padding:40, textAlign:'center', color:'#94a3b8' }}>Loading...</td></tr>
                ) : (() => {
                  const filtered = dayView === 'today'    ? shifts.filter(s=>s.shift_date===today)
                                 : dayView === 'tomorrow' ? shifts.filter(s=>s.shift_date===tomorrow)
                                 : dayView === 'pick'     ? shifts.filter(s=>s.shift_date===selectedDate)
                                 : shifts
                  if (filtered.length === 0) return (
                    <tr><td colSpan={8} style={{ padding:40, textAlign:'center', color:'#94a3b8' }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="1.5" style={{ marginBottom:12 }}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      <p style={{ margin:0, fontSize:14 }}>No shifts for {dayView === 'today'?'today':dayView === 'tomorrow'?'tomorrow':'any date'}.</p>
                    </td></tr>
                  )
                  return filtered.map(s => {
                    const rc   = ROLE_COLORS[s.role] || ROLE_COLORS.employee
                    const sc   = STATUS_COLORS[s.status] || STATUS_COLORS.scheduled
                    const tmpl = SHIFT_TEMPLATES.find(t => t.name === s.shift_name)
                    const now  = new Date()
                    const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
                    const isNow = s.shift_date === today &&
                      hhmm >= String(s.start_time).slice(0,5) &&
                      hhmm <= String(s.end_time).slice(0,5) &&
                      s.status === 'scheduled'
                    return (
                      <tr key={s.id} style={{ borderBottom:'1px solid #f8fafc',
                        background:isNow?'#f0fdf4':'transparent',
                        transition:'background .15s' }}
                        onMouseEnter={e=>{ if(!isNow) e.currentTarget.style.background='#fafbfc' }}
                        onMouseLeave={e=>{ if(!isNow) e.currentTarget.style.background='transparent' }}>
                        <td style={{ padding:'12px 14px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            {isNow && <div style={{ width:8, height:8, borderRadius:'50%', background:'#16a34a', boxShadow:'0 0 0 3px rgba(22,163,74,.2)', flexShrink:0 }}/>}
                            <div style={{ width:28, height:28, borderRadius:8, background:`${rc.color}22`,
                              display:'flex', alignItems:'center', justifyContent:'center',
                              fontWeight:800, fontSize:11, color:rc.color }}>
                              {(s.full_name||'?')[0].toUpperCase()}
                            </div>
                            <strong style={{ color:'#0f172a', fontSize:13 }}>{s.full_name}</strong>
                          </div>
                        </td>
                        <td style={{ padding:'12px 14px' }}>
                          <span style={{ padding:'3px 9px', borderRadius:99, fontSize:11, fontWeight:700, background:rc.bg, color:rc.color }}>{s.role}</span>
                        </td>
                        <td style={{ padding:'12px 14px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <div style={{ width:8, height:8, borderRadius:'50%', background:tmpl?.color||'#94a3b8' }}/>
                            <span style={{ fontWeight:600 }}>{s.shift_name}</span>
                          </div>
                        </td>
                        <td style={{ padding:'12px 14px', color:'#64748b' }}>
                          {s.shift_date === today ? <span style={{ color:'#16a34a', fontWeight:700 }}>Today</span>
                           : s.shift_date === tomorrow ? <span style={{ color:'#6366f1', fontWeight:700 }}>Tomorrow</span>
                           : s.shift_date}
                        </td>
                        <td style={{ padding:'12px 14px', fontWeight:600 }}>{String(s.start_time).slice(0,5)} – {String(s.end_time).slice(0,5)}</td>
                        <td style={{ padding:'12px 14px' }}>
                          <span style={{ padding:'3px 9px', borderRadius:99, fontSize:11, fontWeight:700, background:sc.bg, color:sc.color }}>{s.status}</span>
                        </td>
                        <td style={{ padding:'12px 14px', color:'#94a3b8', fontSize:12 }}>{s.note||'—'}</td>
                        <td style={{ padding:'12px 14px' }}>
                          <div style={{ display:'flex', gap:5 }}>
                            <button onClick={() => {
                              setShiftForm({ user_id:s.user_id, shift_name:s.shift_name, shift_date:s.shift_date, start_time:String(s.start_time).slice(0,5), end_time:String(s.end_time).slice(0,5), status:s.status, note:s.note||'' })
                              setShiftModal(s.id)
                            }} style={{ padding:'4px 9px', borderRadius:7, border:'1.5px solid #93c5fd', background:'#dbeafe', color:'#1d4ed8', cursor:'pointer', fontSize:11, fontWeight:700 }}>Edit</button>
                            <button onClick={() => handleDeleteShift(s.id)}
                              style={{ padding:'4px 9px', borderRadius:7, border:'1.5px solid #fca5a5', background:'#fee2e2', color:'#dc2626', cursor:'pointer', fontSize:11, fontWeight:700 }}>Del</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                })()}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── USER MODAL ── */}
      {userModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}
          onClick={e => { if(e.target===e.currentTarget) setUserModal(null) }}>
          <div style={{ background:'#fff', borderRadius:18, padding:32, width:'100%', maxWidth:460, boxShadow:'0 8px 40px rgba(0,0,0,.15)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
              <h3 style={{ fontSize:18, fontWeight:800, color:'#0f172a' }}>{userModal==='add'?'+ Add User':'Edit User'}</h3>
              <button onClick={() => setUserModal(null)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#94a3b8' }}>✕</button>
            </div>
            {[['full_name','Full Name','e.g. Sophea CHAN'],['email','Email','user@email.com'],['phone','Phone','+855 12 345 678']].map(([key,label,ph]) => (
              <div key={key} style={{ marginBottom:14 }}>
                <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:6, color:'#374151' }}>{label}</label>
                <input value={form[key]||''} onChange={e=>setForm({...form,[key]:e.target.value})} placeholder={ph}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', boxSizing:'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:6, color:'#374151' }}>Role</label>
              <select value={form.role||'employee'} onChange={e=>setForm({...form,role:e.target.value})}
                style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none' }}>
                {['admin','manager','cashier','employee','customer'].map(r=><option key={r}>{r}</option>)}
              </select>
              <div style={{ marginTop:8, padding:'7px 12px', borderRadius:8, fontSize:12,
                background: ['admin','manager'].includes(form.role)?'#fef3c7':'#f0fdf4',
                color: ['admin','manager'].includes(form.role)?'#d97706':'#15803d' }}>
                {['admin','manager'].includes(form.role)?'Can access Admin Panel':'Shop access only'}
              </div>
            </div>
            <div style={{ marginBottom:22 }}>
              <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:6, color:'#374151' }}>
                Password {userModal==='edit'&&<span style={{ color:'#94a3b8', fontWeight:400 }}>(leave blank to keep)</span>}
              </label>
              <input type="password" value={form.password||''} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••"
                style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', boxSizing:'border-box' }} />
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={handleSaveUser} disabled={saving}
                style={{ flex:1, padding:'12px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#15803d,#22c55e)', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14, opacity:saving?0.7:1 }}>
                {saving?'Saving…':'Save'}
              </button>
              <button onClick={() => setUserModal(null)}
                style={{ flex:1, padding:'12px', borderRadius:10, border:'1.5px solid #e5e7eb', background:'#f8fafc', fontWeight:700, cursor:'pointer', fontSize:14 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SHIFT MODAL ── */}
      {shiftModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}
          onClick={e => { if(e.target===e.currentTarget) setShiftModal(null) }}>
          <div style={{ background:'#fff', borderRadius:18, padding:32, width:'100%', maxWidth:500, boxShadow:'0 8px 40px rgba(0,0,0,.15)', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
              <h3 style={{ fontSize:18, fontWeight:800, color:'#0f172a' }}>{shiftModal==='add'?'New Shift':'Edit Shift'}</h3>
              <button onClick={() => setShiftModal(null)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#94a3b8' }}>✕</button>
            </div>

            {/* Templates */}
            <div style={{ marginBottom:18 }}>
              <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:8, color:'#374151' }}>Quick Templates</label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                {SHIFT_TEMPLATES.map(t => (
                  <button key={t.name} onClick={() => applyTemplate(t)}
                    style={{ padding:'8px', borderRadius:8, border:`1.5px solid ${shiftForm.shift_name===t.name?t.color:'#e5e7eb'}`, background: shiftForm.shift_name===t.name?t.color+'22':'#fff', cursor:'pointer', fontSize:12, fontWeight:700, color: shiftForm.shift_name===t.name?t.color:'#374151' }}>
                    {t.name}<br/><span style={{ fontWeight:400, fontSize:10 }}>{t.start}–{t.end}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Employee */}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:6, color:'#374151' }}>Employee *</label>
              <select value={shiftForm.user_id} onChange={e=>setShiftForm({...shiftForm,user_id:parseInt(e.target.value)})}
                style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none' }}>
                <option value="">Select employee…</option>
                {shiftableUsers.map(u=><option key={u.id} value={u.id}>{u.full_name} ({u.role})</option>)}
              </select>
            </div>

            {/* Date */}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:6, color:'#374151' }}>Shift Date *</label>
              <input type="date" value={shiftForm.shift_date} onChange={e=>setShiftForm({...shiftForm,shift_date:e.target.value})}
                style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', boxSizing:'border-box' }} />
            </div>

            {/* Times */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
              {[['Start Time','start_time'],['End Time','end_time']].map(([label,key]) => (
                <div key={key}>
                  <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:6, color:'#374151' }}>{label}</label>
                  <input type="time" value={shiftForm[key]} onChange={e=>setShiftForm({...shiftForm,[key]:e.target.value})}
                    style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', boxSizing:'border-box' }} />
                </div>
              ))}
            </div>

            {/* Status */}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:6, color:'#374151' }}>Status</label>
              <select value={shiftForm.status} onChange={e=>setShiftForm({...shiftForm,status:e.target.value})}
                style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none' }}>
                {['scheduled','completed','absent','cancelled'].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Note */}
            <div style={{ marginBottom:22 }}>
              <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:6, color:'#374151' }}>Note (optional)</label>
              <input value={shiftForm.note} onChange={e=>setShiftForm({...shiftForm,note:e.target.value})} placeholder="e.g. Cover for sick leave"
                style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', boxSizing:'border-box' }} />
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={handleSaveShift} disabled={saving}
                style={{ flex:1, padding:'12px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14, opacity:saving?0.7:1 }}>
                {saving?'Saving…':'Save Shift'}
              </button>
              <button onClick={() => setShiftModal(null)}
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
