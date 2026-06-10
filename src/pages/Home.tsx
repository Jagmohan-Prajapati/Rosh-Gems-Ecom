/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Product } from "../types";
import image1 from "../assets/Emerald.jpg";
import image2 from "../assets/Ruby.jpg";
import image3 from "../assets/Sapphire.jpg";
import image4 from "../assets/citrine.jpg";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

type StoneCard = {
  name: string;
  category: string;
  image: string;
};

type BlogCard = {
  id: string;
  title: string;
  summary: string;
  image: string;
};

const STONE_CARDS: StoneCard[] = [
  {
    name: "Emerald",
    category: "Emerald",
    image:image1,
  },
  {
    name: "Ruby",
    category: "Ruby",
    image:image2,
  },
  {
    name: "Sapphire",
    category: "Sapphire",
    image:image3,
  },
  {
    name: "Citrine",
    category: "Citrine",
    image:image4,
  },
];

const BLOG_CARDS: BlogCard[] = [
  {
    id: "journal-1",
    title: "How to Choose a Gemstone That Holds Value",
    summary:
      "Understand cut, origin, clarity, certification, and rarity before you invest in a fine gemstone piece.",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "journal-2",
    title: "Ethical Sourcing and the Modern Jewelry Collector",
    summary:
      "Why traceability, responsible mining, and craftsmanship matter more than ever in luxury gemstone curation.",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=80",
  },
];

