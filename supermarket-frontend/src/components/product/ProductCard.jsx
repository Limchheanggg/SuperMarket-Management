import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

export default function ProductCard({ product }) {
  const { addItem }                                   = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [adding, setAdding]                           = useState(false)
  const [imgError, setImgError]                       = useState(false)

  const inWish      = isInWishlist(product.Product_ID)
  const isOutOfStock = Number(product.Current_Stock) === 0
  const hasDiscount  = product.old_price && product.old_price > product.Unit_Price
  const discount     = hasDiscount ? Math.round((1 - product.Unit_Price / product.old_price) * 100) : 0

  const handleWishlist = (e) => {
    e.preventDefault(); e.stopPropagation()
    if (inWish) removeFromWishlist(product.Product_ID)
    else addToWishlist(product)
  }

  const handleAddToCart = async () => {
    if (adding || isOutOfStock) return
    setAdding(true)
    addItem(product)
    setTimeout(() => setAdding(false), 800)
  }

  return (
    <div style={{ position:'relative' }}>
      <style>{`
        @keyframes cartPop { 0%{transform:scale(1)} 40%{transform:scale(1.12)} 70%{transform:scale(.95)} 100%{transform:scale(1)} }
        @keyframes heartPop { 0%{transform:scale(1)} 40%{transform:scale(1.3)} 100%{transform:scale(1)} }
        .pc-root {
          background:#fff; border:1px solid #f0f0f0; border-radius:18px;
          overflow:hidden; display:flex; flex-direction:column;
          transition:transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s, border-color .3s;
          position:relative; height:100%;
        }
        .pc-root:hover {
          transform:translateY(-8px) scale(1.01);
          box-shadow:0 20px 50px rgba(0,0,0,.12);
          border-color:#fca5a5;
        }
        .pc-root:hover .pc-img-wrap { background:#fff0f0; }
        .pc-root:hover .pc-img-wrap img { transform:scale(1.08); }
        .pc-root:hover .pc-overlay { opacity:1; }

        .pc-img-wrap {
          height:176px; display:flex; align-items:center; justify-content:center;
          background:#f9fafb; overflow:hidden; position:relative;
          transition:background .3s;
        }
        .pc-img-wrap img { width:100%; height:100%; object-fit:cover; transition:transform .4s; }

        .pc-no-img {
          display:flex; align-items:center; justify-content:center;
          width:100%; height:100%; background:linear-gradient(135deg,#f9fafb,#f3f4f6);
        }

        .pc-overlay {
          position:absolute; inset:0; background:rgba(192,39,45,.04);
          display:flex; align-items:center; justifyContent:center;
          opacity:0; transition:opacity .3s; pointer-events:none;
        }

        .pc-wish-btn {
          position:absolute; top:10px; right:10px; z-index:3;
          width:34px; height:34px; border-radius:50%; border:none;
          background:rgba(255,255,255,.95); cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 2px 10px rgba(0,0,0,.12); transition:all .2s;
          backdrop-filter:blur(4px);
        }
        .pc-wish-btn:hover { transform:scale(1.15); box-shadow:0 4px 16px rgba(0,0,0,.16); }
        .pc-wish-btn.active { background:#fee2e2; animation:heartPop .3s ease; }

        .pc-badge {
          position:absolute; top:10px; left:10px; z-index:3;
          font-size:10px; font-weight:800; padding:3px 10px; border-radius:99px;
          letter-spacing:.3px;
        }

        .pc-add-btn {
          width:100%; padding:11px; border:none; border-radius:10px;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:13px;
          font-weight:700; cursor:pointer; transition:all .25s;
          margin-top:auto;
        }
        .pc-add-btn.ready {
          background:linear-gradient(135deg,#c0272d,#e53935);
          color:#fff; box-shadow:0 4px 12px rgba(192,39,45,.3);
        }
        .pc-add-btn.ready:hover {
          box-shadow:0 6px 20px rgba(192,39,45,.45);
          transform:translateY(-1px);
        }
        .pc-add-btn.adding {
          background:linear-gradient(135deg,#15803d,#22c55e);
          color:#fff; animation:cartPop .4s ease;
        }
        .pc-add-btn.out {
          background:#f3f4f6; color:#9ca3af; cursor:not-allowed;
        }

        .pc-stock-bar {
          height:3px; border-radius:99px; background:#f0f0f0; margin-top:8px; overflow:hidden;
        }
        .pc-stock-fill {
          height:100%; border-radius:99px;
          background:linear-gradient(90deg,#c0272d,#f87171);
          transition:width .4s;
        }
      `}</style>

      <div className="pc-root">
        {/* Badges */}
        {discount > 0 && (
          <div className="pc-badge" style={{ background:'linear-gradient(135deg,#c0272d,#e53935)', color:'#fff' }}>
            -{discount}%
          </div>
        )}
        {product.Is_Perishable === 1 && !discount && (
          <div className="pc-badge" style={{ background:'linear-gradient(135deg,#15803d,#22c55e)', color:'#fff' }}>
            Fresh
          </div>
        )}

        {/* Wishlist */}
        <button className={`pc-wish-btn${inWish?' active':''}`} onClick={handleWishlist}
          style={{ animation: inWish ? 'heartPop .3s ease' : 'none' }}>
          <svg width="15" height="15" viewBox="0 0 24 24"
            fill={inWish ? '#ef4444' : 'none'}
            stroke={inWish ? '#ef4444' : '#9ca3af'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Image */}
        <Link to={`/shop/${product.Product_ID}`} className="pc-img-wrap">
          {product.Product_Image && !imgError
            ? <img src={product.Product_Image} alt={product.Name}
                onError={() => setImgError(true)}/>
            : <div className="pc-no-img">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="1">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
          }
          <div className="pc-overlay"/>
        </Link>

        {/* Info */}
        <div style={{ padding:'14px 16px 16px', display:'flex', flexDirection:'column', flex:1, gap:4 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'#c0272d',
            textTransform:'uppercase', letterSpacing:1.2, marginBottom:2 }}>
            {product.Category_Name}
          </div>

          <Link to={`/shop/${product.Product_ID}`}
            style={{ fontSize:14, fontWeight:700, color:'#111827', textDecoration:'none',
              lineHeight:1.35, display:'-webkit-box', WebkitLineClamp:2,
              WebkitBoxOrient:'vertical', overflow:'hidden' }}>
            {product.Name}
          </Link>

          <div style={{ fontSize:11, color:'#9ca3af', fontWeight:500 }}>
            {product.Unit} · {product.Brand || 'Local Brand'}
          </div>

          {/* Price row */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
            <strong style={{ fontSize:18, fontWeight:900, color:'#c0272d',
              fontFamily:"'Playfair Display',serif" }}>
              ${Number(product.Unit_Price).toFixed(2)}
            </strong>
            {hasDiscount && (
              <del style={{ fontSize:12, color:'#d1d5db' }}>
                ${Number(product.old_price).toFixed(2)}
              </del>
            )}
            {product.Current_Stock <= 10 && product.Current_Stock > 0 && (
              <span style={{ marginLeft:'auto', fontSize:10, fontWeight:700,
                color:'#f97316', background:'#fff7ed', borderRadius:99, padding:'2px 8px' }}>
                Low stock
              </span>
            )}
          </div>

          {/* Stock bar */}
          {product.Current_Stock !== undefined && (
            <div className="pc-stock-bar">
              <div className="pc-stock-fill" style={{
                width:`${Math.min(100, (product.Current_Stock / (product.Reorder_Level * 3 || 30)) * 100)}%`
              }}/>
            </div>
          )}

          {/* Add to cart */}
          <button
            className={`pc-add-btn ${isOutOfStock ? 'out' : adding ? 'adding' : 'ready'}`}
            onClick={handleAddToCart}
            style={{ marginTop:12 }}>
            {isOutOfStock ? 'Out of Stock' : adding ? 'Added!' : '+ Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
