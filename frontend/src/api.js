import axios from 'axios'

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' })

// Attach JWT token to every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const register   = data => API.post('/auth/register', data)
export const login      = data => API.post('/auth/login', data)

// Products
export const getProducts      = (params) => API.get('/products', { params })
export const getProductById   = (id)     => API.get(`/products/${id}`)
export const getMyProducts    = (id)     => API.get(`/products/farmer/${id}`)
export const createProduct    = (data)   => API.post('/products', data)
export const updateProduct    = (id, data) => API.put(`/products/${id}`, data)
export const deleteProduct    = (id)     => API.delete(`/products/${id}`)

// Cart
export const getCart        = ()        => API.get('/cart')
export const addToCart      = (data)    => API.post('/cart', data)
export const updateCartItem = (id, qty) => API.put(`/cart/${id}`, { quantity: qty })
export const removeCartItem = (id)      => API.delete(`/cart/${id}`)
export const clearCart      = ()        => API.delete('/cart')

// Orders
export const placeOrder     = (data)    => API.post('/orders', data)
export const placeDirectOrder = (data)  => API.post('/orders/direct', data)
export const getMyOrders    = ()        => API.get('/orders')
export const getFarmerOrders= ()        => API.get('/orders/farmer')
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status })

// Payment
export const createRazorpayOrder = (amount) => API.post('/payment/create-order', { amount })
export const verifyPayment        = (data)   => API.post('/payment/verify', data)

export default API
