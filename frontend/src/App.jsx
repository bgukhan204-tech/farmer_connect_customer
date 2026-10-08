import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import PaymentSuccess from './pages/PaymentSuccess'
import Orders from './pages/Orders'
import SellerDashboard from './pages/SellerDashboard'
import SellerOrders from './pages/SellerOrders'
import useStore from './store'

function PrivateRoute({ children, role }) {
  const { user } = useStore()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

function App() {
  const { user } = useStore()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <Routes>
        <Route path="/"               element={<LandingPage />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/home"           element={<Home />} />
        <Route path="/products"       element={<ProductList />} />
        <Route path="/product/:id"    element={<ProductDetail />} />
        <Route path="/cart"           element={<PrivateRoute role="CUSTOMER"><Cart /></PrivateRoute>} />
        <Route path="/checkout"       element={<PrivateRoute role="CUSTOMER"><Checkout /></PrivateRoute>} />
        <Route path="/payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
        <Route path="/orders"         element={<PrivateRoute role="CUSTOMER"><Orders /></PrivateRoute>} />
        <Route path="/seller"         element={<PrivateRoute role="FARMER"><SellerDashboard /></PrivateRoute>} />
        <Route path="/seller/orders"  element={<PrivateRoute role="FARMER"><SellerOrders /></PrivateRoute>} />
      </Routes>
    </div>
  )
}
export default App
