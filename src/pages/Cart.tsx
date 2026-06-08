/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Minus, Plus, ArrowRight, ShieldCheck, Truck, Leaf } from "lucide-react";
import { useCartStore } from "../store/cartStore";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const Cart: React.FC = () => {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoMsg, setPromoMsg] = useState("");

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const shipping = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= 4000 ? 0 : 299;
  }, [subtotal]);

  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();

    if (promoCode.trim().toUpperCase() === "HERITAGE") {
      setPromoApplied(true);
      setPromoMsg(
        "Promo 'HERITAGE' applied successfully: Complimentary velvet case customization included."
      );
    } else {
      setPromoApplied(false);
      setPromoMsg("Code invalid or expired.");
    }
  };

  const handleCheckoutRedirect = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased">
      <main className="mx-auto max-w-[1440px] px-6 py-16 md:px-12">
        <header className="mb-12">
          <h1 className="text-4xl font-headline tracking-[0.05em] text-[#31032c] md:text-5xl">
            Shopping Bag {itemCount > 0 ? `(${itemCount} gems)` : "is empty"}
          </h1>
          <div className="mt-6 h-px w-24 bg-[#8f4c30]" />
        </header>

        {itemCount === 0 ? (
          <div className="mx-auto max-w-xl space-y-6 rounded-none border border-[#31032c]/10 bg-[#f0ede9]/40 p-12 py-20 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-[#8f4c30]" />
            <h2 className="font-serif text-2xl italic text-[#31032c]">
              Your bag is empty
            </h2>
            <p className="mx-auto max-w-sm text-sm font-light leading-relaxed text-[#4f434b]">
              Explore our refined collections of Kashmir Sapphires, Colombian Emeralds and Certified Diamonds to find your legacy.
            </p>
            <Link
              to="/shop"
              className="inline-block cursor-pointer bg-[#31032c] px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest text-[#fcf9f4] transition-colors hover:bg-[#8f4c30]"
            >
              Examine Specimens
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
            <section className="space-y-12 lg:col-span-8">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="group relative flex flex-col gap-8 border border-[#31032c]/10 bg-white p-6 shadow-sm transition-all duration-300 md:flex-row"
                >
                  <div className="h-64 w-full overflow-hidden border border-[#31032c]/10 bg-white p-1.5 md:w-64">
                    <img
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={item.image}
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between py-2">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <h3 className="mb-1 text-2xl font-headline text-[#31032c]">
                          {item.name}
                        </h3>
                        <p className="text-sm italic text-[#4f434b]/80">
                          {item.stoneType || item.category || "Gemstone"} Collection
                        </p>
                      </div>
                      <span className="text-xl font-headline text-[#31032c]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                      <div className="flex items-center border-b border-[#31032c]/10 pb-1 font-sans">
                        <span className="mr-4 text-[10px] font-bold uppercase tracking-widest text-[#4f434b]/60">
                          Quantity
                        </span>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-[#31032c] hover:text-[#8f4c30]"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="h-4 w-4" />
                          </button>

                          <span className="w-4 text-center font-body font-semibold text-[#31032c]">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-[#31032c] hover:text-[#8f4c30]"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-[#8f4c30] underline-offset-8 transition-all hover:underline"
                      >
                        Remove Item
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              <div className="mt-12 border-l-4 border-[#8f4c30] bg-[#f0ede9] p-8">
                <p className="text-lg font-headline italic text-[#31032c]">
                  "Your selections are being curated and individual certificate numbers matched in our private digital Atélier. Secure insured delivery is applied at checkout."
                </p>
              </div>
            </section>

            <aside className="sticky top-[100px] space-y-6 lg:col-span-4">
              <div className="border border-[#31032c]/10 bg-[#f0ede9] p-10 text-[#4f434b]">
                <h2 className="mb-8 text-2xl font-headline font-light text-[#31032c]">
                  Order Summary
                </h2>

                <div className="space-y-6 font-sans">
                  <div className="flex items-center justify-between text-sm">
                    <span className="tracking-wide">Subtotal</span>
                    <span className="font-semibold text-[#31032c]">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="tracking-wide">Estimated Shipping</span>
                    <span className="font-semibold text-[#31032c]">
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>

                  <div className="border-t border-[#31032c]/15 pt-8">
                    <div className="flex items-end justify-between">
                      <span className="text-lg font-headline font-light text-[#31032c]">
                        Total Est.
                      </span>
                      <span className="text-3xl font-headline font-bold text-[#31032c]">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckoutRedirect}
                    className="group mt-10 flex w-full cursor-pointer items-center justify-center gap-3 bg-[#31032c] px-8 py-5 text-xs font-bold uppercase tracking-widest text-[#fcf9f4] transition-all hover:bg-[#8f4c30]"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-widest text-[#4f434b]/60">
                    Secure Encrypted Checkout Protocol
                  </p>
                </div>

                <div className="mt-12 border-t border-[#31032c]/15 pt-8 font-sans">
                  <label className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-[#4f434b]/70">
                    Atélier Invitation Code
                  </label>

                  <form onSubmit={handleApplyPromo} className="flex gap-4">
                    <input
                      className="flex-1 border-b border-[#31032c]/20 bg-transparent py-2 text-sm text-[#31032c] outline-none placeholder:text-[#4f434b]/40 focus:border-[#8f4c30]"
                      placeholder="e.g. HERITAGE"
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-[#8f4c30] transition-colors hover:text-[#31032c]"
                    >
                      Apply
                    </button>
                  </form>

                  {promoMsg && (
                    <p
                      className={`mt-3 text-[10px] italic ${
                        promoApplied ? "text-[#8f4c30]" : "text-red-700"
                      }`}
                    >
                      {promoMsg}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 opacity-35">
                <ShieldCheck className="h-5 w-5" title="Protected transaction" />
                <Truck className="h-5 w-5" title="Worldwide insured delivery" />
                <Leaf className="h-5 w-5" title="Recycled premium materials" />
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;