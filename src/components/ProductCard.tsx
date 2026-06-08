/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
  index?: number;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const offsetClass = () => {
    switch (index % 4) {
      case 1:
        return "md:mt-12";
      case 2:
        return "";
      case 3:
        return "md:mt-20";
      default:
        return "";
    }
  };

  const productHref = `/shop/${product.id}`;
  const fallbackImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAdxLOp7YYH--7HraJPEGWnnobgM9CU4CckIPS9tdpv8W80yA4P7Eio5HBlO2ZkBJuWLEGdKD0WMduCXWbo1E0oLfXkdLEOVf5LLHZD7iIjbi-vGO0GSrxZQuyJ64bVbvleOS6Hp0n1mh4i5EON9MTIhQ58w5HtvyDCJ1ohKDjSEky2nioWCUriAi1mZDtC8wGbTnUm8qnLaesJm4IBPzomEKBQKDLVUC5-S9JCfNTr9xzdA1JCyy2T2PSEXTgI2hPoio3qVVn3zGEC";

  return (
    <Link
      to={productHref}
      aria-label={`View details for ${product.name}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-none border border-[#31032c]/10 bg-white shadow-[0_12px_32px_rgba(49,3,44,0.03)] transition-all duration-500 hover:border-[#8f4c30]/30 hover:shadow-[0_24px_48px_rgba(143,76,48,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8f4c30] focus-visible:ring-offset-2 ${offsetClass()}`}
    >
      <div className="relative aspect-square overflow-hidden bg-surface-container/25">
        <img
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt={product.name}
          src={product.images?.[0] || fallbackImage}
          loading="lazy"
        />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#31032c]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="inline-block translate-y-4 bg-[#31032c] px-6 py-2.5 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#fcf9f4] shadow-md transition-transform duration-500 group-hover:translate-y-0">
            Quick View
          </span>
        </div>

        {product.isFeatured && (
          <div className="absolute left-4 top-4 bg-[#fcf9f4]/95 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#8f4c30] shadow-sm">
            Featured
          </div>
        )}
      </div>

      <div className="flex flex-grow flex-col justify-between p-8 text-center">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f4c30]">
            {product.stoneType || "Gemstone"}
          </p>

          <h3 className="mb-4 font-headline text-[1.75rem] italic leading-tight text-[#31032c]">
            {product.name}
          </h3>

          {product.category && (
            <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-[#4f434b]/60">
              {product.category}
            </p>
          )}
        </div>

        <div>
          <p className="mb-6 font-medium tracking-wide text-[#4f434b]">
            From {formatPrice(product.price)}
          </p>

          <span className="inline-block border-b border-secondary/0 pb-1 font-sans text-xs font-bold uppercase tracking-widest text-[#8f4c30] transition-all group-hover:border-[#8f4c30]">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;