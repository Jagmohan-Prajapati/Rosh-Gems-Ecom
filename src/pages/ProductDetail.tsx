/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Product } from "../types";
import { SAMPLE_PRODUCTS } from "../lib/gemData";
import { useCart } from "../lib/CartContext";

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetal, setSelectedMetal] = useState("Rose Gold");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [added, setAdded] = useState(false);

  // Accordion Toggles
  const [openSection, setOpenOpenSection] = useState<string | null>("characteristics");

  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.id) {
            setProduct(data);
            setMainImage(data.images[0]);
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

    const fallbackLocal = () => {
      // Find in fallback array
      const found = SAMPLE_PRODUCTS.find((p) => p.id === id);
      if (found) {
        setProduct(found);
        setMainImage(found.images[0]);
      } else {
        // Fallback to first item to avoid runtime white screen
        setProduct(SAMPLE_PRODUCTS[0]);
        setMainImage(SAMPLE_PRODUCTS[0].images[0]);
      }
    };

    fetchDetail();
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px]">
        <span className="material-symbols-outlined text-4xl animate-spin text-[#8f4c30]">progress_activity</span>
        <p className="mt-4 font-serif italic text-primary">Unlocking Gemstone Secrets...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="font-serif italic text-3xl">Gemstone Specimen Not Found</h2>
        <Link to="/shop" className="text-secondary hover:underline mt-4 inline-block font-sans">
          Return to Atelier Catalogue
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedMetal);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 3000);
  };

  // Recommendations Complements
  const complements = SAMPLE_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-surface text-on-surface antialiased">
      <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-8">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap items-center gap-2 mb-12 text-[10px] tracking-[0.15em] uppercase font-medium text-on-surface-variant/60 font-sans">
          <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[12px] select-none">chevron_right</span>
          <Link to="/shop" className="hover:text-secondary transition-colors">Collections</Link>
          <span className="material-symbols-outlined text-[12px] select-none">chevron_right</span>
          <span className="hover:text-secondary transition-colors uppercase">{product.stoneType}</span>
          <span className="material-symbols-outlined text-[12px] select-none">chevron_right</span>
          <span className="text-on-surface-variant font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Layout Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-24">
          
          {/* Left Column: Image display & mini thumbnails */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[4/5] bg-[#f0ede9]/35 overflow-hidden rounded-none group border border-[#31032c]/10 p-2.5 bg-white">
              <img
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                src={mainImage}
              />
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                <button 
                  onClick={() => setWishlisted(!wishlisted)}
                  className="bg-white/80 backdrop-blur-md p-3 rounded-none text-[#31032c] hover:bg-white transition-all shadow-md cursor-pointer border border-[#31032c]/10"
                  aria-label="Wishlist this item"
                >
                  <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0" }}>
                    favorite
                  </span>
                </button>
              </div>
            </div>

            {/* Alternates list */}
            {product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`aspect-square rounded-none overflow-hidden cursor-pointer border transition-all p-1 bg-white ${
                      mainImage === img ? "border-[#8f4c30]" : "border-[#31032c]/10 hover:border-[#31032c]/40"
                    }`}
                  >
                    <img
                      alt={`Facets of ${product.name} item`}
                      className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                      src={img}
                    />
                  </div>
                ))}
                {/* Fallback mock detail previews to fill 4 boxes beautifully */}
                {product.images.length < 4 && (
                  <>
                    <div className="aspect-square rounded-lg overflow-hidden bg-surface-container-low flex flex-col items-center justify-center p-2 text-center opacity-60">
                      <span className="material-symbols-outlined text-[#4A1942] select-none">auto_awesome</span>
                      <span className="text-[8px] uppercase tracking-wider mt-1 font-bold">Refraction Spec</span>
                    </div>
                    <div className="aspect-square rounded-lg overflow-hidden bg-surface-container-low flex flex-col items-center justify-center p-2 text-center opacity-60">
                      <span className="material-symbols-outlined text-[#4A1942] select-none">verified</span>
                      <span className="text-[8px] uppercase tracking-wider mt-1 font-bold">GIA Certified</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Dynamic curation settings & Checkout */}
          <div className="lg:col-span-5 space-y-10">
            <header className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-[10px] tracking-[0.2em] uppercase text-secondary font-bold font-sans">
                  The RoshGems digital atelier
                </span>
                <div className="h-px flex-1 bg-outline-variant/30" />
              </div>
              <h1 className="font-headline text-4xl md:text-5xl text-primary leading-tight tracking-[0.02em]">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-4 font-sans">
                <span className="text-3xl font-semibold text-primary-container">
                  ${product.price.toLocaleString()}.00
                </span>
                {product.isFeatured && (
                  <span className="bg-secondary-container/30 text-secondary text-[10px] px-3 py-1 rounded tracking-widest font-bold">
                    LIMITED EDITION
                  </span>
                )}
              </div>
            </header>

            {/* Curated Story Box */}
            <div className="space-y-6">
              <p className="text-[#4f434b] leading-relaxed font-serif italic text-lg opacity-90 border-l-2 border-[#8f4c30]/50 pl-4 bg-[#f0ede9]/25 py-2 rounded-none">
                "{product.story || product.description}"
              </p>
              <div className="flex flex-wrap gap-3 font-sans">
                <div className="flex items-center gap-2 bg-[#f0ede9]/40 px-4 py-2 rounded-none border border-[#31032c]/10">
                  <span className="material-symbols-outlined text-sm text-[#8f4c30] select-none">verified_user</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#4f434b]">Ethical Lineage Sourced</span>
                </div>
                <div className="flex items-center gap-2 bg-[#f0ede9]/40 px-4 py-2 rounded-none border border-[#31032c]/10">
                  <span className="material-symbols-outlined text-sm text-[#8f4c30] select-none">auto_awesome</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#4f434b]">Inspected Appraisal</span>
                </div>
              </div>
            </div>

            {/* Metal Finish Option Selector */}
            <div className="space-y-4">
              <label className="text-[11px] tracking-[0.2em] uppercase font-bold text-on-surface-variant block font-sans">
                Curate Metal Finish: {selectedMetal}
              </label>
              <div className="flex gap-4">
                {["Rose Gold", "White Gold", "Yellow Gold"].map((metal) => {
                  const mColors: Record<string, string> = {
                    "Rose Gold": "bg-[#f3d3ca]",
                    "White Gold": "bg-[#e5e5e5]",
                    "Yellow Gold": "bg-[#f1dca7]",
                  };
                  return (
                    <button
                      key={metal}
                      type="button"
                      onClick={() => setSelectedMetal(metal)}
                      className={`w-10 h-10 rounded-full ${mColors[metal]} transition-all cursor-pointer relative ${
                        selectedMetal === metal
                          ? "ring-2 ring-primary ring-offset-2 scale-110"
                          : "hover:scale-105"
                      }`}
                      title={metal}
                    />
                  );
                })}
              </div>
            </div>

            {/* Quantity selection */}
            <div className="flex items-center gap-4 border-b border-primary/10 pb-6 w-32 justify-between">
              <span className="text-xs uppercase tracking-widest text-[#4f434b] font-bold">Qty</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(q => q - 1)}
                  className="text-primary hover:text-secondary disabled:opacity-35"
                >
                  <span className="material-symbols-outlined text-sm select-none">remove</span>
                </button>
                <span className="font-bold font-sans text-sm w-4 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="text-primary hover:text-secondary"
                >
                  <span className="material-symbols-outlined text-sm select-none">add</span>
                </button>
              </div>
            </div>

            {/* Shopping trigger options */}
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-[#31032c] hover:bg-[#8f4c30] text-white py-5 rounded-none font-bold tracking-[0.2em] uppercase transition-all shadow-md active:scale-[0.98] cursor-pointer font-sans"
              >
                {added ? "Added To Selection Bag" : "Add to Cart"}
              </button>
            </div>

            {/* Accordion Panels */}
            <div className="pt-10 space-y-4 font-sans">
              {/* Characteristics */}
              <div>
                <button
                  onClick={() => setOpenOpenSection(openSection === "characteristics" ? null : "characteristics")}
                  className="w-full border-b border-primary/10 pb-4 flex justify-between items-center text-left py-2 hover:text-[#8f4c30]"
                >
                  <span className="font-serif text-lg text-primary">Gemstone Characteristics</span>
                  <span className={`material-symbols-outlined select-none transition-transform duration-300 ${openSection === "characteristics" ? "rotate-180" : ""}`}>
                    expand_more
                  </span>
                </button>
                {openSection === "characteristics" && (
                  <div className="pt-4 pb-6 text-xs text-on-surface-variant leading-relaxed space-y-2 uppercase tracking-wide">
                    <p><strong className="text-primary">Cut:</strong> Precision Cushion Factoring</p>
                    <p><strong className="text-primary">Clarity:</strong> Eye Clean (Type II Specimen)</p>
                    <p><strong className="text-primary">Refractive Index:</strong> 1.624 - 1.644</p>
                    <p><strong className="text-primary">Approx. Carats:</strong> 2.4ct natural raw weight</p>
                  </div>
                )}
              </div>

              {/* Sourcing */}
              <div>
                <button
                  onClick={() => setOpenOpenSection(openSection === "sourcing" ? null : "sourcing")}
                  className="w-full border-b border-primary/10 pb-4 flex justify-between items-center text-left py-2 hover:text-[#8f4c30]"
                >
                  <span className="font-serif text-lg text-primary">The Art of Ethical Sourcing</span>
                  <span className={`material-symbols-outlined select-none transition-transform duration-300 ${openSection === "sourcing" ? "rotate-180" : ""}`}>
                    expand_more
                  </span>
                </button>
                {openSection === "sourcing" && (
                  <div className="pt-4 pb-6 text-xs text-on-surface-variant font-light leading-relaxed space-y-2">
                    <p>Each mineral specimen is ethically tracked through transparent mine-to-market protocols. Transparent sourcing coordinates allow local artisanal empowerment across India and certified global mining communities.</p>
                  </div>
                )}
              </div>

              {/* Packing */}
              <div>
                <button
                  onClick={() => setOpenOpenSection(openSection === "shipping" ? null : "shipping")}
                  className="w-full border-b border-primary/10 pb-4 flex justify-between items-center text-left py-2 hover:text-[#8f4c30]"
                >
                  <span className="font-serif text-lg text-primary">Shipping & Heritage Packaging</span>
                  <span className={`material-symbols-outlined select-none transition-transform duration-300 ${openSection === "shipping" ? "rotate-180" : ""}`}>
                    expand_more
                  </span>
                </button>
                {openSection === "shipping" && (
                  <div className="pt-4 pb-6 text-xs text-on-surface-variant font-light leading-relaxed space-y-2">
                    <p>Delivered via complimentary, fully insured priority security courier. Every piece arrives embedded safely within our heritage, velvet-lined dark plum gemstone case accented by signature bronze certificate registries.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* You Might Also Love Section */}
        <section className="mt-32">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-2">
              <h2 className="font-headline text-3xl md:text-4xl text-primary italic">You Might Also Love</h2>
              <p className="text-on-surface-variant/60 tracking-widest uppercase text-xs font-sans">Curated complements for your collection</p>
            </div>
            <Link
              to="/shop"
              className="text-secondary font-bold tracking-widest uppercase text-xs border-b border-secondary pb-1 hover:text-primary transition-colors font-sans"
            >
              View All Curations
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {complements.map((c) => (
              <div key={c.id} className="group space-y-4 flex flex-col h-full justify-between">
                <div className="aspect-[3/4] bg-surface-container overflow-hidden rounded-xl relative border border-primary/5">
                  <img
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src={c.images[0]}
                  />
                  <button
                    onClick={() => navigate(`/shop/${c.id}`)}
                    className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity p-2 cursor-pointer text-primary hover:text-secondary flex items-center justify-center shadow-lg"
                    aria-label="Add complement to cart"
                  >
                    <span className="material-symbols-outlined text-sm select-none">visibility</span>
                  </button>
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg text-primary">{c.name}</h3>
                  <p className="text-on-surface-variant font-sans text-sm">${c.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};
