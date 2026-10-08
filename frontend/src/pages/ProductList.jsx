import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../api'

const CATEGORIES = ['All', 'Rice', 'Vegetables', 'Fruits', 'Dairy', 'Spices']
const SORTS = [
  { label: 'Default',      value: 'default' },
  { label: 'Price: Low',   value: 'price_asc' },
  { label: 'Price: High',  value: 'price_desc' },
  { label: 'Top Rated',    value: 'rating' },
]

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [category, setCategory] = useState('All')
  const [search, setSearch]     = useState('')
  const [sort, setSort]         = useState('default')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    getProducts().then(r => { setProducts(r.data); setFiltered(r.data) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let data = [...products]
    if (category !== 'All') data = data.filter(p => p.category === category)
    if (search.trim()) data = data.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    )
    if (sort === 'price_asc')  data.sort((a, b) => a.price - b.price)
    if (sort === 'price_desc') data.sort((a, b) => b.price - a.price)
    if (sort === 'rating')     data.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    setFiltered(data)
  }, [products, category, search, sort])

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="section-title">All Products</h1>
          <p className="section-sub">Browse fresh farm produce from our verified farmers</p>
        </div>

        {/* Filters Bar */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: '1.25rem',
          boxShadow: 'var(--shadow)', marginBottom: '2rem',
          display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center'
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <Search size={17} style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)'
            }} />
            <input className="input-field"
              style={{ paddingLeft: 38, marginBottom: 0 }}
              placeholder="Search products..."
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Category */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className="btn btn-sm"
                style={{
                  borderRadius: 999,
                  background: category === c ? 'var(--primary)' : 'var(--bg)',
                  color: category === c ? '#fff' : 'var(--text)',
                  border: `2px solid ${category === c ? 'var(--primary)' : 'var(--border)'}`,
                  fontWeight: 600
                }}>{c}</button>
            ))}
          </div>

          {/* Sort */}
          <select className="input-field" style={{ width: 'auto', marginBottom: 0, paddingRight: '2rem' }}
            value={sort} onChange={e => setSort(e.target.value)}>
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {filtered.length} product(s)
          </span>
        </div>

        {/* Grid */}
        {loading ? <div className="spinner" /> :
          filtered.length === 0 ? (
            <div className="empty-state">
              <div className="emoji">🔍</div>
              <h3>No products found</h3>
              <p>Try changing the search or category filter</p>
            </div>
          ) : (
            <div className="product-grid">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )
        }
      </div>
    </div>
  )
}
