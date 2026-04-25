import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0F0E17] text-white">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold">
                Shop<span className="text-primary-light">Cart</span> Atelier
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed">
              Defining the future of digital commerce through curated aesthetics and intelligent design.
            </p>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-5 text-primary-light">Support</h4>
            <ul className="space-y-3">
              {["Shipping", "Returns", "FAQ"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-white/50 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-5 text-primary-light">Legal</h4>
            <ul className="space-y-3">
              {["Privacy", "Terms", "Sustainability"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-white/50 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-5 text-primary-light">Newsletter</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-lg bg-white/10 border border-white/10 px-3 py-2.5 text-sm placeholder:text-white/30 focus:border-primary focus:ring-0 outline-none text-white"
              />
              <button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium hover:bg-primary-dark transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-5 sm:px-6 lg:px-8">
          <p className="text-xs text-white/30">
            © 2024 SHOPCART ATELIER. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">Terms of Service</Link>
            <Link href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">Shipping</Link>
            <Link href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">Returns</Link>
            <Link href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">Sustainability</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
