import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../services/api'
import ProductCard from '../components/product/ProductCard'

const MOCK = [
  { Product_ID:1, Name:'Organic Tomatoes', Category_Name:'Produce', Unit_Price:2.49, Unit:'1kg', Brand:'Green Valley', Current_Stock:85 },
  { Product_ID:2, Name:'Fresh Whole Milk', Category_Name:'Dairy', Unit_Price:1.89, Unit:'1L', Brand:'Sunrise Dairy', Current_Stock:12 },
  { Product_ID:3, Name:'Sourdough Loaf', Category_Name:'Bakery', Unit_Price:4.50, old_price:5.00, Unit:'500g', Brand:'Artisan Bakers', Current_Stock:28 },
  { Product_ID:4, Name:'Free Range Chicken', Category_Name:'Meat', Unit_Price:8.99, old_price:10.50, Unit:'1kg', Brand:'Premium Meats', Current_Stock:5 },
  { Product_ID:5, Name:'Orange Juice', Category_Name:'Beverages', Unit_Price:3.29, Unit:'1.5L', Brand:'Citrus Grove', Current_Stock:60 },
  { Product_ID:6, Name:'Frozen Pizza', Category_Name:'Frozen', Unit_Price:5.99, old_price:7.50, Unit:'350g', Brand:'FrozenBest', Current_Stock:44 },
  { Product_ID:7, Name:'Potato Chips', Category_Name:'Snacks', Unit_Price:2.19, Unit:'200g', Brand:'CrunchCo', Current_Stock:110 },
  { Product_ID:8, Name:'Free Range Eggs', Category_Name:'Dairy', Unit_Price:3.99, old_price:4.50, Unit:'x12', Brand:'Happy Hen', Current_Stock:8 },
  { Product_ID:9, Name:'Broccoli Florets', Category_Name:'Produce', Unit_Price:1.79, Unit:'500g', Brand:'Green Valley', Current_Stock:55 },
  { Product_ID:10, Name:'Greek Yoghurt', Category_Name:'Dairy', Unit_Price:2.79, old_price:3.50, Unit:'400g', Brand:'Sunrise', Current_Stock:40 },
]

const CATS = [
  {name:'Produce',emoji:'🥬',count:24},{name:'Dairy',emoji:'🥛',count:12},
  {name:'Meat',emoji:'🥩',count:8},{name:'Bakery',emoji:'🍞',count:10},
  {name:'Beverages',emoji:'🧴',count:15},{name:'Snacks',emoji:'🍿',count:20},
  {name:'Frozen',emoji:'🧊',count:9},{name:'Cleaning',emoji:'🧹',count:6},
  {name:'Fruits',emoji:'🍎',count:18},{name:'Organic',emoji:'🌿',count:30},
  {name:'Seafood',emoji:'🐟',count:7},{name:'Herbs',emoji:'🌱',count:11},
]

