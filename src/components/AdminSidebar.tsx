import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Diamond, Truck, Home, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export const AdminSidebar: React.FC = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 py-3 px-5 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-l-4 border-[#D4AF37]'
        : 'text-[#F5F5F0]/60 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5'
    }`

  return (
    <aside className="w-64 fixed left-0 top-0 bottom-0 bg-[#121412] border-r border-[#D4AF37]/20 flex flex-col py-8 z-30">
      <div className="px-8 mb-10">
        <h1 className="text-xl font-headline font-bold text-[#D4AF37] tracking-wider leading-none">
          ROSHGEMS
        </h1>
        <p className="text-[#F5F5F0]/40 text-[9px] uppercase tracking-[0.25em] mt-2 block">
          Vault Administration
        </p>
      </div>

      <nav className="flex-1 space-y-1.5 px-3" aria-label="Admin navigation">
        <NavLink to="/admin" end className={navItemClass}>
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/products" className={navItemClass}>
          <Diamond className="w-4 h-4" />
          <span>Products</span>
        </NavLink>

        <NavLink to="/admin/orders" className={navItemClass}>
          <Truck className="w-4 h-4" />
          <span>Orders</span>
        </NavLink>
      </nav>

      <div className="mt-auto px-4 space-y-2">
        <NavLink
          to="/"
          className="flex items-center gap-3 py-3 px-4 text-xs uppercase tracking-widest text-[#F5F5F0]/60 hover:text-[#D4AF37] transition-colors rounded-lg hover:bg-[#D4AF37]/5"
        >
          <Home className="w-4 h-4" />
          <span>Return to Store</span>
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 py-3 px-4 text-xs uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all text-left bg-transparent border-none rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Admin</span>
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar