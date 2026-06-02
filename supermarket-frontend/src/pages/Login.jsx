import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm]       = useState({ email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.email.trim())
      e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Please enter a valid email address'
    if (!form.password)
      e.password = 'Password is required'
    else if (form.password.length < 6)
      e.password = 'Password must be at least 6 characters'
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
      toast.success(`Welcome back, ${res.data.user.name || res.data.user.email}! 👋`)
      navigate('/dashboard')
    } catch (err) {
      const status = err.response?.status
      const detail = (err.response?.data?.detail || '').toLowerCase()
      if (status === 401 || detail.includes('password') || detail.includes('invalid'))
        setErrors({ password: 'Incorrect password. Please try again.' })
      else if (status === 404 || detail.includes('not found') || detail.includes('email'))
        setErrors({ email: 'No account found with this email address.' })
      else if (status === 422)
        setErrors({ email: 'Please enter a valid email and password.' })
      else if (!navigator.onLine)
        toast.error('No internet connection. Please check your network.')
      else
        setErrors({ password: err.response?.data?.detail || 'Login failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (field) => ({
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: `1.5px solid ${errors[field] ? '#ef4444' : '#e5e7eb'}`,
    fontSize: 14, fontFamily: "'Plus Jakarta Sans',sans-serif",
    outline: 'none', boxSizing: 'border-box', transition: 'border-color .2s',
    background: errors[field] ? '#fef2f2' : '#fff',
  })

  return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#f0fdf4,#ecfdf5)', padding:40 }}>
      <div style={{ background:'#fff', borderRadius:18, padding:40, width:'100%', maxWidth:420, boxShadow:'0 8px 40px rgba(0,0,0,.1)', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:56, height:56, borderRadius:16, background:'linear-gradient(135deg,#15803d,#22c55e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, margin:'0 auto 14px' }}>🌿</div>
          <h2 style={{ fontSize:24, fontWeight:800, color:'#111827', marginBottom:4 }}>Welcome Back 👋</h2>
          <p style={{ color:'#6b7280', fontSize:14 }}>Sign in to your FreshMart account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:6, color:'#374151' }}>Email Address</label>
            <input type="email" placeholder="you@email.com" value={form.email}
              onChange={e => { setForm({...form, email:e.target.value}); setErrors({...errors, email:''}) }}
              style={inputStyle('email')} />
            {errors.email && (
              <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:6, fontSize:12, color:'#ef4444', background:'#fef2f2', padding:'6px 10px', borderRadius:8, border:'1px solid #fecaca' }}>
                ⚠️ {errors.email}
              </div>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:6, color:'#374151' }}>Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={e => { setForm({...form, password:e.target.value}); setErrors({...errors, password:''}) }}
              style={inputStyle('password')} />
            {errors.password && (
              <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:6, fontSize:12, color:'#ef4444', background:'#fef2f2', padding:'6px 10px', borderRadius:8, border:'1px solid #fecaca' }}>
                ⚠️ {errors.password}
              </div>
            )}
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:20 }}>
            <label style={{ display:'flex', gap:6, cursor:'pointer', alignItems:'center', color:'#374151' }}>
              <input type="checkbox" style={{ accentColor:'#16a34a' }} /> Remember me
            </label>
            <a href="#" style={{ color:'#16a34a', fontWeight:600, textDecoration:'none' }}>Forgot password?</a>
          </div>

          <button type="submit" disabled={loading}
            style={{ width:'100%', padding:'13px', borderRadius:12, border:'none',
              background: loading ? '#e5e7eb' : 'linear-gradient(135deg,#15803d,#22c55e)',
              color: loading ? '#9ca3af' : '#fff',
              fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, fontWeight:700,
              cursor: loading ? 'not-allowed' : 'pointer', transition:'all .2s',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(21,128,61,.3)' }}>
            {loading ? '⏳ Signing in…' : 'Sign In →'}
          </button>
        </form>

        <div style={{ textAlign:'center', margin:'18px 0', color:'#d1d5db', fontSize:13 }}>── or ──</div>
        <p style={{ fontSize:13, textAlign:'center', color:'#6b7280' }}>
          No account?{' '}
          <Link to="/register" style={{ color:'#16a34a', fontWeight:700, textDecoration:'none' }}>Sign Up Free</Link>
        </p>
      </div>
    </div>
  )
}
