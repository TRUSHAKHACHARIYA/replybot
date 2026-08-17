"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    password: "",
    phone: "",
    niche: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = signup(formData);
      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Signup failed");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - illustration */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-50 to-primary-100 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="h-24 w-24 rounded-2xl bg-accent-500/10 flex items-center justify-center mx-auto mb-8">
            <svg className="h-12 w-12 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-4">
            Start your free 7-day trial
          </h3>
          <p className="text-text-secondary">
            Set up your AI auto-responder in under 24 hours. No credit card required.
          </p>
          <div className="mt-8 space-y-3 text-left">
            {["Instant WhatsApp & Instagram setup", "Custom answers for your business", "Cancel anytime, no lock-in"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <svg className="h-5 w-5 text-accent-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-sm text-text-secondary">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-text-primary">ReplyBot</span>
          </Link>
          <h2 className="text-2xl font-bold text-text-primary">Create your account</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Get your shop&apos;s auto-responder running in minutes.
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="shopName" className="block text-sm font-medium text-text-primary">Shop Name</label>
              <input
                id="shopName"
                name="shopName"
                type="text"
                required
                value={formData.shopName}
                onChange={handleChange}
                className="mt-2 block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="e.g. Style Boutique"
              />
            </div>

            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-text-primary">Your Name</label>
              <input
                id="ownerName"
                name="ownerName"
                type="text"
                required
                value={formData.ownerName}
                onChange={handleChange}
                className="mt-2 block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="e.g. Priya Sharma"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-2 block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-text-primary">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="mt-2 block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label htmlFor="niche" className="block text-sm font-medium text-text-primary">Business Type</label>
              <select
                id="niche"
                name="niche"
                required
                value={formData.niche}
                onChange={handleChange}
                className="mt-2 block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Select your business type</option>
                <option value="boutique">Clothing Boutique</option>
                <option value="salon">Salon / Spa</option>
                <option value="bakery">Bakery / Home Food</option>
                <option value="gym">Gym / Coaching</option>
                <option value="retail">Small Retail</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-2 block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="At least 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Start Free Trial"}
            </button>

            <p className="text-xs text-text-muted text-center">
              By signing up, you agree to our{" "}
              <Link href="#" className="text-primary-500 hover:text-primary-600">Terms of Service</Link>
              {" "}and{" "}
              <Link href="#" className="text-primary-500 hover:text-primary-600">Privacy Policy</Link>.
            </p>
          </form>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary-500 hover:text-primary-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
