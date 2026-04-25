import Link from "next/link";
import {
  ShoppingBag,
  Truck,
  Shield,
  Headphones,
  ArrowRight,
  Globe,
  MessageCircle,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] bg-[var(--sidebar-bg)] text-white">
      {/* Features bar */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <Truck className="h-5 w-5 text-primary-light" />
            </div>
            <div>
              <p className="text-sm font-semibold">Free Shipping</p>
              <p className="text-xs text-white/50">On orders over PKR 5,000</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <Shield className="h-5 w-5 text-primary-light" />
            </div>
            <div>
              <p className="text-sm font-semibold">Secure Payment</p>
              <p className="text-xs text-white/50">100% protected</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <ShoppingBag className="h-5 w-5 text-primary-light" />
            </div>
            <div>
              <p className="text-sm font-semibold">Easy Returns</p>
              <p className="text-xs text-white/50">30-day return policy</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <Headphones className="h-5 w-5 text-primary-light" />
            </div>
            <div>
              <p className="text-sm font-semibold">24/7 Support</p>
              <p className="text-xs text-white/50">Dedicated help center</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
                S
              </div>
              <span className="text-xl font-bold">
                Shop<span className="text-primary-light">Cart</span>
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Defining the future of digital commerce through curated aesthetics and intelligent design.
            </p>
            <div className="flex gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-colors">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-colors">
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-primary-light">Collections</h4>
            <ul className="space-y-2.5">
              {["The Minimalist", "Abstract Edge", "Sculptural", "Artwork"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/products?category=${encodeURIComponent(item)}`}
                    className="text-sm text-white/60 hover:text-primary-light transition-colors flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-primary-light">Information</h4>
            <ul className="space-y-2.5">
              {["Sustainability", "Privacy", "Returns", "Terms"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-white/60 hover:text-primary-light transition-colors flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-primary-light">Newsletter</h4>
            <p className="text-sm text-white/60 mb-4">Get updates on new curations and exclusive offers.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-sm placeholder:text-white/30 focus:border-primary focus:ring-0 outline-none"
              />
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium hover:bg-primary-dark transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-xs text-white/40">
            © 2024 ShopCart Atelier. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-xs text-white/40 hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-white/40 hover:text-white/60 transition-colors">Terms of Service</Link>
            <Link href="#" className="text-xs text-white/40 hover:text-white/60 transition-colors">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
