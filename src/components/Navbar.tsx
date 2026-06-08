/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCartStore } from "../store/cartStore";
import { ShoppingBag, User } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const items = useCartStore((state) => state.items);
  const location = useLocation();
  const navigate = useNavigate();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const linkClass = (path: string) => {
    const base =
      "font-serif tracking-[0.05em] leading-tight text-xs uppercase transition-colors duration-300 ";

    if (location.pathname === path) {
      return base + "text-[#31032c] border-b-2 border-[#8f4c30] pb-1 font-bold";
    }

    return base + "text-[#4f434b] hover:text-[#31032c]";
  };

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 flex h-20 w-full items-center justify-between border-b border-[#31032c]/10 bg-[#fcf9f4]/90 px-6 shadow-[0_4px_30px_rgba(49,3,44,0.03)] backdrop-blur-md transition-all duration-300 md:px-12">
      <div className="flex items-center gap-6 md:gap-12">
        <Link
          to="/"
          className="text-2xl font-medium tracking-widest text-[#31032c] hover:opacity-90 md:text-3xl"
        >
          RoshGems
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <Link to="/shop" className={linkClass("/shop")}>
            Collections
          </Link>
          <Link to="/about" className={linkClass("/about")}>
            Heritage & Sourcing
          </Link>
          <Link to="/contact" className={linkClass("/contact")}>
            Consultation
          </Link>
          <Link to="/privacy-policy" className={linkClass("/privacy-policy")}>
            Privacy
          </Link>
          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              className="text-xs font-bold uppercase tracking-[0.05em] text-[#8f4c30] transition-colors hover:text-[#31032c]"
            >
              Atélier Admin
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 text-[#31032c]">
        <div className="flex gap-4 text-xs italic text-on-surface-variant lg:hidden">
          <Link to="/shop" className="hover:text-primary">
            Shop
          </Link>
          <Link to="/about" className="hover:text-primary">
            About
          </Link>
        </div>

        <Link
          to="/cart"
          className="relative cursor-pointer p-1 text-[#31032c] transition-transform hover:scale-105"
          aria-label="Shopping bag"
        >
          <ShoppingBag className="h-6 w-6" />
          {cartCount > 0 && (
            <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8f4c30] px-1 text-[9px] font-bold text-[#fcf9f4]">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>

        {isLoading ? (
          <div className="h-8 w-16 animate-pulse rounded bg-[#31032c]/5" />
        ) : user ? (
          <div className="flex items-center gap-3">
            <Link
              to="/account"
              className="hidden text-[10px] font-sans font-semibold uppercase tracking-widest text-[#31032c] transition-colors hover:text-[#8f4c30] md:inline"
            >
              Mbr: {user.name.split(" ")[0]}
            </Link>

            <Link
              to="/account"
              className="flex items-center p-1 text-[#31032c] transition-transform hover:scale-105 md:hidden"
              aria-label="My account"
            >
              <User className="h-6 w-6" />
            </Link>

            <button
              onClick={handleLogout}
              className="cursor-pointer text-[10px] font-sans font-bold uppercase tracking-widest text-[#4f434b] transition-colors hover:text-[#8f4c30]"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
            className="flex items-center p-1 text-[#31032c] transition-transform hover:scale-105"
            aria-label="User account"
          >
            <span className="material-symbols-outlined select-none text-2xl">
              person
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;