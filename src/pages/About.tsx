import React from 'react'

export const About: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto min-h-screen">
      {/* Decorative Line Indicator */}
      <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] block mb-4 font-semibold">THE ROSHGEMS LINEAGE</span>
      
      {/* Editorial Title */}
      <h1 className="text-4xl md:text-6xl font-headline italic leading-tight mb-8">
        Crafting Legacies of <span className="text-[#D4AF37]">Light & Stone</span>
      </h1>
      
      <div className="w-20 h-[1px] bg-[#D4AF37]/50 mb-12"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm leading-relaxed text-[#F5F5F0]/80">
        <div className="space-y-6">
          <p className="text-lg font-headline italic text-[#F5F5F0] leading-relaxed">
            Founded in the historic heart of Jaipur, Rajasthan in 1984, RoshGems has spent over four decades curating precious minerals of incomparable rarity and clarity.
          </p>
          <p>
            Jaipur is renowned globally as the epicenter of gemstone cutting and craftsmanship. Within this energetic environment, our founding elders established a small private atelier dedicated exclusively to natural, unheated, GIA certified emeralds, sapphires, and rubies.
          </p>
          <p>
            Unlike mass-production jewel houses, we treat each raw mineral crystal as an intricate narrative written by the earth over millions of years. Our master lapidaries study the crystallization axis of every specimen for weeks before a single touch of the wheel, ensuring the stone's internal soul shines unmuted.
          </p>
        </div>
        <div className="space-y-6">
          <div className="aspect-[4/5] bg-[#121412] border border-[#D4AF37]/20 flex items-center justify-center overflow-hidden h-72 relative rounded-lg">
            <img 
              src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=600" 
              alt="Artisanal gemstone grading" 
              className="w-full h-full object-cover opacity-65"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050705] via-transparent to-transparent"></div>
            <span className="absolute bottom-4 left-4 text-[9px] uppercase tracking-widest text-[#D4AF37] bg-[#050705]/90 px-3 py-1.5 border border-[#D4AF37]/20">JAIPUR ATELIER 1984</span>
          </div>
          <p className="">
            Today, RoshGems has evolved into a premier bespoke concierge, bringing Jaipur's ancient gemstone cutting heritage directly to the modern client. Our promise remains immutable: handpicked mineral authenticity, fully transparent certification, and bespoke master craftsmanship.
          </p>
          <p className="text-[#D4AF37] font-headline text-lg italic">
            "We do not create beauty. We carve the windows that allow its light to run free."
          </p>
        </div>
      </div>

      {/* Rarity & Standard Grid */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-[#D4AF37]/10">
        <div className="space-y-2">
          <h3 className="text-[#D4AF37] font-headline text-2xl italic">100% Genuine Certified</h3>
          <p className="opacity-60 text-xs">Every gem leaving the Jaipur vault is accompanied by authentic laboratory certifications (GIA, IGI, or equal standards) outlining its flawless genealogy.</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-[#D4AF37] font-headline text-2xl italic">Bespoke Setting</h3>
          <p className="opacity-60 text-xs">Through our personal concierge services, your selected gemstones can be set in custom-casted 18k white gold, yellow gold, or platinum mounts.</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-[#D4AF37] font-headline text-2xl italic">Insured Logistics</h3>
          <p className="opacity-60 text-xs">All purchases are packed with premium security seals and shipped across the Indian subcontinent using secure, fully insured luxury couriers.</p>
        </div>
      </div>
    </div>
  )
}
export default About
