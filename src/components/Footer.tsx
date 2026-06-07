/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const location = useLocation();

  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#f0ede9] dark:bg-stone-900 w-full py-20 px-6 md:px-12 mt-20 border-t border-[#31032c]/5 transition-all">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-start">
        <div className="space-y-6">
          <span className="font-serif italic text-[#31032c] dark:text-fuchsia-300 text-2xl block">
            RoshGems Digital Atélier
          </span>
          <p className="text-[#4f434b] dark:text-stone-300 text-sm leading-relaxed font-serif italic max-w-xs">
            Curating the world's most evocative gemstones since 1984. Our legacy is written in the refraction of every unique facet.
          </p>
        </div>

        <div className="flex flex-col gap-4 font-sans text-xs tracking-widest uppercase">
          <span className="text-[#31032c] dark:text-fuchsia-400 font-bold mb-2">Heritage Atélier</span>
          <Link to="/about" className="text-[#4f434b] dark:text-stone-300 hover:text-[#8f4c30] transition-colors">Our Story</Link>
          <Link to="/shop" className="text-[#4f434b] dark:text-stone-300 hover:text-[#8f4c30] transition-colors">Collections</Link>
          <Link to="/about" className="text-[#4f434b] dark:text-stone-300 hover:text-[#8f4c30] transition-colors">Ethical Sourcing</Link>
          <Link to="/contact" className="text-[#4f434b] dark:text-stone-300 hover:text-[#8f4c30] transition-colors">Bespoke Design</Link>
        </div>

        <div className="flex flex-col gap-4 font-sans text-xs tracking-widest uppercase">
          <span className="text-[#31032c] dark:text-fuchsia-400 font-bold mb-2">Assistance</span>
          <Link to="/shipping-policy" className="text-[#4f434b] dark:text-stone-300 hover:text-[#8f4c30] transition-colors">Insured Shipping</Link>
          <Link to="/refund-policy" className="text-[#4f434b] dark:text-stone-300 hover:text-[#8f4c30] transition-colors">Returns & Refunds</Link>
          <Link to="/privacy-policy" className="text-[#4f434b] dark:text-stone-300 hover:text-[#8f4c30] transition-colors">Privacy Charter</Link>
          <Link to="/contact" className="text-[#4f434b] dark:text-stone-300 hover:text-[#8f4c30] transition-colors">Concierge Helpline</Link>
        </div>

        <div className="space-y-6">
          <span className="text-[#31032c] dark:text-fuchsia-400 font-semibold text-xs tracking-widest uppercase block mb-2">
            The newsletter
          </span>
          <p className="text-[#4f434b] dark:text-stone-300 text-xs leading-relaxed uppercase tracking-widest">
            Receive private invitations to seasonal curations and bespoke atélier arrivals.
          </p>
          {subscribed ? (
            <p className="text-secondary font-serif italic text-xs">
              Thank you, our concierge will be in touch shortly.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="relative border-b border-[#31032c] dark:border-white/20 py-2">
              <input
                className="w-full bg-transparent text-xs tracking-widest focus:outline-none focus:ring-0 border-0 p-0 text-primary-container placeholder:text-[#31032c]/40"
                placeholder="YOUR EMAIL"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="absolute right-0 bottom-2 text-[#31032c] hover:text-[#8f4c30] cursor-pointer" aria-label="Subscribe">
                <span className="material-symbols-outlined text-lg select-none">arrow_forward</span>
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto mt-16 pt-8 border-t border-[#31032c]/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[#4f434b] dark:text-stone-400 text-[10px] tracking-[0.3em] uppercase">
          © 2026 RoshGems Digital Atélier. Indian Luxury Heritage. All rights reserved.
        </p>
        <div className="flex gap-8 text-[#31032c] dark:text-stone-400">
          <span className="material-symbols-outlined text-lg cursor-pointer hover:text-[#8f4c30]">public</span>
          <span className="material-symbols-outlined text-lg cursor-pointer hover:text-[#8f4c30]">chat_bubble</span>
          <span className="material-symbols-outlined text-lg cursor-pointer hover:text-[#8f4c30]">photo_camera</span>
        </div>
      </div>
    </footer>
  );
};
