import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

const CATEGORIES = [
  { label:'All',        id:'all' },
  { label:'Orders',     id:'orders' },
  { label:'Products',   id:'products' },
  { label:'Membership', id:'membership' },
  { label:'Payment',    id:'payment' },
  { label:'Account',    id:'account' },
]

const FAQS = [
  // Orders
  { cat:'orders', q:'How do I place an order?',
    a:'Browse our shop, add products to your cart, and proceed to checkout. Fill in your delivery details, choose a payment method, and confirm your order. You will be redirected to your order history once the order is placed.' },
  { cat:'orders', q:'Can I track my order after placing it?',
    a:'Yes. Go to your account dashboard and click "My Orders". You will see all your past and current orders with their status, items purchased, and total amount.' },
  { cat:'orders', q:'What are your store hours?',
    a:'AMS Mart is open every day from 7:00 AM to 9:00 PM, including public holidays. Our online shop is available 24/7.' },
  { cat:'orders', q:'Can I cancel or modify an order after placing it?',
    a:'Orders can only be modified before they are processed. Please contact our customer service at +855 12 345 678 as soon as possible if you need to make changes.' },

  // Products
  { cat:'products', q:'Are your fresh products sourced locally?',
    a:'Yes. Our fresh fruits, vegetables, meat, seafood and eggs are sourced directly from Cambodian farms and local suppliers. We restock daily to ensure maximum freshness.' },
  { cat:'products', q:'What does "Perishable" mean on a product?',
    a:'Perishable items such as fresh meat, dairy, and produce have a limited shelf life and must be stored correctly — usually in a refrigerator or freezer. Non-perishable items like canned goods and dry noodles have a much longer shelf life.' },
  { cat:'products', q:'What if a product I want is out of stock?',
    a:'If a product shows "Out of Stock", it means we have temporarily run out. We restock regularly — check back soon or contact us and we will notify you when it is available again.' },
  { cat:'products', q:'Do you sell products in bulk for businesses?',
    a:'Yes! We offer wholesale pricing for businesses and restaurants. Contact our wholesale team at +855 12 345 680 or email wholesale@amsmart.kh for a custom quote.' },

  // Membership
  { cat:'membership', q:'How do I earn loyalty points?',
    a:'You earn 1 point for every $1 you spend at AMS Mart. Points are tracked automatically when you are logged in during checkout. Points accumulate across all your purchases.' },
  { cat:'membership', q:'What are the membership tiers?',
    a:'We have four tiers: Bronze (starting tier), Silver (from $50 spent), Gold (from $200 spent), and Platinum (from $500 spent). Higher tiers unlock better coupon discounts and exclusive offers.' },
  { cat:'membership', q:'How do I use my coupon codes?',
    a:'During checkout, enter your coupon code in the "Coupon / Promo Code" field and click Apply. The discount will be calculated automatically and shown in your order summary before you confirm.' },
  { cat:'membership', q:'Do my loyalty points expire?',
    a:'Loyalty points are valid for 12 months from the date they were earned. Points will be reset if your account has no activity for over 12 months.' },

  // Payment
  { cat:'payment', q:'What payment methods do you accept?',
    a:'We currently accept Cash on delivery, ABA Pay (QR code scan), and ACLEDA bank transfer. We are working on adding more payment options including Wing and credit cards.' },
  { cat:'payment', q:'Is it safe to pay online through AMS Mart?',
    a:'Yes. All transactions are processed securely. We do not store your banking details on our servers. ABA and ACLEDA payments are handled directly through their secure platforms.' },
  { cat:'payment', q:'What currency do you use?',
    a:'All prices on AMS Mart are displayed and charged in US Dollars (USD), which is standard practice in Cambodia. Cash payments in Khmer Riel (KHR) are accepted at the current exchange rate.' },
  { cat:'payment', q:'Can I get a receipt or invoice for my order?',
    a:'Yes. A summary of your order including items, quantities, prices and total is saved in your Order History. You can view it anytime from your account dashboard.' },

  // Account
  { cat:'account', q:'How do I create an account?',
    a:'Click "Sign In" in the top navigation, then select "Create Account". Fill in your name, email, and password. Your account will be created instantly and you will be enrolled in our Bronze membership tier automatically.' },
  { cat:'account', q:'Can I change my email address?',
    a:'For security reasons, your email address cannot be changed after registration. If you need to update it, please contact our support team at limchheang@amsmart.kh.' },
  { cat:'account', q:'I forgot my password. What do I do?',
    a:'On the login page, click "Forgot Password" and enter your registered email address. You will receive a password reset link. If you still have trouble, contact us at +855 12 345 678.' },
  { cat:'account', q:'How do I update my profile or phone number?',
    a:'Go to Account Settings from your dashboard. Under the Profile tab, you can update your full name and phone number. Click Save Changes when done.' },
]

