import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'
export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [payMethod, setPayMethod] = useState('Card')
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', address:'' })
  const tax = totalPrice * 0.1
  const placeOrder = (e) => {
    e.preventDefault()
    clearCart()
    toast.success('Order placed successfully!')
    navigate('/orders')
  }
  return (
    <div className="page-enter">
      <div style={{ background:'#F2FCF3', padding:'14px 0', borderBottom:'1px solid #e8e8e8' }}><div className="container"><span style={{ fontSize:13 }}>Home › Cart › <strong>Checkout</strong></span></div></div>
      <div className="container" style={{ padding:'40px 20px' }}>
        <form onSubmit={placeOrder}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:28 }}>
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div className="card">
                <h3 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:18, fontWeight:700, marginBottom:18 }}>Billing Details</h3>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">First Name *</label><input className="form-input" required value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Last Name *</label><input className="form-input" required value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} /></div>
                </div>
                <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Phone *</label><input className="form-input" required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Address *</label><input className="form-input" required value={form.address} onChange={e=>setForm({...form,address:e.target.value})} /></div>
              </div>
              <div className="card">
                <h3 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:18, fontWeight:700, marginBottom:18 }}>Payment Method</h3>
                {[['💳','Card'],['📱','ABA / Wing'],['💵','Cash on Delivery'],['🏦','Bank Transfer']].map(([icon,method])=>(
                  <div key={method} onClick={()=>setPayMethod(method)} style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 14px', border:`1.5px solid ${payMethod===method?'#00B207':'#e8e8e8'}`, borderRadius:8, cursor:'pointer', marginBottom:10, background:payMethod===method?'#F2FCF3':'#fff', transition:'all .2s' }}>
                    <input type="radio" readOnly checked={payMethod===method} style={{ accentColor:'#00B207' }} /> {icon} {method}
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ height:'fit-content', position:'sticky', top:100 }}>
              <h3 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:18, fontWeight:700, marginBottom:18, paddingBottom:12, borderBottom:'1px solid #e8e8e8' }}>Your Order</h3>
              {cartItems.map(i=>(
                <div key={i.Product_ID} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', fontSize:13, borderBottom:'1px solid #f5f5f5' }}>
                  <span>{i.Name} ×{i.qty}</span><span>${(Number(i.Unit_Price)*i.qty).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', fontSize:14, borderTop:'1px solid #e8e8e8', marginTop:8 }}><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', fontSize:14 }}><span>Tax 10%</span><span>${tax.toFixed(2)}</span></div>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', fontWeight:700, fontSize:16, color:'#00B207' }}><span>Total</span><span>${(totalPrice+tax).toFixed(2)}</span></div>
              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop:16 }} disabled={cartItems.length===0}>✅ Place Order</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
