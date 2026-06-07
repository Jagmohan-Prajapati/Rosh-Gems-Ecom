/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { CartProvider } from "./lib/CartContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

// Page Imports
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Login } from "./pages/Login";
import { OrderConfirmation } from "./pages/OrderConfirmation";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { ShippingPolicy } from "./pages/ShippingPolicy";
import { RefundPolicy } from "./pages/RefundPolicy";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminProducts } from "./pages/AdminProducts";
import { AdminOrders } from "./pages/AdminOrders";

// Protection Guard components
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface">
        <span className="material-symbols-outlined text-4xl animate-spin text-[#8f4c30]">progress_activity</span>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    // If not admin, redirect to Login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const CheckoutRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface">
        <span className="material-symbols-outlined text-4xl animate-spin text-[#8f4c30]">progress_activity</span>
      </div>
    );
  }

  if (!user) {
    // Login before checkout represents luxury standards
    return <Navigate to="/login?redirect=checkout" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-surface">
            {/* Nav Bar */}
            <Navbar />

            {/* Core routing systems */}
            <div className="flex-grow">
              <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />

                {/* Checked Public / Patron */}
                <Route 
                  path="/checkout" 
                  element={
                    <CheckoutRoute>
                      <Checkout />
                    </CheckoutRoute>
                  } 
                />
                <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />

                {/* Admin Portals */}
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/products" 
                  element={
                    <AdminRoute>
                      <AdminProducts />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/orders" 
                  element={
                    <AdminRoute>
                      <AdminOrders />
                    </AdminRoute>
                  } 
                />

                {/* Fallback redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            {/* Footer */}
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
