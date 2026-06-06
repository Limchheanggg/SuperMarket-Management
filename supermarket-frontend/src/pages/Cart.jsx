import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cartItems, removeItem, updateQty, totalPrice } = useCart()
  const tax   = totalPrice * 0.1
  const total = totalPrice + tax

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#f4f6fa', minHeight:'100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn{ from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        .cart-row { display:grid; grid-template-columns:2fr 1fr 140px 1fr 40px; align-items:center; padding:16px 20px; border-bottom:1px solid #f4f6fa; transition:background .15s; gap:12px; }
        .cart-row:hover { background:#fafbfc; }
        .qty-btn { width:34px; height:34px; border-radius:8px; border:1.5px solid #e5e7eb; background:#fff; cursor:pointer; font-size:18px; font-weight:700; display:flex; align-items:center; justify-content:center; transition:all .2s; color:#374151; }
        .qty-btn:hover { background:#fff0f0; border-color:#fca5a5; color:#c0272d; }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ background:'#fff', borderBottom:'1px solid #eee', padding:'12px 0' }}>
        <div className="container">
          <span style={{ fontSize:13, color:'#9ca3af' }}>
            <Link to="/" style={{ color:'#9ca3af', textDecoration:'none' }}>Home</Link> ›{' '}
            <strong style={{ color:'#111827' }}>Shopping Cart</strong>
          </span>
        </div>
      </div>

      {/* Dark header */}
      <div style={{ background:'linear-gradient(135deg,#1a0505,#2d0b0b 40%,#0d1240)', padding:'28px 0' }}>
        <div className="container">
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:900, color:'#fff', margin:0 }}>
            Shopping Cart
          </h1>
          <p style={{ color:'rgba(255,255,255,.5)', fontSize:14, margin:'6px 0 0' }}>
            {cartItems.length} {cartItems.length===1?'item':'items'} in your cart
          </p>
        </div>
      </div>

      <div className="container" style={{ padding:'28px 24px' }}>
        {cartItems.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px', background:'#fff',
            borderRadius:20, boxShadow:'0 4px 24px rgba(0,0,0,.06)', animation:'fadeUp .5s ease forwards' }}>
            <div style={{ width:80, height:80, borderRadius:'50%', background:'#f9fafb',
              display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, marginBottom:8 }}>Your cart is empty</h2>
            <p style={{ color:'#9ca3af', marginBottom:28 }}>Add some fresh products to get started!</p>
            <Link to="/shop" style={{ padding:'13px 32px', background:'linear-gradient(135deg,#c0272d,#e53935)',
              color:'#fff', borderRadius:12, textDecoration:'none', fontWeight:700, fontSize:15,
              boxShadow:'0 6px 20px rgba(192,39,45,.35)' }}>
              Browse Products
            </Link>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:24, alignItems:'start' }}>

            {/* Cart Table */}
            <div style={{ background:'#fff', borderRadius:18, overflow:'hidden',
              boxShadow:'0 4px 24px rgba(0,0,0,.06)', animation:'fadeUp .5s ease forwards' }}>
              {/* Header */}
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 140px 1fr 40px',
                padding:'14px 20px', background:'linear-gradient(135deg,#0f172a,#1e293b)',
                gap:12, alignItems:'center' }}>
                {['Product','Price','Quantity','Total',''].map(h => (
                  <div key={h} style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.6)',
                    textTransform:'uppercase', letterSpacing:.8 }}>{h}</div>
                ))}
              </div>

              {/* Items */}
              {cartItems.map((item,i) => (
                <div key={item.Product_ID} className="cart-row"
                  style={{ animation:`slideIn .4s ease ${i*.05}s both` }}>
                  {/* Product */}
                  <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                    <div style={{ width:56, height:56, borderRadius:12, background:'#f9fafb',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      overflow:'hidden', flexShrink:0, border:'1px solid #f0f0f0' }}>
                      {item.Product_Image
                        ? <img src={item.Product_Image} alt={item.Name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                        : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                      }
                    </div>
                    <div>
                      <div style={{ fontWeight:700, color:'#0f172a', fontSize:14, marginBottom:3 }}>{item.Name}</div>
                      <div style={{ fontSize:11, color:'#94a3b8' }}>{item.Unit} · {item.Brand}</div>
                    </div>
                  </div>
                  {/* Price */}
                  <div style={{ fontWeight:700, color:'#374151' }}>${Number(item.Unit_Price).toFixed(2)}</div>
                  {/* Qty */}
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <button className="qty-btn" onClick={()=>updateQty(item.Product_ID,item.qty-1)}>−</button>
                    <span style={{ fontWeight:800, fontSize:16, minWidth:24, textAlign:'center', color:'#0f172a' }}>{item.qty}</span>
                    <button className="qty-btn" onClick={()=>updateQty(item.Product_ID,item.qty+1)}>+</button>
                  </div>
                  {/* Total */}
                  <div style={{ fontWeight:800, color:'#c0272d', fontSize:15 }}>
                    ${(Number(item.Unit_Price)*item.qty).toFixed(2)}
                  </div>
                  {/* Remove */}
                  <button onClick={()=>removeItem(item.Product_ID)}
                    style={{ width:32, height:32, borderRadius:8, border:'none', background:'#fee2e2',
                      color:'#dc2626', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                      transition:'all .2s' }}
                    onMouseEnter={e=>{e.currentTarget.style.background='#fecaca'}}
                    onMouseLeave={e=>{e.currentTarget.style.background='#fee2e2'}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{ background:'#fff', borderRadius:18, padding:24,
              boxShadow:'0 4px 24px rgba(0,0,0,.06)', position:'sticky', top:20,
              animation:'fadeUp .5s ease .1s both', border:'1px solid rgba(0,0,0,.06)' }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:900,
                color:'#0f172a', margin:'0 0 20px', paddingBottom:16, borderBottom:'1px solid #f4f6fa' }}>
                Order Summary
              </h3>
              {[['Subtotal',`$${totalPrice.toFixed(2)}`],['Delivery','FREE'],['Tax (10%)',`$${tax.toFixed(2)}`]].map(([l,v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0',
                  borderBottom:'1px solid #f9fafb', fontSize:14 }}>
                  <span style={{ color:'#6b7280' }}>{l}</span>
                  <span style={{ fontWeight:600, color:v==='FREE'?'#16a34a':'#374151' }}>{v}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', padding:'16px 0',
                fontWeight:900, fontSize:18 }}>
                <span style={{ color:'#0f172a', fontFamily:"'Playfair Display',serif" }}>Total</span>
                <span style={{ color:'#c0272d' }}>${total.toFixed(2)}</span>
              </div>
              <Link to="/checkout" style={{ display:'flex', alignItems:'center', justifyContent:'center',
                gap:8, width:'100%', padding:'14px', borderRadius:12, marginTop:4,
                background:'linear-gradient(135deg,#c0272d,#e53935)', color:'#fff',
                fontWeight:800, fontSize:15, textDecoration:'none',
                boxShadow:'0 6px 20px rgba(192,39,45,.35)', transition:'all .25s' }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 10px 28px rgba(192,39,45,.45)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 6px 20px rgba(192,39,45,.35)'}}>
                Proceed to Checkout →
              </Link>
              <Link to="/shop" style={{ display:'block', textAlign:'center', marginTop:12,
                color:'#9ca3af', fontSize:13, textDecoration:'none', fontWeight:500 }}>
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
