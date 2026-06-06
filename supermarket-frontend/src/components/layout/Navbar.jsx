import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { getCategories } from '../../services/api'

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)
const CartIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
)
const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)
const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const ChevronDown = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
)
const AdminIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
  </svg>
)
const OrderIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
)
const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)
const MapPinIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const PhoneIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.65 4.36 2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.61a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)

// AMS Logo Mark — perfectly balanced bars
const AMSMark = ({ size = 44 }) => {
  const bw  = Math.round(size * 0.16)   // all bars same width
  const bh1 = Math.round(size * 0.55)   // left bar height
  const bh2 = Math.round(size * 0.30)   // middle bar height (red, shortest)
  const bh3 = Math.round(size * 0.55)   // right bar height (tallest)
  const gap = Math.round(size * 0.075)
  const px  = Math.round(size * 0.16)
  const pb  = Math.round(size * 0.20)
  const br  = `${Math.round(size * 0.045)}px ${Math.round(size * 0.045)}px 1px 1px`
  const lineH = Math.round(size * 0.048)
  const lineB = Math.round(size * 0.09)
  return (
    <div style={{
      width: size, height: size,
      borderRadius: Math.round(size * 0.22),
      background: 'linear-gradient(160deg,#1e2472 0%,#0d1240 100%)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      padding: `0 ${px}px ${pb}px`,
      gap: gap, flexShrink: 0,
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 4px 18px rgba(13,18,64,0.55)',
    }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'44%', background:'linear-gradient(180deg,rgba(255,255,255,0.12),transparent)', pointerEvents:'none' }} />
      <div style={{ width:bw, height:bh1, borderRadius:br, background:'rgba(255,255,255,0.93)', flexShrink:0, position:'relative', zIndex:1 }} />
      <div style={{ width:bw, height:bh2, borderRadius:br, background:'#c0272d',              flexShrink:0, position:'relative', zIndex:1 }} />
      <div style={{ width:bw, height:bh3, borderRadius:br, background:'rgba(255,255,255,0.93)', flexShrink:0, position:'relative', zIndex:1 }} />
      <div style={{ position:'absolute', bottom:lineB, left:px, right:px, height:lineH, background:'#c0272d', borderRadius:99, zIndex:1 }} />
    </div>
  )
}

const ADMIN_ROLES = ['admin', 'manager']

