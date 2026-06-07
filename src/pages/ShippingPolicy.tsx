/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export const ShippingPolicy: React.FC = () => {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen">
      <main className="max-w-[900px] mx-auto px-6 py-16 md:py-24">
        
        {/* Header */}
        <header className="mb-16 border-b border-primary/10 pb-10">
          <span className="font-label uppercase tracking-[0.3em] text-secondary text-[10px] font-bold block mb-4">
            Security Transport
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#31032c] tracking-tight">
            Insured Transit & Dispatch Charter
          </h1>
          <p className="text-on-surface-variant font-serif italic text-sm mt-3">
            Atélier Standards and Tracking
          </p>
        </header>

        {/* Content */}
        <div className="font-sans text-sm text-on-surface-variant leading-relaxed space-y-8 tracking-wide font-light">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif italic text-primary not-italic font-bold">1. Atélier Dispatch Appraisal</h2>
            <p>
              Every high-jewelry commission and loose gemstone specimen is subjected to rigorous quality audits before departing our ateliers. This bench appraisal process takes 1–3 business days. Once certified, your specimen is encapsulated within our velvet-lined case accompanied by sealed certification registries (such as GIA files).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif italic text-primary not-italic font-bold">2. Complimentary Insured Delivery</h2>
            <p>
              We provide fully complimentary standard shipping for all worldwide orders. Shipping is entirely insured against physical loss, theft, or transit damage, up until the exact point of delivery signature handover. Standard transits take:
            </p>
            <ul className="list-disc pl-6 space-y-2 uppercase text-[10px] font-bold text-secondary tracking-widest font-sans">
              <li>DOMESTIC (INDIA): 2–4 BUSINESS DAYS</li>
              <li>UNITED KINGDOM & EUROPE: 3–5 BUSINESS DAYS</li>
              <li>AMERICAS & ASIA: 4–6 BUSINESS DAYS</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif italic text-primary not-italic font-bold">3. Priority Concierge Courier ({deliveryCost => "$45.00"})</h2>
            <p>
              For urgent keepsakes or priority proposals, our Priority Concierge courier operates next-day handovers in major centers. This option adds a security fee of $45.00 at checkout, which includes armored carrier configurations and real-time GPS coordinates.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif italic text-primary not-italic font-bold">4. Handover Signatures & Verification</h2>
            <p>
              Due to the high-value nature of planetary crystals, our carriers are strictly forbidden from leaving packages unattended, at doorsteps, or inside mailboxes. An adult recipient (18+) must provide physical signature confirmation and show photo ID matching the shipping coordinates.
            </p>
          </section>
        </div>

      </main>
    </div>
  );
};
