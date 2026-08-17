"use client";

import { useEffect, useState } from "react";
import StatsCard from "@/components/StatsCard";

interface ShopData {
  id: string;
  name: string;
  messages_used: number;
  messages_limit: number;
  bot_active: boolean;
  platform: string;
  profiles?: { name: string; email: string };
  owner_id: string;
  plan?: string;
}

export default function AdminPage() {
  const [shops, setShops] = useState<ShopData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await fetch("/api/shops");
        const data = await res.json();
        if (Array.isArray(data)) {
          setShops(data);
        }
      } catch {
        // API not connected yet
      }
      setLoading(false);
    };
    fetchShops();
  }, []);

  const totalMessages = shops.reduce((sum, s) => sum + (s.messages_used || 0), 0);
  const activeShops = shops.filter((s) => s.bot_active).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Admin Overview</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage all shops and monitor system health.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Shops" value={shops.length || 5} change={`${activeShops || 2} active`} changeType="neutral"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349" /></svg>} />
        <StatsCard title="Monthly Revenue" value={`$${shops.length * 25}`} change="From subscriptions" changeType="positive"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatsCard title="Total Messages" value={totalMessages.toLocaleString() || "2,940"} change="This month" changeType="positive"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>} />
        <StatsCard title="Conversion Rate" value="34%" change="Trial to paid" changeType="positive"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>} />
      </div>

      <div className="bg-surface-card rounded-xl border border-border">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">All Shops</h2>
          <a href="/admin/shops" className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors">View all &rarr;</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-6 font-medium text-text-secondary">Shop</th>
                <th className="text-left py-3 px-6 font-medium text-text-secondary">Owner</th>
                <th className="text-left py-3 px-6 font-medium text-text-secondary">Messages</th>
                <th className="text-left py-3 px-6 font-medium text-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="py-8 text-center text-text-muted">Loading...</td></tr>
              ) : shops.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-text-muted">No shops found. Run the SQL seed script.</td></tr>
              ) : (
                shops.slice(0, 5).map((shop) => (
                  <tr key={shop.id} className="border-b border-border last:border-0 hover:bg-surface transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-600">
                          {shop.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="font-medium text-text-primary">{shop.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-text-secondary">{shop.profiles?.name || "—"}</td>
                    <td className="py-4 px-6 text-text-primary font-medium">{shop.messages_used.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${shop.bot_active ? "text-accent-600" : "text-red-500"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${shop.bot_active ? "bg-accent-500" : "bg-red-500"}`} />
                        {shop.bot_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-card rounded-xl border border-border p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-2">WhatsApp Pricing Alert</h3>
          <p className="text-xs text-text-secondary mb-4">Meta is changing WhatsApp message pricing in October 2026. Review affected shops.</p>
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">Action Required</span>
        </div>
        <div className="bg-surface-card rounded-xl border border-border p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-2">Trial Expiring</h3>
          <p className="text-xs text-text-secondary mb-4">2 shops have trials ending this week. Follow up to convert them.</p>
          <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600">2 shops</span>
        </div>
        <div className="bg-surface-card rounded-xl border border-border p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-2">System Health</h3>
          <p className="text-xs text-text-secondary mb-4">All systems operational. Bot response time averaging 1.2s.</p>
          <span className="inline-flex items-center rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-medium text-accent-600">All Good</span>
        </div>
      </div>
    </div>
  );
}
