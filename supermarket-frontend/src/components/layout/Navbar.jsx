import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { totalItems } = useCart()
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/shop?search=${encodeURIComponent(search.trim())}`)
  }

  return (
    <header style={{ position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 12px rgba(0,0,0,.08)' }}>

      {/* TOPBAR */}
      <div style={{ background:'#1a1a1a', color:'#ccc', fontSize:12, padding:'8px 0' }}>
        <div className="container" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span>📍 Phnom Penh, Cambodia &nbsp;|&nbsp; +855 12 345 678</span>
          <div style={{ display:'flex', gap:16, alignItems:'center' }}>
            {user ? (
              <>
                <span style={{ color:'#86efac' }}>👋 {user.name || user.email}</span>
                {user.role === 'admin' && (
                  <Link to="/admin" style={{ color:'#fbbf24', fontWeight:700, fontSize:12 }}>
                    ⚙️ Admin Panel
                  </Link>
                )}
                <button onClick={logoutUser}
                  style={{ color:'#ccc', background:'none', border:'none', cursor:'pointer', fontSize:12 }}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    style={{ color:'#ccc' }}>Sign In</Link>
                <Link to="/register" style={{ color:'#ccc' }}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div style={{ background:'#fff', padding:'14px 0', borderBottom:'1px solid #e8e8e8' }}>
        <div className="container" style={{ display:'flex', alignItems:'center', gap:24 }}>
          <Link to="/" style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:28, fontWeight:700, color:'#1a1a1a', textDecoration:'none' }}>
            Fresh<span style={{ color:'#00B207' }}>Mart</span>
          </Link>

          <form style={{ flex:1, display:'flex', border:'2px solid #00B207', borderRadius:8, overflow:'hidden', maxWidth:520 }} onSubmit={handleSearch}>
            <select style={{ border:'none', borderRight:'1px solid #e8e8e8', padding:'0 12px', fontSize:13, background:'#f9f9f9', color:'#7e7e7e', minWidth:130 }}>
              <option>All Categories</option>
              <option>Produce</option><option>Dairy</option><option>Meat</option>
              <option>Bakery</option><option>Beverages</option><option>Snacks</option>
            </select>
            <input type="text" placeholder="Search for organic products…" value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex:1, border:'none', padding:'10px 14px', fontSize:14, color:'#1a1a1a' }} />
            <button type="submit" style={{ background:'#00B207', color:'#fff', padding:'0 20px', fontSize:14, fontWeight:700, border:'none', cursor:'pointer' }}>
              Search
            </button>
          </form>

          <div style={{ display:'flex', gap:18, alignItems:'center', marginLeft:'auto' }}>
            <Link to="/wishlist" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, fontSize:22, color:'#1a1a1a', textDecoration:'none' }}>
              ♡<span style={{ fontSize:11, color:'#7e7e7e' }}>Wishlist</span>
            </Link>
            <Link to="/cart" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, fontSize:22, color:'#1a1a1a', textDecoration:'none', position:'relative' }}>
              🛒<span style={{ fontSize:11, color:'#7e7e7e' }}>Cart</span>
              {totalItems > 0 && (
                <span style={{ position:'absolute', top:-6, right:-8, background:'#00B207', color:'#fff', fontSize:10, width:18, height:18, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>
                  {totalItems}
                </span>
              )}
            </Link>
            {user
              ? <Link to="/dashboard" style={{ background:'#00B207', color:'#fff', padding:'9px 22px', borderRadius:8, fontWeight:700, fontSize:13, textDecoration:'none' }}>My Account</Link>
              : <Link to="/login"     style={{ background:'#00B207', color:'#fff', padding:'9px 22px', borderRadius:8, fontWeight:700, fontSize:13, textDecoration:'none' }}>Login</Link>
            }
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav style={{ background:'#00B207' }}>
        <div className="container" style={{ display:'flex', alignItems:'center' }}>
          <div style={{ background:'#008f05', padding:'14px 22px', fontFamily:"'Josefin Sans',sans-serif", fontSize:14, fontWeight:600, color:'#fff', cursor:'pointer', borderRight:'1px solid rgba(255,255,255,.15)' }}>
            ☰ &nbsp;All Categories
          </div>
          <ul style={{ display:'flex', flex:1 }}>
            {[['/', 'Home'],['/shop','Shop'],['/about','About'],['/contact','Contact'],['/faq','FAQ']].map(([to, label]) => (
              <li key={to}>
                <Link to={to} style={{ display:'block', padding:'14px 18px', color:'rgba(255,255,255,.9)', fontSize:14, fontWeight:600, fontFamily:"'Josefin Sans',sans-serif", textDecoration:'none' }}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ADMIN BUTTON IN NAV - only for admin */}
          {user?.role === 'admin' && (
            <Link to="/admin" style={{ marginLeft:'auto', background:'rgba(255,255,255,.15)', color:'#fff', padding:'8px 18px', borderRadius:6, fontSize:13, fontWeight:700, textDecoration:'none', display:'flex', alignItems:'center', gap:6, marginRight:16, border:'1px solid rgba(255,255,255,.3)' }}>
              ⚙️ Admin Dashboard
            </Link>
          )}

          <div style={{ padding:'0 20px', fontSize:12, color:'rgba(255,255,255,.75)', whiteSpace:'nowrap' }}>
            🌿 Free shipping on orders over $50
          </div>
        </div>
      </nav>
    </header>
  )
}
