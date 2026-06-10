/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  createdAt?: string | Date;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
  createdAt?: string | Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stoneType: string;
  stoneColor: string;
  caratWeight?: number;
  origin?: string;
  certification?: string;
  stockQty: number;
  isActive?: boolean;
  isFeatured?: boolean;
  createdAt?: string | Date;
}

export interface OrderItemProduct {
  id?: string;
  name: string;
  images: string[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: OrderItemProduct;
}

export interface OrderShippingAddress {
  label?: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderUserSummary {
  name: string;
  email: string;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | string;

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  currency: string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;
  paymentMethod?: string | null;
  isPaid: boolean;
  paidAt?: string | Date | null;
  trackingId?: string | null;
  trackingUrl?: string | null;
  shippingAddress: OrderShippingAddress;
  createdAt: string | Date;
  user?: OrderUserSummary;
  items?: OrderItem[];
}