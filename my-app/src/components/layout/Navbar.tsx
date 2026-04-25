"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  Package,
  ChevronDown,
  Search,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const itemCount = useCartStore((s) => s.itemCount);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cartCount = mounted ? itemCount() : 0;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--nav-border)] bg-[var(--nav-bg)]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm transition-transform group-hover:scale-110">
            S
          </div>
          <span className="text-xl font-bold tracking-tight">
            Shop<span className="text-primary">Cart</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--foreground)]/70 hover:text-primary transition-colors"
          >
            Discover
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-[var(--foreground)]/70 hover:text-primary transition-colors"
          >
            Atelier
          </Link>
          <Link
            href="/products?category=Collections"
            className="text-sm font-medium text-[var(--foreground)]/70 hover:text-primary transition-colors"
          >
            Collections
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="hidden lg:flex items-center bg-[var(--input-bg)] rounded-full px-4 py-1.5 border border-[var(--input-border)] mr-2">
            <Search className="h-4 w-4 text-[var(--muted)]" />
            <input 
              type="text" 
              placeholder="Search curated pieces..." 
              className="bg-transparent border-none outline-none text-sm ml-2 w-48 text-[var(--foreground)] focus:ring-0"
            />
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[var(--badge-bg)] transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-[var(--badge-bg)] transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Profile / Auth */}
          {session ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full px-2 py-1.5 hover:bg-[var(--badge-bg)] transition-colors"
              >
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <ChevronDown className="h-3 w-3 text-[var(--foreground)]/50" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-2 shadow-xl animate-fade-in">
                  <div className="px-3 py-2 border-b border-[var(--card-border)] mb-1">
                    <p className="text-sm font-semibold truncate">{session.user?.name}</p>
                    <p className="text-xs text-muted truncate">{session.user?.email}</p>
                  </div>
                  {session.user?.role === "SELLER" && (
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[var(--badge-bg)] transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href="/orders"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[var(--badge-bg)] transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Package className="h-4 w-4" />
                    My Orders
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger hover:bg-danger/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="hidden sm:flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors btn-glow"
            >
              <User className="h-4 w-4" />
              Sign In
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[var(--badge-bg)] transition-colors md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[var(--nav-border)] bg-[var(--nav-bg)] px-4 pb-4 pt-2 md:hidden animate-fade-in">
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-[var(--badge-bg)] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Discover
            </Link>
            <Link
              href="/products"
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-[var(--badge-bg)] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Atelier
            </Link>
            <Link
              href="/products?category=Collections"
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-[var(--badge-bg)] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Collections
            </Link>
            {!session && (
              <Link
                href="/auth/signin"
                className="mt-2 rounded-full bg-primary px-4 py-2.5 text-center text-sm font-medium text-white"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
