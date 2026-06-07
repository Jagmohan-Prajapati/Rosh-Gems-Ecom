/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface StatusBadgeProps {
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED" | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalized = status.toUpperCase();
  
  switch (normalized) {
    case "COMPLETED":
      return (
        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter inline-block">
          Completed
        </span>
      );
    case "PENDING":
    case "PENDING APPRAISAL":
      return (
        <span className="bg-amber-100 text-amber-800 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter inline-block">
          Pending
        </span>
      );
    case "PROCESSING":
    case "IN ATÉLIER":
      return (
        <span className="bg-primary-container/10 text-primary-container text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter inline-block border border-primary-container/20">
          In Atélier
        </span>
      );
    case "SHIPPED":
    case "TRANSIT":
      return (
        <span className="bg-blue-100 text-blue-800 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter inline-block">
          Shipped
        </span>
      );
    case "CANCELLED":
    default:
      return (
        <span className="bg-stone-100 text-stone-800 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter inline-block">
          {status}
        </span>
      );
  }
};
