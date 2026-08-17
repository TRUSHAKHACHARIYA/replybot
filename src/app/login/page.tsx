"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      if (result.success && result.redirect) {
        router.push(result.redirect);
      } else {
        setError(result.error || "Login failed");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - form */}
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
          <h2 className="text-2xl font-bold text-text-primary">Welcome back</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Sign in to manage your shop&apos;s auto-responder.
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
              <label htmlFor="email" className="block text-sm font-medium text-text-primary">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-border text-primary-500 focus:ring-primary-500" />
                <span className="text-sm text-text-secondary">Remember me</span>
              </label>
              <Link href="#" className="text-sm font-medium text-primary-500 hover:text-primary-600">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-surface border border-border p-4">
            <p className="text-xs font-semibold text-text-primary mb-2">Test Credentials:</p>
            <div className="space-y-1 text-xs text-text-secondary">
              <p><span className="font-medium text-text-primary">Admin:</span> admin@replybot.com / admin123</p>
              <p><span className="font-medium text-text-primary">Shop Owner:</span> priya@styleboutique.com / shop123</p>
              <p><span className="font-medium text-text-primary">Shop Owner:</span> meera@glowsalon.com / shop123</p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary-500 hover:text-primary-600">
              Start free trial
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - illustration */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-50 to-primary-100 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="h-24 w-24 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-8">
            <svg className="h-12 w-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-4">
            Your AI assistant for WhatsApp & Instagram
          </h3>
          <p className="text-text-secondary">
            Manage your auto-responder, view conversations, and track performance — all from one dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
