import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { getCart, removeCartItem, updateCartItem } from '../api'
import useStore from '../store'

export default function Cart() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [qtyDrafts, setQtyDrafts] = useState({})
  const [error, setError] = useState('')
  const { setCart }           = useStore()
  const navigate = useNavigate()

  const fetchCart = async () => {
    const { data } = await getCart()
    setItems(data)
    setCart(data)
    setQtyDrafts(Object.fromEntries(data.map(item => [item.id, String(item.quantity)])))
    setLoading(false)
  }
  useEffect(() => { fetchCart() }, [])

  const remove = async (id) => {
    await removeCartItem(id)
    fetchCart()
  }

  const updateQty = async (id, qty) => {
    const parsed = Number.parseInt(qty, 10)
    if (!Number.isFinite(parsed) || parsed < 1) {
      setError('Quantity must be at least 1')
      setQtyDrafts(prev => ({ ...prev, [id]: '1' }))
      return
    }

    setError('')
    await updateCartItem(id, parsed)
    fetchCart()
  }

  const setQtyDraft = (id, value) => {
    if (/^\d*$/.test(value)) {
      setQtyDrafts(prev => ({ ...prev, [id]: value }))
    }
  }

  const total = items.reduce((s, i) => s + i.subtotal, 0)

  if (loading) return <div className="spinner" />

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 className="section-title">🛒 Shopping Cart</h1>
        <p className="section-sub">{items.length} item(s) in your cart</p>
        {error && <div className="alert alert-error">{error}</div>}

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some fresh products from our store</p>
            <button onClick={() => navigate('/home')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <ShoppingBag size={16} /> Browse Products
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map(item => (
                <div key={item.id} className="card" style={{
                  padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center'
                }}>
                  <img
                    src={item.productImageUrl}
                    alt={item.productName}
                    style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 12 }}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1506484381205-f7945653044d?w=300' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{item.productName}</h3>
                    <span className="badge badge-green">{item.category}</span>
                    <div style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      ₹{item.productPrice} per unit
                    </div>
                  </div>

                  {/* Qty control */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '2px solid var(--border)', borderRadius: 10 }}>
                    <button onClick={() => updateQty(item.id, item.quantity - 1)}
                      style={{ padding: '0.4rem 0.8rem', background: 'none', fontSize: '1.1rem' }}>−</button>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={qtyDrafts[item.id] ?? String(item.quantity)}
                      onChange={e => setQtyDraft(item.id, e.target.value)}
                      onBlur={e => updateQty(item.id, e.target.value || '1')}
                      onKeyDown={e => {
                        if (e.key === 'Enter') e.currentTarget.blur()
                      }}
                      aria-label={`Quantity for ${item.productName}`}
                      style={{
                        width: 54, padding: '0.35rem 0.25rem', textAlign: 'center',
                        fontWeight: 700, border: 'none', borderLeft: '1px solid var(--border)',
                        borderRight: '1px solid var(--border)', background: '#fff'
                      }}
                    />
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}
                      style={{ padding: '0.4rem 0.8rem', background: 'none', fontSize: '1.1rem' }}>+</button>
                  </div>

                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)', minWidth: 80, textAlign: 'right' }}>
                    ₹{item.subtotal?.toFixed(2)}
                  </div>

                  <button onClick={() => remove(item.id)} className="btn btn-danger btn-sm" style={{ borderRadius: 10 }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: 90 }}>
              <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: '1.5rem' }}>Order Summary</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {items.map(i => (
                  <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{i.productName} × {i.quantity}</span>
                    <span>₹{i.subtotal?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '2px solid var(--border)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)' }}>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => navigate('/checkout')} className="btn btn-accent btn-full btn-lg" style={{ borderRadius: 12 }}>
                Buy Products / Checkout <ArrowRight size={18} />
              </button>
              <div style={{
                marginTop: '1rem', textAlign: 'center',
                fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
              }}>
                🔒 Secure payment via Razorpay
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
