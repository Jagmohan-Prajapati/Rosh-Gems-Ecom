/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Bell,
  Mail,
  TrendingUp,
  ShoppingBag,
  Gem,
  Clock3,
  Eye,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { AdminSidebar } from "../components/AdminSidebar";
import { StatusBadge } from "../components/StatusBadge";
import { Order, Product } from "../types";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatShortDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const FALLBACK_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBgYChKBe12r4qlu5f1BwwJo8Oi_KSdZnhnXCa6or78Xe6xhEG5vLm2wIiI8QKmrqeLpZkAUCBFuGssTzlKmO7XmHUmANHfKH9PHxiIMoyfGV8LswSQf-_RqZPbo2bX9pYJVUYTT7B3gqFpxAOcxIUj3Lml8GBzf4Kt8AoxKf7BJ65K2qL__kOJe9SLawFR8CzDVqI7WMDYtvJfuZiDyFfhmpif8WS6XajUgB2rlBiP6IonCjggwRyRhhsdY3n91W669Jtar9Vw6uM_";

type DashboardOrder = Order & {
  user?: {
    name?: string;
    email?: string;
  };
};

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch("/api/orders", {
            credentials: "include",
            headers: { Accept: "application/json" },
          }),
          fetch("/api/products", {
            credentials: "include",
            headers: { Accept: "application/json" },
          }),
        ]);

        const ordersData = await ordersRes.json().catch(() => null);
        const productsData = await productsRes.json().catch(() => null);

        if (!ordersRes.ok) {
          throw new Error(ordersData?.error || "Failed to load admin orders.");
        }

        if (!productsRes.ok) {
          throw new Error(productsData?.error || "Failed to load products.");
        }

        const orderList = Array.isArray(ordersData)
          ? ordersData
          : Array.isArray(ordersData?.orders)
          ? ordersData.orders
          : [];

        const productList = Array.isArray(productsData)
          ? productsData
          : Array.isArray(productsData?.products)
          ? productsData.products
          : [];

        if (!isMounted) return;

        setOrders(orderList);
        setProducts(productList);
      } catch (err) {
        console.error("Failed to load admin dashboard data", err);
        if (isMounted) {
          setErrorMsg(
            err instanceof Error ? err.message : "Failed to load dashboard data."
          );
          setOrders([]);
          setProducts([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return orders;

    return orders.filter((o) => {
      const userName = o.user?.name?.toLowerCase() || "";
      const userEmail = o.user?.email?.toLowerCase() || "";
      const orderId = String(o.id).toLowerCase();
      const status = String(o.status || "").toLowerCase();

      return (
        userName.includes(q) ||
        userEmail.includes(q) ||
        orderId.includes(q) ||
        status.includes(q)
      );
    });
  }, [orders, searchTerm]);

  const recentOrders = useMemo(() => filteredOrders.slice(0, 5), [filteredOrders]);

  const totalRevenue = useMemo(
    () =>
      orders
        .filter((o) => o.isPaid)
        .reduce((sum, o) => sum + Number(o.total || 0), 0),
    [orders]
  );

  const pendingAppraisal = useMemo(
    () =>
      orders.filter((o) =>
        ["PENDING", "PROCESSING"].includes(String(o.status || "").toUpperCase())
      ).length,
    [orders]
  );

  const activeProducts = useMemo(
    () => products.filter((p) => p.isActive !== false).length,
    [products]
  );

  const featuredProduct = useMemo(
    () => products.find((p) => p.isFeatured) || products[0] || null,
    [products]
  );

  const monthlyRevenue = useMemo(() => {
    const now = new Date();
    const buckets = Array.from({ length: 5 }).map((_, index) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (4 - index), 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = d.toLocaleDateString("en-IN", { month: "short" });
      return { key, label, total: 0 };
    });

    for (const order of orders) {
      if (!order.isPaid || !order.createdAt) continue;
      const d = new Date(order.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = buckets.find((b) => b.key === key);
      if (bucket) bucket.total += Number(order.total || 0);
    }

    const max = Math.max(...buckets.map((b) => b.total), 1);

    return buckets.map((b) => ({
      ...b,
      heightPct: Math.max(8, Math.round((b.total / max) * 100)),
    }));
  }, [orders]);

  return (
    <div className="flex min-h-screen bg-[#fcf9f4] text-on-surface">
      <AdminSidebar />

      <main className="ml-64 flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-[#4A1942]/10 bg-white/80 px-12 py-6 font-sans backdrop-blur-md">
          <div className="flex items-center gap-4">
            <nav className="flex gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              <span className="opacity-50">Atélier</span>
              <span className="opacity-50">/</span>
              <span className="text-[#31032c]">Dashboard Overview</span>
            </nav>
          </div>

          <div className="flex items-center gap-8 text-[#31032c]">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-40" />
              <input
                className="w-64 rounded-full border-none border-b border-primary/10 bg-surface-container py-2 pl-10 pr-4 text-xs outline-none transition-all placeholder:italic placeholder:text-on-surface-variant/50 focus:ring-0"
                placeholder="Search orders..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4 text-[#4A1942]">
              <button
                className="transition-transform hover:scale-105"
                aria-label="Notifications"
                type="button"
              >
                <Bell className="h-5 w-5" />
              </button>

              <button
                className="transition-transform hover:scale-105"
                aria-label="Inbox"
                type="button"
              >
                <Mail className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <section className="space-y-12 p-12">
          {errorMsg && (
            <div className="rounded-xl border border-red-300 bg-red-50 px-5 py-4 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group relative overflow-hidden rounded-xl border-t-2 border-secondary bg-surface-container p-6 transition-shadow hover:shadow-xl">
              <div className="mb-4 flex items-start justify-between">
                <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#4f434b]">
                  Revenue
                </p>
                <TrendingUp className="h-4 w-4 text-secondary" />
              </div>
              <h3 className="mb-2 font-serif text-3xl font-bold text-primary">
                {formatPrice(totalRevenue)}
              </h3>
              <div className="flex h-10 items-end gap-1">
                {monthlyRevenue.map((m) => (
                  <div
                    key={m.key}
                    className="w-full rounded-t-sm bg-primary/15 transition-all group-hover:bg-primary/25"
                    style={{ height: `${Math.max(20, Math.round(m.heightPct * 0.4))}%` }}
                    title={`${m.label}: ${formatPrice(m.total)}`}
                  />
                ))}
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl border-t-2 border-secondary bg-surface-container p-6 transition-shadow hover:shadow-xl">
              <div className="mb-4 flex items-start justify-between">
                <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#4f434b]">
                  Commissions
                </p>
                <ShoppingBag className="h-4 w-4 text-secondary" />
              </div>
              <h3 className="mb-2 font-serif text-3xl font-bold text-primary">
                {orders.length}
              </h3>
              <div className="flex h-10 items-end gap-1">
                {monthlyRevenue.map((m, idx) => (
                  <div
                    key={m.key}
                    className={`w-full rounded-t-sm ${
                      idx === monthlyRevenue.length - 1 ? "bg-secondary" : "bg-[#8f4c30]/15"
                    }`}
                    style={{ height: `${30 + ((idx % 3) + 1) * 12}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl border-t-2 border-secondary bg-surface-container p-6 transition-shadow hover:shadow-xl">
              <div className="mb-4 flex items-start justify-between">
                <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#4f434b]">
                  Products
                </p>
                <Gem className="h-4 w-4 text-secondary" />
              </div>
              <h3 className="mb-2 font-serif text-3xl font-bold text-primary">
                {activeProducts}
              </h3>
              <div className="flex h-10 items-end gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full rounded-t-sm bg-primary"
                    style={{ height: `${75 + (i % 2) * 10}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl border-t-2 border-secondary bg-surface-container p-6 transition-shadow hover:shadow-xl">
              <div className="mb-4 flex items-start justify-between">
                <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#4f434b]">
                  Pending Appraisal
                </p>
                <Clock3 className="h-4 w-4 text-secondary" />
              </div>
              <h3 className="mb-2 font-serif text-3xl font-bold text-primary">
                {String(pendingAppraisal).padStart(2, "0")}
              </h3>
              <div className="flex h-10 items-end gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={i === 1 ? "w-full rounded-t-sm bg-primary" : "w-full rounded-t-sm bg-primary/10"}
                    style={{ height: `${12 + i * 14}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex h-[450px] flex-col justify-between rounded-xl border border-[#4A1942]/10 bg-white p-10 lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif text-[#31032c]">Revenue Trend</h2>
                  <p className="font-serif text-xs italic text-on-surface-variant">
                    Performance across the latest five months
                  </p>
                </div>

                <select
                  className="cursor-pointer rounded-full bg-[#fcf9f4] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-primary outline-none ring-1 ring-[#31032c]/10"
                  defaultValue="monthly"
                >
                  <option value="monthly">Monthly Atélier View</option>
                </select>
              </div>

              <div className="relative flex h-[250px] w-full items-end justify-between px-4 pb-2">
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between border-l border-primary/10 py-2">
                  <div className="w-full border-t border-primary/5" />
                  <div className="w-full border-t border-primary/5" />
                  <div className="w-full border-t border-primary/5" />
                  <div className="w-full border-t border-primary/5" />
                </div>

                {monthlyRevenue.map((m, index) => (
                  <div
                    key={m.key}
                    className={`group relative z-10 w-12 rounded-t-xl transition-colors ${
                      index === monthlyRevenue.length - 1
                        ? "bg-primary-container"
                        : "bg-primary-container/20 hover:bg-primary-container/40"
                    }`}
                    style={{ height: `${m.heightPct}%` }}
                    title={`${m.label}: ${formatPrice(m.total)}`}
                  >
                    <div
                      className={`absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary ${
                        index === monthlyRevenue.length - 1 ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {formatPrice(m.total)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between px-4 font-sans text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                {monthlyRevenue.map((m) => (
                  <span key={m.key}>{m.label}</span>
                ))}
              </div>
            </div>

            <div className="relative flex min-h-[450px] flex-col justify-end overflow-hidden rounded-xl bg-[#31032c] p-8 text-on-primary">
              <img
                alt={featuredProduct?.name || "Featured gemstone"}
                className="absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-overlay"
                src={featuredProduct?.images?.[0] || FALLBACK_IMAGE}
              />

              <div className="relative z-10 space-y-4">
                <span className="inline-block rounded-full bg-secondary px-3 py-1 font-sans text-[8px] font-bold uppercase tracking-tighter">
                  Specimen of the month
                </span>

                <h2 className="text-3xl leading-tight font-serif">
                  {featuredProduct?.name || "No featured product"}
                </h2>

                <p className="font-serif text-xs italic opacity-75">
                  {featuredProduct
                    ? `Estimated valuation: ${formatPrice(featuredProduct.price)}`
                    : "No featured specimen available right now."}
                </p>

                <Link
                  to={featuredProduct ? `/shop/${featuredProduct.id}` : "/admin/products"}
                  className="block w-full rounded-lg bg-[#fcf9f4] py-3 text-center font-sans text-[10px] font-bold uppercase tracking-widest text-[#31032c] transition-all hover:bg-secondary hover:text-white"
                >
                  View Full Specs
                </Link>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#4A1942]/10 bg-white">
            <div className="flex items-center justify-between border-b border-[#4A1942]/10 px-10 py-8">
              <h2 className="text-xl font-serif text-[#31032c]">Recent Atélier Requests</h2>
              <Link
                to="/admin/orders"
                className="text-[10px] font-bold uppercase tracking-widest text-[#8f4c30] hover:underline"
              >
                Open Orders Console
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans">
                <thead>
                  <tr className="border-b border-primary/5 bg-[#f0ede9]/25 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    <th className="px-10 py-4">Client</th>
                    <th className="px-10 py-4">Ref ID</th>
                    <th className="px-10 py-4">Creation</th>
                    <th className="px-10 py-4">Status</th>
                    <th className="px-10 py-4">Total</th>
                    <th className="px-10 py-4 text-right">View Detail</th>
                  </tr>
                </thead>

                <tbody className="text-xs">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-10 py-10 text-center text-sm italic text-on-surface-variant"
                      >
                        Loading recent requests...
                      </td>
                    </tr>
                  ) : recentOrders.length > 0 ? (
                    recentOrders.map((o) => (
                      <tr
                        key={o.id}
                        className="border-b border-[#4A1942]/5 transition-colors hover:bg-surface-container/10"
                      >
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#31032c]/10 font-sans font-bold text-[#31032c]">
                              {o.user?.name ? o.user.name.substring(0, 2).toUpperCase() : "PA"}
                            </div>
                            <span className="font-bold text-primary">
                              {o.user?.name || "Anonymous Patron"}
                            </span>
                          </div>
                        </td>

                        <td className="px-10 py-6 font-mono text-[10px] opacity-60">
                          {String(o.id).substring(0, 8).toUpperCase()}
                        </td>

                        <td className="px-10 py-6 font-serif italic">
                          {formatShortDate(o.createdAt)}
                        </td>

                        <td className="px-10 py-6">
                          <StatusBadge status={o.status} />
                        </td>

                        <td className="px-10 py-6 font-bold text-primary">
                          {formatPrice(Number(o.total || 0))}
                        </td>

                        <td className="px-10 py-6 text-right">
                          <Link
                            to="/admin/orders"
                            className="inline-flex items-center justify-center text-[#31032c]/50 transition-colors hover:text-secondary"
                            aria-label={`View details for order ${o.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-10 py-10 text-center text-sm italic text-on-surface-variant"
                      >
                        No recent requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-surface-container-low p-6 text-center">
              <Link
                to="/admin/orders"
                className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#31032c] transition-all hover:text-[#8f4c30]"
              >
                View All Commissions
              </Link>
            </div>
          </div>
        </section>

        <footer className="mt-auto flex items-center justify-between border-t border-[#4A1942]/5 bg-[#f0ede9]/50 px-12 py-8 font-sans text-[10px] uppercase tracking-widest text-on-surface-variant/40">
          <p>© 2026 RoshGems Digital Atélier. Indian Luxury Heritage.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-secondary">
              Privacy
            </Link>
            <Link to="/shipping-policy" className="hover:text-secondary">
              Shipping
            </Link>
            <Link to="/refund-policy" className="hover:text-secondary">
              Returns
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;