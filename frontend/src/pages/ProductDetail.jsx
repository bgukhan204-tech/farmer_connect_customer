import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Package, Leaf, CreditCard, MapPin, X } from 'lucide-react'
import { getProductById, addToCart, createRazorpayOrder, verifyPayment, placeDirectOrder } from '../api'
import useStore from '../store'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [qty, setQty]         = useState(1)
  const [qtyDraft, setQtyDraft] = useState('1')
  const [loading, setLoading] = useState(true)
  const [added, setAdded]     = useState(false)
  const [showBuyForm, setShowBuyForm] = useState(false)
  const [buying, setBuying] = useState(false)
  const [error, setError] = useState('')
  const [razorpayReady, setRazorpayReady] = useState(Boolean(window.Razorpay))
  const [address, setAddress] = useState({
    name: '', phone: '', street: '', city: '', state: '', pincode: ''
  })
  const { user, cart, setCart } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    getProductById(id).then(r => setProduct(r.data)).finally(() => setLoading(false))
  }, [id])

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

  const applyQuantity = (value) => {
    const next = getValidQuantity(value)
    setQty(next)
    setQtyDraft(String(next))
    return next
  }

  const getValidQuantity = (value) => {
    const parsed = Number.parseInt(value, 10)
    const max = product?.stockQty || 1
    return Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), max) : 1
  }

  const changeQuantity = (next) => {
    applyQuantity(String(next))
  }

  const isAddressValid = () =>
    address.name && address.phone && address.street && address.city && address.state && address.pincode

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return }
    if (user.role !== 'CUSTOMER') return
    const nextQty = applyQuantity(qtyDraft)
    try {
      await addToCart({ productId: product.id, quantity: nextQty })
      const updated = [...cart]
      const idx = updated.findIndex(i => i.productId === product.id)
      if (idx >= 0) updated[idx].quantity += nextQty
      else updated.push({ productId: product.id, quantity: nextQty, productName: product.name })
      setCart(updated)
      setAdded(true)
      setTimeout(() => setAdded(false), 2500)
    } catch {}
  }

  const handleBuyProduct = () => {
    if (!user) { navigate('/login'); return }
    if (user.role !== 'CUSTOMER') return
    applyQuantity(qtyDraft)
    setError('')
    setShowBuyForm(true)
  }

  const handleDirectPayment = async () => {
    const nextQty = applyQuantity(qtyDraft)
    if (!isAddressValid()) { setError('Please fill in all delivery address fields'); return }
    if (!window.Razorpay) { setError('Razorpay checkout is still loading. Please try again in a moment.'); return }

    setError('')
    setBuying(true)
    const total = product.price * nextQty

    try {
      const { data: orderData } = await createRazorpayOrder(total)

      if (orderData.demo) {
        setError('Razorpay test keys are not configured. Add real Razorpay keys to application.properties before accepting payments.')
        setBuying(false)
        return
      }

      const fullAddress = `${address.name}, ${address.phone}\n${address.street}, ${address.city}, ${address.state} - ${address.pincode}`
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: 'INR',
        name: 'AgriConnect',
        description: `${product.name} x ${nextQty}`,
        image: 'https://via.placeholder.com/60x60/1a6b2f/fff?text=AC',
        order_id: orderData.razorpayOrderId,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })

            await placeDirectOrder({
              productId: product.id,
              quantity: nextQty,
              deliveryAddress: fullAddress,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
            })

            navigate('/payment-success', {
              state: { paymentId: response.razorpay_payment_id, total }
            })
          } catch (err) {
            setError(err.response?.data?.message || 'Payment verification failed. Your order was not confirmed.')
            setBuying(false)
          }
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.email || '',
          contact: address.phone,
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        theme: { color: '#1a6b2f' },
        modal: { ondismiss: () => setBuying(false) }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        setError(response.error?.description || 'Payment failed. Your order was not confirmed.')
        setBuying(false)
      })
      rzp.open()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start payment. Check Razorpay keys in application.properties.')
      setBuying(false)
    }
  }

  if (loading) return <div className="spinner" />
  if (!product) return <div className="empty-state"><div className="emoji">❌</div><h3>Product not found</h3></div>

  const stars = Math.round(product.rating || 0)

  return (
    <div className="page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="btn btn-sm btn-outline" style={{ marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
          {/* Image */}
          <div className="card" style={{ overflow: 'hidden', borderRadius: 20 }}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: '100%', height: 380, objectFit: 'cover' }}
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1506484381205-f7945653044d?w=400' }}
            />
          </div>

          {/* Info */}
          <div>
            <span className="badge badge-green" style={{ marginBottom: '0.75rem' }}>{product.category}</span>
            <h1 style={{ fontFamily: 'Poppins', fontSize: '1.9rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span className="stars" style={{ fontSize: '1.1rem' }}>
                {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {product.rating?.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>₹{product.price}</span>
              <span style={{ color: 'var(--text-muted)' }}>/ {product.unit || 'unit'}</span>
            </div>

            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            <div style={{
              background: '#f0fdf4', borderRadius: 12, padding: '1rem',
              display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Leaf size={18} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sold by</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{product.farmerName || 'Local Farmer'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={18} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stock</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{product.stockQty} {product.unit}</div>
                </div>
              </div>
            </div>

            {user?.role === 'CUSTOMER' && (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '2px solid var(--border)', borderRadius: 12 }}>
                  <button onClick={() => changeQuantity(qty - 1)}
                    style={{ padding: '0.6rem 1rem', fontSize: '1.2rem', background: 'none', borderRadius: 10 }}>−</button>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={qtyDraft}
                    onChange={e => {
                      if (/^\d*$/.test(e.target.value)) setQtyDraft(e.target.value)
                    }}
                    onBlur={e => applyQuantity(e.target.value || '1')}
                    onKeyDown={e => {
                      if (e.key === 'Enter') e.currentTarget.blur()
                    }}
                    aria-label={`Quantity for ${product.name}`}
                    style={{
                      width: 56, padding: '0.6rem 0.25rem', fontWeight: 700,
                      textAlign: 'center', border: 'none',
                      borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)'
                    }}
                  />
                  <button onClick={() => changeQuantity(qty + 1)}
                    style={{ padding: '0.6rem 1rem', fontSize: '1.2rem', background: 'none', borderRadius: 10 }}>+</button>
                </div>
                <button onClick={handleAddToCart} className="btn btn-primary btn-lg" style={{ flex: 1, minWidth: 180, borderRadius: 12 }}>
                  <ShoppingCart size={20} />
                  {added ? '✓ Added to Cart!' : 'Add to Cart'}
                </button>
                <button onClick={handleBuyProduct} className="btn btn-accent btn-lg" style={{ flex: 1, minWidth: 180, borderRadius: 12 }}>
                  <CreditCard size={20} />
                  Buy Product
                </button>
              </div>
            )}

            {!user && (
              <button onClick={() => navigate('/login')} className="btn btn-primary btn-full btn-lg" style={{ borderRadius: 12 }}>
                Login to Buy
              </button>
            )}

            {added && <div className="alert alert-success" style={{ marginTop: '1rem' }}>
              ✓ Added {qty} {product.unit} of {product.name} to cart!
            </div>}

            {error && <div className="alert alert-error" style={{ marginTop: '1rem' }}>{error}</div>}
          </div>
        </div>
      </div>

      {showBuyForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 250, padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 620, maxHeight: '90vh', overflow: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Poppins', fontWeight: 700 }}>Buy Product</h2>
              <button onClick={() => setShowBuyForm(false)} style={{ background: 'none', color: 'var(--text-muted)' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 800 }}>{product.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {qty} {product.unit || 'unit'} × ₹{product.price} = <strong style={{ color: 'var(--primary)' }}>₹{(product.price * qty).toFixed(2)}</strong>
              </div>
            </div>

            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <MapPin size={18} color="var(--primary)" /> Delivery Address
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div className="input-group">
                <label>Full Name *</label>
                <input className="input-field" value={address.name} placeholder="Recipient name"
                  onChange={e => setAddress({...address, name: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Phone *</label>
                <input className="input-field" value={address.phone} placeholder="10-digit phone"
                  onChange={e => setAddress({...address, phone: e.target.value})} />
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label>Street / House No *</label>
                <input className="input-field" value={address.street} placeholder="Flat/House No, Street, Area"
                  onChange={e => setAddress({...address, street: e.target.value})} />
              </div>
              <div className="input-group">
                <label>City *</label>
                <input className="input-field" value={address.city} placeholder="City"
                  onChange={e => setAddress({...address, city: e.target.value})} />
              </div>
              <div className="input-group">
                <label>State *</label>
                <input className="input-field" value={address.state} placeholder="State"
                  onChange={e => setAddress({...address, state: e.target.value})} />
              </div>
              <div className="input-group">
                <label>PIN Code *</label>
                <input className="input-field" value={address.pincode} placeholder="6-digit PIN"
                  onChange={e => setAddress({...address, pincode: e.target.value})} />
              </div>
            </div>

            <div style={{ background: '#eef2ff', borderRadius: 12, padding: '1rem', marginBottom: '1rem', fontSize: '0.86rem', color: '#3730a3' }}>
              Payment options open in Razorpay: UPI, Google Pay, PhonePe, Paytm, Debit Card, Credit Card, Net Banking and supported wallets.
            </div>

            <button onClick={handleDirectPayment} disabled={buying}
              className="btn btn-accent btn-full btn-lg" style={{ borderRadius: 12 }}>
              <CreditCard size={20} />
              {buying ? 'Opening Payment...' : razorpayReady ? `Pay ₹${(product.price * qty).toFixed(2)} & Place Order` : 'Loading Razorpay...'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
