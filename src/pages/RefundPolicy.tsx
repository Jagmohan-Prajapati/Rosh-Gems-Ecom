/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export const RefundPolicy: React.FC = () => {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen">
      <main className="max-w-[900px] mx-auto px-6 py-16 md:py-24">
        
        {/* Header */}
        <header className="mb-16 border-b border-primary/10 pb-10">
          <span className="font-label uppercase tracking-[0.3em] text-secondary text-[10px] font-bold block mb-4">
            Atélier Standards
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#31032c] tracking-tight">
            Exchange & Appraisal Return Policy
          </h1>
          <p className="text-on-surface-variant font-serif italic text-sm mt-3">
            Bespoke Commissions and Raw Specimens
          </p>
        </header>

        {/* Content */}
        <div className="font-sans text-sm text-on-surface-variant leading-relaxed space-y-8 tracking-wide font-light">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif italic text-primary not-italic font-bold">1. Atélier Refund Protocol</h2>
            <p>
              At RoshGems, we take infinite pride in the geological specimens and hand-facet craftsmanship of our jewelry. If your curated selection does not live up to your planetary refraction expectations, you may declare a return within 14 days of delivery signature handover.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif italic text-primary not-italic font-bold">2. Restrictions on Bespoke Commissions</h2>
            <p>
              Please note that custom-facet rings, engraved anniversary messages, bespoke metal adjustments (such as sizing modifications), or items matching direct clientele configurations are categorized as non-refundable once the lapidary cutting bench begins cutting. We are happy to modify or adapt settings for a complimentary lifetime adjust period.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif italic text-primary not-italic font-bold">3. Condition and GIA Documentation</h2>
            <p>
              To qualify for return processing, specimens must remain absolutely pristine, showing zero signs of physical scratching, micro-impacts, or setting adjustments. Significantly, all returned items must arrive inside our intact packaging accompanied by their respective sealed GIA licenses. Returns lacking authentic identification tags will be returned to the client at their expense.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif italic text-primary not-italic font-bold">4. Initiating Returns</h2>
            <p>
              To declare a return, please contact our Mayfair concierge at concierge@roshgems.com or call our digital line. Once authorized, our staff provides fully paid return security packaging credentials and triggers fully insured courier collection at your home address coordinates. Refund payouts are processed within 7 business days following lab audit verification.
            </p>
          </section>
        </div>

      </main>
    </div>
  );
};
