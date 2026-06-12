import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import API from '../../services/api'

const empty = {
  Company_Name: '', Contact_Person: '', Phone: '', Email: '', City: '', Country: 'Cambodia'
}

const Icon = ({ name, size=18, color='currentColor', style }) => {
  const p = { width:size, height:size, viewBox:'0 0 24 24', fill:'none', stroke:color, strokeWidth:1.8, strokeLinecap:'round', strokeLinejoin:'round', style }
  switch(name) {
    case 'search': return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
    case 'alert':  return <svg {...p}><path d="M12 9v4M12 16.5h.01"/><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0z"/></svg>
    case 'check':  return <svg {...p}><path d="M20 6 9 17l-5-5"/></svg>
    case 'loader': return <svg {...p}><circle cx="12" cy="12" r="9" opacity=".25"/><path d="M21 12a9 9 0 0 0-9-9"/></svg>
    default: return null
  }
}

export default function AdminSuppliers() {
  const [suppliers, setSuppliers]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [showModal, setShowModal]   = useState(false)
  const [showDetail, setShowDetail] = useState(null)
  const [editing, setEditing]       = useState(null)
  const [form, setForm]             = useState(empty)
  const [saving, setSaving]         = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      const res = await API.get('/api/suppliers/')
      setSuppliers(res.data)
    } catch { toast.error('Failed to load suppliers') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(empty); setShowModal(true) }
  const openEdit = (s) => {
    setEditing(s)
    setForm({ Company_Name: s.Company_Name, Contact_Person: s.Contact_Person,
              Phone: s.Phone, Email: s.Email, City: s.City, Country: s.Country })
    setShowModal(true)
  }

  const openDetail = async (s) => {
    try {
      const res = await API.get(`/api/suppliers/${s.Supplier_ID}`)
      setShowDetail(res.data)
    } catch { toast.error('Failed to load supplier details') }
  }

  const save = async () => {
    if (!form.Company_Name.trim()) { toast.error('Company name required'); return }
    setSaving(true)
    try {
      if (editing) {
        await API.put(`/api/suppliers/${editing.Supplier_ID}`, form)
        toast.success('Supplier updated!')
      } else {
        await API.post('/api/suppliers/', form)
        toast.success('Supplier added!')
      }
      setShowModal(false)
      load()
    } catch { toast.error('Failed to save supplier') }
    finally { setSaving(false) }
  }

  const del = (s) => {
    setDeleteConfirm({ supplier: s, title:'Delete Supplier', message:`Are you sure you want to delete "${s.Company_Name}"? Its products will be unlinked.` })
  }
  const confirmDelete = async () => {
    if (!deleteConfirm) return
    try {
      await API.delete(`/api/suppliers/${deleteConfirm.supplier.Supplier_ID}`)
      toast.success('Supplier deleted')
      load()
    } catch { toast.error('Failed to delete') }
    finally { setDeleteConfirm(null) }
  }

  const filtered = suppliers.filter(s =>
    s.Company_Name.toLowerCase().includes(search.toLowerCase()) ||
    s.Contact_Person?.toLowerCase().includes(search.toLowerCase()) ||
    s.City?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '24px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:700, margin:0 }}>🏭 Supplier Management</h1>
          <p style={{ color:'#6b7280', margin:'4px 0 0', fontSize:14 }}>Manage your product suppliers</p>
        </div>
        <button onClick={openAdd} style={{ background:'#16a34a', color:'#fff', border:'none',
          borderRadius:8, padding:'10px 20px', fontWeight:600, cursor:'pointer', fontSize:14 }}>
          + Add Supplier
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
        {[
          { label:'Total Suppliers', value: suppliers.length, color:'#3b82f6' },
          { label:'Total Products Supplied', value: suppliers.reduce((a,s) => a + (s.Product_Count||0), 0), color:'#16a34a' },
          { label:'Cities Covered', value: [...new Set(suppliers.map(s=>s.City).filter(Boolean))].length, color:'#f59e0b' },
        ].map((s,i) => (
          <div key={i} style={{ background:'#fff', borderRadius:12, padding:'20px 24px',
            boxShadow:'0 1px 3px rgba(0,0,0,0.08)', borderLeft:`4px solid ${s.color}` }}>
            <div style={{ fontSize:13, color:'#6b7280', marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:28, fontWeight:700, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ background:'#fff', borderRadius:12, padding:16, marginBottom:16,
        boxShadow:'0 1px 3px rgba(0,0,0,0.08)' }}>
        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#94a3b8', pointerEvents:'none' }}>
            <Icon name="search" size={16}/>
          </div>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search by company, contact, or city..."
            style={{ width:'100%', padding:'10px 14px 10px 38px', border:'1px solid #e5e7eb',
              borderRadius:8, fontSize:14, boxSizing:'border-box', outline:'none' }}/>
        </div>
      </div>

      {/* Table */}
      <div style={{ background:'#fff', borderRadius:12, boxShadow:'0 1px 3px rgba(0,0,0,0.08)', overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#1e293b', color:'#fff' }}>
              {['Company','Contact Person','Phone','Email','City','Products','Actions'].map(h => (
                <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:13, fontWeight:600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding:40, textAlign:'center', color:'#9ca3af' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding:40, textAlign:'center', color:'#9ca3af' }}>No suppliers found</td></tr>
            ) : filtered.map((s, i) => (
              <tr key={s.Supplier_ID} style={{ borderBottom:'1px solid #f1f5f9',
                background: i%2===0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ fontWeight:600, fontSize:14 }}>{s.Company_Name}</div>
                  <div style={{ fontSize:12, color:'#9ca3af' }}>{s.Country}</div>
                </td>
                <td style={{ padding:'12px 16px', fontSize:14 }}>{s.Contact_Person || '—'}</td>
                <td style={{ padding:'12px 16px', fontSize:14 }}>{s.Phone || '—'}</td>
                <td style={{ padding:'12px 16px', fontSize:13, color:'#3b82f6' }}>{s.Email || '—'}</td>
                <td style={{ padding:'12px 16px', fontSize:14 }}>{s.City || '—'}</td>
                <td style={{ padding:'12px 16px' }}>
                  <span style={{ background:'#dcfce7', color:'#16a34a', borderRadius:20,
                    padding:'2px 10px', fontSize:13, fontWeight:600 }}>{s.Product_Count} products</span>
                </td>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', gap:6 }}>
                    <button onClick={() => openDetail(s)} style={{ background:'#eff6ff', color:'#3b82f6',
                      border:'none', borderRadius:6, padding:'5px 10px', fontSize:12, cursor:'pointer', fontWeight:600 }}>
                      View
                    </button>
                    <button onClick={() => openEdit(s)} style={{ background:'#fef9c3', color:'#ca8a04',
                      border:'none', borderRadius:6, padding:'5px 10px', fontSize:12, cursor:'pointer', fontWeight:600 }}>
                      Edit
                    </button>
                    <button onClick={() => del(s)} style={{ background:'#fee2e2', color:'#dc2626',
                      border:'none', borderRadius:6, padding:'5px 10px', fontSize:12, cursor:'pointer', fontWeight:600 }}>
                      Del
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:32, width:500,
            maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
            <h2 style={{ margin:'0 0 24px', fontSize:20, fontWeight:700 }}>
              {editing ? '✏️ Edit Supplier' : '🏭 Add Supplier'}
            </h2>
            {[
              { label:'Company Name *', key:'Company_Name', placeholder:'e.g. Green Valley Farm Co.' },
              { label:'Contact Person', key:'Contact_Person', placeholder:'e.g. Sopheak Meas' },
              { label:'Phone',          key:'Phone',          placeholder:'e.g. +855 12 345 001' },
              { label:'Email',          key:'Email',          placeholder:'e.g. orders@supplier.kh' },
              { label:'City',           key:'City',           placeholder:'e.g. Phnom Penh' },
              { label:'Country',        key:'Country',        placeholder:'e.g. Cambodia' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:13, fontWeight:600,
                  color:'#374151', marginBottom:6 }}>{f.label}</label>
                <input value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
                  placeholder={f.placeholder}
                  style={{ width:'100%', padding:'10px 12px', border:'1px solid #d1d5db',
                    borderRadius:8, fontSize:14, boxSizing:'border-box', outline:'none' }}/>
              </div>
            ))}
            <div style={{ display:'flex', gap:12, marginTop:24 }}>
              <button onClick={save} disabled={saving} style={{ flex:1, background:'#16a34a',
                color:'#fff', border:'none', borderRadius:8, padding:'12px', fontWeight:600,
                cursor:'pointer', fontSize:15, display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
                <Icon name={saving ? 'loader' : 'check'} size={16} color="#fff" style={saving ? {animation:'spin 1s linear infinite'} : {}}/>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setShowModal(false)} style={{ flex:1, background:'#f3f4f6',
                color:'#374151', border:'none', borderRadius:8, padding:'12px', fontWeight:600,
                cursor:'pointer', fontSize:15 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:32, width:680,
            maxHeight:'85vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:24 }}>
              <div>
                <h2 style={{ margin:0, fontSize:20, fontWeight:700 }}>{showDetail.Company_Name}</h2>
                <p style={{ margin:'4px 0 0', color:'#6b7280', fontSize:14 }}>{showDetail.City}, {showDetail.Country}</p>
              </div>
              <button onClick={() => setShowDetail(null)} style={{ background:'#f3f4f6',
                border:'none', borderRadius:8, padding:'6px 12px', cursor:'pointer', fontSize:14 }}>✕ Close</button>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
              {[
                { label:'Contact Person', value: showDetail.Contact_Person },
                { label:'Phone',          value: showDetail.Phone },
                { label:'Email',          value: showDetail.Email },
                { label:'Products',       value: `${showDetail.Product_Count} products` },
              ].map(f => (
                <div key={f.label} style={{ background:'#f8fafc', borderRadius:8, padding:'12px 16px' }}>
                  <div style={{ fontSize:12, color:'#9ca3af', marginBottom:2 }}>{f.label}</div>
                  <div style={{ fontSize:14, fontWeight:600 }}>{f.value || '—'}</div>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize:15, fontWeight:700, marginBottom:12 }}>Products Supplied</h3>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ background:'#f1f5f9' }}>
                  {['Product','Category','Price','Stock'].map(h => (
                    <th key={h} style={{ padding:'8px 12px', textAlign:'left', fontWeight:600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {showDetail.products?.map(p => (
                  <tr key={p.Product_ID} style={{ borderBottom:'1px solid #f1f5f9' }}>
                    <td style={{ padding:'8px 12px', fontWeight:500 }}>{p.Name}</td>
                    <td style={{ padding:'8px 12px', color:'#6b7280' }}>{p.Category_Name}</td>
                    <td style={{ padding:'8px 12px' }}>${p.Unit_Price?.toFixed(2)}</td>
                    <td style={{ padding:'8px 12px' }}>
                      <span style={{ color: p.Stock > 0 ? '#16a34a' : '#dc2626', fontWeight:600 }}>
                        {p.Stock} {p.Unit}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}
          onClick={() => setDeleteConfirm(null)}>
          <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:18, padding:28, maxWidth:380, width:'90%', boxShadow:'0 20px 60px rgba(0,0,0,.25)', textAlign:'center' }}>
            <div style={{ width:56, height:56, borderRadius:16, background:'#fef2f2', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', color:'#dc2626' }}>
              <Icon name="alert" size={28}/>
            </div>
            <h3 style={{ margin:'0 0 8px', fontSize:17, fontWeight:800, color:'#0f172a' }}>{deleteConfirm.title}</h3>
            <p style={{ margin:'0 0 22px', fontSize:13.5, color:'#64748b', lineHeight:1.5 }}>{deleteConfirm.message}</p>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setDeleteConfirm(null)}
                style={{ flex:1, padding:'11px', borderRadius:10, border:'1.5px solid #e5e7eb', background:'#f8fafc', fontWeight:700, cursor:'pointer', fontSize:14 }}>
                Cancel
              </button>
              <button onClick={confirmDelete}
                style={{ flex:1, padding:'11px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#dc2626,#ef4444)', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14 }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
