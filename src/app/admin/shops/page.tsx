"use client";

import { useEffect, useState } from "react";

interface ShopData {
  id: string;
  name: string;
  messages_used: number;
  messages_limit: number;
  bot_active: boolean;
  platform: string;
  created_at: string;
  profiles?: { name: string; email: string };
}

export default function AdminShopsPage() {
  const [shops, setShops] = useState<ShopData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await fetch("/api/shops");
        const data = await res.json();
        if (Array.isArray(data)) setShops(data);
      } catch {
        // ignore
      }
      setLoading(false);
    };
    fetchShops();
  }, []);

  const filteredShops = shops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shop.profiles?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleBot = async (shopId: string, current: boolean) => {
    setToggling(shopId);
    try {
      await fetch(`/api/shops/${shopId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bot_active: !current }),
      });
      setShops((prev) => prev.map((s) => s.id === shopId ? { ...s, bot_active: !current } : s));
    } catch {
      // ignore
    }
    setToggling(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Shops</h1>
          <p className="mt-1 text-sm text-text-secondary">Manage all registered shops and their accounts.</p>
        </div>
      </div>

      <div className="max-w-md">
        <input type="text" placeholder="Search by shop or owner name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
      </div>

      {loading ? (
        <p className="text-sm text-text-muted text-center py-8">Loading shops...</p>
      ) : filteredShops.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-8">No shops found. Run the SQL seed script first.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredShops.map((shop) => (
            <div key={shop.id} className="bg-surface-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-600">
                    {shop.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{shop.name}</h3>
                    <p className="text-xs text-text-muted">{shop.profiles?.name || "\u2014"}</p>
                  </div>
                </div>
                <button onClick={() => handleToggleBot(shop.id, shop.bot_active)} disabled={toggling === shop.id}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full transition-colors ${
                    shop.bot_active ? "bg-accent-50 text-accent-600 hover:bg-accent-100" : "bg-red-50 text-red-500 hover:bg-red-100"
                  } disabled:opacity-50`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${shop.bot_active ? "bg-accent-500" : "bg-red-500"}`} />
                  {toggling === shop.id ? "..." : shop.bot_active ? "Active" : "Inactive"}
                </button>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">Platform</span>
                  <span className="font-medium text-text-primary capitalize">{shop.platform}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">Messages</span>
                  <span className="font-medium text-text-primary">{shop.messages_used} / {shop.messages_limit}</span>
                </div>
                <div className="w-full bg-surface rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${(shop.messages_used / shop.messages_limit) > 0.9 ? "bg-amber-500" : "bg-primary-500"}`}
                    style={{ width: `${Math.min((shop.messages_used / shop.messages_limit) * 100, 100)}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">Contact</span>
                  <span className="font-medium text-text-primary">{shop.profiles?.email || "\u2014"}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">Joined</span>
                  <span className="font-medium text-text-primary">{new Date(shop.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <a href={`/dashboard/settings`} className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-text-secondary hover:bg-surface transition-colors text-center">View Details</a>
                <button onClick={() => handleToggleBot(shop.id, shop.bot_active)}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors">
                  {shop.bot_active ? "Disable Bot" : "Enable Bot"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
