import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="py-20 sm:py-28 bg-surface flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              Start with a free 7-day trial on any plan. No credit card required.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="Starter"
              price={15}
              description="Perfect for shops just getting started with WhatsApp."
              features={[
                "WhatsApp only",
                "FAQ auto-replies",
                "Up to 300 messages/month",
                "Business hours setup",
                "Email support",
                "Basic analytics",
              ]}
            />
            <PricingCard
              name="Standard"
              price={25}
              description="For shops active on both WhatsApp and Instagram."
              features={[
                "WhatsApp + Instagram",
                "FAQ + basic order-taking",
                "Up to 800 messages/month",
                "Lead forwarding to your phone",
                "Priority email support",
                "Conversation history",
                "Custom bot personality",
              ]}
              highlighted
            />
            <PricingCard
              name="Growth"
              price={40}
              description="For growing shops that need more control and volume."
              features={[
                "Both platforms",
                "Unlimited FAQ topics",
                "Higher message volume",
                "Custom bot personality",
                "Priority setup changes",
                "Dedicated account manager",
                "Monthly performance report",
                "Abandoned inquiry follow-up",
              ]}
            />
          </div>

          {/* Comparison table */}
          <div className="mt-20 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-text-primary text-center mb-8">Feature Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold text-text-primary">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold text-text-primary">Starter</th>
                    <th className="text-center py-4 px-4 font-semibold text-primary-600">Standard</th>
                    <th className="text-center py-4 px-4 font-semibold text-text-primary">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "WhatsApp auto-replies", starter: true, standard: true, growth: true },
                    { feature: "Instagram auto-replies", starter: false, standard: true, growth: true },
                    { feature: "FAQ auto-replies", starter: "5 topics", standard: "15 topics", growth: "Unlimited" },
                    { feature: "Order/booking capture", starter: false, standard: true, growth: true },
                    { feature: "After-hours message", starter: true, standard: true, growth: true },
                    { feature: "Conversation history", starter: "7 days", standard: "30 days", growth: "90 days" },
                    { feature: "Custom bot personality", starter: false, standard: true, growth: true },
                    { feature: "Priority support", starter: false, standard: true, growth: true },
                    { feature: "Dedicated account manager", starter: false, standard: false, growth: true },
                    { feature: "Monthly performance report", starter: false, standard: false, growth: true },
                  ].map((row) => (
                    <tr key={row.feature} className="border-b border-border last:border-0">
                      <td className="py-4 px-4 text-text-secondary">{row.feature}</td>
                      {(["starter", "standard", "growth"] as const).map((plan) => (
                        <td key={plan} className="py-4 px-4 text-center">
                          {typeof row[plan] === "boolean" ? (
                            row[plan] ? (
                              <svg className="h-5 w-5 text-accent-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5 text-text-muted/40 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )
                          ) : (
                            <span className="text-text-secondary">{row[plan]}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-text-primary text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: "Can I switch plans later?",
                  a: "Yes, you can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.",
                },
                {
                  q: "Is there a free trial?",
                  a: "Yes! Every plan comes with a free 7-day trial. No credit card required to start.",
                },
                {
                  q: "What happens if I exceed my message limit?",
                  a: "We'll notify you when you're approaching your limit. You can upgrade your plan or pay a small overage fee of $0.02 per additional message.",
                },
                {
                  q: "Do you support other languages?",
                  a: "Currently we support English and Hindi. Multi-language support is on our roadmap for later this year.",
                },
                {
                  q: "How quickly can the bot be set up?",
                  a: "Most shops are live within 24 hours of signing up. We handle all the configuration for you.",
                },
              ].map((faq) => (
                <div key={faq.q} className="bg-surface-card rounded-xl border border-border p-6">
                  <h3 className="text-sm font-semibold text-text-primary">{faq.q}</h3>
                  <p className="mt-2 text-sm text-text-secondary">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
