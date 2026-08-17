"use client";

import { useState } from "react";

const defaultFaqs = [
  { id: 1, question: "What are your store hours?", answer: "We're open Mon-Fri 9AM-8PM, Sat 10AM-6PM. Closed on Sundays." },
  { id: 2, question: "Where is the store located?", answer: "We're at 123 Main Street, near the central market." },
  { id: 3, question: "Do you deliver?", answer: "Yes! Free delivery on orders above $50. Standard delivery fee is $5." },
  { id: 4, question: "What are your prices?", answer: "Kurtas start at $20, sarees from $45, and lehengas from $80. Visit us for the full collection!" },
  { id: 5, question: "Is this item in stock?", answer: "I can check! Please tell me the item name and size you're looking for." },
];

export default function SettingsPage() {
  const faqs = defaultFaqs;
  const [businessName, setBusinessName] = useState("Style Boutique");
  const [welcomeMsg, setWelcomeMsg] = useState("Hello! Welcome to Style Boutique. How can I help you today?");
  const [afterHoursMsg, setAfterHoursMsg] = useState("Thanks for reaching out! We're currently closed. We'll get back to you first thing in the morning.");

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="mt-1 text-sm text-text-secondary">Configure your bot&apos;s behavior and responses.</p>
      </div>

      {/* General */}
      <div className="bg-surface-card rounded-xl border border-border p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">General</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary">Shop Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary">Welcome Message</label>
            <textarea
              value={welcomeMsg}
              onChange={(e) => setWelcomeMsg(e.target.value)}
              rows={3}
              className="mt-2 block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary">After-Hours Message</label>
            <textarea
              value={afterHoursMsg}
              onChange={(e) => setAfterHoursMsg(e.target.value)}
              rows={3}
              className="mt-2 block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-surface-card rounded-xl border border-border p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Business Hours</h2>
        <div className="space-y-3">
          {[
            { day: "Monday", open: "9:00", close: "20:00", enabled: true },
            { day: "Tuesday", open: "9:00", close: "20:00", enabled: true },
            { day: "Wednesday", open: "9:00", close: "20:00", enabled: true },
            { day: "Thursday", open: "9:00", close: "20:00", enabled: true },
            { day: "Friday", open: "9:00", close: "20:00", enabled: true },
            { day: "Saturday", open: "10:00", close: "18:00", enabled: true },
            { day: "Sunday", open: "", close: "", enabled: false },
          ].map((schedule) => (
            <div key={schedule.day} className="flex items-center gap-4">
              <span className="w-24 text-sm text-text-secondary">{schedule.day}</span>
              <input
                type="checkbox"
                defaultChecked={schedule.enabled}
                className="h-4 w-4 rounded border-border text-primary-500 focus:ring-primary-500"
              />
              {schedule.enabled ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    defaultValue={schedule.open}
                    className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <span className="text-sm text-text-muted">to</span>
                  <input
                    type="time"
                    defaultValue={schedule.close}
                    className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
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
          <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-500 text-white hover:bg-primary-600 transition-colors">
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
                <div className="flex items-center gap-1 ml-4">
                  <button className="p-1.5 rounded-lg text-text-muted hover:text-primary-500 hover:bg-surface transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  <button className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-surface transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <button className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary border border-border hover:bg-surface transition-colors">
          Cancel
        </button>
        <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
