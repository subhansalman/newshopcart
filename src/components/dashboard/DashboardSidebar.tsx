"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Settings, BarChart3, Star, HelpCircle, Sparkles, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  userName: string;
  userImage?: string | null;
  userRole?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

const SELLER_NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { label: "Favorites", href: "/dashboard/favorites", icon: Star },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Support", href: "/dashboard/support", icon: HelpCircle },
];

export default function DashboardSidebar({ userName, userImage, userRole, isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const isAdmin = userRole === "ADMIN";
  const navItems = isAdmin ? ADMIN_NAV_ITEMS : SELLER_NAV_ITEMS;

  return (
    <>
      {/* Mobile Overlay */}
      <button
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-label="Close sidebar"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/[0.06] bg-[#08080E] text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:w-[260px]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="px-6 pt-8 pb-6">
          <Link href="/" className="flex flex-col mb-1 group" onClick={onClose}>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                {isAdmin ? "Admin Portal" : "Digital Atelier"}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1 ml-[42px]">
              {isAdmin ? "management suite" : "seller studio"}
            </span>
          </Link>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-4" />

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "sidebar-link flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  isActive
                    ? "active bg-gradient-to-r from-primary/15 to-primary/5 text-white border border-primary/20"
                    : "text-white/40 hover:bg-white/[0.04] hover:text-white/80"
                )}
              >
                <item.icon className={cn("h-[18px] w-[18px]", isActive ? "text-primary" : "")} />
                {item.label}
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-sm shadow-primary/50" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-5">
          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-5" />
          
          <div className="flex items-center gap-3 mb-5">
            {userImage ? (
              <div className="relative h-10 w-10 rounded-xl overflow-hidden ring-2 ring-white/10">
                <Image 
                  src={userImage} 
                  alt={userName} 
                  fill 
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-primary-light/20 text-primary-light font-bold text-sm ring-2 ring-white/5">
                {userName[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white/90">{isAdmin ? "Admin Profile" : userName}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wider">{isAdmin ? "curator lead" : "premium member"}</p>
            </div>
          </div>

          {isAdmin ? (
            <Link
              href="/products/create"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark w-full py-3 text-sm font-semibold text-white transition-all btn-premium shadow-lg shadow-primary/20"
            >
              <Plus className="h-4 w-4" />
              New Product
            </Link>
          ) : (
            <button className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark w-full py-3 text-sm font-semibold text-white transition-all btn-premium shadow-lg shadow-primary/20">
              <Sparkles className="h-4 w-4" />
              Upgrade to Pro
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
