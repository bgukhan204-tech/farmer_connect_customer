import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Leaf, UserPlus } from 'lucide-react'
import { register } from '../api'
import useStore from '../store'

export default function Register() {
  const [params] = useSearchParams()
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    fullName: '', phoneNumber: '',
    role: params.get('role') || 'CUSTOMER'
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useStore()
  const navigate = useNavigate()

  const handle = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const { data } = await register(form)
      setAuth(data, data.token)
      navigate(data.role === 'FARMER' ? '/seller' : '/home')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 68px)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', padding: '2rem'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 460, padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            background: 'var(--primary)', borderRadius: 16, width: 56, height: 56,
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
          }}>
            <Leaf size={28} color="#fff" />
          </div>
          <h1 style={{ fontFamily: 'Poppins', fontSize: '1.7rem', fontWeight: 800 }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Join AgriConnect today</p>
        </div>

        {/* Role Toggle */}
        <div style={{
          display: 'flex', background: '#f0fdf4',
          borderRadius: 12, padding: 4, marginBottom: '1.5rem'
        }}>
          {['CUSTOMER', 'FARMER'].map(r => (
            <button key={r} type="button"
              onClick={() => setForm({...form, role: r})}
              style={{
                flex: 1, padding: '0.6rem', borderRadius: 10,
                fontWeight: 700, fontSize: '0.9rem', transition: 'var(--transition)',
                background: form.role === r ? 'var(--primary)' : 'transparent',
                color: form.role === r ? '#fff' : 'var(--text-muted)',
                border: 'none'
              }}
            >
              {r === 'CUSTOMER' ? '🛒 Customer' : '🌾 Farmer'}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handle}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Full Name</label>
              <input className="input-field" placeholder="Your full name"
                value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Username</label>
              <input className="input-field" placeholder="username"
                value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Phone</label>
              <input className="input-field" placeholder="10-digit phone"
                value={form.phoneNumber} onChange={e => setForm({...form, phoneNumber: e.target.value})} />
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Email</label>
              <input className="input-field" type="email" placeholder="you@email.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Password</label>
              <input className="input-field" type="password" placeholder="Min 6 characters"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
          </div>
          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}
            style={{ borderRadius: 12 }}>
            <UserPlus size={18} /> {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Login</Link>
        </p>
      </div>
    </div>
  )
}
