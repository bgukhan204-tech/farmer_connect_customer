import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../api'

const CATEGORIES = ['All', 'Rice', 'Vegetables', 'Fruits', 'Dairy', 'Spices']

export default function Home() {
  const [products, setProducts]   = useState([])
  const [filtered, setFiltered]   = useState([])
  const [category, setCategory]   = useState('All')
  const [search, setSearch]       = useState('')
  const [loading, setLoading]     = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getProducts().then(r => { setProducts(r.data); setFiltered(r.data) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let data = [...products]
    if (category !== 'All') data = data.filter(p => p.category === category)
    if (search) data = data.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    setFiltered(data)
  }, [category, search, products])

  return (
    <div className="page">
      <div className="container">

        {/* Hero banner */}
        <div style={{
          background: 'linear-gradient(120deg, var(--primary-dark), var(--primary))',
          borderRadius: 24, padding: '2.5rem', color: '#fff',
          marginBottom: '2.5rem', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', right: -40, top: -40, width: 260, height: 260,
            borderRadius: '50%', background: 'rgba(255,255,255,0.06)'
          }} />
          <h1 style={{ fontFamily: 'Poppins', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            🌾 Fresh Farm Products
          </h1>
          <p style={{ opacity: 0.85, marginBottom: '1.5rem', maxWidth: 480 }}>
            Direct from farmers to your plate. No middlemen, no markup.
          </p>
          {/* Search bar */}
          <div style={{ display: 'flex', gap: '0.75rem', maxWidth: 480 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{
                position: 'absolute', left: 14, top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)'
              }} />
              <input
                className="input-field"
                placeholder="Search rice, fruits, vegetables..."
                style={{ paddingLeft: 42, background: '#fff', borderColor: 'transparent' }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {CATEGORIES.map(c => (
            <button key={c}
              onClick={() => setCategory(c)}
              className="btn btn-sm"
              style={{
                borderRadius: 999,
                background: category === c ? 'var(--primary)' : '#fff',
                color: category === c ? '#fff' : 'var(--text)',
                border: `2px solid ${category === c ? 'var(--primary)' : 'var(--border)'}`,
                fontWeight: 600
              }}
            >
              {c === 'All' && '🛒'} {c === 'Rice' && '🌾'} {c === 'Vegetables' && '🥦'}
              {c === 'Fruits' && '🍎'} {c === 'Dairy' && '🥛'} {c === 'Spices' && '🌶️'}
              {' '}{c}
            </button>
          ))}
          <span style={{
            marginLeft: 'auto', fontSize: '0.88rem',
            color: 'var(--text-muted)', alignSelf: 'center'
          }}>
            {filtered.length} products
          </span>
        </div>

        {/* Products */}
        {loading ? <div className="spinner" /> :
          filtered.length === 0 ? (
            <div className="empty-state">
              <div className="emoji">🔍</div>
              <h3>No products found</h3>
              <p>Try a different search or category</p>
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
