/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { useCart } from "../lib/CartContext";
import { Address } from "../types";

export const Checkout: React.FC = () => {
  const { user, addresses, addAddress } = useAuth();
  const { items, subtotal, tax, total, clearCart } = useCart();
  const navigate = useNavigate();

  // Multi-step phase: 1 = Delivery Address, 2 = Payment choice / confirmation
  const [step, setStep] = useState(1);

  // Address selection state
  const [selectedAddrId, setSelectedAddrId] = useState("");
  const [addNewMode, setAddNewMode] = useState(false);

  // Form Fields for new Address
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [line1, setLine1] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("standard"); // standard | priority

  const [loading, setLoading] = useState(false);
  const [checkoutErr, setCheckoutErr] = useState("");

  useEffect(() => {
    // Default to default address if vorhanden
    if (addresses && addresses.length > 0) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddrId(def.id);
    } else {
      setAddNewMode(true);
    }
  }, [addresses]);

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!line1 || !zip || !city || !phone) {
      setCheckoutErr("Please fill all required address coordinates.");
      return;
    }
    setLoading(true);
    setCheckoutErr("");
    try {
      const created = await addAddress({
        label: "Home",
        name: `${first} ${last}`.trim() || user?.name || "Patron",
        phone,
        line1,
        city,
        state: "State",
        zip,
        country: "India",
        isDefault: addresses.length === 0,
      });
      setSelectedAddrId(created.id);
      setAddNewMode(false);
    } catch (err: any) {
      setCheckoutErr(err.message || "Could not register details.");
    } finally {
      setLoading(false);
    }
  };

  const calculateFinalTotal = () => {
    let price = total;
    if (deliveryMethod === "priority") {
      price += 45; // £45 or $45 Priority
    }
    return price;
  };

  const handleOrderSubmission = async () => {
    setLoading(true);
    setCheckoutErr("");

    // Find selected address text
    let shippingText = "72 Heritage Lane, Suite 4B, London";
    if (selectedAddrId) {
      const found = addresses.find((a) => a.id === selectedAddrId);
      if (found) {
        shippingText = `${found.name}, ${found.line1}, ${found.city}, ${found.zip}, ${found.country}`;
      }
    } else if (line1) {
      shippingText = `${first} ${last}, ${line1}, ${city}, ${zip}, India`;
    }

    try {
      // POST to `/api/orders/create`
      const listItems = items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.product.price,
      }));

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: listItems,
          shippingAddress: shippingText,
          total: calculateFinalTotal(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Order generation failed.");
      }

      const orderData = await res.json();

      // If server returned razorpayOrderId and SDK wants us to pay
      if (orderData.razorpayOrderId && (window as any).Razorpay) {
        // Standard Checkout Integration
        const options = {
          key: orderData.razorpayKeyId,
          amount: Math.round(calculateFinalTotal() * 100),
          currency: "INR",
          name: "RoshGems Digital Atélier",
          description: "Artisanal Gemstones Order",
          order_id: orderData.razorpayOrderId,
          handler: async function (response: any) {
            // Verify payment
            const verifyRes = await fetch("/api/orders/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId: orderData.orderId,
              }),
            });

            if (verifyRes.ok) {
              clearCart();
              navigate(`/order-confirmation/${orderData.orderId}`);
            } else {
              setCheckoutErr("Payment verification failed on the server.");
            }
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
          },
          theme: {
            color: "#31032c",
          },
        };
        const rzp = new ((window as any).Razorpay)(options);
        rzp.open();
      } else {
        // Razorpay skipped/not configured (sandbox preview fallback)
        // Simulate immediate order verification for direct preview
        clearCart();
        navigate(`/order-confirmation/${orderData.orderId || "RG-10247"}`);
      }
    } catch (err: any) {
      setCheckoutErr(err.message || "Failed to finalize commission order.");
    } finally {
      setLoading(false);
    }
  };

  const activeStepClass = (s: number) => {
    if (step === s) {
      return "w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-headline italic shadow-lg";
    }
    if (step > s) {
      return "w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-headline italic shadow-md";
    }
    return "w-10 h-10 rounded-full border border-outline text-on-surface-variant flex items-center justify-center font-headline italic";
  };

  const activeLabelClass = (s: number) => {
    if (step === s) {
      return "text-xs font-label tracking-widest uppercase text-primary-container font-bold";
    }
    return "text-xs font-label tracking-widest uppercase opacity-40";
  };

  return (
    <div className="bg-surface-bright text-on-surface font-body min-h-screen">
      
      {/* Suppressed header for focused checkout */}
      <header className="sticky top-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-6 bg-[#fcf9f4]/85 backdrop-blur-xl border-b border-[#4A1942]/10 transition-all duration-300">
        <Link to="/" className="text-3xl font-headline italic text-primary-container tracking-widest">
          RoshGems
        </Link>
        <div className="flex items-center gap-8 text-on-surface-variant font-label text-xs tracking-widest uppercase">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm select-none">lock</span> Secure Atélier
          </span>
          <Link to="/cart" className="hover:text-secondary transition-colors">Exit</Link>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        
        {/* Step Indicator Stepper */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center w-full max-w-3xl font-sans">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-4 flex-1 relative">
              <div className={activeStepClass(1)}>1</div>
              <span className={activeLabelClass(1)}>Delivery</span>
            </div>
            <div className="h-[1px] bg-outline-variant flex-1 mb-8" />
            {/* Step 2 */}
            <div className="flex flex-col items-center gap-4 flex-1 relative">
              <div className={activeStepClass(2)}>2</div>
              <span className={activeLabelClass(2)}>Confirmation</span>
            </div>
          </div>
        </div>

        {checkoutErr && (
          <div className="max-w-3xl mx-auto mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{checkoutErr}</span>
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="font-serif italic text-2xl mb-4">No selected specimens found</h3>
            <Link to="/shop" className="text-secondary font-bold uppercase tracking-widest text-xs border-b pb-1">
              Catalogue Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
            
            {/* Left Column Address Delivery Form */}
            <div className="lg:col-span-7 space-y-12">
              
              {step === 1 && (
                <section className="space-y-12">
                  <div>
                    <h1 className="text-4xl font-headline text-primary-container mb-2">Shipping Information</h1>
                    <p className="text-on-surface-variant italic mb-10">Where shall we send your curated treasures?</p>
                  </div>

                  {/* Registered Addresses */}
                  {user && addresses.length > 0 && !addNewMode && (
                    <div className="space-y-4 font-sans">
                      <p className="text-xs uppercase tracking-widest text-secondary font-bold mb-2">Select Registered Account Address:</p>
                      <div className="grid grid-cols-1 gap-4">
                        {addresses.map((a) => (
                          <label
                            key={a.id}
                            onClick={() => setSelectedAddrId(a.id)}
                            className={`p-6 rounded-xl bg-surface-container border transition-all cursor-pointer block relative ${
                              selectedAddrId === a.id ? "border-secondary ring-2 ring-primary-container/20" : "border-transparent hover:border-secondary/20"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-bold text-primary-container text-sm">{a.name}</p>
                                <p className="text-xs text-on-surface-variant mt-1">{a.line1}, {a.city}, {a.zip}, {a.country}</p>
                                <p className="text-[10px] uppercase text-[#8f4c30] tracking-widest font-bold mt-2">Ph: {a.phone}</p>
                              </div>
                              {a.isDefault && (
                                <span className="bg-[#8f4c30]/15 text-[#8f4c30] text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider font-sans">
                                  Default
                                </span>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                      <button
                        onClick={() => setAddNewMode(true)}
                        className="text-xs font-bold text-secondary uppercase tracking-widest hover:underline pt-2 inline-block font-sans select-none"
                      >
                        + Add Alternative Delivery Address
                      </button>
                    </div>
                  )}

                  {/* Add New Address Form */}
                  {addNewMode && (
                    <form onSubmit={handleAddNewAddress} className="space-y-10 font-sans">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-label uppercase tracking-[0.2em] text-outline">First Name</label>
                          <input
                            required
                            type="text"
                            value={first}
                            onChange={(e) => setFirst(e.target.value)}
                            className="bg-transparent border-t-0 border-x-0 border-b border-primary-container/20 py-2 focus:ring-0 transition-all font-body text-on-surface"
                            placeholder="Alexandra"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-label uppercase tracking-[0.2em] text-outline">Last Name</label>
                          <input
                            required
                            type="text"
                            value={last}
                            onChange={(e) => setLast(e.target.value)}
                            className="bg-transparent border-t-0 border-x-0 border-b border-primary-container/20 py-2 focus:ring-0 transition-all font-body text-on-surface"
                            placeholder="Thorne"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-label uppercase tracking-[0.2em] text-outline">Shipping Address</label>
                        <input
                          required
                          type="text"
                          value={line1}
                          onChange={(e) => setLine1(e.target.value)}
                          className="bg-transparent border-t-0 border-x-0 border-b border-primary-container/20 py-2 focus:ring-0 transition-all font-body text-on-surface"
                          placeholder="742 Heritage Avenue, Apartment 4B"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-label uppercase tracking-[0.2em] text-outline">Postal Pin Code</label>
                          <input
                            required
                            type="text"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            className="bg-transparent border-t-0 border-x-0 border-b border-primary-container/20 py-2 focus:ring-0 transition-all font-body text-on-surface"
                            placeholder="94103"
                          />
                        </div>
                        <div className="flex flex-col gap-2 sm:col-span-2">
                          <label className="text-[10px] font-label uppercase tracking-[0.2em] text-outline">City</label>
                          <input
                            required
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="bg-transparent border-t-0 border-x-0 border-b border-primary-container/20 py-2 focus:ring-0 transition-all font-body text-on-surface"
                            placeholder="San Francisco, CA"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-label uppercase tracking-[0.2em] text-outline">Contact Mobile Number</label>
                        <input
                          required
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="bg-transparent border-t-0 border-x-0 border-b border-primary-container/20 py-2 focus:ring-0 transition-all font-body text-on-surface"
                          placeholder="+1 415 555 0199"
                        />
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          type="submit"
                          className="px-8 py-3 bg-secondary text-white rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer"
                        >
                          Save Address Coordinates
                        </button>
                        {addresses.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setAddNewMode(false)}
                            className="px-8 py-3 border border-primary/20 rounded-lg text-xs font-bold uppercase tracking-widest text-[#4f434b] cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  )}

                  {/* Delivery Shipping Method */}
                  <div>
                    <h2 className="text-2xl font-headline text-primary-container mb-8">Delivery Method</h2>
                    <div className="grid grid-cols-1 gap-4 font-sans">
                      <label
                        onClick={() => setDeliveryMethod("standard")}
                        className={`group relative flex items-center justify-between p-6 rounded-xl bg-surface-container border cursor-pointer transition-all ${
                          deliveryMethod === "standard" ? "border-[#8f4c30]" : "border-transparent hover:border-[#8f4c30]/20"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-5 h-5 rounded-full border-2 border-outline flex items-center justify-center transition-colors">
                            {deliveryMethod === "standard" && <div className="w-2.5 h-2.5 rounded-full bg-secondary" />}
                          </div>
                          <div>
                            <p className="font-semibold text-primary-container text-sm">Atélier Standard Delivery</p>
                            <p className="text-xs text-on-surface-variant font-light mt-1">3-5 business days &bull; Handover signature required</p>
                          </div>
                        </div>
                        <span className="font-headline italic text-primary-container font-semibold">Complimentary</span>
                      </label>

                      <label
                        onClick={() => setDeliveryMethod("priority")}
                        className={`group relative flex items-center justify-between p-6 rounded-xl bg-surface-container border cursor-pointer transition-all ${
                          deliveryMethod === "priority" ? "border-[#8f4c30]" : "border-transparent hover:border-[#8f4c30]/20"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-5 h-5 rounded-full border-2 border-outline flex items-center justify-center transition-colors">
                            {deliveryMethod === "priority" && <div className="w-2.5 h-2.5 rounded-full bg-secondary" />}
                          </div>
                          <div>
                            <p className="font-semibold text-primary-container text-sm">Priority Courier Shipping</p>
                            <p className="text-xs text-on-surface-variant font-light mt-1">Next Day Insured & Encrypted Tracking Courier</p>
                          </div>
                        </div>
                        <span className="font-headline italic text-[#31032c] font-semibold">$45.00</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!selectedAddrId && addNewMode}
                      className="px-12 py-5 bg-primary-container text-on-primary rounded-xl font-label tracking-widest uppercase hover:opacity-90 transition-all shadow-xl shadow-primary-container/20 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 text-xs font-bold font-sans"
                    >
                      Continue to review
                      <span className="material-symbols-outlined text-sm select-none">arrow_forward</span>
                    </button>
                  </div>
                </section>
              )}

              {step === 2 && (
                <section className="space-y-12">
                  <div>
                    <h1 className="text-4xl font-headline text-primary-container mb-2">Final Commission Review</h1>
                    <p className="text-on-surface-variant italic mb-10">Confirm details before private courier dispatch.</p>
                  </div>

                  {/* Review Items Summary */}
                  <div className="bg-surface-container/50 border border-primary/5 rounded-xl p-8 space-y-6">
                    <h3 className="font-serif italic text-lg text-primary">Shipping Coordinate Destination</h3>
                    {addresses.find((a) => a.id === selectedAddrId) ? (
                      (() => {
                        const target = addresses.find((a) => a.id === selectedAddrId)!;
                        return (
                          <div className="text-sm font-sans text-on-surface-variant space-y-1 italic">
                            <p className="font-bold text-primary not-italic">{target.name}</p>
                            <p>{target.line1}, {target.city}, {target.zip}, {target.country}</p>
                            <p>Contact: {target.phone}</p>
                          </div>
                        );
                      })()
                    ) : (
                      <p className="text-sm font-sans italic text-on-surface-variant">Default Curation Address</p>
                    )}
                    <button onClick={() => setStep(1)} className="text-xs font-bold uppercase text-secondary tracking-widest hover:underline pt-2 font-sans select-none">
                      Edit Coordinates
                    </button>
                  </div>

                  {/* Payment warning */}
                  <div className="space-y-4 font-sans">
                    <h2 className="text-2xl font-headline text-primary-container">Secure Secure Encryption</h2>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Transactions are certified by secure bank integrations. Once placed, our lead appraisers verify the gem specimen quality and register the GIA license with your order details.
                    </p>
                  </div>

                  <div className="pt-8 flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="px-8 py-5 border border-primary/20 text-[#4f434b] font-bold tracking-widest uppercase rounded-xl hover:bg-surface-container-high transition-colors text-xs font-sans"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleOrderSubmission}
                      disabled={loading}
                      className="flex-1 py-5 bg-primary text-white font-bold tracking-widest uppercase rounded-xl hover:bg-[#4A1942] transition-colors shadow-2xl flex items-center justify-center gap-3 cursor-pointer text-xs font-sans"
                    >
                      {loading ? (
                        <>
                          <span className="material-symbols-outlined text-sm animate-spin select-none">progress_activity</span>
                          Securing Connection...
                        </>
                      ) : (
                        <>
                          Finalize Gem Commission Order
                          <span className="material-symbols-outlined text-sm select-none">verified</span>
                        </>
                      )}
                    </button>
                  </div>
                </section>
              )}

            </div>

            {/* Right Column: Order Summary Card */}
            <aside className="lg:col-span-5 sticky top-32">
              <div className="bg-surface-container p-10 rounded-xl space-y-8 shadow-[0_20px_40px_rgba(74,25,66,0.05)]">
                <h3 className="text-xl font-headline text-primary-container border-b border-primary-container/10 pb-6">Your Selection</h3>
                
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.metal}`} className="flex gap-6">
                      <div className="w-24 h-24 bg-surface-container-lowest rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          src={item.product.images[0]}
                        />
                      </div>
                      <div className="flex flex-col justify-between py-1">
                        <div>
                          <p className="font-headline text-primary-container italic text-lg leading-tight">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-on-surface-variant font-label mt-1 uppercase tracking-wider font-sans">
                            {item.metal} fin &bull; {item.quantity} units
                          </p>
                        </div>
                        <p className="text-secondary font-medium font-sans">
                          ${(item.product.price * item.quantity).toLocaleString()}.00
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-primary-container/10 space-y-4 font-sans text-sm text-on-surface-variant">
                  <div className="flex justify-between">
                    <span className="font-label tracking-wide">Subtotal</span>
                    <span className="font-semibold text-primary">${subtotal.toLocaleString()}.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-label tracking-wide">Atélier Courier</span>
                    {deliveryMethod === "priority" ? (
                      <span className="font-semibold text-primary">$45.00</span>
                    ) : (
                      <span className="italic text-primary font-bold">Complimentary</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="font-label tracking-wide">Insured tax & level (20%)</span>
                    <span className="font-semibold text-primary">${tax.toLocaleString()}.00</span>
                  </div>
                  <div className="flex justify-between items-end pt-4 border-t border-primary-container/10">
                    <span className="text-lg font-headline text-primary-container uppercase tracking-widest font-semibold">Total</span>
                    <span className="text-2xl font-headline text-primary-container font-bold">
                      ${calculateFinalTotal().toLocaleString()}.00
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-high rounded-lg flex items-start gap-4 font-sans">
                  <span className="material-symbols-outlined text-secondary select-none">verified_user</span>
                  <p className="text-[10px] font-label text-on-surface-variant leading-relaxed uppercase tracking-wider">
                    Each item undergoes meticulous appraisal before dispatch from our certified gemological laboratories. Secure carrier signature required.
                  </p>
                </div>
              </div>
            </aside>

          </div>
        )}

      </main>
    </div>
  );
};
