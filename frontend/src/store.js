import { create } from 'zustand'

const useStore = create((set, get) => ({
  // Auth
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,

  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    set({ user, token })
  },
  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    set({ user: null, token: null, cart: [] })
  },

  // Cart
  cart: [],
  cartCount: 0,
  setCart: (cart) => set({ cart, cartCount: cart.reduce((a, i) => a + i.quantity, 0) }),
  clearCartState: () => set({ cart: [], cartCount: 0 }),

  // UI
  loading: false,
  setLoading: (loading) => set({ loading }),
}))

export default useStore
