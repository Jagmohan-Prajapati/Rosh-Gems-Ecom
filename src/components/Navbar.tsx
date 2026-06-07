/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { useCart } from "../lib/CartContext";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const location = useLocation();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // If we are on admin screens, do not render public navbar (admin has its own sidebar layout)
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const linkClass = (path: string) => {
    const base = "font-serif tracking-[0.05em] leading-tight text-xs uppercase transition-colors duration-300 ";
    if (location.pathname === path) {
      return base + "text-[#31032c] border-b-2 border-[#8f4c30] pb-1 font-bold";
    }
    return base + "text-[#4f434b] hover:text-[#31032c]";
  };

  return (
    <nav className="sticky top-0 w-full z-50 flex items-center justify-between px-6 md:px-12 bg-[#fcf9f4]/90 backdrop-blur-md shadow-[0_4px_30px_rgba(49,3,44,0.03)] border-b border-[#31032c]/10 transition-all duration-300 h-20">
      <div className="flex items-center gap-6 md:gap-12">
        <Link to="/" className="text-2xl md:text-3xl font-serif text-[#31032c] tracking-widest hover:opacity-90 font-medium">
          RoshGems
        </Link>
        <div className="hidden lg:flex gap-8 items-center">
          <Link to="/shop" className={linkClass("/shop")}>Collections</Link>
          <Link to="/about" className={linkClass("/about")}>Heritage & Sourcing</Link>
          <Link to="/contact" className={linkClass("/contact")}>Consultation</Link>
          <Link to="/privacy-policy" className={linkClass("/privacy-policy")}>Privacy</Link>
          {user?.role === "ADMIN" && (
            <Link to="/admin" className="font-serif tracking-[0.05em] leading-tight text-xs uppercase text-[#8f4c30] font-bold hover:text-[#31032c] transition-colors">
              Atélier Admin
            </Link>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-6 text-[#31032c]">
        {/* Navigation items for small viewports */}
        <div className="flex lg:hidden gap-4 text-xs font-serif italic text-on-surface-variant">
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <Link to="/about" className="hover:text-primary">About</Link>
        </div>

        <Link to="/cart" className="relative cursor-pointer hover:scale-105 transition-transform p-1 text-[#31032c]" aria-label="Shopping bag">
          <span className="material-symbols-outlined select-none text-2xl">shopping_bag</span>
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-[#8f4c30] text-[#fcf9f4] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-sans">
              {cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-[10px] hidden md:inline font-sans uppercase tracking-widest font-semibold text-[#31032c]">
              Mbr: {user.name.split(" ")[0]}
            </span>
            <button 
              onClick={logout} 
              className="text-[#4f434b] hover:text-[#8f4c30] text-[10px] font-sans font-bold uppercase tracking-widest cursor-pointer transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link to="/login" className="flex items-center hover:scale-105 transition-transform p-1 text-[#31032c]" aria-label="User account">
            <span className="material-symbols-outlined select-none text-2xl">person</span>
          </Link>
        )}
      </div>
    </nav>
  );
};
