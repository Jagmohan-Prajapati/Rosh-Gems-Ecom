/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { Search, Eye, X, Loader2 } from "lucide-react";
import { AdminSidebar } from "../components/AdminSidebar";
import { StatusBadge } from "../components/StatusBadge";
import { Order } from "../types";

type AdminOrder = Order & {
  user?: {
    name?: string;
    email?: string;
  };
  items?: Array<{
    id: string;
    orderId?: string;
    productId?: string;
    quantity: number;
    price: number;
    product?: {
      name?: string;
      images?: string[];
    };
  }>;
};

const FALLBACK_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBgYChKBe12r4qlu5f1BwwJo8Oi_KSdZnhnXCa6or78Xe6xhEG5vLm2wIiI8QKmrqeLpZkAUCBFuGssTzlKmO7XmHUmANHfKH9PHxiIMoyfGV8LswSQf-_RqZPbo2bX9pYJVUYTT7B3gqFpxAOcxIUj3Lml8GBzf4Kt8AoxKf7BJ65K2qL__kOJe9SLawFR8CzDVqI7WMDYtvJfuZiDyFfhmpif8WS6XajUgB2rlBiP6IonCjggwRyRhhsdY3n91W669Jtar9Vw6uM_";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function normalizeStatus(status?: string) {
  return String(status || "").toUpperCase();
}

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [tabFilter, setTabFilter] = useState("ALL");
  const [errorMsg, setErrorMsg] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [newStatus, setNewStatus] = useState("PROCESSING");
  const [savingStatus, setSavingStatus] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/orders", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load orders.");
      }

      const list = Array.isArray(data) ? data : Array.isArray(data?.orders) ? data.orders : [];
      setOrders(list);
    } catch (err) {
      console.error("Failed to load admin orders", err);
      setOrders([]);
      setErrorMsg(err instanceof Error ? err.message : "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchOrders();
  }, []);

  const handleOpenDetails = (order: AdminOrder) => {
    setSelectedOrder(order);
    setNewStatus(normalizeStatus(order.status) || "PROCESSING");
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setSavingStatus(true);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update order status.");
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: newStatus } : o))
      );
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    } catch (err) {
      console.error("Could not update order status on server", err);
      setErrorMsg(
        err instanceof Error ? err.message : "Could not update order status."
      );
    } finally {
      setSavingStatus(false);
    }
  };

  const searchFiltered = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return orders;

    return orders.filter((o) => {
      const clientName = o.user?.name?.toLowerCase() || "";
      const clientEmail = o.user?.email?.toLowerCase() || "";
      const orderId = String(o.id).toLowerCase();
      const itemName =
        o.items?.some((i) => i.product?.name?.toLowerCase().includes(term)) || false;

      return (
        clientName.includes(term) ||
        clientEmail.includes(term) ||
        orderId.includes(term) ||
        itemName
      );
    });
  }, [orders, search]);

  const tabFiltered = useMemo(() => {
    return searchFiltered.filter((o) => {
      const status = normalizeStatus(o.status);

      if (tabFilter === "ALL") return true;
      if (tabFilter === "PENDING") return status === "PENDING";
      if (tabFilter === "PROCESSING") return status === "PROCESSING";
      if (tabFilter === "SHIPPED") return status === "SHIPPED";
      if (tabFilter === "COMPLETED") return status === "COMPLETED";
      if (tabFilter === "CANCELLED") return status === "CANCELLED";

      return true;
    });
  }, [searchFiltered, tabFilter]);

  return (
    <div className="flex min-h-screen bg-[#fcf9f4] text-on-surface">
      <AdminSidebar />

      <main className="ml-64 max-w-[1600px] flex-1 p-12 font-sans">
        <header className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="mb-2 font-headline text-4xl font-bold tracking-tight text-primary-container">
              Order Archive
            </h2>
            <p className="font-serif italic text-on-surface-variant">
              A historical record of unique gemstone commissions and private acquisitions in
              the Atélier.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="group relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
              <input
                className="border-b border-primary/20 bg-transparent py-2 pl-10 pr-4 font-sans text-[10px] uppercase tracking-widest outline-none transition-colors focus:border-primary focus:ring-0"
                placeholder="SEARCH ORDERS..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </header>

        {errorMsg && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <div className="mb-10 flex gap-8 border-b border-outline-variant/20 font-sans">
          {[
            { label: "All Commissions", value: "ALL" },
            { label: "Pending", value: "PENDING" },
            { label: "Processing", value: "PROCESSING" },
            { label: "Shipped", value: "SHIPPED" },
            { label: "Completed", value: "COMPLETED" },
            { label: "Cancelled", value: "CANCELLED" },
          ].map((tab) => {
            const active = tabFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setTabFilter(tab.value)}
                type="button"
                className={`cursor-pointer pb-4 font-sans text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${
                  active
                    ? "border-b-2 border-secondary font-bold text-[#31032c]"
                    : "text-on-surface-variant hover:text-[#31032c]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-xl border border-primary/5 bg-white shadow-[0_10px_30px_rgba(74,25,66,0.03)]">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="border-b border-primary/5 bg-[#f0ede9]/30 text-[10px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant/70">
                <th className="px-8 py-6">Order ID</th>
                <th className="px-8 py-6">Gemstone Specimen</th>
                <th className="px-8 py-6">Client Name</th>
                <th className="px-8 py-6">Date Placed</th>
                <th className="px-8 py-6">Value</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f0ede9]/30 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center font-serif italic text-[#31032c]">
                    Loading Atélier records...
                  </td>
                </tr>
              ) : tabFiltered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center font-serif italic text-[#31032c]">
                    No registry ledger matching selected filters.
                  </td>
                </tr>
              ) : (
                tabFiltered.map((o) => {
                  const firstItem = o.items?.[0];

                  return (
                    <tr key={o.id} className="group transition-colors hover:bg-[#f0ede9]/10">
                      <td className="px-8 py-6 font-sans text-xs font-semibold text-primary-container">
                        #{String(o.id).substring(0, 8).toUpperCase()}
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img
                            alt={firstItem?.product?.name || "Gemstone visual"}
                            className="h-12 w-12 rounded-lg border border-primary/5 object-cover"
                            src={firstItem?.product?.images?.[0] || FALLBACK_IMAGE}
                          />
                          <span className="font-serif text-sm font-semibold italic text-[#31032c]">
                            {firstItem?.product?.name || "Bespoke Jewelry Item"}
                          </span>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-container/20 text-[10px] font-bold text-[#8f4c30] select-none">
                            {o.user?.name ? o.user.name.substring(0, 2).toUpperCase() : "PA"}
                          </div>
                          <span className="text-xs font-semibold text-[#31032c]">
                            {o.user?.name || "Private Patron"}
                          </span>
                        </div>
                      </td>

                      <td className="px-8 py-6 text-xs font-light text-on-surface-variant">
                        {formatDate(o.createdAt)}
                      </td>

                      <td className="px-8 py-6 text-xs font-bold text-primary-container">
                        {formatPrice(Number(o.total || 0))}
                      </td>

                      <td className="px-8 py-6">
                        <StatusBadge status={o.status} />
                      </td>

                      <td className="px-8 py-6">
                        <button
                          onClick={() => handleOpenDetails(o)}
                          className="cursor-pointer text-primary transition-colors hover:text-secondary"
                          type="button"
                          aria-label={`View order ${o.id}`}
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <footer className="mt-20 flex items-center justify-between border-t border-primary/5 py-8 text-[10px] font-medium uppercase tracking-widest text-on-surface-variant/40">
          <p>© 2026 RoshGems Digital Atélier. Private Ledger.</p>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-secondary">Privacy Charter</span>
            <span className="cursor-pointer hover:text-secondary">Atélier assistance</span>
          </div>
        </footer>
      </main>

      {drawerOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#31032c]/20 font-sans backdrop-blur-sm">
          <aside className="flex h-full w-[500px] flex-col justify-between overflow-y-auto border-l border-primary/5 bg-white p-12 shadow-[-20px_0_40px_rgba(74,25,66,0.1)]">
            <div>
              <div className="mb-12 flex items-center justify-between">
                <button
                  onClick={handleCloseDrawer}
                  className="cursor-pointer text-on-surface-variant transition-colors hover:text-primary"
                  type="button"
                  aria-label="Close order details"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="font-sans text-[10px] font-bold uppercase">
                  <StatusBadge status={selectedOrder.status} />
                </div>
              </div>

              <div className="mb-10">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                  Order summary
                </p>
                <h3 className="mb-4 font-headline text-3xl font-bold text-primary-container">
                  #{String(selectedOrder.id).toUpperCase()}
                </h3>

                <div className="mb-6 aspect-[4/3] overflow-hidden rounded-xl border border-primary/5 bg-[#fcf9f4]">
                  <img
                    alt={selectedOrder.items?.[0]?.product?.name || "Main curation thumbnail"}
                    className="h-full w-full object-cover"
                    src={selectedOrder.items?.[0]?.product?.images?.[0] || FALLBACK_IMAGE}
                  />
                </div>
              </div>

              <div className="space-y-8 text-xs text-on-surface">
                <section>
                  <h4 className="mb-4 border-b border-primary/10 pb-2 font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-primary-container">
                    Commission Details
                  </h4>
                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <p className="mb-1 text-[10px] uppercase tracking-wider text-on-surface-variant">
                        Curation Item
                      </p>
                      <p className="text-sm font-semibold">
                        {selectedOrder.items?.[0]?.product?.name || "Bespoke commission"}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] uppercase tracking-wider text-on-surface-variant">
                        Order Date
                      </p>
                      <p className="text-sm font-semibold">
                        {formatDate(selectedOrder.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] uppercase tracking-wider text-on-surface-variant">
                        Valuation
                      </p>
                      <p className="text-sm font-bold font-semibold text-secondary">
                        {formatPrice(Number(selectedOrder.total || 0))}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] uppercase tracking-wider text-on-surface-variant">
                        Payment Status
                      </p>
                      <p className="text-sm font-semibold">
                        {selectedOrder.isPaid ? "Paid Certified" : "Pending Processing"}
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="mb-4 border-b border-primary/10 pb-2 font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-primary-container">
                    Client coordinates
                  </h4>
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0ede9] text-sm font-bold text-secondary">
                      {selectedOrder.user?.name
                        ? selectedOrder.user.name.substring(0, 2).toUpperCase()
                        : "PA"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">
                        {selectedOrder.user?.name || "Anonymous Patron"}
                      </p>
                      <p className="text-[10px] italic text-on-surface-variant">
                        {selectedOrder.user?.email || "No email available"}
                      </p>
                    </div>
                  </div>
                  <div className="whitespace-pre-line rounded-lg border border-primary/5 bg-surface-container/60 p-4 text-xs italic leading-relaxed text-on-surface-variant">
                    {selectedOrder.shippingAddress || "No shipping address available."}
                  </div>
                </section>
              </div>
            </div>

            <section className="mt-8 rounded-xl border border-[#4A1942]/10 bg-surface-container p-6 font-sans">
              <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#31032c]">
                Atélier Curator Controls
              </h4>
              <form onSubmit={handleStatusSubmit} className="space-y-4">
                <div className="relative">
                  <label className="absolute -top-2 left-3 z-10 bg-surface-container px-2 text-[9px] font-bold uppercase tracking-widest text-[#81737b]">
                    Transition State Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full cursor-pointer rounded-lg border border-primary/20 bg-transparent px-4 py-3 font-sans text-xs font-bold uppercase tracking-wide text-primary outline-none focus:border-secondary focus:ring-0"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={savingStatus}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#31032c] py-4 font-sans text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                >
                  {savingStatus && <Loader2 className="h-4 w-4 animate-spin" />}
                  {savingStatus ? "Updating Registry..." : "Commit Status Transition"}
                </button>
              </form>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;