export default function Home() {
  const [products, setProducts] = useState(MOCK)

  useEffect(() => {
    getProducts({ limit: 10 })
      .then(res => { if (res.data?.length) setProducts(res.data) })
      .catch(() => {})
  }, [])

  return (
    <div className="page-enter">
      {/* HERO */}
      <section style={{ background:'linear-gradient(135deg,#f0fdf0 0%,#e8f5e9 100%)', padding:'64px 0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center' }}>
            <div>
              <div style={{ display:'inline-block', background:'#FF8C00', color:'#fff', fontSize:12, fontWeight:700, padding:'5px 16px', borderRadius:99, letterSpacing:.5, textTransform:'uppercase', marginBottom:16 }}>🌿 100% Organic & Natural</div>
              <h1 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:46, fontWeight:700, lineHeight:1.18, color:'#1a1a1a', marginBottom:14 }}>
                Fresh & Healthy<br/><span style={{ color:'#00B207' }}>Organic Food</span><br/>Delivered to You
              </h1>
              <p style={{ color:'#7e7e7e', fontSize:16, lineHeight:1.7, marginBottom:28 }}>Get the freshest produce, dairy, meat, and more — sourced directly from local Cambodian farms.</p>
              <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
                <Link to="/shop" className="btn btn-primary">🛒 Shop Now</Link>
                <Link to="/about" className="btn btn-outline">Learn More</Link>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {[{e:'🍅',n:'Tomatoes',p:'$2.49/kg'},{e:'🥦',n:'Broccoli',p:'$1.79/kg'},{e:'🍎',n:'Apples',p:'$3.99/kg'},{e:'🥕',n:'Carrots',p:'$1.29/kg'},{e:'🍊',n:'Oranges',p:'$2.99/kg'},{e:'🥑',n:'Avocado',p:'$4.49/ea'}].map(f => (
                <div key={f.n} style={{ background:'#fff', borderRadius:12, padding:'18px 12px', textAlign:'center', boxShadow:'0 4px 15px rgba(0,0,0,.06)', transition:'transform .3s, box-shadow .3s', cursor:'default' }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(0,178,7,.15)' }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 15px rgba(0,0,0,.06)' }}>
                  <div style={{ fontSize:44, marginBottom:8 }}>{f.e}</div>
                  <p style={{ fontSize:12, color:'#7e7e7e', fontWeight:600 }}>{f.n}</p>
                  <strong style={{ fontSize:14, color:'#00B207' }}>{f.p}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div style={{ background:'#fff', borderTop:'1px solid #e8e8e8', borderBottom:'1px solid #e8e8e8', padding:'18px 0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
            {[{i:'🚚',t:'Free Delivery',s:'On orders over $50'},{i:'🔒',t:'Secure Payment',s:'100% safe & secure'},{i:'🌿',t:'Organic Products',s:'Certified organic'},{i:'↩️',t:'Easy Returns',s:'30-day policy'}].map(item => (
              <div key={item.t} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:46, height:46, background:'#F2FCF3', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{item.i}</div>
                <div>
                  <h4 style={{ fontSize:14, fontWeight:700, fontFamily:"'Josefin Sans',sans-serif" }}>{item.t}</h4>
                  <p style={{ fontSize:12, color:'#7e7e7e' }}>{item.s}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Popular <span>Categories</span></h2>
            <Link to="/shop" className="btn btn-outline btn-sm">View All →</Link>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:14 }}>
            {CATS.map(c => (
              <Link to={`/shop?cat=${c.name}`} key={c.name} style={{ background:'#F2FCF3', borderRadius:12, padding:'20px 12px', textAlign:'center', border:'1.5px solid transparent', transition:'all .25s', display:'flex', flexDirection:'column', alignItems:'center', textDecoration:'none' }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='#00B207'; e.currentTarget.style.background='#fff'; e.currentTarget.style.boxShadow='0 4px 14px rgba(0,178,7,.12)'; e.currentTarget.style.transform='translateY(-2px)' }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.background='#F2FCF3'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none' }}>
                <div style={{ fontSize:36, marginBottom:8 }}>{c.emoji}</div>
                <p style={{ fontSize:12, fontWeight:700, color:'#1a1a1a' }}>{c.name}</p>
                <small style={{ fontSize:11, color:'#7e7e7e' }}>{c.count} items</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR PRODUCTS */}
      <section className="section" style={{ background:'#F2FCF3' }}>
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Popular <span>Products</span></h2>
            <Link to="/shop" className="btn btn-outline btn-sm">View All →</Link>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:18 }}>
            {products.slice(0,10).map(p => <ProductCard key={p.Product_ID} product={p} />)}
          </div>
        </div>
      </section>

      {/* DEAL BANNER */}
      <section style={{ background:'linear-gradient(135deg,#1a1a1a 0%,#2d4a1e 100%)', padding:'56px 0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center' }}>
            <div>
              <div style={{ color:'#FF8C00', fontWeight:700, fontSize:12, textTransform:'uppercase', letterSpacing:1, marginBottom:12 }}>⚡ Limited Time Offer</div>
              <h2 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:38, fontWeight:700, color:'#fff', lineHeight:1.2, marginBottom:14 }}>Sale of the <span style={{ color:'#00B207' }}>Month</span></h2>
              <p style={{ color:'#aaa', fontSize:15, marginBottom:24 }}>Fresh deals on your favourite organic groceries. Don't miss out!</p>
              <Link to="/shop" className="btn btn-primary">Shop Deals</Link>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
              {products.filter(p=>p.old_price).slice(0,3).map(p => (
                <Link to={`/shop/${p.Product_ID}`} key={p.Product_ID} style={{ background:'rgba(255,255,255,.07)', borderRadius:10, padding:'18px 14px', textAlign:'center', border:'1px solid rgba(255,255,255,.08)', transition:'all .2s', display:'block', color:'#fff', textDecoration:'none' }}
                  onMouseEnter={e=>{ e.currentTarget.style.background='rgba(0,178,7,.15)'; e.currentTarget.style.borderColor='#00B207' }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,.07)'; e.currentTarget.style.borderColor='rgba(255,255,255,.08)' }}>
                  <div style={{ fontSize:48, marginBottom:8 }}>🥬</div>
                  <p style={{ fontSize:13, color:'#ddd', fontWeight:600, marginBottom:4 }}>{p.Name}</p>
                  <strong style={{ color:'#00B207', fontSize:15 }}>${Number(p.Unit_Price).toFixed(2)}</strong>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" style={{ background:'#F2FCF3' }}>
        <div className="container" style={{ textAlign:'center' }}>
          <h2 className="section-title" style={{ marginBottom:8 }}>What Our <span>Customers Say</span></h2>
          <p style={{ color:'#7e7e7e', marginBottom:32 }}>Real feedback from happy shoppers</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {[{name:'Lyveng C.',role:'Student, AITC',text:'FreshMart has the freshest produce in Phnom Penh. The loyalty points are a great bonus!',stars:5},{name:'Limchheang K.',role:'Engineer',text:'Orders tracked perfectly and delivery always on time. Great system!',stars:5},{name:'Hengveasna H.',role:'Data Analyst',text:'Love the category filters and real stock availability. Great tech!',stars:4}].map(t => (
              <div key={t.name} className="card" style={{ textAlign:'left' }}>
                <div style={{ color:'#FF8C00', marginBottom:10 }}>{'★'.repeat(t.stars)}{'☆'.repeat(5-t.stars)}</div>
                <p style={{ color:'#7e7e7e', fontSize:14, lineHeight:1.7, marginBottom:14 }}>"{t.text}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:'#00B207', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700 }}>{t.name[0]}</div>
                  <div><strong style={{ fontSize:14 }}>{t.name}</strong><p style={{ fontSize:12, color:'#7e7e7e' }}>{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
