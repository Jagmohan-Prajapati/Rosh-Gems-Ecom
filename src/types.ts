/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  createdAt?: string;
}

export interface Address {
  id: string;
  userId: string;
  label: string; // e.g. "Home", "Office"
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  refCode?: string; // e.g. "RG-2024-001"
  category: "COLLECTIONS" | "BESPOKE" | "HERITAGE" | string;
  stoneType: "EMERALD" | "SAPPHIRE" | "RUBY" | "DIAMOND" | "AMETHYST" | "AQUAMARINE" | "OPAL" | "MORGANITE" | "TOPAZ" | string;
  stoneColor: string; // e.g. "Peacock Green", "Royal Blue"
  price: number;
  currency?: string; // e.g. "USD", "INR", "EUR", "GBP"
  description: string;
  story?: string;
  images: string[];
  stockQty: number;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number; // Price locked at order time
  product?: {
    name: string;
    images: string[];
  };
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  currency: string;
  shippingAddress: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED" | string;
  isPaid: boolean;
  paidAt?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  trackingId?: string;
  trackingUrl?: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
  items?: OrderItem[];
}
