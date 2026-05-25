export default function About() {
  return (
    <div className="page-enter">
      <div style={{ background:'#00B207', padding:'60px 0', textAlign:'center' }}>
        <h1 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:44, fontWeight:700, color:'#fff', marginBottom:10 }}>About FreshMart</h1>
        <p style={{ color:'rgba(255,255,255,.8)', fontSize:16 }}>Cambodia's leading organic grocery marketplace</p>
      </div>
      <div className="container" style={{ padding:'60px 20px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:50, alignItems:'center', marginBottom:60 }}>
          <div>
            <h2 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:30, fontWeight:700, marginBottom:16 }}>Bringing Farm-Fresh Goodness to Your Table</h2>
            <p style={{ color:'#7e7e7e', lineHeight:1.8, marginBottom:14 }}>FreshMart partners directly with Cambodian farmers to deliver fresher products at fairer prices. Our MySQL + FastAPI + React system tracks every batch from farm to checkout.</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginTop:24 }}>
              {[['200+','Partner Farms'],['15K+','Happy Customers'],['1,200+','Products'],['24/7','Support']].map(([v,l]) => (
                <div key={l} style={{ background:'#F2FCF3', borderRadius:10, padding:16, textAlign:'center' }}>
                  <strong style={{ fontSize:28, color:'#00B207', fontFamily:"'Josefin Sans',sans-serif", display:'block' }}>{v}</strong>
                  <p style={{ fontSize:13, color:'#7e7e7e' }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:'#00B207', borderRadius:20, padding:40, textAlign:'center', color:'#fff' }}>
            <div style={{ fontSize:80 }}>🌿</div>
            <h3 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:22, margin:'14px 0 10px' }}>100% Certified Organic</h3>
            <p style={{ color:'rgba(255,255,255,.8)', fontSize:14 }}>Every product sourced from certified farms with zero harmful pesticides.</p>
          </div>
        </div>
        <h2 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:26, fontWeight:700, textAlign:'center', marginBottom:28 }}>Meet the <span style={{ color:'#00B207' }}>Team</span></h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
          {[['CL','Chhay Lyveng','Lead Developer','e20230135'],['KL','Khun Limchheang','Backend Engineer','e20230393'],['HH','Horn Hengveasna','Database Designer','e20230754'],['LV','Lay Vathana','Supervisor','Professor']].map(([init,name,role,id]) => (
            <div key={name} style={{ background:'#fff', borderRadius:12, padding:24, textAlign:'center', border:'1px solid #e8e8e8' }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'#00B207', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:700, color:'#fff', margin:'0 auto 12px', fontFamily:"'Josefin Sans',sans-serif" }}>{init}</div>
              <h4 style={{ fontFamily:"'Josefin Sans',sans-serif", fontWeight:700, marginBottom:4 }}>{name}</h4>
              <p style={{ fontSize:13, color:'#00B207', fontWeight:600, marginBottom:4 }}>{role}</p>
              <small style={{ color:'#7e7e7e', fontSize:12 }}>{id}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
