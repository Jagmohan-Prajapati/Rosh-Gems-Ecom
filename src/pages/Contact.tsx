/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";

export const Contact: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setError("Please complete all required fields.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Replace this with your real API call when ready.
      // Example:
      // const res = await fetch("/api/contact", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json", Accept: "application/json" },
      //   credentials: "include",
      //   body: JSON.stringify({
      //     name: trimmedName,
      //     email: trimmedEmail,
      //     message: trimmedMessage,
      //   }),
      // });
      //
      // if (!res.ok) throw new Error("Failed to submit inquiry.");

      await new Promise((resolve) => setTimeout(resolve, 500));

      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError("We could not dispatch your inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface antialiased">
      <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
        <header className="mb-20 text-center max-w-3xl mx-auto space-y-6">
          <span className="font-label uppercase tracking-[0.3em] text-secondary text-xs font-bold block">
            Bespoke Commissions
          </span>

          <h1 className="text-5xl md:text-7xl font-serif text-[#31032c] tracking-tight leading-tight">
            Consult the Atélier
          </h1>

          <div className="h-px w-24 bg-secondary mx-auto mt-6" />

          <p className="text-on-surface-variant text-base md:text-lg italic font-serif leading-relaxed">
            Whether seeking a GIA investment appraisal, selecting a raw specimen,
            or commissioning a bespoke engagement ring, our chief curators are
            available for private consultations.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-stretch">
          <div className="lg:col-span-5 bg-[#f0ede9] p-10 md:p-12 rounded-none border border-[#31032c]/10 flex flex-col justify-between space-y-12">
            <div>
              <h2 className="text-3xl font-serif text-[#31032c] mb-8 font-light">
                Atélier Coordinates
              </h2>

              <div className="space-y-8 font-sans text-sm text-[#4f434b] leading-relaxed">
                <div>
                  <p className="font-bold text-[#8f4c30] uppercase tracking-widest text-[10px] mb-2">
                    London Showroom
                  </p>
                  <p>72 Heritage Lane, Mayfair</p>
                  <p>London, W1S 2YG</p>
                  <p className="text-[#31032c] font-semibold mt-2">
                    london@roshgems.com
                  </p>
                </div>

                <div>
                  <p className="font-bold text-[#8f4c30] uppercase tracking-widest text-[10px] mb-2">
                    New York Office
                  </p>
                  <p>242 Central Park West</p>
                  <p>New York, NY 10024</p>
                  <p className="text-[#31032c] font-semibold mt-2">
                    nyc@roshgems.com
                  </p>
                </div>

                <div>
                  <p className="font-bold text-[#8f4c30] uppercase tracking-widest text-[10px] mb-2">
                    Concierge Helpline
                  </p>
                  <p>Live Curator Assistance: Monday - Friday (9AM - 6PM GMT)</p>
                  <p className="font-bold text-[#31032c] mt-1">
                    +44 20 7946 0123
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#fcf9f4] rounded-none border border-[#31032c]/10 flex items-start gap-4 font-sans select-none">
              <div className="mt-0.5 flex h-6 w-6 items-center justify-center text-[#8f4c30]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2l7 3v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V5l7-3Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m9.5 12 1.8 1.8L15 10.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <p className="text-[10px] text-[#4f434b]/80 leading-relaxed uppercase tracking-wider font-bold">
                Consultations are entirely confidential. Virtual high-definition
                specimen viewings are available on demand.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-10 md:p-12 rounded-none border border-[#31032c]/10 shadow-sm font-sans">
            <h2 className="text-3xl font-serif text-[#31032c] mb-2 font-light">
              Inquire Online
            </h2>

            <p className="text-[#4f434b]/80 text-sm italic mb-10 font-serif">
              A senior gemologist will respond within 24 hours.
            </p>

            {submitted ? (
              <div className="bg-[#f0ede9] border-l-4 border-[#8f4c30] p-8 text-[#31032c] rounded-none space-y-3 font-serif">
                <h3 className="text-2xl italic font-bold">
                  Inquiry Dispatched Successfully
                </h3>

                <p className="text-sm font-sans tracking-wide leading-relaxed">
                  Thank you for your inquiry. Our curators are reviewing your
                  request and will contact you directly.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="pt-2 text-xs uppercase tracking-[0.2em] font-bold text-[#8f4c30] hover:text-[#31032c] transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 font-sans">
                {error && (
                  <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#4f434b]/65 font-bold">
                    Your Designation (Name)
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent border-t-0 border-x-0 border-b border-[#31032c]/20 py-3 focus:outline-none focus:border-secondary transition-colors text-sm font-body font-semibold text-[#31032c]"
                    placeholder="Evelyn Montgomery"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#4f434b]/65 font-bold">
                    SMTP Email Coordinate
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-t-0 border-x-0 border-b border-[#31032c]/20 py-3 focus:outline-none focus:border-secondary transition-colors text-sm font-body font-semibold text-[#31032c]"
                    placeholder="evelyn@manor.com"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#4f434b]/65 font-bold">
                    Proposed Consultation Details
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-transparent border-t-0 border-x-0 border-b border-[#31032c]/20 py-3 focus:outline-none focus:border-secondary transition-colors text-sm font-serif italic text-[#31032c] resize-none"
                    placeholder="Describe the nature of the GIA tourmaline proposal, carat focus, or design legacy..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#31032c] hover:bg-[#8f4c30] disabled:opacity-60 disabled:cursor-not-allowed text-white py-5 rounded-none font-bold tracking-[0.2em] uppercase text-xs shadow-md transition-all cursor-pointer font-sans"
                >
                  {isSubmitting ? "Dispatching Inquiry..." : "Dispatch Atélier Inquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;