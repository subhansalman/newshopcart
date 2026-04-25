"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Plus, Settings, BarChart3, Crown } from "lucide-react";

interface DashboardSidebarProps {
  userName: string;
  userImage?: string | null;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

export default function DashboardSidebar({ userName, userImage }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-[var(--card-border)] bg-[var(--sidebar-bg)] text-white">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-1">
          <span className="text-lg font-bold">
            Shop<span className="text-primary-light">Cart</span>
          </span>
        </Link>
        <p className="text-[10px] uppercase tracking-widest text-white/40">Management Suite</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary-light font-bold text-sm">
            {userName[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-[10px] text-white/40">Premium Seller</p>
          </div>
        </div>
        <Link href="/products/create"
          className="flex items-center justify-center gap-2 rounded-xl bg-primary w-full py-2.5 text-sm font-medium hover:bg-primary-dark transition-colors">
          <Plus className="h-4 w-4" />
          New Product
        </Link>
      </div>
    </aside>
  );
}
