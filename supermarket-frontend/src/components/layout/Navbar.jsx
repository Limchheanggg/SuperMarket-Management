import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { getCategories } from '../../services/api'

const ADMIN_ROLES = ['admin', 'manager']

// AMS Logo Mark — balanced 3-bar chart icon
const AMSLogoMark = ({ size = 44 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.22,
    background: 'linear-gradient(160deg,#1e2472 0%,#0d1240 100%)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    padding: `0 ${size*0.16}px ${size*0.22}px`,
    gap: size * 0.08, flexShrink: 0,
    position: 'relative', overflow: 'hidden',
    boxShadow: '0 4px 18px rgba(13,18,64,0.50)',
  }}>
    {/* Shine */}
    <div style={{ position:'absolute', top:0, left:0, right:0, height:'42%', background:'linear-gradient(180deg,rgba(255,255,255,0.11),transparent)', pointerEvents:'none' }} />
    {/* Bar 1 — medium */}
    <div style={{ width:size*0.16, height:size*0.50, borderRadius:'2px 2px 1px 1px', background:'rgba(255,255,255,0.93)', flexShrink:0, position:'relative', zIndex:1 }} />
    {/* Bar 2 — short red */}
    <div style={{ width:size*0.16, height:size*0.32, borderRadius:'2px 2px 1px 1px', background:'#c0272d', flexShrink:0, position:'relative', zIndex:1 }} />
    {/* Bar 3 — tallest */}
    <div style={{ width:size*0.16, height:size*0.66, borderRadius:'2px 2px 1px 1px', background:'rgba(255,255,255,0.93)', flexShrink:0, position:'relative', zIndex:1 }} />
    {/* Underline */}
    <div style={{ position:'absolute', bottom:size*0.09, left:size*0.14, right:size*0.14, height:size*0.05, background:'#c0272d', borderRadius:99, zIndex:1 }} />
  </div>
)

