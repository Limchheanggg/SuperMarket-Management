import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"", phone:"" });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error("Passwords do not match!"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const res = await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      loginUser(res.data.access_token, res.data.user);
      toast.success("Account created! Welcome to FreshMart 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePhone = (e) => {
    const val = e.target.value.replace(/[^0-9+\-\s]/g, '')
    setForm({ ...form, phone: val })
  }

  return (
    <div style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#f0fdf0,#e8f5e9)", padding:40 }}>
      <div style={{ background:"#fff", borderRadius:16, padding:40, width:"100%", maxWidth:480, boxShadow:"0 8px 40px rgba(0,0,0,.1)" }}>
        <h2 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:26, fontWeight:700, marginBottom:6 }}>
          Create Account 🌿
        </h2>
        <p style={{ color:"#7e7e7e", marginBottom:24, fontSize:14 }}>
          Join FreshMart for fresh deals and loyalty points
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                className="form-input"
                placeholder="Limchheang KHUN"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                className="form-input"
                placeholder="+855 12 345 678"
                value={form.phone}
                inputMode="tel"
                onChange={handlePhone}
                onKeyDown={(e) => {
                  const allowed = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Enter']
                  if (!allowed.includes(e.key) && !/^[0-9+\-\s]$/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                className="form-input"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                className="form-input"
                type="password"
                placeholder="Repeat password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                required
              />
            </div>
          </div>
          <div style={{ fontSize:13, color:"#7e7e7e", marginBottom:16, display:"flex", gap:6, alignItems:"center" }}>
            <input type="checkbox" required style={{ accentColor:"#00B207" }} />
            I agree to the <a href="#" style={{ color:"#00B207" }}>Terms & Conditions</a>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "⏳ Creating account…" : "Create Account"}
          </button>
        </form>
        <p style={{ fontSize:13, textAlign:"center", color:"#7e7e7e", marginTop:20 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color:"#00B207", fontWeight:700 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
