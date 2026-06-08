/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Order, OrderItem } from "../types";

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

function formatPrice(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
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

function getItemDisplayName(item: OrderItem) {
  return item.product?.name || "RoshGems Specimen";
}

function getItemDisplayImage(item: OrderItem) {
  return (
    item.product?.images?.[0] ||
    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800"
  );
}

export const OrderConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setPageError("Missing order reference.");
        setPageLoading(false);
        return;
      }

      try {
        setPageLoading(true);
        setPageError("");

        const res = await fetch(`/api/orders/${id}`, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          throw new Error(
            await getErrorMessage(res, "Failed to load order confirmation details.")
          );
        }

        const data = await res.json();
        const actualOrder = data?.order ?? data;

        if (actualOrder?.id) {
          setOrder(actualOrder as Order);
        } else {
          throw new Error("Order record is incomplete.");
        }
      } catch (err) {
        setPageError(
          err instanceof Error
            ? err.message
            : "Failed to load order confirmation details."
        );
      } finally {
        setPageLoading(false);
      }
    };

    void fetchOrder();
    window.scrollTo(0, 0);
  }, [id]);

  const patronName = order?.user?.name || user?.name || "Patron";
  const displayId = order?.id || id || "RG-ORDER";
  const currency = order?.currency || "INR";

  const itemSubtotal = useMemo(() => {
    if (!order?.items?.length) return order?.total ?? 0;
    return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [order]);

  const shippingCharge = useMemo(() => {
    if (!order) return 0;
    const derived = order.total - itemSubtotal;
    return derived > 0 ? derived : 0;
  }, [order, itemSubtotal]);

  if (!isLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading || pageLoading) {
    return (
      <div className="bg-surface text-on-surface min-h-screen">
        <main className="max-w-4xl mx-auto px-6 py-20 md:py-28">
          <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined animate-spin text-4xl text-secondary">
              progress_activity
            </span>
            <p className="mt-4 font-serif italic text-primary-container text-xl">
              Retrieving your secured order ledger...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (pageError || !order) {
    return (
      <div className="bg-surface text-on-surface min-h-screen">
        <main className="max-w-4xl mx-auto px-6 py-20 md:py-28">
          <div className="rounded-2xl border border-red-300/30 bg-red-50 px-8 py-10 text-center">
            <h1 className="font-serif text-3xl text-primary-container mb-4">
              Order Record Unavailable
            </h1>
            <p className="text-sm md:text-base text-on-surface-variant mb-8">
              {pageError || "We could not retrieve this order at the moment."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/account"
                className="px-8 py-3 bg-primary-container text-white rounded-xl font-medium tracking-wide w-full sm:w-auto text-center"
              >
                Go to Account
              </Link>
              <Link
                to="/shop"
                className="px-8 py-3 text-primary-container font-medium underline underline-offset-4 w-full sm:w-auto text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen selection:bg-[#ffdbce] selection:text-primary">
      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <section className="text-center mb-16">
          <div className="inline-block mb-8 relative">
            <div className="absolute inset-0 bg-secondary/10 blur-3xl rounded-full scale-150" />
            <img
              alt="Rose cut crystal diamond illustration with refracting light facets"
              className="w-32 h-32 object-contain relative z-10 mx-auto"
              src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800"
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-serif text-primary-container mb-4 tracking-[0.02em]">
            Thank You, {patronName}!
          </h1>

          <p className="text-on-surface-variant font-body text-base md:text-lg mb-8 italic">
            Your curated selection is being appraised and prepared in our Atélier with master artisanal care.
          </p>

          <div className="inline-flex items-center gap-3 px-6 py-2 bg-surface-container rounded-full border border-outline-variant/30 font-sans">
            <span className="text-xs uppercase tracking-[0.15em] font-medium text-on-surface-variant">
              Order Number
            </span>
            <span className="text-primary-container font-bold tracking-widest font-mono text-sm">
              {displayId}
            </span>
          </div>
        </section>

        <section className="mb-20">
          <div className="relative flex justify-between items-center max-w-2xl mx-auto font-sans">
            <div className="absolute h-[1px] bg-[#4A1942]/10 top-1/2 left-0 right-0 -translate-y-1/2 z-0" />

            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-[#fcf9f4] shadow-md">
                <span
                  className="material-symbols-outlined text-sm select-none"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary-container">
                {order.isPaid ? "Paid" : "Created"}
              </span>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#fcf9f4] border-2 border-primary-container flex items-center justify-center text-primary-container relative">
                <span className="material-symbols-outlined text-sm select-none animate-pulse">
                  auto_awesome
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-medium text-on-surface-variant">
                {order.status === "PROCESSING" ? "Processing" : order.status}
              </span>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#fcf9f4] border border-[#4A1942]/10 flex items-center justify-center text-on-surface-variant/40">
                <span className="material-symbols-outlined text-sm select-none">
                  local_shipping
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-medium text-[#4f434b]/60">
                Transit
              </span>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#fcf9f4] border border-[#4A1942]/10 flex items-center justify-center text-on-surface-variant/40">
                <span className="material-symbols-outlined text-sm select-none">
                  home_pin
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-medium text-[#4f434b]/60">
                Arrival
              </span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="bg-surface-container rounded-xl p-8 shadow-[0_10px_30px_rgba(74,25,66,0.03)] text-on-surface">
            <h3 className="text-primary-container font-serif text-xl mb-8 border-b border-outline-variant/30 pb-4">
              Your Selection Commission
            </h3>

            {order.items && order.items.length > 0 ? (
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-6">
                    <div className="w-20 h-24 bg-surface-container-lowest rounded-lg overflow-hidden shrink-0 border border-primary/5">
                      <img
                        alt={getItemDisplayName(item)}
                        className="w-full h-full object-cover"
                        src={getItemDisplayImage(item)}
                      />
                    </div>

                    <div className="flex-1">
                      <p className="font-serif text-[#4A1942] text-lg font-semibold">
                        {getItemDisplayName(item)}
                      </p>
                      <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1 font-sans">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-secondary font-medium mt-3 font-sans">
                        {formatPrice(item.price * item.quantity, currency)}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="mt-8 pt-6 border-t border-outline-variant/30 space-y-3 font-sans">
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>{formatPrice(itemSubtotal, currency)}</span>
                  </div>

                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>Atélier Courier</span>
                    <span className="italic text-primary font-bold">
                      {shippingCharge === 0
                        ? "Complimentary"
                        : formatPrice(shippingCharge, currency)}
                    </span>
                  </div>

                  <div className="flex justify-between text-lg font-serif text-primary-container pt-2 font-bold border-t border-primary/5">
                    <span>Total Secured</span>
                    <span>{formatPrice(order.total, currency)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 font-sans text-sm text-on-surface-variant">
                <p>Your order has been recorded successfully.</p>
                <div className="mt-8 pt-6 border-t border-outline-variant/30 space-y-3">
                  <div className="flex justify-between">
                    <span>Total Secured</span>
                    <span className="font-semibold text-primary-container">
                      {formatPrice(order.total, currency)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
            <div className="mb-10 text-on-surface-variant">
              <h3 className="text-primary-container font-serif text-xl mb-6">
                Delivery Coordinate Address
              </h3>

              <div className="text-sm font-light leading-relaxed space-y-1 font-sans">
                <p className="font-bold text-on-surface">{order.shippingAddress.name}</p>
                {order.shippingAddress.label ? (
                  <p className="text-xs uppercase tracking-widest text-secondary">
                    {order.shippingAddress.label}
                  </p>
                ) : null}
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 ? <p>{order.shippingAddress.line2}</p> : null}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zip}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="pt-2">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-primary-container font-serif text-xl mb-6 font-bold">
                Payment Method
              </h3>
              <div className="flex items-center gap-4 font-sans">
                <div className="w-12 h-8 bg-surface-container-lowest border border-outline-variant/20 rounded flex items-center justify-center">
                  <span className="text-[8px] font-bold tracking-tighter italic">
                    GATEWAY
                  </span>
                </div>
                <span className="text-on-surface-variant font-light text-xs uppercase tracking-widest">
                  {order.paymentMethod || (order.isPaid ? "Verified Secured Payment" : "Payment Pending")}
                </span>
              </div>
            </div>

            <div className="space-y-3 border-t border-outline-variant/20 pt-6 font-sans text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Status</span>
                <span className="font-semibold text-primary-container">{order.status}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Payment</span>
                <span className="font-semibold text-primary-container">
                  {order.isPaid ? "Paid" : "Pending"}
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Placed On</span>
                <span className="font-semibold text-primary-container">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              {order.trackingId ? (
                <div className="flex justify-between text-on-surface-variant">
                  <span>Tracking ID</span>
                  <span className="font-semibold text-primary-container">{order.trackingId}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 font-sans">
          <Link
            to="/shop"
            className="px-10 py-4 bg-primary-container text-white rounded-xl font-body font-medium tracking-wide shadow-xl shadow-primary-container/20 hover:scale-[1.02] transition-all w-full sm:w-auto text-center"
          >
            Explore More Treasures
          </Link>

          <Link
            to="/account"
            className="px-10 py-4 text-primary-container font-body font-medium hover:underline underline-offset-8 transition-all w-full sm:w-auto text-center font-bold"
          >
            View My Orders
          </Link>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmation;