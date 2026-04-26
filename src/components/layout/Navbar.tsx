"use client";

import Link from "next/link";
import Image from "next/image";
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
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const itemCount = useCartStore((s) => s.itemCount);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-[var(--nav-border)] bg-[var(--nav-bg)] backdrop-blur-xl shadow-sm"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white font-bold text-sm transition-all group-hover:shadow-lg group-hover:shadow-primary/25 group-hover:scale-105">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Shop<span className="text-primary">Cart</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: "/", label: "Discover" },
            { href: "/products", label: "Atelier" },
            { href: "/products?category=Collections", label: "Collections" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-sm font-medium text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="hidden lg:flex items-center bg-[var(--surface-dark)] rounded-full px-4 py-2 border border-[var(--card-border)] mr-1 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all group">
            <Search className="h-4 w-4 text-[var(--muted)] group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search curated pieces..."
              className="bg-transparent border-none outline-none text-sm ml-2.5 w-48 text-[var(--foreground)] focus:ring-0 placeholder:text-[var(--muted)]/50"
            />
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-[var(--surface-dark)] transition-all hover:scale-105"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl hover:bg-[var(--surface-dark)] transition-all hover:scale-105"
          >
            <ShoppingCart className="h-[18px] w-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-[10px] font-bold text-white shadow-md shadow-primary/30 animate-scale-in">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Profile / Auth */}
          {session ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-[var(--surface-dark)] transition-all"
              >
                {session.user?.image ? (
                  <div className="relative h-7 w-7 rounded-full overflow-hidden ring-2 ring-primary/20">
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-xs font-bold">
                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <ChevronDown className={`h-3 w-3 text-[var(--foreground)]/40 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-xl p-2 shadow-2xl animate-scale-in">
                  <div className="px-3 py-3 border-b border-[var(--card-border)] mb-1">
                    <p className="text-sm font-semibold truncate">{session.user?.name}</p>
                    <p className="text-xs text-muted truncate mt-0.5">{session.user?.email}</p>
                  </div>
                  {session.user?.role === "SELLER" && (
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-[var(--surface-dark)] transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4 text-primary" />
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href="/orders"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-[var(--surface-dark)] transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Package className="h-4 w-4 text-primary" />
                    My Orders
                  </Link>
                  <div className="border-t border-[var(--card-border)] mt-1 pt-1">
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="hidden sm:flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-5 py-2.5 text-sm font-medium text-white hover:shadow-lg hover:shadow-primary/25 transition-all btn-premium"
            >
              <User className="h-4 w-4" />
              Sign In
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-[var(--surface-dark)] transition-all md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-xl px-4 pb-4 pt-3 md:hidden animate-fade-in">
          <div className="flex flex-col gap-1">
            {[
              { href: "/", label: "Discover" },
              { href: "/products", label: "Atelier" },
              { href: "/products?category=Collections", label: "Collections" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-[var(--surface-dark)] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!session && (
              <Link
                href="/auth/signin"
                className="mt-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-3 text-center text-sm font-medium text-white"
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
