import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  { Product_ID:11, Name:'Atlantic Salmon', Category_Name:'Meat', Unit_Price:12.99, old_price:15, Unit:'500g', Brand:'SeaFresh', Current_Stock:15 },
  { Product_ID:12, Name:'Avocados', Category_Name:'Produce', Unit_Price:4.49, old_price:5.50, Unit:'x3', Brand:'Tropical', Current_Stock:22 },
]

const CATS = ['All','Produce','Dairy','Meat','Bakery','Beverages','Snacks','Frozen','Cleaning']

export default function Shop() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState(MOCK)
  const [activeCat, setActiveCat] = useState(searchParams.get('cat') || 'All')
  const [sort, setSort] = useState('popular')
  const [maxPrice, setMaxPrice] = useState(50)
  const [search, setSearch] = useState(searchParams.get('search') || '')

  useEffect(() => {
    getProducts().then(res => { if (res.data?.length) setProducts(res.data) }).catch(() => {})
  }, [])

  const filtered = products
    .filter(p => activeCat === 'All' || p.Category_Name === activeCat)
    .filter(p => !search || p.Name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => Number(p.Unit_Price) <= maxPrice)
    .sort((a,b) => sort === 'low' ? a.Unit_Price - b.Unit_Price : sort === 'high' ? b.Unit_Price - a.Unit_Price : 0)

  return (
    <div className="page-enter">
      <div style={{ background:'#F2FCF3', padding:'14px 0', borderBottom:'1px solid #e8e8e8' }}>
        <div className="container"><span style={{ fontSize:13 }}>Home › <strong>Shop</strong></span></div>
      </div>
      <div className="container" style={{ padding:'30px 20px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', gap:24 }}>

          {/* SIDEBAR */}
          <aside style={{ background:'#fff', border:'1.5px solid #e8e8e8', borderRadius:12, padding:20, height:'fit-content' }}>
            <h3 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:16, fontWeight:700, paddingBottom:12, borderBottom:'1px solid #e8e8e8', marginBottom:14 }}>🔍 Filters</h3>

            <div style={{ marginBottom:20 }}>
              <h4 style={{ fontSize:14, fontWeight:700, marginBottom:10 }}>Search</h4>
              <input className="form-input" placeholder="Product name…" value={search} onChange={e=>setSearch(e.target.value)} />
            </div>

            <div style={{ marginBottom:20 }}>
              <h4 style={{ fontSize:14, fontWeight:700, marginBottom:10 }}>Category</h4>
              {CATS.map(c => (
                <label key={c} style={{ display:'flex', alignItems:'center', gap:8, fontSize:14, padding:'5px 0', cursor:'pointer' }}>
                  <input type="radio" name="cat" checked={activeCat===c} onChange={()=>setActiveCat(c)} style={{ accentColor:'#00B207' }} />{c}
                </label>
              ))}
            </div>

            <div style={{ marginBottom:20 }}>
              <h4 style={{ fontSize:14, fontWeight:700, marginBottom:10 }}>Price Range</h4>
              <input type="range" min={0} max={50} value={maxPrice} onChange={e=>setMaxPrice(+e.target.value)} style={{ width:'100%', accentColor:'#00B207' }} />
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#7e7e7e', marginTop:4 }}>
                <span>$0</span><span>Up to ${maxPrice}</span>
              </div>
            </div>
          </aside>

          {/* PRODUCTS */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, padding:'12px 16px', background:'#fff', borderRadius:8, border:'1px solid #e8e8e8' }}>
              <span style={{ fontSize:14, color:'#7e7e7e' }}>Showing <strong>{filtered.length}</strong> results</span>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <label style={{ fontSize:13, color:'#7e7e7e' }}>Sort by:</label>
                <select value={sort} onChange={e=>setSort(e.target.value)} style={{ padding:'7px 12px', border:'1px solid #e8e8e8', borderRadius:6, fontSize:13, fontFamily:'Lato,sans-serif' }}>
                  <option value="popular">Popular</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px', color:'#7e7e7e' }}>
                <div style={{ fontSize:60 }}>🔍</div>
                <p style={{ marginTop:14 }}>No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18 }}>
                {filtered.map(p => <ProductCard key={p.Product_ID} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
