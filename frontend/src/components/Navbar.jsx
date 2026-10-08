import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Leaf, LogOut, Package, LayoutDashboard, ClipboardList, Home } from 'lucide-react'
import useStore from '../store'
import { useEffect } from 'react'
import { getCart } from '../api'

export default function Navbar() {
  const { user, logout, cart, setCart } = useStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (user?.role === 'CUSTOMER') {
      getCart().then(r => setCart(r.data)).catch(() => {})
    }
  }, [user])

  const handleLogout = () => { logout(); navigate('/') }
  const cartCount = cart.reduce((a, i) => a + i.quantity, 0)

  return (
    <nav style={{
      background: 'var(--primary-dark)', color: '#fff',
      boxShadow: '0 2px 16px rgba(0,0,0,0.25)',
      position: 'sticky', top: 0, zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 68
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            background: 'var(--accent)', borderRadius: 10,
            padding: '6px 8px', display: 'flex'
          }}>
            <Leaf size={20} color="#fff" />
          </div>
          <span style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 800, fontSize: '1.3rem', color: '#fff', letterSpacing: '-0.5px'
          }}>
            Agri<span style={{ color: 'var(--accent)' }}>Connect</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <NavLink to="/home" icon={<Home size={16} />} label="Shop" active={location.pathname === '/home'} />

          {user?.role === 'FARMER' && <>
            <NavLink to="/seller" icon={<LayoutDashboard size={16} />} label="Dashboard" active={location.pathname === '/seller'} />
            <NavLink to="/seller/orders" icon={<ClipboardList size={16} />} label="Orders" active={location.pathname === '/seller/orders'} />
          </>}

          {user?.role === 'CUSTOMER' && <>
            <NavLink to="/orders" icon={<Package size={16} />} label="My Orders" active={location.pathname === '/orders'} />
            <Link to="/cart" style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 1rem', borderRadius: 10,
              background: 'rgba(255,255,255,0.1)',
              color: '#fff', fontWeight: 600, fontSize: '0.9rem',
              transition: 'var(--transition)', position: 'relative'
            }}>
              <ShoppingCart size={18} />
              Cart
              {cartCount > 0 && (
                <span style={{
                  background: 'var(--accent)', color: '#fff',
                  borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700,
                  padding: '1px 7px', minWidth: 20, textAlign: 'center'
                }}>{cartCount}</span>
              )}
            </Link>
          </>}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
              <div style={{
                padding: '0.4rem 0.9rem', background: 'rgba(255,255,255,0.1)',
                borderRadius: 10, fontSize: '0.85rem'
              }}>
                <span style={{ opacity: 0.7 }}>Hi, </span>
                <strong>{user.fullName?.split(' ')[0] || user.username}</strong>
                <span style={{
                  marginLeft: 6, background: 'var(--accent)',
                  color: '#fff', borderRadius: 6, padding: '1px 8px',
                  fontSize: '0.72rem', fontWeight: 700
                }}>{user.role}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-sm" style={{
                background: 'rgba(255,255,255,0.15)', color: '#fff'
              }}>
                <LogOut size={15} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.5rem' }}>
              <Link to="/login"    className="btn btn-sm btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>Login</Link>
              <Link to="/register" className="btn btn-sm btn-accent">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

function NavLink({ to, icon, label, active }) {
  return (
    <Link to={to} style={{
      display: 'flex', alignItems: 'center', gap: '0.35rem',
      padding: '0.5rem 0.9rem', borderRadius: 10,
      color: '#fff', fontWeight: 600, fontSize: '0.88rem',
      background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
      transition: 'var(--transition)'
    }}
    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}>
      {icon}{label}
    </Link>
  )
}
