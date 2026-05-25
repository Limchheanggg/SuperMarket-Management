import { useState } from 'react'
const FAQS = [
  { q:'How do I earn loyalty points?', a:'You earn 1 point for every $1 spent. Points can be redeemed for discounts.' },
  { q:'What areas do you deliver to?', a:'Phnom Penh, Siem Reap, and Battambang. Expanding monthly.' },
  { q:'Are your products really organic?', a:'Yes! All organic products come from certified farms with no synthetic pesticides.' },
  { q:'How do I track my order?', a:'Go to Order History in your account dashboard.' },
  { q:'What is your return policy?', a:'30-day return for non-perishables. Fresh produce within 24 hours.' },
]
export default function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <div className="page-enter">
      <div style={{ background:'#F2FCF3', padding:'14px 0', borderBottom:'1px solid #e8e8e8' }}><div className="container"><span style={{ fontSize:13 }}>Home › <strong>FAQ</strong></span></div></div>
      <div className="container" style={{ padding:'50px 20px', maxWidth:800 }}>
        <h2 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:28, fontWeight:700, marginBottom:32, textAlign:'center' }}>Frequently Asked <span style={{ color:'#00B207' }}>Questions</span></h2>
        {FAQS.map((f,i) => (
          <div key={i} style={{ border:'1px solid #e8e8e8', borderRadius:10, marginBottom:12, overflow:'hidden' }}>
            <div onClick={()=>setOpen(open===i?-1:i)} style={{ padding:'16px 20px', display:'flex', justifyContent:'space-between', cursor:'pointer', fontWeight:700, fontFamily:"'Josefin Sans',sans-serif", background:open===i?'#00B207':'#fff', color:open===i?'#fff':'#1a1a1a', transition:'all .2s' }}>
              <span>{f.q}</span><span>{open===i?'−':'+'}</span>
            </div>
            {open===i && <div style={{ padding:'14px 20px', fontSize:14, color:'#7e7e7e', lineHeight:1.8 }}>{f.a}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
