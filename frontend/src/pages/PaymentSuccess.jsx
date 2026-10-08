import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, Package, Home } from 'lucide-react'

export default function PaymentSuccess() {
  const { state } = useLocation()
  const navigate  = useNavigate()

  return (
    <div style={{
      minHeight: 'calc(100vh - 68px)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)'
    }}>
      <div className="card" style={{ padding: '3.5rem', maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <div style={{
          width: 96, height: 96, background: '#d1fae5', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
        }}>
          <CheckCircle size={52} color="var(--success)" />
        </div>

        <h1 style={{ fontFamily: 'Poppins', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--success)' }}>
          Payment Successful! 🎉
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
          Thank you for your order! Your fresh farm products are on their way.
        </p>

        {state?.paymentId && (
          <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '1rem', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Payment ID</div>
            <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.9rem', wordBreak: 'break-all' }}>
              {state.paymentId}
            </div>
            {state?.total && (
              <div style={{ marginTop: '0.75rem', fontWeight: 800, fontSize: '1.3rem', color: 'var(--primary)' }}>
                ₹{state.total?.toFixed(2)} Paid
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => navigate('/orders')} className="btn btn-primary btn-lg" style={{ borderRadius: 12 }}>
            <Package size={18} /> View My Orders
          </button>
          <button onClick={() => navigate('/home')} className="btn btn-outline btn-lg" style={{ borderRadius: 12 }}>
            <Home size={18} /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}
