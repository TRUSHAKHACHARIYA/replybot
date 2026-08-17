import StatsCard from "@/components/StatsCard";
import ChatMessage from "@/components/ChatMessage";

const recentMessages = [
  { sender: "customer" as const, name: "Anita", message: "Is the blue kurta available in size M?", time: "2 min ago" },
  { sender: "bot" as const, message: "Yes! The blue kurta is available in M and L. Would you like me to share photos?", time: "2 min ago" },
  { sender: "customer" as const, name: "Anita", message: "Yes please share photos", time: "1 min ago" },
  { sender: "bot" as const, message: "Here you go! The blue kurta (Size M) is priced at $25. Would you like to place an order?", time: "1 min ago" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">Welcome back! Here&apos;s how your bot is performing.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Messages Today"
          value={47}
          change="+12% from yesterday"
          changeType="positive"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          }
        />
        <StatsCard
          title="Auto-Replied"
          value={38}
          change="81% of total messages"
          changeType="positive"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          }
        />
        <StatsCard
          title="Leads Captured"
          value={5}
          change="+2 this week"
          changeType="positive"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          }
        />
        <StatsCard
          title="Handed to You"
          value={9}
          change="Complex questions"
          changeType="neutral"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <div className="lg:col-span-2 bg-surface-card rounded-xl border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text-primary">Recent Conversations</h2>
          </div>
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {recentMessages.map((msg, i) => (
              <ChatMessage key={i} {...msg} />
            ))}
          </div>
          <div className="px-6 py-3 border-t border-border">
            <a href="/dashboard/conversations" className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors">
              View all conversations &rarr;
            </a>
          </div>
        </div>

        {/* Quick info */}
        <div className="space-y-6">
          <div className="bg-surface-card rounded-xl border border-border p-6">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Bot Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Status</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Platform</span>
                <span className="text-sm font-medium text-text-primary">WhatsApp</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Plan</span>
                <span className="text-sm font-medium text-primary-600">Starter</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Messages Used</span>
                <span className="text-sm font-medium text-text-primary">47 / 300</span>
              </div>
              <div className="w-full bg-surface rounded-full h-2 mt-1">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: "16%" }} />
              </div>
            </div>
          </div>

          <div className="bg-surface-card rounded-xl border border-border p-6">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Business Hours</h2>
            <div className="space-y-2">
              {[
                { day: "Mon - Fri", hours: "9:00 AM - 8:00 PM" },
                { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
                { day: "Sunday", hours: "Closed" },
              ].map((schedule) => (
                <div key={schedule.day} className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">{schedule.day}</span>
                  <span className="text-sm font-medium text-text-primary">{schedule.hours}</span>
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
