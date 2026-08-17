"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface Faq {
  id: string;
  question: string;
  answer: string;
}

interface ShopSettings {
  id: string;
  name: string;
  welcome_message: string;
  after_hours_message: string;
  business_hours: Array<{ day: string; open: string; close: string; enabled: boolean }>;
}

const PLAN_DETAILS = {
  starter: { name: "Starter", price: 15, messages: 300 },
  standard: { name: "Standard", price: 25, messages: 800 },
  growth: { name: "Growth", price: 40, messages: 2000 },
};

export default function SettingsPage() {
  const { profile } = useAuth();
  const [shop, setShop] = useState<ShopSettings | null>(null);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shopRes = await fetch("/api/shops");
        const shops = await shopRes.json();
        if (shops && shops.length > 0) {
          setShop(shops[0]);
        }

        const faqRes = await fetch("/api/faqs");
        const faqData = await faqRes.json();
        if (Array.isArray(faqData)) {
          setFaqs(faqData);
        }
      } catch {
        setShop({
          id: "",
          name: "Style Boutique",
          welcome_message: "Hello! Welcome to Style Boutique. How can I help you today?",
          after_hours_message: "Thanks for reaching out! We're currently closed. We'll get back to you first thing in the morning.",
          business_hours: [
            { day: "Monday", open: "9:00", close: "20:00", enabled: true },
            { day: "Tuesday", open: "9:00", close: "20:00", enabled: true },
            { day: "Wednesday", open: "9:00", close: "20:00", enabled: true },
            { day: "Thursday", open: "9:00", close: "20:00", enabled: true },
            { day: "Friday", open: "9:00", close: "20:00", enabled: true },
            { day: "Saturday", open: "10:00", close: "18:00", enabled: true },
            { day: "Sunday", open: "", close: "", enabled: false },
          ],
        });
        setFaqs([
          { id: "1", question: "What are your store hours?", answer: "We're open Mon-Fri 9AM-8PM, Sat 10AM-6PM. Closed on Sundays." },
          { id: "2", question: "Where is the store located?", answer: "We're at 123 Main Street, near the central market." },
          { id: "3", question: "Do you deliver?", answer: "Yes! Free delivery on orders above $50. Standard delivery fee is $5." },
        ]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSaveShop = async () => {
    if (!shop?.id) return;
    setSaving(true);
    try {
      await fetch(`/api/shops/${shop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: shop.name,
          welcome_message: shop.welcome_message,
          after_hours_message: shop.after_hours_message,
          business_hours: shop.business_hours,
        }),
      });
    } catch {
      // ignore
    }
    setSaving(false);
  };

  const handleAddFaq = async () => {
    if (!shop?.id) return;
    const question = prompt("Enter the question:");
    const answer = prompt("Enter the answer:");
    if (!question || !answer) return;

    try {
      const res = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop_id: shop.id, question, answer }),
      });
      const newFaq = await res.json();
      if (newFaq?.id) {
        setFaqs([...faqs, newFaq]);
      }
    } catch {
      // ignore
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      await fetch(`/api/faqs?id=${id}`, { method: "DELETE" });
      setFaqs(faqs.filter((f) => f.id !== id));
    } catch {
      // ignore
    }
  };

  const currentPlan = (profile?.plan || "starter") as keyof typeof PLAN_DETAILS;
  const planInfo = PLAN_DETAILS[currentPlan];

  if (loading) {
    return (
      <div className="space-y-8 max-w-4xl">
        <div><h1 className="text-2xl font-bold text-text-primary">Settings</h1></div>
        <p className="text-sm text-text-muted">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="mt-1 text-sm text-text-secondary">Configure your bot&apos;s behavior and responses.</p>
      </div>

      {/* Plan */}
      <div className="bg-surface-card rounded-xl border border-border p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Current Plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-text-primary">{planInfo.name} Plan</p>
            <p className="text-sm text-text-secondary">${planInfo.price}/month - {planInfo.messages} messages</p>
          </div>
          <a href="/pricing" className="px-4 py-2 rounded-lg text-sm font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors">
            Upgrade Plan
          </a>
        </div>
      </div>

      {/* General */}
      <div className="bg-surface-card rounded-xl border border-border p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">General</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary">Shop Name</label>
            <input type="text" value={shop?.name || ""} onChange={(e) => shop && setShop({ ...shop, name: e.target.value })}
              className="mt-2 block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary">Welcome Message</label>
            <textarea value={shop?.welcome_message || ""} rows={3} onChange={(e) => shop && setShop({ ...shop, welcome_message: e.target.value })}
              className="mt-2 block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary">After-Hours Message</label>
            <textarea value={shop?.after_hours_message || ""} rows={3} onChange={(e) => shop && setShop({ ...shop, after_hours_message: e.target.value })}
              className="mt-2 block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none" />
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-surface-card rounded-xl border border-border p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Business Hours</h2>
        <div className="space-y-3">
          {(shop?.business_hours || []).map((schedule, idx) => (
            <div key={schedule.day} className="flex items-center gap-4">
              <span className="w-24 text-sm text-text-secondary">{schedule.day}</span>
              <input type="checkbox" checked={schedule.enabled}
                onChange={(e) => {
                  if (!shop) return;
                  const hours = [...shop.business_hours];
                  hours[idx] = { ...hours[idx], enabled: e.target.checked };
                  setShop({ ...shop, business_hours: hours });
                }}
                className="h-4 w-4 rounded border-border text-primary-500 focus:ring-primary-500" />
              {schedule.enabled ? (
                <div className="flex items-center gap-2">
                  <input type="time" value={schedule.open}
                    onChange={(e) => {
                      if (!shop) return;
                      const hours = [...shop.business_hours];
                      hours[idx] = { ...hours[idx], open: e.target.value };
                      setShop({ ...shop, business_hours: hours });
                    }}
                    className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                  <span className="text-sm text-text-muted">to</span>
                  <input type="time" value={schedule.close}
                    onChange={(e) => {
                      if (!shop) return;
                      const hours = [...shop.business_hours];
                      hours[idx] = { ...hours[idx], close: e.target.value };
                      setShop({ ...shop, business_hours: hours });
                    }}
                    className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                </div>
              ) : (
                <span className="text-sm text-text-muted">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-surface-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-primary">FAQ Responses</h2>
          <button onClick={handleAddFaq}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-500 text-white hover:bg-primary-600 transition-colors">
            + Add FAQ
          </button>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="rounded-lg border border-border p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{faq.question}</p>
                  <p className="mt-1 text-sm text-text-secondary">{faq.answer}</p>
                </div>
                <button onClick={() => handleDeleteFaq(faq.id)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-surface transition-colors ml-4">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary border border-border hover:bg-surface transition-colors">Cancel</button>
        <button onClick={handleSaveShop} disabled={saving || !shop?.id}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 transition-colors disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
