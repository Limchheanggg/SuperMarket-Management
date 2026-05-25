import { Link } from 'react-router-dom'
export default function Wishlist() {
  return (
    <div className="page-enter">
      <div style={{ background:'#F2FCF3', padding:'14px 0', borderBottom:'1px solid #e8e8e8' }}><div className="container"><span style={{ fontSize:13 }}>Home › <strong>Wishlist</strong></span></div></div>
      <div className="container" style={{ padding:'60px 20px', textAlign:'center' }}>
        <div style={{ fontSize:80 }}>❤️</div>
        <h2 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:24, marginTop:16, marginBottom:8 }}>Your Wishlist is Empty</h2>
        <p style={{ color:'#7e7e7e', marginBottom:24 }}>Save your favourite products here!</p>
        <Link to="/shop" className="btn btn-primary">Browse Products</Link>
      </div>
    </div>
  )
}
