export default function OrderHistory() {
  const orders = [
    { id:'ORD-0024', date:'24 May 2025', items:3, total:8.17, method:'Card', status:'Processing' },
    { id:'ORD-0023', date:'20 May 2025', items:2, total:12.98, method:'ABA', status:'Delivered' },
    { id:'ORD-0022', date:'15 May 2025', items:4, total:10.48, method:'Cash', status:'Delivered' },
    { id:'ORD-0021', date:'10 May 2025', items:2, total:14.48, method:'Card', status:'Delivered' },
    { id:'ORD-0020', date:'05 May 2025', items:3, total:9.17, method:'Wing', status:'Cancelled' },
  ]
  return (
    <div className="page-enter">
      <div style={{ background:'#F2FCF3', padding:'14px 0', borderBottom:'1px solid #e8e8e8' }}><div className="container"><span style={{ fontSize:13 }}>Home › <strong>My Orders</strong></span></div></div>
      <div className="container" style={{ padding:'36px 20px' }}>
        <h2 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:24, fontWeight:700, marginBottom:20 }}>My Orders</h2>
        <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e8e8', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
            <thead>
              <tr style={{ background:'#F2FCF3' }}>
                {['Order ID','Date','Items','Total','Payment','Status','Action'].map(h => <th key={h} style={{ padding:'14px 16px', textAlign:'left', fontFamily:"'Josefin Sans',sans-serif", fontSize:13, fontWeight:700, borderBottom:'2px solid #00B207' }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ borderBottom:'1px solid #f5f5f5' }}>
                  <td style={{ padding:'14px 16px', color:'#00B207', fontWeight:700 }}>{o.id}</td>
                  <td style={{ padding:'14px 16px', color:'#7e7e7e' }}>{o.date}</td>
                  <td style={{ padding:'14px 16px' }}>{o.items} items</td>
                  <td style={{ padding:'14px 16px', fontWeight:700 }}>${o.total}</td>
                  <td style={{ padding:'14px 16px' }}>{o.method}</td>
                  <td style={{ padding:'14px 16px' }}><span className={`status status-${o.status.toLowerCase()}`}>{o.status}</span></td>
                  <td style={{ padding:'14px 16px' }}><button style={{ background:'#F2FCF3', color:'#00B207', border:'1.5px solid #00B207', borderRadius:7, padding:'5px 12px', fontSize:12, fontWeight:700, cursor:'pointer' }}>Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
