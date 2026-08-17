"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/lib/auth-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile, logout } = useAuth();

  const initials = profile?.shop_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "RB";

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-surface">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-text-primary">ReplyBot</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 rounded-lg bg-accent-50 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-accent-500 animate-pulse" />
                <span className="text-xs font-medium text-accent-600">Bot Active</span>
              </div>
              <button onClick={logout}
                className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-semibold text-primary-600 hover:bg-primary-200 transition-colors"
                title="Log out">
                {initials}
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 lg:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
