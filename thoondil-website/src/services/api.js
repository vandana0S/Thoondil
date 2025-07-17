import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updatePassword: (passwordData) => api.put('/auth/password', passwordData),
  logout: () => api.post('/auth/logout'),
  deactivateAccount: () => api.delete('/auth/deactivate'),
}

// User API
export const userAPI = {
  getProfile: () => api.get('/users/me/profile'),
  updateProfile: (profileData) => api.put('/users/me/profile', profileData),
  getAddresses: () => api.get('/users/me/addresses'),
  addAddress: (addressData) => api.post('/users/me/addresses', addressData),
  updateAddress: (addressId, addressData) => api.put(`/users/me/addresses/${addressId}`, addressData),
  deleteAddress: (addressId) => api.delete(`/users/me/addresses/${addressId}`),
}

// Products API
export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getProductsByCategory: (category, params) => api.get(`/products/category/${category}`, { params }),
  getCategories: () => api.get('/products/categories'),
  getFeaturedProducts: (params) => api.get('/products/featured', { params }),
}

// Vendors API
export const vendorsAPI = {
  getVendors: (params) => api.get('/vendors', { params }),
  getVendor: (id) => api.get(`/vendors/${id}`),
  getVendorProducts: (id, params) => api.get(`/vendors/${id}/products`, { params }),
  searchVendors: (params) => api.get('/vendors/search', { params }),
  getVendorsByPincode: (pincode, params) => api.get(`/vendors/pincode/${pincode}`, { params }),
}

// Vendor Management API
export const vendorAPI = {
  getProfile: () => api.get('/vendor/profile'),
  createOrUpdateProfile: (profileData) => api.post('/vendor/profile', profileData),
  toggleStatus: () => api.patch('/vendor/status'),
  getDashboard: () => api.get('/vendor/dashboard'),
  getProducts: (params) => api.get('/vendor/products', { params }),
  addProduct: (productData) => api.post('/vendor/products', productData),
  getProduct: (id) => api.get(`/vendor/products/${id}`),
  updateProduct: (id, productData) => api.put(`/vendor/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/vendor/products/${id}`),
  updateProductStock: (id, stockData) => api.patch(`/vendor/products/${id}/stock`, stockData),
}

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (itemData) => api.post('/cart/add', itemData),
  updateCartItem: (productId, quantity) => api.put(`/cart/items/${productId}`, { quantity }),
  removeFromCart: (productId) => api.delete(`/cart/items/${productId}`),
  clearCart: () => api.delete('/cart/clear'),
  validateCart: () => api.get('/cart/validate'),
  getCartSummary: () => api.get('/cart/summary'),
  syncCartPrices: () => api.put('/cart/sync-prices'),
}

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: (params) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id, reason) => api.patch(`/orders/${id}/cancel`, { reason }),
  getOrderStats: (params) => api.get('/orders/stats', { params }),
  
  // Vendor orders
  getVendorOrders: (params) => api.get('/orders/vendor/orders', { params }),
  updateOrderStatus: (id, statusData) => api.patch(`/orders/vendor/${id}/status`, statusData),
}

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAllVendors: (params) => api.get('/admin/vendors', { params }),
  getVendorDetails: (id) => api.get(`/admin/vendors/${id}`),
  verifyVendor: (id, verificationData) => api.put(`/admin/vendors/${id}/verify`, verificationData),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/status`),
}

export default api