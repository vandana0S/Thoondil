import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Splash from './pages/Splash'

// Consumer Pages
import ConsumerHome from './pages/consumer/Home'
import ConsumerLogin from './pages/consumer/Login'
import ConsumerOrders from './pages/consumer/Orders'
import ConsumerReceiving from './pages/consumer/Receiving'

// Seller Pages
import SellerHome from './pages/seller/SellerHome'
import SellerLogin from './pages/seller/SellerLogin'
import SellerOrders from './pages/seller/SellerOrders'
import SellerReceiving from './pages/seller/SellerReceiving'
import AddProduct from './pages/seller/AddProduct'
import ManageProducts from './pages/seller/ManageProduct'
import Analytics from './pages/seller/Analytics'
import DeliveryStatus from './pages/seller/DeliveryStatus'
import StoreSettings from './pages/seller/StoreSettings'
import AvailableQuantity from './pages/seller/AvailableQuantity'
import OrderedPersons from './pages/seller/OrderedPersons'

// Additional Pages
import OTP from './pages/OTP'
import Location from './pages/Location'
import Cart from './pages/Cart'
import ProductPage from './pages/ProductPage'
import Profile from './pages/Profile'

function AppRouter() {
  return (
    <Routes>
      {/* Show Splash without layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Splash />} />

        {/* Consumer Routes */}
        <Route path="/consumer/home" element={<ConsumerHome />} />
        <Route path="/consumer/login" element={<ConsumerLogin />} />
        <Route path="/consumer/orders" element={<ConsumerOrders />} />
        <Route path="/consumer/receiving" element={<ConsumerReceiving />} />

        {/* Seller Routes */}
        <Route path="/seller/home" element={<SellerHome />} />
        <Route path="/seller/login" element={<SellerLogin />} />
        {/* <Route path="/seller/orders" element={<SellerOrders />} /> */}
        <Route path="/seller/receiving" element={<SellerReceiving />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/manage-products" element={<ManageProducts />} />
        <Route path="/delivery-status" element={<DeliveryStatus />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<StoreSettings />} />
        <Route path="/orders" element={<SellerOrders />} />
        <Route path="/available-quantity" element={<AvailableQuantity />} />
        <Route path="/ordered-persons" element={<OrderedPersons />} />

        {/* Additional Pages */}
        <Route path="/otp" element={<OTP />} />
        <Route path="/location" element={<Location />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default AppRouter
