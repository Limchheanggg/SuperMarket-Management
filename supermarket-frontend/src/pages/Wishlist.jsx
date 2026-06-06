import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function Wishlist() {
  const { addItem } = useCart()
  const { wishlist, removeFromWishlist, setWishlist } = useWishlist()

  const moveToCart = (p) => { addItem(p); removeFromWishlist(p.Product_ID) }

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#f4f6fa', minHeight:'100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        .wish-card { background:#fff; border-radius:18px; overflow:hidden; border:1px solid rgba(0,0,0,.06); transition:transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .3s; }
        .wish-card:hover { transform:translateY(-8px); box-shadow:0 20px 50px rgba(0,0,0,.12); }
        .wish-card:hover .wish-img img { transform:scale(1.06); }
        .wish-img { height:180px; background:#f9fafb; display:flex; align-items:center; justify-content:center; overflow:hidden; position:relative; }
        .wish-img img { width:100%; height:100%; object-fit:cover; transition:transform .4s; }
        .move-btn { width:100%; padding:11px; border:none; border-radius:10px; background:linear-gradient(135deg,#c0272d,#e53935); color:#fff; font-weight:700; font-size:13px; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .25s; }
        .move-btn:hover { opacity:.9; transform:translateY(-1px); }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ background:'#fff', borderBottom:'1px solid #eee', padding:'12px 0' }}>
        <div className="container">
          <span style={{ fontSize:13, color:'#9ca3af' }}>
            <Link to="/" style={{ color:'#9ca3af', textDecoration:'none' }}>Home</Link> ›{' '}
            <strong style={{ color:'#111827' }}>Wishlist</strong>
          </span>
        </div>
      </div>

      {/* Dark header */}
      <div style={{ background:'linear-gradient(135deg,#1a0505,#2d0b0b 40%,#0d1240)', padding:'28px 0' }}>
        <div className="container" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:900, color:'#fff', margin:0 }}>
              My Wishlist
            </h1>
            <p style={{ color:'rgba(255,255,255,.5)', fontSize:14, margin:'6px 0 0' }}>
              {wishlist.length} saved {wishlist.length===1?'item':'items'}
            </p>
          </div>
          {wishlist.length > 0 && (
            <button onClick={()=>{ setWishlist([]); localStorage.setItem('wishlist','[]') }}
              style={{ padding:'10px 20px', borderRadius:10, border:'1px solid rgba(255,255,255,.2)',
                background:'rgba(255,255,255,.08)', color:'rgba(255,255,255,.7)',
                fontWeight:600, fontSize:13, cursor:'pointer' }}>
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="container" style={{ padding:'28px 24px' }}>
        {wishlist.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px', background:'#fff',
            borderRadius:20, boxShadow:'0 4px 24px rgba(0,0,0,.06)', animation:'fadeUp .5s ease' }}>
            <div style={{ width:80, height:80, borderRadius:'50%', background:'#fff0f0',
              display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, marginBottom:8 }}>Your wishlist is empty</h2>
            <p style={{ color:'#9ca3af', marginBottom:28 }}>Save your favourite products here!</p>
            <Link to="/shop" style={{ padding:'13px 32px', background:'linear-gradient(135deg,#c0272d,#e53935)',
              color:'#fff', borderRadius:12, textDecoration:'none', fontWeight:700, fontSize:15 }}>
              Browse Products
            </Link>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:20 }}>
            {wishlist.map((p,i) => (
              <div key={p.Product_ID} className="wish-card"
                style={{ animation:`scaleIn .4s ease ${i*.05}s both` }}>
                <div className="wish-img">
                  {p.Product_Image
                    ? <img src={p.Product_Image} alt={p.Name}/>
                    : <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="1"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                  }
                  <button onClick={()=>removeFromWishlist(p.Product_ID)}
                    style={{ position:'absolute', top:8, right:8, width:28, height:28, borderRadius:'50%',
                      border:'none', background:'rgba(255,255,255,.95)', cursor:'pointer',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      boxShadow:'0 2px 8px rgba(0,0,0,.12)' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <div style={{ padding:'14px 16px' }}>
                  <div style={{ fontSize:10, fontWeight:800, color:'#c0272d',
                    textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>{p.Category_Name}</div>
                  <Link to={`/shop/${p.Product_ID}`} style={{ fontSize:14, fontWeight:700, color:'#0f172a',
                    textDecoration:'none', display:'block', marginBottom:4, lineHeight:1.3,
                    display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                    {p.Name}
                  </Link>
                  <div style={{ fontSize:11, color:'#94a3b8', marginBottom:10 }}>{p.Unit} · {p.Brand}</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:900,
                    color:'#c0272d', marginBottom:12 }}>${Number(p.Unit_Price).toFixed(2)}</div>
                  <button className="move-btn" onClick={()=>moveToCart(p)}>Move to Cart</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
