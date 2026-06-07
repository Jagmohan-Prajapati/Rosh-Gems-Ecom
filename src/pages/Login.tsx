/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

export const Login: React.FC = () => {
  const { login, sendOtp, verifyOtp, forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Mode: "signin" | "signup" | "forgot" | "reset"
  const [mode, setMode] = useState<"signin" | "signup" | "forgot" | "reset">("signin");

  // Form states
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErr("Please specify email and password coordinates.");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      await login(email, password);
      // Wait, is user admin or regular patron? Redirection depends on role
      navigate("/");
    } catch (e: any) {
      setErr(e.message || "Invalid curator credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password) {
      setErr("Name, email, and password properties are required.");
      return;
    }
    setLoading(true);
    setErr("");
    setMsg("");
    try {
      await sendOtp(email, "VERIFY_EMAIL");
      setOtpSent(true);
      setMsg("OTP code sent to email inbox. Please inspect your inbox.");
    } catch (e: any) {
      setErr(e.message || "Failed to trigger registration PIN.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      setErr("Please enter the 6-digit OTP code received.");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      await verifyOtp({
        name,
        email,
        passwordHash: password,
        phone,
        code,
      });
      navigate("/");
    } catch (e: any) {
      setErr(e.message || "Validation key expired or incorrect.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErr("Email is required to verify identity.");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      await forgotPassword(email);
      setMode("reset");
      setMsg("Recovery code dispatched via SMTP. Inspect your mail.");
    } catch (e: any) {
      setErr(e.message || "Recovery failure.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !newPassword) {
      setErr("Enter the verification matching code and new password pin.");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      await resetPassword(email, code, newPassword);
      setMode("signin");
      setMsg("Password reset successfully. Enter your new credentials.");
    } catch (e: any) {
      setErr(e.message || "Reset request refused.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-bright font-body text-on-surface-variant selection:bg-primary-fixed selection:text-primary">
      <main className="min-h-screen flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Column: Branding Showcase */}
        <section className="relative w-full md:w-1/2 h-64 md:h-screen bg-surface-container overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover"
              alt="Macro photography of raw amethysts"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBXgHAhHsRNDtiMLH3NYbx2gZxAxwCy32_lRV2NZcNfqr0YdiIBKvBdCrTKcep8yVUX_Uj3Zr3aqvlhGcx-bk4xiMup6aeL72-m4iq9eXgVrSxMrDEkSq54wnVvZ2KUJraRGjJKHNW8XnSNocBhUBQerAYwHVR0tcGjfYt0oFi5S698NsijFQ_o7xvt29TGCZPgzKZyHmHKDKtP7423mSDe0fHvJeHXHtMlRwsVMlOb5x4b3dbuVRvs4UMIz9mtiD3WnmOaKQiHmjK"
            />
            <div className="absolute inset-0 bg-primary-container/20 mix-blend-multiply" />
          </div>
          
          <div className="relative z-10 h-full flex flex-col justify-between p-12 md:p-20 text-surface-bright">
            <div>
              <h1 className="text-4xl md:text-5xl font-headline italic tracking-widest leading-tight">
                RoshGems
              </h1>
              <p className="mt-4 font-body text-sm tracking-[0.2em] uppercase opacity-80 font-sans">
                The Digital Atélier
              </p>
            </div>
            <div className="max-w-md hidden md:block">
              <p className="font-headline italic text-2xl leading-relaxed">
                "Every gemstone tells a story, whispered through light and time."
              </p>
              <div className="w-16 h-px bg-surface-bright/40 mt-8" />
            </div>
          </div>
        </section>

        {/* Right Column: Portal Canvas */}
        <section className="w-full md:w-1/2 min-h-screen flex items-center justify-center bg-surface-container-lowest p-8 md:p-12">
          <div className="w-full max-w-md space-y-12">
            
            {/* Notices */}
            {err && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700 text-xs font-sans">
                {err}
              </div>
            )}
            {msg && (
              <div className="bg-emerald-50 border-l-4 border-[#8f4c30] p-4 text-secondary text-xs font-sans">
                {msg}
              </div>
            )}

            {/* Auth Tab selectors (Only displayed in signin/signup tabs) */}
            {(mode === "signin" || mode === "signup") && (
              <div className="flex gap-8 border-b border-outline-variant/30 font-sans">
                <button
                  onClick={() => { setMode("signin"); setErr(""); setMsg(""); }}
                  className={`pb-4 text-sm font-label uppercase tracking-widest transition-all cursor-pointer ${
                    mode === "signin"
                      ? "text-primary-container border-b-2 border-primary-container font-bold"
                      : "text-on-surface-variant/60 hover:text-primary-container"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMode("signup"); setErr(""); setMsg(""); }}
                  className={`pb-4 text-sm font-label uppercase tracking-widest transition-all cursor-pointer ${
                    mode === "signup"
                      ? "text-primary-container border-b-2 border-primary-container font-bold"
                      : "text-on-surface-variant/60 hover:text-primary-container"
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* SIGN IN FORM */}
            {mode === "signin" && (
              <form onSubmit={handleSignIn} className="space-y-8 font-sans">
                <div className="space-y-1">
                  <label className="block text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant/70">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 focus:ring-0 focus:border-primary-container transition-all placeholder:text-on-surface-variant/30 font-body outline-none"
                    placeholder="curator@roshgems.com"
                  />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-end">
                    <label className="block text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant/70">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-[10px] font-label uppercase tracking-[0.1em] text-secondary hover:text-primary-container transition-colors cursor-pointer select-none font-bold"
                    >
                      Forgotten?
                    </button>
                  </div>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 focus:ring-0 focus:border-primary-container transition-all placeholder:text-on-surface-variant/30 font-body outline-none"
                    placeholder="••••••••"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-container text-on-primary py-5 rounded-xl font-label uppercase tracking-[0.3em] text-xs hover:opacity-95 transition-all editorial-shadow flex items-center justify-center gap-2 group cursor-pointer font-bold"
                  >
                    {loading ? "Verifying..." : "Enter Atélier"}
                    <span className="material-symbols-outlined text-sm select-none group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* SIGN UP FORM (Send / Verify OTP flow) */}
            {mode === "signup" && (
              <form onSubmit={otpSent ? handleVerifySignupOtp : handleRequestSignupOtp} className="space-y-8 font-sans">
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
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-3 focus:ring-0 focus:border-primary-container transition-all placeholder:text-on-surface-variant/30 outline-none"
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
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-3 focus:ring-0 focus:border-primary-container transition-all placeholder:text-on-surface-variant/30 outline-none"
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
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-3 focus:ring-0 focus:border-primary-container transition-all placeholder:text-on-surface-variant/30 outline-none"
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
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-3 focus:ring-0 focus:border-primary-container transition-all placeholder:text-on-surface-variant/30 outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-container text-on-primary py-5 rounded-xl font-label uppercase tracking-[0.3em] text-xs hover:opacity-95 transition-all editorial-shadow flex items-center justify-center gap-2 cursor-pointer font-bold animate-pulse"
                      >
                        {loading ? "Sending PIN..." : "Request Email OTP Pin"}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1 text-center">
                      <p className="text-secondary text-xs italic">Email verification PIN dispatched to {email}.</p>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8f4c30] font-bold">
                        Verification Code (OTP)
                      </label>
                      <input
                        required
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-secondary py-3 focus:ring-0 text-center tracking-[0.5em] text-3xl font-serif font-bold text-primary placeholder:text-on-surface-variant/20"
                        placeholder="••••••"
                        maxLength={6}
                      />
                    </div>
                    <div className="pt-4 flex gap-4">
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="px-6 py-5 border border-primary/20 text-xs uppercase tracking-widest rounded-xl hover:bg-surface-container font-bold"
                      >
                        Edit Details
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-grow bg-primary-container text-on-primary py-5 rounded-xl text-xs uppercase tracking-widest font-bold hover:opacity-95 transition-all shadow-xl"
                      >
                        {loading ? "Validating..." : "Verify & Complete Signup"}
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}

            {/* FORGOT PASSWORD FORM */}
            {mode === "forgot" && (
              <form onSubmit={handleForgotPassword} className="space-y-8 font-sans">
                <div>
                  <h3 className="text-xl font-serif italic text-primary">Recover Atélier Access</h3>
                  <p className="text-xs text-on-surface-variant mt-2">Enter your email and we'll dispatch reset coordinates.</p>
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
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 focus:ring-0 outline-none"
                    placeholder="curator@roshgems.com"
                  />
                </div>
                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="px-6 py-4 border border-primary/10 rounded-xl text-xs uppercase tracking-widest text-on-surface-variant hover:bg-surface-container font-bold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-grow bg-[#31032c] text-white py-4 rounded-xl text-xs uppercase tracking-widest font-bold hover:opacity-90 shadow-md"
                  >
                    {loading ? "Triggering PIN..." : "Send Reset Code"}
                  </button>
                </div>
              </form>
            )}

            {/* RESET PASSWORD FORM */}
            {mode === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-8 font-sans">
                <div>
                  <h3 className="text-xl font-serif italic text-[#31032c]">Set New Password</h3>
                  <p className="text-xs text-on-surface-variant mt-2">Enter the verification key received and your new access password.</p>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-outline">
                    Verification Code (OTP)
                  </label>
                  <input
                    required
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 focus:ring-0 text-center text-xl font-bold tracking-[0.3em]"
                    placeholder="••••••"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-outline">
                    New Security Password
                  </label>
                  <input
                    required
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 focus:ring-0 hover:border-primary-container"
                    placeholder="••••••••"
                  />
                </div>
                <div className="pt-4">
                  <button
                    type="text"
                    disabled={loading}
                    className="w-full bg-primary-container text-white py-5 rounded-xl text-xs uppercase tracking-widest font-bold hover:opacity-95 shadow-md"
                  >
                    {loading ? "Resetting..." : "Commit Secure Change"}
                  </button>
                </div>
              </form>
            )}

            {/* Divider */}
            <div className="relative flex items-center gap-4 font-sans select-none">
              <div className="flex-grow h-px bg-outline-variant/30" />
              <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/40">Secure Sign In</span>
              <div className="flex-grow h-px bg-outline-variant/30" />
            </div>

            {/* Footer Note */}
            <p className="text-center text-[10px] font-label leading-relaxed text-on-surface-variant/50 px-8 font-sans">
              By accessing the atélier, you agree to our{" "}
              <span className="underline underline-offset-4 decoration-outline-variant/50 hover:text-secondary cursor-pointer">Terms of Service</span>{" "}
              and{" "}
              <span className="underline underline-offset-4 decoration-outline-variant/50 hover:text-secondary cursor-pointer">Privacy Policy</span>.
            </p>

          </div>
        </section>

      </main>
    </div>
  );
};
