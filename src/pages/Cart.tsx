import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ArrowLeft, Shield, Ticket } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { formatPrice } from '../lib/utils'

export const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem, subtotal, shipping, total } = useCartStore()
  const navigate = useNavigate()
  
  const [couponCode, setCouponCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0) // percentage
  const [couponStatus, setCouponStatus] = useState<'idle' | 'success' | 'invalid'>('idle')

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (couponCode.toUpperCase() === 'GEMS10' || couponCode.toUpperCase() === 'ROSHGEMS10') {
      setAppliedDiscount(10) // 10% off
      setCouponStatus('success')
    } else {
      setCouponStatus('invalid')
      setTimeout(() => setCouponStatus('idle'), 2500)
    }
  }

  const rawSubtotal = subtotal()
  const discountAmount = Math.round((rawSubtotal * appliedDiscount) / 100)
  const discountedSubtotal = rawSubtotal - discountAmount
  const shippingCost = shipping()
  const finalTotal = discountedSubtotal + shippingCost

  const handleQuantityIncrement = (id: string, currentQty: number) => {
    updateQuantity(id, currentQty + 1)
  }

  const handleQuantityDecrement = (id: string, currentQty: number) => {
    updateQuantity(id, currentQty - 1)
  }

  const handleClearItem = (id: string) => {
    removeItem(id)
  }

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center text-center">
        <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 border border-[#D4AF37]/20 rotate-45 rounded-xl"></div>
          <span className="text-[#D4AF37] font-headline text-5xl">✧</span>
        </div>
        <h2 className="text-3xl font-headline italic text-primary mb-4">Your Cart is Empty</h2>
        <p className="text-xs text-[#F5F5F0]/60 max-w-xs mx-auto mb-10 font-light leading-relaxed">
          Experience the brilliance of genuine cut Jaipur gems. Explore our catalogs to select an exquisite piece.
        </p>
        <Link
          to="/shop"
          className="bg-[#D4AF37] hover:bg-[#B8962F] text-black px-10 py-4 font-body uppercase tracking-[0.2em] text-xs font-bold transition-all rounded shadow-lg shadow-black/50"
        >
          Browse Showcase
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      {/* Header section with total count */}
      <header className="mb-12 font-headline">
        <h1 className="text-4.5xl md:text-6xl text-[#D4AF37] italic font-light">
          Your Cart <span className="text-[#F5F5F0]/50 not-italic text-2xl ml-4">({items.length} Unique {items.length === 1 ? 'Specimen' : 'Specimens'})</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Side: Items list */}
        <div className="lg:col-span-8 space-y-8">
          {items.map((item) => (
            <div key={item.id}>
              <div className="flex flex-col md:flex-row items-center gap-6 bg-[#121412]/50 p-6 border border-[#D4AF37]/10 rounded-lg group transition-all hover:border-[#D4AF37]/20">
                {/* Product thumbnail */}
                <div 
                  onClick={() => navigate(`/shop/${item.id}`)}
                  className="w-full md:w-36 aspect-square overflow-hidden bg-[#050705] border border-[#D4AF37]/15 rounded-lg relative cursor-pointer flex-shrink-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow w-full space-y-3">
                  <div className="flex justify-between items-start">
                    <div onClick={() => navigate(`/shop/${item.id}`)} className="cursor-pointer">
                      <h3 className="font-headline text-2xl text-[#F5F5F0] hover:text-[#D4AF37] transition-all italic leading-tight">{item.name}</h3>
                      <p className="text-[10px] text-[#F5F5F0]/40 uppercase tracking-widest mt-1">JAIPUR WORKBENCH ORIGIN • APPRAISED</p>
                    </div>
                    <button
                      onClick={() => handleClearItem(item.id)}
                      className="p-1 text-[#F5F5F0]/40 hover:text-red-400 transition-colors bg-transparent border-none"
                      title="Remove Gem"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex flex-wrap items-end justify-between gap-4 pt-2">
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 block">Vault Quantity</span>
                      <div className="flex items-center bg-[#050705] border border-[#D4AF37]/20 rounded-full px-3 py-1 space-x-4">
                        <button
                          onClick={() => handleQuantityDecrement(item.id, item.quantity)}
                          className="text-[#D4AF37] hover:text-[#F5F5F0] transition-colors font-bold text-sm bg-transparent border-none"
                        >
                          −
                        </button>
                        <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityIncrement(item.id, item.quantity)}
                          className="text-[#D4AF37] hover:text-[#F5F5F0] transition-colors font-bold text-sm bg-transparent border-none"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 block mb-0.5">Appraised Value</span>
                      <div className="text-xl font-headline text-[#D4AF37] font-semibold">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Segment Divider */}
              <div className="flex justify-center items-center py-4 opacity-30">
                <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Summary panel */}
        <aside className="lg:col-span-4">
          <div className="bg-[#121412] p-8 border border-[#D4AF37]/20 rounded-xl shadow-2xl relative">
            <h2 className="text-2xl font-headline text-[#D4AF37] italic mb-6 border-b border-[#D4AF37]/20 pb-3">Vault Summary</h2>
            
            <div className="space-y-5 text-sm font-light">
              <div className="flex justify-between items-center">
                <span className="opacity-50">Subtotal</span>
                <span className="font-semibold">{formatPrice(rawSubtotal)}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between items-center text-emerald-400">
                  <span className="opacity-75 uppercase text-[10px] tracking-widest font-semibold">Promotion GEMS10 (10%)</span>
                  <span>− {formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="opacity-50">Carriage Safe Cover</span>
                {shippingCost === 0 ? (
                  <span className="text-emerald-400 font-semibold uppercase text-[11px] tracking-widest">Complimentary</span>
                ) : (
                  <span>{formatPrice(shippingCost)}</span>
                )}
              </div>

              {/* Coupon inputs form */}
              <div className="pt-2">
                <label className="block text-[9px] uppercase tracking-widest opacity-50 font-bold block mb-2">Promotional Voucher</label>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="GEMS10"
                    disabled={appliedDiscount > 0}
                    className="w-full bg-transparent border-b border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 text-xs py-2 outline-none uppercase"
                  />
                  <button
                    type="submit"
                    disabled={appliedDiscount > 0}
                    className="text-[9px] uppercase tracking-widest font-bold text-[#D4AF37] border border-[#D4AF37]/35 rounded px-3 py-1 hover:bg-[#D4AF37]/10 disabled:opacity-40 transition-colors"
                  >
                    Apply
                  </button>
                </form>
                {couponStatus === 'success' && (
                  <span className="text-[10px] text-emerald-400 font-semibold mt-1.5 block">✧ 10% voucher code active</span>
                )}
                {couponStatus === 'invalid' && (
                  <span className="text-[10px] text-red-400 font-semibold mt-1.5 block">✧ Invalid code pattern</span>
                )}
                {appliedDiscount === 0 && (
                  <span className="text-[9px] opacity-30 mt-1 block">Try applying GEMS10 for 10% off</span>
                )}
              </div>

              {/* Total Divider */}
              <div className="h-[1px] bg-[#D4AF37]/20 my-6"></div>

              <div className="flex justify-between items-baseline">
                <span className="text-lg font-headline italic">Total Fee</span>
                <span className="text-3xl font-headline text-[#D4AF37] font-semibold">
                  {formatPrice(finalTotal)}
                </span>
              </div>

              <div className="pt-6 space-y-4">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-[#D4AF37] hover:bg-[#B8962F] text-black font-body py-4 rounded font-bold uppercase tracking-[0.2em] shadow-lg shadow-[#D4AF37]/10 transition-all text-xs"
                >
                  Proceed to Secure Carriage
                </button>
                <Link
                  to="/shop"
                  className="block w-full text-center py-2 text-[10px] font-body uppercase tracking-[0.2em] text-[#F5F5F0]/50 hover:text-[#D4AF37] transition-colors"
                >
                  ← Acquire More Gemstones
                </Link>
              </div>
            </div>

            {/* Appraisal Certification Guard */}
            <div className="mt-8 p-4 bg-[#050705] border border-[#D4AF37]/10 rounded-lg flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
              <p className="text-[10px] text-[#F5F5F0]/50 leading-relaxed font-light">
                Includes complementary RoshGems Jaipur certificate validations, secure vault packing, and fully insured logistical carriage.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
export default Cart
