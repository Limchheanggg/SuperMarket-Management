import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const STEPS = [
  { number: 1, label: 'Account' },
  { number: 2, label: 'Details' },
  { number: 3, label: 'Done' },
]

const FLOAT_ICONS = [
  { icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, top:'82%', left:'5%',  anim:'float1', dur:'9s',  delay:'0s'   },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(192,39,45,0.28)" strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>, top:'80%', left:'22%', anim:'float2', dur:'11s', delay:'1s'  },
  { icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>, top:'85%', left:'42%', anim:'float3', dur:'13s', delay:'2s'  },
  { icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(192,39,45,0.2)" strokeWidth="1.5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>, top:'78%', left:'60%', anim:'float4', dur:'10s', delay:'.5s' },
  { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, top:'84%', left:'76%', anim:'float1', dur:'12s', delay:'1.5s'},
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(192,39,45,0.2)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, top:'88%', left:'90%', anim:'float2', dur:'8s',  delay:'3s'  },
]

export default function Register() {
  const [step,     setStep]     = useState(1)
  const [form,     setForm]     = useState({ name:'', email:'', password:'', confirm:'', phone:'', address:'' })
  const [errors,   setErrors]   = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()
  const panelRef = useRef(null)

  const set = (field, val) => { setForm(f=>({...f,[field]:val})); setErrors(e=>({...e,[field]:''})) }

  const validateStep1 = () => {
    const e = {}
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    const phoneClean = form.phone.replace(/[\s\-]/g, '')
    if (!phoneClean) e.phone = 'Phone number is required'
    else if (!/^(0\d{8,9}|\+855\d{8,9})$/.test(phoneClean)) e.phone = 'Use format 0XXXXXXXX or +855XXXXXXXX'
    if (!form.address.trim()) e.address = 'Address is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && validateStep2()) handleSubmit()
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await register({ name:form.name, email:form.email, password:form.password, phone:form.phone, address:form.address })
      loginUser(res.data.access_token, res.data.user)
      setStep(3)
      setTimeout(() => {
        toast.success('Welcome to AMS Mart!')
        navigate('/dashboard')
      }, 2000)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
      setStep(2)
    } finally { setLoading(false) }
  }

  const inputStyle = (field) => ({
    width:'100%', padding:'13px 16px', borderRadius:12, fontSize:14,
    fontFamily:"'Plus Jakarta Sans',sans-serif", outline:'none',
    boxSizing:'border-box', transition:'all .25s',
    border:'1.5px solid ' + (errors[field] ? '#ef4444' : '#e2e8f0'),
    background: errors[field] ? '#fef2f2' : '#f8fafc', color:'#0f172a',
  })

  return (
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeLeft { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
        @keyframes bgShift  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes float1   { 0%{transform:translate(0,0) rotate(0deg)} 25%{transform:translate(20px,-30px) rotate(10deg)} 50%{transform:translate(-10px,-60px) rotate(-5deg)} 75%{transform:translate(15px,-40px) rotate(8deg)} 100%{transform:translate(0,0) rotate(0deg)} }
        @keyframes float2   { 0%{transform:translate(0,0) rotate(0deg)} 25%{transform:translate(-25px,-40px) rotate(-12deg)} 50%{transform:translate(10px,-70px) rotate(6deg)} 75%{transform:translate(-15px,-30px) rotate(-8deg)} 100%{transform:translate(0,0) rotate(0deg)} }
        @keyframes float3   { 0%{transform:translate(0,0) rotate(0deg)} 33%{transform:translate(30px,-50px) rotate(15deg)} 66%{transform:translate(-20px,-80px) rotate(-10deg)} 100%{transform:translate(0,0) rotate(0deg)} }
        @keyframes float4   { 0%{transform:translate(0,0) rotate(0deg)} 20%{transform:translate(-30px,-25px) rotate(-8deg)} 40%{transform:translate(20px,-55px) rotate(12deg)} 60%{transform:translate(-10px,-75px) rotate(-5deg)} 80%{transform:translate(25px,-40px) rotate(10deg)} 100%{transform:translate(0,0) rotate(0deg)} }
        @keyframes checkPop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
        @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .reg-input:focus { border-color:#c0272d !important; box-shadow:0 0 0 3px rgba(192,39,45,.1) !important; background:#fff !important; }
        .next-btn { width:100%; padding:14px; border-radius:12px; border:none;
          background:linear-gradient(135deg,#c0272d,#e53935); color:#fff;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:700;
          cursor:pointer; transition:all .3s; box-shadow:0 6px 20px rgba(192,39,45,.35); }
        .next-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 28px rgba(192,39,45,.45); }
        .next-btn:disabled { background:#e5e7eb; color:#9ca3af; box-shadow:none; cursor:not-allowed; }
        .show-pass { position:absolute; right:14px; top:50%; transform:translateY(-50%);
          background:none; border:none; cursor:pointer; color:#94a3b8; padding:4px; transition:color .2s; }
        .show-pass:hover { color:#c0272d; }
        .step-slide { animation: fadeUp .4s ease both; }
      `}</style>

      {/* LEFT PANEL */}
      <div style={{ flex:1, background:'linear-gradient(135deg,#1a0505 0%,#2d0b0b 35%,#0d1240 100%)',
        backgroundSize:'400% 400%', animation:'bgShift 12s ease infinite',
        display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',
        padding:60, position:'relative', overflow:'hidden' }}>
        {FLOAT_ICONS.map((item,i) => (
          <div key={i} style={{ position:'absolute', top:item.top, left:item.left,
            animation:`${item.anim} ${item.dur} ease-in-out ${item.delay} infinite`, pointerEvents:'none' }}>
            {item.icon}
          </div>
        ))}
        <div style={{ position:'relative', zIndex:1, textAlign:'center', animation:'fadeLeft .7s ease forwards' }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:42, fontWeight:900, color:'#fff', marginBottom:8 }}>
            AMS <span style={{ background:'linear-gradient(135deg,#c0272d,#f87171)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Mart</span>
          </div>
          <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,.4)', textTransform:'uppercase', letterSpacing:2, marginBottom:48 }}>Supermarket</div>
          <p style={{ fontSize:15, color:'rgba(255,255,255,.55)', lineHeight:1.9, maxWidth:300, margin:'0 auto 40px' }}>
            Join thousands of customers shopping fresh groceries every day in Cambodia.
          </p>
          {['Free delivery on every order','Earn loyalty points every purchase','Access exclusive member deals','Track your orders in real time'].map((b,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(255,255,255,.06)', borderRadius:10, padding:'10px 16px', border:'1px solid rgba(255,255,255,.08)', marginBottom:10, textAlign:'left' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span style={{ fontSize:13, color:'rgba(255,255,255,.7)', fontWeight:500 }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div ref={panelRef} style={{ width:480, display:'flex', flexDirection:'column', justifyContent:'center', padding:'48px', background:'#fff', boxShadow:'-8px 0 40px rgba(0,0,0,.08)', overflowY:'auto' }}>

        {/* Progress Steps */}
        <div style={{ marginBottom:40 }}>
          <div style={{ display:'flex', alignItems:'center' }}>
            {STEPS.map((s, i) => (
              <div key={s.number} style={{ display:'flex', alignItems:'center', flex: i < STEPS.length-1 ? 1 : 'none' }}>
                <div style={{ position:'relative', flexShrink:0 }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, transition:'all .4s cubic-bezier(.34,1.56,.64,1)',
                    background: step > s.number ? '#16a34a' : step === s.number ? '#c0272d' : '#f1f5f9',
                    color: step >= s.number ? '#fff' : '#94a3b8',
                    boxShadow: step === s.number ? '0 0 0 4px rgba(192,39,45,.2)' : step > s.number ? '0 0 0 4px rgba(22,163,74,.15)' : 'none' }}>
                    {step > s.number ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> : s.number}
                  </div>
                  <div style={{ position:'absolute', top:42, left:'50%', transform:'translateX(-50%)', fontSize:10, fontWeight:700, color: step >= s.number ? '#c0272d' : '#94a3b8', textTransform:'uppercase', letterSpacing:.8, whiteSpace:'nowrap' }}>{s.label}</div>
                </div>
                {i < STEPS.length-1 && (
                  <div style={{ flex:1, height:2, margin:'0 8px', borderRadius:99, transition:'background .5s', background: step > s.number ? 'linear-gradient(90deg,#16a34a,#22c55e)' : '#f1f5f9' }}/>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="step-slide">
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:11, fontWeight:800, color:'#c0272d', textTransform:'uppercase', letterSpacing:1.5, marginBottom:8 }}>Step 1 of 2</div>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:900, color:'#0f172a', margin:'0 0 6px' }}>Create your account</h1>
              <p style={{ color:'#94a3b8', fontSize:14, margin:0 }}>Set up your login credentials</p>
            </div>
            <div style={{ marginBottom:18 }}>
              <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:8, textTransform:'uppercase', letterSpacing:.8 }}>Email Address *</label>
              <input type="email" placeholder="you@email.com" value={form.email} className="reg-input" style={inputStyle('email')} onChange={e=>set('email', e.target.value)}/>
              {errors.email && <div style={{ fontSize:12, color:'#ef4444', marginTop:6 }}>{errors.email}</div>}
            </div>
            <div style={{ marginBottom:18 }}>
              <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:8, textTransform:'uppercase', letterSpacing:.8 }}>Password *</label>
              <div style={{ position:'relative' }}>
                <input type={showPass?'text':'password'} placeholder="Min. 6 characters" value={form.password} className="reg-input" style={{ ...inputStyle('password'), paddingRight:44 }} onChange={e=>set('password', e.target.value)}/>
                <button type="button" className="show-pass" onClick={()=>setShowPass(!showPass)}>
                  {showPass ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>
              </div>
              {form.password.length > 0 && (
                <div style={{ marginTop:8 }}>
                  <div style={{ display:'flex', gap:4, marginBottom:4 }}>
                    {[1,2,3,4].map(n => (
                      <div key={n} style={{ flex:1, height:3, borderRadius:99, transition:'background .3s',
                        background: form.password.length >= n*2 ? (n<=1?'#ef4444':n<=2?'#f59e0b':n<=3?'#3b82f6':'#16a34a') : '#e5e7eb' }}/>
                    ))}
                  </div>
                  <div style={{ fontSize:11, color: form.password.length < 4?'#ef4444':form.password.length < 6?'#f59e0b':'#16a34a' }}>
                    {form.password.length < 4 ? 'Too weak' : form.password.length < 6 ? 'Almost there' : 'Strong password'}
                  </div>
                </div>
              )}
              {errors.password && <div style={{ fontSize:12, color:'#ef4444', marginTop:6 }}>{errors.password}</div>}
            </div>
            <div style={{ marginBottom:28 }}>
              <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:8, textTransform:'uppercase', letterSpacing:.8 }}>Confirm Password *</label>
              <input type="password" placeholder="Repeat your password" value={form.confirm} className="reg-input" style={inputStyle('confirm')} onChange={e=>set('confirm', e.target.value)}/>
              {errors.confirm && <div style={{ fontSize:12, color:'#ef4444', marginTop:6 }}>{errors.confirm}</div>}
            </div>
            <button className="next-btn" onClick={handleNext}>Continue to Details →</button>
            <div style={{ textAlign:'center', marginTop:20, fontSize:13, color:'#94a3b8' }}>
              Already have an account?{' '}<Link to="/login" style={{ color:'#c0272d', fontWeight:700, textDecoration:'none' }}>Sign In</Link>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="step-slide">
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:11, fontWeight:800, color:'#c0272d', textTransform:'uppercase', letterSpacing:1.5, marginBottom:8 }}>Step 2 of 2</div>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:900, color:'#0f172a', margin:'0 0 6px' }}>Your details</h1>
              <p style={{ color:'#94a3b8', fontSize:14, margin:0 }}>Tell us a bit about yourself</p>
            </div>
            <div style={{ marginBottom:18 }}>
              <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:8, textTransform:'uppercase', letterSpacing:.8 }}>Full Name *</label>
              <input placeholder="Limchheang KHUN" value={form.name} className="reg-input" style={inputStyle('name')} onChange={e=>set('name', e.target.value)}/>
              {errors.name && <div style={{ fontSize:12, color:'#ef4444', marginTop:6 }}>{errors.name}</div>}
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:8, textTransform:'uppercase', letterSpacing:.8 }}>Phone</label>
              <input placeholder="012345678 or +855 12 345 678" value={form.phone} className="reg-input" style={inputStyle('phone')} inputMode="tel" required onChange={e=>set('phone', e.target.value.replace(/[^0-9+\-\s]/g,''))}/>
              {errors.phone && <div style={{ fontSize:12, color:'#ef4444', marginTop:6 }}>{errors.phone}</div>}
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:8, textTransform:'uppercase', letterSpacing:.8 }}>Address *</label>
              <input placeholder="House 12, Street 289, Sangkat Kakab, Khan Posenchey, Phnom Penh" value={form.address} className="reg-input" style={inputStyle('address')} required onChange={e=>set('address', e.target.value)}/>
              {errors.address && <div style={{ fontSize:12, color:'#ef4444', marginTop:6 }}>{errors.address}</div>}
            </div>
            <div style={{ background:'#f8fafc', borderRadius:14, padding:'16px 20px', border:'1px solid #e2e8f0', marginBottom:24 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:1, marginBottom:12 }}>Account Summary</div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:6 }}>
                <span style={{ color:'#94a3b8' }}>Email</span><span style={{ fontWeight:600, color:'#0f172a' }}>{form.email}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                <span style={{ color:'#94a3b8' }}>Password</span><span style={{ fontWeight:600, color:'#0f172a', letterSpacing:2 }}>{'•'.repeat(form.password.length)}</span>
              </div>
            </div>
            <div style={{ display:'flex', gap:12 }}>
              <button onClick={()=>setStep(1)} style={{ flex:1, padding:'14px', borderRadius:12, border:'1.5px solid #e2e8f0', background:'#f8fafc', color:'#374151', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>← Back</button>
              <button className="next-btn" style={{ flex:2 }} onClick={handleNext} disabled={loading}>
                {loading ? 'Creating account…' : 'Create My Account →'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Success */}
        {step === 3 && (
          <div className="step-slide" style={{ textAlign:'center' }}>
            <div style={{ width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg,#16a34a,#22c55e)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', boxShadow:'0 12px 32px rgba(22,163,74,.35)', animation:'checkPop .5s cubic-bezier(.34,1.56,.64,1) forwards' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:900, color:'#0f172a', marginBottom:10 }}>Welcome aboard!</h1>
            <p style={{ fontSize:15, color:'#64748b', marginBottom:8, lineHeight:1.7 }}>Your AMS Mart account has been created successfully.</p>
            <p style={{ fontSize:13, color:'#94a3b8' }}>Redirecting you to your dashboard…</p>
            <div style={{ marginTop:24, display:'flex', justifyContent:'center' }}>
              <div style={{ width:32, height:32, border:'3px solid #f0f0f0', borderTopColor:'#c0272d', borderRadius:'50%', animation:'spin 1s linear infinite' }}/>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
