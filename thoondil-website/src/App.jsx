import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Public Pages
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ProductDetails from './pages/products/ProductDetails'
import VendorDetails from './pages/vendors/VendorDetails'

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard'
import Cart from './pages/customer/Cart'
import Orders from './pages/customer/Orders'
import OrderDetails from './pages/customer/OrderDetails'
import Profile from './pages/customer/Profile'

// Vendor Pages
import VendorDashboard from './pages/vendor/Dashboard'
import VendorProducts from './pages/vendor/Products'
import VendorOrders from './pages/vendor/Orders'
import VendorProfile from './pages/vendor/Profile'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminVendors from './pages/admin/Vendors'
import AdminUsers from './pages/admin/Users'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="vendors/:id" element={<VendorDetails />} />
        
        {/* Protected Routes */}
        <Route path="dashboard" element={
          <ProtectedRoute>
            {user?.role === 'admin' && <AdminDashboard />}
            {user?.role === 'vendor' && <VendorDashboard />}
            {user?.role === 'customer' && <CustomerDashboard />}
          </ProtectedRoute>
        } />
        
        {/* Customer Routes */}
        <Route path="cart" element={<ProtectedRoute roles={['customer']}><Cart /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute roles={['customer']}><Orders /></ProtectedRoute>} />
        <Route path="orders/:id" element={<ProtectedRoute roles={['customer']}><OrderDetails /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* Vendor Routes */}
        <Route path="vendor/products" element={<ProtectedRoute roles={['vendor']}><VendorProducts /></ProtectedRoute>} />
        <Route path="vendor/orders" element={<ProtectedRoute roles={['vendor']}><VendorOrders /></ProtectedRoute>} />
        <Route path="vendor/profile" element={<ProtectedRoute roles={['vendor']}><VendorProfile /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="admin/vendors" element={<ProtectedRoute roles={['admin']}><AdminVendors /></ProtectedRoute>} />
        <Route path="admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}

export default App