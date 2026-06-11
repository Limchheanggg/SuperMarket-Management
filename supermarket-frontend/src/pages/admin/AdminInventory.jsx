import { useState, useEffect, useRef } from 'react'
import API from '../../services/api'
import toast from 'react-hot-toast'

const STATUS_CFG = {
  'In Stock':     { bg:'#dcfce7', color:'#15803d', border:'#86efac', dot:'#22c55e' },
  'Low Stock':    { bg:'#fef9c3', color:'#a16207', border:'#fde047', dot:'#eab308' },
  'Out of Stock': { bg:'#fee2e2', color:'#dc2626', border:'#fca5a5', dot:'#ef4444' },
}

const UNITS = ['piece','pack','kg','g','bottle','can','box','bag','bunch','tray','roll','sachet','tube','jar','carton']

const EMOJIS = {
  'Rice & Grains':'🍚','Instant Noodles':'🍜','Cooking Oil':'🫙',
  'Sauces & Condiments':'🧄','Canned & Preserved':'🥫','Snacks & Biscuits':'🍪',
  'Beverages':'🧃','Dairy & Eggs':'🥚','Frozen Foods':'🧊','Fresh Produce':'🥦',
  'Meat & Seafood':'🥩','Personal Care':'💊','Household':'🏠',
  'Baby & Kids':'👶','Health & Wellness':'💉',
}

const EMPTY = {
  Name:'', Category_ID:'', Supplier_ID:'', Brand:'', Unit:'piece',
  Unit_Price:'', Unit_Mass_Kg:'', Reorder_Level:10,
  Is_Perishable:0, Description:'', Product_Image:'', Quantity:99
}

