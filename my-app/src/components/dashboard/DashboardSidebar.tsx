"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Settings, BarChart3, Star, HelpCircle } from "lucide-react";

interface DashboardSidebarProps {
  userName: string;
  userImage?: string | null;
  userRole?: string;
}

const ADMIN_NAV_ITEMS = [
  { label: "DASHBOARD", href: "/dashboard", icon: LayoutDashboard },
  { label: "ORDERS", href: "/dashboard/orders", icon: ShoppingCart },
  { label: "PRODUCTS", href: "/dashboard/products", icon: Package },
  { label: "ANALYTICS", href: "/dashboard/analytics", icon: BarChart3 },
];

const SELLER_NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { label: "Favorites", href: "/dashboard/favorites", icon: Star },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Reports", href: "/dashboard/support", icon: BarChart3 },
];

export default function DashboardSidebar({ userName, userImage, userRole }: DashboardSidebarProps) {
  const pathname = usePathname();
  const isAdmin = userRole === "ADMIN";
  const navItems = isAdmin ? ADMIN_NAV_ITEMS : SELLER_NAV_ITEMS;

  // Admin sidebar: Dark theme
  if (isAdmin) {
    return (
      <aside className="hidden lg:flex w-[240px] flex-col border-r border-gray-800 bg-[#0F0E17] text-white">
        <div className="p-6">
          <Link href="/" className="flex flex-col mb-1">
            <span className="text-lg font-bold text-white">Admin Portal</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40 mt-1">MANAGEMENT SUITE</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
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

        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            {userImage ? (
              <img src={userImage} alt={userName} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary-light font-bold text-sm">
                {userName[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User Profile</p>
              <p className="text-[10px] text-white/40">Curator Lead</p>
            </div>
          </div>
          <Link href="/products/create"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary w-full py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors">
            NEW PRODUCT
          </Link>
        </div>
      </aside>
    );
  }

  // Seller sidebar: Light theme
  return (
    <aside className="hidden lg:flex w-[240px] flex-col border-r border-gray-200 bg-white">
      <div className="p-6">
        <Link href="/" className="flex flex-col mb-1">
          <span className="text-lg font-bold text-gray-900">Digital Atelier</span>
          <span className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">SELLER STUDIO</span>
        </Link>
      </div>

      {/* User card */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
          {userImage ? (
            <img src={userImage} alt={userName} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
              {userName[0]?.toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">PREMIUM MEMBER</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <button className="flex items-center justify-center gap-2 rounded-xl bg-primary w-full py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors uppercase tracking-wider">
          Upgrade to Pro
        </button>
      </div>
    </aside>
  );
}
