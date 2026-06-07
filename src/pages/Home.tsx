/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { SAMPLE_BLOGS, SAMPLE_STONES, SAMPLE_PRODUCTS } from "../lib/gemData";

export const Home: React.FC = () => {
  const navigate = useNavigate();

  // Pick first 4 featured items
  const featured = SAMPLE_PRODUCTS.slice(4, 8);

  return (
    <div className="bg-surface text-on-surface antialiased">
      {/* Split Hero Section */}
      <section className="min-h-[800px] lg:min-h-[870px] grid grid-cols-1 md:grid-cols-2">
        <div className="bg-[#f0ede9] flex items-center justify-center p-6 md:p-12 overflow-hidden relative border-r border-[#31032c]/10">
          <div className="w-full h-full max-h-[716px] rounded-none overflow-hidden shadow-2xl scale-105 transform rotate-[-1deg] transition-all duration-700 hover:rotate-0 hover:scale-100 p-2.5 bg-white border border-[#31032c]/15">
            <img
              className="w-full h-full object-cover"
              alt="Deep cushion cut purple amethyst gemstone on dark velvet background"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuASxpbUrvTffyrxwT1QXTDVHArw70kmm-ry3E3eH9V1pGDK8lVMP64vLthc4OAe8T1P_XAyijb5CaIPagHkvdF6Vinn7QHPRkgQ5gDI_2XGDjrXnutFS5YTijABLHg909E7bJYG2dG13FydUauqiqtG8X9w5K0215K8Qq7018GSuS6s3LEYHF2XdW1D65N_KN3KAB2h6H6B-gVKgPvdXWf4_V8HCzvwNPp1cPNW_22Uo5RTQphUAyXPXbemyvpcG1NX36Af6yyTPah9"
            />
          </div>
        </div>
        <div className="bg-[#fcf9f4] flex flex-col justify-center px-6 md:px-12 lg:px-24 py-16 md:py-20">
          <span className="font-label uppercase tracking-[0.3em] text-[#8f4c30] text-xs md:text-sm mb-6 font-bold">
            Since 1984
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-8xl leading-[1.1] mb-8 text-[#31032c] tracking-tight font-serif whitespace-pre-line font-light">
            Rare Gems.{"\n"}<span className="italic font-normal">Real Stories.</span>
          </h1>
          <p className="text-[#4f434b] text-base md:text-lg max-w-md leading-relaxed mb-12 font-light">
            Every stone is a fragment of geological time, meticulously hand-selected and curated for those who seek the extraordinary and honor heritage.
          </p>
          <div>
            <button
              onClick={() => navigate("/shop")}
              className="bg-[#31032c] text-[#fcf9f4] px-8 md:px-10 py-4 md:py-5 rounded-none font-semibold tracking-widest flex items-center gap-4 hover:bg-[#8f4c30] transition-colors cursor-pointer font-sans text-xs md:text-sm uppercase"
            >
              Explore Now
              <span className="material-symbols-outlined text-sm select-none">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Shop by Stone - Oval Cards */}
      <section className="py-24 bg-surface-bright">
        <div className="px-6 md:px-12 mb-12">
          <h2 className="text-3xl tracking-wide text-primary font-serif">Discover your Essence</h2>
        </div>
        <div className="flex gap-8 overflow-x-auto px-6 md:px-12 no-scrollbar pb-8">
          {SAMPLE_STONES.map((stone) => (
            <div
              key={stone.name}
              onClick={() => navigate(`/shop?stone=${stone.category}`)}
              className="flex-none w-48 group cursor-pointer"
            >
              <div className="aspect-[2/3] rounded-full overflow-hidden mb-4 border border-[#31032c]/10 p-2 bg-white">
                <img
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-700"
                  alt={`Highly detailed cut ${stone.name} gemstone`}
                  src={stone.image}
                />
              </div>
              <p className="text-center font-label text-xs uppercase tracking-widest text-[#31032c] group-hover:text-[#8f4c30] transition-colors font-bold">
                {stone.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Collection - Asymmetric Editorial */}
      <section className="py-24 bg-[#f0ede9]/40 px-6 md:px-12 lg:px-24 border-y border-[#31032c]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 relative">
            <div className="relative z-10 rounded-none overflow-hidden shadow-xl border border-[#31032c]/10 p-3 bg-white">
              <img
                className="w-full h-auto object-cover"
                alt="Fine gold jewelry worn by a model in soft natural backlighting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAg2AQUbPIXkkOSPK0Z07q8KaciyT0YlGMcPu8Y0o0Z-u6BcZF2Gf1RKzm-Df4nYeuIUZPvRsgwcq7WX_LVw5foDJnIyjIccXi8O5clljVBVw6HipQBcR8JY5jO8Et_l6Zkla2kv0qMQ1Xa8yyuSc1-5aySqxdXM5SS59WxGEWKbK3-5w-Dbon1XruyLNY0QvimTf2WSxzd485cBR2j28XwSZCxDl8u-HDIU14HbFshTHc9Ugk2vbhyDxEbie95ABdTgtEpMcyntK2y"
              />
            </div>
            <div className="absolute -bottom-12 -right-12 w-64 h-80 z-20 hidden lg:block rounded-none overflow-hidden shadow-2xl border border-[#31032c]/10 p-2.5 bg-white">
              <img
                className="w-full h-full object-cover"
                alt="Handcrafted gold tourmaline ring detail"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_UmYtkisa37HqCjr4pcncH8OXEfIUdG_WZbCmd0onVtNEk24UebHtgGRTf0JIbpa75BuKgm1aQvEBeCS9leGKDIXxy27f0RRLN4uMm7ng8535NbSifZdoJ7Y0fx1q6t9ak2_ZQ9-EMLDcFiSjYvB_KIX-fLLJtibhQ_JxSkzuggR0qO4MAZ27fPG3uh-XZQaedZ5cr2-pvFcj2iVJT8bp7Fm5GqgRvgep1AZxtoZC7Km630sAHISzd1j_8e46K708jb3DyeDpceOT"
              />
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-8">
            <h2 className="text-4xl md:text-5xl leading-tight text-[#31032c] font-serif">
              The Luminous<br /><span className="italic">Archive</span>
            </h2>
            <p className="text-[#4f434b] italic font-serif text-lg md:text-xl leading-relaxed opacity-90 border-l p-4 border-[#8f4c30]">
              "A collection where every piece is whispered into existence, drawing from Victorian elegance and modern minimalism."
            </p>
            <p className="text-[#4f434b] text-sm tracking-wide leading-loose font-light">
              Explore our seasonal curation featuring rare-cut stones and recycled 18k gold. Each piece is individually numbered and certified by our in-house master gemologist.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-[#8f4c30] font-semibold uppercase tracking-widest text-xs border-b border-[#8f4c30]/40 pb-2 w-max hover:border-[#8f4c30] transition-all font-sans"
            >
              View Full Collection
            </Link>
          </div>
        </div>
      </section>

      {/* New In Product Strip */}
      <section className="py-24 bg-[#fcf9f4]">
        <div className="px-6 md:px-12 flex justify-between items-end mb-16">
          <div>
            <span className="font-label uppercase tracking-widest text-[#8f4c30] text-xs font-bold">Arriving Weekly</span>
            <h2 className="text-4xl text-[#31032c] mt-2 font-serif font-light">New Treasures</h2>
          </div>
          <Link to="/shop" className="text-[#4f434b] font-label text-xs uppercase tracking-widest hover:text-[#31032c] transition-colors font-bold border-b pb-1 border-[#31032c]/20">
            Shop All
          </Link>
        </div>
        <div className="px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((p) => (
            <div key={p.id} className="group flex flex-col h-full bg-white rounded-none p-5 transition-all duration-500 hover:shadow-xl relative border border-[#31032c]/10">
              <div className="aspect-square rounded-none overflow-hidden bg-surface-container/25 mb-6">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt={p.name}
                  src={p.images[0]}
                />
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-label text-sm uppercase tracking-wider text-[#31032c] font-bold mb-1">{p.name}</h3>
                  <p className="text-[#4f434b]/80 text-sm italic font-serif mb-4">{p.stoneColor} & 18k Gold</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[#31032c] font-medium tracking-wide">${p.price.toLocaleString()}</span>
                  <Link to={`/shop/${p.id}`} className="text-[#8f4c30] text-xs uppercase tracking-widest font-bold hover:underline underline-offset-4 font-sans">
                    Quick Buy
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Journal Section (Editorial with dot patterns) */}
      <section className="py-24 bg-[#f0ede9]/30 artistic-dotted-bg px-6 md:px-12 lg:px-24 border-t border-[#31032c]/10">
        <div className="flex flex-col items-center text-center mb-20">
          <h2 className="text-4xl md:text-5xl text-[#31032c] mb-6 font-serif">The Atélier Journal</h2>
          <p className="text-[#4f434b] max-w-xl font-label text-xs md:text-sm uppercase tracking-[0.2em] font-medium leading-relaxed">
            Insights into the world of ethically sourced gemstones, planetary refractions, and high-jewelry craftsmanship.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {SAMPLE_BLOGS.map((blog) => (
            <div key={blog.id} className="group cursor-pointer">
              <div className="aspect-video rounded-none overflow-hidden mb-8 relative p-2 bg-white border border-[#31032c]/10 shadow-md">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  alt={blog.title}
                  src={blog.image}
                />
                <div className="absolute inset-0 bg-[#31032c]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-[#31032c] text-[#fcf9f4] px-6 py-3 rounded-none text-xs uppercase tracking-widest font-bold font-sans shadow-lg hover:bg-[#8f4c30]">
                    Read Article
                  </span>
                </div>
              </div>
              <h3 className="text-2.5xl text-[#31032c] font-serif italic mb-4 group-hover:text-[#8f4c30] transition-colors">
                {blog.title}
              </h3>
              <p className="text-[#4f434b] leading-relaxed text-sm opacity-90 line-clamp-2 font-light">
                {blog.summary}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
