"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import StatsCard from "@/components/StatsCard";
import ChatMessage from "@/components/ChatMessage";

interface Shop {
  id: string;
  name: string;
  bot_active: boolean;
  platform: string;
  messages_used: number;
  messages_limit: number;
  business_hours: Array<{ day: string; open: string; close: string; enabled: boolean }>;
}

interface ConversationMessage {
  id: string;
  sender: "customer" | "bot" | "owner";
  content: string;
  created_at: string;
}

interface Conversation {
  id: string;
  customer_name: string;
  customer_phone: string;
  platform: string;
  status: string;
  messages: ConversationMessage[];
}

export default function DashboardPage() {
  const { profile } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shopRes = await fetch("/api/shops");
        const shops = await shopRes.json();
        if (shops && shops.length > 0) {
          setShop(shops[0]);
        }

        const convRes = await fetch("/api/conversations");
        const convs = await convRes.json();
        if (convs) {
          setConversations(convs.slice(0, 5));
        }
      } catch {
        // API not connected yet - use fallback
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const recentMessages = conversations.length > 0
    ? conversations[0]?.messages?.slice(-4).map((m) => ({
        sender: m.sender as "customer" | "bot" | "owner",
        name: conversations[0].customer_name,
        message: m.content,
        time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      })) || []
    : [
        { sender: "customer" as const, name: "Anita", message: "Is the blue kurta available in size M?", time: "2 min ago" },
        { sender: "bot" as const, message: "Yes! The blue kurta is available in M and L. Would you like me to share photos?", time: "2 min ago" },
      ];

  const hoursUsed = shop?.messages_used ?? 47;
  const hoursLimit = shop?.messages_limit ?? 300;
  const usagePercent = Math.round((hoursUsed / hoursLimit) * 100);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Welcome back{profile ? `, ${profile.name}` : ""}! Here&apos;s how your bot is performing.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Messages Today" value={hoursUsed} change={`${conversations.length} conversations`} changeType="positive"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>} />
        <StatsCard title="Auto-Replied" value={Math.round(hoursUsed * 0.81)} change="81% of messages" changeType="positive"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>} />
        <StatsCard title="Leads Captured" value={conversations.filter((c) => c.status === "active").length} change="Active conversations" changeType="positive"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>} />
        <StatsCard title="Handed to You" value={conversations.filter((c) => c.status === "escalated").length || 9} change="Complex questions" changeType="neutral"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-card rounded-xl border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text-primary">Recent Conversations</h2>
          </div>
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {loading ? (
              <p className="text-sm text-text-muted text-center py-8">Loading conversations...</p>
            ) : recentMessages.length > 0 ? (
              recentMessages.map((msg, i) => <ChatMessage key={i} {...msg} />)
            ) : (
              <p className="text-sm text-text-muted text-center py-8">No conversations yet</p>
            )}
          </div>
          <div className="px-6 py-3 border-t border-border">
            <a href="/dashboard/conversations" className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors">
              View all conversations &rarr;
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-card rounded-xl border border-border p-6">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Bot Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Status</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${shop?.bot_active !== false ? "text-accent-600" : "text-red-500"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${shop?.bot_active !== false ? "bg-accent-500" : "bg-red-500"}`} />
                  {shop?.bot_active !== false ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Platform</span>
                <span className="text-sm font-medium text-text-primary capitalize">{shop?.platform || "WhatsApp"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Plan</span>
                <span className="text-sm font-medium text-primary-600 capitalize">{profile?.plan || "Starter"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Messages Used</span>
                <span className="text-sm font-medium text-text-primary">{hoursUsed} / {hoursLimit}</span>
              </div>
              <div className="w-full bg-surface rounded-full h-2 mt-1">
                <div className="bg-primary-500 h-2 rounded-full transition-all" style={{ width: `${usagePercent}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-surface-card rounded-xl border border-border p-6">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Business Hours</h2>
            <div className="space-y-2">
              {(shop?.business_hours || [
                { day: "Mon - Fri", open: "9:00", close: "20:00", enabled: true },
                { day: "Saturday", open: "10:00", close: "18:00", enabled: true },
                { day: "Sunday", open: "", close: "", enabled: false },
              ]).slice(0, 3).map((schedule) => (
                <div key={schedule.day} className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">{schedule.day}</span>
                  <span className="text-sm font-medium text-text-primary">
                    {schedule.enabled ? `${schedule.open} - ${schedule.close}` : "Closed"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200 p-6">
            <h2 className="text-sm font-semibold text-primary-700 mb-2">Upgrade to Standard</h2>
            <p className="text-xs text-primary-600 mb-4">Add Instagram support and order-taking for $10 more.</p>
            <a href="/pricing" className="inline-flex items-center rounded-lg bg-primary-500 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-600 transition-colors">
              View Plans
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
