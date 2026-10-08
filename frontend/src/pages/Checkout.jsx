import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, MapPin, ShieldCheck } from 'lucide-react'
import { getCart, createRazorpayOrder, verifyPayment, placeOrder } from '../api'
import useStore from '../store'

export default function Checkout() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [paying,  setPaying]  = useState(false)
  const [error,   setError]   = useState('')
  const [razorpayReady, setRazorpayReady] = useState(Boolean(window.Razorpay))
  const [address, setAddress] = useState({
    name: '', phone: '', street: '', city: '', state: '', pincode: ''
  })
  const { user, setCart, clearCartState } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    getCart().then(r => { setItems(r.data); setCart(r.data) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayReady(true)
      return
    }

    const src = 'https://checkout.razorpay.com/v1/checkout.js'
    const existing = document.querySelector(`script[src="${src}"]`)
    const script = existing || document.createElement('script')

    script.src = src
    script.async = true
    script.onload = () => setRazorpayReady(true)
    script.onerror = () => setError('Unable to load Razorpay checkout. Please check your internet connection and try again.')

    if (!existing) document.body.appendChild(script)
  }, [])

  const total = items.reduce((s, i) => s + i.subtotal, 0)

  const isAddressValid = () =>
    address.name && address.phone && address.street && address.city && address.state && address.pincode

  const handlePayment = async () => {
    if (!isAddressValid()) { setError('Please fill in all address fields'); return }
    if (items.length === 0) { setError('Your cart is empty'); return }
    if (!window.Razorpay) { setError('Razorpay checkout is still loading. Please try again in a moment.'); return }
    setError(''); setPaying(true)

    try {
      // 1. Create Razorpay order on backend
      const { data: orderData } = await createRazorpayOrder(total)

      if (orderData.demo) {
        setError('Razorpay test keys are not configured. Add real Razorpay keys to application.properties before accepting payments.')
        setPaying(false)
        return
      }

      // 2. Open Razorpay checkout modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: 'INR',
        name: 'AgriConnect',
        description: 'Farm Fresh Products',
        image: 'https://via.placeholder.com/60x60/1a6b2f/fff?text=AC',
        order_id: orderData.razorpayOrderId,
        handler: async (response) => {
          try {
            // 3. Verify signature on backend
            await verifyPayment({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })

            // 4. Place order in DB
            const fullAddress = `${address.name}, ${address.phone}\n${address.street}, ${address.city}, ${address.state} - ${address.pincode}`
            await placeOrder({
              deliveryAddress:   fullAddress,
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
            })

            clearCartState()
            navigate('/payment-success', {
              state: { paymentId: response.razorpay_payment_id, total }
            })
          } catch {
            setError('Payment verification failed. Contact support.')
          }
        },
        prefill: {
          name:  user?.fullName || '',
          email: user?.email   || '',
          contact: address.phone,
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        theme: { color: '#1a6b2f' },
        modal: { ondismiss: () => setPaying(false) }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        setError(response.error?.description || 'Payment failed. Your order was not confirmed.')
        setPaying(false)
      })
      rzp.open()
    } catch (err) {
      setError('Could not initiate payment. Check Razorpay keys in application.properties.')
      setPaying(false)
    }
  }

  if (loading) return <div className="spinner" />

  return (
    <div className="page">
        <div className="container" style={{ maxWidth: 920 }}>
          <h1 className="section-title">💳 Checkout</h1>
          <p className="section-sub">Complete your order securely with Razorpay</p>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="checkout-grid">
            {/* Delivery Address */}
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontWeight: 700, marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <MapPin size={20} color="var(--primary)" /> Delivery Address
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div className="input-group">
                  <label>Full Name *</label>
                  <input className="input-field" placeholder="Recipient name"
                    value={address.name} onChange={e => setAddress({...address, name: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Phone *</label>
                  <input className="input-field" placeholder="10-digit phone"
                    value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
                </div>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Street / House No *</label>
                  <input className="input-field" placeholder="Flat/House No, Street, Area"
                    value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>City *</label>
                  <input className="input-field" placeholder="City"
                    value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>State *</label>
                  <input className="input-field" placeholder="State"
                    value={address.state} onChange={e => setAddress({...address, state: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>PIN Code *</label>
                  <input className="input-field" placeholder="6-digit PIN"
                    value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Order Total</h2>
                {items.map(i => (
                  <div key={i.id} style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.5rem'
                  }}>
                    <span>{i.productName} × {i.quantity}</span>
                    <span>₹{i.subtotal?.toFixed(2)}</span>
                  </div>
                ))}
                <div style={{
                  borderTop: '2px solid var(--border)', paddingTop: '1rem',
                  marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between',
                  fontWeight: 800, fontSize: '1.2rem'
                }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)' }}>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={paying}
                className="btn btn-accent btn-full btn-lg"
                style={{ borderRadius: 14, fontSize: '1rem' }}
              >
                <CreditCard size={20} />
                {paying ? 'Opening Payment...' : razorpayReady ? `Pay ₹${total.toFixed(2)} via Razorpay` : 'Loading Razorpay...'}
              </button>

              <div style={{
                background: '#f0fdf4', borderRadius: 12, padding: '1rem',
                display: 'flex', gap: '0.75rem', alignItems: 'flex-start'
              }}>
                <ShieldCheck size={20} color="var(--success)" style={{ marginTop: 2 }} />
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--text)' }}>100% Secure Payment</strong><br />
                  Encrypted & secured by Razorpay. UPI, Cards, Net Banking accepted.
                </div>
              </div>

              <div style={{
                background: '#eef2ff', borderRadius: 12, padding: '1rem',
                fontSize: '0.82rem', color: '#3730a3'
              }}>
                <strong>Payment options:</strong> UPI, Google Pay, PhonePe, Paytm,
                Debit Card, Credit Card, Net Banking and supported wallets.
              </div>

              <div style={{
                background: '#fef3c7', borderRadius: 12, padding: '1rem',
                fontSize: '0.82rem', color: '#92400e'
              }}>
                <strong>Test Card:</strong> 4111 1111 1111 1111 | CVV: 123 | Expiry: any future date | OTP: 1234
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
