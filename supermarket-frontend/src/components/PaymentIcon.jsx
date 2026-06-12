const LOGOS = {
  aba:     '/payment-icons/aba.jpg',
  acleda:  '/payment-icons/acleda.png',
  cash:    '/payment-icons/cash.jpg',
}

const BG = {
  aba:     '#ffffff',
  acleda:  '#00833E',
  cash:    '#ffffff',
}

export default function PaymentIcon({ method, size=20 }) {
  const m = (method||'').toLowerCase()
  const src = LOGOS[m]

  if (src) {
    return (
      <span style={{
        display:'inline-flex', alignItems:'center', justifyContent:'center',
        width:size, height:size, borderRadius:6, overflow:'hidden',
        background:BG[m] || '#fff', border:'1px solid #e5e7eb', flexShrink:0
      }}>
        <img src={src} alt={method} style={{
          width:'100%', height:'100%',
          objectFit: m==='aceleda' ? 'contain' : 'cover',
          padding: m==='aceleda' ? 2 : 0,
        }}/>
      </span>
    )
  }

  // generic fallback (card icon) for any other payment method
  const p = { width:size*0.75, height:size*0.75, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:1.8, strokeLinecap:'round', strokeLinejoin:'round' }
  return <svg {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
}
