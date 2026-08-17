import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";
import Link from "next/link";

const features = [
  {
    title: "Instant Auto-Replies",
    description: "Answer common questions about hours, pricing, stock, and delivery — automatically, 24/7.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: "WhatsApp & Instagram",
    description: "Works on both platforms your customers already use. No new apps to install.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
  {
    title: "Smart Handoff",
    description: "When a question is too complex, the bot seamlessly transfers to you — with full context.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    title: "Order & Booking Capture",
    description: "Take basic orders and booking requests via DM, then forward them straight to your phone.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    title: "After-Hours Coverage",
    description: "Send a professional \"we're closed\" message with an option to leave details for follow-up.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Zero Tech Skills Needed",
    description: "We set everything up for you. Just tell us your FAQs and business hours — done.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
];

const steps = [
  {
    step: "1",
    title: "Tell us about your shop",
    description: "Share your business hours, location, pricing, and common questions customers ask.",
  },
  {
    step: "2",
    title: "We build your bot",
    description: "We configure your auto-reply bot with your specific answers and brand voice.",
  },
  {
    step: "3",
    title: "Connect your accounts",
    description: "Link your WhatsApp Business and/or Instagram account — takes just a few minutes.",
  },
  {
    step: "4",
    title: "Start capturing customers",
    description: "Your bot goes live and starts answering messages instantly. You review and handle escalations.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Owner, Style Boutique",
    quote: "I used to lose 3-4 customers a day because I couldn't reply fast enough. Now ReplyBot handles the basics and I only jump in for the important stuff.",
  },
  {
    name: "Meera Joshi",
    role: "Owner, Glow Salon",
    quote: "My clients message me at 11 PM asking about appointment slots. The bot answers instantly and books them. My bookings went up 40%.",
  },
  {
    name: "Ankit Patel",
    role: "Owner, Fresh Bakes",
    quote: "I was skeptical at first, but the free trial convinced me. Customers love getting instant replies about today's menu and prices.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-600 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse" />
              Trusted by 50+ small shops
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-tight">
              Never miss a customer{" "}
              <span className="text-primary-500">message</span> again
            </h1>
            <p className="mt-6 text-lg text-text-secondary max-w-2xl mx-auto">
              AI-powered auto-replies for WhatsApp &amp; Instagram. Answer common questions instantly,
              capture orders, and grow your business — even when you&apos;re closed.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 transition-colors"
              >
                Start Free Trial
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-text-primary border border-border hover:bg-surface transition-colors"
              >
                See How It Works
              </Link>
            </div>
            <p className="mt-4 text-xs text-text-muted">Free 7-day trial. No credit card required.</p>
          </div>
        </div>
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary-100/40 blur-3xl" />
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-text-primary">24/7</p>
              <p className="mt-1 text-sm text-text-secondary">Coverage</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-text-primary">&lt;2s</p>
              <p className="mt-1 text-sm text-text-secondary">Response Time</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-text-primary">40%</p>
              <p className="mt-1 text-sm text-text-secondary">More Bookings</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-text-primary">$15</p>
              <p className="mt-1 text-sm text-text-secondary">Starting Price</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-28 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Everything your shop needs
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Stop losing customers to slow replies. Our AI handles the repetitive questions so you can focus on your business.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-surface-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-text-primary">{feature.title}</h3>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Up and running in 24 hours
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              No technical skills needed. We handle the setup — you just tell us about your business.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary-500 text-white flex items-center justify-center text-lg font-bold">
                  {step.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-text-primary">{step.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 sm:py-28 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Start with a free trial. Pay only for what you need.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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
              ]}
            />
            <PricingCard
              name="Standard"
              price={25}
              description="For shops active on both WhatsApp and Instagram."
              features={[
                "WhatsApp + Instagram",
                "FAQ + order-taking",
                "Up to 800 messages/month",
                "Lead forwarding to your phone",
                "Priority support",
              ]}
              highlighted
            />
            <PricingCard
              name="Growth"
              price={40}
              description="For growing shops that need more control and volume."
              features={[
                "Both platforms",
                "Priority setup changes",
                "Higher message volume",
                "Custom bot personality",
                "Dedicated account manager",
              ]}
            />
          </div>
          <div className="text-center mt-8">
            <Link href="/pricing" className="text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors">
              Compare all plans &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Loved by shop owners
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-surface rounded-xl border border-border p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed italic">&quot;{t.quote}&quot;</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-sm font-semibold text-primary-600">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to stop losing customers?
          </h2>
          <p className="mt-4 text-lg text-primary-100">
            Start your free 7-day trial today. No credit card required. Cancel anytime.
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="inline-flex items-center rounded-lg bg-white px-8 py-3 text-sm font-semibold text-primary-600 shadow-sm hover:bg-primary-50 transition-colors"
            >
              Start Free Trial
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
