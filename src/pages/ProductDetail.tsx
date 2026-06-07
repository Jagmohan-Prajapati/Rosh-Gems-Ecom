/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Product } from "../types";
import { SAMPLE_PRODUCTS } from "../lib/gemData";
import { useCartStore } from "../store/cartStore";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [added, setAdded] = useState(false);

  const [openSection, setOpenOpenSection] = useState<string | null>("characteristics");
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const fallbackLocal = () => {
      const found = SAMPLE_PRODUCTS.find((p) => p.id === id);
      if (found) {
        setProduct(found);
        setMainImage(found.images[0]);
      } else if (SAMPLE_PRODUCTS.length > 0) {
        setProduct(SAMPLE_PRODUCTS[0]);
        setMainImage(SAMPLE_PRODUCTS[0].images[0]);
      }
    };

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          const productData = data?.product ?? data;
          if (productData && productData.id) {
            setProduct(productData);
            setMainImage(productData.images?.[0] || "");
          } else {
            fallbackLocal();
          }
        } else {
          fallbackLocal();
        }
      } catch {
        fallbackLocal();
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[600px] flex-col items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-[#8f4c30]">
          progress_activity
        </span>
        <p className="mt-4 font-serif italic text-primary">Unlocking Gemstone Secrets...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h2 className="font-serif text-3xl italic">Gemstone Specimen Not Found</h2>
        <Link to="/shop" className="mt-4 inline-block font-sans text-secondary hover:underline">
          Return to Atelier Catalogue
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i += 1) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "",
        stoneType: product.stoneType,
        category: product.category,
      });
    }

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 3000);
  };

  const complements = SAMPLE_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-surface text-on-surface antialiased">
      <main className="mx-auto max-w-[1440px] px-6 py-8 md:px-12">
        <nav className="mb-12 flex flex-wrap items-center gap-2 font-sans text-[10px] font-medium uppercase tracking-[0.15em] text-on-surface-variant/60">
          <Link to="/" className="transition-colors hover:text-secondary">
            Home
          </Link>
          <span className="material-symbols-outlined select-none text-[12px]">chevron_right</span>
          <Link to="/shop" className="transition-colors hover:text-secondary">
            Collections
          </Link>
          <span className="material-symbols-outlined select-none text-[12px]">chevron_right</span>
          <span className="uppercase transition-colors hover:text-secondary">{product.stoneType}</span>
          <span className="material-symbols-outlined select-none text-[12px]">chevron_right</span>
          <span className="max-w-xs truncate font-bold text-on-surface-variant">{product.name}</span>
        </nav>

        <section className="mb-24 grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="group relative aspect-[4/5] overflow-hidden border border-[#31032c]/10 bg-white p-2.5">
              <img
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={mainImage}
              />
              <div className="absolute right-6 top-6 flex flex-col gap-3">
                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className="cursor-pointer border border-[#31032c]/10 bg-white/80 p-3 text-[#31032c] shadow-md backdrop-blur-md transition-all hover:bg-white"
                  aria-label="Wishlist this item"
                >
                  <span
                    className="material-symbols-outlined select-none"
                    style={{ fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                </button>
              </div>
            </div>

            {product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`aspect-square cursor-pointer overflow-hidden border bg-white p-1 transition-all ${
                      mainImage === img
                        ? "border-[#8f4c30]"
                        : "border-[#31032c]/10 hover:border-[#31032c]/40"
                    }`}
                  >
                    <img
                      alt={`Facets of ${product.name} item`}
                      className="h-full w-full object-cover transition-opacity hover:opacity-80"
                      src={img}
                    />
                  </div>
                ))}

                {product.images.length < 4 && (
                  <>
                    <div className="flex aspect-square flex-col items-center justify-center overflow-hidden rounded-lg bg-surface-container-low p-2 text-center opacity-60">
                      <span className="material-symbols-outlined select-none text-[#4A1942]">
                        auto_awesome
                      </span>
                      <span className="mt-1 text-[8px] font-bold uppercase tracking-wider">
                        Refraction Spec
                      </span>
                    </div>
                    <div className="flex aspect-square flex-col items-center justify-center overflow-hidden rounded-lg bg-surface-container-low p-2 text-center opacity-60">
                      <span className="material-symbols-outlined select-none text-[#4A1942]">
                        verified
                      </span>
                      <span className="mt-1 text-[8px] font-bold uppercase tracking-wider">
                        GIA Certified
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="space-y-10 lg:col-span-5">
            <header className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
                  The RoshGems digital atelier
                </span>
                <div className="h-px flex-1 bg-outline-variant/30" />
              </div>
              <h1 className="font-headline text-4xl leading-tight tracking-[0.02em] text-primary md:text-5xl">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-4 font-sans">
                <span className="text-3xl font-semibold text-primary-container">
                  {formatPrice(product.price)}
                </span>
                {product.isFeatured && (
                  <span className="rounded bg-secondary-container/30 px-3 py-1 text-[10px] font-bold tracking-widest text-secondary">
                    LIMITED EDITION
                  </span>
                )}
              </div>
            </header>

            <div className="space-y-6">
              <p className="rounded-none border-l-2 border-[#8f4c30]/50 bg-[#f0ede9]/25 py-2 pl-4 font-serif text-lg italic leading-relaxed text-[#4f434b] opacity-90">
                "{product.story || product.description}"
              </p>
              <div className="flex flex-wrap gap-3 font-sans">
                <div className="flex items-center gap-2 border border-[#31032c]/10 bg-[#f0ede9]/40 px-4 py-2">
                  <span className="material-symbols-outlined select-none text-sm text-[#8f4c30]">
                    verified_user
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4f434b]">
                    Ethical Lineage Sourced
                  </span>
                </div>
                <div className="flex items-center gap-2 border border-[#31032c]/10 bg-[#f0ede9]/40 px-4 py-2">
                  <span className="material-symbols-outlined select-none text-sm text-[#8f4c30]">
                    auto_awesome
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4f434b]">
                    Inspected Appraisal
                  </span>
                </div>
              </div>
            </div>

            <div className="flex w-32 items-center justify-between border-b border-primary/10 pb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#4f434b]">Qty</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => q - 1)}
                  className="text-primary hover:text-secondary disabled:opacity-35"
                >
                  <span className="material-symbols-outlined select-none text-sm">remove</span>
                </button>
                <span className="w-4 text-center font-sans text-sm font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-primary hover:text-secondary"
                >
                  <span className="material-symbols-outlined select-none text-sm">add</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full cursor-pointer bg-[#31032c] py-5 font-sans font-bold uppercase tracking-[0.2em] text-white shadow-md transition-all hover:bg-[#8f4c30] active:scale-[0.98]"
              >
                {added ? "Added To Selection Bag" : "Add to Cart"}
              </button>
            </div>

            <div className="space-y-4 pt-10 font-sans">
              <div>
                <button
                  onClick={() =>
                    setOpenOpenSection(openSection === "characteristics" ? null : "characteristics")
                  }
                  className="flex w-full items-center justify-between border-b border-primary/10 py-2 pb-4 text-left hover:text-[#8f4c30]"
                >
                  <span className="font-serif text-lg text-primary">Gemstone Characteristics</span>
                  <span
                    className={`material-symbols-outlined select-none transition-transform duration-300 ${
                      openSection === "characteristics" ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {openSection === "characteristics" && (
                  <div className="space-y-2 pb-6 pt-4 text-xs uppercase tracking-wide text-on-surface-variant leading-relaxed">
                    <p>
                      <strong className="text-primary">Stone Type:</strong> {product.stoneType}
                    </p>
                    <p>
                      <strong className="text-primary">Color:</strong> {product.stoneColor}
                    </p>
                    <p>
                      <strong className="text-primary">Carat Weight:</strong> {product.caratWeight} ct
                    </p>
                    <p>
                      <strong className="text-primary">Origin:</strong> {product.origin}
                    </p>
                    <p>
                      <strong className="text-primary">Certification:</strong> {product.certification}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() =>
                    setOpenOpenSection(openSection === "sourcing" ? null : "sourcing")
                  }
                  className="flex w-full items-center justify-between border-b border-primary/10 py-2 pb-4 text-left hover:text-[#8f4c30]"
                >
                  <span className="font-serif text-lg text-primary">The Art of Ethical Sourcing</span>
                  <span
                    className={`material-symbols-outlined select-none transition-transform duration-300 ${
                      openSection === "sourcing" ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {openSection === "sourcing" && (
                  <div className="space-y-2 pb-6 pt-4 text-xs font-light leading-relaxed text-on-surface-variant">
                    <p>
                      Each mineral specimen is ethically tracked through transparent mine-to-market protocols. Transparent sourcing coordinates allow local artisanal empowerment across India and certified global mining communities.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() =>
                    setOpenOpenSection(openSection === "shipping" ? null : "shipping")
                  }
                  className="flex w-full items-center justify-between border-b border-primary/10 py-2 pb-4 text-left hover:text-[#8f4c30]"
                >
                  <span className="font-serif text-lg text-primary">Shipping & Heritage Packaging</span>
                  <span
                    className={`material-symbols-outlined select-none transition-transform duration-300 ${
                      openSection === "shipping" ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {openSection === "shipping" && (
                  <div className="space-y-2 pb-6 pt-4 text-xs font-light leading-relaxed text-on-surface-variant">
                    <p>
                      Delivered via secure insured shipping. Orders above ₹4,000 receive free shipping; otherwise a ₹299 shipping charge applies at checkout.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-32">
          <div className="mb-12 flex items-end justify-between">
            <div className="space-y-2">
              <h2 className="font-headline text-3xl italic text-primary md:text-4xl">
                You Might Also Love
              </h2>
              <p className="font-sans text-xs uppercase tracking-widest text-on-surface-variant/60">
                Curated complements for your collection
              </p>
            </div>
            <Link
              to="/shop"
              className="border-b border-secondary pb-1 font-sans text-xs font-bold uppercase tracking-widest text-secondary transition-colors hover:text-primary"
            >
              View All Curations
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {complements.map((c) => (
              <div key={c.id} className="flex h-full flex-col justify-between space-y-4 group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-primary/5 bg-surface-container">
                  <img
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src={c.images[0]}
                  />
                  <button
                    onClick={() => navigate(`/shop/${c.id}`)}
                    className="absolute bottom-4 right-4 flex cursor-pointer items-center justify-center rounded-full bg-white/80 p-2 text-primary opacity-0 shadow-lg backdrop-blur-sm transition-opacity hover:text-secondary group-hover:opacity-100"
                    aria-label="View complement"
                  >
                    <span className="material-symbols-outlined select-none text-sm">visibility</span>
                  </button>
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg text-primary">{c.name}</h3>
                  <p className="font-sans text-sm text-on-surface-variant">{formatPrice(c.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};