export default function AdminInventory() {
  const [items, setItems]         = useState([])
  const [cats, setCats]           = useState([])
  const [suppliers, setSuppliers]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [statusF, setStatusF]     = useState('All')
  const [catF, setCatF]           = useState('All')
  const [modal, setModal]         = useState(null)  // null | 'add' | 'edit' | 'restock' | 'view'
  const [form, setForm]           = useState(EMPTY)
  const [saving, setSaving]       = useState(false)
  const [restockQty, setRestockQty] = useState(0)
  const [restockItem, setRestockItem] = useState(null)
  const imgRef = useRef()

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [iRes, cRes, sRes] = await Promise.all([
        API.get('/api/inventory/'),
        API.get('/api/products/categories'),
        API.get('/api/suppliers/'),
      ])
      setItems(iRes.data  || [])
      setCats(cRes.data   || [])
      setSuppliers(sRes.data || [])
    } catch(e) {
      toast.error('Failed to load: ' + (e.response?.data?.detail || e.message))
    }
    setLoading(false)
  }

  // ── Image compress ──────────────────────────────────────────────────
  const handleImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return }
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('https://supermarket-management-production-d071.up.railway.app/api/upload/', {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      setForm(f => ({ ...f, Product_Image: data.url }))
      toast.success('Image uploaded!')
    } catch (err) {
      toast.error('Image upload failed')
    }
  }

  // ── Save product ────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.Name.trim())       { toast.error('Product name required'); return }
    if (!form.Unit_Price)        { toast.error('Price required'); return }
    if (!form.Category_ID)       { toast.error('Category required'); return }
    setSaving(true)
    try {
      const payload = {
        ...form,
        Unit_Price:    parseFloat(form.Unit_Price),
        Unit_Mass_Kg:  parseFloat(form.Unit_Mass_Kg) || null,
        Reorder_Level: parseInt(form.Reorder_Level)  || 10,
        Category_ID:   parseInt(form.Category_ID),
        Supplier_ID:   parseInt(form.Supplier_ID) || null,
      }
      if (modal === 'add') await API.post('/api/products/', payload)
      else                 await API.put(`/api/products/${form.Product_ID}`, payload)
      toast.success(modal === 'add' ? 'Product added!' : 'Product updated!')
      setModal(null); fetchAll()
    } catch(e) { toast.error(e.response?.data?.detail || 'Save failed') }
    finally { setSaving(false) }
  }

  // ── Delete ──────────────────────────────────────────────────────────
  const handleDelete = (id, name) => {
    setDeleteConfirm({ id, name })
  }
  const confirmDelete = async () => {
    if (!deleteConfirm) return
    try {
      await API.delete(`/api/products/${deleteConfirm.id}`)
      toast.success(`${deleteConfirm.name} deleted successfully`)
      setDeleteConfirm(null)
      fetchAll()
    } catch(e) { toast.error(e.response?.data?.detail || "Delete failed"); setDeleteConfirm(null) }
  }

  // ── Restock ──────────────────────────────────────────────────────────
  const handleRestock = async () => {
    if (restockQty <= 0) { toast.error('Enter quantity > 0'); return }
    try {
      await API.post('/api/inventory/restock', {
        product_id: restockItem.Product_ID,
        quantity: restockQty
      })
      toast.success(`Restocked ${restockQty} units!`)
      setModal(null); setRestockQty(0); fetchAll()
    } catch { toast.error('Restock failed') }
  }

  // ── Filter ───────────────────────────────────────────────────────────
  const filtered = items.filter(i => {
    const q = search.toLowerCase()
    const matchQ = !q || i.Name?.toLowerCase().includes(q) ||
                   i.Brand?.toLowerCase().includes(q)
    const matchS = statusF === 'All' || i.Status === statusF
    const matchC = catF    === 'All' || i.Category_Name === catF
    return matchQ && matchS && matchC
  })

  const stats = {
    total:    items.length,
    inStock:  items.filter(i => i.Status === 'In Stock').length,
    low:      items.filter(i => i.Status === 'Low Stock').length,
    out:      items.filter(i => i.Status === 'Out of Stock').length,
  }

  const openEdit = (item) => {
    setForm({ ...item, Unit_Price: item.Unit_Price, Quantity: item.Quantity })
    setModal('edit')
  }

  const openAdd = () => {
    setForm(EMPTY)
    setModal('add')
  }

  return (
    <div style={{ padding:24, fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#f8fafc', minHeight:'100vh' }}>
      <style>{`
        .inv-btn { font-family:'Plus Jakarta Sans',sans-serif; cursor:pointer; transition:all .18s; }
        .inv-btn:hover { opacity:.85; transform:translateY(-1px); }
        .inv-row:hover { background:#f0fdf4 !important; }
        .inv-input { width:100%; padding:10px 13px; border-radius:9px; border:1.5px solid #e2e8f0; font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; box-sizing:border-box; transition:border-color .2s; }
        .inv-input:focus { border-color:#16a34a; box-shadow:0 0 0 3px rgba(22,163,74,.1); }
        .inv-label { font-size:12px; font-weight:700; color:#475569; display:block; margin-bottom:5px; text-transform:uppercase; letter-spacing:.4px; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:800, color:'#0f172a', marginBottom:3 }}>📦 Inventory Management</h1>
          <p style={{ color:'#64748b', fontSize:14 }}>Manage products, stock levels and reorders</p>
        </div>
        <button onClick={openAdd} className="inv-btn"
          style={{ padding:'11px 22px', borderRadius:11, border:'none', background:'linear-gradient(135deg,#15803d,#22c55e)', color:'#fff', fontWeight:700, fontSize:14, boxShadow:'0 4px 14px rgba(21,128,61,.3)' }}>
          + Add Product
        </button>
      </div>

      {/* ── STATS ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
        {[
          ['Total Products', stats.total,   '#6366f1', '📦', 'linear-gradient(135deg,#eef2ff,#e0e7ff)'],
          ['In Stock',       stats.inStock, '#16a34a', '✅', 'linear-gradient(135deg,#f0fdf4,#dcfce7)'],
          ['Low Stock',      stats.low,     '#d97706', '⚠️', 'linear-gradient(135deg,#fffbeb,#fef3c7)'],
          ['Out of Stock',   stats.out,     '#dc2626', '❌', 'linear-gradient(135deg,#fef2f2,#fee2e2)'],
        ].map(([l,v,c,icon,bg]) => (
          <div key={l} style={{ background:bg, borderRadius:14, padding:'18px 20px', border:`1.5px solid ${c}22`, cursor:'pointer' }}
            onClick={() => setStatusF(l === 'Total Products' ? 'All' : l)}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:.5 }}>{l}</span>
              <span style={{ fontSize:18 }}>{icon}</span>
            </div>
            <div style={{ fontSize:32, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* ── FILTERS ── */}
      <div style={{ background:'#fff', borderRadius:14, padding:'16px 18px', marginBottom:18, border:'1.5px solid #e2e8f0', display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', boxShadow:'0 2px 8px rgba(0,0,0,.03)' }}>
        {/* Search */}
        <div style={{ position:'relative', flex:1, minWidth:220 }}>
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:15, color:'#94a3b8' }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search product, brand..."
            style={{ width:'100%', paddingLeft:38, padding:'10px 14px 10px 38px', borderRadius:10, border:'1.5px solid #e2e8f0', fontSize:13, outline:'none', boxSizing:'border-box', fontFamily:"'Plus Jakarta Sans',sans-serif" }} />
        </div>
        {/* Status filter */}
        <select value={statusF} onChange={e=>setStatusF(e.target.value)}
          style={{ padding:'10px 14px', borderRadius:10, border:'1.5px solid #e2e8f0', fontSize:13, outline:'none', background:'#fff', fontFamily:"'Plus Jakarta Sans',sans-serif", cursor:'pointer' }}>
          <option value="All">All Status</option>
          <option>In Stock</option><option>Low Stock</option><option>Out of Stock</option>
        </select>
        {/* Category filter */}
        <select value={catF} onChange={e=>setCatF(e.target.value)}
          style={{ padding:'10px 14px', borderRadius:10, border:'1.5px solid #e2e8f0', fontSize:13, outline:'none', background:'#fff', fontFamily:"'Plus Jakarta Sans',sans-serif", cursor:'pointer' }}>
          <option value="All">All Categories</option>
          {cats.map(c => <option key={c.Category_ID}>{c.Category_Name}</option>)}
        </select>
        {/* Clear */}
        {(search || statusF !== 'All' || catF !== 'All') && (
          <button onClick={() => { setSearch(''); setStatusF('All'); setCatF('All') }} className="inv-btn"
            style={{ padding:'10px 16px', borderRadius:10, border:'1.5px solid #fecaca', background:'#fef2f2', color:'#dc2626', fontSize:12, fontWeight:700 }}>
            ✕ Clear
          </button>
        )}
        <span style={{ marginLeft:'auto', fontSize:13, color:'#64748b', fontWeight:600 }}>
          {filtered.length} of {items.length} products
        </span>
      </div>

      {/* ── TABLE ── */}
      <div style={{ background:'#fff', borderRadius:16, overflow:'hidden', border:'1.5px solid #e2e8f0', boxShadow:'0 2px 12px rgba(0,0,0,.04)' }}>
        {loading ? (
          <div style={{ padding:60, textAlign:'center', color:'#94a3b8' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>⏳</div>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Loading inventory...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:60, textAlign:'center', color:'#94a3b8' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>📦</div>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, fontWeight:600, marginBottom:6 }}>
              {items.length === 0 ? 'No products yet' : 'No products match your filters'}
            </p>
            <p style={{ fontSize:13 }}>
              {items.length === 0 ? 'Click "+ Add Product" to get started' : 'Try clearing your filters'}
            </p>
          </div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ background:'linear-gradient(135deg,#0f172a,#1e293b)' }}>
                {['Product','Category','Price','Stock','Reorder','Status','Actions'].map(h => (
                  <th key={h} style={{ padding:'13px 16px', textAlign:'left', fontWeight:700, color:'rgba(255,255,255,.85)', fontSize:12, textTransform:'uppercase', letterSpacing:.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => {
                const sc  = STATUS_CFG[item.Status] || STATUS_CFG['In Stock']
                return (
                  <tr key={item.Product_ID} className="inv-row"
                    style={{ borderBottom:'1px solid #f1f5f9', background: idx%2===0 ? '#fff' : '#fafbfc', transition:'background .15s' }}>
                    {/* Product */}
                    <td style={{ padding:'13px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                        <div style={{ width:44, height:44, borderRadius:11, overflow:'hidden', flexShrink:0, background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, border:'1.5px solid #e2e8f0' }}>
                          {item.Product_Image
                            ? <img src={item.Product_Image} alt={item.Name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>}
                        </div>
                        <div>
                          <div style={{ fontWeight:700, color:'#0f172a', fontSize:13, marginBottom:2 }}>{item.Name}</div>
                        </div>
                      </div>
                    </td>
                    {/* Category */}
                    <td style={{ padding:'13px 16px' }}>
                      <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:600, background:'#f0fdf4', color:'#16a34a', border:'1px solid #bbf7d0' }}>
                        {item.Category_Name}
                      </span>
                    </td>
                    {/* Price */}
                    <td style={{ padding:'13px 16px', fontWeight:800, color:'#0f172a', fontSize:14 }}>
                      ${Number(item.Unit_Price).toFixed(2)}
                      <div style={{ fontSize:11, color:'#94a3b8', fontWeight:400 }}>{item.Unit}</div>
                    </td>
                    {/* Stock */}
                    <td style={{ padding:'13px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                        <div style={{ width:8, height:8, borderRadius:'50%', background:sc.dot, flexShrink:0 }} />
                        <span style={{ fontWeight:800, fontSize:16, color: item.Quantity <= 0 ? '#dc2626' : item.Quantity <= (item.Reorder_Level||10) ? '#d97706' : '#16a34a' }}>
                          {item.Quantity}
                        </span>
                        <span style={{ fontSize:11, color:'#94a3b8' }}>{item.Unit}</span>
                      </div>
                    </td>
                    {/* Reorder */}
                    <td style={{ padding:'13px 16px', color:'#64748b', fontSize:13 }}>{item.Reorder_Level || 10}</td>
                    {/* Status */}
                    <td style={{ padding:'13px 16px' }}>
                      <span style={{ padding:'5px 12px', borderRadius:99, fontSize:11, fontWeight:700, background:sc.bg, color:sc.color, border:`1px solid ${sc.border}` }}>
                        {item.Status}
                      </span>
                    </td>
                    {/* Actions */}
                    <td style={{ padding:'13px 16px' }}>
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={() => { setRestockItem(item); setRestockQty(0); setModal('restock') }} className="inv-btn"
                          style={{ padding:'5px 11px', borderRadius:7, border:'1.5px solid #86efac', background:'#f0fdf4', color:'#15803d', fontSize:11, fontWeight:700 }}>
                          +Stock
                        </button>
                        <button onClick={() => openEdit(item)} className="inv-btn"
                          style={{ padding:'5px 11px', borderRadius:7, border:'1.5px solid #93c5fd', background:'#dbeafe', color:'#1d4ed8', fontSize:11, fontWeight:700 }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(item.Product_ID, item.Name)} className="inv-btn"
                          style={{ padding:'5px 11px', borderRadius:7, border:'1.5px solid #fca5a5', background:'#fee2e2', color:'#dc2626', fontSize:11, fontWeight:700 }}>
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      {(modal === 'add' || modal === 'edit') && (
        <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}
          onClick={e => { if(e.target===e.currentTarget) setModal(null) }}>
          <div style={{ background:'#fff', borderRadius:20, padding:32, width:'100%', maxWidth:620, boxShadow:'0 20px 60px rgba(0,0,0,.2)', maxHeight:'92vh', overflowY:'auto' }}>

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <div>
                <h3 style={{ fontSize:20, fontWeight:800, color:'#0f172a', marginBottom:2 }}>
                  {modal==='add' ? '+ Add New Product' : '✏️ Edit Product'}
                </h3>
                <p style={{ fontSize:13, color:'#64748b' }}>
                  {modal==='add' ? 'Fill in product details below' : `Editing: ${form.Name}`}
                </p>
              </div>
              <button onClick={() => setModal(null)} style={{ background:'#f1f5f9', border:'none', borderRadius:10, width:36, height:36, cursor:'pointer', fontSize:18, color:'#64748b' }}>✕</button>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              {/* Name */}
              <div style={{ gridColumn:'1/-1' }}>
                <label className="inv-label">Product Name *</label>
                <input className="inv-input" placeholder="e.g. Jasmine Rice 5kg" value={form.Name}
                  onChange={e=>setForm({...form,Name:e.target.value})} />
              </div>
              <div>
              </div>
              {/* Brand */}
              <div>
                <label className="inv-label">Brand</label>
                <input className="inv-input" placeholder="e.g. Lucky Brand" value={form.Brand}
                  onChange={e=>setForm({...form,Brand:e.target.value})} />
              </div>
              {/* Category */}
              <div>
                <label className="inv-label">Category *</label>
                <select className="inv-input" value={form.Category_ID}
                  onChange={e=>setForm({...form,Category_ID:e.target.value})}>
                  <option value="">Select category…</option>
                  {cats.map(c => <option key={c.Category_ID} value={c.Category_ID}>{c.Category_Name}</option>)}
                </select>
              </div>
              {/* Supplier */}
              <div>
                <label className="inv-label">Supplier</label>
                <select className="inv-input" value={form.Supplier_ID}
                  onChange={e=>setForm({...form,Supplier_ID:e.target.value})}>
                  <option value="">Select supplier…</option>
                  {suppliers.map(s => <option key={s.Supplier_ID} value={s.Supplier_ID}>{s.Company_Name}</option>)}
                </select>
              </div>
              {/* Unit */}
              <div>
                <label className="inv-label">Unit *</label>
                <select className="inv-input" value={form.Unit}
                  onChange={e=>setForm({...form,Unit:e.target.value})}>
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              {/* Price */}
              <div>
                <label className="inv-label">Price (USD) *</label>
                <input className="inv-input" type="number" min="0" step="0.01" placeholder="0.00" value={form.Unit_Price}
                  onChange={e=>setForm({...form,Unit_Price:e.target.value})} />
              </div>
              {/* Weight */}
              <div>
                <label className="inv-label">Weight (kg)</label>
                <input className="inv-input" type="number" min="0" step="0.001" placeholder="0.000" value={form.Unit_Mass_Kg}
                  onChange={e=>setForm({...form,Unit_Mass_Kg:e.target.value})} />
              </div>
              {/* Reorder Level */}
              <div>
                <label className="inv-label">Reorder Level</label>
                <input className="inv-input" type="number" min="1" value={form.Reorder_Level}
                  onChange={e=>setForm({...form,Reorder_Level:e.target.value})} />
              </div>
              {/* Perishable */}
              <div style={{ display:'flex', alignItems:'center', gap:10, paddingTop:20 }}>
                <input type="checkbox" id="perishable" checked={!!form.Is_Perishable}
                  onChange={e=>setForm({...form,Is_Perishable:e.target.checked?1:0})}
                  style={{ width:18, height:18, accentColor:'#16a34a', cursor:'pointer' }} />
                <label htmlFor="perishable" style={{ fontSize:13, fontWeight:700, color:'#374151', cursor:'pointer' }}>
                  🌡️ Perishable item
                </label>
              </div>
              {/* Description */}
              <div style={{ gridColumn:'1/-1' }}>
                <label className="inv-label">Description</label>
                <textarea className="inv-input" rows={2} placeholder="Optional product description..." value={form.Description}
                  onChange={e=>setForm({...form,Description:e.target.value})}
                  style={{ resize:'vertical', fontFamily:"'Plus Jakarta Sans',sans-serif" }} />
              </div>
              {/* Image */}
              <div style={{ gridColumn:'1/-1' }}>
                <label className="inv-label">Product Image</label>
                <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                  <div style={{ width:80, height:80, borderRadius:12, border:'2px dashed #cbd5e1', background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
                    {form.Product_Image
                      ? <img src={form.Product_Image} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <span style={{ fontSize:30 }}>📷</span>}
                  </div>
                  <div>
                    <input ref={imgRef} type="file" accept="image/*" onChange={handleImage} style={{ display:'none' }} />
                    <button onClick={() => imgRef.current.click()} className="inv-btn"
                      style={{ padding:'9px 18px', borderRadius:9, border:'1.5px solid #e2e8f0', background:'#f8fafc', color:'#374151', fontSize:13, fontWeight:600 }}>
                      📁 Upload Image
                    </button>
                    {form.Product_Image && (
                      <button onClick={() => setForm({...form,Product_Image:''})} className="inv-btn"
                        style={{ marginLeft:8, padding:'9px 14px', borderRadius:9, border:'1.5px solid #fecaca', background:'#fef2f2', color:'#dc2626', fontSize:13, fontWeight:600 }}>
                        Remove
                      </button>
                    )}
                    <p style={{ fontSize:11, color:'#94a3b8', marginTop:6 }}>Max 5MB · Auto-resized to 400×400px</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display:'flex', gap:12, marginTop:24 }}>
              <button onClick={handleSave} disabled={saving} className="inv-btn"
                style={{ flex:1, padding:'13px', borderRadius:11, border:'none', background: saving?'#e2e8f0':'linear-gradient(135deg,#15803d,#22c55e)', color: saving?'#94a3b8':'#fff', fontWeight:700, fontSize:15, boxShadow: saving?'none':'0 4px 14px rgba(21,128,61,.3)' }}>
                {saving ? '⏳ Saving…' : modal==='add' ? '✅ Add Product' : '✅ Save Changes'}
              </button>
              <button onClick={() => setModal(null)} className="inv-btn"
                style={{ padding:'13px 24px', borderRadius:11, border:'1.5px solid #e2e8f0', background:'#f8fafc', fontWeight:700, fontSize:14, color:'#374151' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── RESTOCK MODAL ── */}
      {modal === 'restock' && restockItem && (
        <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}
          onClick={e => { if(e.target===e.currentTarget) setModal(null) }}>
          <div style={{ background:'#fff', borderRadius:20, padding:32, width:'100%', maxWidth:420, boxShadow:'0 20px 60px rgba(0,0,0,.2)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h3 style={{ fontSize:18, fontWeight:800, color:'#0f172a' }}>📦 Restock Product</h3>
              <button onClick={() => setModal(null)} style={{ background:'#f1f5f9', border:'none', borderRadius:10, width:36, height:36, cursor:'pointer', fontSize:18, color:'#64748b' }}>✕</button>
            </div>

            {/* Product info */}
            <div style={{ background:'#f0fdf4', borderRadius:12, padding:'14px 16px', marginBottom:20, border:'1px solid #bbf7d0', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:48, height:48, borderRadius:10, overflow:'hidden', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0, border:'1px solid #e2e8f0' }}>
                {restockItem.Product_Image
                  ? <img src={restockItem.Product_Image} alt={restockItem.Name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>}
              </div>
              <div>
                <div style={{ fontWeight:700, color:'#0f172a', fontSize:14 }}>{restockItem.Name}</div>
                <div style={{ fontSize:12, color:'#64748b' }}>
                  Current stock: <strong style={{ color: restockItem.Quantity <= 0 ? '#dc2626' : '#16a34a' }}>{restockItem.Quantity}</strong> {restockItem.Unit}
                </div>
              </div>
            </div>

            <label className="inv-label">Quantity to Add</label>
            <input type="number" min="1" value={restockQty} onChange={e=>setRestockQty(parseInt(e.target.value)||0)}
              placeholder="Enter quantity..."
              style={{ width:'100%', padding:'12px 14px', borderRadius:10, border:'2px solid #e2e8f0', fontSize:16, fontWeight:700, outline:'none', boxSizing:'border-box', marginBottom:8, fontFamily:"'Plus Jakarta Sans',sans-serif", textAlign:'center' }} />

            {restockQty > 0 && (
              <div style={{ padding:'10px 14px', background:'#f0fdf4', borderRadius:9, border:'1px solid #bbf7d0', fontSize:13, color:'#15803d', marginBottom:20, textAlign:'center', fontWeight:600 }}>
                New stock will be: <strong style={{ fontSize:16 }}>{restockItem.Quantity + restockQty}</strong> {restockItem.Unit}
              </div>
            )}

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={handleRestock} disabled={restockQty <= 0} className="inv-btn"
                style={{ flex:1, padding:'12px', borderRadius:11, border:'none', background: restockQty>0?'linear-gradient(135deg,#15803d,#22c55e)':'#e2e8f0', color: restockQty>0?'#fff':'#9ca3af', fontWeight:700, fontSize:14 }}>
                ✅ Confirm Restock
              </button>
              <button onClick={() => setModal(null)} className="inv-btn"
                style={{ padding:'12px 20px', borderRadius:11, border:'1.5px solid #e2e8f0', background:'#f8fafc', fontWeight:700, fontSize:14, color:'#374151' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex',
          alignItems:'center', justifyContent:'center', zIndex:1000, padding:20, backdropFilter:'blur(4px)' }}
          onClick={e=>{ if(e.target===e.currentTarget) setDeleteConfirm(null) }}>
          <div style={{ background:'#fff', borderRadius:20, padding:36, maxWidth:420, width:'100%',
            boxShadow:'0 24px 64px rgba(0,0,0,.2)', fontFamily:"'Plus Jakarta Sans',sans-serif", textAlign:'center' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:'#fef2f2',
              display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', border:'2px solid #fecaca' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 0-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <h3 style={{ fontSize:20, fontWeight:800, color:'#0f172a', marginBottom:10 }}>Delete Product</h3>
            <p style={{ fontSize:14, color:'#64748b', marginBottom:8 }}>Are you sure you want to delete</p>
            <p style={{ fontSize:15, fontWeight:800, color:'#c0272d', marginBottom:24,
              background:'#fff0f0', padding:'8px 16px', borderRadius:10, border:'1px solid #fecaca' }}>
              {deleteConfirm.name}
            </p>
            <p style={{ fontSize:12, color:'#94a3b8', marginBottom:28 }}>This action cannot be undone.</p>
            <div style={{ display:'flex', gap:12 }}>
              <button onClick={()=>setDeleteConfirm(null)}
                style={{ flex:1, padding:'12px', borderRadius:12, border:'1.5px solid #e5e7eb',
                  background:'#f9fafb', color:'#374151', fontWeight:700, fontSize:14,
                  cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                Cancel
              </button>
              <button onClick={confirmDelete}
                style={{ flex:1, padding:'12px', borderRadius:12, border:'none',
                  background:'linear-gradient(135deg,#dc2626,#ef4444)', color:'#fff',
                  fontWeight:700, fontSize:14, cursor:'pointer',
                  fontFamily:"'Plus Jakarta Sans',sans-serif",
                  boxShadow:'0 4px 14px rgba(220,38,38,.35)' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
