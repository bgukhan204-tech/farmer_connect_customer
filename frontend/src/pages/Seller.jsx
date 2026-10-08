import { useEffect, useState } from 'react'
import { useAuthStore } from '../store.js'
import ProductCard from '../components/ProductCard'
import { Plus, Package, TrendingUp, BarChart3 } from 'lucide-react'

const Seller = () => {
  const { user, token } = useAuthStore()
  const [myProducts, setMyProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyProducts()
  }, [])

  const fetchMyProducts = async () => {
    try {
      const response = await fetch(`/api/products?farmer_id=${user.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      const data = await response.json()
      setMyProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Seller Dashboard
          </h1>
          <p className="text-xl text-gray-600">Manage your farm products & orders</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-green-100 hover:shadow-2xl transition-all">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{myProducts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-blue-100 hover:shadow-2xl transition-all">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-orange-100 hover:shadow-2xl transition-all">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-xl">
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-3xl font-bold text-gray-900">4.6⭐</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-100 hover:shadow-2xl transition-all">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-3xl font-bold text-gray-900">₹24,500</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Products</h2>
              <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading your products...</p>
            </div>
          ) : (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myProducts.map((product) => (
                  <ProductCard key={product.id} product={product} isOwn={true} />
                ))}
              </div>
              {myProducts.length === 0 && (
                <div className="text-center py-24">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
                  <p className="text-gray-500 mb-6">Start by adding your first farm product</p>
                  <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                    Add Product
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Seller

