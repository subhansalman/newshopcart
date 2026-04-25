"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";
import { createOrder } from "./actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  MapPin,
  ArrowLeft,
  Lock,
  Smartphone,
  Banknote,
} from "lucide-react";
import toast from "react-hot-toast";
import Footer from "@/components/layout/Footer";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const clearCart = useCartStore((s) => s.clearCart);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"apple" | "paypal" | "card">("card");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    email: session?.user?.email || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    if (!session) {
      router.push("/auth/signin?callbackUrl=/checkout");
    }
  }, [session, router]);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold mb-2">No items in cart</h1>
        <p className="text-muted mb-6">Add some products before checking out.</p>
        <Link
          href="/products"
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (form.firstName.length < 2) newErrors.firstName = "First name is required";
    if (form.lastName.length < 2) newErrors.lastName = "Last name is required";
    if (form.address.length < 5) newErrors.address = "Address is required";
    if (form.city.length < 2) newErrors.city = "City is required";
    if (form.postalCode.length < 4) newErrors.postalCode = "Postal code is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Valid email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const address = `${form.firstName} ${form.lastName}, ${form.address}, ${form.city}, ${form.postalCode}`;
      await createOrder(
        items.map((i) => ({
          productId: i.productId,
          qty: i.qty,
          price: i.price,
        })),
        address
      );
      clearCart();
      toast.success("Order placed successfully!");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to place order";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = total();

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          WALLET CHECKOUT
        </Link>

        <h1 className="text-3xl font-bold mb-2">Complete Your Order</h1>
        <p className="text-muted mb-8">
          Review your curated selection and provide shipping details to finalize your experience.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left side - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                    1
                  </div>
                  <h2 className="text-lg font-bold">Shipping Information</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      placeholder="John"
                      className={`w-full rounded-lg border ${errors.firstName ? "border-danger" : "border-[var(--input-border)]"} bg-[var(--input-bg)] px-4 py-3 text-sm`}
                    />
                    {errors.firstName && <p className="text-xs text-danger mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      placeholder="Doe"
                      className={`w-full rounded-lg border ${errors.lastName ? "border-danger" : "border-[var(--input-border)]"} bg-[var(--input-bg)] px-4 py-3 text-sm`}
                    />
                    {errors.lastName && <p className="text-xs text-danger mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="1242 Order Way, Creative District"
                    className={`w-full rounded-lg border ${errors.address ? "border-danger" : "border-[var(--input-border)]"} bg-[var(--input-bg)] px-4 py-3 text-sm`}
                  />
                  {errors.address && <p className="text-xs text-danger mt-1">{errors.address}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="Karachi"
                      className={`w-full rounded-lg border ${errors.city ? "border-danger" : "border-[var(--input-border)]"} bg-[var(--input-bg)] px-4 py-3 text-sm`}
                    />
                    {errors.city && <p className="text-xs text-danger mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={form.postalCode}
                      onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                      placeholder="75100"
                      className={`w-full rounded-lg border ${errors.postalCode ? "border-danger" : "border-[var(--input-border)]"} bg-[var(--input-bg)] px-4 py-3 text-sm`}
                    />
                    {errors.postalCode && <p className="text-xs text-danger mt-1">{errors.postalCode}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                    2
                  </div>
                  <h2 className="text-lg font-bold">Payment Method</h2>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("apple")}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                      paymentMethod === "apple"
                        ? "border-primary bg-primary/5"
                        : "border-[var(--card-border)] hover:border-primary/50"
                    }`}
                  >
                    <Smartphone className="h-6 w-6" />
                    <span className="text-xs font-medium">Apple Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                      paymentMethod === "paypal"
                        ? "border-primary bg-primary/5"
                        : "border-[var(--card-border)] hover:border-primary/50"
                    }`}
                  >
                    <Banknote className="h-6 w-6" />
                    <span className="text-xs font-medium">PayPal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                      paymentMethod === "card"
                        ? "border-primary bg-primary/5"
                        : "border-[var(--card-border)] hover:border-primary/50"
                    }`}
                  >
                    <CreditCard className="h-6 w-6" />
                    <span className="text-xs font-medium">Card</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Email for Receipt
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@example.com"
                      className={`w-full rounded-lg border ${errors.email ? "border-danger" : "border-[var(--input-border)]"} bg-[var(--input-bg)] px-4 py-3 text-sm pl-9`}
                    />
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  </div>
                  {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
                <h2 className="text-lg font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--surface)]">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className="text-xs text-muted">Qty: {item.qty}</p>
                        <p className="text-sm font-bold text-primary">
                          {formatCurrency(item.price * item.qty)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t border-[var(--card-border)] pt-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span>{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Tax (5%)</span>
                    <span>{formatCurrency(cartTotal * 0.05)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-[var(--card-border)]">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(cartTotal * 1.05)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors btn-glow disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  <Lock className="h-4 w-4" />
                  {loading ? "Processing..." : "Confirm Order"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
