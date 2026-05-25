import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' })
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Welcome back!')
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#f0fdf0,#e8f5e9)', padding:40 }}>
      <div style={{ background:'#fff', borderRadius:16, padding:40, width:'100%', maxWidth:420, boxShadow:'0 8px 40px rgba(0,0,0,.1)' }}>
        <h2 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:26, fontWeight:700, marginBottom:6 }}>Welcome Back 👋</h2>
        <p style={{ color:'#7e7e7e', marginBottom:24, fontSize:14 }}>Sign in to your FreshMart account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></div>
          <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required /></div>
          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop:8 }}>Sign In</button>
        </form>
        <p style={{ fontSize:13, textAlign:'center', color:'#7e7e7e', marginTop:20 }}>No account? <Link to="/register" style={{ color:'#00B207', fontWeight:700 }}>Sign Up</Link></p>
      </div>
    </div>
  )
}
