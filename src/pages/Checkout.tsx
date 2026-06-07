/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCartStore } from "../store/cartStore";
import type { Address } from "../types";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

interface AddressListResponse {
  addresses: Address[];
}

interface AddressCreateResponse {
  address: Address;
}

interface OrderCreateResponse {
  orderId: string;
  razorpayOrderId?: string;
  razorpayKeyId?: string;
  amount?: number;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

async function parseJsonSafely(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function getErrorMessage(response: Response, fallback: string) {
  const data = (await parseJsonSafely(response)) as ApiErrorResponse | null;
  return data?.error || data?.message || fallback;
}

export const Checkout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const numericSubtotal = useCartStore((state) => state.subtotal());
  const shippingCost = useCartStore((state) => state.shipping());
  const finalTotal = useCartStore((state) => state.total());
  const clearCart = useCartStore((state) => state.clearCart);

  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddrId, setSelectedAddrId] = useState("");
  const [addNewMode, setAddNewMode] = useState(false);

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [checkoutErr, setCheckoutErr] = useState("");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const response = await fetch("/api/user/addresses", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(await getErrorMessage(response, "Failed to load saved addresses."));
        }

        const data = (await response.json()) as AddressListResponse;
        const addressList = data.addresses ?? [];
        setAddresses(addressList);

