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

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  // If the index creates offsets as seen in templates (e.g. mt-12, mt-20, -mt-8), we can reproduce
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

  return (
    <div className={`group relative bg-white rounded-none overflow-hidden border border-[#31032c]/10 hover:border-[#8f4c30]/30 shadow-[0_12px_32px_rgba(49,3,44,0.03)] hover:shadow-[0_24px_48px_rgba(143,76,48,0.08)] transition-all duration-500 flex flex-col h-full ${offsetClass()}`}>
      <div className="relative aspect-square overflow-hidden bg-surface-container/25">
        <img
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt={product.name}
          src={product.images[0] || "https://lh3.googleusercontent.com/aida-public/AB6AXuAdxLOp7YYH--7HraJPEGWnnobgM9CU4CckIPS9tdpv8W80yA4P7Eio5HBlO2ZkBJuWLEGdKD0WMduCXWbo1E0oLfXkdLEOVf5LLHZD7iIjbi-vGO0GSrxZQuyJ64bVbvleOS6Hp0n1mh4i5EON9MTIhQ58w5HtvyDCJ1ohKDjSEky2nioWCUriAi1mZDtC8wGbTnUm8qnLaesJm4IBPzomEKBQKDLVUC5-S9JCfNTr9xzdA1JCyy2T2PSEXTgI2hPoio3qVVn3zGEC"}
        />
        <div className="absolute inset-0 bg-[#31032c]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <Link
            to={`/shop/${product.id}`}
            className="bg-[#31032c] text-[#fcf9f4] px-6 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase shadow-md translate-y-4 group-hover:translate-y-0 transition-transform duration-500 inline-block font-sans hover:bg-[#8f4c30]"
          >
            Quick View
          </Link>
        </div>
      </div>
      <div className="p-8 text-center flex flex-col justify-between flex-grow">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#8f4c30] font-bold mb-2">
            {product.stoneType || "Gemstone"}
          </p>
          <h3 className="text-2.5xl font-headline italic text-[#31032c] mb-4">
            {product.name}
          </h3>
        </div>
        <div>
          <p className="text-[#4f434b] font-medium tracking-wide mb-6">
            From ${product.price.toLocaleString()}
          </p>
          <Link
            to={`/shop/${product.id}`}
            className="text-[#8f4c30] text-xs font-bold tracking-widest uppercase border-b border-secondary/0 hover:border-[#8f4c30] hover:border-b transition-all font-sans inline-block cursor-pointer pb-1"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
