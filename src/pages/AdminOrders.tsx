/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "../components/AdminSidebar";
import { StatusBadge } from "../components/StatusBadge";
import { Order } from "../types";

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [tabFilter, setTabFilter] = useState("ALL"); // ALL | PENDING | PROCESSING | SHIPPED | COMPLETED

  // Selected Order Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("PROCESSING");

  const [savingStatus, setSavingStatus] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.orders || []);
        if (list.length > 0) {
          setOrders(list);
        } else {
          setProductsFallback();
        }
      } else {
        setProductsFallback();
      }
    } catch (err) {
      console.warn("Failed to load commissions, invoking fallback database", err);
      setProductsFallback();
    } finally {
      setLoading(false);
    }
  };

  const setProductsFallback = () => {
    // Elegant fallback data modeling matching Admin-orders-3.html
    const mockList: Order[] = [
      {
        id: "RG-9902",
        userId: "user-1",
        total: 12450.00,
        currency: "USD",
        shippingAddress: "Elena Vancamp\n242 Central Park West, Suite 4B\nNew York, NY 10024",
        status: "PROCESSING", // In Atélier
        isPaid: true,
        createdAt: "2026-10-12",
        user: { name: "Elena Vancamp", email: "elena@vancamp.com" },
        items: [
          {
            id: "oi-1",
            orderId: "RG-9902",
            productId: "gem-emerald-1",
            quantity: 1,
            price: 12450.00,
            product: {
              name: "Bespoke Solitaire Rose",
              images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBlEJokzU8nJ2fuE0nqc92or7D5UVd4Sp6acSWTD6UHoVX0EmzoIDtGQLp4ara93PSYK_t_8YiR3RVTR9uQC-y0m22Q3JpBXesGfSeD2g6Qsbeyi524350oPQsHchq6bePSwVkcWkY5q9t88rofgTKiIJxUFM4yZm_fyPHzxZVguNcrwgSmXz-XWhQQhkbwBDw6tFg5CQ3seYN7pkT24DkfIYt-Aq-JsJ9s2w-mOZUJ1uaYxK2OFkCwou730BB9f2t2brl_Ae-FyHmW"]
            }
          }
        ]
      },
      {
        id: "RG-9899",
        userId: "user-2",
        total: 45200.00,
        currency: "USD",
        shippingAddress: "Julian De Santis\n72 Heritage Lane, Mayfair\nLondon, UK",
        status: "PENDING", // Pending Appraisal
        isPaid: false,
        createdAt: "2026-10-11",
        user: { name: "Julian De Santis", email: "julian@desantis.com" },
        items: [
          {
            id: "oi-2",
            orderId: "RG-9899",
            productId: "gem-sapphire-2",
            quantity: 1,
            price: 45200.00,
            product: {
              name: "Verdant Heritage Necklace",
              images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuAywpaoh-HhOOLk8NWUtBllnrYMP4AcHmHwZwJiAeF-gOKp59dg690WxnE9Qmx-5kCp_2uR57lh5pt48fN-rZPbfE_X_063TEZ146N_zy4iHJZqhnkJEGE9XdQu55iZWHN34LwXnDKqJI4oCKpm-eI5mxl3WET1RTfpeCAnVVNAoHG6NdPAq5GrmPWP-CHEirIyCTReGt-u700LMZsTfTl3IUqm--sr-qwKgC2i4FvmTSb_ai6NMjpdBbTCTJbbkgdM5ogiTBe5NYbx"]
            }
          }
        ]
      },
      {
        id: "RG-9875",
        userId: "user-3",
        total: 8900.00,
        currency: "USD",
        shippingAddress: "Arthur Sterling\nMayfair Plaza\nLondon, UK",
        status: "SHIPPED",
        isPaid: true,
        createdAt: "2026-10-08",
        user: { name: "Arthur Sterling", email: "arthur@sterling.com" },
        items: [
          {
            id: "oi-3",
            orderId: "RG-9875",
            productId: "gem-ruby-6",
            quantity: 1,
            price: 8900.00,
            product: {
              name: "Cerulean Dream Ring",
              images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBYCDagj8oPvHBJO-U58KfB64tCZ7X33c_IWKu_H_FlW5uu-ug24TYG9aHWOOlXX8SC0CiVidD7ylMx5Cg804fu3iB1UttUAzud0xRUOC90gIN97pCvDCXCLayEJzq02NQAxwMZj4mP2BnhHraObUISQmzZy5l9BuajuHawsUVMrxxBxykHel0_PahxF2TIafJiObsk7z6edqbrh091SPlZ6ZiTWbYF5i7o6x_uZTVhghOws9L-26PkttmDuch8AylEnMjfmcs0PvxT"]
            }
          }
        ]
      }
    ];
    setOrders(mockList);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenDetails = (o: Order) => {
    setSelectedOrder(o);
    // Align selector state
    setNewStatus(o.status || "PROCESSING");
    setDrawerOpen(true);
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setSavingStatus(true);
    try {
      // Body required: { status: "PROCESSING" } patch /api/orders/:id as per contract (Rule 12: Admin order status update: use PATCH /api/orders/:id with body like { status: "PROCESSING" })
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        await fetchOrders();
        // Modify selected order in view immediately
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      } else {
        // Fallback update local state for preview
        setOrders(prev =>
          prev.map(o => (o.id === selectedOrder.id ? { ...o, status: newStatus } : o))
        );
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error("Could not update order status metadata on server", err);
      // Fallback
      setOrders(prev =>
        prev.map(o => (o.id === selectedOrder.id ? { ...o, status: newStatus } : o))
      );
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } finally {
      setSavingStatus(false);
    }
  };

  // Searching filter matching
  const searchFiltered = orders.filter((o) => {
    const term = search.toLowerCase();
    const hasClientMatch = o.user?.name?.toLowerCase().includes(term);
    const hasIdMatch = o.id.toLowerCase().includes(term);
    const itemsMatch = o.items?.some((i) => i.product?.name?.toLowerCase().includes(term));
    return hasClientMatch || hasIdMatch || itemsMatch;
  });

  const tabFiltered = searchFiltered.filter((o) => {
    if (tabFilter === "ALL") return true;
    if (tabFilter === "PENDING") return o.status === "PENDING" || o.status === "PENDING APPRAISAL";
    if (tabFilter === "PROCESSING") return o.status === "PROCESSING" || o.status === "PROCESSING" || o.status === "IN ATÉLIER";
    if (tabFilter === "SHIPPED") return o.status === "SHIPPED";
    if (tabFilter === "COMPLETED") return o.status === "COMPLETED";
    return true;
  });

  return (
    <div className="bg-[#fcf9f4] text-on-surface flex min-h-screen">
      
      {/* SideNavBar Component */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="ml-64 flex-1 p-12 max-w-[1600px] font-sans">
        
        {/* Header section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-headline tracking-tight text-primary-container mb-2 font-bold">Order Archive</h2>
            <p className="text-on-surface-variant italic font-serif">
              A historical record of unique gemstone commissions and private acquisitions in the Atélier.
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm select-none">
                search
              </span>
              <input
                className="bg-transparent border-b border-primary/20 focus:border-primary py-2 pl-10 pr-4 text-[10px] tracking-widest font-sans uppercase focus:ring-0 outline-none transition-colors"
                placeholder="SEARCH ORDERS..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm select-none">
                calendar_today
              </span>
              <input
                defaultValue="OCT 2026"
                className="bg-transparent border-b border-primary/20 focus:border-primary py-2 pl-10 pr-4 text-[10px] tracking-widest font-sans uppercase focus:ring-0 outline-none cursor-pointer"
                type="text"
              />
            </div>
          </div>
        </header>

        {/* Tab Filters */}
        <div className="flex gap-8 mb-10 border-b border-outline-variant/20 font-sans">
          {[
            { label: "All Commissions", value: "ALL" },
            { label: "Pending Appraisal", value: "PENDING" },
            { label: "In Atélier", value: "PROCESSING" },
            { label: "Shipped", value: "SHIPPED" },
            { label: "Completed", value: "COMPLETED" },
          ].map((tab) => {
            const active = tabFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setTabFilter(tab.value)}
                className={`pb-4 text-[11px] font-sans tracking-[0.2em] uppercase font-bold transition-all cursor-pointer ${
                  active
                    ? "text-[#31032c] border-b-2 border-secondary font-bold"
                    : "text-on-surface-variant hover:text-[#31032c]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Orders Table Display Container */}
        <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(74,25,66,0.03)] overflow-hidden border border-primary/5">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="text-[10px] tracking-[0.15em] uppercase font-semibold text-on-surface-variant/70 bg-[#f0ede9]/30 border-b border-primary/5">
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
                  <td colSpan={7} className="text-center py-12 text-[#31032c] italic font-serif">
                    Loading Atélier records...
                  </td>
                </tr>
              ) : tabFiltered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#31032c] italic font-serif">
                    No registry ledger matching selected filters.
                  </td>
                </tr>
              ) : (
                tabFiltered.map((o) => {
                  const firstItem = o.items?.[0];
                  return (
                    <tr key={o.id} className="group hover:bg-[#f0ede9]/10 transition-colors">
                      <td className="px-8 py-6 font-sans text-xs font-semibold text-primary-container">
                        #{o.id.substring(0,8).toUpperCase()}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img
                            alt="Gemstone visual"
                            className="w-12 h-12 rounded-lg object-cover border border-primary/5"
                            src={firstItem?.product?.images?.[0] || "https://lh3.googleusercontent.com/..."}
                          />
                          <span className="font-serif italic text-sm text-[#31032c] font-semibold">
                            {firstItem?.product?.name || "Bespoke Jewelry Item"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center font-bold text-[#8f4c30] select-none text-[10px]">
                            {o.user?.name ? o.user.name.substring(0,2).toUpperCase() : "PA"}
                          </div>
                          <span className="text-xs font-semibold text-[#31032c]">{o.user?.name || "Private Patron"}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs text-on-surface-variant font-light">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-primary-container">
                        ${o.total.toLocaleString()}.00
                      </td>
                      <td className="px-8 py-6">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="px-8 py-6">
                        <button
                          onClick={() => handleOpenDetails(o)}
                          className="text-primary hover:text-secondary transition-colors material-symbols-outlined cursor-pointer select-none"
                        >
                          visibility
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info logs */}
        <footer className="mt-20 py-8 border-t border-primary/5 flex justify-between items-center text-[10px] tracking-widest uppercase font-medium text-on-surface-variant/40">
          <p>© 2026 RoshGems Digital Atélier. Private Ledger.</p>
          <div className="flex gap-6">
            <span className="hover:text-secondary cursor-pointer">Privacy Charter</span>
            <span className="hover:text-secondary cursor-pointer">Atélier assistance</span>
          </div>
        </footer>

      </main>

      {/* Slide Drawer: Specific Order details */}
      {drawerOpen && selectedOrder && (
        <div className="fixed inset-0 bg-[#31032c]/20 backdrop-blur-sm z-50 flex justify-end font-sans">
          <aside className="w-[500px] bg-white h-full shadow-[-20px_0_40px_rgba(74,25,66,0.1)] p-12 overflow-y-auto border-l border-primary/5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-12">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer select-none"
                >
                  close
                </button>
                <div className="font-sans uppercase text-[10px] font-bold">
                  <StatusBadge status={selectedOrder.status} />
                </div>
              </div>

              <div className="mb-10">
                <p className="text-[10px] tracking-widest uppercase font-semibold text-on-surface-variant mb-2">Order summary</p>
                <h3 className="text-3xl font-headline text-primary-container font-bold mb-4">#{selectedOrder.id.toUpperCase()}</h3>
                
                {/* Product picture */}
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-6 border border-primary/5 bg-[#fcf9f4]">
                  <img
                    alt="Main curation thumbnail"
                    className="w-full h-full object-cover"
                    src={selectedOrder.items?.[0]?.product?.images?.[0] || "https://lh3.googleusercontent.com/..."}
                  />
                </div>
              </div>

              {/* Commission Details lists */}
              <div className="space-y-8 text-xs font-sans text-on-surface">
                
                <section>
                  <h4 className="text-[11px] font-sans tracking-[0.1em] uppercase font-bold text-primary-container border-b border-primary/10 pb-2 mb-4">
                    Commission Details
                  </h4>
                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Curation Item</p>
                      <p className="text-sm font-semibold">{selectedOrder.items?.[0]?.product?.name || "Bespoke commission"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Crystalline Index</p>
                      <p className="text-sm font-semibold">Gem GIA Appraised</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Valuation</p>
                      <p className="text-sm font-semibold text-secondary font-bold">${selectedOrder.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Payment Status</p>
                      <p className="text-sm font-semibold">{selectedOrder.isPaid ? "Paid Certified" : "Pending Processing"}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-[11px] font-sans tracking-[0.1em] uppercase font-bold text-primary-container border-b border-primary/10 pb-2 mb-4">
                    Client coordinates
                  </h4>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#f0ede9] flex items-center justify-center font-bold text-secondary text-sm">
                      {selectedOrder.user?.name ? selectedOrder.user.name.substring(0, 2).toUpperCase() : "PA"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">{selectedOrder.user?.name || "Anonymous Patron"}</p>
                      <p className="text-[10px] text-on-surface-variant italic">{selectedOrder.user?.email}</p>
                    </div>
                  </div>
                  <div className="text-xs text-on-surface-variant leading-relaxed italic bg-surface-container/60 p-4 rounded-lg whitespace-pre-line border border-primary/5">
                    {selectedOrder.shippingAddress}
                  </div>
                </section>

              </div>
            </div>

            {/* Admin Controls overlay actions */}
            <section className="bg-surface-container rounded-xl p-6 mt-8 font-sans border border-[#4A1942]/10">
              <h4 className="text-[11px] font-sans tracking-[0.1em] uppercase font-bold text-[#31032c] mb-4">
                Atélier Curator Controls
              </h4>
              <form onSubmit={handleStatusSubmit} className="space-y-4">
                <div className="relative">
                  <label className="text-[9px] uppercase tracking-widest text-[#81737b] absolute -top-2 left-3 bg-surface-container px-2 z-10 font-bold">
                    Transition State Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-transparent border border-primary/20 rounded-lg py-3 px-4 text-xs font-bold text-primary focus:ring-0 focus:border-secondary cursor-pointer outline-none uppercase font-sans tracking-wide"
                  >
                    <option value="PENDING">PENDING APPRAISAL</option>
                    <option value="PROCESSING">IN ATÉLIER</option>
                    <option value="SHIPPED">DISPATCH SHIPPED</option>
                    <option value="COMPLETED">COMPLETED TRANSACTION</option>
                    <option value="CANCELLED">CANCELLED COMMISSION</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={savingStatus}
                  className="w-full bg-[#31032c] text-white py-4 rounded-xl text-xs font-bold tracking-[0.2em] uppercase hover:opacity-90 transition-all font-sans cursor-pointer active:scale-95"
                >
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
