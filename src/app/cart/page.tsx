"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore, CartItem } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import Footer from "@/components/layout/Footer";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const clearCart = useCartStore((s) => s.clearCart);
  const total = useCartStore((s) => s.total);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-8 w-32 skeleton rounded mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 skeleton rounded-xl" />
            ))}
          </div>
          <div className="h-64 skeleton rounded-xl" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--badge-bg)]">
            <ShoppingCart className="h-12 w-12 text-muted" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-muted max-w-sm mb-8">
            Looks like you haven&apos;t added anything to your cart yet. Start browsing our collection!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            Start Shopping
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const cartTotal = total();

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted">
              {items.length} {items.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-danger hover:underline"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item: CartItem) => (
              <div
                key={item.productId}
                className="flex gap-4 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 animate-fade-in"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[var(--surface)]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/products/${item.productId}`}
                      className="text-sm font-semibold hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm text-primary font-bold mt-1">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center rounded-lg border border-[var(--card-border)]">
                      <button
                        onClick={() =>
                          item.qty > 1
                            ? updateQty(item.productId, item.qty - 1)
                            : removeItem(item.productId)
                        }
                        className="flex h-8 w-8 items-center justify-center hover:bg-[var(--badge-bg)] transition-colors rounded-l-lg"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="flex h-8 w-8 items-center justify-center text-xs font-semibold border-x border-[var(--card-border)]">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.productId, item.qty + 1)}
                        className="flex h-8 w-8 items-center justify-center hover:bg-[var(--badge-bg)] transition-colors rounded-r-lg"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold">
                        {formatCurrency(item.price * item.qty)}
                      </p>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-danger hover:bg-danger/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
              <h2 className="text-lg font-bold mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-medium">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Shipping</span>
                  <span className="font-medium text-success">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Tax</span>
                  <span className="font-medium">{formatCurrency(cartTotal * 0.05)}</span>
                </div>
                <div className="border-t border-[var(--card-border)] pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(cartTotal * 1.05)}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                href="/checkout"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors btn-glow shadow-lg shadow-primary/20"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products"
                className="flex w-full items-center justify-center gap-2 mt-3 rounded-xl border border-[var(--card-border)] py-3 text-sm font-medium hover:bg-[var(--badge-bg)] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
