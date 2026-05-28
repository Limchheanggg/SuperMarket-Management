import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts, getCategories } from '../services/api'
import ProductCard from '../components/product/ProductCard'

const EMOJIS = {
  Produce:'🥬', Dairy:'🥛', Meat:'🥩', Bakery:'🍞', Beverages:'🧴',
  Snacks:'🍿', Frozen:'🧊', Cleaning:'🧹', 'Fruits & Vegetables':'🍎',
  'Meat & Seafood':'🥩', 'Canned Goods':'🥫', 'Personal Care':'💊',
  Household:'🧹', 'Frozen Foods':'🧊', Seafood:'🐟', Organic:'🌿',
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('popular')
  const [maxPrice, setMaxPrice] = useState(100)
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [view, setView] = useState('grid')
  const debounceRef = useRef(null)

  // ← KEY FIX: read activeCat directly from URL every render
  const activeCat = searchParams.get('cat') || 'All'

  useEffect(() => {
    getProducts()
      .then(res => { if (res.data?.length) setProducts(res.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
    getCategories()
      .then(res => setCategories(res.data || []))
      .catch(() => {})
  }, [])

  // ← KEY FIX: when URL ?cat changes, reset search & price
  useEffect(() => {
    const cat = searchParams.get('cat')
    const s = searchParams.get('search') || ''
    setSearchInput(s)
    setSearch(s)
  }, [searchParams])

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchInput(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setSearch(val), 300)
  }

  const handleClearSearch = () => {
    setSearchInput(''); setSearch('')
    if (debounceRef.current) clearTimeout(debounceRef.current)
  }

  const handleClearAll = () => {
    handleClearSearch()
    setSort('popular')
    setMaxPrice(100)
    setSearchParams({})
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
    <div className="page-enter" style={{fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#f8fafc',minHeight:'100vh'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .sp-cat-btn{display:flex;align-items:center;gap:10px;width:100%;padding:10px 14px;border-radius:10px;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:600;transition:all .2s;text-align:left;background:transparent;color:#374151}
        .sp-cat-btn:hover{background:#f0fdf4;color:#15803d}
        .sp-cat-btn.active{background:linear-gradient(135deg,#dcfce7,#bbf7d0);color:#15803d;border-left:3px solid #16a34a}
        .sp-input{width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:#111;outline:none;transition:all .2s;box-sizing:border-box;background:#fff}
        .sp-input:focus{border-color:#16a34a;box-shadow:0 0 0 3px rgba(22,163,74,.1)}
        .sp-view-btn{width:34px;height:34px;border-radius:8px;border:1.5px solid #e5e7eb;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;background:#fff;transition:all .2s}
        .sp-view-btn.active{background:#f0fdf4;border-color:#86efac;color:#16a34a}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
      `}</style>

      {/* Breadcrumb */}
      <div style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'12px 0'}}>
        <div className="container">
          <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,color:'#6b7280'}}>
            🏠 Home › <strong style={{color:'#111827'}}>Shop</strong>
            {activeCat !== 'All' && <> › <strong style={{color:'#16a34a'}}>{activeCat}</strong></>}
          </span>
        </div>
      </div>

      <div className="container" style={{padding:'28px 24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'260px 1fr',gap:24}}>

          {/* SIDEBAR */}
          <aside style={{background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:18,padding:22,height:'fit-content',position:'sticky',top:20,boxShadow:'0 2px 10px rgba(0,0,0,.04)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:14,borderBottom:'2px solid #f3f4f6',marginBottom:18}}>
              <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:800,color:'#111827'}}>🔽 Filters</h3>
              {activeFilters > 0 && (
                <button onClick={handleClearAll} style={{fontSize:12,color:'#ef4444',fontWeight:700,background:'#fef2f2',border:'1px solid #fecaca',borderRadius:8,padding:'4px 10px',cursor:'pointer'}}>
                  Clear ({activeFilters})
                </button>
              )}
            </div>

            {/* Search */}
            <div style={{marginBottom:22}}>
              <label style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700,color:'#374151',display:'block',marginBottom:8}}>Search</label>
              <div style={{position:'relative'}}>
                <input className="sp-input" placeholder="Product name or brand…" value={searchInput} onChange={handleSearchChange} style={{paddingRight: searchInput ? 36 : 14}} />
                {searchInput && (
                  <button onClick={handleClearSearch} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#9ca3af',fontSize:16,lineHeight:1}}>✕</button>
                )}
              </div>
            </div>

            {/* Category */}
            <div style={{marginBottom:22}}>
              <label style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700,color:'#374151',display:'block',marginBottom:10}}>Category</label>
              <div style={{maxHeight:280,overflowY:'auto',display:'flex',flexDirection:'column',gap:2}}>
                {catNames.map(c => (
                  <button key={c} className={`sp-cat-btn${activeCat===c?' active':''}`}
                    onClick={() => setSearchParams(c === 'All' ? {} : {cat: c})}>
                    <span style={{fontSize:16}}>{EMOJIS[c]||'📦'}</span>
                    <span style={{flex:1}}>{c}</span>
                    <span style={{fontSize:11,color:activeCat===c?'#16a34a':'#9ca3af',fontWeight:600}}>
                      {c==='All' ? products.length : products.filter(p=>p.Category_Name===c).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div style={{marginBottom:22}}>
              <label style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700,color:'#374151',display:'block',marginBottom:10}}>
                Price Range <span style={{float:'right',color:'#16a34a',fontWeight:800}}>${maxPrice}</span>
              </label>
              <input type="range" min={0} max={maxProductPrice} value={maxPrice} onChange={e=>setMaxPrice(+e.target.value)} style={{width:'100%',accentColor:'#16a34a',height:6,cursor:'pointer'}} />
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'#9ca3af',marginTop:6}}>
                <span>$0</span><span>${maxProductPrice}</span>
              </div>
            </div>

            <button onClick={handleClearAll}
              style={{width:'100%',padding:'10px',border:'1.5px solid #e5e7eb',borderRadius:10,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700,color:'#6b7280',cursor:'pointer',background:'#f9fafb',transition:'all .2s'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='#fca5a5';e.currentTarget.style.color='#ef4444'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='#e5e7eb';e.currentTarget.style.color='#6b7280'}}>
              🔄 Reset Filters
            </button>
          </aside>

          {/* PRODUCTS */}
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,padding:'14px 20px',background:'#fff',borderRadius:14,border:'1.5px solid #e5e7eb',boxShadow:'0 2px 8px rgba(0,0,0,.03)',flexWrap:'wrap',gap:10}}>
              <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,color:'#6b7280',fontWeight:500}}>
                {loading ? 'Loading…' : (
                  <><strong style={{color:'#111827'}}>{filtered.length}</strong> of <strong style={{color:'#111827'}}>{products.length}</strong> products
                    {activeCat !== 'All' && <> in <strong style={{color:'#16a34a'}}>{activeCat}</strong></>}
                  </>
                )}
              </span>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <label style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,color:'#6b7280',fontWeight:500}}>Sort:</label>
                <select value={sort} onChange={e=>setSort(e.target.value)}
                  style={{padding:'8px 14px',border:'1.5px solid #e5e7eb',borderRadius:10,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:600,color:'#374151',cursor:'pointer',outline:'none',background:'#fff'}}>
                  <option value="popular">Most Popular</option>
                  <option value="low">Price: Low → High</option>
                  <option value="high">Price: High → Low</option>
                  <option value="name">Name: A–Z</option>
                </select>
                <button className={`sp-view-btn${view==='grid'?' active':''}`} onClick={()=>setView('grid')} title="Grid view">⊞</button>
                <button className={`sp-view-btn${view==='list'?' active':''}`} onClick={()=>setView('list')} title="List view">☰</button>
              </div>
            </div>

            {search && (
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,color:'#6b7280',marginBottom:12}}>
                Found <strong style={{color:'#111827'}}>{filtered.length}</strong> result{filtered.length!==1?'s':''} for "<strong style={{color:'#16a34a'}}>{search}</strong>"
              </div>
            )}

            {loading ? (
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:18}}>
                {[...Array(8)].map((_,i) => (
                  <div key={i} style={{background:'linear-gradient(135deg,#f3f4f6,#e5e7eb)',borderRadius:16,height:280,animation:'pulse 1.5s ease-in-out infinite'}} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{textAlign:'center',padding:'80px 20px',background:'#fff',borderRadius:18,border:'1.5px solid #e5e7eb'}}>
                <div style={{fontSize:64,marginBottom:16}}>🔍</div>
                <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:700,color:'#111827',marginBottom:8}}>No products found</h3>
                <p style={{color:'#6b7280',fontSize:14,marginBottom:20}}>Try adjusting your search or filters.</p>
                <button onClick={handleClearAll}
                  style={{padding:'11px 24px',background:'linear-gradient(135deg,#15803d,#22c55e)',color:'#fff',border:'none',borderRadius:12,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14,cursor:'pointer'}}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div style={{display:'grid',gridTemplateColumns:view==='list'?'1fr':'repeat(4,1fr)',gap:18}}>
                {filtered.map(p => <ProductCard key={p.Product_ID} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
