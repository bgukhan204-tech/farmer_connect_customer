import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, LogIn } from 'lucide-react'
import { login } from '../api'
import useStore from '../store'

export default function Login() {
  const [form, setForm]   = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useStore()
  const navigate = useNavigate()

  const handle = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const { data } = await login(form)
      setAuth(data, data.token)
      navigate(data.role === 'FARMER' ? '/seller' : '/home')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password')
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 68px)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
      padding: '2rem'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            background: 'var(--primary)', borderRadius: 16,
            width: 56, height: 56, display: 'flex',
            alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
          }}>
            <Leaf size={28} color="#fff" />
          </div>
          <h1 style={{ fontFamily: 'Poppins', fontSize: '1.7rem', fontWeight: 800 }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.3rem' }}>Login to AgriConnect</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handle}>
          <div className="input-group">
            <label>Email / Username</label>
            <input className="input-field" placeholder="Enter email or username"
              value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input className="input-field" type="password" placeholder="Enter password"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}
            style={{ marginTop: '0.5rem', borderRadius: 12 }}>
            <LogIn size={18} /> {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Register</Link>
        </p>

        <div style={{
          marginTop: '1.5rem', padding: '1rem', background: '#f0fdf4',
          borderRadius: 10, fontSize: '0.82rem', color: 'var(--text-muted)'
        }}>
          <strong>Demo accounts (password: password123)</strong><br />
          Farmer: raju_farmer | Customer: priya_customer
        </div>
      </div>
    </div>
  )
}
