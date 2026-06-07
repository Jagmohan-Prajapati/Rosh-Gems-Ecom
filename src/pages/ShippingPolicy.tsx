import React from 'react'

export const ShippingPolicy: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto min-h-screen">
      <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] block mb-4 font-semibold">SECURE CARRIAGE</span>
      <h1 className="text-4xl font-headline italic leading-tight text-[#D4AF37] mb-8">Shipping Policy</h1>
      <div className="w-20 h-[1px] bg-[#D4AF37]/40 mb-8"></div>
      
      <div className="space-y-6 text-xs md:text-sm leading-relaxed text-[#F5F5F0]/80 font-light">
        <p className="text-[#F5F5F0]">Last Updated: June 7, 2026</p>
        <p>Because our inventory consists of rare, high-value natural earth minerals, secure carriage transit forms a cornerstone of our commitment to RoshGems patrons.</p>
        
        <h3 className="text-sm uppercase tracking-widest text-[#D4AF37] font-semibold pt-4">1. Transit Costs & Complementary Carriage</h3>
        <p>As requested, we offer free insulated shipping across India on orders exceeding ₹4,000. All orders below ₹4,000 bear a flat shipping surcharge of ₹299.</p>

        <h3 className="text-sm uppercase tracking-widest text-[#D4AF37] font-semibold pt-4">2. Insured Vault Dispatch</h3>
        <p>Every collection piece leaves our Jaipur vault sealed inside thick, tamper-evident security containers. All luxury packages are shipped with complete transport insurance coverage directly to your designated address in India.</p>

        <h3 className="text-sm uppercase tracking-widest text-[#D4AF37] font-semibold pt-4">3. Estimated Timelines</h3>
        <p>Please allow 1–3 business days for our jewelry specialists to perform final structural quality checks and prepare standard lab appraisals. Secured courier transit across metropolitan areas ranges between 5–7 business days.</p>

        <p className="pt-6 font-headline italic text-sm text-[#D4AF37]">RoshGems Logistics & Carriage Division</p>
      </div>
    </div>
  )
}
export default ShippingPolicy
