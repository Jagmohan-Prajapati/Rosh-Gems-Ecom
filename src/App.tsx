/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
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
import { Account } from "./pages/Account";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { ShippingPolicy } from "./pages/ShippingPolicy";
import { RefundPolicy } from "./pages/RefundPolicy";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminProducts } from "./pages/AdminProducts";
import { AdminOrders } from "./pages/AdminOrders";

const FullScreenLoader: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-surface">
    <span className="material-symbols-outlined text-4xl animate-spin text-[#8f4c30]">
      progress_activity
    </span>
  </div>
);

// Protection Guard components
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <FullScreenLoader />;

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <FullScreenLoader />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const CheckoutRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <FullScreenLoader />;

  if (!user) {
    return <Navigate to="/login?redirect=/checkout" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-surface">
          <Navbar />

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

              {/* Auth */}
              <Route
                path="/checkout"
                element={
                  <CheckoutRoute>
                    <Checkout />
                  </CheckoutRoute>
                }
              />
              <Route
                path="/order-confirmation/:id"
                element={
                  <AuthRoute>
                    <OrderConfirmation />
                  </AuthRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <AuthRoute>
                    <Account />
                  </AuthRoute>
                }
              />

              {/* Admin */}
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

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}