import React from 'react'

export const RefundPolicy: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto min-h-screen">
      <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] block mb-4 font-semibold">SATISFACTION GUARANTEE</span>
      <h1 className="text-4xl font-headline italic leading-tight text-[#D4AF37] mb-8">Refund & Return Policy</h1>
      <div className="w-20 h-[1px] bg-[#D4AF37]/40 mb-8"></div>
      
      <div className="space-y-6 text-xs md:text-sm leading-relaxed text-[#F5F5F0]/80 font-light">
        <p className="text-[#F5F5F0]">Last Updated: June 7, 2026</p>
        <p>At RoshGems, we take immense pride in Jaipur's finest handpicked gemstone specimens. If your custom ornament or loose stone does not perfectly command your satisfaction, we offer structural avenues for exchange and return.</p>
        
        <h3 className="text-sm uppercase tracking-widest text-[#D4AF37] font-semibold pt-4">1. The 14-Day Vault Review</h3>
        <p>Clients may request a complete return or replacement within 14 days of tracked delivery. To maintain the secure pedigree of precious specimens, returned gems undergo a rigorous gemstone certification audit by our Jaipur lab curators.</p>

        <h3 className="text-sm uppercase tracking-widest text-[#D4AF37] font-semibold pt-4">2. Non-Refundable Structural Commissions</h3>
        <p>Please note that bespoke bridal designs, customized finger castings, or loose stones that have been custom engraved/fitted at the workbench after checking are not eligible for general return. However, our workshop handles adjustments free of fee.</p>

        <h3 className="text-sm uppercase tracking-widest text-[#D4AF37] font-semibold pt-4">3. Execution of Credits</h3>
        <p>Once our lab confirms that the returned gemstone matches the exact weight, refractive index, and GIA certificate of sending, a complete credit will be forwarded to your bank account or card via Razorpay within 7 business days.</p>

        <p className="pt-6 font-headline italic text-sm text-[#D4AF37]">RoshGems Jaipur satisfaction division</p>
      </div>
    </div>
  )
}
export default RefundPolicy
