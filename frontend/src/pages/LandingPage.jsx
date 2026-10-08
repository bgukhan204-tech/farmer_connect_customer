import { useNavigate } from 'react-router-dom'
import { Leaf, ShoppingBag, Tractor, ArrowRight, Shield, Truck, Star } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#fff', overflowX: 'hidden' }}>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--bg-dark) 0%, var(--primary) 60%, var(--primary-light) 100%)',
        color: '#fff', padding: '6rem 0 4rem', position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -80, right: -80, width: 400, height: 400,
          borderRadius: '50%', background: 'rgba(255,255,255,0.04)'
        }} />
        <div style={{
          position: 'absolute', bottom: -100, left: -60, width: 300, height: 300,
          borderRadius: '50%', background: 'rgba(245,158,11,0.15)'
        }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(245,158,11,0.2)', padding: '0.4rem 1.2rem',
            borderRadius: 999, marginBottom: '1.5rem', border: '1px solid rgba(245,158,11,0.4)'
          }}>
            <Leaf size={16} color="#f59e0b" />
            <span style={{ fontSize: '0.85rem', color: '#fcd34d', fontWeight: 600 }}>
              Farm Fresh • Direct from Farmer to You
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 800, lineHeight: 1.15,
            marginBottom: '1.25rem'
          }}>
            Fresh From The Farm,<br />
            <span style={{ color: '#fcd34d' }}>Straight To Your Door 🌾</span>
          </h1>

          <p style={{
            fontSize: '1.15rem', opacity: 0.85, maxWidth: 560,
            margin: '0 auto 2.5rem', lineHeight: 1.7
          }}>
            AgriConnect bridges the gap between farmers and customers.
            Buy fresh produce directly — no middlemen, better prices, happier farmers.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/home')}
              className="btn btn-accent btn-lg"
              style={{ borderRadius: 14, fontSize: '1.05rem' }}
            >
              <ShoppingBag size={20} /> Shop as Customer <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/register?role=FARMER')}
              className="btn btn-lg"
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '2px solid rgba(255,255,255,0.3)',
                color: '#fff', borderRadius: 14, fontSize: '1.05rem'
              }}
            >
              <Tractor size={20} /> Sell as Farmer
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{
        background: 'var(--primary)', color: '#fff', padding: '1.5rem 0'
      }}>
        <div className="container" style={{
          display: 'flex', justifyContent: 'space-around',
          flexWrap: 'wrap', gap: '1rem', textAlign: 'center'
        }}>
          {[['500+','Farmers'],['10,000+','Products'],['50,000+','Customers'],['4.9★','Rating']].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Poppins' }}>{n}</div>
              <div style={{ opacity: 0.8, fontSize: '0.88rem' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 0', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title">Why Choose AgriConnect?</h2>
            <p className="section-sub">The smarter way to buy and sell farm produce</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: <Leaf size={32} color="var(--primary)" />, title: '100% Fresh', desc: 'Produce harvested and delivered within 24 hours. No cold storage, no chemicals.' },
              { icon: <Shield size={32} color="var(--primary)" />, title: 'Secure Payments', desc: 'Pay safely with Razorpay. UPI, cards, net banking — all accepted.' },
              { icon: <Truck size={32} color="var(--primary)" />, title: 'Fast Delivery', desc: 'Direct from farm to your doorstep. Track your order in real-time.' },
              { icon: <Star size={32} color="var(--accent)" />, title: 'Best Prices', desc: 'No middlemen means better prices for both farmers and customers.' },
            ].map(f => (
              <div key={f.title} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{
                  background: '#f0fdf4', borderRadius: 16, width: 64, height: 64,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
        color: '#fff', padding: '4rem 0', textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Poppins', fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
            Ready to get started?
          </h2>
          <p style={{ opacity: 0.85, marginBottom: '2rem' }}>
            Join thousands of farmers and customers building a better food ecosystem.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')} className="btn btn-accent btn-lg">
              Create Free Account
            </button>
            <button onClick={() => navigate('/home')} className="btn btn-lg" style={{
              background: 'rgba(255,255,255,0.15)', color: '#fff',
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              Browse Products
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
