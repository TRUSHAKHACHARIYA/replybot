import Link from "next/link";

interface PricingCardProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta?: string;
  href?: string;
}

export default function PricingCard({ name, price, description, features, highlighted, cta = "Get Started", href = "/signup" }: PricingCardProps) {
  return (
    <div className={`relative flex flex-col rounded-2xl border p-8 ${
      highlighted
        ? "border-primary-500 bg-white shadow-lg shadow-primary-100 ring-1 ring-primary-500"
        : "border-border bg-white"
    }`}>
      {highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-primary-500 px-4 py-1 text-xs font-semibold text-white">
            Most Popular
          </span>
        </div>
      )}
      <h3 className="text-lg font-semibold text-text-primary">{name}</h3>
      <p className="mt-2 text-sm text-text-secondary">{description}</p>
      <div className="mt-6">
        <span className="text-4xl font-bold text-text-primary">${price}</span>
        <span className="text-sm text-text-secondary">/month</span>
      </div>
      <ul className="mt-8 space-y-3 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <svg className="h-5 w-5 shrink-0 text-accent-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className="text-sm text-text-secondary">{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`mt-8 block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-colors ${
          highlighted
            ? "bg-primary-500 text-white hover:bg-primary-600"
            : "bg-surface text-text-primary border border-border hover:bg-primary-50 hover:border-primary-200"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}
