import React, { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useAuth } from '../context/AuthContext'
import { SearchModal } from './SearchModal'

export const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const cartItems = useCartStore((state) => state.items)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xs uppercase tracking-[0.3em] font-medium transition-all ${
      isActive ? 'text-[#D4AF37] opacity-100' : 'opacity-70 hover:opacity-100'
    }`

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-20 px-6 md:px-12 bg-[#050705]/80 backdrop-blur-xl flex items-center justify-between border-b border-[#D4AF37]/20 z-40">
        <div className="flex items-center gap-4 md:gap-8">
          <NavLink to="/shop" className={navLinkClass}>
            Shop Gems
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </div>

        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 text-2xl md:text-3.5xl font-headline tracking-[0.15em] text-[#D4AF37] hover:brightness-110 transition-all font-light"
          aria-label="RoshGems home"
        >
          ROSHGEMS
        </Link>

        <div className="flex items-center gap-4 md:gap-8">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open search"
            className="flex items-center gap-2 group cursor-pointer border-none bg-transparent text-[#F5F5F0]"
          >
            <span className="text-[10px] tracking-[0.1em] opacity-60 group-hover:opacity-100 hidden md:inline transition-opacity">
              SEARCH
            </span>
            <Search className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:text-[#D4AF37] transition-all" />
          </button>

          <Link
            to="/cart"
            aria-label={`Open cart with ${cartCount} item${cartCount === 1 ? '' : 's'}`}
            className="relative flex items-center gap-2 group cursor-pointer text-[#F5F5F0] hover:text-[#D4AF37] transition-colors"
          >
            <span className="text-[10px] tracking-[0.1em] opacity-60 group-hover:opacity-100 hidden md:inline transition-opacity">
              CART ({cartCount})
            </span>
            <ShoppingBag className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-all" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center scale-90">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4 border-l border-[#D4AF37]/20 pl-4 md:pl-8">
              {user.role === 'ADMIN' ? (
                <Link
                  to="/admin"
                  className="p-1 hover:text-[#D4AF37] transition-colors"
                  title="Admin Dashboard"
                  aria-label="Open admin dashboard"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#D4AF37]" />
                </Link>
              ) : (
                <Link
                  to="/account"
                  className="p-1 hover:text-[#D4AF37] transition-colors"
                  title="My Account"
                  aria-label="Open my account"
                >
                  <UserIcon className="w-4 h-4 opacity-75" />
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="p-1 hover:text-red-400 transition-colors bg-transparent border-none text-[#F5F5F0]"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4 opacity-60" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 group text-[#F5F5F0] hover:text-[#D4AF37] transition-colors"
              title="Login / Register"
              aria-label="Open login or register page"
            >
              <span className="text-[10px] tracking-[0.1em] opacity-60 group-hover:opacity-100 hidden md:inline transition-opacity">
                ACCOUNT
              </span>
              <UserIcon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-all" />
            </Link>
          )}
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

export default Navbar