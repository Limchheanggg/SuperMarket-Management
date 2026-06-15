import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateMe } from '../services/api'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

export default function AccountSetting() {
  const { user, loginUser } = useAuth()
  const [tab, setTab]   = useState('profile')
  const [form, setForm] = useState({ name: user?.name||'', email: user?.email||'', phone: user?.phone||'', address: user?.address||'' })
  const [passForm, setPassForm] = useState({ password:'', confirm:'' })
  const [loading, setLoading]   = useState(false)
  const name = user?.full_name || user?.name || 'User'

  const saveProfile = async () => {
    setLoading(true)
    try {
      const res = await updateMe({ name: form.name, phone: form.phone, address: form.address })
      loginUser(localStorage.getItem('token'), { ...user, name: res.data.name, phone: res.data.phone, address: res.data.address })
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update') }
    finally { setLoading(false) }
  }

  const savePassword = async () => {
    if (!passForm.password)                       return toast.error('Enter a new password')
    if (passForm.password !== passForm.confirm)   return toast.error('Passwords do not match')
    if (passForm.password.length < 6)             return toast.error('Minimum 6 characters')
    setLoading(true)
    try { await updateMe({ password: passForm.password }); toast.success('Password changed!'); setPassForm({ password:'', confirm:'' }) }
    catch { toast.error('Failed to change password') }
    finally { setLoading(false) }
  }

  const inputStyle = { width:'100%', padding:'11px 14px', border:'1.5px solid #e5e7eb',
    borderRadius:10, fontSize:14, outline:'none', boxSizing:'border-box',
    fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#f9fafb', transition:'all .2s' }

  const TABS = [['profile','Profile'],['password','Password'],['address','Addresses']]

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#f4f6fa', minHeight:'100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .acc-input:focus { border-color:#c0272d!important; box-shadow:0 0 0 3px rgba(192,39,45,.1)!important; background:#fff!important; }
        .acc-tab { padding:12px 24px; border:none; background:transparent; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:600; color:#9ca3af; border-bottom:2px solid transparent; transition:all .2s; }
        .acc-tab.active { color:#c0272d; border-bottom-color:#c0272d; }
        .acc-tab:hover:not(.active) { color:#374151; }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ background:'#fff', borderBottom:'1px solid #eee', padding:'12px 0' }}>
        <div className="container">
          <span style={{ fontSize:13, color:'#9ca3af' }}>
            <Link to="/" style={{ color:'#9ca3af', textDecoration:'none' }}>Home</Link> ›{' '}
            <strong style={{ color:'#111827' }}>Account Settings</strong>
          </span>
        </div>
      </div>

      {/* Dark header */}
      <div style={{ background:'linear-gradient(135deg,#1a0505,#2d0b0b 40%,#0d1240)', padding:'28px 0' }}>
        <div className="container">
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:900, color:'#fff', margin:0 }}>
            Account Settings
          </h1>
          <p style={{ color:'rgba(255,255,255,.5)', fontSize:14, margin:'6px 0 0' }}>
            Manage your profile, password and preferences
          </p>
        </div>
      </div>

      <div className="container" style={{ padding:'28px 24px', maxWidth:760 }}>
        <div style={{ background:'#fff', borderRadius:20, overflow:'hidden',
          boxShadow:'0 4px 24px rgba(0,0,0,.06)', animation:'fadeUp .5s ease forwards' }}>

          {/* Profile banner */}
          <div style={{ background:'linear-gradient(135deg,#c0272d,#9b1c1c)', padding:'28px 32px',
            display:'flex', alignItems:'center', gap:20 }}>
            <div style={{ width:60, height:60, borderRadius:16, background:'rgba(255,255,255,.2)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:24, fontWeight:900, color:'#fff', flexShrink:0 }}>
              {name[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:18, fontWeight:800, color:'#fff' }}>{name}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,.65)', marginTop:2 }}>{user?.email}</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', borderBottom:'1px solid #f0f0f0', padding:'0 32px' }}>
            {TABS.map(([key,label]) => (
              <button key={key} className={`acc-tab${tab===key?' active':''}`} onClick={()=>setTab(key)}>
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ padding:32 }}>
            {tab === 'profile' && (
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  {[['Full Name','name','Your full name'],['Phone','phone','+855 12 345 678']].map(([label,key,ph]) => (
                    <div key={key}>
                      <label style={{ fontSize:12, fontWeight:700, color:'#9ca3af',
                        textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }}>{label}</label>
                      <input className="acc-input" value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}
                        placeholder={ph} style={inputStyle}/>
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:'#9ca3af',
                    textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }}>Email</label>
                  <input value={form.email} disabled style={{ ...inputStyle, background:'#f3f4f6', color:'#9ca3af', cursor:'not-allowed' }}/>
                  <p style={{ fontSize:12, color:'#d1d5db', marginTop:4 }}>Email cannot be changed</p>
                </div>
                <button onClick={saveProfile} disabled={loading} style={{ alignSelf:'flex-start',
                  padding:'12px 28px', borderRadius:12, border:'none',
                  background:'linear-gradient(135deg,#c0272d,#e53935)', color:'#fff',
                  fontWeight:700, fontSize:14, cursor:'pointer',
                  boxShadow:'0 4px 14px rgba(192,39,45,.3)', transition:'all .25s',
                  opacity:loading?0.7:1 }}>
                  {loading ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            )}

            {tab === 'password' && (
              <div style={{ display:'flex', flexDirection:'column', gap:16, maxWidth:400 }}>
                {[['New Password','password','Min. 6 characters'],['Confirm Password','confirm','Repeat password']].map(([label,key,ph]) => (
                  <div key={key}>
                    <label style={{ fontSize:12, fontWeight:700, color:'#9ca3af',
                      textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }}>{label}</label>
                    <input type="password" className="acc-input" value={passForm[key]}
                      onChange={e=>setPassForm({...passForm,[key]:e.target.value})}
                      placeholder={ph} style={inputStyle}/>
                  </div>
                ))}
                <button onClick={savePassword} disabled={loading} style={{ alignSelf:'flex-start',
                  padding:'12px 28px', borderRadius:12, border:'none',
                  background:'linear-gradient(135deg,#c0272d,#e53935)', color:'#fff',
                  fontWeight:700, fontSize:14, cursor:'pointer', opacity:loading?0.7:1 }}>
                  {loading ? 'Updating…' : 'Update Password'}
                </button>
              </div>
            )}

            {tab === 'address' && (
              <div style={{ display:'flex', flexDirection:'column', gap:16, maxWidth:480 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:'#9ca3af',
                    textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }}>Delivery Address</label>
                  <textarea className="acc-input" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}
                    placeholder="House 12, Street 289, Sangkat Kakab, Khan Posenchey, Phnom Penh"
                    rows={3} style={{ ...inputStyle, resize:'vertical', fontFamily:'inherit' }}/>
                </div>
                <button onClick={saveProfile} disabled={loading} style={{ alignSelf:'flex-start',
                  padding:'12px 28px', borderRadius:12, border:'none',
                  background:'linear-gradient(135deg,#c0272d,#e53935)', color:'#fff',
                  fontWeight:700, fontSize:14, cursor:'pointer',
                  boxShadow:'0 4px 14px rgba(192,39,45,.3)', transition:'all .25s',
                  opacity:loading?0.7:1 }}>
                  {loading ? 'Saving…' : 'Save Address'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