        if (addressList.length > 0) {
          const defaultAddress = addressList.find((a) => a.isDefault) || addressList[0];
          setSelectedAddrId(defaultAddress.id);
          setAddNewMode(false);
        } else {
          setAddNewMode(true);
        }
      } catch (error) {
        setCheckoutErr(error instanceof Error ? error.message : "Failed to load saved addresses.");
        setAddNewMode(true);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);

  const selectedAddress = useMemo(() => {
    return addresses.find((a) => a.id === selectedAddrId) || null;
  }, [addresses, selectedAddrId]);

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!first || !last || !line1 || !city || !stateName || !zip || !phone) {
      setCheckoutErr("Please fill in all required address fields.");
      return;
    }

    setLoading(true);
    setCheckoutErr("");

    try {
      const response = await fetch("/api/user/addresses", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          label: "Home",
          name: `${first} ${last}`.trim() || user?.name || "Customer",
          phone,
          line1,
          line2: line2 || undefined,
          city,
          state: stateName,
          zip,
          country: "India",
          isDefault: addresses.length === 0,
        }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Could not save address."));
      }

      const data = (await response.json()) as AddressCreateResponse;
      const created = data.address;

      setAddresses((prev) => {
        const next = created.isDefault
          ? prev.map((addr) => ({ ...addr, isDefault: false }))
          : prev;
        return [...next, created];
      });

      setSelectedAddrId(created.id);
      setAddNewMode(false);
      setLine1("");
      setLine2("");
      setZip("");
      setCity("");
      setStateName("");
      setPhone("");
      setFirst("");
      setLast("");
    } catch (error) {
      setCheckoutErr(error instanceof Error ? error.message : "Could not save address.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToReview = () => {
    setCheckoutErr("");

    if (!selectedAddrId && !addNewMode) {
      setCheckoutErr("Please select a delivery address.");
      return;
    }

    if (!selectedAddrId && addNewMode) {
      setCheckoutErr("Please save your address before continuing.");
      return;
    }

    setStep(2);
  };

  const handleOrderSubmission = async () => {
    if (!selectedAddress) {
      setCheckoutErr("Please select a valid shipping address.");
      return;
    }

    setLoading(true);
    setCheckoutErr("");

    try {
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const createRes = await fetch("/api/orders/create", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress: {
            name: selectedAddress.name,
            phone: selectedAddress.phone,
            line1: selectedAddress.line1,
            line2: selectedAddress.line2 || "",
            city: selectedAddress.city,
            state: selectedAddress.state,
            zip: selectedAddress.zip,
            country: selectedAddress.country || "India",
          },
        }),
      });

      if (!createRes.ok) {
        throw new Error(await getErrorMessage(createRes, "Failed to create order."));
      }

      const orderData = (await createRes.json()) as OrderCreateResponse;

      if (orderData.razorpayOrderId && window.Razorpay) {
        const options = {
          key: orderData.razorpayKeyId,
          amount: orderData.amount ?? Math.round(finalTotal * 100),
          currency: "INR",
          name: "RoshGems",
          description: "Gemstone Order Payment",
          order_id: orderData.razorpayOrderId,
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            const verifyRes = await fetch("/api/orders/verify", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                orderId: orderData.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              setCheckoutErr(await getErrorMessage(verifyRes, "Payment verification failed."));
              setLoading(false);
              return;
            }

            clearCart();
            navigate(`/order-confirmation/${orderData.orderId}`, { replace: true });
          },
          prefill: {
            name: user?.name || selectedAddress.name || "",
            email: user?.email || "",
            contact: selectedAddress.phone || "",
          },
          theme: {
            color: "#4A1942",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
        return;
      }

      const verifyRes = await fetch("/api/orders/verify", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          orderId: orderData.orderId,
          razorpayOrderId: orderData.razorpayOrderId || `sandbox_${orderData.orderId}`,
          razorpayPaymentId: `sandbox_pay_${Date.now()}`,
          razorpaySignature: "sandbox_signature",
          isSandboxBypass: true,
        }),
      });

      if (!verifyRes.ok) {
        throw new Error(await getErrorMessage(verifyRes, "Order payment simulation failed."));
      }

      clearCart();
      navigate(`/order-confirmation/${orderData.orderId}`, { replace: true });
    } catch (error) {
      setCheckoutErr(error instanceof Error ? error.message : "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  const activeStepClass = (s: number) => {
    if (step === s) {
      return "flex h-10 w-10 items-center justify-center rounded-full bg-primary-container font-headline italic text-on-primary shadow-lg";
    }
    if (step > s) {
      return "flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-headline italic text-white shadow-md";
    }
    return "flex h-10 w-10 items-center justify-center rounded-full border border-outline font-headline italic text-on-surface-variant";
  };

  const activeLabelClass = (s: number) => {
    if (step === s) {
      return "text-xs font-label font-bold uppercase tracking-widest text-primary-container";
    }
    return "text-xs font-label uppercase tracking-widest opacity-40";
  };

  return (
    <div className="min-h-screen bg-surface-bright font-body text-on-surface">
      <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-[#4A1942]/10 bg-[#fcf9f4]/85 px-6 py-6 backdrop-blur-xl transition-all duration-300 md:px-12">
        <Link to="/" className="text-3xl font-headline italic tracking-widest text-primary-container">
          RoshGems
        </Link>
        <div className="flex items-center gap-8 text-xs uppercase tracking-widest text-on-surface-variant">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">lock</span>
            Secure Checkout
          </span>
          <Link to="/cart" className="transition-colors hover:text-secondary">
            Exit
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-16 md:px-12">
        <div className="mb-16 flex justify-center">
          <div className="flex w-full max-w-3xl items-center font-sans">
            <div className="relative flex flex-1 flex-col items-center gap-4">
              <div className={activeStepClass(1)}>1</div>
              <span className={activeLabelClass(1)}>Delivery</span>
            </div>
            <div className="mb-8 h-[1px] flex-1 bg-outline-variant" />
            <div className="relative flex flex-1 flex-col items-center gap-4">
              <div className={activeStepClass(2)}>2</div>
              <span className={activeLabelClass(2)}>Confirmation</span>
            </div>
          </div>
        </div>

        {checkoutErr && (
          <div
            className="relative mx-auto mb-8 max-w-3xl rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
            role="alert"
          >
            <span className="block sm:inline">{checkoutErr}</span>
          </div>
        )}

        {items.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="mb-4 font-serif text-2xl italic">Your cart is empty</h3>
            <Link
              to="/shop"
              className="border-b pb-1 text-xs font-bold uppercase tracking-widest text-secondary"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-20 lg:grid-cols-12">
            <div className="space-y-12 lg:col-span-7">
              {step === 1 && (
                <section className="space-y-12">
                  <div>
                    <h1 className="mb-2 text-4xl font-headline text-primary-container">
                      Shipping Information
                    </h1>
                    <p className="mb-10 italic text-on-surface-variant">
                      Where shall we send your order?
                    </p>
                  </div>

                  {!loadingAddresses && addresses.length > 0 && !addNewMode && (
                    <div className="space-y-4 font-sans">
                      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-secondary">
                        Select a saved address
                      </p>

                      <div className="grid grid-cols-1 gap-4">
                        {addresses.map((address) => (
                          <label
                            key={address.id}
                            onClick={() => setSelectedAddrId(address.id)}
                            className={`relative block cursor-pointer rounded-xl border bg-surface-container p-6 transition-all ${
                              selectedAddrId === address.id
                                ? "border-secondary ring-2 ring-primary-container/20"
                                : "border-transparent hover:border-secondary/20"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-sm font-bold text-primary-container">
                                  {address.name}
                                </p>
                                <p className="mt-1 text-xs text-on-surface-variant">
                                  {address.line1}
                                  {address.line2 ? `, ${address.line2}` : ""}
                                  {`, ${address.city}, ${address.state}, ${address.zip}, ${address.country}`}
                                </p>
                                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#8f4c30]">
                                  Ph: {address.phone}
                                </p>
                              </div>

                              {address.isDefault && (
                                <span className="rounded bg-[#8f4c30]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#8f4c30]">
                                  Default
                                </span>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setAddNewMode(true)}
                        className="inline-block pt-2 text-xs font-bold uppercase tracking-widest text-secondary hover:underline"
                      >
                        + Add New Address
                      </button>
                    </div>
                  )}

                  {(addNewMode || (!loadingAddresses && addresses.length === 0)) && (
                    <form onSubmit={handleAddNewAddress} className="space-y-10 font-sans">
                      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-outline">
                            First Name
                          </label>
                          <input
                            required
                            type="text"
                            value={first}
                            onChange={(e) => setFirst(e.target.value)}
                            className="border-x-0 border-b border-t-0 border-primary-container/20 bg-transparent py-2 font-body text-on-surface transition-all focus:ring-0"
                            placeholder="Jagmohan"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-outline">
                            Last Name
                          </label>
                          <input
                            required
                            type="text"
                            value={last}
                            onChange={(e) => setLast(e.target.value)}
                            className="border-x-0 border-b border-t-0 border-primary-container/20 bg-transparent py-2 font-body text-on-surface transition-all focus:ring-0"
                            placeholder="Prajapati"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-outline">
                          Address Line 1
                        </label>
                        <input
                          required
                          type="text"
                          value={line1}
                          onChange={(e) => setLine1(e.target.value)}
                          className="border-x-0 border-b border-t-0 border-primary-container/20 bg-transparent py-2 font-body text-on-surface transition-all focus:ring-0"
                          placeholder="House / Flat / Street"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-outline">
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          value={line2}
                          onChange={(e) => setLine2(e.target.value)}
                          className="border-x-0 border-b border-t-0 border-primary-container/20 bg-transparent py-2 font-body text-on-surface transition-all focus:ring-0"
                          placeholder="Area / Landmark (Optional)"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-outline">
                            City
                          </label>
                          <input
                            required
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="border-x-0 border-b border-t-0 border-primary-container/20 bg-transparent py-2 font-body text-on-surface transition-all focus:ring-0"
                            placeholder="Hyderabad"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-outline">
                            State
                          </label>
                          <input
                            required
                            type="text"
                            value={stateName}
                            onChange={(e) => setStateName(e.target.value)}
                            className="border-x-0 border-b border-t-0 border-primary-container/20 bg-transparent py-2 font-body text-on-surface transition-all focus:ring-0"
                            placeholder="Telangana"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-outline">
                            PIN Code
                          </label>
                          <input
                            required
                            type="text"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            className="border-x-0 border-b border-t-0 border-primary-container/20 bg-transparent py-2 font-body text-on-surface transition-all focus:ring-0"
                            placeholder="500001"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-outline">
                            Phone
                          </label>
                          <input
                            required
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="border-x-0 border-b border-t-0 border-primary-container/20 bg-transparent py-2 font-body text-on-surface transition-all focus:ring-0"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="cursor-pointer rounded-lg bg-secondary px-8 py-3 text-xs font-bold uppercase tracking-widest text-white disabled:opacity-60"
                        >
                          {loading ? "Saving..." : "Save Address"}
                        </button>

                        {addresses.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setAddNewMode(false)}
                            className="cursor-pointer rounded-lg border border-primary/20 px-8 py-3 text-xs font-bold uppercase tracking-widest text-[#4f434b]"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  )}

                  <div className="rounded-xl border bg-surface-container p-6">
                    <h2 className="mb-3 text-2xl font-headline text-primary-container">
                      Shipping
                    </h2>
                    <p className="text-sm text-on-surface-variant">
                      Standard shipping is applied automatically. Orders above ₹4,000 get free shipping; otherwise shipping is ₹299.
                    </p>
                  </div>

                  <div className="pt-8">
                    <button
                      type="button"
                      onClick={handleContinueToReview}
                      disabled={!selectedAddrId}
                      className="flex cursor-pointer items-center justify-center gap-3 rounded-xl bg-primary-container px-12 py-5 text-xs font-bold uppercase tracking-widest text-on-primary shadow-xl shadow-primary-container/20 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Continue to review
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </section>
              )}

              {step === 2 && (
                <section className="space-y-12">
                  <div>
                    <h1 className="mb-2 text-4xl font-headline text-primary-container">
                      Final Review
                    </h1>
                    <p className="mb-10 italic text-on-surface-variant">
                      Confirm your details before payment.
                    </p>
                  </div>

                  <div className="space-y-6 rounded-xl border border-primary/5 bg-surface-container/50 p-8">
                    <h3 className="text-lg font-serif italic text-primary">
                      Shipping Destination
                    </h3>

                    {selectedAddress ? (
                      <div className="space-y-1 text-sm italic text-on-surface-variant">
                        <p className="font-bold not-italic text-primary">{selectedAddress.name}</p>
                        <p>
                          {selectedAddress.line1}
                          {selectedAddress.line2 ? `, ${selectedAddress.line2}` : ""}
                          {`, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.zip}, ${selectedAddress.country}`}
                        </p>
                        <p>Contact: {selectedAddress.phone}</p>
                      </div>
                    ) : (
                      <p className="text-sm italic text-on-surface-variant">
                        No address selected
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="pt-2 text-xs font-bold uppercase tracking-widest text-secondary hover:underline"
                    >
                      Edit Address
                    </button>
                  </div>

                  <div className="space-y-4 font-sans">
                    <h2 className="text-2xl font-headline text-primary-container">
                      Secure Payment
                    </h2>
                    <p className="text-xs leading-relaxed text-on-surface-variant">
                      Your order will be processed through Razorpay using secure payment verification.
                    </p>
                  </div>

                  <div className="flex gap-4 pt-8">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="rounded-xl border border-primary/20 px-8 py-5 text-xs font-bold uppercase tracking-widest text-[#4f434b] transition-colors hover:bg-surface-container-high"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleOrderSubmission}
                      disabled={loading}
                      className="flex flex-1 cursor-pointer items-center justify-center gap-3 rounded-xl bg-primary py-5 text-xs font-bold uppercase tracking-widest text-white shadow-2xl transition-colors hover:bg-[#4A1942] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-sm">
                            progress_activity
                          </span>
                          Processing...
                        </>
                      ) : (
                        <>
                          Place Order
                          <span className="material-symbols-outlined text-sm">verified</span>
                        </>
                      )}
                    </button>
                  </div>
                </section>
              )}
            </div>

            <aside className="sticky top-32 lg:col-span-5">
              <div className="space-y-8 rounded-xl bg-surface-container p-10 shadow-[0_20px_40px_rgba(74,25,66,0.05)]">
                <h3 className="border-b border-primary-container/10 pb-6 text-xl font-headline text-primary-container">
                  Your Selection
                </h3>

                <div className="space-y-6">
                  {items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex gap-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-surface-container-lowest">
                        <img
                          alt={item.name}
                          className="h-full w-full object-cover"
                          src={item.image || ""}
                        />
                      </div>

                      <div className="flex flex-col justify-between py-1">
                        <div>
                          <p className="text-lg font-headline italic leading-tight text-primary-container">
                            {item.name}
                          </p>
                          <p className="mt-1 font-sans text-xs uppercase tracking-wider text-on-surface-variant">
                            {item.stoneType || item.category || "Gem"} • Qty {item.quantity}
                          </p>
                        </div>
                        <p className="font-sans font-medium text-secondary">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-t border-primary-container/10 pt-8 font-sans text-sm text-on-surface-variant">
                  <div className="flex justify-between">
                    <span className="tracking-wide">Subtotal</span>
                    <span className="font-semibold text-primary">
                      {formatPrice(numericSubtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="tracking-wide">Shipping</span>
                    <span className="font-semibold text-primary">
                      {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                    </span>
                  </div>

                  <div className="flex items-end justify-between border-t border-primary-container/10 pt-4">
                    <span className="text-lg font-semibold uppercase tracking-widest text-primary-container">
                      Total
                    </span>
                    <span className="text-2xl font-headline font-bold text-primary-container">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg bg-surface-container-high p-4 font-sans">
                  <span className="material-symbols-outlined select-none text-secondary">
                    verified_user
                  </span>
                  <p className="text-[10px] leading-relaxed uppercase tracking-wider text-on-surface-variant">
                    Secure checkout with verified payment processing and insured delivery.
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