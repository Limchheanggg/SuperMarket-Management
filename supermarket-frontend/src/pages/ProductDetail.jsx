import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct } from '../services/api'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id }    = useParams()
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty,     setQty]     = useState(1)
  const [tab,     setTab]     = useState('description')
  const [adding,  setAdding]  = useState(false)
  const [imgError,setImgError]= useState(false)

  useEffect(() => {
    setLoading(true); setQty(1); setImgError(false)
    getProduct(id)
      .then(res => setProduct(res.data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'70vh',
      background:'#f4f6fa' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:48, height:48, border:'3px solid #f0f0f0',
          borderTopColor:'#c0272d', borderRadius:'50%',
          animation:'spin 1s linear infinite', margin:'0 auto 16px' }}/>
        <p style={{ color:'#9ca3af', fontSize:14 }}>Loading product…</p>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (!product) return (
    <div style={{ textAlign:'center', padding:'80px 20px', background:'#f4f6fa', minHeight:'70vh',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:80, height:80, borderRadius:'50%', background:'#fff',
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:'0 4px 24px rgba(0,0,0,.08)', marginBottom:20 }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, marginBottom:8 }}>Product not found</h2>
      <Link to="/shop" style={{ marginTop:16, padding:'12px 28px',
        background:'linear-gradient(135deg,#c0272d,#e53935)', color:'#fff',
        borderRadius:12, textDecoration:'none', fontWeight:700, fontSize:14 }}>
        Back to Shop
      </Link>
    </div>
  )

  const inWish      = isInWishlist(product.Product_ID)
  const isOutOfStock = Number(product.Current_Stock) === 0

  const handleAddToCart = () => {
    if (isOutOfStock || adding) return
    setAdding(true)
    addItem(product, qty)
    toast.success(`${qty}× ${product.Name} added to cart!`)
    setTimeout(() => setAdding(false), 900)
  }

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#f4f6fa', minHeight:'100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet"/>

      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeLeft { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeRight{ from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes cartBounce{ 0%{transform:scale(1)} 30%{transform:scale(1.08)} 60%{transform:scale(.96)} 100%{transform:scale(1)} }
        @keyframes heartPop { 0%{transform:scale(1)} 40%{transform:scale(1.3)} 100%{transform:scale(1)} }
        @keyframes shimmer  { from{background-position:200% center} to{background-position:-200% center} }

        .qty-btn {
          width:42px; height:42px; border-radius:10px;
          border:1.5px solid #e5e7eb; background:#fff; cursor:pointer;
          font-size:20px; font-weight:700; display:flex; align-items:center;
          justify-content:center; transition:all .2s; color:#374151;
        }
        .qty-btn:hover { background:#fff0f0; border-color:#fca5a5; color:#c0272d; }

        .tab-btn {
          padding:14px 24px; border:none; background:transparent; cursor:pointer;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:14px;
          font-weight:600; color:#9ca3af; border-bottom:2px solid transparent;
          transition:all .25s; white-space:nowrap;
        }
        .tab-btn:hover { color:#c0272d; }
        .tab-btn.active { color:#c0272d; border-bottom-color:#c0272d; }

        .meta-row {
          display:flex; justify-content:space-between; align-items:center;
          padding:11px 0; border-bottom:1px solid #f3f4f6; font-size:13px;
        }
        .meta-row:last-child { border-bottom:none; }

        .trust-badge {
          text-align:center; padding:14px 10px; background:#f9fafb;
          border-radius:12px; border:1px solid #f0f0f0;
          transition:all .25s;
        }
        .trust-badge:hover { background:#fff0f0; border-color:#fecaca; transform:translateY(-3px); }

        .add-btn {
          flex:1; padding:15px 24px; border:none; border-radius:13px;
          font-family:'Plus Jakarta Sans',sans-serif; font-weight:800;
          font-size:15px; cursor:pointer; transition:all .3s;
        }
        .add-btn.ready {
          background:linear-gradient(135deg,#c0272d,#e53935);
          color:#fff; box-shadow:0 6px 20px rgba(192,39,45,.35);
        }
        .add-btn.ready:hover {
          transform:translateY(-2px);
          box-shadow:0 10px 28px rgba(192,39,45,.45);
        }
        .add-btn.adding {
          background:linear-gradient(135deg,#15803d,#22c55e);
          color:#fff; animation:cartBounce .4s ease;
        }
        .add-btn.out { background:#f3f4f6; color:#9ca3af; cursor:not-allowed; }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ background:'#fff', borderBottom:'1px solid #eee', padding:'12px 0' }}>
        <div className="container">
          <span style={{ fontSize:13, color:'#9ca3af' }}>
            <Link to="/" style={{ color:'#9ca3af', textDecoration:'none' }}>Home</Link> ›{' '}
            <Link to="/shop" style={{ color:'#9ca3af', textDecoration:'none' }}>Shop</Link> ›{' '}
            <Link to={`/shop?cat=${encodeURIComponent(product.Category_Name)}`}
              style={{ color:'#9ca3af', textDecoration:'none' }}>{product.Category_Name}</Link> ›{' '}
            <strong style={{ color:'#111827' }}>{product.Name}</strong>
          </span>
        </div>
      </div>

      {/* Dark header strip */}
      <div style={{ background:'linear-gradient(135deg,#1a0505,#2d0b0b 40%,#0d1240)',
        padding:'20px 0' }}>
        <div className="container">
          <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
            <span style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,.4)',
              textTransform:'uppercase', letterSpacing:1.5 }}>{product.Category_Name}</span>
            <span style={{ color:'rgba(255,255,255,.2)' }}>·</span>
            <span style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,.8)' }}>{product.Name}</span>
            <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
              {[
                { label: product.Is_Perishable ? 'Perishable' : 'Non-perishable',
                  bg: product.Is_Perishable ? 'rgba(234,88,12,.2)' : 'rgba(37,99,235,.2)',
                  color: product.Is_Perishable ? '#fed7aa' : '#bfdbfe',
                  border: product.Is_Perishable ? 'rgba(234,88,12,.3)' : 'rgba(37,99,235,.3)' },
                { label: isOutOfStock ? 'Out of Stock' : 'In Stock',
                  bg: isOutOfStock ? 'rgba(239,68,68,.2)' : 'rgba(21,128,61,.2)',
                  color: isOutOfStock ? '#fca5a5' : '#86efac',
                  border: isOutOfStock ? 'rgba(239,68,68,.3)' : 'rgba(21,128,61,.3)' },
              ].map(b => (
                <span key={b.label} style={{ fontSize:11, fontWeight:700, padding:'4px 12px',
                  borderRadius:99, background:b.bg, color:b.color, border:`1px solid ${b.border}` }}>
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'36px 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'start' }}>

          {/* LEFT — Image */}
          <div style={{ animation:'fadeLeft .6s ease forwards' }}>
            <div style={{
              borderRadius:24, overflow:'hidden',
              background: product.Product_Image && !imgError ? '#fff' : '#f9fafb',
              aspectRatio:'1/1', display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 12px 48px rgba(0,0,0,.1)', border:'1px solid #f0f0f0',
              position:'relative',
            }}>
              {product.Product_Image && !imgError ? (
                <img src={product.Product_Image} alt={product.Name}
                  onError={() => setImgError(true)}
                  style={{ width:'100%', height:'100%', objectFit:'cover',
                    transition:'transform .4s' }}
                  onMouseEnter={e => e.target.style.transform='scale(1.04)'}
                  onMouseLeave={e => e.target.style.transform='scale(1)'}/>
              ) : (
                <div style={{ textAlign:'center', padding:40 }}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none"
                    stroke="#e5e7eb" strokeWidth="0.8">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                  <p style={{ fontSize:13, color:'#d1d5db', marginTop:16, fontWeight:500 }}>
                    No image uploaded
                  </p>
                  <Link to="/admin/inventory" style={{ fontSize:12, color:'#c0272d',
                    fontWeight:700, textDecoration:'none', marginTop:8, display:'block' }}>
                    Upload via Admin Panel →
                  </Link>
                </div>
              )}

              {/* Category tag overlay */}
              <div style={{ position:'absolute', top:14, left:14,
                background:'rgba(0,0,0,.55)', backdropFilter:'blur(8px)',
                borderRadius:99, padding:'4px 12px',
                fontSize:11, fontWeight:700, color:'#fff', letterSpacing:.5 }}>
                {product.Category_Name}
              </div>
            </div>

            {/* Bottom info cards under image */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginTop:16 }}>
              {[
                { label:'Stock', value: product.Current_Stock ?? 0, color:'#c0272d' },
                { label:'Reorder at', value: product.Reorder_Level, color:'#f97316' },
                { label:'Unit', value: product.Unit, color:'#3b82f6' },
              ].map(s => (
                <div key={s.label} style={{ background:'#fff', borderRadius:12, padding:'14px 12px',
                  textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,.05)', border:'1px solid #f0f0f0' }}>
                  <div style={{ fontSize:18, fontWeight:900, color:s.color,
                    fontFamily:"'Playfair Display',serif" }}>{s.value}</div>
                  <div style={{ fontSize:11, color:'#9ca3af', fontWeight:600,
                    textTransform:'uppercase', letterSpacing:.8, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Info */}
          <div style={{ animation:'fadeRight .6s ease .1s both' }}>
            {/* Category + badges */}
            <div style={{ fontSize:11, fontWeight:800, color:'#c0272d',
              textTransform:'uppercase', letterSpacing:1.5, marginBottom:10 }}>
              {product.Category_Name}
            </div>

            <h1 style={{ fontFamily:"'Playfair Display',serif",
              fontSize:'clamp(26px,4vw,38px)', fontWeight:900,
              color:'#111827', lineHeight:1.15, marginBottom:10 }}>
              {product.Name}
            </h1>

            <p style={{ fontSize:14, color:'#9ca3af', marginBottom:24 }}>
              by <strong style={{ color:'#374151' }}>{product.Brand || 'AMS Mart'}</strong>
              {product.Unit && <> · <span>{product.Unit}</span></>}
            </p>

            {/* Price box */}
            <div style={{ background:'linear-gradient(135deg,#fff0f0,#fff)',
              border:'1.5px solid #fecaca', borderRadius:16, padding:'20px 24px',
              marginBottom:24, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80,
                borderRadius:'50%', background:'rgba(192,39,45,.06)', pointerEvents:'none' }}/>
              <div style={{ fontSize:11, fontWeight:700, color:'#9ca3af',
                textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>Price</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
                <span style={{ fontFamily:"'Playfair Display',serif",
                  fontSize:44, fontWeight:900, color:'#c0272d', lineHeight:1 }}>
                  ${Number(product.Unit_Price).toFixed(2)}
                </span>
                <span style={{ fontSize:14, color:'#9ca3af' }}>per {product.Unit || 'unit'}</span>
              </div>
            </div>

            {/* Qty selector */}
            {!isOutOfStock && (
              <div style={{ marginBottom:24 }}>
                <label style={{ fontSize:12, fontWeight:800, color:'#9ca3af',
                  textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:12 }}>
                  Quantity
                </label>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1,q-1))}>−</button>
                  <span style={{ minWidth:40, textAlign:'center', fontSize:22,
                    fontWeight:900, color:'#111827', fontFamily:"'Playfair Display',serif" }}>
                    {qty}
                  </span>
                  <button className="qty-btn" onClick={() => setQty(q => q+1)}>+</button>
                  <div style={{ marginLeft:8, padding:'8px 16px', background:'#f9fafb',
                    borderRadius:10, border:'1px solid #f0f0f0' }}>
                    <span style={{ fontSize:12, color:'#9ca3af' }}>Total </span>
                    <strong style={{ color:'#c0272d', fontSize:16 }}>
                      ${(Number(product.Unit_Price) * qty).toFixed(2)}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display:'flex', gap:12, marginBottom:28 }}>
              <button className={`add-btn ${isOutOfStock?'out':adding?'adding':'ready'}`}
                onClick={handleAddToCart}>
                {isOutOfStock ? 'Out of Stock' : adding ? 'Added to Cart!' : `Add ${qty>1?`${qty}× `:''}to Cart`}
              </button>
              <button onClick={() => inWish ? removeFromWishlist(product.Product_ID) : addToWishlist(product)}
                style={{ width:52, height:52, borderRadius:13,
                  border:`1.5px solid ${inWish?'#fca5a5':'#e5e7eb'}`,
                  background: inWish ? '#fee2e2' : '#fff', cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  transition:'all .25s', flexShrink:0,
                  animation: inWish ? 'heartPop .3s ease' : 'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24"
                  fill={inWish?'#ef4444':'none'}
                  stroke={inWish?'#ef4444':'#9ca3af'} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            {/* Meta table */}
            <div style={{ background:'#fff', borderRadius:14, padding:'4px 20px',
              border:'1px solid #f0f0f0', marginBottom:20,
              boxShadow:'0 2px 8px rgba(0,0,0,.04)' }}>
              {[
                ['Brand',         product.Brand || 'AMS Mart'],
                ['Weight',        product.Unit_Mass_Kg ? `${product.Unit_Mass_Kg} kg` : '—'],
                ['Current Stock', product.Current_Stock ?? 0],
                ['Reorder Level', product.Reorder_Level],
              ].map(([label, value]) => (
                <div key={label} className="meta-row">
                  <span style={{ color:'#9ca3af', fontWeight:500 }}>{label}</span>
                  <strong style={{ color:'#374151' }}>{value}</strong>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {[
                { icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="1.8"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, title:'Free Delivery', sub:'Over $50' },
                { icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, title:'Secure Payment', sub:'100% safe' },
                { icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="1.8"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.96"/></svg>, title:'Easy Returns', sub:'30-day policy' },
              ].map(b => (
                <div key={b.title} className="trust-badge">
                  <div style={{ display:'flex', justifyContent:'center', marginBottom:8 }}>{b.icon}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:'#374151', marginBottom:2 }}>{b.title}</div>
                  <div style={{ fontSize:11, color:'#9ca3af' }}>{b.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginTop:48, background:'#fff', borderRadius:20,
          border:'1px solid #f0f0f0', overflow:'hidden',
          boxShadow:'0 4px 24px rgba(0,0,0,.05)', animation:'fadeUp .6s ease .3s both' }}>
          <div style={{ display:'flex', borderBottom:'1px solid #f3f4f6', padding:'0 24px',
            overflowX:'auto' }}>
            {[['description','Description'],['details','Details'],['reviews','Reviews']].map(([key,label]) => (
              <button key={key} className={`tab-btn${tab===key?' active':''}`}
                onClick={() => setTab(key)}>{label}</button>
            ))}
          </div>

          <div style={{ padding:32 }}>
            {tab === 'description' && (
              <div style={{ animation:'fadeUp .4s ease forwards' }}>
                <p style={{ fontSize:15, color:'#4b5563', lineHeight:1.9, marginBottom:28,
                  maxWidth:700 }}>
                  {product.Description ||
                    `${product.Name} is a quality product carefully sourced for AMS Mart customers in Phnom Penh. Each item is inspected for freshness and quality before reaching you.`}
                </p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                  {[
                    { title:'100% Fresh',      desc:'Sourced and stocked daily from trusted suppliers.' },
                    { title:'Quality Checked', desc:'Every item inspected before reaching the shelves.' },
                    { title:'Packed Properly', desc:'Handled and stored to maintain peak freshness.' },
                  ].map(f => (
                    <div key={f.title} style={{ padding:20, background:'#f9fafb',
                      borderRadius:14, border:'1px solid #f0f0f0',
                      transition:'all .25s', cursor:'default' }}
                      onMouseEnter={e => { e.currentTarget.style.background='#fff0f0'; e.currentTarget.style.borderColor='#fecaca'; e.currentTarget.style.transform='translateY(-4px)' }}
                      onMouseLeave={e => { e.currentTarget.style.background='#f9fafb'; e.currentTarget.style.borderColor='#f0f0f0'; e.currentTarget.style.transform='none' }}>
                      <div style={{ width:36, height:36, borderRadius:10, background:'#fff0f0',
                        border:'1px solid #fecaca', display:'flex', alignItems:'center',
                        justifyContent:'center', marginBottom:12 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <div style={{ fontWeight:700, color:'#111827', marginBottom:6, fontSize:14 }}>{f.title}</div>
                      <div style={{ fontSize:13, color:'#9ca3af', lineHeight:1.6 }}>{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'details' && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10,
                animation:'fadeUp .4s ease forwards' }}>
                {[
                  ['Product Name',   product.Name],
                  ['Brand',          product.Brand || 'AMS Mart'],
                  ['Category',       product.Category_Name],
                  ['Unit',           product.Unit],
                  ['Weight',         product.Unit_Mass_Kg ? `${product.Unit_Mass_Kg} kg` : '—'],
                  ['Perishable',     product.Is_Perishable ? 'Yes' : 'No'],
                  ['Reorder Level',  product.Reorder_Level],
                ].map(([k, v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between',
                    alignItems:'center', padding:'12px 16px', background:'#f9fafb',
                    borderRadius:10, border:'1px solid #f0f0f0', fontSize:13 }}>
                    <span style={{ color:'#9ca3af', fontWeight:500 }}>{k}</span>
                    <strong style={{ color:'#374151' }}>{v}</strong>
                  </div>
                ))}
              </div>
            )}

            {tab === 'reviews' && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20,
                animation:'fadeUp .4s ease forwards' }}>
                {[
                  { name:'Narin PHET',       stars:5, text:'The website is smoother than my semester plans, and those never go smoothly.' },
                  { name:'Phourany PHEA',    stars:5, text:'Clear product details and smooth ordering. My wallet complained, but I was satisfied.' },
                  { name:'Chanvathana NOUN', stars:5, text:'Finding products here was easier than finding my lecture notes before an exam.' },
                ].map((r, i) => (
                  <div key={r.name} style={{ padding:24, borderRadius:16,
                    background:'#fff', border:'1px solid #f0f0f0',
                    boxShadow:'0 2px 12px rgba(0,0,0,.05)',
                    transition:'all .25s', animation:`fadeUp .4s ease ${i*.1}s both` }}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,.1)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,.05)' }}>
                    <div style={{ display:'flex', gap:2, marginBottom:14 }}>
                      {[...Array(r.stars)].map((_,j) => (
                        <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ))}
                    </div>
                    <p style={{ fontSize:14, color:'#4b5563', lineHeight:1.75,
                      marginBottom:16, fontStyle:'italic' }}>"{r.text}"</p>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:32, height:32, borderRadius:'50%',
                        background:'linear-gradient(135deg,#c0272d,#e53935)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:12, fontWeight:800, color:'#fff' }}>
                        {r.name[0]}
                      </div>
                      <strong style={{ fontSize:13, color:'#111827' }}>{r.name}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
