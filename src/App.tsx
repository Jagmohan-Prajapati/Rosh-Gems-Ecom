import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { AuthRoute, AdminRoute } from './components/ProtectedRoute'
import { Home } from './pages/Home'
import { Shop } from './pages/Shop'
import { ProductDetail } from './pages/ProductDetail'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { OrderConfirmation } from './pages/OrderConfirmation'
import { Login } from './pages/Login'
import { Account } from './pages/Account'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { RefundPolicy } from './pages/RefundPolicy'
import { ShippingPolicy } from './pages/ShippingPolicy'
import { NotFound } from './pages/NotFound'
import { AdminSidebar } from './components/AdminSidebar'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminProducts } from './pages/AdminProducts'
import { AdminOrders } from './pages/AdminOrders'

export const AppContent: React.FC = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#050705] text-[#F5F5F0] flex">
        {/* Guarded Admin Side Navigation Drawer */}
        <AdminSidebar />
        <main className="flex-1 p-8 md:p-12 overflow-y-auto max-w-7xl mx-auto pt-24 md:pt-12">
          <Routes>
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050705] text-[#F5F5F0] flex flex-col selection:bg-[#D4AF37] selection:text-black">
      {/* Front end Layout Wrapper */}
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          
          {/* Authenticated paths */}
          <Route path="/checkout" element={<AuthRoute><Checkout /></AuthRoute>} />
          <Route path="/order-confirmation/:id" element={<AuthRoute><OrderConfirmation /></AuthRoute>} />
          <Route path="/account" element={<AuthRoute><Account /></AuthRoute>} />
          
          {/* Guest paths */}
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Policies rules */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default function App() {
  return <AppContent />
}
