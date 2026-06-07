/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Product } from "../types";
import { ProductCard } from "../components/ProductCard";
import { SAMPLE_PRODUCTS } from "../lib/gemData";

export const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Active stone type filter
  const activeStone = searchParams.get("stone") || "ALL";
  const activeSort = searchParams.get("sort") || "featured";

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Build dynamic API path
      let url = "/api/products?";
      if (activeStone !== "ALL") {
        url += `stoneType=${activeStone}&`;
      }
      if (activeSort === "price-asc") {
        url += "sort=price_asc&";
      } else if (activeSort === "price-desc") {
        url += "sort=price_desc&";
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.products || []);
        if (list.length > 0) {
          setProducts(list);
        } else {
          // If database is empty, search locally on default data
          let filtered = [...SAMPLE_PRODUCTS];
          if (activeStone !== "ALL") {
            filtered = filtered.filter(p => p.stoneType === activeStone.toUpperCase());
          }
          if (activeSort === "price-asc") {
            filtered.sort((a, b) => a.price - b.price);
          } else if (activeSort === "price-desc") {
            filtered.sort((a, b) => b.price - a.price);
          }
          setProducts(filtered);
        }
      } else {
        // Fallback local filtering
        let filtered = [...SAMPLE_PRODUCTS];
        if (activeStone !== "ALL") {
          filtered = filtered.filter(p => p.stoneType === activeStone.toUpperCase());
        }
        if (activeSort === "price-asc") {
          filtered.sort((a, b) => a.price - b.price);
        } else if (activeSort === "price-desc") {
          filtered.sort((a, b) => b.price - a.price);
        }
        setProducts(filtered);
      }
    } catch {
      // Offline fallback
      let filtered = [...SAMPLE_PRODUCTS];
      if (activeStone !== "ALL") {
        filtered = filtered.filter(p => p.stoneType === activeStone.toUpperCase());
      }
      if (activeSort === "price-asc") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (activeSort === "price-desc") {
        filtered.sort((a, b) => b.price - a.price);
      }
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeStone, activeSort]);

  const handleStoneFilter = (stoneName: string) => {
    searchParams.set("stone", stoneName);
    setSearchParams(searchParams);
  };

  const handleSortChange = (sortVal: string) => {
    searchParams.set("sort", sortVal);
    setSearchParams(searchParams);
  };

  const stoneFilters = [
    { label: "All Stones", value: "ALL" },
    { label: "Emerald", value: "EMERALD" },
    { label: "Sapphire", value: "SAPPHIRE" },
    { label: "Ruby", value: "RUBY" },
    { label: "Amethyst", value: "AMETHYST" },
    { label: "Aquamarine", value: "AQUAMARINE" },
  ];

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen">
      {/* Header Section */}
      <header className="w-full px-6 md:px-12 pt-20 pb-12 max-w-[1920px] mx-auto">
        <nav className="flex mb-8 text-[10px] tracking-[0.2em] uppercase font-medium text-on-surface-variant/60 font-sans">
          <span className="hover:text-secondary cursor-pointer">Home</span>
          <span className="mx-3 opacity-30">/</span>
          <span className="text-on-surface-variant">Collections</span>
        </nav>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-headline italic tracking-tight text-primary-container leading-[1.1]">
              All Gemstones
            </h1>
            <p className="mt-6 text-base md:text-lg font-headline italic text-on-surface-variant/80 leading-relaxed">
              An curated anthology of Earth's rarest planetary treasures, ethically sourced and hand-selected for their exceptional refraction and soulful crystalline character.
            </p>
          </div>
        </div>
      </header>

      {/* Sticky Filter Bar */}
      <section className="sticky top-[80px] z-40 w-full bg-[#fcf9f4]/95 backdrop-blur-md px-6 md:px-12 py-4 border-y border-[#31032c]/10">
        <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-6">
          {/* Stone Categories */}
          <div className="flex flex-wrap items-center gap-2.5">
            {stoneFilters.map((s) => {
              const active = activeStone === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => handleStoneFilter(s.value)}
                  className={`px-5 py-2.5 rounded-none text-[10px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer border ${
                    active
                      ? "bg-[#31032c] text-[#fcf9f4] border-[#31032c]"
                      : "bg-[#fcf9f4] text-[#4f434b]/80 border-[#31032c]/10 hover:border-[#31032c]/40 hover:text-[#31032c]"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Sorter Widgets */}
          <div className="flex items-center gap-6 font-sans text-[10px] md:text-sm">
            <div className="flex items-center gap-2 cursor-pointer text-[#4f434b]/60 font-medium">
              <span className="tracking-widest uppercase text-[10px] font-bold">Sort By:</span>
              <select
                value={activeSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-transparent border-none font-bold uppercase tracking-widest text-[#8f4c30] py-0 px-2 pr-8 focus:ring-0 cursor-pointer text-[10px] md:text-xs"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <main className="w-full px-6 md:px-12 py-16 max-w-[1920px] mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="material-symbols-outlined text-4xl animate-spin text-[#8f4c30] select-none">
              progress_activity
            </span>
            <p className="mt-4 font-serif italic text-primary">Calling Atélier Catalog...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-surface-container rounded-xl p-12 max-w-lg mx-auto">
            <span className="material-symbols-outlined text-4xl text-[#8f4c30] mb-4 select-none">sentiment_neutral</span>
            <h3 className="font-serif italic text-2xl text-primary-container mb-2">Pardon us, Traveler</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              All specimens of this stone type are currently matching with private patrons in our London atelier.
            </p>
            <button
              onClick={() => handleStoneFilter("ALL")}
              className="px-6 py-3 bg-primary text-white rounded-lg text-xs font-bold tracking-widest uppercase cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="masonry-grid pb-24">
            {products.map((prod, idx) => (
              <ProductCard key={prod.id} product={prod} index={idx} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
