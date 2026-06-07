/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Address } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  addresses: Address[];
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  sendOtp: (email: string, type: "VERIFY_EMAIL" | "RESET_PASSWORD") => Promise<void>;
  verifyOtp: (payload: { name: string; email: string; passwordHash: string; phone?: string; code: string }) => Promise<User>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPasswordHash: string) => Promise<void>;
  loadAddresses: () => Promise<Address[]>;
  addAddress: (address: Omit<Address, "id" | "userId">) => Promise<Address>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<Address>;
  deleteAddress: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        // Backend either returns user object directly, or { user }
        const authenticatedUser = data.user !== undefined ? data.user : data;
        if (authenticatedUser && authenticatedUser.id) {
          setUser(authenticatedUser);
          await loadAddresses();
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("Auth check failed", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, passwordHash: string): Promise<User> => {
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: passwordHash }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Login credentials invalid.");
    }

    const data = await res.json();
    const authenticatedUser = data.user !== undefined ? data.user : data;
    setUser(authenticatedUser);
    await loadAddresses();
    return authenticatedUser;
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setAddresses([]);
  };

  const sendOtp = async (email: string, type: "VERIFY_EMAIL" | "RESET_PASSWORD") => {
    const endpoint = type === "VERIFY_EMAIL" ? "/api/auth/send-otp" : "/api/auth/forgot-password";
    const body = type === "VERIFY_EMAIL" ? { email, type } : { email };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "OTP delivery failed.");
    }
  };

  const verifyOtp = async (payload: {
    name: string;
    email: string;
    passwordHash: string;
    phone?: string;
    code: string;
  }): Promise<User> => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        password: payload.passwordHash,
        phone: payload.phone || "",
        code: payload.code, // Backend expects "code"
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "OTP verification failed.");
    }

    const data = await res.json();
    const authenticatedUser = data.user !== undefined ? data.user : data;
    setUser(authenticatedUser);
    await loadAddresses();
    return authenticatedUser;
  };

  const forgotPassword = async (email: string) => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Request failed.");
    }
  };

  const resetPassword = async (email: string, code: string, newPasswordHash: string) => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp: code,  // or code wait, server.ts accepts otp inside reset-password: const { email, otp, newPassword } = req.body;
        newPassword: newPasswordHash
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Password reset failed.");
    }
  };

  const loadAddresses = async (): Promise<Address[]> => {
    try {
      const res = await fetch("/api/user/addresses");
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.addresses || []);
        setAddresses(list);
        return list;
      }
    } catch (e) {
      console.error("Failed to load addresses", e);
    }
    return [];
  };

  const addAddress = async (addressData: Omit<Address, "id" | "userId">): Promise<Address> => {
    const res = await fetch("/api/user/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addressData),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to create address.");
    }

    const newAddr = await res.json();
    await loadAddresses();
    return newAddr;
  };

  const updateAddress = async (id: string, addressData: Partial<Address>): Promise<Address> => {
    const res = await fetch(`/api/user/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addressData),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to update address.");
    }

    const updated = await res.json();
    await loadAddresses();
    return updated;
  };

  const deleteAddress = async (id: string): Promise<void> => {
    const res = await fetch(`/api/user/addresses/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to delete address.");
    }

    await loadAddresses();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        addresses,
        checkAuth,
        login,
        logout,
        sendOtp,
        verifyOtp,
        forgotPassword,
        resetPassword,
        loadAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
