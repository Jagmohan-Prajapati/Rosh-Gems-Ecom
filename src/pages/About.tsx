/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link } from "react-router-dom";

export const About: React.FC = () => {
  return (
    <div className="bg-surface text-on-surface antialiased">
      <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
        
        {/* Editorial Story Header */}
        <header className="mb-20 text-center max-w-3xl mx-auto space-y-6">
          <span className="font-label uppercase tracking-[0.3em] text-secondary text-xs font-bold block">
            Our Ancestral Heritage
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-[#31032c] tracking-tight leading-tight">
            Curating Earth's <br /><span className="italic">Soulful Light</span>
          </h1>
          <div className="h-px w-24 bg-secondary mx-auto mt-6" />
          <p className="text-on-surface-variant text-base md:text-lg italic font-serif leading-relaxed">
            "Since 1984, our mission has transcended the metrics of mere carat weight. We seek the unique internal soul, inclusions, and refractions of rare specimens."
          </p>
        </header>

        {/* Asymmetric Brand Story Section 1 */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-32">
          <div className="lg:col-span-6 rounded-none overflow-hidden shadow-2xl relative border border-[#31032c]/10 bg-white p-2.5">
            <img
              alt="Artisanal bench jeweler sketches and gemstone specimens under warm lighting"
              className="w-full h-auto object-cover transform hover:scale-[1.01] transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfFIXj8brOspMrfKSC-PYwFzlTumZrh5jI_mLsQMPTf0xu3WYwnP37FU9tjnFV2UAWKSrBpXOaA2z5q-d-d8hJs6koeVA2_4dnSjSRQ5rkOlujhELEGjQ1F6b0dU2kyXM-ZAqBNbnd1AGv7or7MRV1E0RXJytTs1GfvmCjI5pm55hCfMIe8TqqrJxyzoM_X9p8nB_g12rLwYFdhbaSrzcSpm9gfSnM9cvKnVwnoLYsgmi68Z-uPIayPXKSh-Uiz7cSP3OyHt751GAJ"
            />
          </div>
          <div className="lg:col-span-6 space-y-8">
            <h2 className="text-4xl text-[#31032c] font-serif italic">The Art of Sourcing</h2>
            <p className="text-[#4f434b] text-sm tracking-wide leading-loose font-light">
              RoshGems operates under a strict pledge of transparent mineral commerce. We build deep partnerships directly with sustainable mining guilds in Colombia, kashmir deposits, and Madagascar. By completely bypassing secondary trade layers, we ensure that maximum economic value goes straight to the local digging and cutting clusters.
            </p>
            <p className="text-[#4f434b] text-sm tracking-wide leading-loose font-light">
              Every emerald, sapphire, and tourmaline crystal is registered under GIA and appraisal certifications, carrying transparent source country histories registered to your final collection portfolio.
            </p>
          </div>
        </section>

        {/* Asymmetric Section 2: Craftsmanship */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-32">
          <div className="lg:col-span-6 lg:order-2 rounded-none overflow-hidden shadow-2xl relative border border-[#31032c]/10 bg-white p-2.5">
            <img
              alt="Sustainability-aware gemstone digging mines matching geological care"
              className="w-full h-auto object-cover transform hover:scale-[1.01] transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTei7CRren2b2wvwoQd303617x2RFFaNzboNnLxm8AVEBnUs_ODHs6tMy8hi7MBMAQu0OaOeJ9nrnbOwZjtw0R6Tpul8-hxdl1RFblU6QCyDXha52F2TJIHkQZBwnkMZWcoO9et84IuZFIRGk11Fhkm11B8tNqvLCBXQfK3fp7qf-N2yLAb1qLa98LrYiY58UhX6lMruuqrcHoSCCbuPRbiI4F_hUBtQZ8cru11MIkQHJlU46leRjxaWV3eAgfU2pPm_RbmOR-YPqs"
            />
          </div>
          <div className="lg:col-span-6 lg:order-1 space-y-8">
            <h2 className="text-4xl text-[#31032c] font-serif italic">Jaipur & London Ateliers</h2>
            <p className="text-[#4f434b] text-sm tracking-wide leading-loose font-light">
              Once sourced, raw specimens travel to our twin ateliers in Jaipur and London. It is here that master lapidaries study the crystallization patterns of each mineral. Instead of standard cookie-cutter commercial facets, our bench cutters use traditional hand-hammered and diamond-wheeled processes to preserve the specimen's unique internal glow.
            </p>
            <p className="text-[#4f434b] text-sm tracking-wide leading-loose font-light">
              From our signature rose-gold facet mount settings to hand-hammered 22k gold cuffs, each creation is a unique, unrepeatable heirloom honoring centuries of Indian and European haute-joaillerie heritage.
            </p>
            <div className="pt-4 font-sans text-xs tracking-widest uppercase">
              <Link to="/shop" className="px-8 py-4 bg-[#31032c] text-[#fcf9f4] hover:bg-[#8f4c30] transition-colors rounded-none font-bold tracking-widest block text-center md:inline-block">
                Examine Active Specimens
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};
