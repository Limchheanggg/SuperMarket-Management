import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await login(form)
      loginUser(res.data.access_token, res.data.user)
      toast.success(`Welcome back, ${res.data.user.name || res.data.user.email}! 👋`)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid email or password'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#f0fdf0,#e8f5e9)', padding:40 }}>
      <div style={{ background:'#fff', borderRadius:16, padding:40, width:'100%', maxWidth:420, boxShadow:'0 8px 40px rgba(0,0,0,.1)' }}>
        <h2 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:26, fontWeight:700, marginBottom:6 }}>Welcome Back 👋</h2>
        <p style={{ color:'#7e7e7e', marginBottom:24, fontSize:14 }}>Sign in to your FreshMart account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="you@email.com"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:16 }}>
            <label style={{ display:'flex', gap:6, cursor:'pointer', alignItems:'center' }}>
              <input type="checkbox" style={{ accentColor:'#00B207' }}/> Remember me
            </label>
            <a href="#" style={{ color:'#00B207' }}>Forgot password?</a>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? '⏳ Signing in…' : 'Sign In'}
          </button>
        </form>
        <div style={{ textAlign:'center', margin:'16px 0', color:'#aaa', fontSize:13 }}>── or ──</div>
        <p style={{ fontSize:13, textAlign:'center', color:'#7e7e7e' }}>
          No account? <Link to="/register" style={{ color:'#00B207', fontWeight:700 }}>Sign Up Free</Link>
        </p>
      </div>
    </div>
  )
}
