import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Sparkles } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050705] border-t border-[#D4AF37]/20 text-[#F5F5F0]">
      {/* Rich Footer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 md:px-12 py-16 w-full max-w-7xl mx-auto text-xs font-light tracking-wide">
        {/* Brand Column */}
        <div className="space-y-6">
          <Link to="/" className="text-2xl font-headline italic tracking-[0.15em] text-[#D4AF37] block">
            ROSHGEMS
          </Link>
          <p className="opacity-50 leading-relaxed font-light">
            Sourced from Jaipur's ancient jewel ateliers. Curating luxury certified gemstones and custom ornaments for collectors with exceptional taste.
          </p>
          <div className="flex gap-4 items-center opacity-60">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[10px] uppercase tracking-[0.2em]">100% Certified Originals</span>
          </div>
        </div>

        {/* Explore Links */}
        <div className="space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#D4AF37]">The Collections</h4>
          <ul className="space-y-3">
            <li>
              <Link to="/shop?category=Rings" className="opacity-60 hover:opacity-100 hover:text-[#D4AF37] transition-all">
                RARE RINGS
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Necklaces" className="opacity-60 hover:opacity-100 hover:text-[#D4AF37] transition-all">
                HERITAGE NECKLACES
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Raw Stones" className="opacity-60 hover:opacity-100 hover:text-[#D4AF37] transition-all">
                UNMUTED RAW STONES
              </Link>
            </li>
            <li>
              <Link to="/shop" className="opacity-60 hover:opacity-100 hover:text-[#D4AF37] transition-all underline underline-offset-4">
                EXPLORE CATALOGUE
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Policies (Required in routes) */}
        <div className="space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#D4AF37]">Policy Board</h4>
          <ul className="space-y-3">
            <li>
              <Link to="/privacy-policy" className="opacity-60 hover:opacity-100 hover:text-[#D4AF37] transition-all">
                PRIVACY DISCLOSURE
              </Link>
            </li>
            <li>
              <Link to="/shipping-policy" className="opacity-60 hover:opacity-100 hover:text-[#D4AF37] transition-all">
                SHIPPING & CARRIAGE
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="opacity-60 hover:opacity-100 hover:text-[#D4AF37] transition-all">
                RETURNS & SATISFACTION
              </Link>
            </li>
            <li>
              <Link to="/about" className="opacity-60 hover:opacity-100 hover:text-[#D4AF37] transition-all">
                OUR LINEAGE
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact/Address Column */}
        <div className="space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#D4AF37]">The Jaipur Atelier</h4>
          <div className="space-y-3 opacity-60">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-3.5 h-3.5 mt-0.5 text-[#D4AF37] flex-shrink-0" />
              <span>102 Johari Bazaar, Jaipur, RJ 302003</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
              <span>+91 141 2345 678</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
              <span className="break-all">roshgems@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Footer / Promo Bar from Design Template */}
      <div className="h-auto py-4 md:py-0 md:h-12 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between border-t border-[#D4AF37]/20 bg-[#080a08] text-[9px] uppercase tracking-[0.2em] font-medium gap-3 md:gap-0">
        <div className="flex items-center gap-2 md:gap-6 text-center md:text-left">
          <span className="text-[#D4AF37]">Complimentary Carriage</span>
          <span className="opacity-30 italic normal-case tracking-normal">Across India on orders over ₹4,000</span>
        </div>
        <div className="text-[9px] opacity-40">
          © 2026 ROSHGEMS. ALL RIGHTS RESERVED.
        </div>
        <div className="flex items-center gap-6 md:gap-12">
          <div className="flex items-center gap-2">
            <span className="opacity-40">CURRENCY:</span>
            <span className="text-[#D4AF37]">INR (₹)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="opacity-40">SUPPORT:</span>
            <a href="mailto:roshgems@gmail.com" className="hover:text-[#D4AF37] transition-colors cursor-pointer text-[#F5F5F0]">
              ROSHGEMS@GMAIL.COM
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
