"use client";

import { useState } from "react";

const mockConversations = [
  {
    id: 1,
    customer: "Anita Kumar",
    platform: "WhatsApp",
    lastMessage: "Is the blue kurta available in size M?",
    time: "2 min ago",
    status: "active",
    unread: 2,
  },
  {
    id: 2,
    customer: "Rahul Verma",
    platform: "Instagram",
    lastMessage: "What are your store timings for Saturday?",
    time: "15 min ago",
    status: "resolved",
    unread: 0,
  },
  {
    id: 3,
    customer: "Sneha Patel",
    platform: "WhatsApp",
    lastMessage: "Can you deliver to Andheri West?",
    time: "1 hour ago",
    status: "escalated",
    unread: 1,
  },
  {
    id: 4,
    customer: "Vikram Singh",
    platform: "WhatsApp",
    lastMessage: "I'd like to place an order for 3 kurtas",
    time: "2 hours ago",
    status: "active",
    unread: 0,
  },
  {
    id: 5,
    customer: "Deepa Nair",
    platform: "Instagram",
    lastMessage: "Do you have the green lehenga in stock?",
    time: "3 hours ago",
    status: "resolved",
    unread: 0,
  },
  {
    id: 6,
    customer: "Arjun Mehta",
    platform: "WhatsApp",
    lastMessage: "What payment methods do you accept?",
    time: "5 hours ago",
    status: "resolved",
    unread: 0,
  },
];

const chatHistory = [
  { sender: "customer" as const, name: "Anita", message: "Hi! Do you have the blue kurta?", time: "10:32 AM" },
  { sender: "bot" as const, message: "Hello Anita! Yes, we have the blue kurta in stock. Would you like to know the price and available sizes?", time: "10:32 AM" },
  { sender: "customer" as const, name: "Anita", message: "Yes please, what sizes do you have?", time: "10:33 AM" },
  { sender: "bot" as const, message: "The blue kurta is available in S, M, L, and XL. It's priced at $25. Would you like to place an order?", time: "10:33 AM" },
  { sender: "customer" as const, name: "Anita", message: "Is the blue kurta available in size M?", time: "10:35 AM" },
];

export default function ConversationsPage() {
  const [selected, setSelected] = useState(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Conversations</h1>
        <p className="mt-1 text-sm text-text-secondary">View and manage all customer conversations.</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        {["All", "Active", "Escalated", "Resolved"].map((filter) => (
          <button
            key={filter}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === "All"
                ? "bg-primary-500 text-white"
                : "bg-surface-card border border-border text-text-secondary hover:bg-surface"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: "calc(100vh - 220px)" }}>
        {/* Conversation list */}
        <div className="bg-surface-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div className="divide-y divide-border max-h-[calc(100vh-320px)] overflow-y-auto">
            {mockConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelected(conv.id)}
                className={`w-full text-left p-4 hover:bg-surface transition-colors ${
                  selected === conv.id ? "bg-primary-50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">{conv.customer}</span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        conv.platform === "WhatsApp" ? "bg-green-50 text-green-600" : "bg-purple-50 text-purple-600"
                      }`}>
                        {conv.platform}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-text-secondary truncate">{conv.lastMessage}</p>
                    <p className="mt-1 text-[10px] text-text-muted">{conv.time}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {conv.unread > 0 && (
                      <span className="h-5 w-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                    <span className={`h-2 w-2 rounded-full ${
                      conv.status === "active" ? "bg-accent-500" :
                      conv.status === "escalated" ? "bg-amber-500" :
                      "bg-text-muted"
                    }`} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat view */}
        <div className="lg:col-span-2 bg-surface-card rounded-xl border border-border flex flex-col">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Anita Kumar</h3>
              <p className="text-xs text-text-muted">WhatsApp &bull; Active now</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-50 text-accent-600 hover:bg-accent-100 transition-colors">
                Mark Resolved
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors">
                Escalate
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {chatHistory.map((msg, i) => {
              const isBot = msg.sender === "bot";
              return (
                <div key={i} className={`flex gap-3 ${isBot ? "" : "flex-row-reverse"}`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                    isBot ? "bg-primary-100 text-primary-600" : "bg-surface text-text-secondary"
                  }`}>
                    {isBot ? "AI" : msg.name?.charAt(0)}
                  </div>
                  <div className={`max-w-[70%] ${isBot ? "" : "text-right"}`}>
                    <div className={`inline-block rounded-2xl px-4 py-2.5 text-sm ${
                      isBot ? "bg-primary-50 text-text-primary" : "bg-surface text-text-primary"
                    }`}>
                      {msg.message}
                    </div>
                    <p className="mt-1 text-xs text-text-muted">{msg.time}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-6 py-4 border-t border-border">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Type a reply..."
                className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
