import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export default function Dashboard() {
  const { user } = useAuth()
  const name = user?.name || user?.email || 'Customer'
  return (
    <div className="page-enter">
      <div style={{ background:'#F2FCF3', padding:'14px 0', borderBottom:'1px solid #e8e8e8' }}><div className="container"><span style={{ fontSize:13 }}>Home › <strong>Dashboard</strong></span></div></div>
      <div className="container" style={{ padding:'36px 20px' }}>
        <h2 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:24, fontWeight:700, marginBottom:24 }}>My Dashboard</h2>
        <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', minHeight:'60vh', background:'#fff', borderRadius:16, overflow:'hidden', border:'1px solid #e8e8e8' }}>
          <aside style={{ background:'#1a1a1a', padding:'28px 0' }}>
            <div style={{ padding:'0 20px 24px', borderBottom:'1px solid #2a2a2a', marginBottom:10 }}>
              <div style={{ width:52, height:52, borderRadius:'50%', background:'#00B207', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:700, color:'#fff', marginBottom:10 }}>{name[0].toUpperCase()}</div>
              <div style={{ color:'#fff', fontWeight:700, fontSize:14 }}>{name}</div>
              <div style={{ color:'#888', fontSize:12 }}>⭐ Gold Member</div>
            </div>
            {[['🏠','Dashboard','/dashboard'],['📦','My Orders','/orders'],['❤️','Wishlist','/wishlist'],['⚙️','Settings','/account']].map(([icon,label,to]) => (
              <Link key={to} to={to} style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 20px', color:'#aaa', fontSize:14, fontWeight:600, textDecoration:'none' }}>{icon} {label}</Link>
            ))}
          </aside>
          <div style={{ padding:28, background:'#f9f9f9' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
              {[['Orders','24','#00B207'],['Pending','2','#FF8C00'],['Points','1,240','#3b82f6'],['Spent','$486','#EA4B48']].map(([l,v,c]) => (
                <div key={l} style={{ background:'#fff', borderRadius:12, padding:20, borderLeft:`4px solid ${c}` }}>
                  <div style={{ fontSize:12, color:'#7e7e7e', marginBottom:6 }}>{l}</div>
                  <div style={{ fontSize:24, fontWeight:700, fontFamily:"'Josefin Sans',sans-serif" }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ background:'#fff', borderRadius:12, padding:20, border:'1px solid #e8e8e8' }}>
              <h3 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:16, fontWeight:700, marginBottom:14 }}>Recent Orders</h3>
              {[['ORD-0024','24 May','Processing',8.17],['ORD-0023','20 May','Delivered',12.98],['ORD-0022','15 May','Delivered',10.48]].map(([id,date,status,total]) => (
                <div key={id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid #f5f5f5', fontSize:13 }}>
                  <span style={{ color:'#00B207', fontWeight:700 }}>{id}</span>
                  <span style={{ color:'#7e7e7e' }}>{date}</span>
                  <span className={`status status-${status.toLowerCase()}`}>{status}</span>
                  <strong>${total}</strong>
                </div>
              ))}
              <Link to="/orders" style={{ color:'#00B207', fontSize:13, fontWeight:700, marginTop:10, display:'block' }}>View all →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
