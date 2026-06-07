import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Sparkles, RefreshCcw, Eye, Search, AlertTriangle, Loader2 } from 'lucide-react'
import { formatPrice } from '../lib/utils'

interface Order {
  id: string
  createdAt: string
  total: number
  userId: string
  isPaid: boolean
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  paymentMethod: string | null
  shippingAddress?: any
  user: {
    name: string
    email: string
  }
}

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [search, setSearch] = useState('')

  const fetchOrdersArchive = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrdersArchive()
  }, [])

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setStatusUpdatingId(orderId)
    setSuccessMsg('')
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setSuccessMsg(`Acquisition order #${orderId} dispatches state updated to ${newStatus}.`)
        fetchOrdersArchive()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setStatusUpdatingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/25'
      case 'PROCESSING':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/25'
      case 'SHIPPED':
        return 'bg-teal-500/10 text-teal-400 border border-teal-500/25'
      case 'DELIVERED':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
      case 'CANCELLED':
        return 'bg-red-500/10 text-red-500 border border-red-500/25'
      default:
        return 'bg-white/10 text-white/50'
    }
  }

  const filtered = orders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    (o.user?.name || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-12 text-xs">
      {/* Header board */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-4xl italic text-[#F5F5F0]">Customer Dispatches Ledger</h1>
          <p className="text-xs text-[#F5F5F0]/40 font-light mt-1">Audit shipping designations, payment authorizations, and dispatch carriage status flags.</p>
        </div>
      </section>

      {successMsg && (
        <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 text-center uppercase tracking-wider rounded-md">
          ✦ {successMsg}
        </div>
      )}

      {/* Search Bar */}
      <section className="bg-[#121412] p-4 border border-[#D4AF37]/10 flex items-center gap-4 rounded-lg">
        <Search className="w-5 h-5 text-[#D4AF37]/45" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH TRANSACTION LEDGER BY INDEX OR PATRON NAME..."
          className="w-full bg-transparent outline-none uppercase text-xs tracking-wider"
        />
      </section>

      {/* Main Table logs */}
      <section className="bg-[#121412] border border-[#D4AF37]/10 rounded-xl overflow-hidden font-light">
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#D4AF37] mb-4" />
            <span className="text-[10px] uppercase tracking-widest opacity-50 block">Querying Order Repository...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#050705] text-[#F5F5F0]/40 border-b border-[#D4AF37]/10 uppercase tracking-widest text-[9px] font-bold">
                  <th className="px-6 py-4">Carriage Index ID</th>
                  <th className="px-6 py-4">Patron Purchaser</th>
                  <th className="px-6 py-4">Authorized Amount</th>
                  <th className="px-6 py-4">Fund Status</th>
                  <th className="px-6 py-4">Designated Status</th>
                  <th className="px-6 py-4 text-right">Update Progression State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/10">
                {filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#D4AF37]/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono font-bold text-[#D4AF37] uppercase">#{ord.id}</p>
                      <p className="text-[10px] text-[#F5F5F0]/40 mt-1">Logged: {new Date(ord.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white text-sm">{ord.user?.name || 'Guest Companion'}</p>
                      <p className="text-[10px] opacity-40 mt-0.5">{ord.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#D4AF37] text-white text-sm">{formatPrice(ord.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-bold uppercase ${
                        ord.isPaid 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                          : 'bg-red-500/10 text-red-500 border border-red-500/25'
                      }`}>
                        {ord.isPaid ? 'PAID AUTHORIZED' : 'UNCOMMITTED FUNDS'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {statusUpdatingId === ord.id ? (
                        <div className="flex items-center gap-1.5 font-semibold text-white/50">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" /> Updating...
                        </div>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-bold uppercase tracking-widest ${getStatusColor(ord.status)}`}>
                          {ord.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className="bg-[#050705] text-[#D4AF37] text-xs font-bold font-body uppercase border border-[#D4AF37]/20 rounded px-2.5 py-1 focus:ring-0 focus:border-[#D4AF37]"
                      >
                        <option value="PENDING">Pending Setup</option>
                        <option value="PROCESSING">In Appraisal Workbench</option>
                        <option value="SHIPPED">Handed to Courier</option>
                        <option value="DELIVERED">Delivered to client</option>
                        <option value="CANCELLED">Revoked / Discarded</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-[#F5F5F0]/40">
                      Empty transactional matches found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
export default AdminOrders
