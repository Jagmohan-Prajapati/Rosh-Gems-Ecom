/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronRight,
  Heart,
  Sparkles,
  BadgeCheck,
  ShieldCheck,
  Minus,
  Plus,
  ChevronDown,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { Product } from "../types";
import { useCartStore } from "../store/cartStore";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const FALLBACK_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAdxLOp7YYH--7HraJPEGWnnobgM9CU4CckIPS9tdpv8W80yA4P7Eio5HBlO2ZkBJuWLEGdKD0WMduCXWbo1E0oLfXkdLEOVf5LLHZD7iIjbi-vGO0GSrxZQuyJ64bVbvleOS6Hp0n1mh4i5EON9MTIhQ58w5HtvyDCJ1ohKDjSEky2nioWCUriAi1mZDtC8wGbTnUm8qnLaesJm4IBPzomEKBQKDLVUC5-S9JCfNTr9xzdA1JCyy2T2PSEXTgI2hPoio3qVVn3zGEC";

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [added, setAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [openSection, setOpenSection] = useState<string | null>("characteristics");
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProductData = async () => {
      if (!id) {
        if (isMounted) {
          setProduct(null);
          setCatalog([]);
          setMainImage("");
          setLoading(false);
          setErrorMsg("Product ID is missing.");
        }
        return;
      }

      setLoading(true);
      setErrorMsg("");

      try {
        const listRes = await fetch("/api/products", {
          headers: { Accept: "application/json" },
        });

        const listData = await listRes.json().catch(() => null);

        if (!listRes.ok) {
          throw new Error(listData?.error || "Failed to load products.");
        }

        const list = Array.isArray(listData) ? listData : listData?.products || [];
        const safeList: Product[] = Array.isArray(list) ? list : [];
        const found = safeList.find((p) => String(p.id) === String(id)) || null;

        if (!isMounted) return;

        setCatalog(safeList);
        setProduct(found);

        if (found) {
          setMainImage(found.images?.[0] || FALLBACK_IMAGE);
        } else {
          setMainImage("");
          setErrorMsg("Gemstone specimen not found in the live catalogue.");
        }
      } catch (error) {
        if (!isMounted) return;

        console.error("Failed to load product details.", error);
        setCatalog([]);
        setProduct(null);
        setMainImage("");
        setErrorMsg(
          error instanceof Error ? error.message : "Failed to load product details."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
          window.scrollTo(0, 0);
        }
      }
    };

    void fetchProductData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
    setWishlisted(false);
    setOpenSection("characteristics");
    setMainImage(product?.images?.[0] || FALLBACK_IMAGE);
  }, [product?.id]);

  const maxQty = product?.stockQty && product.stockQty > 0 ? product.stockQty : undefined;
  const displayImage = mainImage || product?.images?.[0] || FALLBACK_IMAGE;
  const galleryImages =
    product?.images && product.images.length > 0 ? product.images : [FALLBACK_IMAGE];

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stockQty !== undefined && product.stockQty <= 0) return;

    const safeQty =
      maxQty !== undefined ? Math.min(quantity, maxQty) : Math.max(quantity, 1);

    for (let i = 0; i < safeQty; i += 1) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || FALLBACK_IMAGE,
        stoneType: product.stoneType,
        category: product.category,
      });
    }

    setAdded(true);
    window.setTimeout(() => {
      setAdded(false);
    }, 3000);
  };

  const complements = useMemo(() => {
    if (!product) return [];

    const sameCategory = catalog.filter(
      (p) => p.id !== product.id && p.category === product.category
    );
    const sameStone = catalog.filter(
      (p) =>
        p.id !== product.id &&
        p.stoneType === product.stoneType &&
        !sameCategory.some((x) => x.id === p.id)
    );
    const fallback = catalog.filter(
      (p) =>
        p.id !== product.id &&
        !sameCategory.some((x) => x.id === p.id) &&
        !sameStone.some((x) => x.id === p.id)
    );

    return [...sameCategory, ...sameStone, ...fallback].slice(0, 4);
  }, [catalog, product]);

  if (loading) {
    return (
      <div className="flex min-h-[600px] flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#8f4c30]" />
        <p className="mt-4 font-serif italic text-primary">Unlocking Gemstone Secrets...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-[900px] px-6 py-20 text-center">
        <h2 className="font-serif text-3xl italic">Gemstone Specimen Not Found</h2>
        <p className="mt-3 text-sm text-on-surface-variant">
          {errorMsg || "This product is unavailable or no longer exists."}
        </p>
        <Link to="/shop" className="mt-4 inline-block font-sans text-secondary hover:underline">
          Return to Atelier Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface antialiased">
      <main className="mx-auto max-w-[1440px] px-6 py-8 md:px-12">
        <nav className="mb-12 flex flex-wrap items-center gap-x-2 gap-y-2 font-sans text-[10px] font-medium uppercase tracking-[0.15em] text-on-surface-variant/60">
          <Link to="/" className="transition-colors hover:text-secondary">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link to="/shop" className="transition-colors hover:text-secondary">
            Collections
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span>{product.stoneType || "Gemstone"}</span>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="max-w-xs truncate font-bold text-on-surface-variant">
            {product.name}
          </span>
        </nav>

        <section className="mb-24 grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="group relative aspect-[4/5] overflow-hidden border border-[#31032c]/10 bg-white p-2.5">
              <img
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={displayImage}
              />

              <div className="absolute right-6 top-6 flex flex-col gap-3">
                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className="cursor-pointer border border-[#31032c]/10 bg-white/80 p-3 text-[#31032c] shadow-md backdrop-blur-md transition-all hover:bg-white"
                  aria-label="Wishlist this item"
                  type="button"
                >
                  <Heart
                    className={`h-5 w-5 ${wishlisted ? "fill-current text-[#8f4c30]" : ""}`}
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {galleryImages.slice(0, 4).map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  type="button"
                  onClick={() => setMainImage(img)}
                  className={`aspect-square cursor-pointer overflow-hidden border bg-white p-1 text-left transition-all ${
                    displayImage === img
                      ? "border-[#8f4c30]"
                      : "border-[#31032c]/10 hover:border-[#31032c]/40"
                  }`}
                  aria-label={`View image ${i + 1} of ${product.name}`}
                >
                  <img
                    alt={`Facets of ${product.name} item ${i + 1}`}
                    className="h-full w-full object-cover transition-opacity hover:opacity-80"
                    src={img}
                  />
                </button>
              ))}

              {galleryImages.length < 4 && (
                <>
                  <div className="flex aspect-square flex-col items-center justify-center overflow-hidden rounded-lg bg-surface-container-low p-2 text-center opacity-60">
                    <Sparkles className="h-5 w-5 text-[#4A1942]" />
                    <span className="mt-1 text-[8px] font-bold uppercase tracking-wider">
                      Refraction Spec
                    </span>
                  </div>
                  <div className="flex aspect-square flex-col items-center justify-center overflow-hidden rounded-lg bg-surface-container-low p-2 text-center opacity-60">
                    <BadgeCheck className="h-5 w-5 text-[#4A1942]" />
                    <span className="mt-1 text-[8px] font-bold uppercase tracking-wider">
                      Certified
                    </span>
                  </div>
                </>
              )}
            </div>
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

              <div className="flex flex-wrap items-baseline gap-4 font-sans">
                <span className="text-3xl font-semibold text-primary-container">
                  {formatPrice(product.price)}
                </span>

                {product.isFeatured && (
                  <span className="rounded bg-secondary-container/30 px-3 py-1 text-[10px] font-bold tracking-widest text-secondary">
                    LIMITED EDITION
                  </span>
                )}

                {product.stockQty !== undefined && product.stockQty <= 0 && (
                  <span className="rounded bg-red-100 px-3 py-1 text-[10px] font-bold tracking-widest text-red-700">
                    OUT OF STOCK
                  </span>
                )}
              </div>
            </header>

            <div className="space-y-6">
              <p className="rounded-none border-l-2 border-[#8f4c30]/50 bg-[#f0ede9]/25 py-2 pl-4 font-serif text-lg italic leading-relaxed text-[#4f434b] opacity-90">
                {product.description}
              </p>

              <div className="flex flex-col gap-3 font-sans sm:flex-row sm:flex-wrap">
                <div className="flex min-h-[48px] items-center gap-3 border border-[#31032c]/10 bg-[#f0ede9]/40 px-4 py-3">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-[#8f4c30]" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4f434b]">
                    Ethical Lineage Sourced
                  </span>
                </div>

                <div className="flex min-h-[48px] items-center gap-3 border border-[#31032c]/10 bg-[#f0ede9]/40 px-4 py-3">
                  <Sparkles className="h-4 w-4 shrink-0 text-[#8f4c30]" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4f434b]">
                    Inspected Appraisal
                  </span>
                </div>
              </div>
            </div>

            <div className="flex w-full max-w-[180px] items-center justify-between border-b border-primary/10 pb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#4f434b]">
                Qty
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => q - 1)}
                  className="flex h-8 w-8 items-center justify-center text-primary transition-colors hover:text-secondary disabled:opacity-35"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="min-w-[24px] text-center font-sans text-sm font-bold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-8 w-8 items-center justify-center text-primary transition-colors hover:text-secondary disabled:opacity-35"
                  aria-label="Increase quantity"
                  disabled={maxQty !== undefined && quantity >= maxQty}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stockQty !== undefined && product.stockQty <= 0}
                className="w-full cursor-pointer bg-[#31032c] py-5 font-sans font-bold uppercase tracking-[0.2em] text-white shadow-md transition-all hover:bg-[#8f4c30] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#31032c]"
              >
                {product.stockQty !== undefined && product.stockQty <= 0
                  ? "Out of Stock"
                  : added
                  ? "Added To Selection Bag"
                  : "Add to Cart"}
              </button>
            </div>

            <div className="space-y-4 pt-10 font-sans">
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenSection(openSection === "characteristics" ? null : "characteristics")
                  }
                  className="flex w-full items-center justify-between gap-4 border-b border-primary/10 py-2 pb-4 text-left hover:text-[#8f4c30]"
                >
                  <span className="font-serif text-lg text-primary">
                    Gemstone Characteristics
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                      openSection === "characteristics" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openSection === "characteristics" && (
                  <div className="space-y-2 pb-6 pt-4 text-xs uppercase leading-relaxed tracking-wide text-on-surface-variant">
                    <p>
                      <strong className="text-primary">Stone Type:</strong>{" "}
                      {product.stoneType || "N/A"}
                    </p>
                    <p>
                      <strong className="text-primary">Color:</strong>{" "}
                      {product.stoneColor || "N/A"}
                    </p>
                    <p>
                      <strong className="text-primary">Carat Weight:</strong>{" "}
                      {product.caratWeight ?? "N/A"}
                      {product.caratWeight ? " ct" : ""}
                    </p>
                    <p>
                      <strong className="text-primary">Origin:</strong>{" "}
                      {product.origin || "N/A"}
                    </p>
                    <p>
                      <strong className="text-primary">Certification:</strong>{" "}
                      {product.certification || "N/A"}
                    </p>
                    <p>
                      <strong className="text-primary">Category:</strong>{" "}
                      {product.category || "N/A"}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === "sourcing" ? null : "sourcing")}
                  className="flex w-full items-center justify-between gap-4 border-b border-primary/10 py-2 pb-4 text-left hover:text-[#8f4c30]"
                >
                  <span className="font-serif text-lg text-primary">
                    The Art of Ethical Sourcing
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                      openSection === "sourcing" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openSection === "sourcing" && (
                  <div className="space-y-2 pb-6 pt-4 text-xs font-light leading-relaxed text-on-surface-variant">
                    <p>
                      Each mineral specimen is ethically tracked through transparent
                      mine-to-market protocols. Transparent sourcing coordinates allow local
                      artisanal empowerment across India and certified global mining communities.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === "shipping" ? null : "shipping")}
                  className="flex w-full items-center justify-between gap-4 border-b border-primary/10 py-2 pb-4 text-left hover:text-[#8f4c30]"
                >
                  <span className="font-serif text-lg text-primary">
                    Shipping & Heritage Packaging
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                      openSection === "shipping" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openSection === "shipping" && (
                  <div className="space-y-2 pb-6 pt-4 text-xs font-light leading-relaxed text-on-surface-variant">
                    <p>
                      Delivered via secure insured shipping. Orders above ₹4,000 receive free
                      shipping; otherwise a ₹299 shipping charge applies at checkout.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {complements.length > 0 && (
          <section className="mt-32">
            <div className="mb-12 flex items-end justify-between gap-6">
              <div className="space-y-2">
                <h2 className="font-headline text-3xl italic text-primary md:text-4xl">
                  You Might Also Love
                </h2>
                <p className="font-sans text-xs uppercase tracking-widest text-on-surface-variant/60">
                  Curated complements from the live catalogue
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
                <Link
                  key={c.id}
                  to={`/shop/${c.id}`}
                  className="group flex h-full flex-col justify-between space-y-4"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-primary/5 bg-surface-container">
                    <img
                      alt={c.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src={c.images?.[0] || FALLBACK_IMAGE}
                    />

                    <div className="absolute bottom-4 right-4 flex items-center justify-center rounded-full bg-white/80 p-2 text-primary opacity-0 shadow-lg backdrop-blur-sm transition-all group-hover:opacity-100 group-hover:text-secondary">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif text-lg text-primary">{c.name}</h3>
                    <p className="font-sans text-sm text-on-surface-variant">
                      {formatPrice(c.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;