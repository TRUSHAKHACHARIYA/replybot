"use client";

import { useEffect, useState, useCallback } from "react";

interface Message {
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
  updated_at: string;
  messages: Message[];
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations");
      const data = await res.json();
      if (Array.isArray(data)) {
        setConversations(data);
        if (data.length > 0 && !selected) {
          setSelected(data[0].id);
          setChatMessages(data[0].messages || []);
        }
      }
    } catch {
      // API not connected
    }
    setLoading(false);
  }, [selected]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  const handleSelect = (conv: Conversation) => {
    setSelected(conv.id);
    setChatMessages(conv.messages || []);
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selected) return;
    setSending(true);
    try {
      const res = await fetch("/api/conversations/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: selected, content: replyText.trim() }),
      });
      if (res.ok) {
        const newMsg: Message = {
          id: `temp-${Date.now()}`,
          sender: "owner",
          content: replyText.trim(),
          created_at: new Date().toISOString(),
        };
        setChatMessages((prev) => [...prev, newMsg]);
        setReplyText("");
      }
    } catch {
      // ignore
    }
    setSending(false);
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selected) return;
    try {
      await fetch(`/api/shops/${selected}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }).catch(() => {});
      setConversations((prev) => prev.map((c) => c.id === selected ? { ...c, status } : c));
    } catch {
      // ignore
    }
  };

  const selectedConv = conversations.find((c) => c.id === selected);

  const filteredConversations = conversations.filter((c) => {
    const matchesFilter = filter === "All" || c.status === filter.toLowerCase();
    const matchesSearch = !search || c.customer_name.toLowerCase().includes(search.toLowerCase()) || c.customer_phone.includes(search);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Conversations</h1>
        <p className="mt-1 text-sm text-text-secondary">View and manage all customer conversations.</p>
      </div>

      <div className="flex items-center gap-3">
        {["All", "Active", "Escalated", "Resolved"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f ? "bg-primary-500 text-white" : "bg-surface-card border border-border text-text-secondary hover:bg-surface"
            }`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: "calc(100vh - 220px)" }}>
        <div className="bg-surface-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <input type="text" placeholder="Search conversations..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
          </div>
          <div className="divide-y divide-border max-h-[calc(100vh-320px)] overflow-y-auto">
            {loading ? (
              <p className="p-8 text-center text-sm text-text-muted">Loading...</p>
            ) : filteredConversations.length === 0 ? (
              <p className="p-8 text-center text-sm text-text-muted">No conversations found</p>
            ) : (
              filteredConversations.map((conv) => (
                <button key={conv.id} onClick={() => handleSelect(conv)}
                  className={`w-full text-left p-4 hover:bg-surface transition-colors ${selected === conv.id ? "bg-primary-50" : ""}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-primary">{conv.customer_name || conv.customer_phone}</span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          conv.platform === "whatsapp" ? "bg-green-50 text-green-600" : "bg-purple-50 text-purple-600"
                        }`}>{conv.platform}</span>
                      </div>
                      <p className="mt-1 text-xs text-text-secondary truncate">{conv.messages?.[0]?.content || "No messages"}</p>
                      <p className="mt-1 text-[10px] text-text-muted">{new Date(conv.updated_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`h-2 w-2 rounded-full ${
                      conv.status === "active" ? "bg-accent-500" : conv.status === "escalated" ? "bg-amber-500" : "bg-text-muted"
                    }`} />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-surface-card rounded-xl border border-border flex flex-col">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">{selectedConv?.customer_name || "Select a conversation"}</h3>
              <p className="text-xs text-text-muted">{selectedConv ? `${selectedConv.platform} \u2022 ${selectedConv.status}` : ""}</p>
            </div>
            {selectedConv && (
              <div className="flex items-center gap-2">
                <button onClick={() => handleUpdateStatus("resolved")}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-50 text-accent-600 hover:bg-accent-100 transition-colors">Mark Resolved</button>
                <button onClick={() => handleUpdateStatus("escalated")}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors">Escalate</button>
              </div>
            )}
          </div>

          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {chatMessages.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-8">Select a conversation to view messages</p>
            ) : (
              chatMessages.map((msg) => {
                const isBot = msg.sender === "bot";
                const isOwner = msg.sender === "owner";
                return (
                  <div key={msg.id} className={`flex gap-3 ${isBot || isOwner ? "" : "flex-row-reverse"}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                      isBot ? "bg-primary-100 text-primary-600" : isOwner ? "bg-amber-100 text-amber-600" : "bg-surface text-text-secondary"
                    }`}>{isBot ? "AI" : isOwner ? "You" : (selectedConv?.customer_name?.charAt(0) || "C")}</div>
                    <div className={`max-w-[70%] ${isBot || isOwner ? "" : "text-right"}`}>
                      <div className={`inline-block rounded-2xl px-4 py-2.5 text-sm ${
                        isBot ? "bg-primary-50 text-text-primary" : isOwner ? "bg-amber-50 text-text-primary" : "bg-surface text-text-primary"
                      }`}>{msg.content}</div>
                      <p className="mt-1 text-xs text-text-muted">{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="px-6 py-4 border-t border-border">
            <div className="flex gap-3">
              <input type="text" placeholder="Type a reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
              <button onClick={handleSendReply} disabled={sending || !replyText.trim()}
                className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors disabled:opacity-50">
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
