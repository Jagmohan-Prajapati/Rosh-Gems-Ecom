/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../types";

export interface CartItem {
  productId: string;
  quantity: number;
  metal: string; // e.g. "Rose Gold", "White Gold", "Yellow Gold"
  product: Product;
}

interface CartContextType {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  addToCart: (product: Product, quantity: number, metal: string) => void;
  removeFromCart: (productId: string, metal: string) => void;
  updateQuantity: (productId: string, metal: string, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("roshgems_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("roshgems_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number, metal: string) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.productId === product.id && i.metal === metal
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }
      return [...prev, { productId: product.id, quantity, metal, product }];
    });
  };

  const removeFromCart = (productId: string, metal: string) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.metal === metal)));
  };

  const updateQuantity = (productId: string, metal: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.productId === productId && item.metal === metal) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.20; // 20% VAT as seen in templates
  const total = subtotal + tax;

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        tax,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return context;
};
