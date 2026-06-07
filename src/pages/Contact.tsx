import React, { useState } from 'react'
import { Mail, Phone, MapPin, Sparkles } from 'lucide-react'

export const Contact: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [gemInterest, setGemInterest] = useState('Bespoke Bridal Design')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated contact submittal
    if (name && email) {
      setFormSubmitted(true)
    }
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto min-h-screen">
      <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] block mb-4 font-semibold">THE CONCIERGE DESK</span>
      <h1 className="text-4xl md:text-6xl font-headline italic leading-tight mb-8">
        Seek the <span className="text-[#D4AF37]">Unique Specimen</span>
      </h1>
      <div className="w-20 h-[1px] bg-[#D4AF37]/50 mb-12"></div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
        {/* Contact info cards */}
        <div className="md:col-span-5 space-y-10">
          <p className="text-sm opacity-60 font-light leading-relaxed">
            Interested in acquiring a highly rare Kashmiri Emerald, Ceylon Sapphire, or commissioning a bespoke casting design? Reach out to our specialized curation coordinators.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">Our Atelier</h4>
                <p className="text-xs opacity-75 font-light leading-relaxed">
                  102 Johari Bazaar, Pink City<br />
                  Jaipur, Rajasthan, 302003<br />
                  India
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">Direct Calling</h4>
                <p className="text-xs opacity-75 font-light">
                  +91 141 2345 678<br />
                  <span className="opacity-50 text-[10px]">Hours: Mon – Sat, 10:00 – 19:00 IST</span>
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">Email Concierge</h4>
                <p className="text-xs opacity-75 font-light">
                  roshgems@gmail.com<br />
                  <span className="opacity-50 text-[10px]">Typical response within 12 business hours</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact form column */}
        <div className="md:col-span-7 bg-[#121412] border border-[#D4AF37]/10 p-8 md:p-10 rounded-xl relative overflow-hidden">
          {formSubmitted ? (
            <div className="py-16 text-center space-y-6">
              <div className="w-16 h-16 rounded-full border border-[#D4AF37] mx-auto flex items-center justify-center text-[#D4AF37]">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-headline text-3xl italic text-[#D4AF37]">Request Accepted</h3>
              <p className="text-xs opacity-60 max-w-sm mx-auto leading-relaxed">
                Thank you, {name}. A senior gemstone evaluator from our Jaipur desk has received your request. We will coordinate a virtual showing or detailed consultation promptly.
              </p>
              <button 
                onClick={() => setFormSubmitted(false)}
                className="mt-6 px-6 py-2 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] uppercase tracking-widest hover:bg-[#D4AF37]/10 transition-colors"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="font-headline text-2xl italic text-[#D4AF37] mb-6">Inquire with the Curation Desk</h3>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest opacity-50 font-semibold block">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Julian Abbott"
                  className="w-full bg-transparent border-b border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 py-2.5 text-xs tracking-wider outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest opacity-50 font-semibold block">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="curator@excellence.com"
                  className="w-full bg-transparent border-b border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 py-2.5 text-xs tracking-wider outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest opacity-50 font-semibold block">Area of Interest</label>
                <select 
                  value={gemInterest}
                  onChange={(e) => setGemInterest(e.target.value)}
                  className="w-full bg-transparent border-b border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 py-2.5 text-xs tracking-wider outline-none transition-colors cursor-pointer text-[#F5F5F0]"
                >
                  <option className="bg-[#121412]">Bespoke Bridal Design</option>
                  <option className="bg-[#121412]">Loose Precious Gemstones</option>
                  <option className="bg-[#121412]">Jaipur Valuation Assessment</option>
                  <option className="bg-[#121412]">General Inquiry</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest opacity-50 font-semibold block">Message / Specification Notes</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Outline the carat weight, cut preferences, or historical provenance requirements..."
                  rows={4}
                  className="w-full bg-[#050705]/50 border border-[#D4AF37]/10 rounded-lg p-3 text-xs outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-[0.2em] py-4 rounded-lg hover:bg-[#B8962F] transition-all"
              >
                Transmit Curation Brief
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
export default Contact
