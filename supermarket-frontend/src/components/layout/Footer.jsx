import { Link } from 'react-router-dom'
export default function Footer() {
  return (
    <footer style={{ background:'#1a1a1a', color:'#aaa' }}>
      <div style={{ background:'#2a2a2a', padding:'44px 20px', textAlign:'center' }}>
        <div className="container">
          <h3 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:22, color:'#fff', marginBottom:8 }}>🌿 Subscribe to Our Newsletter</h3>
          <p style={{ color:'#888', fontSize:14, marginBottom:20 }}>Get weekly deals, seasonal recipes, and fresh arrival alerts.</p>
          <form style={{ display:'flex', maxWidth:420, margin:'0 auto', borderRadius:8, overflow:'hidden' }} onSubmit={e=>e.preventDefault()}>
            <input type="email" placeholder="Enter your email…" style={{ flex:1, padding:'12px 16px', background:'#1a1a1a', border:'none', color:'#fff', fontSize:14, fontFamily:'Lato,sans-serif' }} />
            <button style={{ background:'#00B207', color:'#fff', padding:'0 22px', fontWeight:700, border:'none', cursor:'pointer', fontFamily:'Lato,sans-serif' }}>Subscribe</button>
          </form>
        </div>
      </div>
      <div style={{ padding:'50px 0 40px' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:40 }}>
            <div>
              <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:26, fontWeight:700, color:'#fff', marginBottom:14 }}>Fresh<span style={{ color:'#00B207' }}>Mart</span></div>
              <p style={{ fontSize:13, lineHeight:1.8, color:'#777', marginBottom:16 }}>Your trusted source for fresh, organic groceries in Cambodia.</p>
              <div style={{ display:'flex', flexDirection:'column', gap:6, fontSize:13 }}>
                <span>📞 +855 12 345 678</span><span>✉️ hello@freshmart.kh</span><span>📍 344 Street 271, Phnom Penh</span>
              </div>
            </div>
            {[
              { title:'My Account', links:[['Sign In','/login'],['Dashboard','/dashboard'],['Orders','/orders'],['Wishlist','/wishlist']] },
              { title:'Quick Links', links:[['About Us','/about'],['Shop','/shop'],['Contact','/contact'],['FAQ','/faq']] },
              { title:'Categories', links:[['🥬 Produce','/shop?cat=Produce'],['🥛 Dairy','/shop?cat=Dairy'],['🥩 Meat','/shop?cat=Meat'],['🍞 Bakery','/shop?cat=Bakery']] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:15, fontWeight:700, color:'#fff', marginBottom:16 }}>{col.title}</h4>
                <ul>{col.links.map(([label, to]) => <li key={label} style={{ marginBottom:9 }}><Link to={to} style={{ fontSize:13, color:'#777', textDecoration:'none' }}>{label}</Link></li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ borderTop:'1px solid #2a2a2a', padding:'16px 0' }}>
        <div className="container" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
          <p style={{ fontSize:12, color:'#555' }}>© 2025 FreshMart — Group 3 · CHHAY Lyveng · KHUN Limchheang · HORN Hengveasna</p>
          <div style={{ display:'flex', gap:8 }}>
            {['ABA','VISA','WING','COD'].map(p => <span key={p} style={{ background:'#2a2a2a', borderRadius:4, padding:'4px 10px', fontSize:11, color:'#888', fontWeight:700 }}>{p}</span>)}
          </div>
        </div>
      </div>
    </footer>
  )
}
