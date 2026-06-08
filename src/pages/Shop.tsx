/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Product } from "../types";
import { ProductCard } from "../components/ProductCard";

export const Shop: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const activeStone = searchParams.get("stone") || "ALL";
  const activeSort = searchParams.get("sort") || "featured";

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const res = await fetch("/api/products", {
          headers: { Accept: "application/json" },
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load catalogue.");
        }

        const list = Array.isArray(data) ? data : data?.products || [];
        const safeList: Product[] = Array.isArray(list) ? list : [];

        if (!isMounted) return;
        setAllProducts(safeList);
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to load products from API.", error);
        setAllProducts([]);
        setErrorMsg(
          error instanceof Error ? error.message : "Failed to load catalogue."
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const products = useMemo(() => {
    let filtered = [...allProducts];

    if (activeStone !== "ALL") {
      filtered = filtered.filter(
        (p) => p.stoneType?.toUpperCase() === activeStone.toUpperCase()
      );
    }

    if (activeSort === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (activeSort === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      filtered.sort((a, b) => {
        const aFeatured = a.isFeatured ? 1 : 0;
        const bFeatured = b.isFeatured ? 1 : 0;
        if (bFeatured !== aFeatured) return bFeatured - aFeatured;
        return a.name.localeCompare(b.name);
      });
    }

    return filtered;
  }, [allProducts, activeStone, activeSort]);

  const availableStoneFilters = useMemo(() => {
    const uniqueStoneTypes = Array.from(
      new Set(
        allProducts
          .map((p) => p.stoneType)
          .filter((value): value is string => Boolean(value?.trim()))
      )
    );

    const dynamicFilters = uniqueStoneTypes
      .sort((a, b) => a.localeCompare(b))
      .map((stone) => ({
        label: stone.charAt(0).toUpperCase() + stone.slice(1).toLowerCase(),
        value: stone.toUpperCase(),
      }));

    return [{ label: "All Stones", value: "ALL" }, ...dynamicFilters];
  }, [allProducts]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    setSearchParams(next);
  };

  const handleStoneFilter = (stoneName: string) => {
    updateParam("stone", stoneName);
  };

  const handleSortChange = (sortVal: string) => {
    updateParam("sort", sortVal);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased">
      <header className="mx-auto w-full max-w-[1920px] px-6 pb-12 pt-20 md:px-12">
        <nav className="mb-8 flex items-center text-[10px] font-medium uppercase tracking-[0.2em] text-on-surface-variant/60 font-sans">
          <Link to="/" className="cursor-pointer hover:text-secondary">
            Home
          </Link>
          <span className="mx-3 opacity-30">/</span>
          <span className="text-on-surface-variant">Collections</span>
        </nav>

        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h1 className="font-headline text-5xl italic leading-[1.1] tracking-tight text-primary-container md:text-7xl">
              All Gemstones
            </h1>
            <p className="mt-6 font-headline text-base italic leading-relaxed text-on-surface-variant/80 md:text-lg">
              A curated anthology of Earth&apos;s rarest planetary treasures,
              ethically sourced and hand-selected for exceptional refraction and
              crystalline character.
            </p>
          </div>
        </div>
      </header>

      <section className="sticky top-[80px] z-40 w-full border-y border-[#31032c]/10 bg-[#fcf9f4]/95 px-6 py-4 backdrop-blur-md md:px-12">
        <div className="mx-auto flex max-w-[1920px] flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-2.5">
            {availableStoneFilters.map((s) => {
              const active = activeStone === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => handleStoneFilter(s.value)}
                  className={`cursor-pointer rounded-none border px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                    active
                      ? "border-[#31032c] bg-[#31032c] text-[#fcf9f4]"
                      : "border-[#31032c]/10 bg-[#fcf9f4] text-[#4f434b]/80 hover:border-[#31032c]/40 hover:text-[#31032c]"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-6 font-sans text-[10px] md:text-sm">
            <div className="flex items-center gap-2 font-medium text-[#4f434b]/60">
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Sort By:
              </span>
              <select
                value={activeSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="cursor-pointer border-none bg-transparent px-2 py-0 pr-8 text-[10px] font-bold uppercase tracking-widest text-[#8f4c30] focus:ring-0 md:text-xs"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-[1920px] px-6 py-16 md:px-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-[#8f4c30]" />
            <p className="mt-4 font-serif italic text-primary">
              Calling Atelier Catalogue...
            </p>
          </div>
        ) : errorMsg ? (
          <div className="mx-auto max-w-lg rounded-xl bg-surface-container p-12 text-center">
            <h3 className="mb-2 font-serif text-2xl italic text-primary-container">
              Catalogue Unavailable
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-on-surface-variant">
              {errorMsg}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="cursor-pointer rounded-lg bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-white"
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-xl bg-surface-container p-12 text-center">
            <h3 className="mb-2 font-serif text-2xl italic text-primary-container">
              Pardon us, Traveler
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-on-surface-variant">
              No live specimens currently match this stone filter.
            </p>
            <button
              type="button"
              onClick={() => handleStoneFilter("ALL")}
              className="cursor-pointer rounded-lg bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-white"
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

export default Shop;