export default function Navbar() {
  const { totalItems, totalQty } = useCart()
  const { user, logoutUser }     = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()
  const [search,     setSearch]     = useState('')
  const [scrolled,   setScrolled]   = useState(false)
  const [categories, setCategories] = useState([])
  const [userOpen,   setUserOpen]   = useState(false)

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
        .nb-topbar { background:#0d1240; padding:7px 0; border-bottom:1px solid rgba(255,255,255,.06); }
        .nb-topbar-inner { max-width:1280px; margin:0 auto; padding:0 24px; display:flex; justify-content:space-between; align-items:center; }
        .nb-top-left { display:flex; align-items:center; gap:18px; }
        .nb-top-item { display:flex; align-items:center; gap:5px; font-family:'Barlow',sans-serif; font-size:12px; color:rgba(255,255,255,0.55); }
        .nb-top-sep { width:1px; height:11px; background:rgba(255,255,255,0.15); }
        .nb-top-right { display:flex; align-items:center; gap:14px; }
        .nb-top-link { font-family:'Barlow',sans-serif; font-size:12px; color:rgba(255,255,255,0.65); text-decoration:none; transition:color .18s; background:none; border:none; cursor:pointer; }
        .nb-top-link:hover { color:#fff; }
        .nb-top-user { color:rgba(255,255,255,0.85); font-size:12px; font-family:'Barlow',sans-serif; }
        .nb-top-role { margin-left:6px; background:rgba(192,39,45,0.35); color:#ff9999; font-size:10px; padding:1px 7px; border-radius:99px; font-weight:700; }

        /* Main header */
        .nb-header { position:sticky; top:0; z-index:100; background:#fff; border-bottom:2px solid #e8ecf4; transition:box-shadow .3s; }
        .nb-header.scrolled { box-shadow:0 4px 28px rgba(13,27,62,0.10); }
        .nb-header-inner { max-width:1280px; margin:0 auto; padding:0 24px; height:60px; display:flex; align-items:center; gap:22px; }

        /* Logo */
        .nb-logo { text-decoration:none; display:flex; align-items:center; gap:11px; flex-shrink:0; align-items:center; }
        .nb-logo-text { display:flex; flex-direction:column; }
        .nb-logo-name { font-family:'Barlow Condensed',sans-serif; font-size:23px; font-weight:900; color:#0d1240; letter-spacing:-.3px; line-height:1.1; }
        .nb-logo-name span { color:#c0272d; }
        .nb-logo-sub { font-family:'Barlow',sans-serif; font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#8896b3; }

        /* Search */
        .nb-search { flex:1; max-width:500px; }
        .nb-search-form { display:flex; background:#f4f6f9; border-radius:10px; border:1.5px solid #e8ecf4; overflow:hidden; transition:all .22s; }
        .nb-search-form:focus-within { border-color:#0d1240; background:#fff; box-shadow:0 0 0 3px rgba(13,27,62,0.08); }
        .nb-search-input { flex:1; border:none; background:transparent; padding:11px 15px; font-family:'Barlow',sans-serif; font-size:14px; color:#1e2545; outline:none; }
        .nb-search-input::placeholder { color:#8896b3; }
        .nb-search-btn { background:#0d1240; color:#fff; border:none; padding:0 20px; cursor:pointer; display:flex; align-items:center; gap:6px; font-family:'Barlow',sans-serif; font-size:13px; font-weight:700; transition:background .2s; white-space:nowrap; }
        .nb-search-btn:hover { background:#162447; }

        /* Nav */
        .nb-nav { display:flex; align-items:center; gap:1px; flex-shrink:0; }
        .nb-nav-link { font-family:'Barlow',sans-serif; font-size:14px; font-weight:600; color:#4a5578; text-decoration:none; padding:8px 12px; border-radius:8px; transition:all .18s; }
        .nb-nav-link:hover, .nb-nav-link.active { color:#0d1240; background:#eef2fa; }

        /* Actions */
        .nb-actions { display:flex; align-items:center; gap:7px; flex-shrink:0; }
        .nb-icon-btn { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; text-decoration:none; border:1.5px solid #e8ecf4; background:#fff; cursor:pointer; color:#4a5578; transition:all .18s; position:relative; }
        .nb-icon-btn:hover { border-color:#0d1240; color:#0d1240; background:#eef2fa; }
        .nb-cart-badge { position:absolute; top:-7px; right:-7px; min-width:18px; height:18px; padding:0 4px; background:#c0272d; color:#fff; font-size:10px; font-weight:800; border-radius:99px; display:flex; align-items:center; justify-content:center; border:2px solid #fff; font-family:'Barlow',sans-serif; }

        /* User dropdown */
        .nb-user-wrap { position:relative; }
        .nb-user-btn { display:flex; align-items:center; gap:8px; padding:8px 14px; border-radius:10px; border:1.5px solid #e8ecf4; background:#fff; cursor:pointer; font-family:'Barlow',sans-serif; font-size:13px; font-weight:700; color:#0d1240; transition:all .18s; }
        .nb-user-btn:hover, .nb-user-btn.open { border-color:#0d1240; background:#eef2fa; }
        .nb-avatar { width:26px; height:26px; border-radius:7px; background:linear-gradient(135deg,#0d1240,#1e3a6e); display:flex; align-items:center; justify-content:center; color:#fff; font-size:11px; font-weight:800; flex-shrink:0; }
        .nb-dropdown { position:absolute; top:calc(100% + 8px); right:0; background:#fff; border-radius:12px; border:1.5px solid #e8ecf4; box-shadow:0 12px 40px rgba(13,27,62,0.14); min-width:200px; padding:8px; z-index:200; animation:dropIn .16s ease; }
        @keyframes dropIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        .nb-dd-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:8px; font-family:'Barlow',sans-serif; font-size:13px; font-weight:600; color:#4a5578; text-decoration:none; transition:all .15s; border:none; background:none; width:100%; text-align:left; cursor:pointer; }
        .nb-dd-item:hover { background:#eef2fa; color:#0d1240; }
        .nb-dd-item.red:hover { background:#f5e5e5; color:#c0272d; }
        .nb-dd-sep { height:1px; background:#e8ecf4; margin:4px 0; }

        /* Admin button */
        .nb-admin-btn { display:flex; align-items:center; gap:7px; padding:9px 16px; border-radius:10px; background:#c0272d; color:#fff; font-family:'Barlow',sans-serif; font-size:13px; font-weight:700; text-decoration:none; transition:all .2s; border:none; cursor:pointer; box-shadow:0 3px 12px rgba(192,39,45,0.30); letter-spacing:.2px; flex-shrink:0; }
        .nb-admin-btn:hover { background:#a01f24; transform:translateY(-1px); box-shadow:0 6px 18px rgba(192,39,45,0.38); }

        /* Category bar */
      `}</style>

      {/* ── TOP BAR ── */}
      <div className="nb-topbar">
        <div className="nb-topbar-inner">
          <div className="nb-top-left">
            <span className="nb-top-item">
              <MapPinIcon /> Phnom Penh, Cambodia
            </span>
            <div className="nb-top-sep" />
            <span className="nb-top-item">
              <PhoneIcon /> +855 12 345 678
            </span>
          </div>
          <div className="nb-top-right">
            {user ? (
              <>
                <span className="nb-top-user">
                  Welcome, <strong style={{ color:'#fff' }}>{user.name?.split(' ')[0] || user.email}</strong>
                  {ADMIN_ROLES.includes(user.role) && <span className="nb-top-role">{user.role}</span>}
                </span>
                <div className="nb-top-sep" />
                <button onClick={logoutUser} className="nb-top-link">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login"    className="nb-top-link">Sign In</Link>
                <div className="nb-top-sep" />
                <Link to="/register" className="nb-top-link">Create Account</Link>
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
            <AMSMark size={44} />
            <div className="nb-logo-text">
              <div className="nb-logo-name">AMS <span>Mart</span></div>
              <div className="nb-logo-sub">Supermarket</div>
            </div>
          </Link>

          {/* Search */}
          <div className="nb-search">
            <form className="nb-search-form" onSubmit={handleSearch}>
              <input
                className="nb-search-input"
                placeholder="Search products, brands, categories..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className="nb-search-btn" type="submit">
                <SearchIcon /> Search
              </button>
            </form>
          </div>

          {/* Nav Links */}
          <nav className="nb-nav">
            {[['/', 'Home'],['/shop','Shop'],['/about','About'],['/contact','Contact']].map(([to, label]) => (
              <Link key={to} to={to} className={`nb-nav-link${location.pathname === to ? ' active' : ''}`}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="nb-actions">
            <Link to="/wishlist" className="nb-icon-btn" title="Wishlist">
              <HeartIcon />
            </Link>
            <Link to="/cart" className="nb-icon-btn" title="Cart">
              <CartIcon />
              {cartCount > 0 && <span className="nb-cart-badge">{cartCount}</span>}
            </Link>

            {user ? (
              <div className="nb-user-wrap">
                <button
                  className={`nb-user-btn${userOpen ? ' open' : ''}`}
                  onClick={() => setUserOpen(o => !o)}
                  onBlur={() => setTimeout(() => setUserOpen(false), 160)}
                >
                  <div className="nb-avatar">{(user.name || user.email)[0].toUpperCase()}</div>
                  {user.name?.split(' ')[0] || 'Account'}
                  <ChevronDown />
                </button>
                {userOpen && (
                  <div className="nb-dropdown">
                    <Link to="/dashboard" className="nb-dd-item" onClick={() => setUserOpen(false)}>
                      <UserIcon /> My Dashboard
                    </Link>
                    <Link to="/orders" className="nb-dd-item" onClick={() => setUserOpen(false)}>
                      <OrderIcon /> My Orders
                    </Link>
                    <Link to="/account" className="nb-dd-item" onClick={() => setUserOpen(false)}>
                      <AdminIcon /> Account Settings
                    </Link>
                    {ADMIN_ROLES.includes(user.role) && (
                      <>
                        <div className="nb-dd-sep" />
                        <Link to="/admin" className="nb-dd-item" style={{ color:'#c0272d', fontWeight:700 }} onClick={() => setUserOpen(false)}>
                          <AdminIcon /> Admin Panel
                        </Link>
                      </>
                    )}
                    <div className="nb-dd-sep" />
                    <button onClick={() => { logoutUser(); setUserOpen(false) }} className="nb-dd-item red">
                      <LogoutIcon /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" style={{ padding:'9px 18px', borderRadius:10, background:'#0d1240', color:'#fff', fontFamily:"'Barlow',sans-serif", fontSize:13, fontWeight:700, textDecoration:'none', transition:'all .2s', whiteSpace:'nowrap' }}>
                Sign In
              </Link>
            )}

            {user && ADMIN_ROLES.includes(user.role) && (
              <Link to="/admin" className="nb-admin-btn">
                <AdminIcon /> Admin Panel
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
