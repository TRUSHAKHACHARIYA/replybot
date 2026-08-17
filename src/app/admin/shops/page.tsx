"use client";

import { useState } from "react";

const shops = [
  { id: 1, name: "Style Boutique", owner: "Priya Sharma", email: "priya@styleboutique.com", phone: "+91 98765 43210", plan: "Standard", platform: "WhatsApp + Instagram", messages: 847, limit: 800, status: "active", joined: "Jan 15, 2026" },
  { id: 2, name: "Glow Salon", owner: "Meera Joshi", email: "meera@glowsalon.com", phone: "+91 87654 32109", plan: "Growth", platform: "WhatsApp + Instagram", messages: 1203, limit: 2000, status: "active", joined: "Dec 3, 2025" },
  { id: 3, name: "Fresh Bakes", owner: "Ankit Patel", email: "ankit@freshbakes.com", phone: "+91 76543 21098", plan: "Starter", platform: "WhatsApp", messages: 234, limit: 300, status: "active", joined: "Feb 20, 2026" },
  { id: 4, name: "FitZone Gym", owner: "Raj Kumar", email: "raj@fitzone.in", phone: "+91 65432 10987", plan: "Standard", platform: "WhatsApp + Instagram", messages: 567, limit: 800, status: "trial", joined: "Jul 28, 2026" },
  { id: 5, name: "The Craft Studio", owner: "Neha Gupta", email: "neha@craftstudio.com", phone: "+91 54321 09876", plan: "Starter", platform: "WhatsApp", messages: 89, limit: 300, status: "trial", joined: "Aug 10, 2026" },
];

export default function AdminShopsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredShops = shops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Shops</h1>
          <p className="mt-1 text-sm text-text-secondary">Manage all registered shops and their accounts.</p>
        </div>
        <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 transition-colors">
          + Add Shop
        </button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <input
          type="text"
          placeholder="Search by shop or owner name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      {/* Shop cards */}
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
                  <p className="text-xs text-text-muted">{shop.owner}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                shop.status === "active" ? "text-accent-600" : "text-amber-600"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  shop.status === "active" ? "bg-accent-500" : "bg-amber-500"
                }`} />
                {shop.status === "active" ? "Active" : "Trial"}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Plan</span>
                <span className={`font-medium px-2 py-0.5 rounded-full ${
                  shop.plan === "Growth" ? "bg-accent-50 text-accent-600" :
                  shop.plan === "Standard" ? "bg-primary-50 text-primary-600" :
                  "bg-surface text-text-secondary"
                }`}>
                  {shop.plan}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Platform</span>
                <span className="font-medium text-text-primary">{shop.platform}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Messages</span>
                <span className="font-medium text-text-primary">{shop.messages} / {shop.limit}</span>
              </div>
              <div className="w-full bg-surface rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    (shop.messages / shop.limit) > 0.9 ? "bg-amber-500" : "bg-primary-500"
                  }`}
                  style={{ width: `${Math.min((shop.messages / shop.limit) * 100, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Contact</span>
                <span className="font-medium text-text-primary">{shop.email}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Joined</span>
                <span className="font-medium text-text-primary">{shop.joined}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-text-secondary hover:bg-surface transition-colors">
                View Details
              </button>
              <button className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors">
                Manage Bot
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