export default function Navbar() {
  const { totalItems, totalQty } = useCart()
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [categories, setCategories] = useState([])
  const [userOpen, setUserOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn)
    getCategories().then(r => setCategories(r.data || [])).catch(() => {})
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/shop?search=${encodeURIComponent(search.trim())}`)
  }

  const cartCount = totalQty || totalItems || 0

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800;900&family=Barlow+Condensed:wght@700;800;900&display=swap');
        .nb-topbar{background:#0D1B3E;padding:8px 0}
        .nb-topbar-inner{max-width:1280px;margin:0 auto;padding:0 24px;display:flex;justify-content:space-between;align-items:center}
        .nb-topbar-item{display:flex;align-items:center;gap:6px;font-family:'Barlow',sans-serif;font-size:12px;color:rgba(255,255,255,0.65)}
        .nb-topbar-link{font-family:'Barlow',sans-serif;font-size:12px;color:rgba(255,255,255,0.7);text-decoration:none;transition:color .2s}
        .nb-topbar-link:hover{color:#fff}
        .nb-topbar-sep{width:1px;height:12px;background:rgba(255,255,255,0.2)}
        .nb-header{position:sticky;top:0;z-index:100;background:#fff;border-bottom:2px solid #E8ECF4;transition:box-shadow .3s ease}
        .nb-header.scrolled{box-shadow:0 4px 24px rgba(13,27,62,0.10)}
        .nb-header-inner{max-width:1280px;margin:0 auto;padding:0 24px;height:72px;display:flex;align-items:center;gap:20px}
        .nb-logo{text-decoration:none;display:flex;align-items:center;gap:11px;flex-shrink:0}
        .nb-logo-name{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:900;color:#0D1B3E;letter-spacing:-0.5px;line-height:1.1}
        .nb-logo-name span{color:#D42B2B}
        .nb-logo-tag{font-family:'Barlow',sans-serif;font-size:9.5px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:#8896B3;line-height:1}
        .nb-search-form{display:flex;background:#F4F6F9;border-radius:10px;border:1.5px solid #E8ECF4;overflow:hidden;transition:all .25s;flex:1;max-width:520px}
        .nb-search-form:focus-within{border-color:#0D1B3E;background:#fff;box-shadow:0 0 0 3px rgba(13,27,62,0.08)}
        .nb-search-input{flex:1;border:none;background:transparent;padding:11px 16px;font-family:'Barlow',sans-serif;font-size:14px;color:#1E2545;outline:none}
        .nb-search-input::placeholder{color:#8896B3}
        .nb-search-btn{background:#0D1B3E;color:#fff;border:none;padding:11px 20px;cursor:pointer;font-family:'Barlow',sans-serif;font-size:13px;font-weight:700;transition:background .2s;white-space:nowrap}
        .nb-search-btn:hover{background:#162447}
        .nb-nav{display:flex;align-items:center;gap:2px;flex-shrink:0}
        .nb-link{font-family:'Barlow',sans-serif;font-size:14px;font-weight:600;color:#4A5578;text-decoration:none;padding:8px 12px;border-radius:8px;transition:all .2s}
        .nb-link:hover,.nb-link.active{color:#0D1B3E;background:#EEF2FA}
        .nb-actions{display:flex;align-items:center;gap:8px;flex-shrink:0}
        .nb-icon-btn{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;text-decoration:none;border:1.5px solid #E8ECF4;background:#fff;cursor:pointer;color:#4A5578;transition:all .2s;position:relative}
        .nb-icon-btn:hover{border-color:#0D1B3E;color:#0D1B3E;background:#EEF2FA}
        .nb-badge{position:absolute;top:-7px;right:-7px;min-width:18px;height:18px;padding:0 4px;background:#D42B2B;color:#fff;font-size:10px;font-weight:800;border-radius:99px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;font-family:'Barlow',sans-serif}
        .nb-user-wrap{position:relative}
        .nb-user-btn{display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:10px;border:1.5px solid #E8ECF4;background:#fff;cursor:pointer;font-family:'Barlow',sans-serif;font-size:13px;font-weight:700;color:#0D1B3E;transition:all .2s}
        .nb-user-btn:hover,.nb-user-btn.open{border-color:#0D1B3E;background:#EEF2FA}
        .nb-avatar{width:26px;height:26px;border-radius:7px;background:linear-gradient(135deg,#0D1B3E,#1E3A6E);display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:800;font-family:'Barlow',sans-serif}
        .nb-dropdown{position:absolute;top:calc(100% + 8px);right:0;background:#fff;border-radius:12px;border:1.5px solid #E8ECF4;box-shadow:0 12px 40px rgba(13,27,62,0.14);min-width:200px;padding:8px;z-index:200;animation:dropIn .18s ease}
        @keyframes dropIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        .nb-dd-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;font-family:'Barlow',sans-serif;font-size:13px;font-weight:600;color:#4A5578;text-decoration:none;cursor:pointer;transition:all .15s;border:none;background:none;width:100%;text-align:left}
        .nb-dd-item:hover{background:#EEF2FA;color:#0D1B3E}
        .nb-dd-item.danger:hover{background:#F5E5E5;color:#D42B2B}
        .nb-dd-sep{height:1px;background:#E8ECF4;margin:4px 0}
        .nb-admin-btn{display:flex;align-items:center;gap:7px;padding:9px 16px;border-radius:10px;background:#D42B2B;color:#fff;font-family:'Barlow',sans-serif;font-size:13px;font-weight:700;text-decoration:none;transition:all .2s;border:none;cursor:pointer;box-shadow:0 3px 12px rgba(212,43,43,0.30);letter-spacing:.2px}
        .nb-admin-btn:hover{background:#B01F1F;transform:translateY(-1px)}
        .nb-catbar{background:linear-gradient(90deg,#0D1B3E 0%,#162447 50%,#0D1B3E 100%);border-top:2px solid #D42B2B}
        .nb-catbar-inner{max-width:1280px;margin:0 auto;padding:0 24px;display:flex;align-items:center;overflow-x:auto;scrollbar-width:none}
        .nb-catbar-inner::-webkit-scrollbar{display:none}
        .nb-cat{font-family:'Barlow',sans-serif;font-size:13px;font-weight:600;color:rgba(255,255,255,0.75);text-decoration:none;padding:11px 14px;border-bottom:3px solid transparent;white-space:nowrap;transition:all .2s}
        .nb-cat:hover{color:#fff;border-bottom-color:#D42B2B;background:rgba(255,255,255,0.06)}
        .nb-cat-sep{width:1px;height:18px;background:rgba(255,255,255,0.12);margin:0 2px;flex-shrink:0}
        .nb-free-badge{margin-left:auto;font-family:'Barlow',sans-serif;font-size:12px;font-weight:700;color:#F4A200;padding:8px 0;flex-shrink:0;white-space:nowrap}
      `}</style>

      {/* ── TOP BAR ── */}
      <div className="nb-topbar">
        <div className="nb-topbar-inner">
          <div style={{ display:'flex', alignItems:'center', gap:20 }}>
            <span className="nb-topbar-item">📍 Phnom Penh, Cambodia</span>
            <div className="nb-topbar-sep" />
            <span className="nb-topbar-item">📞 +855 12 345 678</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            {user ? (
              <>
                <span className="nb-topbar-item" style={{ color:'rgba(255,255,255,.85)' }}>
                  Welcome, <strong style={{ color:'#fff', marginLeft:4 }}>{user.name?.split(' ')[0] || user.email}</strong>
                  {ADMIN_ROLES.includes(user.role) && (
                    <span style={{ marginLeft:6, background:'rgba(212,43,43,0.3)', color:'#ff9999', fontSize:11, padding:'1px 7px', borderRadius:99, fontWeight:700 }}>
                      {user.role}
                    </span>
                  )}
                </span>
                <div className="nb-topbar-sep" />
                <button onClick={logoutUser} className="nb-topbar-link" style={{ background:'none', border:'none', cursor:'pointer' }}>Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nb-topbar-link">Sign In</Link>
                <div className="nb-topbar-sep" />
                <Link to="/register" className="nb-topbar-link">Create Account</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN HEADER ── */}
      <header className={`nb-header${scrolled ? ' scrolled' : ''}`}>
        <div className="nb-header-inner">

          {/* Logo */}
          <Link to="/" className="nb-logo">
            <AMSLogoMark size={44} />
            <div>
              <div className="nb-logo-name">AMS <span>Mart</span></div>
              <div className="nb-logo-tag">Supermarket</div>
            </div>
          </Link>

          {/* Search */}
          <form className="nb-search-form" onSubmit={handleSearch}>
            <input
              className="nb-search-input"
              placeholder="Search products, brands, categories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="nb-search-btn" type="submit">Search</button>
          </form>

          {/* Nav links */}
          <nav className="nb-nav">
            {[['/', 'Home'],['/shop','Shop'],['/about','About'],['/contact','Contact']].map(([to,label]) => (
              <Link key={to} to={to} className={`nb-link${location.pathname === to ? ' active' : ''}`}>{label}</Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="nb-actions">
            <Link to="/wishlist" className="nb-icon-btn" title="Wishlist">❤️</Link>
            <Link to="/cart" className="nb-icon-btn" title="Cart">
              🛒
              {cartCount > 0 && <span className="nb-badge">{cartCount}</span>}
            </Link>

            {user ? (
              <div className="nb-user-wrap">
                <button
                  className={`nb-user-btn${userOpen ? ' open' : ''}`}
                  onClick={() => setUserOpen(o => !o)}
                  onBlur={() => setTimeout(() => setUserOpen(false), 150)}
                >
                  <div className="nb-avatar">{(user.name || user.email)[0].toUpperCase()}</div>
                  {user.name?.split(' ')[0] || 'Account'}
                  <span style={{ fontSize:10 }}>▾</span>
                </button>
                {userOpen && (
                  <div className="nb-dropdown">
                    <Link to="/dashboard" className="nb-dd-item" onClick={() => setUserOpen(false)}>👤 My Dashboard</Link>
                    <Link to="/orders" className="nb-dd-item" onClick={() => setUserOpen(false)}>📦 My Orders</Link>
                    <Link to="/account" className="nb-dd-item" onClick={() => setUserOpen(false)}>⚙️ Account Settings</Link>
                    {ADMIN_ROLES.includes(user.role) && (
                      <>
                        <div className="nb-dd-sep" />
                        <Link to="/admin" className="nb-dd-item" style={{ color:'#D42B2B', fontWeight:700 }} onClick={() => setUserOpen(false)}>
                          🔧 Admin Panel
                        </Link>
                      </>
                    )}
                    <div className="nb-dd-sep" />
                    <button onClick={() => { logoutUser(); setUserOpen(false) }} className="nb-dd-item danger">
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" style={{ padding:'9px 18px', borderRadius:9, background:'#0D1B3E', color:'#fff', fontFamily:"'Barlow',sans-serif", fontSize:13, fontWeight:700, textDecoration:'none' }}>
                Sign In
              </Link>
            )}

            {user && ADMIN_ROLES.includes(user.role) && (
              <Link to="/admin" className="nb-admin-btn">⚙️ Admin</Link>
            )}
          </div>
        </div>

        {/* ── CATEGORY BAR ── */}
        <div className="nb-catbar">
          <div className="nb-catbar-inner">
            {(categories.length > 0 ? categories : []).map((cat, i, arr) => (
              <span key={cat.Category_ID} style={{ display:'flex', alignItems:'center' }}>
                <Link to={`/shop?cat=${encodeURIComponent(cat.Category_Name)}`} className="nb-cat">
                  {cat.Category_Name}
                </Link>
                {i < arr.length - 1 && <span className="nb-cat-sep" />}
              </span>
            ))}
            <span className="nb-free-badge">🚚 Free delivery over $50</span>
          </div>
        </div>
      </header>
    </>
  )
}
