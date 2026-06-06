import { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function OrderSuccess() {
  const { state }  = useLocation()
  const navigate   = useNavigate()
  const printRef   = useRef()

  // If accessed directly without order data, redirect
  useEffect(() => {
    if (!state?.order) navigate('/shop')
  }, [])

  if (!state?.order) return null

  const { order, items, subtotal, tax, discount, coupon, payMethod } = state

  const handlePrint = () => {
    const content = printRef.current.innerHTML
    const win = window.open('', '_blank')
    win.document.write(`
      <html><head><title>Receipt - ${order.Sale_ID}</title>
      <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; padding: 32px; max-width: 480px; margin: 0 auto; }
        h1 { font-size: 22px; font-weight: 900; margin-bottom: 4px; }
        .label { color: #9ca3af; font-size: 12px; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
        .total { font-size: 18px; font-weight: 900; color: #c0272d; }
        .badge { background: #fff0f0; color: #c0272d; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; }
        @media print { button { display: none; } }
      </style></head>
      <body>${content}</body></html>
    `)
    win.document.close()
    win.print()
  }

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#f4f6fa', minHeight:'100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn  { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        @keyframes checkPop { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
        @keyframes confetti {
          0%   { transform:translateY(-10px) rotate(0deg);   opacity:1; }
          100% { transform:translateY(80px)  rotate(720deg); opacity:0; }
        }
        .receipt-row { display:flex; justify-content:space-between; align-items:center; padding:11px 0; border-bottom:1px solid #f4f6fa; font-size:14px; }
        .receipt-row:last-child { border-bottom:none; }
        .action-btn { padding:13px 28px; border-radius:12px; font-weight:700; font-size:14px; text-decoration:none; display:inline-flex; align-items:center; gap:8px; transition:all .25s; cursor:pointer; border:none; font-family:'Plus Jakarta Sans',sans-serif; }
        .action-btn:hover { transform:translateY(-2px); }
      `}</style>

      {/* Confetti dots */}
      <div style={{ position:'fixed', top:0, left:0, right:0, height:200, pointerEvents:'none', overflow:'hidden', zIndex:100 }}>
        {[...Array(12)].map((_,i) => (
          <div key={i} style={{
            position:'absolute', width:10, height:10, borderRadius:'50%',
            left:`${8+i*8}%`, top:-10,
            background:['#c0272d','#f59e0b','#22c55e','#6366f1','#ec4899'][i%5],
            animation:`confetti ${1.5+i*.1}s ease ${i*.08}s forwards`
          }}/>
        ))}
      </div>

      <div className="container" style={{ padding:'48px 24px', maxWidth:640 }}>

        {/* Success header */}
        <div style={{ textAlign:'center', marginBottom:32, animation:'fadeUp .5s ease forwards' }}>
          <div style={{ width:80, height:80, borderRadius:'50%',
            background:'linear-gradient(135deg,#16a34a,#22c55e)',
            display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 20px', boxShadow:'0 8px 32px rgba(22,163,74,.35)',
            animation:'checkPop .5s cubic-bezier(.34,1.56,.64,1) .2s both' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:900,
            color:'#0f172a', margin:'0 0 8px' }}>Order Confirmed!</h1>
          <p style={{ color:'#94a3b8', fontSize:15, margin:0 }}>
            Thank you for shopping at AMS Mart. Your order has been placed successfully.
          </p>
        </div>

        {/* Receipt card */}
        <div ref={printRef} style={{ background:'#fff', borderRadius:20, overflow:'hidden',
          boxShadow:'0 4px 32px rgba(0,0,0,.08)', animation:'scaleIn .5s ease .1s both' }}>

          {/* Receipt header */}
          <div style={{ background:'linear-gradient(135deg,#c0272d,#9b1c1c)', padding:'24px 28px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.6)',
                  textTransform:'uppercase', letterSpacing:1.5, marginBottom:4 }}>Receipt</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22,
                  fontWeight:900, color:'#fff' }}>{order.Sale_ID}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.6)', marginBottom:4 }}>
                  {new Date().toLocaleDateString('en-US',{ weekday:'short', year:'numeric', month:'short', day:'numeric' })}
                </div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.6)' }}>
                  {new Date().toLocaleTimeString('en-US',{ hour:'2-digit', minute:'2-digit' })}
                </div>
              </div>
            </div>
            <div style={{ marginTop:16, paddingTop:16, borderTop:'1px solid rgba(255,255,255,.15)',
              display:'flex', gap:20, fontSize:13 }}>
              <div>
                <div style={{ color:'rgba(255,255,255,.5)', fontSize:11, marginBottom:2 }}>Payment</div>
                <div style={{ color:'#fff', fontWeight:700 }}>{payMethod}</div>
              </div>
              <div>
                <div style={{ color:'rgba(255,255,255,.5)', fontSize:11, marginBottom:2 }}>Items</div>
                <div style={{ color:'#fff', fontWeight:700 }}>{items.length} products</div>
              </div>
              <div>
                <div style={{ color:'rgba(255,255,255,.5)', fontSize:11, marginBottom:2 }}>Status</div>
                <div style={{ color:'#22c55e', fontWeight:700 }}>Confirmed</div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div style={{ padding:'20px 28px' }}>
            <div style={{ fontSize:11, fontWeight:800, color:'#94a3b8',
              textTransform:'uppercase', letterSpacing:1, marginBottom:12 }}>Items Purchased</div>
            {items.map((item, i) => (
              <div key={i} className="receipt-row">
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, color:'#0f172a', fontSize:14 }}>{item.Name}</div>
                  <div style={{ fontSize:11, color:'#9ca3af', marginTop:2 }}>
                    ${Number(item.Unit_Price).toFixed(2)} × {item.qty}
                  </div>
                </div>
                <strong style={{ color:'#0f172a' }}>${(Number(item.Unit_Price)*item.qty).toFixed(2)}</strong>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ padding:'0 28px 24px', borderTop:'1px solid #f4f6fa' }}>
            <div style={{ padding:'16px 0 0' }}>
              {[
                ['Subtotal', `$${subtotal.toFixed(2)}`],
                ['Tax (10%)', `$${tax.toFixed(2)}`],
                ...(discount > 0 ? [[`Coupon (${coupon})`, `-$${discount.toFixed(2)}`]] : []),
                ['Delivery', 'FREE'],
              ].map(([l,v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between',
                  fontSize:13, color:'#6b7280', marginBottom:8 }}>
                  <span>{l}</span>
                  <span style={{ color:l.startsWith('Coupon')||v==='FREE'?'#16a34a':'#6b7280', fontWeight:600 }}>{v}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between',
                paddingTop:14, borderTop:'1.5px solid #f0f0f0', marginTop:6 }}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:900, color:'#0f172a' }}>Total</span>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, color:'#c0272d' }}>
                  ${(subtotal + tax - discount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ background:'#f9fafb', padding:'16px 28px', textAlign:'center',
            fontSize:12, color:'#94a3b8', borderTop:'1px solid #f0f0f0' }}>
            AMS Mart · Russian Blvd, Phnom Penh · +855 12 345 678 · limchheang@amsmart.kh
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:12, marginTop:24, flexWrap:'wrap', justifyContent:'center',
          animation:'fadeUp .5s ease .3s both' }}>
          <button className="action-btn" onClick={handlePrint}
            style={{ background:'linear-gradient(135deg,#0f172a,#1e293b)', color:'#fff',
              boxShadow:'0 4px 14px rgba(0,0,0,.2)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print Receipt
          </button>
          <Link to="/orders" className="action-btn"
            style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff',
              boxShadow:'0 4px 14px rgba(99,102,241,.3)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            My Orders
          </Link>
          <Link to="/shop" className="action-btn"
            style={{ background:'linear-gradient(135deg,#c0272d,#e53935)', color:'#fff',
              boxShadow:'0 4px 14px rgba(192,39,45,.3)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
