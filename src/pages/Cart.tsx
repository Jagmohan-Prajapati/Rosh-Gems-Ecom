/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../lib/CartContext";

export const Cart: React.FC = () => {
  const { items, subtotal, tax, total, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoMsg, setPromoMsg] = useState("");

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "HERITAGE") {
      setPromoApplied(true);
      setPromoMsg("Promo 'HERITAGE' applied successfully: Complimentary velvet case customization included.");
    } else {
      setPromoMsg("Code invalid or expired.");
    }
  };

  const handleCheckoutRedirect = () => {
    navigate("/checkout");
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen">
      <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
        
        {/* Page Title */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-headline tracking-[0.05em] text-[#31032c]">
            Shopping Bag {itemCount > 0 ? `(${itemCount} gems)` : "is empty"}
          </h1>
          <div className="h-px w-24 bg-[#8f4c30] mt-6" />
        </header>

        {itemCount === 0 ? (
          <div className="text-center py-20 bg-[#f0ede9]/40 border border-[#31032c]/10 rounded-none p-12 max-w-xl mx-auto space-y-6">
            <span className="material-symbols-outlined text-5xl text-[#8f4c30] select-none">shopping_bag</span>
            <h2 className="font-serif italic text-2xl text-[#31032c]">Your bag is empty</h2>
            <p className="text-[#4f434b] font-light text-sm max-w-sm mx-auto leading-relaxed">
              Explore our refined collections of Kashmir Sapphires, Colombian Emeralds and Certified Diamonds to find your legacy.
            </p>
            <Link
              to="/shop"
              className="bg-[#31032c] text-[#fcf9f4] py-4 px-8 rounded-none font-sans text-xs uppercase tracking-widest font-bold hover:bg-[#8f4c30] transition-colors inline-block cursor-pointer"
            >
              Examine Specimens
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left side: bag items */}
            <section className="lg:col-span-8 space-y-12">
              {items.map((item) => (
                <article
                  key={`${item.productId}-${item.metal}`}
                  className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-none group transition-all duration-300 relative border border-[#31032c]/10 shadow-sm"
                >
                  <div className="w-full md:w-64 h-64 overflow-hidden rounded-none bg-white border border-[#31032c]/10 p-1.5">
                    <img
                      alt={item.product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                      src={item.product.images[0]}
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-headline text-[#31032c] mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-sm font-body text-[#4f434b]/80 italic">
                          {item.metal} Finishes &bull; {item.product.stoneColor}
                        </p>
                      </div>
                      <span className="text-xl font-headline text-[#31032c]">
                        ${(item.product.price * item.quantity).toLocaleString()}.00
                      </span>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                      {/* Quantity Toggles */}
                      <div className="flex items-center border-b border-[#31032c]/10 pb-1 font-sans">
                        <span className="text-xs font-label uppercase tracking-widest text-[#4f434b]/60 mr-4 font-bold text-[10px]">
                          Quantity
                        </span>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.metal, -1)}
                            className="text-[#31032c] hover:text-[#8f4c30]"
                            aria-label="Decrease quantity"
                          >
                            <span className="material-symbols-outlined text-sm select-none">remove</span>
                          </button>
                          <span className="font-body font-semibold w-4 text-center text-[#31032c]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.metal, 1)}
                            className="text-[#31032c] hover:text-[#8f4c30]"
                            aria-label="Increase quantity"
                          >
                            <span className="material-symbols-outlined text-sm select-none">add</span>
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId, item.metal)}
                        className="text-[#8f4c30] text-[10px] font-label uppercase tracking-widest hover:underline underline-offset-8 transition-all font-bold cursor-pointer"
                      >
                        Remove Item
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {/* Insured atélier craftsman quote notice badge */}
              <div className="mt-12 p-8 border-l-4 border-[#8f4c30] bg-[#f0ede9] rounded-none">
                <p className="font-headline italic text-[#31032c] text-lg">
                  "Your selections are being curated and individual certificate numbers matched in our private digital Atélier. Insured, secure worldwide priority transit is complimentary."
                </p>
              </div>
            </section>

            {/* Right side: summarized costings card */}
            <aside className="lg:col-span-4 sticky top-[100px] space-y-6">
              <div className="bg-[#f0ede9] p-10 border border-[#31032c]/10 rounded-none text-[#4f434b]">
                <h2 className="text-2xl font-headline text-[#31032c] mb-8 font-light">Order Summary</h2>
                
                <div className="space-y-6 font-sans">
                  <div className="flex justify-between items-center text-sm font-body">
                    <span className="tracking-wide">Subtotal</span>
                    <span className="font-semibold text-[#31032c]">${subtotal.toLocaleString()}.00</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm font-body">
                    <span className="tracking-wide">Estimated Shipping</span>
                    <span className="uppercase tracking-widest text-[#8f4c30] font-bold text-xs">Complimentary</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm font-body">
                    <span className="tracking-wide">Insured tax & levy (20%)</span>
                    <span className="font-semibold text-[#31032c]">${tax.toLocaleString()}.00</span>
                  </div>

                  <div className="pt-8 border-t border-[#31032c]/15">
                    <div className="flex justify-between items-end">
                      <span className="text-lg font-headline text-[#31032c] font-light">Total Est.</span>
                      <span className="text-3xl font-headline text-[#31032c] font-bold">${total.toLocaleString()}.00</span>
                    </div>
                  </div>

                  {/* Proceed trigger option */}
                  <button
                    onClick={handleCheckoutRedirect}
                    className="w-full mt-10 py-5 px-8 bg-[#31032c] text-[#fcf9f4] rounded-none font-bold tracking-widest uppercase hover:bg-[#8f4c30] transition-all flex items-center justify-center gap-3 group cursor-pointer text-xs"
                  >
                    Proceed to Checkout
                    <span className="material-symbols-outlined text-sm select-none transition-transform group-hover:translate-x-1">
                      arrow_right_alt
                    </span>
                  </button>
                  
                  <p className="text-[10px] text-center text-[#4f434b]/60 font-label uppercase tracking-widest mt-6 font-bold">
                    Secure Encrypted Checkout Protocol
                  </p>
                </div>

                {/* Promo Code Input form */}
                <div className="mt-12 pt-8 border-t border-[#31032c]/15 font-sans">
                  <label className="block text-[10px] font-label uppercase tracking-widest text-[#4f434b]/70 mb-3 font-bold">
                    Atélier Invitation Code
                  </label>
                  <form onSubmit={handleApplyPromo} className="flex gap-4">
                    <input
                      className="bg-transparent border-b border-[#31032c]/20 focus:border-[#8f4c30] outline-none py-2 text-sm font-body flex-1 placeholder:text-[#4f434b]/40 text-[#31032c]"
                      placeholder="e.g. HERITAGE"
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button type="submit" className="text-[10px] font-label uppercase tracking-widest text-[#8f4c30] hover:text-[#31032c] transition-colors cursor-pointer font-bold">
                      Apply
                    </button>
                  </form>
                  {promoMsg && (
                    <p className={`mt-3 text-[10px] font-sans italic ${promoApplied ? "text-[#8f4c30]" : "text-red-700"}`}>
                      {promoMsg}
                    </p>
                  )}
                </div>
              </div>

              {/* Secure attributes footer alignment */}
              <div className="flex items-center justify-center gap-6 opacity-35">
                <span className="material-symbols-outlined select-none" title="Protected transaction">verified_user</span>
                <span className="material-symbols-outlined select-none" title="Worldwide insured delivery">local_shipping</span>
                <span className="material-symbols-outlined select-none" title="Recycled premium materials">potted_plant</span>
              </div>
            </aside>

          </div>
        )}

      </main>
    </div>
  );
};
