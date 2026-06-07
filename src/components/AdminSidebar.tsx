import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Diamond, Truck, Home, LogOut, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export const AdminSidebar: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <aside className="w-64 fixed left-0 top-0 bottom-0 bg-[#121412] border-r border-[#D4AF37]/20 flex flex-col py-8 z-30">
      {/* Sidebar Header */}
      <div className="px-8 mb-10">
        <h1 className="text-xl font-headline font-bold text-[#D4AF37] tracking-wider leading-none">ROSHGEMS</h1>
        <p className="text-[#F5F5F0]/40 text-[9px] uppercase tracking-[0.25em] mt-2 block">Vault Administration</p>
      </div>

      {/* Navigation Options */}
      <nav className="flex-1 space-y-1.5 px-3">
        {/* Dashboard Link */}
        <Link
          to="/admin"
          className={`flex items-center gap-3 py-3 px-5 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all duration-200 ${
            location.pathname === '/admin'
              ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-l-4 border-[#D4AF37]'
              : 'text-[#F5F5F0]/60 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>

        {/* Products Link */}
        <Link
          to="/admin/products"
          className={`flex items-center gap-3 py-3 px-5 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all duration-200 ${
            location.pathname === '/admin/products'
              ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-l-4 border-[#D4AF37]'
              : 'text-[#F5F5F0]/60 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5'
          }`}
        >
          <Diamond className="w-4 h-4" />
          <span>Products</span>
        </Link>

        {/* Orders Link */}
        <Link
          to="/admin/orders"
          className={`flex items-center gap-3 py-3 px-5 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all duration-200 ${
            location.pathname === '/admin/orders'
              ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-l-4 border-[#D4AF37]'
              : 'text-[#F5F5F0]/60 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Orders</span>
        </Link>
      </nav>

      {/* Trailing Controls */}
      <div className="mt-auto px-4 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 py-3 px-4 text-xs uppercase tracking-widest text-[#F5F5F0]/60 hover:text-[#D4AF37] transition-colors rounded-lg hover:bg-[#D4AF37]/5"
        >
          <Home className="w-4 h-4" />
          <span>Return to Store</span>
        </Link>
        <button
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
