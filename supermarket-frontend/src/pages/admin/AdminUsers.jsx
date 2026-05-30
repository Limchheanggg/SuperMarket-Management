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
  { name:'Night',     start:'22:00', end:'06:00', color:'#0891b2' },
  { name:'Full Day',  start:'08:00', end:'20:00', color:'#16a34a' },
]

const STATUS_COLORS = {
  scheduled:  { bg:'#dbeafe', color:'#1d4ed8' },
  completed:  { bg:'#dcfce7', color:'#15803d' },
  absent:     { bg:'#fee2e2', color:'#dc2626' },
  cancelled:  { bg:'#f3f4f6', color:'#6b7280' },
}

export default function AdminUsers() {
  const [tab, setTab]             = useState('users')
  const [users, setUsers]         = useState([])
  const [shifts, setShifts]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [userModal, setUserModal] = useState(null)
  const [shiftModal, setShiftModal] = useState(null)
  const [form, setForm]           = useState({ full_name:'', email:'', phone:'', role:'employee', password:'' })
  const [shiftForm, setShiftForm] = useState({ user_id:'', shift_name:'Morning', shift_date:'', start_time:'06:00', end_time:'14:00', status:'scheduled', note:'' })
  const [saving, setSaving]       = useState(false)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    // Fetch users — critical
    try {
      const uRes = await API.get('/api/users/employees')
      setUsers(uRes.data || [])
    } catch { setUsers([]) }
    // Fetch shifts — optional, never clears users
    try {
      const sRes = await API.get('/api/shifts/')
      setShifts(sRes.data || [])
    } catch { setShifts([]) }
    setLoading(false)
  }

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
    } catch (e) { toast.error(e.response?.data?.detail || 'Error') }
    finally { setSaving(false) }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try { await API.delete(`/api/users/employees/${id}`); toast.success('Deleted'); fetchAll() }
    catch { toast.error('Failed to delete') }
  }

  const handleSaveShift = async () => {
    if (!shiftForm.user_id || !shiftForm.shift_date) { toast.error('User and date required'); return }
    setSaving(true)
    try {
      if (shiftModal === 'add') await API.post('/api/shifts/', shiftForm)
      else await API.put(`/api/shifts/${shiftModal}`, shiftForm)
      toast.success(shiftModal === 'add' ? 'Shift created!' : 'Shift updated!')
      setShiftModal(null)
      fetchAll()
    } catch (e) { toast.error(e.response?.data?.detail || 'Shifts API not ready yet') }
    finally { setSaving(false) }
  }

  const handleDeleteShift = async (id) => {
    if (!window.confirm('Delete this shift?')) return
    try { await API.delete(`/api/shifts/${id}`); toast.success('Shift deleted'); fetchAll() }
    catch { toast.error('Failed') }
  }

  const applyTemplate = (t) => setShiftForm(f => ({ ...f, shift_name: t.name, start_time: t.start, end_time: t.end }))

  const shiftableUsers = users.filter(u => ['employee','cashier','manager'].includes(u.role))

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'All' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const stats = {
    total:     users.length,
    admins:    users.filter(u => u.role === 'admin').length,
    staff:     users.filter(u => ['manager','cashier','employee'].includes(u.role)).length,
    customers: users.filter(u => u.role === 'customer').length,
  }

  const today = new Date().toISOString().split('T')[0]
  const todayShifts = shifts.filter(s => s.shift_date === today)

  return (
    <div style={{ padding:28, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h2 style={{ fontSize:24, fontWeight:800, color:'#0f172a', marginBottom:4 }}>👥 User Management</h2>
          <p style={{ color:'#64748b', fontSize:14 }}>Manage users and employee shift schedules</p>
        </div>
        <button onClick={() => { setForm({ full_name:'', email:'', phone:'', role:'employee', password:'' }); setUserModal('add') }}
          style={{ padding:'10px 20px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#15803d,#22c55e)', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14, boxShadow:'0 4px 12px rgba(21,128,61,.3)' }}>
          + Add User
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          ['Total Users',       stats.total,     '#6366f1', 'linear-gradient(135deg,#eef2ff,#e0e7ff)'],
          ['Admins & Managers', stats.admins,    '#dc2626', 'linear-gradient(135deg,#fef2f2,#fee2e2)'],
          ['Staff',             stats.staff,     '#16a34a', 'linear-gradient(135deg,#f0fdf4,#dcfce7)'],
          ['Customers',         stats.customers, '#7c3aed', 'linear-gradient(135deg,#f5f3ff,#ede9fe)'],
        ].map(([l,v,c,bg]) => (
          <div key={l} style={{ background:bg, borderRadius:14, padding:'18px 20px', border:`1.5px solid ${c}22` }}>
            <div style={{ fontSize:12, color:'#64748b', marginBottom:6, fontWeight:600 }}>{l}</div>
            <div style={{ fontSize:28, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:20, background:'#f1f5f9', borderRadius:12, padding:4, width:'fit-content' }}>
        {[['users','👥 Users'],['shifts','📅 Shift Schedule']].map(([key,label]) => (
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
          <div style={{ display:'flex', gap:10, marginBottom:18, flexWrap:'wrap' }}>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="🔍 Search by name, email or role..."
              style={{ flex:1, minWidth:200, padding:'10px 14px', borderRadius:10, border:'1.5px solid #e5e7eb', fontSize:13, outline:'none', boxSizing:'border-box' }} />
            {['All','admin','manager','cashier','employee','customer'].map(r => {
              const rc = ROLE_COLORS[r] || {}
              return (
                <button key={r} onClick={() => setRoleFilter(r)}
                  style={{ padding:'9px 16px', borderRadius:9, cursor:'pointer', fontSize:12, fontWeight:700,
                    border: `1.5px solid ${roleFilter===r ? (rc.border||'#0f172a') : '#e5e7eb'}`,
                    background: roleFilter===r ? (rc.bg||'#0f172a') : '#fff',
                    color: roleFilter===r ? (rc.color||'#fff') : '#374151' }}>
                  {r}
                </button>
              )
            })}
          </div>

          <div style={{ background:'#fff', borderRadius:16, overflow:'hidden', border:'1.5px solid #e5e7eb', boxShadow:'0 2px 10px rgba(0,0,0,.04)' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ background:'#f8fafc', borderBottom:'2px solid #e5e7eb' }}>
                  {['User','Email','Phone','Role','Access','Actions'].map(h => (
                    <th key={h} style={{ padding:'13px 16px', textAlign:'left', fontWeight:700, color:'#374151' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ padding:40, textAlign:'center', color:'#94a3b8' }}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding:40, textAlign:'center', color:'#94a3b8' }}>
                    <div style={{ fontSize:36, marginBottom:10 }}>👤</div>
                    <p>{users.length === 0 ? 'No users in database' : 'No users match search'}</p>
                  </td></tr>
                ) : filtered.map(u => {
                  const rc = ROLE_COLORS[u.role] || ROLE_COLORS.employee
                  const canAdmin = ['admin','manager'].includes(u.role)
                  return (
                    <tr key={u.id} style={{ borderBottom:'1px solid #f8fafc' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#fafafa'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'13px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:36, height:36, borderRadius:12, background:`linear-gradient(135deg,${rc.color}22,${rc.color}11)`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:14, color:rc.color, flexShrink:0 }}>
                            {(u.full_name||'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <strong style={{ color:'#0f172a' }}>{u.full_name}</strong>
                            {['employee','cashier'].includes(u.role) && (
                              <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>
                                {shifts.filter(s=>s.user_id===u.id&&s.shift_date===today).length > 0 ? '🟢 On shift today' : '⚪ No shift today'}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:'13px 16px', color:'#64748b' }}>{u.email}</td>
                      <td style={{ padding:'13px 16px', color:'#64748b' }}>{u.phone||'—'}</td>
                      <td style={{ padding:'13px 16px' }}>
                        <span style={{ padding:'4px 12px', borderRadius:99, fontSize:12, fontWeight:700, background:rc.bg, color:rc.color, border:`1px solid ${rc.border}` }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding:'13px 16px' }}>
                        {canAdmin
                          ? <span style={{ padding:'4px 10px', borderRadius:99, fontSize:11, fontWeight:700, background:'#fef3c7', color:'#d97706', border:'1px solid #fcd34d' }}>⚙️ Admin Panel</span>
                          : <span style={{ padding:'4px 10px', borderRadius:99, fontSize:11, fontWeight:700, background:'#f0fdf4', color:'#16a34a', border:'1px solid #86efac' }}>🛒 Shop Only</span>
                        }
                      </td>
                      <td style={{ padding:'13px 16px' }}>
                        <div style={{ display:'flex', gap:6 }}>
                          <button onClick={() => { setForm({...u, password:''}); setUserModal('edit') }}
                            style={{ padding:'5px 12px', borderRadius:7, border:'1.5px solid #93c5fd', background:'#dbeafe', color:'#1d4ed8', cursor:'pointer', fontSize:12, fontWeight:700 }}>
                            Edit
                          </button>
                          {['employee','cashier'].includes(u.role) && (
                            <button onClick={() => { setShiftForm({user_id:u.id, shift_name:'Morning', shift_date:today, start_time:'06:00', end_time:'14:00', status:'scheduled', note:''}); setShiftModal('add') }}
                              style={{ padding:'5px 12px', borderRadius:7, border:'1.5px solid #fcd34d', background:'#fef3c7', color:'#d97706', cursor:'pointer', fontSize:12, fontWeight:700 }}>
                              + Shift
                            </button>
                          )}
                          <button onClick={() => handleDeleteUser(u.id)}
                            style={{ padding:'5px 12px', borderRadius:7, border:'1.5px solid #fca5a5', background:'#fee2e2', color:'#dc2626', cursor:'pointer', fontSize:12, fontWeight:700 }}>
                            Delete
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

      {/* ── SHIFTS TAB ── */}
      {tab === 'shifts' && (
        <>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
            <div style={{ display:'flex', gap:10 }}>
              <div style={{ background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderRadius:12, padding:'10px 18px', border:'1px solid #86efac', fontSize:13 }}>
                📅 Today: <strong style={{ color:'#16a34a' }}>{todayShifts.length} shifts</strong>
              </div>
              <div style={{ background:'linear-gradient(135deg,#eef2ff,#e0e7ff)', borderRadius:12, padding:'10px 18px', border:'1px solid #a5b4fc', fontSize:13 }}>
                Total: <strong style={{ color:'#6366f1' }}>{shifts.length} shifts</strong>
              </div>
            </div>
            <button onClick={() => { setShiftForm({ user_id:'', shift_name:'Morning', shift_date:today, start_time:'06:00', end_time:'14:00', status:'scheduled', note:'' }); setShiftModal('add') }}
              style={{ padding:'10px 20px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14 }}>
              + Add Shift
            </button>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
            {SHIFT_TEMPLATES.map(t => (
              <div key={t.name} style={{ background:'#fff', borderRadius:12, padding:'14px 16px', border:'1.5px solid #e5e7eb', textAlign:'center' }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:t.color, margin:'0 auto 8px' }} />
                <div style={{ fontWeight:700, color:'#0f172a', fontSize:14, marginBottom:4 }}>{t.name}</div>
                <div style={{ fontSize:12, color:'#64748b' }}>{t.start} – {t.end}</div>
              </div>
            ))}
          </div>

          <div style={{ background:'#fff', borderRadius:16, overflow:'hidden', border:'1.5px solid #e5e7eb', boxShadow:'0 2px 10px rgba(0,0,0,.04)' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ background:'#f8fafc', borderBottom:'2px solid #e5e7eb' }}>
                  {['Employee','Role','Shift','Date','Time','Status','Note','Actions'].map(h => (
                    <th key={h} style={{ padding:'13px 16px', textAlign:'left', fontWeight:700, color:'#374151' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ padding:40, textAlign:'center', color:'#94a3b8' }}>Loading...</td></tr>
                ) : shifts.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding:40, textAlign:'center', color:'#94a3b8' }}>
                    <div style={{ fontSize:36, marginBottom:10 }}>📅</div>
                    <p>No shifts yet. Click "+ Add Shift" to create one.</p>
                  </td></tr>
                ) : shifts.map(s => {
                  const rc = ROLE_COLORS[s.role] || ROLE_COLORS.employee
                  const sc = STATUS_COLORS[s.status] || STATUS_COLORS.scheduled
                  const tmpl = SHIFT_TEMPLATES.find(t => t.name === s.shift_name)
                  return (
                    <tr key={s.id} style={{ borderBottom:'1px solid #f8fafc' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#fafafa'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ width:30, height:30, borderRadius:9, background:`${rc.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:12, color:rc.color }}>
                            {(s.full_name||'?')[0].toUpperCase()}
                          </div>
                          <strong style={{ color:'#0f172a' }}>{s.full_name}</strong>
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700, background:rc.bg, color:rc.color }}>{s.role}</span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <div style={{ width:8, height:8, borderRadius:'50%', background:tmpl?.color||'#94a3b8' }} />
                          <span style={{ fontWeight:600 }}>{s.shift_name}</span>
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px', color:'#64748b' }}>{s.shift_date}</td>
                      <td style={{ padding:'12px 16px', fontWeight:600 }}>{String(s.start_time).slice(0,5)} – {String(s.end_time).slice(0,5)}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ padding:'4px 10px', borderRadius:99, fontSize:11, fontWeight:700, background:sc.bg, color:sc.color }}>{s.status}</span>
                      </td>
                      <td style={{ padding:'12px 16px', color:'#94a3b8', fontSize:12 }}>{s.note||'—'}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', gap:6 }}>
                          <button onClick={() => { setShiftForm({ user_id:s.user_id, shift_name:s.shift_name, shift_date:s.shift_date, start_time:String(s.start_time).slice(0,5), end_time:String(s.end_time).slice(0,5), status:s.status, note:s.note||'' }); setShiftModal(s.id) }}
                            style={{ padding:'5px 10px', borderRadius:7, border:'1.5px solid #93c5fd', background:'#dbeafe', color:'#1d4ed8', cursor:'pointer', fontSize:11, fontWeight:700 }}>
                            Edit
                          </button>
                          <button onClick={() => handleDeleteShift(s.id)}
                            style={{ padding:'5px 10px', borderRadius:7, border:'1.5px solid #fca5a5', background:'#fee2e2', color:'#dc2626', cursor:'pointer', fontSize:11, fontWeight:700 }}>
                            Delete
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

      {/* ── USER MODAL ── */}
      {userModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}
          onClick={e => { if(e.target===e.currentTarget) setUserModal(null) }}>
          <div style={{ background:'#fff', borderRadius:18, padding:32, width:'100%', maxWidth:460, boxShadow:'0 8px 40px rgba(0,0,0,.15)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
              <h3 style={{ fontSize:18, fontWeight:800, color:'#0f172a' }}>{userModal==='add' ? '+ Add New User' : '✏️ Edit User'}</h3>
              <button onClick={() => setUserModal(null)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#94a3b8' }}>✕</button>
            </div>
            {[['full_name','Full Name','e.g. John Smith'],['email','Email','user@email.com'],['phone','Phone','+855 12 345 678']].map(([key,label,ph]) => (
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
                {['admin','manager','cashier','employee','customer'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <div style={{ marginTop:8, padding:'8px 12px', borderRadius:8, fontSize:12,
                background: ['admin','manager'].includes(form.role) ? '#fef3c7' : '#f0fdf4',
                color: ['admin','manager'].includes(form.role) ? '#d97706' : '#15803d' }}>
                {['admin','manager'].includes(form.role) ? '⚙️ Can access Admin Panel' : '🛒 Shop access only'}
              </div>
            </div>
            <div style={{ marginBottom:22 }}>
              <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:6, color:'#374151' }}>
                Password {userModal==='edit' && <span style={{ color:'#94a3b8', fontWeight:400 }}>(leave blank to keep)</span>}
              </label>
              <input type="password" value={form.password||''} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••"
                style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', boxSizing:'border-box' }} />
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={handleSaveUser} disabled={saving}
                style={{ flex:1, padding:'12px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#15803d,#22c55e)', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14, opacity:saving?0.7:1 }}>
                {saving ? '⏳ Saving…' : '✅ Save'}
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
              <h3 style={{ fontSize:18, fontWeight:800, color:'#0f172a' }}>{shiftModal==='add' ? '📅 New Shift' : '✏️ Edit Shift'}</h3>
              <button onClick={() => setShiftModal(null)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#94a3b8' }}>✕</button>
            </div>
            <div style={{ marginBottom:18 }}>
              <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:8, color:'#374151' }}>Quick Templates</label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                {SHIFT_TEMPLATES.map(t => (
                  <button key={t.name} onClick={() => applyTemplate(t)}
                    style={{ padding:'8px', borderRadius:8, cursor:'pointer', fontSize:12, fontWeight:700,
                      border: `1.5px solid ${shiftForm.shift_name===t.name ? t.color : '#e5e7eb'}`,
                      background: shiftForm.shift_name===t.name ? t.color+'22' : '#fff',
                      color: shiftForm.shift_name===t.name ? t.color : '#374151' }}>
                    {t.name}<br/><span style={{ fontWeight:400, fontSize:11 }}>{t.start}–{t.end}</span>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:6, color:'#374151' }}>Employee *</label>
              <select value={shiftForm.user_id} onChange={e=>setShiftForm({...shiftForm,user_id:parseInt(e.target.value)})}
                style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none' }}>
                <option value="">Select employee…</option>
                {shiftableUsers.map(u => <option key={u.id} value={u.id}>{u.full_name} ({u.role})</option>)}
              </select>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:6, color:'#374151' }}>Shift Date *</label>
              <input type="date" value={shiftForm.shift_date} onChange={e=>setShiftForm({...shiftForm,shift_date:e.target.value})}
                style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', boxSizing:'border-box' }} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
              {[['start_time','Start Time'],['end_time','End Time']].map(([key,label]) => (
                <div key={key}>
                  <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:6, color:'#374151' }}>{label}</label>
                  <input type="time" value={shiftForm[key]} onChange={e=>setShiftForm({...shiftForm,[key]:e.target.value})}
                    style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', boxSizing:'border-box' }} />
                </div>
              ))}
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:6, color:'#374151' }}>Status</label>
              <select value={shiftForm.status} onChange={e=>setShiftForm({...shiftForm,status:e.target.value})}
                style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none' }}>
                {['scheduled','completed','absent','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:22 }}>
              <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:6, color:'#374151' }}>Note (optional)</label>
              <input value={shiftForm.note} onChange={e=>setShiftForm({...shiftForm,note:e.target.value})} placeholder="e.g. Cover for sick leave"
                style={{ width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', boxSizing:'border-box' }} />
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={handleSaveShift} disabled={saving}
                style={{ flex:1, padding:'12px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14, opacity:saving?0.7:1 }}>
                {saving ? '⏳ Saving…' : '✅ Save Shift'}
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
