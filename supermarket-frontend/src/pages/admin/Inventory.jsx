import { useState, useEffect } from 'react'
import API from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminInventory() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await API.get('/api/products/')
      setProducts(res.data || [])
      setFilteredProducts(res.data || [])
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  useEffect(() => {
    let result = [...products]
    if (searchTerm) {
      const t = searchTerm.toLowerCase()
      result = result.filter(p =>
        p.Name?.toLowerCase().includes(t) ||
        p.Barcode?.toLowerCase().includes(t)
      )
    }
    if (activeFilter !== 'All') {
      result = result.filter(p => {
        if (activeFilter === 'In Stock') return p.Reorder_Level > 50
        if (activeFilter === 'Low Stock') return p.Reorder_Level <= 50 && p.Reorder_Level > 0
        if (activeFilter === 'Out of Stock') return p.Reorder_Level === 0
        return true
      })
    }
    setFilteredProducts(result)
  }, [searchTerm, activeFilter, products])

  const getStatus = (level) => {
    if (level === 0) return { text: 'Out of Stock', color: '#ef4444', bg: '#fee2e2' }
    if (level <= 50) return { text: 'Low Stock', color: '#d97706', bg: '#fef3c7' }
    return { text: 'In Stock', color: '#16a34a', bg: '#dcfce7' }
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0 }}>Inventory Management</h2>
          <p style={{ color: '#64748b', marginTop: 4 }}>{products.length} products total</p>
        </div>
        <button 
          onClick={() => window.location.href = '/admin/add-product'}
          style={{ background: '#16a34a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600 }}
        >
          + Add Product
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: 13, color: '#64748b' }}>Total Products</div>
          <div style={{ fontSize: 26, fontWeight: 700 }}>{products.length}</div>
        </div>
        <div style={{ background: '#dcfce7', padding: 16, borderRadius: 12 }}>
          <div style={{ fontSize: 13, color: '#166534' }}>In Stock</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#166534' }}>
            {products.filter(p => p.Reorder_Level > 50).length}
          </div>
        </div>
        <div style={{ background: '#fef3c7', padding: 16, borderRadius: 12 }}>
          <div style={{ fontSize: 13, color: '#92400e' }}>Low Stock</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#92400e' }}>
            {products.filter(p => p.Reorder_Level <= 50 && p.Reorder_Level > 0).length}
          </div>
        </div>
        <div style={{ background: '#fee2e2', padding: 16, borderRadius: 12 }}>
          <div style={{ fontSize: 13, color: '#991b1b' }}>Out of Stock</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#991b1b' }}>
            {products.filter(p => p.Reorder_Level === 0).length}
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search name or barcode..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, marginBottom: 16 }}
      />

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '14px 20px', textAlign: 'left' }}>Product</th>
              <th style={{ padding: '14px 20px', textAlign: 'left' }}>Category</th>
              <th style={{ padding: '14px 20px', textAlign: 'right' }}>Price</th>
              <th style={{ padding: '14px 20px', textAlign: 'center' }}>Reorder Level</th>
              <th style={{ padding: '14px 20px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '14px 20px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p, i) => {
              const status = getStatus(p.Reorder_Level)
              return (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: 600 }}>{p.Name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{p.Barcode}</div>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#475569' }}>{p.Category_Name}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 600 }}>
                    ${Number(p.Unit_Price).toFixed(2)}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{p.Reorder_Level}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{p.Unit}</div>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      background: status.bg,
                      color: status.color
                    }}>
                      {status.text}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button style={{ background: '#16a34a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12 }}>+ Stock</button>
                      <button style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12 }}>Adjust</button>
                      <button style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12 }}>Edit</button>
                      <button style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12 }}>Del</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
