import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'
const MOCK = { Product_ID:1, Name:'Organic Tomatoes', Category_Name:'Produce', Unit_Price:2.49, Unit:'1kg', Brand:'Green Valley', Current_Stock:85, Description:'Sun-ripened organic tomatoes from Cambodian farms.' }
const EMOJIS = { Produce:'🥬', Dairy:'🥛', Meat:'🥩', Bakery:'🍞', Beverages:'🧴', Snacks:'🍿', Frozen:'🧊' }
export default function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('desc')
  const product = MOCK
  const emoji = EMOJIS[product.Category_Name] || '🛒'
  const tabBtn = (t,l) => <button onClick={()=>setTab(t)} style={{ padding:'11px 22px', fontFamily:"'Josefin Sans',sans-serif", fontSize:14, fontWeight:600, cursor:'pointer', border:'none', background:'none', borderBottom:tab===t?'3px solid #00B207':'3px solid transparent', color:tab===t?'#00B207':'#7e7e7e', marginBottom:-2 }}>{l}</button>
  return (
    <div className="page-enter">
      <div style={{ background:'#F2FCF3', padding:'14px 0', borderBottom:'1px solid #e8e8e8' }}>
        <div className="container"><Link to="/" style={{ color:'#00B207' }}>Home</Link> › <Link to="/shop" style={{ color:'#00B207' }}>Shop</Link> › <strong>{product.Name}</strong></div>
      </div>
      <div className="container" style={{ padding:'40px 20px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, marginBottom:48 }}>
          <div style={{ background:'#F2FCF3', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:130, minHeight:360 }}>{emoji}</div>
          <div>
            <p style={{ color:'#00B207', fontWeight:700, fontSize:12, textTransform:'uppercase', marginBottom:6 }}>{product.Category_Name}</p>
            <h1 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:28, fontWeight:700, marginBottom:10 }}>{product.Name}</h1>
            <div style={{ color:'#FF8C00', marginBottom:10 }}>★★★★★ <span style={{ color:'#7e7e7e', fontSize:13 }}>(124 reviews)</span></div>
            <div style={{ fontSize:30, fontWeight:700, color:'#00B207', marginBottom:14 }}>${Number(product.Unit_Price).toFixed(2)}</div>
            <p style={{ color:'#7e7e7e', fontSize:14, lineHeight:1.8, marginBottom:18 }}>{product.Description}</p>
            <div style={{ display:'flex', gap:14, alignItems:'center', marginBottom:20 }}>
              <div style={{ display:'flex', alignItems:'center', border:'1.5px solid #e8e8e8', borderRadius:8, overflow:'hidden' }}>
                <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{ padding:'10px 16px', background:'#f5f5f5', border:'none', cursor:'pointer', fontSize:18 }}>−</button>
                <span style={{ padding:'10px 20px', fontWeight:700, fontSize:16 }}>{qty}</span>
                <button onClick={()=>setQty(q=>q+1)} style={{ padding:'10px 16px', background:'#f5f5f5', border:'none', cursor:'pointer', fontSize:18 }}>+</button>
              </div>
              <button className="btn btn-primary" onClick={()=>{for(let i=0;i<qty;i++)addItem(product)}}>🛒 Add to Cart</button>
              <button className="btn btn-outline" onClick={()=>toast.success('Added to wishlist!')}>♡</button>
cat > index.html << 'ENDOFFILE'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FreshMart — Fresh & Organic</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
