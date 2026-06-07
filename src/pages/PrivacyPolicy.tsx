/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen">
      <main className="max-w-[900px] mx-auto px-6 py-16 md:py-24">
        
        {/* Header */}
        <header className="mb-16 border-b border-primary/10 pb-10">
          <span className="font-label uppercase tracking-[0.3em] text-secondary text-[10px] font-bold block mb-4">
            Security Charter
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#31032c] tracking-tight">
            Privacy Charter & Consent
          </h1>
          <p className="text-on-surface-variant font-serif italic text-sm mt-3">
            Last Updated: June 1, 2026
          </p>
        </header>

        {/* Longform content layout in exact same typography, palette & editorial tone */}
        <div className="font-sans text-sm text-on-surface-variant leading-relaxed space-y-8 tracking-wide font-light">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif italic text-primary not-italic font-bold">1. Ethical Data Governance</h2>
            <p>
              RoshGems Digital Atélier is committed to honoring the confidentiality of our international clientele. We recognize that high-jewelry commissions, planetary gemstone acquisitions, and bespoke designs represent deeply personal investment milestones. Our custom charter ensures your digital footprint enjoys maximum standard encryption protocols.
            </p>
            <p>
              We completely forbid the selling, leasing, or secondary commercialization of any client profiling data, address coordinates, or gemstone registry tracking identifiers. Your credentials are used exclusively to verify transactions, manage deliveries, and secure GIA certificate licensing.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif italic text-primary not-italic font-bold">2. Payment & Bank Transaction Security</h2>
            <p>
              To process secure transactions, our payment routes are linked directly with certified card networks (VISA, Mastercard, Apple Pay) and integrated secure gateways like Razorpay. Card numbers, pin credentials, and detailed authentication identifiers are handled exclusively inside sandbox encrypted forms and do not register with intermediate database schemas.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif italic text-primary not-italic font-bold">3. Digital Portfolios & GIA Registries</h2>
            <p>
              When a patron acquires a loose specimen or bespoke creation, the specific item weights, origins, and GIA license numbers are recorded within a confidential digital portfolio linked to the user account. Access to this portfolio is restricted under cookie-based HttpOnly tokens, keeping your luxury investments hidden from unauthorized networks.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif italic text-primary not-italic font-bold">4. Atélier Newsletters & Choice</h2>
            <p>
              Patrons who opt-in to our concierge notification letters receive occasional invitations to private viewings. You may withdraw consent at any moment via the unsubscribe bottom trigger or by assisting our concierges directly.
            </p>
          </section>
        </div>

      </main>
    </div>
  );
};
