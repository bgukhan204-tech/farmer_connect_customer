import { useState, useEffect } from 'react'
import { Package, Clock } from 'lucide-react'
import { getMyOrders } from '../api'

const STATUS_COLORS = {
  PENDING:    { bg: '#fef3c7', color: '#92400e' },
  PAID:       { bg: '#d1fae5', color: '#065f46' },
  PROCESSING: { bg: '#dbeafe', color: '#1e40af' },
  SHIPPED:    { bg: '#ede9fe', color: '#5b21b6' },
  DELIVERED:  { bg: '#d1fae5', color: '#065f46' },
  CANCELLED:  { bg: '#fee2e2', color: '#991b1b' },
}

const TRACKING_STEPS = ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED']

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyOrders().then(r => setOrders(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="spinner" />

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 860 }}>
        <h1 className="section-title">📦 My Orders</h1>
        <p className="section-sub">{orders.length} order(s) placed</p>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">📦</div>
            <h3>No orders yet</h3>
            <p>Your order history will appear here</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map(order => {
              const sc = STATUS_COLORS[order.status] || STATUS_COLORS.PENDING
              return (
                <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>Order #{order.id}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                        <Clock size={14} />
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <span style={{
                        padding: '0.3rem 1rem', borderRadius: 999, fontWeight: 700, fontSize: '0.82rem',
                        background: sc.bg, color: sc.color
                      }}>{order.status}</span>
                      <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>
                        ₹{order.totalAmount?.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
                    {order.items?.map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.5rem', background: 'var(--bg)', borderRadius: 10
                      }}>
                        <img src={item.productImageUrl} alt={item.productName}
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1506484381205-f7945653044d?w=200' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.productName}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Qty: {item.quantity} × ₹{item.price}</div>
                        </div>
                        <div style={{ fontWeight: 700 }}>₹{(item.quantity * item.price).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                    {TRACKING_STEPS.map((step, index) => {
                      const current = TRACKING_STEPS.indexOf(order.status)
                      const done = current >= index || order.status === 'DELIVERED'
                      return (
                        <div key={step} style={{
                          padding: '0.55rem 0.4rem', borderRadius: 10, textAlign: 'center',
                          background: done ? '#d1fae5' : 'var(--bg)',
                          color: done ? '#065f46' : 'var(--text-muted)',
                          fontSize: '0.75rem', fontWeight: 700
                        }}>
                          {step}
                        </div>
                      )
                    })}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    📍 {order.deliveryAddress?.split('\n')[1] || order.deliveryAddress}
                    {order.razorpayPaymentId && (
                      <span style={{ marginLeft: '1rem', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                        ID: {order.razorpayPaymentId}
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
