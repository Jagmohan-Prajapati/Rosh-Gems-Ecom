/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";

export const Contact: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubscribed(true);
      setName("");
      setEmail("");
      setMessage("");
    }
  };

  return (
    <div className="bg-surface text-on-surface antialiased">
      <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
        
        {/* Contact Page Header */}
        <header className="mb-20 text-center max-w-3xl mx-auto space-y-6">
          <span className="font-label uppercase tracking-[0.3em] text-secondary text-xs font-bold block">
            Bespoke Commissions
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-[#31032c] tracking-tight leading-tight">
            Consult the Atélier
          </h1>
          <div className="h-px w-24 bg-secondary mx-auto mt-6" />
          <p className="text-on-surface-variant text-base md:text-lg italic font-serif leading-relaxed">
            "Whether seeking a GIA investment appraisal, selecting a raw specimen, or commissioning a bespoke engagement ring, our chief curators are available for private consultations."
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-stretch">
          
          {/* Left Column: Coordinates */}
          <div className="lg:col-span-5 bg-[#f0ede9] p-10 md:p-12 rounded-none border border-[#31032c]/10 flex flex-col justify-between space-y-12">
            <div>
              <h2 className="text-3xl font-serif text-[#31032c] mb-8 font-light">Atélier Coordinates</h2>
              <div className="space-y-8 font-sans text-sm text-[#4f434b] leading-relaxed">
                <div>
                  <p className="font-bold text-[#8f4c30] uppercase tracking-widest text-[10px] mb-2">London Showroom</p>
                  <p>72 Heritage Lane, Mayfair</p>
                  <p>London, W1S 2YG</p>
                  <p className="text-[#31032c] font-semibold mt-2">london@roshgems.com</p>
                </div>
                <div>
                  <p className="font-bold text-[#8f4c30] uppercase tracking-widest text-[10px] mb-2">New York Office</p>
                  <p>242 Central Park West</p>
                  <p>New York, NY 10024</p>
                  <p className="text-[#31032c] font-semibold mt-2">nyc@roshgems.com</p>
                </div>
                <div>
                  <p className="font-bold text-[#8f4c30] uppercase tracking-widest text-[10px] mb-2">Concierge Helpline</p>
                  <p>Live Curator Assistance: Monday - Friday (9AM - 6PM GMT)</p>
                  <p className="font-bold text-[#31032c] mt-1">+44 20 7946 0123</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#fcf9f4] rounded-none border border-[#31032c]/10 flex items-start gap-4 font-sans select-none">
              <span className="material-symbols-outlined text-[#8f4c30] select-none text-xl">verified_user</span>
              <p className="text-[10px] text-[#4f434b]/80 leading-relaxed uppercase tracking-wider font-bold">
                Consultations are entirely confidential. Virtual high-definition specimen viewings are available on demand.
              </p>
            </div>
          </div>

          {/* Right Column: Connection Form */}
          <div className="lg:col-span-7 bg-white p-10 md:p-12 rounded-none border border-[#31032c]/10 shadow-sm font-sans">
            <h2 className="text-3xl font-serif text-[#31032c] mb-2 font-light">Inquire Online</h2>
            <p className="text-[#4f434b]/80 text-sm italic mb-10 font-serif">A senior gemologist will respond within 24 hours.</p>

            {submitted ? (
              <div className="bg-[#f0ede9] border-l-4 border-[#8f4c30] p-8 text-[#31032c] rounded-none space-y-3 font-serif">
                <h3 className="text-2xl italic font-bold">Inquiry Dispatched Successfully</h3>
                <p className="text-sm font-sans tracking-wide leading-relaxed">
                  Thank you for consult inquiry. Our Curators are cross-referencing your request with the archive and will contact you directly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 font-sans">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#4f434b]/65 font-bold">Your Designation (Name)</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent border-t-0 border-x-0 border-b border-[#31032c]/20 py-3 focus:outline-none focus:border-secondary transition-colors text-sm font-body font-semibold text-[#31032c]"
                    placeholder="Evelyn Montgomery"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#4f434b]/65 font-bold">SMTP Email Coordinate</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-t-0 border-x-0 border-b border-[#31032c]/20 py-3 focus:outline-none focus:border-secondary transition-colors text-sm font-body font-semibold text-[#31032c]"
                    placeholder="evelyn@manor.com"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#4f434b]/65 font-bold">Proposed Consultation details</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-transparent border-t-0 border-x-0 border-b border-[#31032c]/20 py-3 focus:outline-none focus:border-secondary transition-colors text-sm font-serif italic text-[#31032c]"
                    placeholder="Describe the nature of the GIA tourmaline proposal, carat focus or design legacy..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#31032c] hover:bg-[#8f4c30] text-white py-5 rounded-none font-bold tracking-[0.2em] uppercase text-xs shadow-md transition-all cursor-pointer font-sans"
                >
                  Dispatch Atélier Inquiry
                </button>
              </form>
            )}
          </div>

        </div>

      </main>
    </div>
  );
};
