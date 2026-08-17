"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-text-primary">ReplyBot</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-sm font-medium text-text-secondary hover:text-primary-500 transition-colors">Features</Link>
            <Link href="/#how-it-works" className="text-sm font-medium text-text-secondary hover:text-primary-500 transition-colors">How It Works</Link>
            <Link href="/pricing" className="text-sm font-medium text-text-secondary hover:text-primary-500 transition-colors">Pricing</Link>
            <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-primary-500 transition-colors">Log In</Link>
            <Link href="/signup" className="inline-flex items-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 transition-colors">
              Start Free Trial
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors">
            <svg className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/#features" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface">Features</Link>
            <Link href="/#how-it-works" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface">How It Works</Link>
            <Link href="/pricing" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface">Pricing</Link>
            <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface">Log In</Link>
            <Link href="/signup" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-semibold text-white bg-primary-500 text-center">Start Free Trial</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
