import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Check, Shield, MapPin, Mail, Sparkles, ChevronRight, Loader2, Award } from 'lucide-react'
import { formatPrice } from '../lib/utils'

interface OrderRecord {
  id: string
  total: number
  isPaid: boolean
  shippingAddress: any
  status: string
  createdAt: string
}

export const OrderConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<OrderRecord | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`)
        if (response.ok) {
          const data = await response.json()
          setOrder(data.order || null)
        }
      } catch (error) {
        console.error('Error fetching dynamic order details:', error)
      } finally {
        setLoading(false)
      }
    }
    if (id) {
       fetchOrderDetails()
    }
  }, [id])

  const address = order?.shippingAddress || {
    name: 'Eleanor Sterling Address',
    line1: '102 High Street, Suite 402',
    line2: 'Johari Bazaar',
    city: 'Jaipur',
    state: 'Rajasthan',
    zip: '302003',
    phone: '+91 98765 43210'
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-screen flex flex-col items-center justify-center">
      {/* Glow check element */}
      <div className="text-center mb-12 space-y-6">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-[#D4AF37]/15 rounded-full blur-2xl"></div>
          <div className="w-20 h-20 rounded-full border border-[#D4AF37]/50 flex items-center justify-center relative z-10 bg-[#121412]">
            <Check className="w-8 h-8 text-[#D4AF37] animate-pulse" />
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] block font-bold">TRANSACTION CONCLUDED SECURELY</span>
          <h1 className="text-4xl md:text-5xl font-headline font-light italic text-[#F5F5F0]">Order Placed Successfully!</h1>
          <p className="text-xs uppercase tracking-widest text-[#F5F5F0]/50 font-semibold mt-1">Carriage Index: #{id || 'RG-20412'}</p>
        </div>
      </div>

      {/* Modern Horizontal Dispatch Progress */}
      <div className="w-full max-w-xl mb-12 px-2 relative z-10">
        <div className="relative flex justify-between items-center">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#D4AF37]/20 -translate-y-1/2 z-0"></div>
          
          <div className="relative z-10 flex flex-col items-center space-y-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#D4AF37] ring-4 ring-[#050705]"></div>
            <span className="text-[8px] uppercase tracking-widest font-semibold text-[#D4AF37]">Secured Vault Dispatch</span>
          </div>

          <div className="relative z-10 flex flex-col items-center space-y-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]/30 ring-4 ring-[#050705]"></div>
            <span className="text-[8px] uppercase tracking-widest font-medium text-white/40">Transit Appraisal check</span>
          </div>

          <div className="relative z-10 flex flex-col items-center space-y-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]/30 ring-4 ring-[#050705]"></div>
            <span className="text-[8px] uppercase tracking-widest font-medium text-white/40">Secure carriage Carriage</span>
          </div>
        </div>
      </div>

      {/* Bento details cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-6">
        {/* Subtotal card cost details */}
        <div className="bg-[#121412] p-8 border border-[#D4AF37]/15 rounded-xl flex flex-col justify-between space-y-8">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] block font-bold mb-2">SUMMARY PANEL</span>
            <p className="text-xs opacity-50 font-light leading-relaxed">
              Your acquired mineral specimens have been logged into the global inventory ledger under GIA certified tracking indices. Hand-sealed luxury packaging holds lifetime authenticity certificates.
            </p>
          </div>
          
          {loading ? (
            <div className="py-2 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-[#D4AF37] animate-spin" />
            </div>
          ) : (
            <div className="flex justify-between items-end border-t border-[#D4AF37]/10 pt-4">
              <span className="text-[10px] uppercase tracking-widest opacity-40">Settled Carriage Fee</span>
              <span className="text-2xl font-headline text-[#D4AF37] font-semibold">{formatPrice(order?.total || 45000)}</span>
            </div>
          )}
        </div>

        {/* Shipping details */}
        <div className="bg-[#121412] p-8 border border-[#D4AF37]/15 rounded-xl space-y-6">
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <MapPin className="w-4 h-4" />
            <h4 className="text-[9px] uppercase tracking-widest font-bold">Secure Delivery Destination</h4>
          </div>
          <div className="space-y-1 text-xs">
            <p className="font-semibold text-sm text-[#F5F5F0]">{address.name}</p>
            <p className="opacity-60 leading-relaxed font-light mt-1">
              {address.line1}, {address.line2 && `${address.line2}, `}{address.city}, {address.state} — {address.zip}
            </p>
            <p className="opacity-50 mt-1 font-mono">Tel: {address.phone}</p>
          </div>
        </div>
      </div>

      {/* Extra assurance guidelines and concierge links */}
      <div className="mt-12 text-center space-y-8 max-w-sm">
        <div className="flex justify-center items-center gap-2 bg-[#D4AF37]/5 px-4 py-2 border border-[#D4AF37]/10 rounded-full">
          <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[9px] uppercase tracking-widest text-[#D4AF37]">Refractive lab appraisal will transmit via email</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link
            to="/shop"
            className="flex-1 py-4 bg-[#D4AF37] hover:bg-[#B8962F] text-black font-body text-xs uppercase tracking-[0.2em] font-bold rounded shadow-lg shadow-[#D4AF37]/10 transition-all text-center"
          >
            Continue Sourcing
          </Link>
          <Link
            to="/account"
            className="flex-1 py-4 bg-[#121412] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-[#F5F5F0] font-body text-xs uppercase tracking-[0.2em] font-bold rounded transition-all text-center"
          >
            Review Purchases
          </Link>
        </div>
      </div>
    </div>
  )
}
export default OrderConfirmation
