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
  ArrowLeft,
  Lock,
  Smartphone,
  CheckCircle2,
  MapPin,
  Mail,
  Wallet
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
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="h-20 w-20 rounded-full bg-[var(--surface-dark)] border border-[var(--card-border)] flex items-center justify-center mb-6">
          <Wallet className="h-10 w-10 text-muted" />
        </div>
        <h1 className="text-3xl font-bold mb-3 text-white">Your Atelier is Empty</h1>
        <p className="text-muted mb-8 max-w-sm leading-relaxed">Add some of our curated pieces to your selection before checking out.</p>
        <Link
          href="/products"
          className="rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
        >
          Explore Collections
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
      toast.success("Order confirmed!");
      router.push("/dashboard/orders");
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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft className="h-3 w-3" />
          WALLET CHECKOUT
        </Link>

        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-white">Complete Your Order</h1>
          <p className="text-muted text-sm max-w-xl leading-relaxed">
            Review your curated selection and provide shipping details to finalize your experience.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left side - Forms */}
            <div className="lg:col-span-2 space-y-10">
              {/* Shipping Information */}
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-sm font-black shadow-lg shadow-primary/20">
                    1
                  </div>
                  <h2 className="text-xl font-bold text-white">Shipping Information</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      placeholder="Elena"
                      className={`w-full rounded-xl border ${errors.firstName ? "border-danger" : "border-[var(--card-border)]"} bg-[var(--surface-dark)] px-4 py-3.5 text-sm text-white focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-muted/40`}
                    />
                    {errors.firstName && <p className="text-[10px] font-bold text-danger mt-2 uppercase tracking-wide">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      placeholder="Rodriguez"
                      className={`w-full rounded-xl border ${errors.lastName ? "border-danger" : "border-[var(--card-border)]"} bg-[var(--surface-dark)] px-4 py-3.5 text-sm text-white focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-muted/40`}
                    />
                    {errors.lastName && <p className="text-[10px] font-bold text-danger mt-2 uppercase tracking-wide">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
                    Delivery Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="1242 Order Way, Creative District"
                      className={`w-full rounded-xl border ${errors.address ? "border-danger" : "border-[var(--card-border)]"} bg-[var(--surface-dark)] px-4 py-3.5 pl-11 text-sm text-white focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-muted/40`}
                    />
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/60" />
                  </div>
                  {errors.address && <p className="text-[10px] font-bold text-danger mt-2 uppercase tracking-wide">{errors.address}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="New York"
                      className={`w-full rounded-xl border ${errors.city ? "border-danger" : "border-[var(--card-border)]"} bg-[var(--surface-dark)] px-4 py-3.5 text-sm text-white focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-muted/40`}
                    />
                    {errors.city && <p className="text-[10px] font-bold text-danger mt-2 uppercase tracking-wide">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={form.postalCode}
                      onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                      placeholder="10001"
                      className={`w-full rounded-xl border ${errors.postalCode ? "border-danger" : "border-[var(--card-border)]"} bg-[var(--surface-dark)] px-4 py-3.5 text-sm text-white focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-muted/40`}
                    />
                    {errors.postalCode && <p className="text-[10px] font-bold text-danger mt-2 uppercase tracking-wide">{errors.postalCode}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-sm font-black shadow-lg shadow-primary/20">
                    2
                  </div>
                  <h2 className="text-xl font-bold text-white">Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { id: "apple", label: "Apple Pay", icon: Smartphone },
                    { id: "paypal", label: "PayPal", icon: Wallet },
                    { id: "card", label: "Credit Card", icon: CreditCard },
                  ].map((method) => {
                    const isActive = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`flex items-center sm:flex-col justify-start sm:justify-center gap-4 sm:gap-2 rounded-2xl border-2 p-6 transition-all ${
                          isActive
                            ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                            : "border-[var(--card-border)] bg-[var(--surface-dark)] hover:border-primary/50"
                        }`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isActive ? 'bg-primary text-white' : 'bg-white/5 text-muted'}`}>
                           <method.icon className="h-5 w-5" />
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-muted'}`}>{method.label}</span>
                        {isActive && <CheckCircle2 className="h-4 w-4 text-primary ml-auto sm:hidden" />}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
                    Email for Receipt
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="elena.r@curator.com"
                      className={`w-full rounded-xl border ${errors.email ? "border-danger" : "border-[var(--card-border)]"} bg-[var(--surface-dark)] px-4 py-3.5 pl-11 text-sm text-white focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-muted/40`}
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/60" />
                  </div>
                  {errors.email && <p className="text-[10px] font-bold text-danger mt-2 uppercase tracking-wide">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 shadow-2xl shadow-black/20">
                <h2 className="text-xl font-bold mb-8 text-white">Order Summary</h2>

                <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[var(--surface-dark)] border border-[var(--card-border)]">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate mb-1">{item.title}</p>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Qty: {item.qty}</p>
                        <p className="text-[15px] font-black text-primary">
                          {formatCurrency(item.price * item.qty)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-t border-[var(--card-border)] pt-8 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted">Subtotal</span>
                    <span className="font-bold text-white/90">{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted">Shipping</span>
                    <span className="text-xs font-black text-success uppercase tracking-wider bg-success/10 px-2 py-1 rounded-sm">Complimentary</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted">Tax (5%)</span>
                    <span className="font-bold text-white/90">{formatCurrency(cartTotal * 0.05)}</span>
                  </div>
                  <div className="flex justify-between items-end pt-6 border-t border-[var(--card-border)]">
                    <span className="text-xs font-black uppercase tracking-widest text-white/40">Total Amount</span>
                    <span className="text-3xl font-black text-primary leading-none">{formatCurrency(cartTotal * 1.05)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-5 text-sm font-black uppercase tracking-widest text-white hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 group disabled:opacity-50"
                >
                  <Lock className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  {loading ? "Confirming..." : "Confirm Order"}
                </button>
                
                <p className="text-[10px] text-center text-muted/60 mt-6 font-medium">
                  Secure encrypted checkout protocol active.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
