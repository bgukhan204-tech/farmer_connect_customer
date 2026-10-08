import { useState, useEffect } from 'react'
import { Package, Clock, TrendingUp } from 'lucide-react'
import { getFarmerOrders, updateOrderStatus } from '../api'

const STATUS_COLORS = {
  PENDING:    { bg: '#fef3c7', color: '#92400e' },
  PAID:       { bg: '#d1fae5', color: '#065f46' },
  PROCESSING: { bg: '#dbeafe', color: '#1e40af' },
  SHIPPED:    { bg: '#ede9fe', color: '#5b21b6' },
  DELIVERED:  { bg: '#d1fae5', color: '#065f46' },
  CANCELLED:  { bg: '#fee2e2', color: '#991b1b' },
}

export default function SellerOrders() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchOrders = () => {
    setLoading(true)
    getFarmerOrders()
      .then(r => setOrders(r.data))
      .catch(() => setError('Unable to load farmer orders'))
      .finally(() => setLoading(false))
  }

  useEffect(fetchOrders, [])

  const changeStatus = async (orderId, status) => {
    setError('')
    try {
      const { data } = await updateOrderStatus(orderId, status)
      setOrders(prev => prev.map(order => order.id === orderId ? data : order))
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update order status')
    }
  }

  const totalEarned = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((s, o) => s + o.totalAmount, 0)

  if (loading) return <div className="spinner" />

  return (
    <div className="page">
      <div className="container">
        <h1 className="section-title">📋 Incoming Orders</h1>
        <p className="section-sub">Orders containing your products</p>
        {error && <div className="alert alert-error">{error}</div>}

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Orders',  value: orders.length,                                          emoji: '📦', bg: '#dbeafe' },
            { label: 'Paid Orders',   value: orders.filter(o => o.status === 'PAID').length,         emoji: '✅', bg: '#d1fae5' },
            { label: 'Total Earned',  value: `₹${totalEarned.toFixed(0)}`,                           emoji: '💰', bg: '#fef3c7' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '1.25rem', background: s.bg, boxShadow: 'none' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>{s.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: '1.4rem' }}>{s.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">📋</div>
            <h3>No orders yet</h3>
            <p>When customers buy your products, orders will appear here</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map(order => {
              const sc = STATUS_COLORS[order.status] || STATUS_COLORS.PENDING
              return (
                <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: '1rem' }}>Order #{order.id}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                        <Clock size={13} />
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <select
                        className="input-field"
                        value={order.status}
                        onChange={e => changeStatus(order.id, e.target.value)}
                        style={{
                          width: 150, padding: '0.35rem 0.75rem', borderRadius: 999,
                          fontWeight: 700, fontSize: '0.82rem',
                          background: sc.bg, color: sc.color, border: 'none'
                        }}
                      >
                        {Object.keys(STATUS_COLORS).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary)' }}>
                        ₹{order.totalAmount?.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                    {order.items?.map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.6rem 0.8rem', background: 'var(--bg)', borderRadius: 10
                      }}>
                        <img src={item.productImageUrl} alt={item.productName}
                          style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8 }}
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1506484381205-f7945653044d?w=100' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.productName}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            {item.quantity} units × ₹{item.price}
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                          ₹{(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    borderTop: '1px solid var(--border)', paddingTop: '0.75rem',
                    display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
                    fontSize: '0.82rem', color: 'var(--text-muted)'
                  }}>
                    <span>📍 {order.deliveryAddress?.split('\n')[1] || order.deliveryAddress}</span>
                    {order.paymentMethod && (
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                        color: 'var(--success)', fontWeight: 600
                      }}>
                        💳 {order.paymentMethod}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
