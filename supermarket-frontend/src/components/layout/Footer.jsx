import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background:'#111827', color:'#9ca3af', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Newsletter */}
      <div style={{ background:'#1a1f5e', padding:'48px 20px', textAlign:'center' }}>
        <div className="container">
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:48, height:48, borderRadius:14, background:'rgba(192,39,45,.2)', border:'1.5px solid rgba(192,39,45,.3)', marginBottom:16 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, fontWeight:800, color:'#fff', marginBottom:8, letterSpacing:-.3 }}>
            Subscribe to Our Newsletter
          </h3>
          <p style={{ color:'rgba(255,255,255,.55)', fontSize:14, marginBottom:24 }}>
            Get weekly deals, seasonal promotions, and new arrival alerts.
          </p>
          <form style={{ display:'flex', maxWidth:440, margin:'0 auto', borderRadius:12, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,.3)' }} onSubmit={e=>e.preventDefault()}>
            <input type="email" placeholder="Enter your email address..."
              style={{ flex:1, padding:'13px 18px', background:'rgba(255,255,255,.08)', border:'none', color:'#fff', fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif", outline:'none' }} />
            <button style={{ background:'linear-gradient(135deg,#c0272d,#e53935)', color:'#fff', padding:'0 24px', fontWeight:700, border:'none', cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14, whiteSpace:'nowrap' }}>
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div style={{ padding:'56px 0 44px' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:44 }}>

            {/* Brand */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
                <div style={{ width:40, height:40, borderRadius:11, background:'linear-gradient(135deg,#1a1f5e,#2d3491)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="4" height="18" rx="1" fill="white" opacity=".9"/>
                    <rect x="10" y="8" width="4" height="13" rx="1" fill="#c0272d"/>
                    <rect x="17" y="1" width="4" height="20" rx="1" fill="white" opacity=".9"/>
                    <rect x="2" y="21" width="20" height="1.5" rx=".75" fill="#c0272d"/>
                  </svg>
                </div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, fontWeight:800, lineHeight:1 }}>
                  <span style={{ color:'#fff' }}>AMS</span><span style={{ color:'#c0272d' }}> Mart</span>
                </div>
              </div>
              <p style={{ fontSize:13, lineHeight:1.9, color:'#6b7280', marginBottom:20, maxWidth:260 }}>
                Your trusted supermarket for quality groceries and everyday essentials in Cambodia.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:10, fontSize:13 }}>
                {[
                  [<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.58 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.69a16 16 0 0 0 6.29 6.29l1.42-1.42a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, '+855 12 345 678'],
                  [<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, 'hello@amsmart.kh'],
                  [<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, '344 Street 271, Phnom Penh'],
                ].map(([icon, text], i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, color:'#6b7280' }}>
                    <span style={{ flexShrink:0 }}>{icon}</span>{text}
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title:'My Account', links:[['Sign In','/login'],['Dashboard','/dashboard'],['Orders','/orders'],['Wishlist','/wishlist']] },
              { title:'Quick Links', links:[['About Us','/about'],['Shop','/shop'],['Contact','/contact'],['FAQ','/faq']] },
              { title:'Categories',  links:[['Produce','/shop?cat=Produce'],['Dairy','/shop?cat=Dairy'],['Meat','/shop?cat=Meat'],['Bakery','/shop?cat=Bakery']] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14, fontWeight:800, color:'#fff', marginBottom:18, letterSpacing:.3, textTransform:'uppercase' }}>
                  {col.title}
                </h4>
                <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                  {col.links.map(([label, to]) => (
                    <li key={label} style={{ marginBottom:11 }}>
                      <Link to={to} style={{ fontSize:13, color:'#6b7280', textDecoration:'none', transition:'color .2s', display:'inline-flex', alignItems:'center', gap:7 }}
                        onMouseEnter={e=>e.target.style.color='#c0272d'}
                        onMouseLeave={e=>e.target.style.color='#6b7280'}>
                        <span style={{ width:4, height:4, borderRadius:'50%', background:'#374151', display:'inline-block', flexShrink:0 }}/>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop:'1px solid #1f2937', padding:'18px 0' }}>
        <div className="container" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <p style={{ fontSize:12, color:'#4b5563' }}>
            © 2025 AMS Mart — Group 3 · CHHAY Lyveng · KHUN Limchheang · HORN Hengveasna
          </p>
          <div style={{ display:'flex', gap:8 }}>
            {['ABA','VISA','ACLEDA','COD'].map(p => (
              <span key={p} style={{ background:'#1f2937', borderRadius:6, padding:'5px 12px', fontSize:11, color:'#6b7280', fontWeight:700, letterSpacing:.5 }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
