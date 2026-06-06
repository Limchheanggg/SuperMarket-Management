import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const [form,     setForm]     = useState({ name:'', email:'', password:'', confirm:'', phone:'' })
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [errors,   setErrors]   = useState({})
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Full name is required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (form.password.length < 6)           e.password = 'Minimum 6 characters'
    if (form.password !== form.confirm)     e.confirm  = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await register({ name:form.name, email:form.email, password:form.password, phone:form.phone })
      loginUser(res.data.access_token, res.data.user)
      toast.success('Account created! Welcome to AMS Mart!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally { setLoading(false) }
  }

  const inputStyle = (field) => ({
    width:'100%', padding:'13px 16px', borderRadius:12, fontSize:14,
    fontFamily:"'Plus Jakarta Sans',sans-serif", outline:'none',
    boxSizing:'border-box', transition:'all .25s',
    border:`1.5px solid ${errors[field]?'#ef4444':'#e5e7eb'}`,
    background: errors[field]?'#fef2f2':'#f9fafb',
  })

  const ICONS = [
    { icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, top:'82%', left:'5%',  anim:'float1', dur:'9s',  delay:'0s'   },
    { icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(192,39,45,0.28)" strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>, top:'80%', left:'20%', anim:'float2', dur:'11s', delay:'1s'   },
    { icon:<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>, top:'85%', left:'38%', anim:'float3', dur:'13s', delay:'2s'   },
    { icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(192,39,45,0.2)" strokeWidth="1.5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>, top:'78%', left:'55%', anim:'float4', dur:'10s', delay:'.5s'  },
    { icon:<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, top:'84%', left:'72%', anim:'float1', dur:'12s', delay:'1.5s' },
    { icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(192,39,45,0.2)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, top:'88%', left:'88%', anim:'float2', dur:'8s',  delay:'3s'   },
    { icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, top:'90%', left:'30%', anim:'float4', dur:'10s', delay:'4s'   },
  ]

  return (
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#f4f6fa' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeLeft{ from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes bgShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes float1  { 0%{transform:translate(0,0) rotate(0deg)} 25%{transform:translate(20px,-30px) rotate(10deg)} 50%{transform:translate(-10px,-60px) rotate(-5deg)} 75%{transform:translate(15px,-40px) rotate(8deg)} 100%{transform:translate(0,0) rotate(0deg)} }
        @keyframes float2  { 0%{transform:translate(0,0) rotate(0deg)} 25%{transform:translate(-25px,-40px) rotate(-12deg)} 50%{transform:translate(10px,-70px) rotate(6deg)} 75%{transform:translate(-15px,-30px) rotate(-8deg)} 100%{transform:translate(0,0) rotate(0deg)} }
        @keyframes float3  { 0%{transform:translate(0,0) rotate(0deg)} 33%{transform:translate(30px,-50px) rotate(15deg)} 66%{transform:translate(-20px,-80px) rotate(-10deg)} 100%{transform:translate(0,0) rotate(0deg)} }
        @keyframes float4  { 0%{transform:translate(0,0) rotate(0deg)} 20%{transform:translate(-30px,-25px) rotate(-8deg)} 40%{transform:translate(20px,-55px) rotate(12deg)} 60%{transform:translate(-10px,-75px) rotate(-5deg)} 80%{transform:translate(25px,-40px) rotate(10deg)} 100%{transform:translate(0,0) rotate(0deg)} }
        .reg-input:focus { border-color:#c0272d !important; box-shadow:0 0 0 3px rgba(192,39,45,.1) !important; background:#fff !important; }
        .reg-btn { width:100%; padding:14px; border-radius:12px; border:none; background:linear-gradient(135deg,#c0272d,#e53935); color:#fff; font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:700; cursor:pointer; transition:all .3s; box-shadow:0 6px 20px rgba(192,39,45,.35); }
        .reg-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 28px rgba(192,39,45,.45); }
        .reg-btn:disabled { background:#e5e7eb; color:#9ca3af; box-shadow:none; cursor:not-allowed; }
        .show-pass { position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#9ca3af; padding:4px; transition:color .2s; }
        .show-pass:hover { color:#c0272d; }
      `}</style>

      {/* LEFT PANEL */}
      <div style={{ flex:1, background:'linear-gradient(135deg,#1a0505 0%,#2d0b0b 35%,#0d1240 100%)',
        backgroundSize:'400% 400%', animation:'bgShift 12s ease infinite',
        display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',
        padding:60, position:'relative', overflow:'hidden' }}>

        {/* Floating icons */}
        {ICONS.map((item,i) => (
          <div key={i} style={{ position:'absolute', top:item.top, left:item.left,
            animation:`${item.anim} ${item.dur} ease-in-out ${item.delay} infinite`,
            pointerEvents:'none', zIndex:0 }}>
            {item.icon}
          </div>
        ))}

        <div style={{ position:'relative', zIndex:1, textAlign:'center', animation:'fadeLeft .7s ease forwards' }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:42, fontWeight:900,
            color:'#fff', lineHeight:1.1, marginBottom:8 }}>
            AMS <span style={{ background:'linear-gradient(135deg,#c0272d,#f87171)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Mart</span>
          </div>
          <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,.4)',
            textTransform:'uppercase', letterSpacing:2, marginBottom:40 }}>Supermarket</div>

          <p style={{ fontSize:16, color:'rgba(255,255,255,.6)', lineHeight:1.8,
            maxWidth:300, margin:'0 auto 48px' }}>
            Join thousands of customers shopping fresh groceries every day.
          </p>

          {/* Benefits */}
          <div style={{ display:'flex', flexDirection:'column', gap:14, textAlign:'left' }}>
            {[
              { icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>, text:'Free delivery on every order' },
              { icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>, text:'Earn loyalty points with every purchase' },
              { icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>, text:'Access exclusive member coupons' },
              { icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>, text:'Track your orders in real time' },
            ].map((b,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12,
                background:'rgba(255,255,255,.06)', borderRadius:10, padding:'10px 16px',
                border:'1px solid rgba(255,255,255,.08)' }}>
                <div style={{ flexShrink:0 }}>{b.icon}</div>
                <span style={{ fontSize:13, color:'rgba(255,255,255,.75)', fontWeight:500 }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width:500, display:'flex', flexDirection:'column', justifyContent:'center',
        padding:'48px 48px', background:'#fff', boxShadow:'-8px 0 40px rgba(0,0,0,.08)',
        overflowY:'auto' }}>

        <div style={{ animation:'fadeUp .6s ease forwards' }}>
          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:11, fontWeight:800, color:'#c0272d',
              textTransform:'uppercase', letterSpacing:1.5, marginBottom:10 }}>
              Get Started
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30,
              fontWeight:900, color:'#0f172a', margin:'0 0 8px' }}>
              Create Account
            </h1>
            <p style={{ color:'#9ca3af', fontSize:14, margin:0 }}>
              Join AMS Mart for fresh deals and loyalty rewards
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Name + Phone */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block',
                  marginBottom:8, textTransform:'uppercase', letterSpacing:.8 }}>Full Name *</label>
                <input placeholder="Limchheang KHUN" value={form.name}
                  className="reg-input" style={inputStyle('name')}
                  onChange={e=>{ setForm({...form,name:e.target.value}); setErrors({...errors,name:''}) }}/>
                {errors.name && <div style={{ fontSize:11, color:'#ef4444', marginTop:5 }}>{errors.name}</div>}
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block',
                  marginBottom:8, textTransform:'uppercase', letterSpacing:.8 }}>Phone</label>
                <input placeholder="+855 12 345 678" value={form.phone}
                  className="reg-input" style={inputStyle('phone')} inputMode="tel"
                  onChange={e=>setForm({...form,phone:e.target.value.replace(/[^0-9+\-\s]/g,'')})}/>
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block',
                marginBottom:8, textTransform:'uppercase', letterSpacing:.8 }}>Email Address *</label>
              <input type="email" placeholder="you@email.com" value={form.email}
                className="reg-input" style={inputStyle('email')}
                onChange={e=>{ setForm({...form,email:e.target.value}); setErrors({...errors,email:''}) }}/>
              {errors.email && <div style={{ fontSize:11, color:'#ef4444', marginTop:5 }}>{errors.email}</div>}
            </div>

            {/* Password + Confirm */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:20 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block',
                  marginBottom:8, textTransform:'uppercase', letterSpacing:.8 }}>Password *</label>
                <div style={{ position:'relative' }}>
                  <input type={showPass?'text':'password'} placeholder="Min. 6 characters" value={form.password}
                    className="reg-input" style={{ ...inputStyle('password'), paddingRight:44 }}
                    onChange={e=>{ setForm({...form,password:e.target.value}); setErrors({...errors,password:''}) }}/>
                  <button type="button" className="show-pass" onClick={()=>setShowPass(!showPass)}>
                    {showPass
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
                {errors.password && <div style={{ fontSize:11, color:'#ef4444', marginTop:5 }}>{errors.password}</div>}
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block',
                  marginBottom:8, textTransform:'uppercase', letterSpacing:.8 }}>Confirm *</label>
                <input type="password" placeholder="Repeat password" value={form.confirm}
                  className="reg-input" style={inputStyle('confirm')}
                  onChange={e=>{ setForm({...form,confirm:e.target.value}); setErrors({...errors,confirm:''}) }}/>
                {errors.confirm && <div style={{ fontSize:11, color:'#ef4444', marginTop:5 }}>{errors.confirm}</div>}
              </div>
            </div>

            {/* Terms */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24,
              padding:'12px 16px', background:'#f9fafb', borderRadius:10, border:'1px solid #f0f0f0' }}>
              <input type="checkbox" required id="terms"
                style={{ accentColor:'#c0272d', width:16, height:16, flexShrink:0 }}/>
              <label htmlFor="terms" style={{ fontSize:13, color:'#6b7280', cursor:'pointer' }}>
                I agree to the{' '}
                <a href="#" style={{ color:'#c0272d', fontWeight:700, textDecoration:'none' }}>
                  Terms & Conditions
                </a>
              </label>
            </div>

            <button type="submit" className="reg-btn" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>

          <div style={{ textAlign:'center', marginTop:24, fontSize:13, color:'#9ca3af' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'#c0272d', fontWeight:700, textDecoration:'none' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
