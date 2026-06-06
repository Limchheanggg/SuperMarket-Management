import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'
import ProductCard from '../components/product/ProductCard'

function useInView(threshold = 0.1) {
  const ref = useRef()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function Counter({ target, suffix = '', delay = 0 }) {
  const [count, setCount] = useState(0)
  const ref = useRef()
  useEffect(() => {
    const num = parseInt(String(target).replace(/\D/g, '')) || 0
    if (num === 0) return
    const start = () => {
      setTimeout(() => {
        let cur = 0
        const step = num / 60
        const timer = setInterval(() => {
          cur += step
          if (cur >= num) { setCount(num); clearInterval(timer) }
          else setCount(Math.floor(cur))
        }, 16)
      }, delay)
    }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { start(); obs.disconnect() }
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const CAT_IMAGES = {
  'Fresh Fruits':         'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80',
  'Fresh Vegetables':     'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80',
  'Meat':                 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80',
  'Seafood':              'https://wardsgainesville.com/wp-content/uploads/2017/08/Webp.net-resizeimage-13.jpg',
  'Dairy':                'https://images.unsplash.com/photo-1622371684824-dc014541a4f5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Eggs':                 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80',
  'Cooking Essentials':   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-s3IlWOUoLRHSPf9fZtaNHAziQIAuv45oUA&s',
  'Noodle & Instant Food':'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80',
  'Snacks':               'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80',
  'Beverages':            'https://thumbs.dreamstime.com/b/bekasi-indonesia-january-various-colorful-canned-bottled-soft-drinks-neatly-arranged-supermarket-display-shelves-430125693.jpg',
  'Frozen Foods':         'https://d2dyh47stel7w4.cloudfront.net/Pictures/1024x536/2/6/7/301267_20221116_170906_864904.jpg',
  'Personal Care':        'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80',
}
const FALLBACK = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80'

const FEATURES = [
  { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    title:'Free Delivery', sub:'Always free, every order', bg:'#fff7ed', accent:'#f97316' },
  { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    title:'Secure Payment', sub:'ABA · ACLEDA · Cash', bg:'#eff6ff', accent:'#3b82f6' },
  { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title:'Fresh Products', sub:'From local farms daily', bg:'#f0fdf4', accent:'#22c55e' },
  { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    title:'Loyalty Rewards', sub:'Earn points every buy', bg:'#fefce8', accent:'#eab308' },
]


const REVIEWS = [
  { name:'Sarakseyha NY',   role:'University Student', stars:5, color:'#22c55e',
    text:'The UI is so clean that even my sleepy 2AM brain could use it without getting lost. That says a lot honestly.' },
  { name:'Putdararith KIM', role:'University Student', stars:5, color:'#6366f1',
    text:'I opened the website just to test it, then spent 20 minutes pretending I was actually grocery shopping. Lowkey better than some real supermarket apps.' },
  { name:'Chhaythean LY',   role:'Senior',             stars:4, color:'#f59e0b',
    text:'Your project shows strong frontend and system design skills. The UI is clean, responsive, and the supermarket workflow is implemented very well for a student project.' },
]

function ReviewCarousel() {
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)
  const timerRef = useRef(null)

  const goTo = (idx) => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => { setActive(idx); setAnimating(false) }, 300)
  }

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setActive(prev => (prev + 1) % REVIEWS.length)
        setAnimating(false)
      }, 300)
    }, 4000)
    return () => clearInterval(timerRef.current)
  }, [])

  const r = REVIEWS[active]

  return (
    <section style={{ padding:'80px 0', background:'linear-gradient(180deg,#f8f9fc,#fff 20%,#fff 80%,#f8f9fc)', overflow:'hidden' }}>
      <style>{`
        @keyframes reviewIn  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes reviewOut { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-20px)} }
        .review-card-inner { animation: reviewIn .35s ease forwards; }
        .review-card-inner.out { animation: reviewOut .3s ease forwards; }
      `}</style>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px' }}>
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <span className="section-tag">Customer Love</span>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:900,
            color:'#111827', margin:'10px 0 12px' }}>
            What Our <span style={{ color:'#c0272d' }}>Customers</span> Say
          </h2>
          <p style={{ fontSize:15, color:'#9ca3af', maxWidth:480, margin:'0 auto' }}>
            Real feedback from happy shoppers in Institute of Technology of Cambodia
          </p>
        </div>

        {/* Main featured card */}
        <div style={{ maxWidth:680, margin:'0 auto 32px', position:'relative' }}>
          <div className={`review-card-inner${animating?' out':''}`}
            style={{ background:'#fff', borderRadius:24, padding:40,
              border:`1.5px solid ${r.color}33`,
              boxShadow:`0 8px 40px rgba(0,0,0,.08), 0 0 0 1px ${r.color}11`,
              position:'relative', overflow:'hidden' }}>

            {/* Decorative quote mark */}
            <div style={{ position:'absolute', top:20, right:28, fontSize:80,
              fontFamily:'Georgia,serif', color:r.color+'15', lineHeight:1, fontWeight:900 }}>"</div>

            <div style={{ display:'flex', gap:3, marginBottom:20 }}>
              {[...Array(5)].map((_,j) => (
                <svg key={j} width="18" height="18" viewBox="0 0 24 24"
                  fill={j < r.stars ? '#f59e0b' : '#e5e7eb'}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
            </div>

            <p style={{ fontSize:17, color:'#374151', lineHeight:1.85, marginBottom:28,
              fontStyle:'italic', position:'relative', zIndex:1 }}>
              "{r.text}"
            </p>

            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:48, height:48, borderRadius:'50%',
                background:`linear-gradient(135deg,${r.color},${r.color}88)`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:18, fontWeight:900, color:'#fff', flexShrink:0,
                boxShadow:`0 4px 16px ${r.color}44` }}>
                {r.name[0]}
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:800, color:'#111827' }}>{r.name}</div>
                <div style={{ fontSize:13, color:'#9ca3af' }}>{r.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dots + nav */}
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:16 }}>
          <button onClick={()=>goTo((active-1+REVIEWS.length)%REVIEWS.length)}
            style={{ width:36, height:36, borderRadius:'50%', border:'1.5px solid #e5e7eb',
              background:'#fff', cursor:'pointer', display:'flex', alignItems:'center',
              justifyContent:'center', transition:'all .2s' }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='#c0272d'; e.currentTarget.style.color='#c0272d' }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.color='inherit' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          <div style={{ display:'flex', gap:8 }}>
            {REVIEWS.map((_,i) => (
              <button key={i} onClick={()=>goTo(i)}
                style={{ width: i===active?24:8, height:8, borderRadius:99, border:'none',
                  background: i===active?'#c0272d':'#e5e7eb', cursor:'pointer',
                  transition:'all .35s cubic-bezier(.34,1.56,.64,1)', padding:0 }}/>
            ))}
          </div>

          <button onClick={()=>goTo((active+1)%REVIEWS.length)}
            style={{ width:36, height:36, borderRadius:'50%', border:'1.5px solid #e5e7eb',
              background:'#fff', cursor:'pointer', display:'flex', alignItems:'center',
              justifyContent:'center', transition:'all .2s' }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='#c0272d'; e.currentTarget.style.color='#c0272d' }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.color='inherit' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        {/* Mini preview cards */}
        <div style={{ display:'flex', justifyContent:'center', gap:16, marginTop:28 }}>
          {REVIEWS.map((rev, i) => (
            <div key={i} onClick={()=>goTo(i)}
              style={{ padding:'12px 20px', borderRadius:14, cursor:'pointer',
                border:`1.5px solid ${i===active?rev.color+'44':'#f0f0f0'}`,
                background: i===active?rev.color+'08':'#fff',
                transition:'all .3s', opacity: i===active?1:0.6,
                transform: i===active?'scale(1.04)':'scale(1)' }}>
              <div style={{ fontSize:12, fontWeight:700, color: i===active?rev.color:'#374151' }}>{rev.name}</div>
              <div style={{ fontSize:11, color:'#9ca3af' }}>{rev.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const [recentProducts,  setRecentProducts]  = useState([])
  const [popularProducts, setPopularProducts] = useState([])
  const [categories,      setCategories]      = useState([])
  const [loading,         setLoading]         = useState(true)

  const [featRef,  featVisible]  = useInView()
  const [catRef,   catVisible]   = useInView()
  const [popRef,   popVisible]   = useInView()
  const [whyRef,   whyVisible]   = useInView()
  const [ctaRef,   ctaVisible]   = useInView()

  useEffect(() => {
    Promise.all([
      API.get('/api/products/recent/list'),
      API.get('/api/products/bestsellers/list'),
      API.get('/api/products/categories'),
    ]).then(([rec, best, cats]) => {
      setRecentProducts(rec.data   || [])
      setPopularProducts(best.data || [])
      setCategories(cats.data      || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", overflowX:'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet"/>

      <style>{`
        @keyframes fadeUp    { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeLeft  { from{opacity:0;transform:translateX(-50px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeRight { from{opacity:0;transform:translateX(50px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes scaleIn   { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
        @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes heroGrad  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes marquee   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes shimmer   { from{background-position:200% center} to{background-position:-200% center} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ripple    { 0%{transform:scale(0);opacity:.6} 100%{transform:scale(4);opacity:0} }

        .hero-prod-card {
          background:#fff; border-radius:18px; padding:18px 12px; text-align:center;
          box-shadow:0 2px 16px rgba(0,0,0,.07); border:1.5px solid #f3f4f6;
          transition:all .3s cubic-bezier(.34,1.56,.64,1); text-decoration:none; display:block;
          position:relative; overflow:hidden;
        }
        .hero-prod-card:hover {
          transform:translateY(-10px) scale(1.04);
          box-shadow:0 16px 40px rgba(192,39,45,.18);
          border-color:#fca5a5;
        }
        .hero-prod-card::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(192,39,45,.04),transparent);
          opacity:0; transition:opacity .3s;
        }
        .hero-prod-card:hover::after { opacity:1; }

        .feat-card {
          background:#fff; border-radius:18px; padding:22px 18px;
          display:flex; align-items:center; gap:16px;
          box-shadow:0 2px 12px rgba(0,0,0,.05); border:1.5px solid #f3f4f6;
          transition:all .3s cubic-bezier(.34,1.56,.64,1);
          position:relative; overflow:hidden;
        }
        .feat-card::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(192,39,45,.04),transparent);
          opacity:0; transition:opacity .3s;
        }
        .feat-card:hover { transform:translateY(-6px); box-shadow:0 12px 32px rgba(0,0,0,.1); border-color:#fecaca; }
        .feat-card:hover::before { opacity:1; }
        .feat-card:hover .feat-icon { transform:scale(1.2) rotate(8deg); }
        .feat-icon { transition:transform .3s cubic-bezier(.34,1.56,.64,1); display:flex; align-items:center; justify-content:center; }

        .cat-card {
          flex-shrink:0; width:190px; border-radius:18px; overflow:hidden;
          text-decoration:none; position:relative; display:block;
          box-shadow:0 2px 14px rgba(0,0,0,.1);
          transition:transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s;
        }
        .cat-card:hover { transform:translateY(-8px) scale(1.04); box-shadow:0 16px 40px rgba(0,0,0,.18); }
        .cat-card img { width:100%; height:140px; object-fit:cover; display:block; transition:transform .4s; }
        .cat-card:hover img { transform:scale(1.08); }
        .cat-card-label {
          position:absolute; bottom:0; left:0; right:0;
          background:linear-gradient(0deg,rgba(10,10,40,.9) 0%,transparent 100%);
          padding:32px 14px 14px;
          font-size:13px; font-weight:700; color:#fff; letter-spacing:.2px;
        }

        .why-card {
          background:rgba(255,255,255,.06); border-radius:20px; padding:32px 24px;
          border:1px solid rgba(255,255,255,.1); text-align:center;
          transition:all .35s cubic-bezier(.34,1.56,.64,1); position:relative; overflow:hidden;
        }
        .why-card:hover {
          background:rgba(255,255,255,.12); transform:translateY(-8px);
          border-color:rgba(192,39,45,.4);
          box-shadow:0 20px 40px rgba(0,0,0,.3), 0 0 30px rgba(192,39,45,.15);
        }
        .why-card::before {
          content:''; position:absolute; top:-50%; left:-50%;
          width:200%; height:200%; border-radius:50%;
          background:radial-gradient(circle, rgba(192,39,45,.12) 0%, transparent 60%);
          opacity:0; transition:opacity .4s;
        }
        .why-card:hover::before { opacity:1; }
        .why-icon {
          transition:transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s, background .3s;
        }
        .why-card:hover .why-icon {
          transform:scale(1.18) rotate(-5deg);
          background:rgba(192,39,45,.25) !important;
          box-shadow:0 0 24px rgba(192,39,45,.5);
        }

        .marquee-track { display:flex; gap:18px; animation:marquee 32s linear infinite; width:max-content; }
        .marquee-track:hover { animation-play-state:paused; }

        .section-tag {
          display:inline-block; color:#c0272d; fontWeight:700; fontSize:12px;
          textTransform:uppercase; letterSpacing:1.5px; marginBottom:10px;
          padding:4px 12px; background:#fff0f0; borderRadius:999px;
          border:1px solid #fecaca;
        }

        .view-all-btn {
          display:inline-flex; align-items:center; gap:6px;
          padding:9px 20px; borderRadius:10px;
          background:#fff; color:#c0272d; border:1.5px solid #fca5a5;
          font-size:13px; font-weight:700; textDecoration:none;
          transition:all .2s;
        }
        .view-all-btn:hover { background:#fff0f0; transform:translateY(-2px); }

        .skeleton { background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:16px; }
      `}</style>

      {/* ═══ HERO ═══ */}
      <section style={{
        background:'linear-gradient(135deg,#1a0a0a 0%,#2d0b0b 30%,#0d1240 70%,#060d2e 100%)',
        padding:'60px 0 70px', position:'relative', overflow:'hidden',
      }}>
        {/* Decorative rings */}
        <div style={{ position:'absolute', top:-100, right:-100, width:500, height:500,
          borderRadius:'50%', border:'1px solid rgba(192,39,45,.15)',
          animation:'spin-slow 25s linear infinite' }}/>
        <div style={{ position:'absolute', bottom:-150, left:-100, width:600, height:600,
          borderRadius:'50%', border:'1px solid rgba(255,255,255,.05)',
          animation:'spin-slow 35s linear infinite reverse' }}/>
        <div style={{ position:'absolute', top:'20%', left:'48%', width:120, height:120,
          borderRadius:'50%', background:'rgba(192,39,45,.08)', animation:'float 6s ease-in-out infinite' }}/>

        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>

            {/* Left */}
            <div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8,
                background:'rgba(192,39,45,.15)', border:'1px solid rgba(192,39,45,.3)',
                borderRadius:999, padding:'6px 16px', marginBottom:24,
                animation:'fadeLeft .6s ease forwards' }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:'#c0272d',
                  animation:'pulse 1.5s infinite', display:'inline-block' }}/>
                <span style={{ fontSize:12, fontWeight:700, color:'#fca5a5', letterSpacing:.5 }}>
                  Cambodia's Trusted Supermarket
                </span>
              </div>

              <h1 style={{
                fontFamily:"'Playfair Display',serif",
                fontSize:'clamp(38px,5vw,62px)', fontWeight:900, lineHeight:1.1,
                color:'#fff', marginBottom:20,
                animation:'fadeLeft .7s ease .1s both'
              }}>
                Fresh Groceries,{' '}
                <span style={{
                  background:'linear-gradient(135deg,#c0272d,#f87171,#fca5a5)',
                  backgroundSize:'200% auto', WebkitBackgroundClip:'text',
                  WebkitTextFillColor:'transparent', backgroundClip:'text',
                  animation:'shimmer 3s linear infinite'
                }}>Every Day</span>
                <br/>Delivered Fast
              </h1>

              <p style={{ fontSize:16, color:'rgba(255,255,255,.65)', lineHeight:1.8,
                marginBottom:36, maxWidth:440, animation:'fadeLeft .7s ease .2s both' }}>
                Shop fresh produce, meat, seafood, dairy and everyday essentials — all sourced from trusted Cambodian suppliers.
              </p>

              <div style={{ display:'flex', gap:14, marginBottom:48, flexWrap:'wrap',
                animation:'fadeLeft .7s ease .3s both' }}>
                <Link to="/shop" style={{ display:'inline-flex', alignItems:'center', gap:8,
                  padding:'14px 30px', borderRadius:14,
                  background:'linear-gradient(135deg,#c0272d,#e53935)',
                  color:'#fff', fontWeight:800, fontSize:15, textDecoration:'none',
                  boxShadow:'0 8px 24px rgba(192,39,45,.5)',
                  transition:'all .3s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(192,39,45,.6)' }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 8px 24px rgba(192,39,45,.5)' }}>
                  🛒 Shop Now
                </Link>
                <Link to="/about" style={{ display:'inline-flex', alignItems:'center', gap:8,
                  padding:'14px 30px', borderRadius:14,
                  background:'rgba(255,255,255,.08)', border:'1.5px solid rgba(255,255,255,.2)',
                  color:'#fff', fontWeight:700, fontSize:15, textDecoration:'none',
                  transition:'all .3s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.15)'}
                  onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.08)'}>
                  About Us →
                </Link>
              </div>

              {/* Stats */}
              <div style={{ display:'flex', gap:40, animation:'fadeLeft .7s ease .4s both' }}>
                {[
                  { n:'147', suffix:'',  label:'Products'   },
                  { n:'12',  suffix:'',  label:'Categories' },
                  { n:'100', suffix:'%', label:'In Stock'   },
                ].map(({ n, suffix, label }, i) => (
                  <div key={label} style={{ textAlign:'center' }}>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:32,
                      fontWeight:900, color:'#fff', marginBottom:2, lineHeight:1 }}>
                      <Counter target={n} suffix={suffix} delay={i*250}/>
                    </div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,.5)', fontWeight:600,
                      textTransform:'uppercase', letterSpacing:1 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Recently added products */}
            <div style={{ animation:'fadeRight .8s ease .2s both' }}>
              <div style={{ marginBottom:14, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,.5)',
                  textTransform:'uppercase', letterSpacing:1 }}>Recently Added</span>
                <Link to="/shop" style={{ fontSize:12, color:'#fca5a5', fontWeight:600, textDecoration:'none' }}>View all →</Link>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
                {loading
                  ? [...Array(6)].map((_,i) => <div key={i} className="skeleton" style={{ height:120 }}/>)
                  : recentProducts.slice(0,6).map((p, i) => (
                    <Link to={`/shop/${p.Product_ID}`} key={p.Product_ID} className="hero-prod-card"
                      style={{ animationDelay:`${i*.07}s` }}>
                      {p.Product_Image
                        ? <img src={p.Product_Image} alt={p.Name} style={{ width:48, height:48,
                            objectFit:'cover', borderRadius:10, margin:'0 auto 8px', display:'block' }}/>
                        : <div style={{ fontSize:36, marginBottom:8 }}>🛒</div>
                      }
                      <p style={{ fontSize:11, color:'#374151', fontWeight:700, marginBottom:4, lineHeight:1.3 }}>
                        {p.Name.length > 14 ? p.Name.slice(0,13)+'…' : p.Name}
                      </p>
                      <strong style={{ fontSize:13, color:'#c0272d' }}>
                        ${Number(p.Unit_Price).toFixed(2)}
                      </strong>
                    </Link>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <div ref={featRef} style={{ background:'linear-gradient(180deg,#f8f9fc,#fff)', padding:'28px 0', borderBottom:'1px solid #f3f4f6' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {FEATURES.map((f, i) => (
              <div key={f.title} className="feat-card" style={{
                opacity: featVisible ? 1 : 0,
                animation: featVisible ? `fadeUp .5s ease ${i*.08}s forwards` : 'none'
              }}>
                <div className="feat-icon" style={{ width:50, height:50, borderRadius:14, background:f.bg,
                  fontSize:22, flexShrink:0, border:`1.5px solid ${f.accent}22` }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:800, color:'#111827', marginBottom:3 }}>{f.title}</div>
                  <div style={{ fontSize:12, color:'#9ca3af' }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CATEGORIES MARQUEE ═══ */}
      <section ref={catRef} style={{ padding:'72px 0', background:'linear-gradient(180deg,#fff,#f8f9fc,#f0f2f8)', overflow:'hidden' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px 32px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
            <div style={{
              opacity: catVisible ? 1 : 0,
              animation: catVisible ? 'fadeLeft .6s ease forwards' : 'none'
            }}>
              <span className="section-tag">What We Offer</span>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:900,
                color:'#111827', margin:0 }}>
                Shop by{' '}
                <span style={{ color:'#c0272d' }}>Category</span>
              </h2>
            </div>
            <Link to="/shop" className="view-all-btn" style={{
              opacity: catVisible ? 1 : 0,
              animation: catVisible ? 'fadeRight .6s ease forwards' : 'none'
            }}>Browse All →</Link>
          </div>
        </div>

        <div style={{ position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:100,
            background:'linear-gradient(90deg,#f8f9fc,transparent)', zIndex:2, pointerEvents:'none' }}/>
          <div style={{ position:'absolute', right:0, top:0, bottom:0, width:100,
            background:'linear-gradient(270deg,#f8f9fc,transparent)', zIndex:2, pointerEvents:'none' }}/>
          <div style={{ padding:'8px 0 20px' }}>
            <div className="marquee-track">
              {[...categories, ...categories].map((c, i) => (
                <Link key={`${c.Category_ID}-${i}`} to={`/shop?cat=${encodeURIComponent(c.Category_Name)}`}
                  className="cat-card">
                  <img src={CAT_IMAGES[c.Category_Name] || FALLBACK} alt={c.Category_Name} loading="lazy"
                    onError={e => e.target.src = FALLBACK}/>
                  <div className="cat-card-label">
                    <div>{c.Category_Name}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,.6)', marginTop:2 }}>
                      {c.Category_Name}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ POPULAR PRODUCTS ═══ */}
      <section ref={popRef} style={{ padding:'72px 0', background:'linear-gradient(180deg,#f0f2f8,#fff)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:40 }}>
            <div style={{
              opacity: popVisible ? 1 : 0,
              animation: popVisible ? 'fadeLeft .6s ease forwards' : 'none'
            }}>
              <span className="section-tag">🔥 Top Picks</span>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:900,
                color:'#111827', margin:0 }}>
                Most <span style={{ color:'#c0272d' }}>Popular</span>
              </h2>
              <p style={{ fontSize:14, color:'#9ca3af', marginTop:6 }}>
                Based on customer purchases — what everyone is buying
              </p>
            </div>
            <Link to="/shop" className="view-all-btn" style={{
              opacity: popVisible ? 1 : 0,
              animation: popVisible ? 'fadeRight .6s ease forwards' : 'none'
            }}>View All →</Link>
          </div>

          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:20 }}>
              {[...Array(10)].map((_,i) => <div key={i} className="skeleton" style={{ height:280 }}/>)}
            </div>
          ) : (
            <div className="products-grid">
              {popularProducts.slice(0,10).map((p, i) => (
                <div key={p.Product_ID} style={{
                  opacity: popVisible ? 1 : 0,
                  animation: popVisible ? `scaleIn .5s ease ${i*.05}s forwards` : 'none',
                  position:'relative'
                }}>
                  {i < 3 && (
                    <div style={{ position:'absolute', top:10, left:10, zIndex:10,
                      background: i===0?'#c0272d':i===1?'#6b7280':'#d97706',
                      color:'#fff', fontSize:10, fontWeight:800, padding:'3px 8px',
                      borderRadius:999, letterSpacing:.5 }}>
                      {i===0?'🥇 #1':i===1?'🥈 #2':'🥉 #3'}
                    </div>
                  )}
                  <ProductCard product={p}/>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ WHY CHOOSE US ═══ */}
      <section ref={whyRef} style={{
        padding:'80px 0',
        background:'linear-gradient(180deg,#0a0f35,#0d1240 20%,#1a1f5e 50%,#0d1240 80%,#0a0f35)',
        position:'relative', overflow:'hidden'
      }}>
        <div style={{ position:'absolute', top:-200, right:-200, width:600, height:600,
          borderRadius:'50%', background:'radial-gradient(circle,rgba(192,39,45,.08),transparent 70%)',
          pointerEvents:'none' }}/>

        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px' }}>
          <div style={{ textAlign:'center', marginBottom:56,
            opacity: whyVisible ? 1 : 0,
            animation: whyVisible ? 'fadeUp .6s ease forwards' : 'none' }}>
            <span className="section-tag" style={{ background:'rgba(192,39,45,.15)', border:'1px solid rgba(192,39,45,.3)', color:'#fca5a5' }}>
              Why Choose Us
            </span>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:900,
              color:'#fff', margin:'10px 0 0' }}>
              Your Trusted <span style={{ color:'#c0272d' }}>Supermarket</span>
            </h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
            {[
              { icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
                title:'Quality Guaranteed', desc:'Every product carefully selected and quality checked before reaching your hands.' },
              { icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                title:'Open Every Day', desc:'Open 7 days a week from 7:00 AM to 9:00 PM for your convenience.' },
              { icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
                title:'Loyalty Rewards', desc:'Earn points on every purchase and redeem them for exclusive discounts.' },
              { icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
                title:'Easy Payment', desc:'Pay with ABA, ACLEDA, or Cash — fast, safe and hassle-free checkout.' },
            ].map((w, i) => (
              <div key={w.title} className="why-card" style={{
                opacity: whyVisible ? 1 : 0,
                animation: whyVisible ? `fadeUp .6s ease ${i*.1+.1}s forwards` : 'none'
              }}>
                <div className="why-icon" style={{ width:64, height:64, borderRadius:18,
                  background:'rgba(192,39,45,.12)', border:'1.5px solid rgba(192,39,45,.25)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:28, margin:'0 auto 20px' }}>
                  {w.icon}
                </div>
                <div style={{ fontSize:16, fontWeight:800, color:'#fff', marginBottom:12 }}>{w.title}</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,.5)', lineHeight:1.7 }}>{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══ CUSTOMER REVIEWS ═══ */}
      <ReviewCarousel />

      {/* ═══ CTA ═══ */}
      <section ref={ctaRef} style={{ padding:'80px 0', background:'linear-gradient(180deg,#f8f9fc,#f0f2f8)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px' }}>
          <div style={{
            background:'linear-gradient(135deg,#c0272d 0%,#9b1c1c 50%,#7f1d1d 100%)',
            borderRadius:28, padding:'60px 56px',
            display:'flex', justifyContent:'space-between', alignItems:'center',
            flexWrap:'wrap', gap:32, position:'relative', overflow:'hidden',
            opacity: ctaVisible ? 1 : 0,
            animation: ctaVisible ? 'scaleIn .7s ease forwards' : 'none',
          }}>
            {/* Decorative */}
            <div style={{ position:'absolute', top:-60, right:-60, width:250, height:250,
              borderRadius:'50%', background:'rgba(255,255,255,.05)', pointerEvents:'none' }}/>
            <div style={{ position:'absolute', bottom:-80, right:200, width:300, height:300,
              borderRadius:'50%', background:'rgba(255,255,255,.04)', pointerEvents:'none' }}/>

            <div style={{ position:'relative', zIndex:1 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,.6)',
                textTransform:'uppercase', letterSpacing:1.5, marginBottom:10 }}>
                Start Shopping Today
              </div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:900,
                color:'#fff', marginBottom:10, lineHeight:1.2 }}>
                147 Products.<br/>12 Categories.<br/>All In Stock.
              </h2>
              <p style={{ fontSize:15, color:'rgba(255,255,255,.65)', maxWidth:400, lineHeight:1.7 }}>
                Everything you need for your daily groceries — fresh, quality, and affordable.
              </p>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:14, position:'relative', zIndex:1 }}>
              <Link to="/shop" style={{ display:'inline-flex', alignItems:'center', gap:8,
                padding:'16px 36px', borderRadius:14,
                background:'#fff', color:'#c0272d',
                fontWeight:800, fontSize:16, textDecoration:'none',
                boxShadow:'0 8px 24px rgba(0,0,0,.2)',
                transition:'all .3s' }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,.3)' }}
                onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,.2)' }}>
                🛒 Browse Products
              </Link>
              <Link to="/register" style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
                padding:'14px 36px', borderRadius:14,
                background:'rgba(255,255,255,.12)', border:'1.5px solid rgba(255,255,255,.3)',
                color:'#fff', fontWeight:700, fontSize:15, textDecoration:'none',
                transition:'all .3s' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.2)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.12)'}>
                Create Free Account →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