const FALLBACK_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAdxLOp7YYH--7HraJPEGWnnobgM9CU4CckIPS9tdpv8W80yA4P7Eio5HBlO2ZkBJuWLEGdKD0WMduCXWbo1E0oLfXkdLEOVf5LLHZD7iIjbi-vGO0GSrxZQuyJ64bVbvleOS6Hp0n1mh4i5EON9MTIhQ58w5HtvyDCJ1ohKDjSEky2nioWCUriAi1mZDtC8wGbTnUm8qnLaesJm4IBPzomEKBQKDLVUC5-S9JCfNTr9xzdA1JCyy2T2PSEXTgI2hPoio3qVVn3zGEC";

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoadingFeatured(true);

      try {
        const res = await fetch("/api/products", {
          headers: { Accept: "application/json" },
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load featured products.");
        }

        const list = Array.isArray(data) ? data : data?.products || [];
        const safeList = Array.isArray(list) ? list : [];

        if (isMounted) {
          setProducts(safeList);
        }
      } catch (error) {
        console.error("Failed to load homepage products.", error);
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoadingFeatured(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const featured = useMemo(() => {
    const featuredProducts = products.filter((p) => p.isFeatured);
    if (featuredProducts.length >= 4) return featuredProducts.slice(0, 4);
    return products.slice(0, 4);
  }, [products]);

  return (
    <div className="bg-surface text-on-surface antialiased">
      <section className="grid min-h-[800px] grid-cols-1 md:grid-cols-2 lg:min-h-[870px]">
        <div className="relative flex items-center justify-center overflow-hidden border-r border-[#31032c]/10 bg-[#f0ede9] p-6 md:p-12">
          <div className="h-full max-h-[716px] w-full rotate-[-1deg] scale-105 transform overflow-hidden rounded-none border border-[#31032c]/15 bg-white p-2.5 shadow-2xl transition-all duration-700 hover:rotate-0 hover:scale-100">
            <img
              className="h-full w-full object-cover"
              alt="Deep cushion cut purple amethyst gemstone on dark velvet background"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuASxpbUrvTffyrxwT1QXTDVHArw70kmm-ry3E3eH9V1pGDK8lVMP64vLthc4OAe8T1P_XAyijb5CaIPagHkvdF6Vinn7QHPRkgQ5gDI_2XGDjrXnutFS5YTijABLHg909E7bJYG2dG13FydUauqiqtG8X9w5K0215K8Qq7018GSuS6s3LEYHF2XdW1D65N_KN3KAB2h6H6B-gVKgPvdXWf4_V8HCzvwNPp1cPNW_22Uo5RTQphUAyXPXbemyvpcG1NX36Af6yyTPah9"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center bg-[#fcf9f4] px-6 py-16 md:px-12 md:py-20 lg:px-24">
          <span className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-[#8f4c30] md:text-sm">
            Since 1984
          </span>

          <h1 className="whitespace-pre-line font-serif text-5xl font-light leading-[1.1] tracking-tight text-[#31032c] md:text-6xl lg:text-8xl">
            Rare Gems.{"\n"}
            <span className="font-normal italic">Real Stories.</span>
          </h1>

          <p className="mb-12 mt-8 max-w-md text-base font-light leading-relaxed text-[#4f434b] md:text-lg">
            Every stone is a fragment of geological time, meticulously hand-selected
            and curated for those who seek the extraordinary and honor heritage.
          </p>

          <div>
            <button
              onClick={() => navigate("/shop")}
              className="flex cursor-pointer items-center gap-4 rounded-none bg-[#31032c] px-8 py-4 font-sans text-xs font-semibold uppercase tracking-widest text-[#fcf9f4] transition-colors hover:bg-[#8f4c30] md:px-10 md:py-5 md:text-sm"
            >
              Explore Now
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              >
                <path d="M5 12h12" strokeLinecap="round" strokeLinejoin="round" />
                <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section className="bg-surface-bright py-24">
        <div className="mb-12 px-6 md:px-12">
          <h2 className="font-serif text-3xl tracking-wide text-primary">
            Discover your Essence
          </h2>
        </div>

        <div className="no-scrollbar flex gap-8 overflow-x-auto px-6 pb-8 md:px-12">
          {STONE_CARDS.map((stone) => (
            <button
              key={stone.name}
              type="button"
              onClick={() => navigate(`/shop?stone=${encodeURIComponent(stone.category)}`)}
              className="group w-48 flex-none cursor-pointer text-left"
            >
              <div className="mb-4 aspect-[2/3] overflow-hidden rounded-full border border-[#31032c]/10 bg-white p-2">
                <img
                  className="h-full w-full rounded-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt={`Highly detailed cut ${stone.name} gemstone`}
                  src={stone.image}
                />
              </div>

              <p className="text-center text-xs font-bold uppercase tracking-widest text-[#31032c] transition-colors group-hover:text-[#8f4c30]">
                {stone.name}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="border-y border-[#31032c]/10 bg-[#f0ede9]/40 px-6 py-24 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          <div className="relative lg:col-span-7">
            <div className="relative z-10 overflow-hidden rounded-none border border-[#31032c]/10 bg-white p-3 shadow-xl">
              <img
                className="h-auto w-full object-cover"
                alt="Fine gold jewelry worn by a model in soft natural backlighting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAg2AQUbPIXkkOSPK0Z07q8KaciyT0YlGMcPu8Y0o0Z-u6BcZF2Gf1RKzm-Df4nYeuIUZPvRsgwcq7WX_LVw5foDJnIyjIccXi8O5clljVBVw6HipQBcR8JY5jO8Et_l6Zkla2kv0qMQ1Xa8yyuSc1-5aySqxdXM5SS59WxGEWKbK3-5w-Dbon1XruyLNY0QvimTf2WSxzd485cBR2j28XwSZCxDl8u-HDIU14HbFshTHc9Ugk2vbhyDxEbie95ABdTgtEpMcyntK2y"
              />
            </div>

            <div className="absolute -bottom-12 -right-12 z-20 hidden h-80 w-64 overflow-hidden rounded-none border border-[#31032c]/10 bg-white p-2.5 shadow-2xl lg:block">
              <img
                className="h-full w-full object-cover"
                alt="Handcrafted gold tourmaline ring detail"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_UmYtkisa37HqCjr4pcncH8OXEfIUdG_WZbCmd0onVtNEk24UebHtgGRTf0JIbpa75BuKgm1aQvEBeCS9leGKDIXxy27f0RRLN4uMm7ng8535NbSifZdoJ7Y0fx1q6t9ak2_ZQ9-EMLDcFiSjYvB_KIX-fLLJtibhQ_JxSkzuggR0qO4MAZ27fPG3uh-XZQaedZ5cr2-pvFcj2iVJT8bp7Fm5GqgRvgep1AZxtoZC7Km630sAHISzd1j_8e46K708jb3DyeDpceOT"
              />
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-5">
            <h2 className="font-serif text-4xl leading-tight text-[#31032c] md:text-5xl">
              The Luminous
              <br />
              <span className="italic">Archive</span>
            </h2>

            <p className="border-l border-[#8f4c30] p-4 font-serif text-lg italic leading-relaxed text-[#4f434b] opacity-90 md:text-xl">
              "A collection where every piece is whispered into existence, drawing
              from Victorian elegance and modern minimalism."
            </p>

            <p className="text-sm font-light leading-loose tracking-wide text-[#4f434b]">
              Explore our seasonal curation featuring rare-cut stones and recycled
              18k gold. Each piece is individually numbered and certified by our
              in-house master gemologist.
            </p>

            <Link
              to="/shop"
              className="inline-flex w-max items-center gap-2 border-b border-[#8f4c30]/40 pb-2 font-sans text-xs font-semibold uppercase tracking-widest text-[#8f4c30] transition-all hover:border-[#8f4c30]"
            >
              View Full Collection
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#fcf9f4] py-24">
        <div className="mb-16 flex items-end justify-between px-6 md:px-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8f4c30]">
              Arriving Weekly
            </span>
            <h2 className="mt-2 font-serif text-4xl font-light text-[#31032c]">
              New Treasures
            </h2>
          </div>

          <Link
            to="/shop"
            className="border-b border-[#31032c]/20 pb-1 text-xs font-bold uppercase tracking-widest text-[#4f434b] transition-colors hover:text-[#31032c]"
          >
            Shop All
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 px-6 md:px-12 sm:grid-cols-2 lg:grid-cols-4">
          {loadingFeatured &&
            Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`featured-skeleton-${idx}`}
                className="flex h-full flex-col rounded-none border border-[#31032c]/10 bg-white p-5"
              >
                <div className="mb-6 aspect-square animate-pulse bg-[#f0ede9]" />
                <div className="h-4 w-3/4 animate-pulse bg-[#f0ede9]" />
                <div className="mt-3 h-4 w-1/2 animate-pulse bg-[#f0ede9]" />
                <div className="mt-8 h-4 w-full animate-pulse bg-[#f0ede9]" />
              </div>
            ))}

          {!loadingFeatured &&
            featured.map((p) => (
              <Link
                key={p.id}
                to={`/shop/${p.id}`}
                className="group relative flex h-full flex-col rounded-none border border-[#31032c]/10 bg-white p-5 transition-all duration-500 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#8f4c30] focus:ring-offset-2"
                aria-label={`View details for ${p.name}`}
              >
                <div className="mb-6 aspect-square overflow-hidden rounded-none bg-surface-container/25">
                  <img
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={p.name}
                    src={p.images?.[0] || FALLBACK_IMAGE}
                  />
                </div>

                <div className="flex flex-grow flex-col justify-between">
                  <div>
                    <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-[#31032c]">
                      {p.name}
                    </h3>
                    <p className="mb-4 font-serif text-sm italic text-[#4f434b]/80">
                      {p.stoneColor || p.stoneType || "Fine gemstone"} & 18k Gold
                    </p>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-4">
                    <span className="font-medium tracking-wide text-[#31032c]">
                      {formatPrice(p.price)}
                    </span>

                    <span className="text-xs font-bold uppercase tracking-widest text-[#8f4c30] underline-offset-4 group-hover:underline">
                      Quick Buy
                    </span>
                  </div>
                </div>
              </Link>
            ))}

          {!loadingFeatured && featured.length === 0 && (
            <div className="col-span-full border border-[#31032c]/10 bg-white px-6 py-16 text-center">
              <h3 className="font-serif text-2xl text-[#31032c]">New arrivals coming soon</h3>
              <p className="mt-3 text-sm text-[#4f434b]">
                Your storefront is live, but there are no active featured products yet.
              </p>
              <button
                type="button"
                onClick={() => navigate("/shop")}
                className="mt-6 border border-[#31032c]/20 px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#31032c] transition-colors hover:border-[#31032c] hover:bg-[#f0ede9]"
              >
                Browse Catalogue
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="artistic-dotted-bg border-t border-[#31032c]/10 bg-[#f0ede9]/30 px-6 py-24 md:px-12 lg:px-24">
        <div className="mb-20 flex flex-col items-center text-center">
          <h2 className="mb-6 font-serif text-4xl text-[#31032c] md:text-5xl">
            The Atélier Journal
          </h2>

          <p className="max-w-xl text-xs font-medium uppercase leading-relaxed tracking-[0.2em] text-[#4f434b] md:text-sm">
            Insights into the world of ethically sourced gemstones, planetary
            refractions, and high-jewelry craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {BLOG_CARDS.map((blog) => (
            <div key={blog.id} className="group cursor-pointer">
              <div className="relative mb-8 aspect-video overflow-hidden rounded-none border border-[#31032c]/10 bg-white p-2 shadow-md">
                <img
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  alt={blog.title}
                  src={blog.image}
                />

                <div className="absolute inset-0 flex items-center justify-center bg-[#31032c]/10 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="rounded-none bg-[#31032c] px-6 py-3 font-sans text-xs font-bold uppercase tracking-widest text-[#fcf9f4] shadow-lg hover:bg-[#8f4c30]">
                    Read Article
                  </span>
                </div>
              </div>

              <h3 className="mb-4 font-serif text-[2rem] italic text-[#31032c] transition-colors group-hover:text-[#8f4c30]">
                {blog.title}
              </h3>

              <p className="line-clamp-2 text-sm font-light leading-relaxed text-[#4f434b] opacity-90">
                {blog.summary}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;