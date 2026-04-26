import Link from "next/link";
import {
  ShoppingBag, Truck, Shield, Headphones, ArrowRight,
  Globe, MessageCircle, Sparkles,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#08080E] text-white">
      {/* Features bar */}
      <div className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6 px-4 py-10 sm:px-6 lg:px-8">
          {[
            { icon: Truck, title: "Free Shipping", sub: "On orders over PKR 5,000" },
            { icon: Shield, title: "Secure Payment", sub: "100% protected" },
            { icon: ShoppingBag, title: "Easy Returns", sub: "30-day return policy" },
            { icon: Headphones, title: "24/7 Support", sub: "Dedicated help center" },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-4 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                <f.icon className="h-5 w-5 text-primary-light" />
              </div>
              <div>
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="text-xs text-white/40">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">
                Shop<span className="text-primary-light">Cart</span>
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed mb-5">
              Defining the future of digital commerce through curated aesthetics and intelligent design.
            </p>
            <div className="flex gap-3">
              {[MessageCircle, Globe].map((Icon, i) => (
                <a key={i} href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] hover:bg-primary/20 border border-white/[0.06] hover:border-primary/20 transition-all">
                  <Icon className="h-4 w-4 text-white/60" />
                </a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-5 text-primary-light">Collections</h4>
            <ul className="space-y-3">
              {["The Minimalist", "Abstract Edge", "Sculptural", "Artwork"].map((item) => (
                <li key={item}>
                  <Link href={`/products?category=${encodeURIComponent(item)}`} className="text-sm text-white/40 hover:text-primary-light transition-colors flex items-center gap-1 group">
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-5 text-primary-light">Information</h4>
            <ul className="space-y-3">
              {["Sustainability", "Privacy", "Returns", "Terms"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-white/40 hover:text-primary-light transition-colors flex items-center gap-1 group">
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-5 text-primary-light">Newsletter</h4>
            <p className="text-sm text-white/40 mb-5">Get updates on new curations and exclusive offers.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 py-2.5 text-sm placeholder:text-white/25 focus:border-primary focus:ring-0 outline-none transition-all"
              />
              <button className="rounded-xl bg-gradient-to-r from-primary to-primary-dark px-5 py-2.5 text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-5 sm:px-6 lg:px-8">
          <p className="text-xs text-white/30">
            © 2024 ShopCart Atelier. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Shipping", "Sustainability"].map((link) => (
              <Link key={link} href="#" className="text-xs text-white/30 hover:text-white/50 transition-colors">{link}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
