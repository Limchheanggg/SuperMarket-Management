import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div style={{ textAlign:'center', padding:'80px 20px' }}>
      <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:120, fontWeight:700, color:'#00B207', lineHeight:1 }}>404</div>
      <h2 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:28, marginBottom:14 }}>Page Not Found</h2>
      <p style={{ color:'#7e7e7e', marginBottom:28 }}>Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">← Back to Home</Link>
    </div>
  )
}
