import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { addToCart } from '../api'
import useStore from '../store'

export default function ProductCard({ product }) {
  const { user, cart, setCart } = useStore()

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!user || user.role !== 'CUSTOMER') return
    try {
      await addToCart({ productId: product.id, quantity: 1 })
      const updated = [...cart]
      const idx = updated.findIndex(i => i.productId === product.id)
      if (idx >= 0) updated[idx].quantity += 1
      else updated.push({ productId: product.id, quantity: 1, productName: product.name })
      setCart(updated)
    } catch {}
  }

  const stars = '★'.repeat(Math.round(product.rating || 0)) + '☆'.repeat(5 - Math.round(product.rating || 0))

  return (
    <Link to={`/product/${product.id}`} className="card" style={{ cursor: 'pointer' }}>
      <div style={{ position: 'relative', overflow: 'hidden', height: 190 }}>
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1506484381205-f7945653044d?w=400'}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1506484381205-f7945653044d?w=400' }}
        />
        <span className="badge badge-green" style={{
          position: 'absolute', top: 10, left: 10
        }}>{product.category}</span>
        {product.stockQty < 20 && product.stockQty > 0 && (
          <span className="badge badge-amber" style={{ position: 'absolute', top: 10, right: 10 }}>
            Low Stock
          </span>
        )}
      </div>

      <div style={{ padding: '1rem' }}>
        <h3 style={{
          fontSize: '0.97rem', fontWeight: 700, marginBottom: '0.3rem',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>{product.name}</h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <span className="stars" style={{ fontSize: '0.8rem' }}>{stars}</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>({product.reviewCount})</span>
        </div>

        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.75rem' }}>
          by {product.farmerName || 'Local Farmer'}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
              ₹{product.price}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 4 }}>
              / {product.unit || 'unit'}
            </span>
          </div>
          {user?.role === 'CUSTOMER' && (
            <button
              onClick={handleAddToCart}
              className="btn btn-primary btn-sm"
              style={{ borderRadius: 10 }}
            >
              <ShoppingCart size={14} /> Add
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}
