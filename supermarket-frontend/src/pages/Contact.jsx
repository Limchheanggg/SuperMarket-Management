import { useState } from 'react'
import toast from 'react-hot-toast'
export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  return (
    <div className="page-enter">
      <div style={{ background:'#F2FCF3', padding:'14px 0', borderBottom:'1px solid #e8e8e8' }}><div className="container"><span style={{ fontSize:13 }}>Home › <strong>Contact</strong></span></div></div>
      <div className="container" style={{ padding:'60px 20px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:50 }}>
          <div>
            <h2 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:28, fontWeight:700, marginBottom:16 }}>We'd Love to Hear From You</h2>
            <p style={{ color:'#7e7e7e', lineHeight:1.8, marginBottom:28 }}>Our team is ready to help with any questions.</p>
            {[['📍','Address','344 Street 271, Phnom Penh'],['📞','Phone','+855 12 345 678'],['✉️','Email','hello@amsmart.kh'],['🕐','Hours','Mon-Sat 7AM-9PM']].map(([i,t,v]) => (
              <div key={t} style={{ display:'flex', gap:14, marginBottom:18 }}>
                <div style={{ width:42, height:42, background:'#F2FCF3', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{i}</div>
                <div><strong style={{ display:'block', marginBottom:2 }}>{t}</strong><p style={{ fontSize:13, color:'#7e7e7e' }}>{v}</p></div>
              </div>
            ))}
          </div>
          <div className="card">
            <h3 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:20, fontWeight:700, marginBottom:20 }}>Send us a Message</h3>
            <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Subject</label><input className="form-input" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Message</label><textarea className="form-input" rows={5} style={{ resize:'none' }} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} /></div>
            <button className="btn btn-primary btn-full" onClick={()=>toast.success("Message sent!")}>Send Message</button>
          </div>
        </div>
      </div>
    </div>
  )
}
