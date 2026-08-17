import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-text-primary">ReplyBot</span>
            </div>
            <p className="text-sm text-text-secondary">
              AI-powered auto-replies for WhatsApp & Instagram. Built for small businesses.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/#features" className="text-sm text-text-secondary hover:text-primary-500 transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-sm text-text-secondary hover:text-primary-500 transition-colors">Pricing</Link></li>
              <li><Link href="/#how-it-works" className="text-sm text-text-secondary hover:text-primary-500 transition-colors">How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Support</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary-500 transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary-500 transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary-500 transition-colors">Status</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary-500 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-text-muted text-center">
            &copy; {new Date().getFullYear()} ReplyBot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
