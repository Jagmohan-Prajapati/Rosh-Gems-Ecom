/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

export const AdminSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!location.pathname.startsWith("/admin")) {
    return null;
  }

  const linkActive = (partial: string) => {
    const isDashboard = partial === "/admin" && location.pathname === "/admin";
    const isMatch = partial !== "/admin" && location.pathname.startsWith(partial);

    return isDashboard || isMatch;
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 border-r border-[#4A1942]/10 bg-[#fcf9f4] flex flex-col pt-10 z-40">
      <div className="px-8">
        <Link to="/" className="text-xl font-serif italic text-[#4A1942] hover:opacity-80 block mb-2">
          Atélier Admin
        </Link>
        <p className="font-sans tracking-wide uppercase text-[10px] font-bold text-[#8f4c30] mb-8">
          Curating Excellence
        </p>

        <p className="font-sans tracking-wide uppercase text-[10px] font-bold text-on-surface-variant/60 mb-4">
          Main Menu
        </p>

        <nav className="flex flex-col gap-1">
          <Link
            to="/admin"
            className={`flex items-center gap-4 py-4 px-6 rounded-r-full transition-all ${
              linkActive("/admin")
                ? "bg-[#f0ede9] text-[#4A1942] border-l-4 border-[#8f4c30]"
                : "text-[#4f434b] hover:bg-[#f0ede9]/50 hover:translate-x-1"
            }`}
          >
            <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
              dashboard
            </span>
            <span className="font-sans tracking-wide uppercase text-[12px] font-medium">Dashboard</span>
          </Link>

          <Link
            to="/admin/products"
            className={`flex items-center gap-4 py-4 px-6 rounded-r-full transition-all ${
              linkActive("/admin/products")
                ? "bg-[#f0ede9] text-[#4A1942] border-l-4 border-[#8f4c30]"
                : "text-[#4f434b] hover:bg-[#f0ede9]/50 hover:translate-x-1"
            }`}
          >
            <span className="material-symbols-outlined select-none">diamond</span>
            <span className="font-sans tracking-wide uppercase text-[12px] font-medium">Inventory</span>
          </Link>

          <Link
            to="/admin/orders"
            className={`flex items-center gap-4 py-4 px-6 rounded-r-full transition-all ${
              linkActive("/admin/orders")
                ? "bg-[#f0ede9] text-[#4A1942] border-l-4 border-[#8f4c30]"
                : "text-[#4f434b] hover:bg-[#f0ede9]/50 hover:translate-x-1"
            }`}
          >
            <span className="material-symbols-outlined select-none">receipt_long</span>
            <span className="font-sans tracking-wide uppercase text-[12px] font-medium">Orders</span>
          </Link>

          <Link
            to="/shop"
            className="flex items-center gap-4 py-4 px-6 text-[#4f434b] hover:bg-[#f0ede9]/50 hover:translate-x-1 transition-transform"
          >
            <span className="material-symbols-outlined select-none">storefront</span>
            <span className="font-sans tracking-wide uppercase text-[12px] font-medium">Storefront</span>
          </Link>
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-primary/5 bg-[#f0ede9]/30">
        <div className="flex items-center gap-3 mb-4">
          <img
            alt="Julian Thorne Lead Curator"
            className="w-10 h-10 rounded-full object-cover grayscale border border-primary/10"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkA6zrq40JBDlemgwYtA75JYctnwu-k745O0Kryil8gRfKm7QiDn0P0T2Q6FPiVNzmc3_V5mjTo9hELbktpRCTgEAOcJCcgMFNf78EVmJ6Z9-ujSb_O8Za-EFcdaCKLfBO5C6e6wFZenLAcpoiHjeDt03V5VN2h5KQnkFRje-1J-apMD_UXK--iTlzQ71bDf9eTCUJlhjaDlBaYoqwCbrIS2Ew2244jGeE0lFCULG53z6edgKzdsWWw-CDtdPxqScUIfbOU5c5K79F"
          />
          <div>
            <p className="text-xs font-bold text-primary">{user?.name || "Marcus Thorne"}</p>
            <p className="text-[10px] text-on-surface-variant italic">Lead Curator</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full bg-[#31032c] text-white text-[10px] font-bold tracking-widest uppercase py-2 px-4 rounded-lg hover:bg-[#4a1942] transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};
