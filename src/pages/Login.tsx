/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types";

type LoginMode = "signin" | "signup" | "forgot" | "reset";

interface AuthResponse {
  user: User;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

async function parseJsonSafely(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function getErrorMessage(response: Response, fallback: string) {
  const data = (await parseJsonSafely(response)) as ApiErrorResponse | null;
  return data?.error || data?.message || fallback;
}

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("redirect") || "/";
  }, [location.search]);

  const [mode, setMode] = useState<LoginMode>("signin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const clearNotices = () => {
    setErr("");
    setMsg("");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setErr("Please enter your email and password.");
      return;
    }

    setLoading(true);
    clearNotices();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Invalid email or password."));
      }

      const data = (await response.json()) as AuthResponse;
      login(data.user);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setErr("Name, email, and password are required.");
      return;
    }

    setLoading(true);
    clearNotices();

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          type: "VERIFY_EMAIL",
        }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Failed to send verification OTP."));
      }

      setOtpSent(true);
      setMsg("A 6-digit verification code has been sent to your email.");
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Failed to send verification OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code) {
      setErr("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    clearNotices();

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          code,
        }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "OTP verification failed."));
      }

      const data = (await response.json()) as AuthResponse;
      login(data.user);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErr(error instanceof Error ? error.message : "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setErr("Please enter your registered email.");
      return;
    }

    setLoading(true);
    clearNotices();

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Unable to send reset code."));
      }

      setMode("reset");
      setMsg("A password reset code has been sent to your email.");
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Unable to send reset code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || !newPassword) {
      setErr("Please enter the reset code and your new password.");
      return;
    }

    setLoading(true);
    clearNotices();

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          code,
          newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Password reset failed."));
      }

      setMode("signin");
      setCode("");
      setNewPassword("");
      setMsg("Password reset successful. Please sign in with your new password.");
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-bright font-body text-on-surface-variant selection:bg-primary-fixed selection:text-primary">
      <main className="flex min-h-screen flex-col overflow-hidden md:flex-row">
        <section className="relative h-64 w-full overflow-hidden bg-surface-container md:h-screen md:w-1/2">
          <div className="absolute inset-0 z-0">
            <img
              className="h-full w-full object-cover"
              alt="Macro photography of raw amethysts"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBXgHAhHsRNDtiMLH3NYbx2gZxAxwCy32_lRV2NZcNfqr0YdiIBKvBdCrTKcep8yVUX_Uj3Zr3aqvlhGcx-bk4xiMup6aeL72-m4iq9eXgVrSxMrDEkSq54wnVvZ2KUJraRGjJKHNW8XnSNocBhUBQerAYwHVR0tcGjfYt0oFi5S698NsijFQ_o7xvt29TGCZPgzKZyHmHKDKtP7423mSDe0fHvJeHXHtMlRwsVMlOb5x4b3dbuVRvs4UMIz9mtiD3WnmOaKQiHmjK"
            />
            <div className="absolute inset-0 bg-primary-container/20 mix-blend-multiply" />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-between p-12 text-surface-bright md:p-20">
            <div>
              <h1 className="font-headline text-4xl italic leading-tight tracking-widest md:text-5xl">
                RoshGems
              </h1>
              <p className="mt-4 font-sans text-sm uppercase tracking-[0.2em] opacity-80">
                The Digital Atélier
              </p>
            </div>
            <div className="hidden max-w-md md:block">
              <p className="font-headline text-2xl italic leading-relaxed">
                "Every gemstone tells a story, whispered through light and time."
              </p>
              <div className="mt-8 h-px w-16 bg-surface-bright/40" />
            </div>
          </div>
        </section>

        <section className="flex min-h-screen w-full items-center justify-center bg-surface-container-lowest p-8 md:w-1/2 md:p-12">
          <div className="w-full max-w-md space-y-12">
            {err && (
              <div className="border-l-4 border-red-400 bg-red-50 p-4 font-sans text-xs text-red-700">
                {err}
              </div>
            )}

            {msg && (
              <div className="border-l-4 border-[#8f4c30] bg-emerald-50 p-4 font-sans text-xs text-secondary">
                {msg}
              </div>
            )}

            {(mode === "signin" || mode === "signup") && (
              <div className="flex gap-8 border-b border-outline-variant/30 font-sans">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setOtpSent(false);
                    clearNotices();
                  }}
                  className={`cursor-pointer pb-4 text-sm uppercase tracking-widest transition-all ${
                    mode === "signin"
                      ? "border-b-2 border-primary-container font-bold text-primary-container"
                      : "text-on-surface-variant/60 hover:text-primary-container"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setOtpSent(false);
                    clearNotices();
                  }}
                  className={`cursor-pointer pb-4 text-sm uppercase tracking-widest transition-all ${
                    mode === "signup"
                      ? "border-b-2 border-primary-container font-bold text-primary-container"
                      : "text-on-surface-variant/60 hover:text-primary-container"
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {mode === "signin" && (
              <form onSubmit={handleSignIn} className="space-y-8 font-sans">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/70">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-0 border-b border-outline-variant bg-transparent py-3 font-body outline-none transition-all placeholder:text-on-surface-variant/30 focus:border-primary-container focus:ring-0"
                    placeholder="curator@roshgems.com"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-end justify-between">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/70">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        clearNotices();
                      }}
                      className="select-none text-[10px] font-bold uppercase tracking-[0.1em] text-secondary transition-colors hover:text-primary-container"
                    >
                      Forgotten?
                    </button>
                  </div>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-0 border-b border-outline-variant bg-transparent py-3 font-body outline-none transition-all placeholder:text-on-surface-variant/30 focus:border-primary-container focus:ring-0"
                    placeholder="••••••••"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="editorial-shadow group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-container py-5 text-xs font-bold uppercase tracking-[0.3em] text-on-primary transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Verifying..." : "Enter Atélier"}
                    <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </form>
            )}

            {mode === "signup" && (
              <form
                onSubmit={otpSent ? handleVerifySignupOtp : handleRequestSignupOtp}
                className="space-y-8 font-sans"
              >
                {!otpSent ? (
                  <>
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/70">
                        First & Last Name
                      </label>
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border-0 border-b border-outline-variant bg-transparent py-3 outline-none transition-all placeholder:text-on-surface-variant/30 focus:border-primary-container focus:ring-0"
                        placeholder="Evelyn Thorne"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/70">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-0 border-b border-outline-variant bg-transparent py-3 outline-none transition-all placeholder:text-on-surface-variant/30 focus:border-primary-container focus:ring-0"
                        placeholder="evelyn@roshgems.com"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/70">
                        Mobile Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border-0 border-b border-outline-variant bg-transparent py-3 outline-none transition-all placeholder:text-on-surface-variant/30 focus:border-primary-container focus:ring-0"
                        placeholder="+91 99999 88888"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/70">
                        Desired Password
                      </label>
                      <input
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border-0 border-b border-outline-variant bg-transparent py-3 outline-none transition-all placeholder:text-on-surface-variant/30 focus:border-primary-container focus:ring-0"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="editorial-shadow flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-container py-5 text-xs font-bold uppercase tracking-[0.3em] text-on-primary transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {loading ? "Sending OTP..." : "Request Email OTP"}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1 text-center">
                      <p className="text-xs italic text-secondary">
                        Email verification code sent to {email}.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f4c30]">
                        Verification Code
                      </label>
                      <input
                        required
                        type="text"
                        inputMode="numeric"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="w-full border-0 border-b border-secondary bg-transparent py-3 text-center font-serif text-3xl font-bold tracking-[0.5em] text-primary placeholder:text-on-surface-variant/20 focus:ring-0"
                        placeholder="••••••"
                        maxLength={6}
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="rounded-xl border border-primary/20 px-6 py-5 text-xs font-bold uppercase tracking-widest hover:bg-surface-container"
                      >
                        Edit Details
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-grow rounded-xl bg-primary-container py-5 text-xs font-bold uppercase tracking-widest text-on-primary shadow-xl transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {loading ? "Validating..." : "Verify & Complete Signup"}
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}

            {mode === "forgot" && (
              <form onSubmit={handleForgotPassword} className="space-y-8 font-sans">
                <div>
                  <h3 className="font-serif text-xl italic text-primary">Recover Atélier Access</h3>
                  <p className="mt-2 text-xs text-on-surface-variant">
                    Enter your registered email and we&apos;ll send a reset code.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/70">
                    Registered Email
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-0 border-b border-outline-variant bg-transparent py-3 outline-none focus:ring-0"
                    placeholder="curator@roshgems.com"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      clearNotices();
                    }}
                    className="rounded-xl border border-primary/10 px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-grow rounded-xl bg-[#31032c] py-4 text-xs font-bold uppercase tracking-widest text-white shadow-md hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Sending..." : "Send Reset Code"}
                  </button>
                </div>
              </form>
            )}

            {mode === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-8 font-sans">
                <div>
                  <h3 className="text-xl font-serif italic text-[#31032c]">Set New Password</h3>
                  <p className="mt-2 text-xs text-on-surface-variant">
                    Enter the reset code and your new password.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-outline">
                    Verification Code
                  </label>
                  <input
                    required
                    type="text"
                    inputMode="numeric"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full border-0 border-b border-outline-variant bg-transparent py-3 text-center text-xl font-bold tracking-[0.3em] focus:ring-0"
                    placeholder="••••••"
                    maxLength={6}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-outline">
                    New Password
                  </label>
                  <input
                    required
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border-0 border-b border-outline-variant bg-transparent py-3 focus:border-primary-container focus:ring-0"
                    placeholder="••••••••"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-primary-container py-5 text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Resetting..." : "Commit Secure Change"}
                  </button>
                </div>
              </form>
            )}

            <div className="relative flex select-none items-center gap-4 font-sans">
              <div className="h-px flex-grow bg-outline-variant/30" />
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/40">
                Secure Sign In
              </span>
              <div className="h-px flex-grow bg-outline-variant/30" />
            </div>

            <p className="px-8 text-center font-sans text-[10px] leading-relaxed text-on-surface-variant/50">
              By accessing the atélier, you agree to our{" "}
              <Link
                to="/refund-policy"
                className="cursor-pointer underline decoration-outline-variant/50 underline-offset-4 hover:text-secondary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy-policy"
                className="cursor-pointer underline decoration-outline-variant/50 underline-offset-4 hover:text-secondary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};