function useInView() {
  const ref = useRef(); const [v, setV] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if(e.isIntersecting) setV(true) }, { threshold:0.1 })
    if(ref.current) o.observe(ref.current); return () => o.disconnect()
  }, [])
  return [ref, v]
}

export default function FAQ() {
  const [open,    setOpen]    = useState(null)
  const [active,  setActive]  = useState('all')
  const [search,  setSearch]  = useState('')
  const [heroRef, heroVisible] = useInView()
  const [listRef, listVisible] = useInView()

  const filtered = FAQS.filter(f => {
    const matchCat    = active === 'all' || f.cat === active
    const matchSearch = !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#f4f6fa', minHeight:'100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeLeft { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes spin-cw  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes spin-ccw { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

        .faq-cat-btn {
          padding:9px 18px; border-radius:99px; border:1.5px solid #e5e7eb;
          background:#fff; font-size:13px; font-weight:600; cursor:pointer;
          font-family:'Plus Jakarta Sans',sans-serif; transition:all .2s; color:#6b7280;
        }
        .faq-cat-btn:hover { border-color:#fca5a5; color:#c0272d; }
        .faq-cat-btn.active { background:linear-gradient(135deg,#c0272d,#e53935); color:#fff; border-color:transparent; box-shadow:0 4px 12px rgba(192,39,45,.3); }

        .faq-item { position:relative; }/
        .faq-item::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:linear-gradient(180deg,#c0272d,#f87171); transform:scaleY(0); transition:transform .3s; border-radius:0 2px 2px 0; }
        .faq-item-x {
          background:#fff; border-radius:16px; overflow:hidden;
          border:1px solid rgba(0,0,0,.06); box-shadow:0 2px 8px rgba(0,0,0,.04);
          transition:box-shadow .3s, transform .3s;
        }
        .faq-item:hover { box-shadow:0 8px 28px rgba(0,0,0,.08); transform:translateY(-2px); }

        .faq-question {
          width:100%; padding:22px 28px; display:flex; justify-content:space-between;
          align-items:center; cursor:pointer; border:none; background:transparent;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:700;
          color:#0f172a; text-align:left; transition:color .2s; gap:16px;
        }
        .faq-question:hover { color:#c0272d; }
        .faq-question.open { color:#c0272d; }

        .faq-icon {
          width:32px; height:32px; border-radius:10px; border:1.5px solid #f0f0f0; display:flex; align-items:center;
          justify-content:center; flex-shrink:0; transition:all .3s;
        }
        .faq-icon.open { background:#c0272d; border-color:#c0272d; transform:rotate(45deg); box-shadow:0 4px 12px rgba(192,39,45,.3); }
        .faq-icon:not(.open) { background:#f3f4f6; }

        .faq-answer {
          overflow:hidden; transition:max-height .35s cubic-bezier(.4,0,.2,1), opacity .3s;
        }
        .faq-answer.open { max-height:400px; opacity:1; }
        .faq-answer:not(.open) { max-height:0; opacity:0; }

        .search-input {
          width:100%; padding:14px 20px 14px 48px; border:1.5px solid #e5e7eb;
          border-radius:14px; font-size:15px; outline:none; font-family:'Plus Jakarta Sans',sans-serif;
          background:#fff; transition:all .25s; box-sizing:border-box;
        }
        .search-input:focus { border-color:#c0272d; box-shadow:0 0 0 3px rgba(192,39,45,.1); }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ background:'#fff', borderBottom:'1px solid #eee', padding:'12px 0' }}>
        <div className="container">
          <span style={{ fontSize:13, color:'#9ca3af' }}>
            <Link to="/" style={{ color:'#9ca3af', textDecoration:'none' }}>Home</Link> ›{' '}
            <strong style={{ color:'#111827' }}>FAQ</strong>
          </span>
        </div>
      </div>

      {/* Hero */}
      <div ref={heroRef} style={{ background:'linear-gradient(135deg,#1a0505,#2d0b0b 40%,#0d1240)', padding:'60px 0 48px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:350, height:350, borderRadius:'50%', border:'1px solid rgba(255,255,255,.06)', animation:'spin-cw 30s linear infinite' }}/>
        <div style={{ position:'absolute', bottom:-80, left:-80, width:300, height:300, borderRadius:'50%', border:'1px solid rgba(192,39,45,.08)', animation:'spin-ccw 25s linear infinite' }}/>
        <div style={{ position:'absolute', bottom:-60, left:-60, width:200, height:200, borderRadius:'50%', border:'1px solid rgba(192,39,45,.1)' }}/>

        <div className="container" style={{ position:'relative', zIndex:1, textAlign:'center' }}>
          <div style={{ fontSize:11, fontWeight:800, color:'#c0272d', textTransform:'uppercase',
            letterSpacing:2, marginBottom:12,
            opacity:heroVisible?1:0, animation:heroVisible?'fadeUp .5s ease forwards':'none' }}>
            Help Center
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(32px,5vw,52px)',
            fontWeight:900, color:'#fff', margin:'0 0 16px',
            opacity:heroVisible?1:0, animation:heroVisible?'fadeUp .5s ease .1s forwards':'none' }}>
            Frequently Asked{' '}
            <span style={{ background:'linear-gradient(135deg,#c0272d,#f87171)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              Questions
            </span>
          </h1>
          <p style={{ color:'rgba(255,255,255,.55)', fontSize:16, maxWidth:480, margin:'0 auto 36px',
            opacity:heroVisible?1:0, animation:heroVisible?'fadeUp .5s ease .2s forwards':'none' }}>
            Everything you need to know about AMS Mart. Can't find the answer? Contact our team.
          </p>

          {/* Search */}
          <div style={{ maxWidth:560, margin:'0 auto', position:'relative',
            opacity:heroVisible?1:0, animation:heroVisible?'fadeUp .5s ease .3s forwards':'none' }}>
            <svg style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input className="search-input" placeholder="Search your question..."
              value={search} onChange={e=>{ setSearch(e.target.value); setOpen(null) }}/>
            {search && (
              <button onClick={()=>setSearch('')} style={{ position:'absolute', right:14, top:'50%',
                transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer',
                color:'#9ca3af', fontSize:18 }}>✕</button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background:'#fff', borderBottom:'1px solid #f0f0f0' }}>
        <div className="container" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0 }}>
          {[['20+','Questions Answered'],['5','Categories'],['7AM–9PM','Store Hours'],['24/7','Online Support']].map(([v,l],i) => (
            <div key={l} style={{ padding:'20px 24px', textAlign:'center', borderRight:i<3?'1px solid #f0f0f0':'none' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, color:'#c0272d' }}>{v}</div>
              <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, marginTop:3, textTransform:'uppercase', letterSpacing:1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding:'40px 24px' }}>

        {/* Category filters */}
        <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:32, justifyContent:'center' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} className={`faq-cat-btn${active===cat.id?' active':''}`}
              onClick={()=>{ setActive(cat.id); setOpen(null); setSearch('') }}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        {(search || active !== 'all') && (
          <div style={{ textAlign:'center', fontSize:13, color:'#94a3b8', marginBottom:20 }}>
            {filtered.length} result{filtered.length!==1?'s':''} found
            {search && <> for "<strong style={{ color:'#c0272d' }}>{search}</strong>"</>}
          </div>
        )}

        {/* FAQ List */}
        <div ref={listRef} style={{ maxWidth:760, margin:'0 auto', display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 20px', background:'#fff',
              borderRadius:20, border:'1px solid #f0f0f0' }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'#f9fafb',
                display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <h3 style={{ fontSize:18, fontWeight:700, color:'#0f172a', marginBottom:6 }}>No results found</h3>
              <p style={{ color:'#94a3b8', fontSize:14 }}>Try a different search or browse all categories.</p>
              <button onClick={()=>{ setSearch(''); setActive('all') }}
                style={{ marginTop:16, padding:'10px 24px', borderRadius:10, border:'none',
                  background:'linear-gradient(135deg,#c0272d,#e53935)', color:'#fff',
                  fontWeight:700, cursor:'pointer' }}>
                View All FAQs
              </button>
            </div>
          ) : filtered.map((f, i) => (
            <div key={i} className="faq-item" style={{
              opacity: listVisible?1:0,
              animation: listVisible?`fadeUp .5s ease ${i*.04}s forwards`:'none'
            }}>
              <button className={`faq-question${open===i?' open':''}`} onClick={()=>setOpen(open===i?null:i)}>
                <span>{f.q}</span>
                <div className={`faq-icon${open===i?' open':''}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke={open===i?'#fff':'#6b7280'} strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
              </button>
              <div className={`faq-answer${open===i?' open':''}`}>
                <div style={{ padding:'0 24px 20px', fontSize:14, color:'#6b7280', lineHeight:1.9,
                  borderTop:'1px solid #f4f6fa' }}>
                  <div style={{ paddingTop:16 }}>{f.a}</div>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </div>
  )
}
