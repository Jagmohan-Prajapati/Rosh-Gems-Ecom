/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { AdminSidebar } from "../components/AdminSidebar";
import { StatusBadge } from "../components/StatusBadge";
import { Order } from "../types";

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          // Backend returns array or { orders: [...] }
          const list = Array.isArray(data) ? data : (data.orders || []);
          setOrders(list.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to load admin dashboard requests", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="bg-[#fcf9f4] text-on-surface flex min-h-screen">
      {/* Admin Sidebar Menu */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        
        {/* Top AppBar */}
        <header className="sticky top-0 w-full z-40 flex items-center justify-between px-12 py-6 bg-white/80 backdrop-blur-md border-b border-[#4A1942]/10 font-sans">
          <div className="flex items-center gap-4">
            <nav className="flex text-[10px] uppercase tracking-widest text-on-surface-variant font-bold gap-2">
              <span className="opacity-50">Atélier</span>
              <span className="opacity-50">/</span>
              <span className="text-[#31032c]">Dashboard Overview</span>
            </nav>
          </div>
          <div className="flex items-center gap-8 text-[#31032c]">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary opacity-40 select-none">
                search
              </span>
              <input
                className="bg-surface-container border-none border-b border-primary/10 focus:ring-0 text-xs pl-10 pr-4 py-2 rounded-full w-64 transition-all placeholder:italic placeholder:text-on-surface-variant/50 outline-none"
                placeholder="Search Inventory..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-4 text-[#4A1942]">
              <button className="material-symbols-outlined hover:scale-105 transition-transform select-none" aria-label="Notifications">
                notifications
              </button>
              <button className="material-symbols-outlined hover:scale-105 transition-transform select-none" aria-label="Inbox">
                mail
              </button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <section className="p-12 space-y-12">
          
          {/* KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* KPI 1 */}
            <div className="bg-surface-container rounded-xl p-6 relative overflow-hidden group hover:shadow-xl transition-shadow border-t-2 border-secondary">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#4f434b] font-sans">Revenue</p>
                <span className="material-symbols-outlined text-secondary text-sm select-none">trending_up</span>
              </div>
              <h3 className="text-3xl font-serif text-primary mb-2 font-bold">$142,850</h3>
              <div className="h-10 flex items-end gap-1">
                <div className="w-full bg-primary/10 h-4 rounded-t-sm group-hover:h-6 transition-all" />
                <div className="w-full bg-primary/10 h-6 rounded-t-sm group-hover:h-4 transition-all" />
                <div className="w-full bg-primary/10 h-8 rounded-t-sm group-hover:h-10 transition-all" />
                <div className="w-full bg-primary h-10 rounded-t-sm" />
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-surface-container rounded-xl p-6 relative overflow-hidden group hover:shadow-xl transition-shadow border-t-2 border-secondary">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#4f434b] font-sans">Commissions</p>
                <span className="material-symbols-outlined text-secondary text-sm select-none">shopping_bag</span>
              </div>
              <h3 className="text-3xl font-serif text-primary mb-2 font-bold">42</h3>
              <div className="h-10 flex items-end gap-1">
                <div className="w-full bg-[#8f4c30]/10 h-8 rounded-t-sm" />
                <div className="w-full bg-[#8f4c30]/10 h-5 rounded-t-sm" />
                <div className="w-full bg-secondary h-7 rounded-t-sm" />
                <div className="w-full bg-[#8f4c30]/15 h-4 rounded-t-sm" />
              </div>
            </div>

            {/* KPI 3 */}
            <div className="bg-surface-container rounded-xl p-6 relative overflow-hidden group hover:shadow-xl transition-shadow border-t-2 border-secondary">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#4f434b] font-sans">Products</p>
                <span className="material-symbols-outlined text-secondary text-sm select-none">diamond</span>
              </div>
              <h3 className="text-3xl font-serif text-primary mb-2 font-bold">1,204</h3>
              <div className="h-10 flex items-end gap-1">
                <div className="w-full bg-primary h-10 rounded-t-sm" />
                <div className="w-full bg-primary h-9 rounded-t-sm" />
                <div className="w-full bg-primary h-10 rounded-t-sm" />
                <div className="w-full bg-primary h-9 rounded-t-sm" />
              </div>
            </div>

            {/* KPI 4 */}
            <div className="bg-surface-container rounded-xl p-6 relative overflow-hidden group hover:shadow-xl transition-shadow border-t-2 border-secondary">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#4f434b] font-sans">Pending Appraisal</p>
                <span className="material-symbols-outlined text-secondary text-sm select-none">pending_actions</span>
              </div>
              <h3 className="text-3xl font-serif text-primary mb-2 font-bold">08</h3>
              <div className="h-10 flex items-end gap-1">
                <div className="w-full bg-primary/10 h-2 rounded-t-sm" />
                <div className="w-full bg-primary h-5 rounded-t-sm" />
                <div className="w-full bg-primary/10 h-3 rounded-t-sm" />
                <div className="w-full bg-primary/10 h-1 rounded-t-sm" />
              </div>
            </div>

          </div>

          {/* Sorter and Spotlight Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Visual fiscal trend chart */}
            <div className="lg:col-span-2 bg-white rounded-xl p-10 border border-[#4A1942]/10 flex flex-col justify-between h-[450px]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-serif text-[#31032c]">Revenue Trend</h2>
                  <p className="text-xs text-on-surface-variant italic font-serif">Performance across Q4 Fiscal Year</p>
                </div>
                <select className="bg-[#fcf9f4] border-none text-[10px] uppercase tracking-widest font-bold text-primary px-4 py-2 rounded-full ring-1 ring-[#31032c]/10 outline-none cursor-pointer">
                  <option>Monthly Atélier View</option>
                  <option>Quarterly Analysis View</option>
                </select>
              </div>

              {/* Graphical bars */}
              <div className="h-[250px] w-full relative flex items-end justify-between px-4 pb-2">
                <div className="absolute inset-0 flex flex-col justify-between py-2 border-l border-primary/10 pointer-events-none">
                  <div className="w-full border-t border-primary/5" />
                  <div className="w-full border-t border-primary/5" />
                  <div className="w-full border-t border-primary/5" />
                  <div className="w-full border-t border-primary/5" />
                </div>
                <div className="z-10 group relative w-12 bg-primary-container/20 rounded-t-xl hover:bg-primary-container/40 transition-colors" style={{ height: "45%" }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100">$45,000</div>
                </div>
                <div className="z-10 group relative w-12 bg-primary-container/20 rounded-t-xl hover:bg-primary-container/40 transition-colors" style={{ height: "60%" }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100">$60,000</div>
                </div>
                <div className="z-10 group relative w-12 bg-primary-container/20 rounded-t-xl hover:bg-primary-container/40 transition-colors" style={{ height: "55%" }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100">$55,000</div>
                </div>
                <div className="z-10 group relative w-12 bg-primary-container/20 rounded-t-xl hover:bg-primary-container/40 transition-colors" style={{ height: "80%" }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100">$80,000</div>
                </div>
                <div className="z-10 group relative w-12 bg-primary-container rounded-t-xl transition-colors" style={{ height: "95%" }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary">$95,120</div>
                </div>
              </div>
              <div className="flex justify-between mt-6 px-4 text-[10px] font-bold uppercase text-on-surface-variant tracking-widest font-sans">
                <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span>
              </div>
            </div>

            {/* Spotlight Side box */}
            <div className="bg-[#31032c] text-on-primary rounded-xl overflow-hidden relative p-8 flex flex-col justify-end min-h-[450px]">
              <img
                alt="High-end orchid star sapphire gemstone"
                className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-overlay"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgYChKBe12r4qlu5f1BwwJo8Oi_KSdZnhnXCa6or78Xe6xhEG5vLm2wIiI8QKmrqeLpZkAUCBFuGssTzlKmO7XmHUmANHfKH9PHxiIMoyfGV8LswSQf-_RqZPbo2bX9pYJVUYTT7B3gqFpxAOcxIUj3Lml8GBzf4Kt8AoxKf7BJ65K2qL__kOJe9SLawFR8CzDVqI7WMDYtvJfuZiDyFfhmpif8WS6XajUgB2rlBiP6IonCjggwRyRhhsdY3n91W669Jtar9Vw6uM_"
              />
              <div className="relative z-10 space-y-4">
                <span className="bg-secondary text-[8px] px-3 py-1 rounded-full uppercase tracking-tighter inline-block font-sans font-bold">
                  Specimen of the month
                </span>
                <h2 className="text-3xl font-serif leading-tight">The Orchid Star Sapphire</h2>
                <p className="text-xs opacity-75 italic font-serif">Estimated valuation: $24,500.00</p>
                <Link
                  to="/shop"
                  className="w-full bg-[#fcf9f4] text-[#31032c] hover:bg-secondary hover:text-white py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all text-center block font-sans"
                >
                  View Full Specs
                </Link>
              </div>
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white rounded-xl border border-[#4A1942]/10 overflow-hidden">
            <div className="px-10 py-8 border-b border-[#4A1942]/10 flex justify-between items-center">
              <h2 className="text-xl font-serif text-[#31032c]">Recent Atélier Requests</h2>
              <button disabled className="text-[10px] font-bold uppercase tracking-widest text-[#8f4c30] select-none hover:underline">
                Secure Port 3000
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans">
                <thead>
                  <tr className="bg-[#f0ede9]/25 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant border-b border-primary/5">
                    <th className="px-10 py-4">Client</th>
                    <th className="px-10 py-4">Ref ID</th>
                    <th className="px-10 py-4">Creation</th>
                    <th className="px-10 py-4">Status</th>
                    <th className="px-10 py-4">Total</th>
                    <th className="px-10 py-4 text-right">View Detail</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {orders.length > 0 ? (
                    orders.map((o) => (
                      <tr key={o.id} className="border-b border-[#4A1942]/5 hover:bg-surface-container/10 transition-colors">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#31032c]/10 flex items-center justify-center text-[#31032c] font-bold font-sans">
                              {o.user?.name ? o.user.name.substring(0,2).toUpperCase() : "PA"}
                            </div>
                            <span className="font-bold text-primary">{o.user?.name || "Anonymous Patron"}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6 font-mono text-[10px] opacity-60">
                          {o.id.substring(0,8).toUpperCase()}
                        </td>
                        <td className="px-10 py-6 italic font-serif">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-10 py-6">
                          <StatusBadge status={o.status} />
                        </td>
                        <td className="px-10 py-6 font-bold text-primary">${o.total.toLocaleString()}</td>
                        <td className="px-10 py-6 text-right">
                          <Link to="/admin/orders" className="material-symbols-outlined text-[#31032c]/50 hover:text-secondary select-none">
                            visibility
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Default Eleanor fallback list (3 items)
                    <>
                      <tr className="border-b border-[#4A1942]/5 hover:bg-surface-container/10 transition-colors">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#8f4c30]/20 flex items-center justify-center text-secondary font-bold">EM</div>
                            <span className="font-bold text-[#31032c]">Eleanor Montgomery</span>
                          </div>
                        </td>
                        <td className="px-10 py-6 font-mono text-[10px] opacity-60">RG-4920-A</td>
                        <td className="px-10 py-6 italic font-serif">Jan 12, 2026</td>
                        <td className="px-10 py-6">
                          <StatusBadge status="COMPLETED" />
                        </td>
                        <td className="px-10 py-6 font-bold text-primary">$8,240</td>
                        <td className="px-10 py-6 text-right">
                          <Link to="/admin/orders" className="material-symbols-outlined text-[#31032c]/50 hover:text-secondary select-none">
                            visibility
                          </Link>
                        </td>
                      </tr>
                      <tr className="border-b border-[#4A1942]/5 hover:bg-surface-container/10 transition-colors">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#31032c]/10 flex items-center justify-center text-[#31032c] font-bold">SJ</div>
                            <span className="font-bold text-[#31032c]">Sebastian St. James</span>
                          </div>
                        </td>
                        <td className="px-10 py-6 font-mono text-[10px] opacity-60">RG-4921-X</td>
                        <td className="px-10 py-6 italic font-serif">Jan 14, 2026</td>
                        <td className="px-10 py-6">
                          <span className="bg-amber-100 text-amber-800 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter">In Atélier</span>
                        </td>
                        <td className="px-10 py-6 font-bold text-primary">$15,900</td>
                        <td className="px-10 py-6 text-right">
                          <Link to="/admin/orders" className="material-symbols-outlined text-[#31032c]/50 hover:text-secondary select-none">
                            visibility
                          </Link>
                        </td>
                      </tr>
                      <tr className="border-b border-[#4A1942]/5 hover:bg-surface-container/10 transition-colors">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#8f4c30]/20 flex items-center justify-center text-secondary font-bold font-sans">CW</div>
                            <span className="font-bold text-[#31032c]">Clara Whitmore</span>
                          </div>
                        </td>
                        <td className="px-10 py-6 font-mono text-[10px] opacity-60">RG-4922-P</td>
                        <td className="px-10 py-6 italic font-serif">Jan 15, 2026</td>
                        <td className="px-10 py-6">
                          <StatusBadge status="SHIPPED" />
                        </td>
                        <td className="px-10 py-6 font-bold text-primary">$3,450</td>
                        <td className="px-10 py-6 text-right">
                          <Link to="/admin/orders" className="material-symbols-outlined text-[#31032c]/50 hover:text-secondary select-none">
                            visibility
                          </Link>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 bg-surface-container-low text-center">
              <Link to="/admin/orders" className="text-[10px] font-bold uppercase tracking-widest text-[#31032c] hover:text-[#8f4c30] transition-all font-sans">
                View All Commissions
              </Link>
            </div>
          </div>

        </section>

        {/* Informative Footer */}
        <footer className="mt-auto px-12 py-8 bg-[#f0ede9]/50 border-t border-[#4A1942]/5 flex justify-between items-center text-[10px] tracking-widest uppercase font-sans text-on-surface-variant/40">
          <p>© 2026 RoshGems Digital Atélier. Indian Luxury Heritage.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-secondary">Privacy</Link>
            <Link to="/shipping-policy" className="hover:text-secondary">Shipping</Link>
            <Link to="/refund-policy" className="hover:text-secondary">Returns</Link>
          </div>
        </footer>

      </main>
    </div>
  );
};
