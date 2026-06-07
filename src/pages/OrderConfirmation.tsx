/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { Order } from "../types";

export const OrderConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          // Backend returns { order } or order directly
          const actualOrder = data.order !== undefined ? data.order : data;
          if (actualOrder && actualOrder.id) {
            setOrder(actualOrder);
          }
        }
      } catch (err) {
        console.error("Failed to load order confirmation details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    window.scrollTo(0, 0);
  }, [id]);

  const patronName = user?.name || "Patron";
  const displayId = id || "RG-10247";

  return (
    <div className="bg-surface text-on-surface min-h-screen selection:bg-[#ffdbce] selection:text-primary">
      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        
        {/* Success Identity Section */}
        <section className="text-center mb-16">
          <div className="inline-block mb-8 relative">
            <div className="absolute inset-0 bg-secondary/10 blur-3xl rounded-full scale-150" />
            <img
              alt="Rose cut crystal diamond illustration with refracting light facets"
              className="w-32 h-32 object-contain relative z-10 mx-auto"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9W2Kzrt31dWOEeC42aOSE_P2D7a4_HZS8tdkgbIGyAdQ2XLeTdF8FRhYjIOissmS7O7s10lbBQ2lv3ZokHVhURaEfUIxCx5r_1oM8UljtavVLsrSBlmA4G9ynd4bA0wkzslaki33NVv9n0Kn2talFWF3vM58q-tSIC9a32nq8wkuqLGfdh2QfDOdEzmELa0vFg6Maa-eWLpiT-kfUaDmd39JLQUsLlTaPH9Wz_lEnMaSr8EPLNed31xkvKpFYYLDRIQC3HJprywC3"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-primary-container mb-4 tracking-[0.02em]">
            Thank You, {patronName}!
          </h1>
          <p className="text-on-surface-variant font-body text-base md:text-lg mb-8 italic">
            Your curated selection is being appraised and prepared in our Atélier with master artisanal care.
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-surface-container rounded-full border border-outline-variant/30 font-sans">
            <span className="text-xs uppercase tracking-[0.15em] font-medium text-on-surface-variant">Order Number</span>
            <span className="text-primary-container font-bold tracking-widest font-mono text-sm">{displayId}</span>
          </div>
        </section>

        {/* Courier timeline steps indicator */}
        <section className="mb-20">
          <div className="relative flex justify-between items-center max-w-2xl mx-auto font-sans">
            <div className="absolute h-[1px] bg-[#4A1942]/10 top-1/2 left-0 right-0 -translate-y-1/2 z-0" />
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-[#fcf9f4] shadow-md">
                <span className="material-symbols-outlined text-sm select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary-container">Certified</span>
            </div>
            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#fcf9f4] border-2 border-primary-container flex items-center justify-center text-primary-container relative">
                <span className="material-symbols-outlined text-sm select-none animate-pulse">auto_awesome</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-medium text-on-surface-variant">Atélier Crafting</span>
            </div>
            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#fcf9f4] border border-[#4A1942]/10 flex items-center justify-center text-on-surface-variant/40">
                <span className="material-symbols-outlined text-sm select-none">local_shipping</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-medium text-[#4f434b]/60">Transit</span>
            </div>
            {/* Step 4 */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#fcf9f4] border border-[#4A1942]/10 flex items-center justify-center text-on-surface-variant/40">
                <span className="material-symbols-outlined text-sm select-none">home_pin</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-medium text-[#4f434b]/60">Arrival</span>
            </div>
          </div>
        </section>

        {/* Dynamic Items and Address block summary lists grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left: recap of items */}
          <div className="bg-surface-container rounded-xl p-8 shadow-[0_10px_30px_rgba(74,25,66,0.03)] text-on-surface">
            <h3 className="text-primary-container font-serif text-xl mb-8 border-b border-outline-variant/30 pb-4">
              Your Selection Commission
            </h3>
            {order ? (
              <div className="space-y-6">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-6">
                    <div className="w-20 h-24 bg-surface-container-lowest rounded-lg overflow-hidden shrink-0 border border-primary/5">
                      <img
                        alt={item.product?.name || "Gemstone specimen"}
                        className="w-full h-full object-cover"
                        src={item.product?.images?.[0] || "https://lh3.googleusercontent.com/aida-public/AB6AXuALkyDWP_ljUEki8mGT-fi9EBe9fOIhVmwWzRfHDEochnaR5jtcjIk4aLKJuKy0m-X_cXDpFm5G06OholKv-IxPWpNPTYdj-KhiAcqI8rzShIdI4nZQJG4wbxHRnzizpAQO0-dsY71iRSs-Fv-V0s_OMeh8be3l-8A-dvyQ4MLadYHyoGEIwfEA3DSHq6MXHoU8Pi5FHXrzTWy_T1CzfoN3vEtio1HoyZuxfdiwooozlayOGuoulc1kQ7nS1NXXpG7KXLxttVPXbtk4"}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-serif text-[#4A1942] text-lg font-semibold">{item.product?.name || "RoshGems Specimen"}</p>
                      <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1 font-sans">
                        Quantity: {item.quantity} &bull; Pricelocked
                      </p>
                      <p className="text-secondary font-medium mt-3 font-sans">${(item.price * item.quantity).toLocaleString()}.00</p>
                    </div>
                  </div>
                ))}
                
                <div className="mt-8 pt-6 border-t border-outline-variant/30 space-y-3 font-sans">
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>${order.total.toLocaleString()}.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>Atélier Courier</span>
                    <span className="italic text-primary font-bold">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-lg font-serif text-primary-container pt-2 font-bold border-t border-primary/5">
                    <span>Total Secured</span>
                    <span>${order.total.toLocaleString()}.00</span>
                  </div>
                </div>
              </div>
            ) : (
              // Default Alexandra fallback template
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-surface-container-lowest rounded-lg overflow-hidden shrink-0">
                    <img
                      alt="Aurelia Rose Ring"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuALkyDWP_ljUEki8mGT-fi9EBe9fOIhVmwWzRfHDEochnaR5jtcjIk4aLKJuKy0m-X_cXDpFm5G06OholKv-IxPWpNPTYdj-KhiAcqI8rzShIdI4nZQJG4wbxHRnzizpAQO0-dsY71iRSs-Fv-V0s_OMeh8be3l-8A-dvyQ4MLadYHyoGEIwfEA3DSHq6MXHoU8Pi5FHXrzTWy_T1CzfoN3vEtio1HoyZuxfdiwooozlayOGuoulc1kQ7nS1NXXpG7KXLxttVPXbtk4"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-serif text-[#4A1942] text-lg font-bold">Aurelia Rose Ring</p>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1 font-sans">18k Rose Gold &bull; Size 6</p>
                    <p className="text-secondary font-medium mt-3 font-sans">$2,450.00</p>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-outline-variant/30 space-y-3 font-sans">
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>$2,450.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>Bespoke Shipping</span>
                    <span className="italic text-primary font-bold">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-lg font-serif text-primary-container pt-2 font-bold border-t border-primary/5">
                    <span>Total</span>
                    <span>$2,450.00</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: courier metadata details */}
          <div className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
            <div className="mb-10 text-on-surface-variant">
              <h3 className="text-primary-container font-serif text-xl mb-6">Delivery Coordinate Address</h3>
              {order ? (
                <p className="text-sm font-light leading-relaxed whitespace-pre-line font-sans">
                  {order.shippingAddress}
                </p>
              ) : (
                <div className="text-sm font-light leading-relaxed space-y-1 font-sans">
                  <p className="font-bold text-on-surface font-sans">Alexandra Thorne</p>
                  <p>742 Heritage Avenue</p>
                  <p>Apartment 4B</p>
                  <p>San Francisco, CA 94103</p>
                  <p>United States</p>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-primary-container font-serif text-xl mb-6 font-bold">Payment Method</h3>
              <div className="flex items-center gap-4 font-sans">
                <div className="w-12 h-8 bg-surface-container-lowest border border-outline-variant/20 rounded flex items-center justify-center">
                  <span className="text-[8px] font-bold tracking-tighter italic">GATEWAY</span>
                </div>
                <span className="text-on-surface-variant font-light text-xs uppercase tracking-widest font-sans">Verified Secured Payment</span>
              </div>
            </div>
          </div>

        </div>

        {/* Action Triggers */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 font-sans">
          <Link
            to="/shop"
            className="px-10 py-4 bg-primary-container text-white rounded-xl font-body font-medium tracking-wide shadow-xl shadow-primary-container/20 hover:scale-[1.02] transition-all w-full sm:w-auto text-center"
          >
            Explore More Treasures
          </Link>
          <Link
            to="/"
            className="px-10 py-4 text-primary-container font-body font-medium tracking-wide hover:underline underline-offset-8 transition-all w-full sm:w-auto text-center font-bold"
          >
            Back to Home
          </Link>
        </div>

      </main>
    </div>
  );
};
