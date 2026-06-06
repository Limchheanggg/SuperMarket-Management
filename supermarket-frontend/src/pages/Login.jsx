import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [form,     setForm]     = useState({ email:'', password:'' })
  const [loading,  setLoading]  = useState(false)
  const [errors,   setErrors]   = useState({})
  const [showPass, setShowPass] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent,  setForgotSent]  = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await login(form)
      loginUser(res.data.access_token, res.data.user)
      toast.success(`Welcome back, ${res.data.user.name || res.data.user.email}!`)
      navigate('/dashboard')
    } catch (err) {
      const status = err.response?.status
      const detail = (err.response?.data?.detail || '').toLowerCase()
      if (status === 401 || detail.includes('password') || detail.includes('invalid'))
        setErrors({ password: 'Incorrect password. Please try again.' })
      else if (status === 404 || detail.includes('not found') || detail.includes('email'))
        setErrors({ email: 'No account found with this email.' })
      else
        setErrors({ password: err.response?.data?.detail || 'Login failed. Please try again.' })
    } finally { setLoading(false) }
  }

  const handleForgot = (e) => {
    e.preventDefault()
    if (!forgotEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      toast.error('Please enter a valid email address')
      return
    }
    // Simulate sending reset email
    setForgotSent(true)
    toast.success('Password reset instructions sent!')
  }

  const inputBase = {
    width:'100%', padding:'13px 16px', borderRadius:12, fontSize:14,
    fontFamily:"'Plus Jakarta Sans',sans-serif", outline:'none',
    boxSizing:'border-box', transition:'all .25s',
  }

  const inputStyle = (field) => ({
    ...inputBase,
    border:`1.5px solid ${errors[field]?'#ef4444':'#e5e7eb'}`,
    background: errors[field]?'#fef2f2':'#f9fafb',
  })

  return (
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#f4f6fa' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeLeft{ from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes float1  { 0%{transform:translate(0,0) rotate(0deg)} 25%{transform:translate(20px,-30px) rotate(10deg)} 50%{transform:translate(-10px,-60px) rotate(-5deg)} 75%{transform:translate(15px,-40px) rotate(8deg)} 100%{transform:translate(0,0) rotate(0deg)} }
        @keyframes float2  { 0%{transform:translate(0,0) rotate(0deg)} 25%{transform:translate(-25px,-40px) rotate(-12deg)} 50%{transform:translate(10px,-70px) rotate(6deg)} 75%{transform:translate(-15px,-30px) rotate(-8deg)} 100%{transform:translate(0,0) rotate(0deg)} }
        @keyframes float3  { 0%{transform:translate(0,0) rotate(0deg)} 33%{transform:translate(30px,-50px) rotate(15deg)} 66%{transform:translate(-20px,-80px) rotate(-10deg)} 100%{transform:translate(0,0) rotate(0deg)} }
        @keyframes float4  { 0%{transform:translate(0,0) rotate(0deg)} 20%{transform:translate(-30px,-25px) rotate(-8deg)} 40%{transform:translate(20px,-55px) rotate(12deg)} 60%{transform:translate(-10px,-75px) rotate(-5deg)} 80%{transform:translate(25px,-40px) rotate(10deg)} 100%{transform:translate(0,0) rotate(0deg)} }
        @keyframes spin-slow{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmer  { from{background-position:200% center} to{background-position:-200% center} }
        @keyframes bgShift  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .login-input:focus { border-color:#c0272d !important; box-shadow:0 0 0 3px rgba(192,39,45,.1) !important; background:#fff !important; }
        .login-btn { width:100%; padding:14px; border-radius:12px; border:none;
          background:linear-gradient(135deg,#c0272d,#e53935); color:#fff;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:700;
          cursor:pointer; transition:all .3s; box-shadow:0 6px 20px rgba(192,39,45,.35); }
        .login-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 28px rgba(192,39,45,.45); }
        .login-btn:disabled { background:#e5e7eb; color:#9ca3af; box-shadow:none; cursor:not-allowed; }
        .show-pass { position:absolute; right:14px; top:50%; transform:translateY(-50%);
          background:none; border:none; cursor:pointer; color:#9ca3af; padding:4px; transition:color .2s; }
        .show-pass:hover { color:#c0272d; }
      `}</style>

      {/* LEFT PANEL */}
      <div style={{ flex:1, background:'linear-gradient(135deg,#1a0505 0%,#2d0b0b 35%,#0d1240 100%)',
        backgroundSize:'400% 400%', animation:'bgShift 12s ease infinite',
        display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',
        padding:60, position:'relative', overflow:'hidden' }}>

        {/* Free floating balloon-style category icons */}
        {[
          { icon:<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,         top:'75%', left:'8%',  anim:'float1', dur:'9s',  delay:'0s'   },
          { icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(192,39,45,0.3)" strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>, top:'80%', left:'22%', anim:'float2', dur:'11s', delay:'1s'  },
          { icon:<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>,                                                                       top:'85%', left:'40%', anim:'float3', dur:'13s', delay:'2s'  },
          { icon:<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(192,39,45,0.22)" strokeWidth="1.5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,                                                     top:'78%', left:'58%', anim:'float4', dur:'10s', delay:'0.5s'},
          { icon:<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,             top:'82%', left:'75%', anim:'float1', dur:'12s', delay:'1.5s'},
          { icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(192,39,45,0.2)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,                                                                                                         top:'88%', left:'88%', anim:'float2', dur:'8s',  delay:'3s'  },
          { icon:<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,                                  top:'72%', left:'50%', anim:'float3', dur:'14s', delay:'2.5s'},
          { icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(192,39,45,0.18)" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,                                                                       top:'90%', left:'32%', anim:'float4', dur:'10s', delay:'4s'  },
        ].map((item, i) => (
          <div key={i} style={{ position:'absolute', top:item.top, left:item.left,
            animation:`${item.anim} ${item.dur} ease-in-out ${item.delay} infinite`,
            pointerEvents:'none', zIndex:0 }}>
            {item.icon}
          </div>
        ))}

        <div style={{ position:'relative', zIndex:1, textAlign:'center', animation:'fadeLeft .7s ease forwards' }}>
          {/* Logo */}
          <div style={{ marginBottom:40 }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:42, fontWeight:900,
              color:'#fff', lineHeight:1.1, marginBottom:16 }}>
              AMS <span style={{ background:'linear-gradient(135deg,#c0272d,#f87171)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                backgroundClip:'text' }}>Mart</span>
            </div>
            <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,.4)',
              textTransform:'uppercase', letterSpacing:2 }}>Supermarket</div>
          </div>

          <p style={{ fontSize:16, color:'rgba(255,255,255,.6)', lineHeight:1.8,
            maxWidth:320, margin:'0 auto 48px' }}>
            Your trusted supermarket for fresh groceries and everyday essentials in Phnom Penh.
          </p>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {[['147','Products'],['12','Categories'],['2026','Founded']].map(([n,l]) => (
              <div key={l} style={{ background:'rgba(255,255,255,.06)', borderRadius:14,
                padding:'16px 12px', border:'1px solid rgba(255,255,255,.08)' }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24,
                  fontWeight:900, color:'#fff' }}>{n}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.4)', fontWeight:600,
                  textTransform:'uppercase', letterSpacing:1, marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width:480, display:'flex', flexDirection:'column', justifyContent:'center',
        padding:'60px 48px', background:'#fff', boxShadow:'-8px 0 40px rgba(0,0,0,.08)' }}>

        <div style={{ animation:'fadeUp .6s ease forwards' }}>
          {!forgotMode ? (
            <>
              {/* Header */}
              <div style={{ marginBottom:36 }}>
                <div style={{ fontSize:11, fontWeight:800, color:'#c0272d',
                  textTransform:'uppercase', letterSpacing:1.5, marginBottom:10 }}>
                  Welcome back
                </div>
                <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32,
                  fontWeight:900, color:'#0f172a', margin:'0 0 8px' }}>
                  Sign In
                </h1>
                <p style={{ color:'#9ca3af', fontSize:14, margin:0 }}>
                  Enter your credentials to access your account
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:'#374151',
                    display:'block', marginBottom:8, textTransform:'uppercase', letterSpacing:.8 }}>
                    Email Address
                  </label>
                  <input type="email" placeholder="you@email.com" value={form.email}
                    className="login-input"
                    onChange={e=>{ setForm({...form,email:e.target.value}); setErrors({...errors,email:''}) }}
                    style={inputStyle('email')}/>
                  {errors.email && (
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:7,
                      fontSize:12, color:'#ef4444', background:'#fef2f2',
                      padding:'7px 12px', borderRadius:8, border:'1px solid #fecaca' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Password */}
                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:'#374151',
                    display:'block', marginBottom:8, textTransform:'uppercase', letterSpacing:.8 }}>
                    Password
                  </label>
                  <div style={{ position:'relative' }}>
                    <input type={showPass?'text':'password'} placeholder="••••••••" value={form.password}
                      className="login-input"
                      onChange={e=>{ setForm({...form,password:e.target.value}); setErrors({...errors,password:''}) }}
                      style={{ ...inputStyle('password'), paddingRight:44 }}/>
                    <button type="button" className="show-pass" onClick={()=>setShowPass(!showPass)}>
                      {showPass
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  {errors.password && (
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:7,
                      fontSize:12, color:'#ef4444', background:'#fef2f2',
                      padding:'7px 12px', borderRadius:8, border:'1px solid #fecaca' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {errors.password}
                    </div>
                  )}
                </div>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
                  <label style={{ display:'flex', gap:8, cursor:'pointer', alignItems:'center',
                    fontSize:13, color:'#374151', fontWeight:500 }}>
                    <input type="checkbox" style={{ accentColor:'#c0272d', width:15, height:15 }}/>
                    Remember me
                  </label>
                  <button type="button" onClick={()=>setForgotMode(true)}
                    style={{ background:'none', border:'none', cursor:'pointer',
                      color:'#c0272d', fontWeight:700, fontSize:13,
                      fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                    Forgot password?
                  </button>
                </div>

                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign In →'}
                </button>
              </form>

              <div style={{ textAlign:'center', margin:'24px 0 0', fontSize:13, color:'#9ca3af' }}>
                No account?{' '}
                <Link to="/register" style={{ color:'#c0272d', fontWeight:700, textDecoration:'none' }}>
                  Create one free
                </Link>
              </div>
            </>
          ) : (
            /* FORGOT PASSWORD */
            <>
              <button onClick={()=>{ setForgotMode(false); setForgotSent(false); setForgotEmail('') }}
                style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none',
                  cursor:'pointer', color:'#9ca3af', fontSize:13, fontWeight:600,
                  fontFamily:"'Plus Jakarta Sans',sans-serif", marginBottom:32, padding:0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                Back to Sign In
              </button>

              <div style={{ marginBottom:32 }}>
                <div style={{ fontSize:11, fontWeight:800, color:'#c0272d',
                  textTransform:'uppercase', letterSpacing:1.5, marginBottom:10 }}>
                  Password Reset
                </div>
                <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30,
                  fontWeight:900, color:'#0f172a', margin:'0 0 8px' }}>
                  Forgot Password?
                </h1>
                <p style={{ color:'#9ca3af', fontSize:14, margin:0, lineHeight:1.7 }}>
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>

              {!forgotSent ? (
                <form onSubmit={handleForgot}>
                  <div style={{ marginBottom:24 }}>
                    <label style={{ fontSize:12, fontWeight:700, color:'#374151',
                      display:'block', marginBottom:8, textTransform:'uppercase', letterSpacing:.8 }}>
                      Email Address
                    </label>
                    <input type="email" placeholder="you@email.com" value={forgotEmail}
                      onChange={e=>setForgotEmail(e.target.value)}
                      className="login-input"
                      style={{ ...inputBase, border:'1.5px solid #e5e7eb', background:'#f9fafb', width:'100%' }}/>
                  </div>
                  <button type="submit" className="login-btn">
                    Send Reset Instructions
                  </button>
                </form>
              ) : (
                <div style={{ textAlign:'center', padding:'32px 20px', background:'#f0fdf4',
                  borderRadius:16, border:'1.5px solid #bbf7d0' }}>
                  <div style={{ width:56, height:56, borderRadius:'50%',
                    background:'linear-gradient(135deg,#16a34a,#22c55e)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    margin:'0 auto 16px', boxShadow:'0 8px 24px rgba(22,163,74,.3)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h3 style={{ fontSize:18, fontWeight:800, color:'#15803d', marginBottom:8 }}>Email Sent!</h3>
                  <p style={{ fontSize:13, color:'#15803d', margin:'0 0 20px', lineHeight:1.7 }}>
                    Your request has been recorded for <strong>{forgotEmail}</strong>.<br/>
                    Since this is a demo system, please contact your admin directly:<br/>
                    <strong>limchheang@amsmart.kh</strong> or <strong>+855 12 345 678</strong>
                  </p>
                  <button onClick={()=>{ setForgotMode(false); setForgotSent(false); setForgotEmail('') }}
                    style={{ padding:'10px 24px', borderRadius:10, border:'none',
                      background:'linear-gradient(135deg,#16a34a,#22c55e)', color:'#fff',
                      fontWeight:700, fontSize:14, cursor:'pointer',
                      fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                    Back to Sign In
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
