import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { getCategories } from '../../services/api'

export default function Navbar() {
  const { totalItems, totalQty } = useCart()
  const { user, logoutUser } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [search, setSearch]         = useState('')
  const [scrolled, setScrolled]     = useState(false)
  const [focused, setFocused]       = useState(false)
  const [categories, setCategories] = useState([])
  const ADMIN_ROLES = ['admin', 'manager']

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    getCategories().then(res => setCategories(res.data || [])).catch(() => setCategories([]))
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/shop?search=${encodeURIComponent(search.trim())}`)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box}
        .nb-link{font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:600;color:#374151;text-decoration:none;padding:7px 14px;border-radius:8px;transition:all .2s}
        .nb-link:hover,.nb-link.active{color:#1a1f5e;background:#eef0fa}
        .nb-search{display:flex;align-items:center;flex:1;max-width:480px;background:#f3f4f6;border:2px solid #e5e7eb;border-radius:12px;overflow:hidden;transition:all .25s}
        .nb-search.on{border-color:#1a1f5e;background:#fff;box-shadow:0 0 0 4px rgba(26,31,94,.08)}
        .nb-search input{flex:1;border:none;background:transparent;padding:11px 14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;color:#111;outline:none}
        .nb-search input::placeholder{color:#9ca3af}
        .nb-search button{background:linear-gradient(135deg,#1a1f5e,#2d3491);color:#fff;border:none;padding:11px 22px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:13px;cursor:pointer;white-space:nowrap;transition:opacity .2s}
        .nb-search button:hover{opacity:.9}
        .nb-icon{width:42px;height:42px;border-radius:11px;display:flex;align-items:center;justify-content:center;text-decoration:none;transition:transform .2s,box-shadow .2s;position:relative;border:1.5px solid #e5e7eb;background:#fff}
        .nb-icon:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.1)}
        .nb-badge{position:absolute;top:-7px;right:-7px;min-width:18px;height:18px;padding:0 4px;background:#c0272d;color:#fff;font-size:10px;font-weight:800;border-radius:99px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;font-family:'Plus Jakarta Sans',sans-serif}
        .nb-loginbtn{padding:9px 22px;border-radius:10px;background:linear-gradient(135deg,#1a1f5e,#2d3491);color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;text-decoration:none;transition:all .2s;box-shadow:0 2px 8px rgba(26,31,94,.25)}
        .nb-loginbtn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(26,31,94,.35)}
        .nb-acct{display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:10px;background:#eef0fa;border:1.5px solid #c7caee;text-decoration:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;color:#1a1f5e;transition:all .2s}
        .nb-acct:hover{background:#dde0f5;transform:translateY(-1px)}
        .nb-admin{padding:8px 14px;border-radius:10px;background:linear-gradient(135deg,#c0272d,#e53935);color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:700;text-decoration:none;transition:all .2s;letter-spacing:.3px}
        .nb-admin:hover{opacity:.9;transform:translateY(-1px)}
        .nb-cat{font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:600;color:rgba(255,255,255,.82);text-decoration:none;padding:10px 13px;border-radius:6px;transition:background .2s;white-space:nowrap}
        .nb-cat:hover{background:rgba(255,255,255,.12);color:#fff}
        .nb-catbar{overflow-x:auto;scrollbar-width:none}
        .nb-catbar::-webkit-scrollbar{display:none}
      `}</style>

      {/* TOP BAR */}
      <div style={{background:'#1a1f5e',padding:'7px 0'}}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'0 24px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:'rgba(255,255,255,.65)',letterSpacing:.3}}>
            Phnom Penh, Cambodia &nbsp;|&nbsp; +855 12 345 678
          </span>
          <div style={{display:'flex',gap:20,alignItems:'center'}}>
            {user ? (
              <>
                <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:'rgba(255,255,255,.8)'}}>
                  {user.name?.split(' ')[0] || user.email}
                  {ADMIN_ROLES.includes(user.role) && (
                    <span style={{marginLeft:7,background:'rgba(192,39,45,.35)',padding:'1px 8px',borderRadius:99,fontSize:11,color:'#fca5a5'}}>
                      {user.role}
                    </span>
                  )}
                </span>
                <button onClick={logoutUser} style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:'rgba(255,255,255,.6)',background:'none',border:'none',cursor:'pointer',letterSpacing:.2}}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:'rgba(255,255,255,.75)',textDecoration:'none'}}>Sign In</Link>
                <span style={{color:'rgba(255,255,255,.25)'}}>|</span>
                <Link to="/register" style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:'rgba(255,255,255,.75)',textDecoration:'none'}}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <header style={{position:'sticky',top:0,zIndex:100,background:scrolled?'rgba(255,255,255,.97)':'#fff',backdropFilter:scrolled?'blur(16px)':'none',borderBottom:'1px solid #e5e7eb',boxShadow:scrolled?'0 4px 24px rgba(0,0,0,.07)':'none',transition:'all .3s'}}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'0 24px',height:70,display:'flex',alignItems:'center',gap:20}}>

          {/* AMS Mart Logo */}
          <Link to="/" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:11,flexShrink:0}}>
            <div style={{width:42,height:42,borderRadius:12,background:'linear-gradient(135deg,#1a1f5e,#2d3491)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 14px rgba(26,31,94,.35)',flexShrink:0}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="4" height="18" rx="1" fill="white" opacity=".9"/>
                <rect x="10" y="8" width="4" height="13" rx="1" fill="#c0272d"/>
                <rect x="17" y="1" width="4" height="20" rx="1" fill="white" opacity=".9"/>
                <rect x="2" y="21" width="20" height="1.5" rx=".75" fill="#c0272d"/>
              </svg>
            </div>
            <div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:20,lineHeight:1.1,letterSpacing:-.3}}>
                <span style={{color:'#1a1f5e'}}>AMS</span><span style={{color:'#c0272d'}}> Mart</span>
              </div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:'#9ca3af',fontWeight:600,letterSpacing:2,textTransform:'uppercase'}}>Supermarket</div>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} style={{flex:1,maxWidth:480}}>
            <div className={`nb-search${focused?' on':''}`}>
              <svg style={{marginLeft:14,flexShrink:0}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input
                placeholder="Search products..."
                value={search}
                onChange={e=>setSearch(e.target.value)}
                onFocus={()=>setFocused(true)}
                onBlur={()=>setFocused(false)}
              />
              <button type="submit">Search</button>
            </div>
          </form>

          {/* Nav Links */}
          <nav style={{display:'flex',alignItems:'center',gap:2,flexShrink:0}}>
            {[['/', 'Home'],['/shop','Shop'],['/about','About'],['/contact','Contact'],['/faq','FAQ']].map(([to,label])=>(
              <Link key={to} to={to} className={`nb-link${location.pathname===to?' active':''}`}>{label}</Link>
            ))}
          </nav>

          {/* Actions */}
          <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
            {/* Wishlist */}
            <Link to="/wishlist" className="nb-icon" title="Wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="nb-icon" title="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {(totalQty||totalItems)>0 && <span className="nb-badge">{totalQty||totalItems}</span>}
            </Link>

            {user ? (
              <div style={{display:'flex',gap:7,alignItems:'center'}}>
                <Link to="/dashboard" className="nb-acct">
                  <div style={{width:24,height:24,borderRadius:7,background:'linear-gradient(135deg,#1a1f5e,#2d3491)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:11,fontWeight:800}}>
                    {(user.name||user.email)[0].toUpperCase()}
                  </div>
                  {user.name?.split(' ')[0]||'Account'}
                </Link>
                {ADMIN_ROLES.includes(user.role) && (
                  <Link to="/admin" className="nb-admin">Admin Panel</Link>
                )}
              </div>
            ) : (
              <Link to="/login" className="nb-loginbtn">Login</Link>
            )}
          </div>
        </div>

        {/* CATEGORY BAR */}
        <div style={{background:'linear-gradient(90deg,#1a1f5e,#2d3491,#1a1f5e)'}}>
          <div className="nb-catbar" style={{maxWidth:1280,margin:'0 auto',padding:'0 24px',display:'flex',alignItems:'center',gap:2}}>
            {(categories.length > 0 ? categories : ['Produce','Dairy','Meat','Bakery','Beverages','Snacks']).map(cat => {
              const name = cat.Category_Name || cat
              return (
                <Link key={cat.Category_ID||cat} to={`/shop?cat=${encodeURIComponent(name)}`} className="nb-cat">
                  {name}
                </Link>
              )
            })}
            <div style={{marginLeft:'auto',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:'rgba(255,255,255,.55)',padding:'10px 0',whiteSpace:'nowrap',flexShrink:0,letterSpacing:.3}}>
              Free shipping over $50
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
