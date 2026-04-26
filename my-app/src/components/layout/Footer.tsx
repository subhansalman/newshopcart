import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0F0E17] text-white">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-5">
              <span className="text-xl font-bold">
                Atelier
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Defining the future of digital commerce through curated aesthetics and intelligent design.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { label: "Twitter", icon: "𝕏" },
                { label: "Instagram", icon: "📷" },
                { label: "LinkedIn", icon: "in" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white/40 text-sm hover:bg-white/10 hover:text-white/80 transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-5 text-white/60">Shop</h4>
            <ul className="space-y-3">
              {[
                { label: "All Products", href: "/products" },
                { label: "New Arrivals", href: "/products" },
                { label: "Best Sellers", href: "/products" },
                { label: "Categories", href: "/products" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-white/40 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-5 text-white/60">Support</h4>
            <ul className="space-y-3">
              {["Shipping", "Returns", "FAQ", "Contact Us"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-5 text-white/60">Stay Updated</h4>
            <p className="text-sm text-white/40 mb-4 leading-relaxed">
              Get the latest drops and exclusive offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm placeholder:text-white/25 focus:border-primary/50 focus:ring-0 outline-none text-white transition-colors"
              />
              <button className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium hover:bg-primary-dark transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-5 sm:px-6 lg:px-8">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} ATELIER. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Shipping", "Returns"].map((item) => (
              <Link key={item} href="#" className="text-xs text-white/25 hover:text-white/50 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
