import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
export default function AccountSetting() {
  const { user } = useAuth()
  const [tab, setTab] = useState('profile')
  const [form, setForm] = useState({ name: user?.name||'', email: user?.email||'', phone:'' })
  const tabBtn = (t, l) => <button onClick={()=>setTab(t)} style={{ padding:'11px 22px', fontFamily:"'Josefin Sans',sans-serif", fontSize:14, fontWeight:600, cursor:'pointer', border:'none', background:'none', borderBottom: tab===t?'3px solid #00B207':'3px solid transparent', color:tab===t?'#00B207':'#7e7e7e', marginBottom:-2 }}>{l}</button>
  return (
    <div className="page-enter">
      <div style={{ background:'#F2FCF3', padding:'14px 0', borderBottom:'1px solid #e8e8e8' }}><div className="container"><span style={{ fontSize:13 }}>Home › <strong>Account Settings</strong></span></div></div>
      <div className="container" style={{ padding:'36px 20px', maxWidth:860 }}>
        <h2 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:24, fontWeight:700, marginBottom:20 }}>Account Settings</h2>
        <div style={{ display:'flex', borderBottom:'2px solid #e8e8e8', marginBottom:24 }}>{tabBtn('profile','Profile')}{tabBtn('password','Password')}{tabBtn('address','Addresses')}</div>
        {tab==='profile' && (
          <div className="card">
            <div className="form-row">
              <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
            </div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
            <button className="btn btn-primary" onClick={()=>toast.success('Profile updated!')}>Save Changes</button>
          </div>
        )}
        {tab==='password' && (
          <div className="card">
            <div className="form-group"><label className="form-label">Current Password</label><input className="form-input" type="password" /></div>
            <div className="form-group"><label className="form-label">New Password</label><input className="form-input" type="password" /></div>
            <div className="form-group"><label className="form-label">Confirm Password</label><input className="form-input" type="password" /></div>
            <button className="btn btn-primary" onClick={()=>toast.success('Password changed!')}>Update Password</button>
          </div>
        )}
        {tab==='address' && (
          <div className="card">
            <div style={{ background:'#F2FCF3', border:'1.5px solid #00B207', borderRadius:10, padding:16, marginBottom:12 }}>
              <strong>Home</strong> <span className="status status-delivered" style={{ marginLeft:8 }}>Default</span>
              <p style={{ fontSize:13, color:'#7e7e7e', marginTop:8 }}>123 Street 271, Phnom Penh</p>
            </div>
            <button className="btn btn-outline btn-sm">+ Add New Address</button>
          </div>
        )}
      </div>
    </div>
  )
}
