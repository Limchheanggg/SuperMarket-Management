export default function PaymentIcon({ method, size=14, color='currentColor' }) {
  const p = { width:size, height:size, viewBox:'0 0 24 24', fill:'none', stroke:color, strokeWidth:1.8, strokeLinecap:'round', strokeLinejoin:'round' }
  const m = (method||'').toLowerCase()

  if (m === 'cash') {
    // banknote
    return <svg {...p}><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/></svg>
  }
  if (m === 'aba' || m === 'aceleda') {
    // mobile banking app (phone screen)
    return <svg {...p}><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4"/><rect x="8" y="5" width="8" height="9" rx="1"/></svg>
  }
  if (m === 'qr code') {
    // qr code
    return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 21h3M21 14v3"/></svg>
  }
  // card / default
  return <svg {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
}
