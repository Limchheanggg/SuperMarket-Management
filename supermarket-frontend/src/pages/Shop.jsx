import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts, getCategories } from '../services/api'
import ProductCard from '../components/product/ProductCard'

function useInView(threshold = 0.1) {
  const ref = useRef(); const [v, setV] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if(e.isIntersecting) setV(true) }, { threshold })
    if(ref.current) o.observe(ref.current); return () => o.disconnect()
  }, [])
  return [ref, v]
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [sort,       setSort]       = useState('popular')
  const [maxPrice,   setMaxPrice]   = useState(100)
  const [searchInput,setSearchInput]= useState(searchParams.get('search') || '')
  const [search,     setSearch]     = useState(searchParams.get('search') || '')
  const [view,       setView]       = useState('grid')
  const debounceRef = useRef(null)
  const activeCat   = searchParams.get('cat') || 'All'
  const [headerRef, headerVisible] = useInView(0.1)
  const [gridRef,   gridVisible]   = useInView(0.05)

  useEffect(() => {
    getProducts()
      .then(res => { if(res.data?.length) setProducts(res.data) })
      .catch(() => {}).finally(() => setLoading(false))
    getCategories()
      .then(res => setCategories(res.data || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const s = searchParams.get('search') || ''
    setSearchInput(s); setSearch(s)
  }, [searchParams])

  const handleSearchChange = (e) => {
    const val = e.target.value; setSearchInput(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setSearch(val), 300)
  }

  const handleClearAll = () => {
    setSearchInput(''); setSearch(''); setSort('popular'); setMaxPrice(100); setSearchParams({})
  }

  const catNames = ['All', ...categories.map(c => c.Category_Name)]
  const maxProductPrice = products.length ? Math.ceil(Math.max(...products.map(p => Number(p.Unit_Price)))) : 100

  const filtered = products
    .filter(p => activeCat === 'All' || p.Category_Name === activeCat)
    .filter(p => !search || p.Name.toLowerCase().includes(search.toLowerCase()) || p.Brand?.toLowerCase().includes(search.toLowerCase()))
    .filter(p => Number(p.Unit_Price) <= maxPrice)
    .sort((a,b) => sort==='low' ? a.Unit_Price-b.Unit_Price : sort==='high' ? b.Unit_Price-a.Unit_Price : sort==='name' ? a.Name.localeCompare(b.Name) : 0)

  const activeFilters = [activeCat !== 'All', search !== '', maxPrice < maxProductPrice, sort !== 'popular'].filter(Boolean).length

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#f4f6fa', minHeight:'100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeUp    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeLeft  { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeRight { from{opacity:0;transform:translateX(28px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes shimmer   { from{background-position:200% center} to{background-position:-200% center} }
        @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes scaleIn   { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }

        .shop-sidebar {
          background:#fff; border-radius:20px; padding:24px;
          height:fit-content; position:sticky; top:20px;
          box-shadow:0 4px 24px rgba(0,0,0,.06);
          border:1px solid rgba(0,0,0,.05);
          animation: fadeLeft .5s ease forwards;
        }

        .cat-btn {
          display:flex; align-items:center; justify-content:space-between;
          width:100%; padding:10px 14px; border-radius:10px; border:none;
          cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif;
          font-size:13px; font-weight:600; transition:all .2s;
          background:transparent; color:#4b5563; text-align:left;
          position:relative; overflow:hidden;
        }
        .cat-btn::before {
          content:''; position:absolute; left:0; top:0; bottom:0;
          width:3px; background:#c0272d; border-radius:0 2px 2px 0;
          transform:scaleY(0); transition:transform .2s;
        }
        .cat-btn:hover { background:#fff0f0; color:#c0272d; transform:translateX(3px); }
        .cat-btn:hover::before { transform:scaleY(1); }
        .cat-btn.active { background:linear-gradient(135deg,#fff0f0,#ffe4e4); color:#c0272d; font-weight:700; }
        .cat-btn.active::before { transform:scaleY(1); }

        .search-input {
          width:100%; padding:11px 40px 11px 14px;
          border:1.5px solid #e5e7eb; border-radius:12px;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:13px;
          color:#111; outline:none; transition:all .25s;
          box-sizing:border-box; background:#f9fafb;
        }
        .search-input:focus { border-color:#c0272d; box-shadow:0 0 0 3px rgba(192,39,45,.1); background:#fff; }

        .toolbar {
          display:flex; justify-content:space-between; align-items:center;
          padding:14px 20px; background:#fff; border-radius:14px;
          box-shadow:0 2px 12px rgba(0,0,0,.04); margin-bottom:20px;
          border:1px solid rgba(0,0,0,.05); flex-wrap:wrap; gap:10px;
          animation: slideDown .4s ease forwards;
        }

        .view-btn {
          width:36px; height:36px; border-radius:10px;
          border:1.5px solid #e5e7eb; display:flex; align-items:center;
          justify-content:center; cursor:pointer; background:#fff;
          transition:all .2s; color:#6b7280;
        }
        .view-btn.active { background:#fff0f0; border-color:#fca5a5; color:#c0272d; }
        .view-btn:hover  { border-color:#fca5a5; color:#c0272d; }

        .sort-select {
          padding:9px 16px; border:1.5px solid #e5e7eb; border-radius:10px;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:13px;
          font-weight:600; color:#374151; cursor:pointer; outline:none;
          background:#fff; transition:all .2s;
        }
        .sort-select:focus { border-color:#c0272d; }

        .skeleton-card {
          background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);
          background-size:200% 100%; animation:shimmer 1.5s infinite;
          border-radius:18px; height:300px;
        }

        .product-item { animation:scaleIn .45s ease both; }

        .price-range-track {
          width:100%; height:6px; border-radius:99px; outline:none;
          cursor:pointer; appearance:none; -webkit-appearance:none;
        }
        .price-range-track::-webkit-slider-thumb {
          appearance:none; width:18px; height:18px; border-radius:50%;
          background:#c0272d; box-shadow:0 2px 8px rgba(192,39,45,.4);
          cursor:pointer; border:2px solid #fff; transition:transform .2s;
        }
        .price-range-track::-webkit-slider-thumb:hover { transform:scale(1.2); }

        .filter-label {
          font-size:11px; font-weight:800; color:#9ca3af;
          text-transform:uppercase; letter-spacing:1.2px;
          display:block; margin-bottom:10px;
        }

        .products-grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
        .products-grid-list { display:grid; grid-template-columns:1fr; gap:14px; }

        .empty-state {
          text-align:center; padding:80px 20px; background:#fff;
          border-radius:20px; border:1px solid rgba(0,0,0,.06);
          box-shadow:0 4px 24px rgba(0,0,0,.04);
          animation:fadeUp .5s ease forwards;
        }

        .result-tag {
          background:#fff0f0; color:#c0272d; border-radius:99px;
          padding:2px 10px; font-size:12px; font-weight:700;
          border:1px solid #fecaca; margin-left:8px;
        }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ background:'#fff', borderBottom:'1px solid #eee', padding:'12px 0' }}>
        <div className="container">
          <span style={{ fontSize:13, color:'#9ca3af' }}>
            Home ›{' '}
            <strong style={{ color:'#111827' }}>Shop</strong>
            {activeCat !== 'All' && <> › <strong style={{ color:'#c0272d' }}>{activeCat}</strong></>}
          </span>
        </div>
      </div>

      {/* Page Header */}
      <div ref={headerRef} style={{
        background:'linear-gradient(135deg,#1a0505 0%,#2d0b0b 40%,#0d1240 100%)',
        padding:'36px 0 32px',
      }}>
        <div className="container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
            <div style={{
              opacity:headerVisible?1:0,
              animation:headerVisible?'fadeLeft .6s ease forwards':'none'
            }}>
              <h1 style={{
                fontFamily:"'Playfair Display',serif",
                fontSize:'clamp(26px,4vw,38px)', fontWeight:900, color:'#fff',
                margin:'0 0 6px'
              }}>
                Our{' '}
                <span style={{ background:'linear-gradient(135deg,#c0272d,#f87171)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  Products
                </span>
              </h1>
              <p style={{ color:'rgba(255,255,255,.45)', fontSize:14, margin:0 }}>
                {loading ? 'Loading…' : `${products.length} products across ${categories.length} categories`}
              </p>
            </div>

            <div style={{ display:'flex', gap:24,
              opacity:headerVisible?1:0,
              animation:headerVisible?'fadeRight .6s ease .1s forwards':'none' }}>
              {[
                { label:'In Stock',   value: loading?'—':products.filter(p=>p.Current_Stock>0).length },
                { label:'Categories', value: loading?'—':categories.length },
                { label:'Brands',     value: loading?'—':[...new Set(products.map(p=>p.Brand).filter(Boolean))].length },
              ].map(s => (
                <div key={s.label} style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, color:'#fff' }}>{s.value}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,.4)', fontWeight:600,
                    textTransform:'uppercase', letterSpacing:1 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'28px 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:24 }}>

          {/* SIDEBAR */}
          <aside className="shop-sidebar">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h3 style={{ fontSize:15, fontWeight:800, color:'#111827', margin:0 }}>Filters</h3>
              {activeFilters > 0 && (
                <button onClick={handleClearAll} style={{ fontSize:12, color:'#c0272d', fontWeight:700,
                  background:'#fff0f0', border:'1px solid #fecaca', borderRadius:8,
                  padding:'4px 10px', cursor:'pointer', transition:'all .2s' }}>
                  Clear ({activeFilters})
                </button>
              )}
            </div>

            {/* Search */}
            <div style={{ marginBottom:22 }}>
              <label className="filter-label">Search</label>
              <div style={{ position:'relative' }}>
                <svg style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input className="search-input" style={{ paddingLeft:36 }}
                  placeholder="Product name or brand…"
                  value={searchInput} onChange={handleSearchChange}/>
                {searchInput && (
                  <button onClick={()=>{ setSearchInput(''); setSearch('') }}
                    style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)',
                      background:'none', border:'none', cursor:'pointer', color:'#9ca3af', fontSize:16 }}>✕</button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div style={{ marginBottom:22 }}>
              <label className="filter-label">Category</label>
              <div style={{ maxHeight:300, overflowY:'auto', display:'flex', flexDirection:'column', gap:2 }}>
                {catNames.map((c,i) => {
                  const count = c==='All' ? products.length : products.filter(p=>p.Category_Name===c).length
                  return (
                    <button key={c} className={`cat-btn${activeCat===c?' active':''}`}
                      onClick={()=>setSearchParams(c==='All'?{}:{cat:c})}
                      style={{ animationDelay:`${i*.03}s` }}>
                      <span>{c}</span>
                      <span style={{ fontSize:11, fontWeight:700,
                        color:activeCat===c?'#c0272d':'#d1d5db',
                        background:activeCat===c?'#ffe4e4':'#f3f4f6',
                        borderRadius:99, padding:'2px 8px', transition:'all .2s' }}>{count}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Price */}
            <div style={{ marginBottom:24 }}>
              <label className="filter-label">Price Range</label>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                <span style={{ fontSize:13, color:'#9ca3af' }}>$0</span>
                <span style={{ fontSize:14, fontWeight:800, color:'#c0272d' }}>${maxPrice}</span>
              </div>
              <input type="range" min={0} max={maxProductPrice} value={maxPrice}
                onChange={e=>setMaxPrice(+e.target.value)}
                className="price-range-track"
                style={{ background:`linear-gradient(90deg,#c0272d ${(maxPrice/maxProductPrice)*100}%,#e5e7eb ${(maxPrice/maxProductPrice)*100}%)` }}/>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#d1d5db', marginTop:6 }}>
                <span>$0</span><span>${maxProductPrice}</span>
              </div>
            </div>

            <button onClick={handleClearAll} style={{ width:'100%', padding:'11px',
              border:'1.5px solid #e5e7eb', borderRadius:12,
              fontSize:13, fontWeight:700, color:'#6b7280', cursor:'pointer',
              background:'#f9fafb', transition:'all .2s', fontFamily:"'Plus Jakarta Sans',sans-serif" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='#fca5a5'; e.currentTarget.style.color='#c0272d'; e.currentTarget.style.background='#fff0f0' }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.color='#6b7280'; e.currentTarget.style.background='#f9fafb' }}>
              Reset Filters
            </button>
          </aside>

          {/* MAIN */}
          <div>
            {/* Toolbar */}
            <div className="toolbar">
              <div style={{ fontSize:14, color:'#6b7280', fontWeight:500 }}>
                {loading ? (
                  <span style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
                    <svg style={{ animation:'spin 1s linear infinite' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Loading products…
                  </span>
                ) : (
                  <>
                    <strong style={{ color:'#111827', fontSize:16 }}>{filtered.length}</strong>
                    <span style={{ color:'#9ca3af' }}> of {products.length} products</span>
                    {activeCat !== 'All' && <span className="result-tag">{activeCat}</span>}
                    {search && <span className="result-tag">"{search}"</span>}
                  </>
                )}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:13, color:'#9ca3af' }}>Sort:</span>
                <select className="sort-select" value={sort} onChange={e=>setSort(e.target.value)}>
                  <option value="popular">Most Popular</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
                <button className={`view-btn${view==='grid'?' active':''}`} onClick={()=>setView('grid')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                  </svg>
                </button>
                <button className={`view-btn${view==='list'?' active':''}`} onClick={()=>setView('list')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="8" y1="6" x2="21" y2="6"/>
                    <line x1="8" y1="12" x2="21" y2="12"/>
                    <line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/>
                    <line x1="3" y1="12" x2="3.01" y2="12"/>
                    <line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="products-grid-4">
                {[...Array(8)].map((_,i) => <div key={i} className="skeleton-card"/>)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div style={{ width:72, height:72, borderRadius:'50%', background:'#f9fafb',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  margin:'0 auto 20px' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <h3 style={{ fontSize:20, fontWeight:800, color:'#111827', marginBottom:8 }}>No products found</h3>
                <p style={{ color:'#9ca3af', fontSize:14, marginBottom:24 }}>Try adjusting your search or filters.</p>
                <button onClick={handleClearAll} style={{ padding:'12px 28px',
                  background:'linear-gradient(135deg,#c0272d,#e53935)', color:'#fff',
                  border:'none', borderRadius:12, fontWeight:700, fontSize:14, cursor:'pointer',
                  boxShadow:'0 4px 14px rgba(192,39,45,.3)' }}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div ref={gridRef} className={view==='list'?'products-grid-list':'products-grid-4'}>
                {filtered.map((p,i) => (
                  <div key={p.Product_ID} className="product-item"
                    style={{ animationDelay:`${Math.min(i,16)*.04}s` }}>
                    <ProductCard product={p}/>
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
