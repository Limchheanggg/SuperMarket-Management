import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

const EMOJIS = { Produce:'🥬', Dairy:'🥛', Meat:'🥩', Bakery:'🍞', Beverages:'🧴', Snacks:'🍿', Frozen:'🧊', Cleaning:'🧹' }

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const emoji = EMOJIS[product.Category_Name] || '🛒'
  const hasDiscount = product.old_price && product.old_price > product.Unit_Price
  const discount = hasDiscount ? Math.round((1 - product.Unit_Price / product.old_price) * 100) : 0

  return (
    <div style={{ background:'#fff', border:'1.5px solid #e8e8e8', borderRadius:12, overflow:'hidden', transition:'all .25s', display:'flex', flexDirection:'column', position:'relative' }}
      onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,.10)'; e.currentTarget.style.borderColor='#00B207'; e.currentTarget.style.transform='translateY(-3px)' }}
      onMouseLeave={e=>{ e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='#e8e8e8'; e.currentTarget.style.transform='none' }}>
      {discount > 0 && <div style={{ position:'absolute', top:10, left:10, background:'#EA4B48', color:'#fff', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99, zIndex:2 }}>-{discount}%</div>}
      <Link to={`/shop/${product.Product_ID}`} style={{ display:'flex', height:170, background:'#F2FCF3', alignItems:'center', justifyContent:'center', fontSize:72, textDecoration:'none' }}>
        {product.Product_Image ? <img src={product.Product_Image} alt={product.Name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : emoji}
      </Link>
      <div style={{ padding:'14px 15px', display:'flex', flexDirection:'column', flex:1 }}>
        <div style={{ fontSize:11, color:'#00B207', fontWeight:700, textTransform:'uppercase', letterSpacing:.5, marginBottom:4 }}>{product.Category_Name}</div>
        <Link to={`/shop/${product.Product_ID}`} style={{ fontSize:14, fontWeight:700, color:'#1a1a1a', marginBottom:4, lineHeight:1.3, textDecoration:'none' }}>{product.Name}</Link>
        <div style={{ fontSize:12, color:'#7e7e7e', marginBottom:8 }}>{product.Unit} · {product.Brand}</div>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
          <strong style={{ color:'#00B207', fontSize:17 }}>${Number(product.Unit_Price).toFixed(2)}</strong>
          {hasDiscount && <del style={{ color:'#aaa', fontSize:13 }}>${Number(product.old_price).toFixed(2)}</del>}
        </div>
        {product.Current_Stock === 0
          ? <div style={{ textAlign:'center', padding:9, fontSize:13, color:'#aaa', background:'#f5f5f5', borderRadius:8, marginTop:'auto', fontWeight:600 }}>Out of Stock</div>
          : <button onClick={() => addItem(product)} style={{ background:'#00B207', color:'#fff', padding:9, fontWeight:700, fontSize:13, borderRadius:8, border:'none', cursor:'pointer', marginTop:'auto', fontFamily:'Lato,sans-serif' }}>+ Add to Cart</button>
        }
      </div>
    </div>
  )
}
