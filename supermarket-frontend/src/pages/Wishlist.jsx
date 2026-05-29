import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const EMOJIS = {
  Produce:'🥬', Dairy:'🥛', Meat:'🥩', Bakery:'🍞', Beverages:'🧴',
  Snacks:'🍿', Frozen:'🧊', 'Fruits & Vegetables':'🍎', 'Meat & Seafood':'🥩',
  'Canned Goods':'🥫', 'Personal Care':'💊', Household:'🧹', 'Frozen Foods':'🧊',
}

export default function Wishlist() {
  const { addItem } = useCart()
  // Use the SAME context as ProductCard — stays in sync automatically
  const { wishlist, removeFromWishlist, setWishlist } = useWishlist()

  const moveToCart = (product) => {
    addItem(product)
    removeFromWishlist(product.Product_ID)
  }

  return (
    <div className="page-enter">
      <div style={{ background:'#fff', borderBottom:'1px solid #e5e7eb', padding:'12px 0' }}>
        <div className="container">
          <span style={{ fontSize:13, color:'#6b7280', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
            🏠 Home › <strong style={{ color:'#111827' }}>Wishlist</strong>
          </span>
        </div>
      </div>

      <div className="container" style={{ padding:'36px 24px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:26, fontWeight:800, color:'#111827' }}>
            ❤️ My Wishlist <span style={{ fontSize:16, color:'#6b7280', fontWeight:500 }}>({wishlist.length} items)</span>
          </h2>
          {wishlist.length > 0 && (
            <button onClick={() => { setWishlist([]); localStorage.setItem('wishlist', '[]') }}
              style={{ padding:'8px 16px', borderRadius:8, border:'1.5px solid #fecaca', background:'#fef2f2', color:'#dc2626', fontWeight:700, fontSize:13, cursor:'pointer' }}>
              Clear All
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px', background:'#fff', borderRadius:18, border:'1.5px solid #e5e7eb' }}>
            <div style={{ fontSize:72, marginBottom:16 }}>💔</div>
            <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, fontWeight:700, marginBottom:8 }}>Your wishlist is empty</h3>
            <p style={{ color:'#6b7280', marginBottom:24 }}>Save your favourite products here!</p>
            <Link to="/shop" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:20 }}>
            {wishlist.map(p => (
              <div key={p.Product_ID} style={{ background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:16, overflow:'hidden', transition:'all .25s', position:'relative' }}
                onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,.10)'; e.currentTarget.style.borderColor='#16a34a'; e.currentTarget.style.transform='translateY(-3px)' }}
                onMouseLeave={e=>{ e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.transform='none' }}>
                {/* Remove button */}
                <button onClick={() => removeFromWishlist(p.Product_ID)}
                  style={{ position:'absolute', top:8, right:8, zIndex:2, background:'#fee2e2', border:'none', borderRadius:'50%', width:28, height:28, cursor:'pointer', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', color:'#dc2626' }}>
                  ✕
                </button>
                <Link to={`/shop/${p.Product_ID}`} style={{ display:'flex', height:160, background:'#f0fdf4', alignItems:'center', justifyContent:'center', fontSize:64, textDecoration:'none' }}>
                  {p.Product_Image
                    ? <img src={p.Product_Image} alt={p.Name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    : (EMOJIS[p.Category_Name] || '🛒')
                  }
                </Link>
                <div style={{ padding:'14px 15px' }}>
                  <div style={{ fontSize:11, color:'#16a34a', fontWeight:700, textTransform:'uppercase', letterSpacing:.5, marginBottom:4 }}>{p.Category_Name}</div>
                  <Link to={`/shop/${p.Product_ID}`} style={{ fontSize:14, fontWeight:700, color:'#111827', marginBottom:6, display:'block', textDecoration:'none' }}>{p.Name}</Link>
                  <div style={{ fontSize:12, color:'#6b7280', marginBottom:10 }}>{p.Unit} · {p.Brand}</div>
                  <div style={{ fontSize:18, fontWeight:700, color:'#16a34a', marginBottom:12 }}>${Number(p.Unit_Price).toFixed(2)}</div>
                  <button onClick={() => moveToCart(p)}
                    style={{ width:'100%', background:'linear-gradient(135deg,#15803d,#22c55e)', color:'#fff', border:'none', borderRadius:8, padding:'9px', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                    🛒 Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
