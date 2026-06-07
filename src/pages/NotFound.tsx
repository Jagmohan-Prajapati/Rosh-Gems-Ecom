import React from 'react'
import { Link } from 'react-router-dom'
import { EyeOff } from 'lucide-react'

export const NotFound: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto min-h-screen flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-8 animate-pulse bg-[#121412]">
        <EyeOff className="w-8 h-8 opacity-70" />
      </div>
      <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] block mb-4 font-semibold">THE SPECTRUM DISAPPEARS</span>
      <h1 className="text-4xl md:text-6xl font-headline italic leading-tight text-on-surface mb-6">
        No Precious Facet Found
      </h1>
      <p className="text-sm opacity-50 font-light leading-relaxed max-w-sm mb-12">
        The coordinates or gemstone index you requested does not exist in our online display registry at this time.
      </p>
      
      <Link 
        to="/"
        className="px-10 py-4 bg-[#D4AF37] text-black text-xs uppercase tracking-[0.16em] font-bold hover:bg-[#B8962F] transition-all"
      >
        Return to the Vault
      </Link>
    </div>
  )
}
export default NotFound
