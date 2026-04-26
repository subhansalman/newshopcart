import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <span className="text-[120px] font-black text-primary/10 leading-none select-none">404</span>
        <div className="absolute inset-0 flex items-center justify-center">
          <Search className="h-16 w-16 text-primary/40" />
        </div>
      </div>
      <h2 className="mb-2 text-2xl font-bold">Page Not Found</h2>
      <p className="mb-8 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] px-6 py-2.5 text-sm font-medium hover:bg-[var(--badge-bg)] transition-colors"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
