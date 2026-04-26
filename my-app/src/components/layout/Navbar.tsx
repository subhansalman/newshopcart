"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Package,
  ChevronDown,
  Search,
  Settings,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
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
    window.addEventListener("scroll", handleScroll);
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

  const navLinks = [
    { label: "Shop", href: "/" },
    { label: "Collections", href: "/products" },
    { label: "Categories", href: "/products?category=Artwork" },
    { label: "Journal", href: "/products?category=Sculptural" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-gray-200/80 bg-white/95 backdrop-blur-xl shadow-sm"
          : "border-b border-gray-200/50 bg-white/90 backdrop-blur-xl"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Atelier
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          {/* Search icon */}
          <button
            id="nav-search-btn"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <Search className="h-[18px] w-[18px] text-gray-500" />
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            id="nav-cart-btn"
            className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart className="h-[18px] w-[18px] text-gray-500" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Settings */}
          <button
            id="nav-settings-btn"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <Settings className="h-[18px] w-[18px] text-gray-500" />
          </button>

          {/* Profile / Auth */}
          {session ? (
            <div className="relative" ref={profileRef}>
              <button
                id="nav-profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full px-2 py-1.5 hover:bg-gray-100 transition-colors ml-1"
              >
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="h-7 w-7 rounded-full object-cover ring-2 ring-gray-100"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl animate-scale-in">
                  <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{session.user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                  </div>
                  {(session.user?.role === "SELLER" || session.user?.role === "ADMIN") && (
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4 text-gray-400" />
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href="/orders"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Package className="h-4 w-4 text-gray-400" />
                    My Orders
                  </Link>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
              id="nav-signin-btn"
              className="hidden sm:flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-all btn-glow ml-2"
            >
              <User className="h-4 w-4" />
              Sign In
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            id="nav-mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors md:hidden ml-1"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200/80 bg-white px-4 pb-4 pt-2 md:hidden animate-fade-in">
          <div className="flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!session && (
              <Link
                href="/auth/signin"
                className="mt-2 rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-dark transition-colors"
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
