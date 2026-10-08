import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Package, X, Save } from 'lucide-react'
import { getMyProducts, createProduct, updateProduct, deleteProduct } from '../api'
import useStore from '../store'

const CATEGORIES = ['Rice', 'Vegetables', 'Fruits', 'Dairy', 'Spices']

const EMPTY = { name: '', description: '', price: '', category: 'Vegetables', imageUrl: '', stockQty: '', unit: 'kg', isAvailable: true }

export default function SellerDashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY)
  const [error, setError]       = useState('')
  const [saving, setSaving]     = useState(false)
  const { user } = useStore()

  const fetch = () => {
    setLoading(true)
    getMyProducts(user.userId).then(r => setProducts(r.data)).finally(() => setLoading(false))
  }
  useEffect(fetch, [])

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setShowForm(true); setError('') }
  const openEdit = (p) => {
    setEditing(p.id)
    setForm({ ...p, price: p.price.toString(), stockQty: p.stockQty.toString() })
    setShowForm(true); setError('')
  }

  const handleSave = async e => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      const payload = { ...form, price: parseFloat(form.price), stockQty: parseInt(form.stockQty) }
      if (editing) await updateProduct(editing, payload)
      else         await createProduct(payload)
      setShowForm(false); fetch()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    await deleteProduct(id); fetch()
  }

  const totalRevenue = products.reduce((s, p) => s + (p.price * p.stockQty), 0)

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="section-title">🌾 Seller Dashboard</h1>
            <p className="section-sub">Welcome, {user?.fullName}! Manage your farm products.</p>
          </div>
          <button onClick={openAdd} className="btn btn-primary btn-lg" style={{ borderRadius: 12 }}>
            <Plus size={20} /> Add Product
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Products', value: products.length, emoji: '📦', color: '#dbeafe' },
            { label: 'Active Listings', value: products.filter(p => p.isAvailable).length, emoji: '✅', color: '#d1fae5' },
            { label: 'Total Stock Value', value: `₹${totalRevenue.toLocaleString()}`, emoji: '💰', color: '#fef3c7' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '1.25rem', background: s.color, boxShadow: 'none' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>{s.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: '1.5rem' }}>{s.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Product Table */}
        {loading ? <div className="spinner" /> : products.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">🌱</div>
            <h3>No products yet</h3>
            <p>Start adding your farm products to sell</p>
            <button onClick={openAdd} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <Plus size={16} /> Add First Product
            </button>
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f0fdf4', borderBottom: '2px solid var(--border)' }}>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={p.imageUrl} alt={p.name}
                          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 10 }}
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1506484381205-f7945653044d?w=100' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{p.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.unit}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className="badge badge-green">{p.category}</span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--primary)' }}>₹{p.price}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: 700 }}>{p.stockQty}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}> {p.unit}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${p.isAvailable ? 'badge-green' : 'badge-red'}`}>
                        {p.isAvailable ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openEdit(p)} className="btn btn-sm btn-outline" style={{ borderRadius: 8 }}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="btn btn-sm btn-danger" style={{ borderRadius: 8 }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Poppins', fontWeight: 700 }}>
                {editing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', color: 'var(--text-muted)' }}>
                <X size={22} />
              </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Product Name *</label>
                  <input className="input-field" placeholder="e.g. Organic Basmati Rice"
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Category *</label>
                  <select className="input-field" value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Unit</label>
                  <select className="input-field" value={form.unit}
                    onChange={e => setForm({...form, unit: e.target.value})}>
                    {['kg', 'g', 'litre', 'ml', 'piece', 'dozen', 'bunch', '100g', '200g', '250g', '500g'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Price (₹) *</label>
                  <input className="input-field" type="number" min="0" step="0.01" placeholder="0.00"
                    value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Stock Quantity *</label>
                  <input className="input-field" type="number" min="0" placeholder="0"
                    value={form.stockQty} onChange={e => setForm({...form, stockQty: e.target.value})} required />
                </div>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Image URL</label>
                  <input className="input-field" placeholder="https://images.unsplash.com/..."
                    value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} />
                </div>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Description</label>
                  <textarea className="input-field" rows={3} placeholder="Describe your product..."
                    style={{ resize: 'vertical' }}
                    value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                {editing && (
                  <div className="input-group" style={{ gridColumn: '1 / -1', flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                    <input type="checkbox" id="avail" checked={form.isAvailable}
                      onChange={e => setForm({...form, isAvailable: e.target.checked})}
                      style={{ width: 18, height: 18 }} />
                    <label htmlFor="avail" style={{ marginBottom: 0 }}>Product is available for sale</label>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowForm(false)}
                  className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={saving}
                  className="btn btn-primary" style={{ flex: 1 }}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
